// Orquestador "Montar web": a partir de una receta v2 genera un proyecto Astro
// independiente (componentes reales copiados de la librería), instala dependencias,
// inicializa git y, si la receta lo pide, crea el repo en GitHub y la app en Dokploy.
//
// Uso:
//   node scripts/build-site.mjs recipes/cliente.recipe.json [--log jobs/log.jsonl]
//
// Tokens por variable de entorno (nunca en la receta):
//   GITHUB_TOKEN          crear repo + push por HTTPS (alternativa: gh CLI autenticado)
//   DOKPLOY_API_TOKEN     API de Dokploy

import { cp, mkdir, readFile, writeFile, appendFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const recipePath = args.find((a) => !a.startsWith("--"));
const logFlagIndex = args.indexOf("--log");
const logFile = logFlagIndex !== -1 ? args[logFlagIndex + 1] : null;

if (!recipePath) {
  console.error("Uso: node scripts/build-site.mjs <receta.json> [--log <archivo>]");
  process.exit(1);
}

const recipe = JSON.parse(await readFile(recipePath, "utf8"));

// ---------- logging ----------
async function log(level, message) {
  const line = { time: new Date().toISOString(), level, message };
  console.log(`[${level}] ${message}`);
  if (logFile) await appendFile(logFile, JSON.stringify(line) + "\n");
}

async function finish(status, extra = {}) {
  if (logFile) await appendFile(logFile, JSON.stringify({ type: status, ...extra }) + "\n");
}

// ---------- utilidades ----------
function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hexToHsl(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const triplet = ({ h, s, l }) => `${h} ${s}% ${l}%`;

function deriveScale(hex) {
  const base = hexToHsl(hex);
  const at = (l, s = base.s) => triplet({ h: base.h, s, l });
  return {
    50: at(97, Math.min(base.s, 60)),
    100: at(93, Math.min(base.s, 65)),
    500: triplet(base),
    600: at(Math.max(base.l - 10, 8)),
    700: at(Math.max(base.l - 20, 5)),
  };
}

function run(command, cliArgs, cwd, { allowFail = false } = {}) {
  const result = spawnSync(command, cliArgs, { cwd, encoding: "utf8", shell: process.platform === "win32" });
  if (result.status !== 0 && !allowFail) {
    throw new Error(`Falló: ${command} ${cliArgs.join(" ")}\n${(result.stderr || result.stdout || "").slice(-800)}`);
  }
  return result;
}

// ---------- receta ----------
const slug = slugify(recipe.project?.name);
if (!slug) {
  await log("error", "La receta necesita project.name válido.");
  await finish("error");
  process.exit(1);
}

// Carpeta raíz de salida: vacía = Desktop/webs-generadas. Si el usuario escribe
// algo que no es ruta absoluta ("mis-webs"), se resuelve bajo el Escritorio para
// que nunca acabe perdida dentro del repo del builder.
const rawOutputRoot = recipe.project?.outputRoot?.trim() ?? "";
const outputRoot = rawOutputRoot
  ? path.isAbsolute(rawOutputRoot)
    ? rawOutputRoot
    : path.join(os.homedir(), "Desktop", rawOutputRoot)
  : path.join(os.homedir(), "Desktop", "webs-generadas");
const outDir = path.join(outputRoot, slug);

const business = recipe.business ?? {};
const design = recipe.design ?? {};
const palette = design.palette ?? {};
const fonts = design.typography ?? {};
const customFonts = design.customFonts ?? [];
const primaryLanguage = recipe.project?.language ?? "es";
const extraLanguages = recipe.project?.extraLanguages ?? [];
const widgets = recipe.integrations?.widgets ?? {};
const content = recipe.content ?? {};
const seo = recipe.seo ?? {};
const integrations = recipe.integrations ?? {};
const deployment = recipe.deployment ?? {};
const pages = recipe.pages ?? [];

const usesReact = pages.some((page) =>
  page.sections.some((section) => {
    try {
      return section.variant && variantToFile(section.variant).endsWith(".tsx");
    } catch {
      return false;
    }
  }),
);

try {
  await main();
  await finish("done", { outputDir: outDir });
} catch (error) {
  await log("error", String(error?.message ?? error));
  await finish("error");
  process.exit(1);
}

async function main() {
  await log("info", `Receta "${recipe.project.name}" → ${outDir}`);
  if (existsSync(outDir)) {
    throw new Error(`La carpeta ${outDir} ya existe. Bórrala o cambia el nombre del proyecto.`);
  }

  await generateProject();
  await log("ok", "Proyecto generado ✔");

  if (deployment.installDeps !== false) {
    await log("info", "Instalando dependencias (npm install)… esto tarda un poco");
    run("npm", ["install", "--no-fund", "--no-audit"], outDir);
    await log("ok", "Dependencias instaladas ✔");
  } else {
    await log("info", "npm install omitido (desactivado en la receta).");
  }

  await log("info", "Inicializando git…");
  run("git", ["init"], outDir);
  run("git", ["checkout", "-B", deployment.github?.branch || "main"], outDir);
  run("git", ["add", "."], outDir);
  run("git", ["commit", "-m", `Web inicial generada para ${business.brandName ?? slug}`], outDir, { allowFail: true });
  await log("ok", "Repositorio git listo ✔");

  if (deployment.createGithub) {
    await log("info", "Creando repositorio en GitHub…");
    const url = await ensureGithubRepo();
    ensureRemote(url);
    run("git", ["push", "-u", "origin", deployment.github?.branch || "main"], outDir);
    await log("ok", `Código subido a GitHub: ${deployment.github.owner}/${deployment.github.repo} ✔`);
  } else {
    await log("info", "GitHub omitido (desactivado en la receta).");
  }

  if (deployment.setupDokploy) {
    if (!process.env.DOKPLOY_API_TOKEN) {
      await log("error", "Falta DOKPLOY_API_TOKEN en el entorno; configura Dokploy a mano o relanza con el token.");
    } else {
      await log("info", "Configurando aplicación en Dokploy…");
      await setupDokploy();
      await log("ok", "Dokploy configurado y deploy lanzado ✔");
    }
  } else {
    await log("info", "Dokploy omitido (desactivado en la receta).");
  }

  await log("ok", `TODO LISTO. Proyecto en: ${outDir}`);
  await log("info", `Para trabajar en él: cd "${outDir}" && npm run dev`);
}

// ---------- generación del proyecto ----------
async function generateProject() {
  await mkdir(path.join(outDir, "src", "pages"), { recursive: true });
  await mkdir(path.join(outDir, "src", "styles"), { recursive: true });
  await mkdir(path.join(outDir, "src", "layouts"), { recursive: true });
  await mkdir(path.join(outDir, "public", "images"), { recursive: true });

  // 1. Copiar componentes seleccionados + dependencias relativas
  const copied = new Set();
  for (const page of pages) {
    for (const section of page.sections) {
      if (!section.variant) continue;
      await copyComponentWithDeps(variantToFile(section.variant), copied);
    }
  }
  await log("info", `${copied.size} archivos de componentes copiados.`);

  // 2. Copiar imágenes referenciadas por los componentes copiados
  const usedImages = new Set();
  for (const file of copied) {
    const contentText = await readFile(path.join(outDir, "src", "components", file), "utf8").catch(() => "");
    for (const match of contentText.matchAll(/\/images\/([\w.-]+)/g)) usedImages.add(match[1]);
  }
  for (const image of usedImages) {
    const source = path.join(repoRoot, "public", "images", image);
    if (existsSync(source)) await cp(source, path.join(outDir, "public", "images", image));
  }
  if (usedImages.size) await log("info", `${usedImages.size} imágenes copiadas a public/images.`);

  // 2b. Fuentes subidas por el usuario
  if (customFonts.length) {
    await mkdir(path.join(outDir, "public", "custom-fonts"), { recursive: true });
    for (const font of customFonts) {
      const name = path.basename(font.file);
      const source = path.join(repoRoot, "public", "custom-fonts", name);
      if (existsSync(source)) await cp(source, path.join(outDir, "public", "custom-fonts", name));
      else await log("error", `Fuente ${name} no encontrada en el builder; súbela de nuevo desde el paso Tipografía.`);
    }
    await log("info", `${customFonts.length} fuente(s) personalizadas copiadas.`);
  }

  // 3. Config del sitio (datos del negocio para los componentes)
  await writeFile(path.join(outDir, "src", "config.ts"), configTs());

  // 4. Estilos: theme.css (paleta) + global.css (tailwind + fuentes)
  await writeFile(path.join(outDir, "src", "styles", "theme.css"), themeCss());
  await writeFile(path.join(outDir, "src", "styles", "global.css"), globalCss());

  // 5. Layout con SEO, fuentes, analytics, cookies y WhatsApp
  await writeFile(path.join(outDir, "src", "layouts", "Layout.astro"), layoutAstro());

  // 6. Páginas (idioma principal en raíz; idiomas extra bajo /<lang>/)
  for (const page of pages) {
    const fileName = page.path === "/" ? "index.astro" : `${slugify(page.path)}.astro`;
    await writeFile(path.join(outDir, "src", "pages", fileName), pageAstro(page, primaryLanguage, ".."));
    for (const lang of extraLanguages) {
      await mkdir(path.join(outDir, "src", "pages", lang), { recursive: true });
      await writeFile(path.join(outDir, "src", "pages", lang, fileName), pageAstro(page, lang, "../.."));
    }
  }
  if (extraLanguages.length) {
    await log("info", `Idiomas extra generados: ${extraLanguages.join(", ")} (los textos salen en ${primaryLanguage}; tradúcelos al personalizar).`);
  }

  // 7. Configuración del proyecto
  await writeFile(path.join(outDir, "package.json"), packageJson());
  await writeFile(path.join(outDir, "astro.config.mjs"), astroConfig());
  await writeFile(path.join(outDir, "tailwind.config.mjs"), tailwindConfig());
  await writeFile(path.join(outDir, "tsconfig.json"), JSON.stringify({ extends: "astro/tsconfigs/base", include: [".astro/types.d.ts", "**/*"], exclude: ["dist"] }, null, 2));

  // 8. Deploy: Docker + Nginx (patrón Dokploy estático)
  await writeFile(path.join(outDir, "Dockerfile"), dockerfile());
  await writeFile(path.join(outDir, "nginx.conf"), nginxConf());
  await writeFile(path.join(outDir, ".dockerignore"), "node_modules\ndist\n.git\n");
  await writeFile(path.join(outDir, ".gitignore"), "node_modules/\ndist/\n.astro/\n.env\n");

  // 9. Extras
  await writeFile(path.join(outDir, "public", "robots.txt"), `User-agent: *\nAllow: /\n${integrations.sitemap ? `Sitemap: https://${deployment.domain}/sitemap-index.xml\n` : ""}`);
  const favicon = path.join(repoRoot, "public", "favicon.svg");
  if (existsSync(favicon)) await cp(favicon, path.join(outDir, "public", "favicon.svg"));

  await writeFile(path.join(outDir, ".env.example"), envExample());
  await writeFile(path.join(outDir, "site.recipe.json"), JSON.stringify(recipe, null, 2));
  await writeFile(path.join(outDir, "README.md"), readme());
}

function variantToFile(variantId) {
  // El id del registry es la ruta sin extensión; probamos .astro y .tsx
  for (const ext of [".astro", ".tsx"]) {
    if (existsSync(path.join(repoRoot, "src", "components", variantId + ext))) return variantId + ext;
  }
  throw new Error(`No encuentro el componente de la variante "${variantId}" en la librería.`);
}

async function copyComponentWithDeps(relativeFile, copied) {
  if (copied.has(relativeFile)) return;
  const sourcePath = path.join(repoRoot, "src", "components", relativeFile);
  const targetPath = path.join(outDir, "src", "components", relativeFile);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath);
  copied.add(relativeFile);

  const text = await readFile(sourcePath, "utf8");
  for (const match of text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
    const spec = match[1];
    const resolvedDir = path.dirname(relativeFile);
    let resolved = path.normalize(path.join(resolvedDir, spec)).replace(/\\/g, "/");
    // Imports que salen de components/ (ej. ../../../config) los cubre src/config.ts generado
    if (resolved.startsWith("..")) continue;
    for (const ext of ["", ".astro", ".tsx", ".ts", ".jsx", ".js"]) {
      const candidate = resolved + ext;
      if (existsSync(path.join(repoRoot, "src", "components", candidate))) {
        await copyComponentWithDeps(candidate, copied);
        break;
      }
    }
  }
}

// ---------- plantillas ----------
function configTs() {
  return `// Datos del negocio, generados por el builder. Edita libremente.
export const SITE_CONFIG = {
  name: ${JSON.stringify(business.brandName ?? slug)},
  description: ${JSON.stringify(seo.description ?? "")},
  contactEmail: ${JSON.stringify(business.email ?? "")},
  formspreeId: ${JSON.stringify(integrations.formspreeId ?? "")},
  phone: ${JSON.stringify(business.phone ?? "")},
  address: ${JSON.stringify(`${business.address ?? ""}${business.city ? ", " + business.city : ""}`)},
  schedule: ${JSON.stringify(business.schedule ?? "")},
  socials: ${JSON.stringify(business.socials ?? {}, null, 2)},
};
`;
}

function themeCss() {
  const primary = deriveScale(palette.primary ?? "#2563eb");
  return `:root {
  --color-primary-50: ${primary[50]};
  --color-primary-100: ${primary[100]};
  --color-primary-500: ${primary[500]};
  --color-primary-600: ${primary[600]};
  --color-primary-700: ${primary[700]};
  --color-secondary-500: ${triplet(hexToHsl(palette.secondary ?? "#7c3aed"))};
  --color-accent-500: ${triplet(hexToHsl(palette.accent ?? "#06b6d4"))};
  --color-bg-light: ${triplet(hexToHsl(palette.background ?? "#ffffff"))};
  --color-bg-dark: ${triplet(hexToHsl(palette.backgroundDark ?? "#0b1220"))};
  --color-text-light: ${triplet(hexToHsl(palette.text ?? "#0f172a"))};
  --color-text-dark: ${triplet(hexToHsl(palette.textDark ?? "#f1f5f9"))};
}
`;
}

function globalCss() {
  const fontFaces = customFonts
    .map((font) => `@font-face { font-family: "${font.family}"; src: url("${font.file}") format("${font.format}"); font-display: swap; }`)
    .join("\n");
  const headingCustom = customFonts.find((f) => f.role === "heading" || f.role === "both");
  const bodyCustom = customFonts.find((f) => f.role === "body" || f.role === "both");
  const headingStack = headingCustom ? `"${headingCustom.family}", ${fonts.headingStack ?? "serif"}` : (fonts.headingStack ?? "system-ui, sans-serif");
  const bodyStack = bodyCustom ? `"${bodyCustom.family}", ${fonts.bodyStack ?? "sans-serif"}` : (fonts.bodyStack ?? "system-ui, sans-serif");

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

${fontFaces}

body {
  font-family: ${bodyStack};
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${headingStack};
}

/* Accesibilidad */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: #0f172a;
  color: #fff;
  padding: 10px 18px;
  border-radius: 0 0 8px 0;
}
.skip-link:focus {
  left: 0;
}

:focus-visible {
  outline: 3px solid hsl(var(--color-accent-500));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Selector de idioma flotante */
.lang-switch {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 60;
}
.lang-switch select {
  appearance: none;
  border: 1px solid rgba(120, 120, 140, 0.35);
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  border-radius: 999px;
  padding: 8px 30px 8px 14px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}
`;
}

function layoutAstro() {
  const googleFamilies = fonts.googleFamilies ?? [];
  const fontsLink = googleFamilies.length
    ? `<link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link href="https://fonts.googleapis.com/css2?${googleFamilies.map((f) => `family=${f}`).join("&")}&display=swap" rel="stylesheet" />`
    : "";
  const allLanguages = [primaryLanguage, ...extraLanguages];
  const hreflangs = extraLanguages.length
    ? `{[${JSON.stringify(allLanguages)}].flat().map((l) => (
    <link rel="alternate" hreflang={l} href={\`https://${deployment.domain ?? "example.com"}\${l === ${JSON.stringify(primaryLanguage)} ? "" : "/" + l}\${pagePath}\`} />
  ))}`
    : "";
  const langSwitcher = extraLanguages.length
    ? `<div class="lang-switch">
    <select id="lang-select" aria-label="Idioma">
      ${allLanguages.map((l) => `<option value="${l === primaryLanguage ? "" : "/" + l}">${l.toUpperCase()}</option>`).join("\n      ")}
    </select>
  </div>
  <script is:inline>
    (function () {
      var select = document.getElementById("lang-select");
      var prefixes = ${JSON.stringify(extraLanguages.map((l) => "/" + l))};
      var current = "";
      var rest = location.pathname;
      for (var i = 0; i < prefixes.length; i++) {
        if (rest === prefixes[i] || rest.indexOf(prefixes[i] + "/") === 0) {
          current = prefixes[i];
          rest = rest.slice(prefixes[i].length) || "/";
          break;
        }
      }
      select.value = current;
      select.addEventListener("change", function () {
        location.href = select.value + (rest === "/" && select.value ? "" : rest) || "/";
      });
    })();
  </script>`
    : "";
  const crisp = widgets.crispId
    ? `<script is:inline>window.$crisp=[];window.CRISP_WEBSITE_ID="${widgets.crispId}";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>`
    : "";
  const tawkto = widgets.tawktoId
    ? `<script is:inline>var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="https://embed.tawk.to/${widgets.tawktoId}";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();</script>`
    : "";
  const booking = widgets.bookingUrl
    ? `<a href="${widgets.bookingUrl}" target="_blank" rel="noreferrer" style="position:fixed;bottom:20px;right:88px;z-index:60;background:hsl(var(--color-primary-600));color:#fff;padding:14px 22px;border-radius:999px;font-weight:700;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.25);">📅 Reservar</a>`
    : "";
  const customScript = widgets.customScript ? `\n  ${widgets.customScript}` : "";
  const analytics =
    integrations.analytics === "plausible"
      ? `<script defer data-domain="${integrations.analyticsId || deployment.domain}" src="https://plausible.io/js/script.js"></script>`
      : integrations.analytics === "ga4"
        ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${integrations.analyticsId}"></script>\n  <script is:inline>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.analyticsId}');</script>`
        : "";
  const whatsapp = business.socials?.whatsapp
    ? `<a href="https://wa.me/${String(business.socials.whatsapp).replace(/[^0-9]/g, "")}" target="_blank" rel="noreferrer" aria-label="WhatsApp" style="position:fixed;bottom:20px;right:20px;z-index:60;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.25);color:#fff;font-size:28px;text-decoration:none;">🗨</a>`
    : "";
  const cookies = integrations.cookieBanner
    ? `<div id="cookie-banner" style="position:fixed;bottom:0;left:0;right:0;z-index:70;background:#0f172a;color:#e2e8f0;padding:14px 20px;display:none;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:14px;">
    <span>Usamos cookies para mejorar tu experiencia.</span>
    <button id="cookie-accept" style="background:#0d9488;color:#fff;border:0;border-radius:8px;padding:8px 16px;cursor:pointer;">Aceptar</button>
  </div>
  <script is:inline>
    if (!localStorage.getItem("cookies-accepted")) document.getElementById("cookie-banner").style.display = "flex";
    document.getElementById("cookie-accept").addEventListener("click", () => {
      localStorage.setItem("cookies-accepted", "1");
      document.getElementById("cookie-banner").style.display = "none";
    });
  </script>`
    : "";

  return `---
import "../styles/global.css";
import "../styles/theme.css";

export interface Props {
  title: string;
  description?: string;
  lang?: string;
  pagePath?: string;
}

const {
  title,
  description = ${JSON.stringify(seo.description ?? "")},
  lang = ${JSON.stringify(primaryLanguage)},
  pagePath = "/",
} = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}${design.darkMode ? ' class="dark"' : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  ${seo.keywords ? `<meta name="keywords" content=${JSON.stringify(seo.keywords)} />` : ""}
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={Astro.url} />
  ${fontsLink}
  ${hreflangs}
  ${analytics}
  <title>{title}</title>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <main id="contenido">
    <slot />
  </main>
  ${whatsapp}
  ${booking}
  ${langSwitcher}
  ${cookies}
  ${crisp}
  ${tawkto}${customScript}
</body>
</html>
`;
}

function sectionProps(section, page) {
  const base = `siteName=${JSON.stringify(business.brandName ?? slug)}`;
  if (section.category === "navigation" || section.category === "footers") return base;
  if (section.category === "map") {
    return `${base} mapEmbed=${JSON.stringify(widgets.gmapsEmbed ?? "")} address=${JSON.stringify(`${business.address ?? ""}${business.city ? ", " + business.city : ""}`)}`;
  }
  if (section.category === "legal") {
    return `${base} title=${JSON.stringify(page.title)} description=${JSON.stringify(business.description ?? "")}`;
  }
  return `${base} title=${JSON.stringify(content.headline ?? "")} description=${JSON.stringify(content.subheadline ?? "")}`;
}

function pageAstro(page, lang = primaryLanguage, importPrefix = "..") {
  const imports = [];
  const renders = [];
  const seen = new Map();

  page.sections.forEach((section) => {
    if (!section.variant) return;
    const file = variantToFile(section.variant);
    const isReact = file.endsWith(".tsx");
    let name = seen.get(section.variant);
    if (!name) {
      const base = path.basename(file).replace(/\.(astro|tsx)$/, "").replace(/[^A-Za-z0-9]/g, "");
      name = `${base}${seen.size}`;
      seen.set(section.variant, name);
      if (isReact) {
        // Los navbars React usan named export salvo NavbarGlass (default)
        const exportName = path.basename(file, ".tsx");
        const isDefault = /NavbarGlass/.test(exportName);
        imports.push(isDefault
          ? `import ${name} from "${importPrefix}/components/${file.replace(/\\/g, "/")}";`
          : `import { ${exportName} as ${name} } from "${importPrefix}/components/${file.replace(/\\/g, "/").replace(/\.tsx$/, "")}";`);
      } else {
        imports.push(`import ${name} from "${importPrefix}/components/${file.replace(/\\/g, "/")}";`);
      }
    }
    const props = sectionProps(section, page);
    renders.push(isReact ? `  <${name} client:load ${props} />` : `  <${name} ${props} />`);
  });

  const pageTitle = page.seoTitle || `${page.title} — ${seo.siteTitle || business.brandName || slug}`;
  return `---
import Layout from "${importPrefix}/layouts/Layout.astro";
${imports.join("\n")}
---

<Layout title=${JSON.stringify(pageTitle)} description=${JSON.stringify(page.seoDescription || seo.description || "")} lang=${JSON.stringify(lang)} pagePath=${JSON.stringify(page.path)}>
${renders.join("\n")}
</Layout>
`;
}

function packageJson() {
  const deps = {
    astro: "^5.12.9",
    "@astrojs/tailwind": "^6.0.2",
    tailwindcss: "^3.4.17",
  };
  if (usesReact) {
    Object.assign(deps, {
      "@astrojs/react": "^5.0.1",
      react: "^19.2.4",
      "react-dom": "^19.2.4",
      "@types/react": "^19.2.14",
      "@types/react-dom": "^19.2.3",
    });
  }
  if (integrations.sitemap) deps["@astrojs/sitemap"] = "^3.2.1";
  return JSON.stringify(
    {
      name: slug,
      type: "module",
      version: "0.1.0",
      scripts: { dev: "astro dev", build: "astro build", preview: "astro preview" },
      dependencies: deps,
      devDependencies: { typescript: "^5.9.2" },
    },
    null,
    2,
  );
}

function astroConfig() {
  const integrationsList = ["tailwind()"];
  if (usesReact) integrationsList.push("react()");
  if (integrations.sitemap) integrationsList.push("sitemap()");
  return `import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
${usesReact ? 'import react from "@astrojs/react";\n' : ""}${integrations.sitemap ? 'import sitemap from "@astrojs/sitemap";\n' : ""}
export default defineConfig({
  site: "https://${deployment.domain ?? "example.com"}",
  integrations: [${integrationsList.join(", ")}],
});
`;
}

function tailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(var(--color-primary-50) / <alpha-value>)",
          100: "hsl(var(--color-primary-100) / <alpha-value>)",
          500: "hsl(var(--color-primary-500) / <alpha-value>)",
          600: "hsl(var(--color-primary-600) / <alpha-value>)",
          700: "hsl(var(--color-primary-700) / <alpha-value>)",
        },
        secondary: { 500: "hsl(var(--color-secondary-500) / <alpha-value>)" },
        accent: { 500: "hsl(var(--color-accent-500) / <alpha-value>)" },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
`;
}

function dockerfile() {
  return `FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
}

function nginxConf() {
  return `server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ $uri.html /index.html;
  }
  gzip on;
  gzip_types text/css application/javascript image/svg+xml;
}
`;
}

function envExample() {
  const env = {
    PUBLIC_SITE_URL: `https://${deployment.domain ?? "example.com"}`,
    PUBLIC_CONTACT_EMAIL: business.email ?? "",
    ...(integrations.formspreeId ? { FORMSPREE_ID: integrations.formspreeId } : {}),
    ...(deployment.env ?? {}),
  };
  return Object.entries(env).map(([key, value]) => `${key}=${value}`).join("\n") + "\n";
}

function readme() {
  return `# ${business.brandName ?? slug}

Web generada con Astro Lego Builder el ${new Date().toLocaleDateString("es-ES")}.

## Comandos

\`\`\`bash
npm run dev      # desarrollo en http://localhost:4321
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
\`\`\`

## Personalización rápida

- **Datos del negocio**: \`src/config.ts\`
- **Colores**: \`src/styles/theme.css\` (variables HSL)
- **Tipografía**: \`src/styles/global.css\` + link de Google Fonts en \`src/layouts/Layout.astro\`
- **Secciones**: componentes en \`src/components/\`, se montan en \`src/pages/\`
- **Imágenes**: sustituye las de \`public/images/\` por las del cliente

## Deploy (Dokploy)

El proyecto incluye \`Dockerfile\` + \`nginx.conf\`: build estático servido por Nginx en el puerto interno **80**.

1. Sube el repo a GitHub (si el builder no lo hizo ya).
2. En Dokploy: Application → conectar repo → Build type: Dockerfile → puerto 80.
3. Añade el dominio \`${deployment.domain ?? "tu-dominio.com"}\` con HTTPS (Let's Encrypt).
4. Activa auto-deploy para que cada push publique.

La receta original está en \`site.recipe.json\` (reproducible en el builder).
`;
}

// ---------- GitHub ----------
async function ensureGithubRepo() {
  const owner = deployment.github.owner;
  const name = deployment.github.repo;
  const isPrivate = deployment.github.visibility !== "public";

  if (process.env.GITHUB_TOKEN) {
    const user = await githubApi("/user", { method: "GET" });
    const endpoint = owner === user.login ? "/user/repos" : `/orgs/${owner}/repos`;
    await githubApi(endpoint, {
      method: "POST",
      body: { name, private: isPrivate, description: `Web generada para ${business.brandName ?? slug}`, auto_init: false },
      allowConflict: true,
    });
    return `https://${process.env.GITHUB_TOKEN}@github.com/${owner}/${name}.git`;
  }

  const gh = spawnSync("gh", ["--version"], { stdio: "ignore", shell: process.platform === "win32" });
  if (gh.status === 0) {
    run("gh", ["repo", "create", `${owner}/${name}`, isPrivate ? "--private" : "--public"], outDir, { allowFail: true });
    return `https://github.com/${owner}/${name}.git`;
  }

  throw new Error("Para crear el repo necesito GITHUB_TOKEN en el entorno o GitHub CLI (gh) autenticado.");
}

function ensureRemote(url) {
  const existing = spawnSync("git", ["remote", "get-url", "origin"], { cwd: outDir, encoding: "utf8", shell: process.platform === "win32" });
  run("git", existing.status === 0 ? ["remote", "set-url", "origin", url] : ["remote", "add", "origin", url], outDir);
}

async function githubApi(pathname, options) {
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
    await log("info", "El repo ya existía en GitHub; continúo con el push.");
    return {};
  }
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response.status === 204 ? {} : response.json();
}

// ---------- Dokploy ----------
async function setupDokploy() {
  const dokployConfig = deployment.dokploy ?? {};
  let applicationId = dokployConfig.applicationId;

  if (!applicationId) {
    if (!dokployConfig.environmentId) throw new Error("Falta deployment.dokploy.environmentId para crear la app.");
    const app = await dokployApi("/application.create", {
      name: business.brandName ?? slug,
      appName: slug,
      description: `Web generada para ${deployment.domain}`,
      environmentId: dokployConfig.environmentId,
      serverId: dokployConfig.serverId || undefined,
    });
    applicationId = app.applicationId;
    await log("ok", `Application creada en Dokploy: ${applicationId}`);
  }

  if (deployment.github?.providerId) {
    await dokployApi("/application.saveGithubProvider", {
      applicationId,
      repository: deployment.github.repo,
      owner: deployment.github.owner,
      branch: deployment.github.branch ?? "main",
      buildPath: "/",
      githubId: deployment.github.providerId,
      triggerType: "push",
      enableSubmodules: false,
      watchPaths: null,
    });
    await log("ok", "Repo GitHub conectado en Dokploy (auto-deploy por push).");
  } else {
    await log("info", "Sin github.providerId: conecta el repo en Dokploy a mano para el auto-deploy.");
  }

  await dokployApi("/application.saveBuildType", {
    applicationId,
    buildType: "dockerfile",
    dockerfile: "Dockerfile",
    dockerContextPath: "/",
    dockerBuildStage: "",
    herokuVersion: null,
    railpackVersion: null,
  });

  const envText = Object.entries({ PUBLIC_SITE_URL: `https://${deployment.domain}`, ...(deployment.env ?? {}) })
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  await dokployApi("/application.saveEnvironment", {
    applicationId,
    env: envText,
    buildArgs: "",
    buildSecrets: "",
    createEnvFile: true,
  });

  await dokployApi("/domain.create", {
    host: deployment.domain,
    path: "/",
    port: dokployConfig.internalPort ?? 80,
    https: true,
    applicationId,
    certificateType: "letsencrypt",
    domainType: "application",
    internalPath: "/",
    stripPath: false,
  });

  await dokployApi("/application.deploy", {
    applicationId,
    title: "Deploy inicial",
    description: `Web generada para ${deployment.domain}`,
  });
}

async function dokployApi(pathname, body) {
  const baseUrl = String(deployment.dokploy?.url ?? "").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.DOKPLOY_API_TOKEN,
      Authorization: `Bearer ${process.env.DOKPLOY_API_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Dokploy API ${response.status} en ${pathname}: ${await response.text()}`);
  return response.status === 204 ? {} : response.json();
}
