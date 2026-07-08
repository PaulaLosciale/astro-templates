# Graph Report - .  (2026-07-05)

## Corpus Check
- 186 files · ~464,629 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 420 nodes · 471 edges · 101 communities (95 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.81)
- Token cost: 60,448 input · 4,300 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Wizard SiteBuilder|Wizard SiteBuilder]]
- [[_COMMUNITY_Orquestador build-site|Orquestador build-site]]
- [[_COMMUNITY_Wizard SiteBuilder|Wizard SiteBuilder]]
- [[_COMMUNITY_Wizard SiteBuilder|Wizard SiteBuilder]]
- [[_COMMUNITY_Tema Terminal|Tema Terminal]]
- [[_COMMUNITY_Datos schema, registry, mapa|Datos: schema, registry, mapa]]
- [[_COMMUNITY_Guía deploy y Cloudflare|Guía deploy y Cloudflare]]
- [[_COMMUNITY_Orquestador build-site|Orquestador build-site]]
- [[_COMMUNITY_Configuración TypeScript|Configuración TypeScript]]
- [[_COMMUNITY_Legacy deploy-site|Legacy deploy-site]]
- [[_COMMUNITY_Legacy generate-site|Legacy generate-site]]
- [[_COMMUNITY_Tema Modern|Tema Modern]]
- [[_COMMUNITY_Tema Glass|Tema Glass]]
- [[_COMMUNITY_Tema Modern|Tema Modern]]
- [[_COMMUNITY_Tema Elegante|Tema Elegante]]
- [[_COMMUNITY_Legacy validate-recipe|Legacy validate-recipe]]
- [[_COMMUNITY_API de builds|API de builds]]
- [[_COMMUNITY_Imágenes placeholder|Imágenes placeholder]]
- [[_COMMUNITY_Favicon Astro Logo Icon|Favicon Astro Logo Icon]]
- [[_COMMUNITY_Imágenes placeholder|Imágenes placeholder]]
- [[_COMMUNITY_API subida de fuentes|API subida de fuentes]]
- [[_COMMUNITY_Tema Glass|Tema Glass]]
- [[_COMMUNITY_Secciones base (galeríaequipolegal)|Secciones base (galería/equipo/legal)]]
- [[_COMMUNITY_Secciones base (galeríaequipolegal)|Secciones base (galería/equipo/legal)]]

