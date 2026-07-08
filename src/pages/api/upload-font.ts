// Sube una fuente (ttf/otf/woff/woff2) al builder: se guarda en public/custom-fonts
// para que el preview la sirva y el generador la copie al proyecto final.
// POST JSON: { filename: "MiFuente.ttf", data: "<base64>" } → { file, format, family }
import type { APIRoute } from "astro";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const prerender = false;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const formats: Record<string, string> = {
  ".ttf": "truetype",
  ".otf": "opentype",
  ".woff": "woff",
  ".woff2": "woff2",
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body?.filename || !body?.data) {
    return new Response("Se espera JSON { filename, data(base64) }", { status: 400 });
  }

  const ext = path.extname(String(body.filename)).toLowerCase();
  const format = formats[ext];
  if (!format) {
    return new Response("Formato no soportado. Usa .ttf, .otf, .woff o .woff2", { status: 400 });
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(String(body.data), "base64");
  } catch {
    return new Response("data no es base64 válido", { status: 400 });
  }
  if (bytes.length === 0 || bytes.length > MAX_BYTES) {
    return new Response(`El archivo debe pesar entre 1 byte y ${MAX_BYTES / 1024 / 1024} MB`, { status: 400 });
  }

  const stem = path.basename(String(body.filename), ext)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "fuente";

  // Familia legible a partir del nombre del archivo: "recoleta-bold" → "Recoleta Bold"
  const family = stem.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const dir = path.join(process.cwd(), "public", "custom-fonts");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, stem + ext), bytes);

  return new Response(JSON.stringify({ file: `/custom-fonts/${stem}${ext}`, format, family }), {
    headers: { "Content-Type": "application/json" },
  });
};
