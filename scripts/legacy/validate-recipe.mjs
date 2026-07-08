import { readFile } from "node:fs/promises";

const recipePath = process.argv[2] ?? "recipes/example-site.recipe.json";
const recipe = JSON.parse(await readFile(recipePath, "utf8"));
const issues = [];
const warnings = [];

required("projectName");
required("domain");
required("content.brandName");
required("content.headline");
required("content.subheadline");
required("deployment.githubOwner");
required("deployment.githubRepo");
required("deployment.dokployUrl");
required("env.PUBLIC_SITE_URL");
required("env.PUBLIC_CONTACT_EMAIL");

if (!/^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i.test(recipe.domain ?? "")) {
  issues.push("domain debe ser un dominio valido, por ejemplo cliente.com");
}

if (!/^https?:\/\//.test(recipe.env?.PUBLIC_SITE_URL ?? "")) {
  issues.push("env.PUBLIC_SITE_URL debe empezar por http:// o https://");
}

if (!/.+@.+\..+/.test(recipe.env?.PUBLIC_CONTACT_EMAIL ?? "")) {
  warnings.push("env.PUBLIC_CONTACT_EMAIL no parece un email valido.");
}

if (!recipe.selectedBlocks?.hero) issues.push("Falta selectedBlocks.hero");
if (!recipe.selectedBlocks?.footer) issues.push("Falta selectedBlocks.footer");
if (!recipe.palette?.primary || !recipe.palette?.background) issues.push("Falta palette completa");
if (!recipe.deployment?.githubProviderId) warnings.push("Sin githubProviderId Dokploy no podra conectar GitHub automaticamente.");
if (!recipe.deployment?.dokployEnvironmentId) warnings.push("Sin dokployEnvironmentId no se podra crear una app nueva via API.");
if (!process.env.GITHUB_TOKEN) warnings.push("GITHUB_TOKEN no esta definido; deploy:site necesitara GitHub CLI autenticado.");
if (!process.env.DOKPLOY_API_TOKEN) warnings.push("DOKPLOY_API_TOKEN no esta definido; no se podra automatizar Dokploy.");

if (issues.length) {
  console.error("Errores de receta:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Receta valida.");
if (warnings.length) {
  console.log("Avisos:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

function required(path) {
  const value = path.split(".").reduce((current, key) => current?.[key], recipe);
  if (value === undefined || value === null || value === "") issues.push(`Falta ${path}`);
}
