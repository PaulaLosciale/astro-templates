# Astro Lego Builder

Builder visual para montar webs de cliente en minutos: eliges páginas, tema, paleta, tipografía y secciones con **preview en vivo**, y el botón **"Montar web"** genera un proyecto Astro independiente en tu Escritorio con dependencias instaladas, git inicializado y, si quieres, repo en GitHub + app desplegada en Dokploy (Hetzner).

## Arranque rápido

```bash
npm install
npm run dev
# abre http://localhost:4321
```

## Cómo se usa (flujo de cliente)

1. **Negocio**: marca, sector, contacto, redes.
2. **Páginas**: inicio, servicios, sobre nosotros, contacto, portfolio, blog, precios.
3. **Estilo**: 9 temas (modern, minimalist, creative, corporate, saas, cleantech, elegante, glass, terminal).
4. **Paleta**: presets o colores custom — se aplican en vivo al preview.
5. **Tipografía**: pares de Google Fonts.
6. **Secciones**: variante de cada bloque por página (reordenar, añadir, quitar).
7. **Contenido**: titulares, CTAs, servicios y SEO.
8. **Extras**: Formspree, Plausible/GA4, cookies, sitemap.
9. **Deploy**: dominio, GitHub, Dokploy.
10. **Montar web** 🚀 → proyecto en `Escritorio/webs-generadas/<cliente>` con log en vivo.

También por CLI: `npm run build:site -- recipes/cliente.recipe.json`

En el último paso puedes **copiar la receta JSON** (reproducible) o **copiar un prompt para Lovable** con todo el brief.

## Requisitos para la automatización completa

| Paso | Necesita |
|---|---|
| Generar proyecto + npm install + git | Nada extra |
| Crear repo GitHub + push | `GITHUB_TOKEN` en el entorno **o** `gh` CLI autenticado |
| Crear app + dominio + deploy en Dokploy | `DOKPLOY_API_TOKEN` + environment ID (ver guía) |

```powershell
$env:GITHUB_TOKEN="github_pat_…"
$env:DOKPLOY_API_TOKEN="…"
```

**Guía completa desde 0 (tokens, Cloudflare, personalización): [`docs/GUIA_PASO_A_PASO.md`](docs/GUIA_PASO_A_PASO.md)** · Guía técnica: [`docs/AUTOMATION_GUIDE.md`](docs/AUTOMATION_GUIDE.md) · Roadmap e ideas: [`docs/ROADMAP_IDEAS.md`](docs/ROADMAP_IDEAS.md)

## Estructura

```text
src/components/<categoría>/<tema>/   Librería real (~100 componentes, 9 temas)
src/data/recipeSchema.ts             Receta v2: tipos + presets
src/data/componentRegistry.ts        Registry de variantes con fallbacks por tema
src/components/automation/           Wizard (SiteBuilder.tsx) y shell
src/pages/preview.astro              Preview SSR (iframe del builder)
src/pages/api/build.ts               API de jobs (Montar web)
scripts/build-site.mjs               Orquestador: genera + instala + git + GitHub + Dokploy
recipes/                             Recetas guardadas (plantillas por cliente/nicho)
docs/PLAN.md                         Plan y arquitectura
docs/BUSINESS_IDEAS.md               Capa de negocio
docs/LOVABLE_PROMPT.md               Prompt maestro para Lovable
```

## Los proyectos generados

Cada web sale como proyecto independiente con: Astro 5 + Tailwind (+ React solo si usa navbars interactivas), paleta como CSS variables, Google Fonts, SEO, sitemap, Dockerfile + nginx.conf listos para Dokploy (puerto interno 80), `.gitignore`, README de personalización y su `site.recipe.json` para regenerarla o clonarla.
