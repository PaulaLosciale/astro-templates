// API local del builder (solo dev): lanza scripts/build-site.mjs en segundo plano
// y permite consultar el progreso del job.
//   POST /api/build           body = receta JSON → { jobId }
//   GET  /api/build?job=<id>  → { status, lines, outputDir }
import type { APIRoute } from "astro";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

export const prerender = false;

const repoRoot = process.cwd();
const jobsRoot = path.join(repoRoot, ".builder-jobs");

export const POST: APIRoute = async ({ request }) => {
  const recipe = await request.json().catch(() => null);
  if (!recipe || recipe.version !== 2) {
    return new Response("Receta inválida (se espera version: 2).", { status: 400 });
  }

  const jobId = `job-${Date.now().toString(36)}`;
  const jobDir = path.join(jobsRoot, jobId);
  await mkdir(jobDir, { recursive: true });

  const recipePath = path.join(jobDir, "recipe.json");
  const logPath = path.join(jobDir, "log.jsonl");
  await writeFile(recipePath, JSON.stringify(recipe, null, 2));
  await writeFile(logPath, "");

  const child = spawn(process.execPath, [path.join(repoRoot, "scripts", "build-site.mjs"), recipePath, "--log", logPath], {
    cwd: repoRoot,
    detached: true,
    stdio: "ignore",
    env: process.env,
  });
  child.unref();

  return new Response(JSON.stringify({ jobId }), { headers: { "Content-Type": "application/json" } });
};

export const GET: APIRoute = async ({ url }) => {
  const jobId = url.searchParams.get("job");
  if (!jobId || !/^job-[a-z0-9]+$/.test(jobId)) {
    return new Response("Falta ?job=<id>", { status: 400 });
  }

  const logPath = path.join(jobsRoot, jobId, "log.jsonl");
  const raw = await readFile(logPath, "utf8").catch(() => null);
  if (raw === null) return new Response("Job no encontrado", { status: 404 });

  const lines: any[] = [];
  let status: "running" | "done" | "error" = "running";
  let outputDir: string | undefined;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === "done") {
        status = "done";
        outputDir = parsed.outputDir;
      } else if (parsed.type === "error") {
        status = "error";
      } else {
        lines.push(parsed);
      }
    } catch {
      /* línea a medio escribir: la ignoramos hasta el próximo poll */
    }
  }

  return new Response(JSON.stringify({ status, lines, outputDir }), {
    headers: { "Content-Type": "application/json" },
  });
};
