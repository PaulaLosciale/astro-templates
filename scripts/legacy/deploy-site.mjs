import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const recipePath = process.argv[2] ?? "recipes/example-site.recipe.json";
const recipe = JSON.parse(await readFile(recipePath, "utf8"));
const slug = slugify(recipe.projectName);
const siteDir = path.join("generated-sites", slug);
const branch = recipe.deployment.branch ?? "main";

await access(siteDir);
validateAutomationInputs(recipe);

const repo = `${recipe.deployment.githubOwner}/${recipe.deployment.githubRepo}`;
const githubUrl = await ensureGithubRepo(recipe);

run("git", ["init"], siteDir);
run("git", ["checkout", "-B", branch], siteDir);
run("git", ["add", "."], siteDir);
run("git", ["commit", "-m", "Initial generated Astro site"], siteDir, true);
ensureRemote(siteDir, githubUrl);
run("git", ["push", "-u", "origin", branch], siteDir);

if (process.env.DOKPLOY_API_TOKEN) {
  await ensureDokployApplication(recipe);
} else {
  console.log("Falta DOKPLOY_API_TOKEN. El repo esta subido; configura Dokploy manualmente o vuelve a ejecutar con token.");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateAutomationInputs(recipe) {
  const missing = [];
  if (!recipe.deployment.githubOwner) missing.push("deployment.githubOwner");
  if (!recipe.deployment.githubRepo) missing.push("deployment.githubRepo");
  if (!recipe.domain) missing.push("domain");
  if (missing.length) throw new Error(`Faltan campos en la receta: ${missing.join(", ")}`);
}

async function ensureGithubRepo(recipe) {
  const owner = recipe.deployment.githubOwner;
  const name = recipe.deployment.githubRepo;
  const isPrivate = recipe.deployment.githubVisibility !== "public";

  if (process.env.GITHUB_TOKEN) {
    const user = await github("/user", { method: "GET" });
    const endpoint = owner === user.login ? "/user/repos" : `/orgs/${owner}/repos`;
    const created = await github(endpoint, {
      method: "POST",
      body: {
        name,
        private: isPrivate,
        description: `Generated Astro site for ${recipe.domain}`,
        homepage: recipe.env?.PUBLIC_SITE_URL,
        auto_init: false,
      },
      allowConflict: true,
    });

    if (created?.html_url) console.log(`Repo GitHub listo: ${created.html_url}`);
    return `https://${process.env.GITHUB_TOKEN}@github.com/${owner}/${name}.git`;
  }

  if (commandExists("gh")) {
    run("gh", ["repo", "create", `${owner}/${name}`, isPrivate ? "--private" : "--public", "--source", ".", "--remote", "origin"], siteDir, true);
    return `https://github.com/${owner}/${name}.git`;
  }

  throw new Error("Necesito GITHUB_TOKEN o GitHub CLI autenticado para crear/subir el repo automaticamente.");
}

function ensureRemote(cwd, url) {
  const existing = spawnSync("git", ["remote", "get-url", "origin"], { cwd, encoding: "utf8" });
  if (existing.status === 0) {
    run("git", ["remote", "set-url", "origin", url], cwd);
  } else {
    run("git", ["remote", "add", "origin", url], cwd);
  }
}

async function ensureDokployApplication(recipe) {
  const deployment = recipe.deployment;
  let applicationId = deployment.dokployApplicationId;

  if (!applicationId) {
    if (!deployment.dokployEnvironmentId) {
      throw new Error("Para crear la app en Dokploy falta deployment.dokployEnvironmentId.");
    }

    const app = await dokploy("/application.create", {
      name: recipe.content.brandName,
      appName: slugify(recipe.projectName),
      description: `Generated Astro site for ${recipe.domain}`,
      environmentId: deployment.dokployEnvironmentId,
      serverId: deployment.dokployServerId || undefined,
    });
    applicationId = app.applicationId;
    console.log(`Application creada en Dokploy: ${applicationId}`);
  }

  if (deployment.githubProviderId) {
    await dokploy("/application.saveGithubProvider", {
      applicationId,
      repository: deployment.githubRepo,
      owner: deployment.githubOwner,
      branch: deployment.branch ?? "main",
      buildPath: "/",
      githubId: deployment.githubProviderId,
      triggerType: "push",
      enableSubmodules: false,
      watchPaths: null,
    });
  } else {
    console.log("Sin githubProviderId: crea/conecta el provider GitHub en Dokploy o rellena ese campo en la receta.");
  }

  await dokploy("/application.saveBuildType", {
    applicationId,
    buildType: "dockerfile",
    dockerfile: deployment.dockerfilePath ?? "Dockerfile",
    dockerContextPath: "/",
    dockerBuildStage: "",
    herokuVersion: null,
    railpackVersion: null,
  });

  await dokploy("/application.saveEnvironment", {
    applicationId,
    env: Object.entries(recipe.env ?? {})
      .map(([key, value]) => `${key}=${value}`)
      .join("\n"),
    buildArgs: "",
    buildSecrets: "",
    createEnvFile: true,
  });

  await dokploy("/domain.create", {
    host: recipe.domain,
    path: "/",
    port: deployment.internalPort ?? 80,
    https: true,
    applicationId,
    certificateType: "letsencrypt",
    domainType: "application",
    internalPath: "/",
    stripPath: false,
  });

  await dokploy("/application.deploy", {
    applicationId,
    title: "Initial deployment",
    description: `Deploy generated site ${recipe.domain}`,
  });

  console.log("Dokploy configurado y deploy solicitado.");
}

async function github(pathname, options) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    method: options.method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 422 && options.allowConflict) {
    console.log("El repo ya existe en GitHub; continuo con push.");
    return {};
  }

  if (!response.ok) throw new Error(`GitHub API fallo ${response.status}: ${await response.text()}`);
  return response.status === 204 ? {} : response.json();
}

async function dokploy(pathname, body) {
  const baseUrl = recipe.deployment.dokployUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.DOKPLOY_API_TOKEN,
      Authorization: `Bearer ${process.env.DOKPLOY_API_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Dokploy API fallo ${response.status} en ${pathname}: ${await response.text()}`);
  return response.status === 204 ? {} : response.json();
}

function run(command, args, cwd, allowFail = false) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false });
  if (result.status !== 0 && !allowFail) {
    throw new Error(`Fallo ejecutando: ${command} ${args.join(" ")}`);
  }
}

function commandExists(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore", shell: false });
  return result.status === 0;
}
