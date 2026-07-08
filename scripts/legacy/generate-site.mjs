import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const recipePath = process.argv[2] ?? "recipes/example-site.recipe.json";
const recipe = JSON.parse(await readFile(recipePath, "utf8"));
const slug = recipe.projectName
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

if (!slug) {
  throw new Error("La receta necesita un projectName valido.");
}

const outputDir = path.join("generated-sites", slug);
await mkdir(path.join(outputDir, "src", "pages"), { recursive: true });
await mkdir(path.join(outputDir, "src", "components"), { recursive: true });
await mkdir(path.join(outputDir, "src", "styles"), { recursive: true });
await mkdir(path.join(outputDir, "public"), { recursive: true });

const title = recipe.content?.brandName ?? recipe.projectName.replace(/-/g, " ");
const palette = recipe.palette ?? {
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  primary: "#0f766e",
  secondary: "#164e63",
  accent: "#22c55e",
};
await writeFile(
  path.join(outputDir, "package.json"),
  JSON.stringify(
    {
      name: slug,
      type: "module",
      version: "0.1.0",
      scripts: { dev: "astro dev", build: "astro build", preview: "astro preview" },
      dependencies: { astro: "^5.12.9", "@astrojs/tailwind": "^6.0.2", tailwindcss: "^3.4.17" },
      devDependencies: { typescript: "^5.9.2" },
    },
    null,
    2,
  ),
);

await writeFile(
  path.join(outputDir, "astro.config.mjs"),
  `import { defineConfig } from "astro/config";\nimport tailwind from "@astrojs/tailwind";\n\nexport default defineConfig({ integrations: [tailwind()] });\n`,
);

await writeFile(
  path.join(outputDir, "tailwind.config.mjs"),
  `export default { content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"], theme: { extend: {} }, plugins: [] };\n`,
);

await writeFile(
  path.join(outputDir, "src", "styles", "tokens.css"),
  `:root {\n  --bg: ${palette.background};\n  --surface: ${palette.surface};\n  --text: ${palette.text};\n  --muted: ${palette.muted};\n  --primary: ${palette.primary};\n  --secondary: ${palette.secondary};\n  --accent: ${palette.accent};\n}\n`,
);

await writeFile(
  path.join(outputDir, "src", "pages", "index.astro"),
  `---\nimport "../styles/tokens.css";\nimport "../styles/global.css";\nimport Navbar from "../components/Navbar.astro";\nimport Hero from "../components/Hero.astro";\nimport Features from "../components/Features.astro";\nimport Process from "../components/Process.astro";\nimport Pricing from "../components/Pricing.astro";\nimport Contact from "../components/Contact.astro";\nimport Footer from "../components/Footer.astro";\nconst recipe = ${JSON.stringify(recipe, null, 2)};\n---\n<html lang="es">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width" />\n    <meta name="description" content={recipe.content.subheadline} />\n    <meta property="og:title" content={recipe.content.brandName} />\n    <meta property="og:description" content={recipe.content.subheadline} />\n    <meta property="og:url" content={recipe.env.PUBLIC_SITE_URL} />\n    <title>${title}</title>\n  </head>\n  <body>\n    <main class="page-shell">\n      {recipe.sections.includes("navbar") && <Navbar recipe={recipe} />}\n      {recipe.sections.includes("hero") && <Hero recipe={recipe} />}\n      {recipe.sections.includes("features") && <Features recipe={recipe} />}\n      {recipe.sections.includes("process") && <Process recipe={recipe} />}\n      {recipe.sections.includes("pricing") && <Pricing recipe={recipe} />}\n      {recipe.sections.includes("contact") && <Contact recipe={recipe} />}\n      {recipe.sections.includes("footer") && <Footer recipe={recipe} />}\n    </main>\n  </body>\n</html>\n`,
);

await writeGeneratedComponents(outputDir, recipe);

await writeFile(
  path.join(outputDir, "src", "styles", "global.css"),
  generatedGlobalCss(),
);

await writeFile(
  path.join(outputDir, "Dockerfile"),
  `FROM node:lts-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:1.27-alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]\n`,
);

await writeFile(
  path.join(outputDir, "nginx.conf"),
  `server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }\n`,
);