## God Nodes (most connected - your core abstractions)
1. `generateProject()` - 18 edges
2. `compilerOptions` - 16 edges
3. `writeGeneratedComponents()` - 8 edges
4. `../layouts/Layout.astro` - 8 edges
5. `Dokploy` - 8 edges
6. `Guia completa desde 0` - 8 edges
7. `Roadmap: mejoras, implementaciones e ideas` - 8 edges
8. `main()` - 7 edges
9. `Receta v2` - 7 edges
10. `scripts` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Receta JSON` --conceptually_related_to--> `Receta v2`  [INFERRED]
  README.md → docs/PLAN.md
- `Astro rocket logo favicon (monochrome SVG, adapts fill to light/dark via prefers-color-scheme)` --semantically_similar_to--> `Astro wordmark logo SVG (rocket mark with red-to-magenta gradient flame plus 'astro' lettering)`  [INFERRED] [semantically similar]
  public/favicon.svg → src/assets/astro.svg
- `Panel de flota` --conceptually_related_to--> `Dokploy`  [INFERRED]
  docs/ROADMAP_IDEAS.md → README.md
- `astro-app Docker Compose service` --conceptually_related_to--> `Dokploy`  [INFERRED]
  docker-compose.yml → docs/AUTOMATION_GUIDE.md
- `Cuota de mantenimiento 25-50 EUR/mes` --semantically_similar_to--> `Maintenance + Hosting Recurring Revenue`  [INFERRED] [semantically similar]
  docs/ROADMAP_IDEAS.md → docs/BUSINESS_IDEAS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Automated Deployment Flow (GitHub + Dokploy on Hetzner)** — docs_plan_orquestador_build_site, docs_automation_guide_github_token, docs_automation_guide_dokploy_api_sequence, docs_automation_guide_dokploy, docs_automation_guide_hetzner_vps [EXTRACTED 1.00]
- **Montar Web Build Pipeline (wizard → API → orchestrator → project)** — docs_plan_sitebuilder_wizard, docs_plan_receta_v2, docs_plan_api_jobs, docs_plan_orquestador_build_site, readme_proyectos_generados [EXTRACTED 1.00]
- **Live Preview System (SSR of real components)** — docs_plan_preview_ssr, docs_plan_component_map, docs_plan_component_registry, docs_plan_component_library, docs_plan_css_variables_theming [EXTRACTED 1.00]
- **Flujo de publicacion: Montar web -> orquestador -> Dokploy -> Cloudflare DNS -> SSL** — readme_montar_web, readme_build_site_orquestador, readme_dokploy, docs_guia_paso_a_paso_cloudflare_dns, docs_guia_paso_a_paso_lets_encrypt_ssl [INFERRED 0.85]

## Communities (101 total, 6 thin omitted)

### Community 0 - "Wizard SiteBuilder"
Cohesion: 0.09
Nodes (35): BuildLogLine, BuildState, loadInitialRecipe(), SiteBuilder(), StepId, validateRecipe(), wizardSteps, applyThemeDefaults() (+27 more)

### Community 1 - "Orquestador build-site"
Cohesion: 0.10
Nodes (35): args, astroConfig(), configTs(), copyComponentWithDeps(), deriveScale(), dockerfile(), dokployApi(), ensureGithubRepo() (+27 more)

### Community 2 - "Wizard SiteBuilder"
Cohesion: 0.07
Nodes (26): ./SiteBuilder, ../modern/ContactForm, ../components/navigation/cleantech/NavbarClean, ../components/navigation/elegante/NavbarElegant, ../components/utils/ThemeToggle, ../styles/global.css, ../styles/theme.css, ../components/about/cleantech/AboutClean.astro (+18 more)

### Community 3 - "Wizard SiteBuilder"
Cohesion: 0.09
Nodes (27): astro-app Docker Compose service, Dokploy, Dokploy API Deploy Sequence, GitHub Token / gh CLI Auth, Hetzner VPS, Automatic RGPD/LSSI Legal Page, Niche Recipe Templates, Productized Web Packages (+19 more)

### Community 4 - "Tema Terminal"
Cohesion: 0.11
Nodes (14): ../components/navigation/terminal/NavbarTerminal, reactVariants, ../components/cta/terminal/CTATerminal.astro, ../components/features/terminal/FeaturesTerminal.astro, ../components/heroes/terminal/HeroTerminal.astro, NavbarClean(), NavbarCorporate(), NavbarCreative() (+6 more)

### Community 5 - "Datos: schema, registry, mapa"
Cohesion: 0.10
Nodes (21): ../components/automation/PreviewReactSection, ../data/componentMap, ../data/componentRegistry, ../data/recipeSchema, ../utils/colors, astroModules, reactModules, resolveComponent() (+13 more)

### Community 6 - "Guía deploy y Cloudflare"
Cohesion: 0.11
Nodes (24): Builder → GitHub → Dokploy Flow, Guia completa desde 0, API key de Dokploy, Cloudflare DNS, Environment ID de Dokploy, Formspree, GitHub Provider ID de Dokploy, SSL Let's Encrypt (+16 more)

### Community 7 - "Orquestador build-site"
Cohesion: 0.09
Nodes (22): dependencies, astro, @astrojs/node, @astrojs/react, react, react-dom, @types/react, @types/react-dom (+14 more)

### Community 8 - "Configuración TypeScript"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, jsxImportSource (+12 more)

### Community 9 - "Legacy deploy-site"
Cohesion: 0.23
Nodes (11): commandExists(), dokploy(), ensureDokployApplication(), ensureGithubRepo(), ensureRemote(), github(), recipe, run() (+3 more)

### Community 10 - "Legacy generate-site"
Cohesion: 0.24
Nodes (11): contactComponent(), featureComponent(), footerComponent(), heroComponent(), navbarComponent(), outputDir, pricingComponent(), processComponent() (+3 more)

### Community 11 - "Tema Modern"
Cohesion: 0.24
Nodes (6): ../../components/cta/modern/CTA01.astro, ../../components/features/modern/Features01.astro, ../../components/footers/modern/Footer01.astro, currentYear, ../../components/heroes/modern/Hero01.astro, ../../components/navigation/Header01.astro

### Community 12 - "Tema Glass"
Cohesion: 0.29
Nodes (4): ../components/navigation/glass/NavbarGlass, ../components/cta/glass/CTAGlass.astro, ../components/features/glass/FeaturesGlass.astro, ../components/heroes/glass/HeroGlass.astro

### Community 14 - "Tema Elegante"
Cohesion: 0.60
Nodes (5): Minimalist fashion editorial aesthetic (neutral palette, concrete architecture, elegant styling), Minimalist fashion photo: woman in cream oversized blazer and black trousers on a concrete rooftop terrace, editorial street-style mood, wide landscape crop suited for a hero background, Vogue-style editorial mockup: model in oversized grey double-breasted suit against pale concrete wall, with overlaid text 'VOGUE / ZARA / EDITORIAL NO. 4 // MINIMALIST / PHOTOGRAPHY BY SARAH MILES'; magazine-layout hero image used by HeroElegant, Luxury product still life: tan pebbled-leather crossbody bag with gold hardware on a travertine stone ledge, warm beige palette with dried palm leaf and gold necklace, soft window light; product/section background shot, HeroElegant Astro component (elegante theme hero section)

### Community 15 - "Legacy validate-recipe"
Cohesion: 0.40
Nodes (3): issues, recipe, warnings

### Community 17 - "Imágenes placeholder"
Cohesion: 0.83
Nodes (4): Dark studio photographer aesthetic: low-key cinematic scenes of photographers at work in charcoal-walled studios, shared visual theme of the AI-generated placeholder set, Black-and-white architectural abstract: hard sunlight casting steel-truss shadows across a concrete wall; high-contrast, minimalist, dramatic mood; suited as a hero or section background with text overlaid on the dark areas, Moody editorial photo: male photographer seated in a dark charcoal-walled studio looking through a camera, second camera, notebook and coffee on a wooden table; cinematic low-key lighting; likely hero background or about/portfolio section image, Moody editorial photo: female photographer on a stool in a dark studio shooting a still-life (vase with dried branch on wooden table) beside a frosted industrial window; low-key cinematic lighting; likely hero background or about/portfolio section image

### Community 18 - "Favicon Astro Logo Icon"
Cohesion: 1.00
Nodes (3): Astro rocket logo favicon (monochrome SVG, adapts fill to light/dark via prefers-color-scheme), Astro wordmark logo SVG (rocket mark with red-to-magenta gradient flame plus 'astro' lettering), Decorative 1440x1024 background SVG with two low-opacity organic blob shapes using blue-purple and red-magenta gradients (default Astro starter art)

### Community 19 - "Imágenes placeholder"
Cohesion: 1.00
Nodes (3): Minimalist product shot: black leather loafers with gold horsebit detail on a beige concrete floor, straw basket and white shirt in soft-lit neutral interior; warm editorial fashion aesthetic, likely hero or product-section background for an elegant/minimal template, Black-and-white editorial fashion portrait: pensive woman with short dark hair in a black turtleneck and coat, hand at chin, against blurred stone wall; moody high-fashion mood, likely hero or about-section background for an elegant template, Dramatic black-and-white architectural photo: brutalist concrete museum (MAXXI-like cantilevered volumes) under dark sky with lone pedestrian for scale; bold monochrome mood, likely wide hero background or features-section backdrop

## Knowledge Gaps
- **114 isolated node(s):** `name`, `type`, `version`, `dev`, `build` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../layouts/Layout.astro` connect `Wizard SiteBuilder` to `Tema Modern`, `Tema Glass`, `Tema Terminal`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `../styles/global.css` connect `Wizard SiteBuilder` to `Datos: schema, registry, mapa`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Wizard SiteBuilder` be split into smaller, more focused modules?**
  _Cohesion score 0.09291521486643438 - nodes in this community are weakly interconnected._
- **Should `Orquestador build-site` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._
- **Should `Wizard SiteBuilder` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._
- **Should `Wizard SiteBuilder` be split into smaller, more focused modules?**
  _Cohesion score 0.08831908831908832 - nodes in this community are weakly interconnected._