await writeFile(
  path.join(outputDir, ".env.example"),
  Object.entries(recipe.env ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .join("\n") + "\n",
);

await writeFile(
  path.join(outputDir, "dokploy.md"),
  `# Deploy en Dokploy\n\nDominio: ${recipe.domain}\nRepositorio: ${recipe.deployment?.githubOwner}/${recipe.deployment?.githubRepo}\nPuerto interno: ${recipe.deployment?.internalPort ?? 80}\n\n1. Sube este proyecto a GitHub.\n2. En Dokploy crea una aplicacion con Dockerfile.\n3. Usa el puerto interno 80.\n4. Anade las variables de .env.example.\n5. Apunta el dominio al VPS Hetzner y activa HTTPS.\n6. Activa auto deploy desde el branch ${recipe.deployment?.branch ?? "main"}.\n`,
);

await writeFile(path.join(outputDir, "site.recipe.json"), JSON.stringify(recipe, null, 2));

console.log(`Sitio generado en ${outputDir}`);

async function writeGeneratedComponents(outputDir, recipe) {
  const components = {
    "Navbar.astro": navbarComponent(),
    "Hero.astro": heroComponent(),
    "Features.astro": featureComponent(),
    "Process.astro": processComponent(),
    "Pricing.astro": pricingComponent(),
    "Contact.astro": contactComponent(),
    "Footer.astro": footerComponent(),
  };

  await Promise.all(
    Object.entries(components).map(([fileName, contents]) =>
      writeFile(path.join(outputDir, "src", "components", fileName), contents),
    ),
  );
}

function navbarComponent() {
  return `---\nconst { recipe } = Astro.props;\n---\n<nav class:list={["nav", recipe.selectedBlocks.navbar]}>\n  <a class="brand" href="/">{recipe.content.brandName}</a>\n  <div class="nav-links">\n    <a href="#features">Features</a>\n    <a href="#process">Proceso</a>\n    <a href="#pricing">Precios</a>\n    <a href="#contact">Contacto</a>\n  </div>\n  <a class="button" href="#contact">{recipe.content.primaryCta}</a>\n</nav>\n`;
}

function heroComponent() {
  return `---\nconst { recipe } = Astro.props;\n---\n<header class:list={["hero", recipe.selectedBlocks.hero]}>\n  <div>\n    <small>{recipe.domain}</small>\n    <h1>{recipe.content.headline}</h1>\n    <p>{recipe.content.subheadline}</p>\n    <div class="hero-actions">\n      <a class="button" href="#contact">{recipe.content.primaryCta}</a>\n      <a href="#process">{recipe.content.secondaryCta}</a>\n    </div>\n  </div>\n  <aside class="hero-panel">\n    <span>{recipe.selectedBlocks.hero}</span>\n    <strong>Astro + Dokploy</strong>\n    <i></i>\n  </aside>\n</header>\n`;
}

function featureComponent() {
  return `---\nconst { recipe } = Astro.props;\nconst items = ["Carga ultrarrapida", "SEO tecnico", "Diseno responsive", "Deploy automatico", "Formularios", "Analytics"];\n---\n<section class:list={["section", recipe.selectedBlocks.features]} id="features">\n  <span>{recipe.selectedBlocks.features}</span>\n  <h2>Todo lo necesario para lanzar bien</h2>\n  <div class="grid cards">\n    {items.map((item) => <article><strong>{item}</strong><p>Modulo preparado para adaptar contenido, icono e integraciones.</p></article>)}\n  </div>\n</section>\n`;
}

function processComponent() {
  return `---\nconst { recipe } = Astro.props;\nconst steps = ["Elegir piezas", "Personalizar marca", "Generar codigo", "Desplegar en Dokploy"];\n---\n<section class:list={["section", recipe.selectedBlocks.process]} id="process">\n  <span>{recipe.selectedBlocks.process}</span>\n  <h2>Proceso claro de principio a fin</h2>\n  <div class="steps">\n    {steps.map((step, index) => <article><small>{String(index + 1).padStart(2, "0")}</small><strong>{step}</strong></article>)}\n  </div>\n</section>\n`;
}

function pricingComponent() {
  return `---\nconst { recipe } = Astro.props;\nconst plans = ["Base", "Pro", "A medida"];\n---\n<section class:list={["section", recipe.selectedBlocks.pricing]} id="pricing">\n  <span>{recipe.selectedBlocks.pricing}</span>\n  <h2>Planes sencillos de entender</h2>\n  <div class="grid pricing-grid">\n    {plans.map((plan, index) => <article class={index === 1 ? "featured" : ""}><strong>{plan}</strong><p>Incluye diseno, implementacion Astro y deploy.</p><a class="button" href="#contact">Consultar</a></article>)}\n  </div>\n</section>\n`;
}

function contactComponent() {
  return `---\nconst { recipe } = Astro.props;\n---\n<section class:list={["section", "contact-section", recipe.selectedBlocks.contact]} id="contact">\n  <div>\n    <span>{recipe.selectedBlocks.contact}</span>\n    <h2>Hablemos del proyecto</h2>\n    <p>Este formulario queda listo para conectar a Formspree, endpoint propio o CRM.</p>\n  </div>\n  <form action={recipe.env.FORMSPREE_ID ? \`https://formspree.io/f/\${recipe.env.FORMSPREE_ID}\` : "#"} method="POST">\n    <input name="name" placeholder="Nombre" />\n    <input name="email" type="email" placeholder="Email" />\n    <textarea name="message" placeholder="Cuentame que necesitas"></textarea>\n    <button class="button" type="submit">Enviar</button>\n  </form>\n</section>\n`;
}

function footerComponent() {
  return `---\nconst { recipe } = Astro.props;\n---\n<footer class:list={["footer", recipe.selectedBlocks.footer]}>\n  <strong>{recipe.content.brandName}</strong>\n  <span>{recipe.env.PUBLIC_CONTACT_EMAIL}</span>\n  <span>{new Date().getFullYear()} / {recipe.domain}</span>\n</footer>\n`;
}

function generatedGlobalCss() {
  return `body { margin: 0; font-family: Inter, system-ui, sans-serif; background: var(--bg); color: var(--text); }\n* { box-sizing: border-box; }\n.page-shell { width: min(1160px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }\na { color: inherit; text-decoration: none; }\n.nav, .footer { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px; background: var(--surface); border: 1px solid color-mix(in srgb, var(--muted), transparent 72%); border-radius: 8px; }\n.brand { font-weight: 950; }\n.nav-links { display: flex; flex-wrap: wrap; gap: 18px; color: var(--muted); font-weight: 750; }\n.button { display: inline-flex; align-items: center; justify-content: center; background: var(--primary); color: var(--surface); border: 0; border-radius: 8px; padding: 12px 16px; font-weight: 900; cursor: pointer; }\n.hero { min-height: 68vh; display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 360px); align-items: end; gap: 24px; margin-top: 16px; padding: clamp(28px, 6vw, 68px); background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 8px; overflow: hidden; }\n.hero small, .section > span { color: var(--accent); font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }\n.hero h1 { max-width: 850px; font-size: clamp(3rem, 8vw, 7rem); line-height: .9; letter-spacing: 0; margin: 14px 0; }\n.hero p { max-width: 620px; color: rgba(255,255,255,.82); font-size: 1.18rem; margin: 0; }\n.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 22px; }\n.hero-actions a:last-child { color: white; font-weight: 900; }\n.hero-panel { min-height: 260px; display: grid; align-content: end; gap: 8px; border-radius: 8px; padding: 18px; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.24); }\n.hero-panel i { display: block; height: 80px; border-radius: 8px; background: rgba(255,255,255,.24); }\n.section { margin-top: 16px; padding: clamp(24px, 4vw, 44px); border: 1px solid color-mix(in srgb, var(--muted), transparent 72%); background: var(--surface); border-radius: 8px; }\n.section h2 { max-width: 760px; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; margin: 12px 0 22px; }\n.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }\n.cards article, .pricing-grid article, .steps article { min-height: 140px; border-radius: 8px; padding: 18px; background: color-mix(in srgb, var(--primary), var(--surface) 88%); }\n.cards strong, .pricing-grid strong, .steps strong { display: block; font-size: 1.1rem; margin-bottom: 10px; }\n.cards p, .pricing-grid p, .section p { color: var(--muted); }\n.steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }\n.steps small { color: var(--primary); font-weight: 900; }\n.pricing-grid .featured { background: var(--text); color: var(--surface); }\n.pricing-grid .featured p { color: color-mix(in srgb, var(--surface), transparent 26%); }\n.contact-section { display: grid; grid-template-columns: .9fr 1.1fr; gap: 24px; }\nform { display: grid; gap: 10px; }\ninput, textarea { width: 100%; border: 1px solid color-mix(in srgb, var(--muted), transparent 70%); background: var(--bg); color: var(--text); border-radius: 8px; padding: 13px; font: inherit; }\ntextarea { min-height: 130px; resize: vertical; }\n@media (max-width: 840px) { .nav, .footer, .contact-section { align-items: flex-start; flex-direction: column; display: flex; } .hero, .grid, .steps { grid-template-columns: 1fr; } .hero h1 { font-size: clamp(2.7rem, 16vw, 4.4rem); } }\n`;
}
