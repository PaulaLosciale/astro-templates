# Plan del proyecto: Astro Lego Builder v2

> Actualizado: 5 julio 2026. Este documento es el plan de referencia del rediseño y el estado de cada fase.

## Objetivo de negocio

Crear webs de cliente **en minutos, no en días**: un builder visual tipo Wix donde eliges páginas, estilo, paleta, tipografía y secciones con preview en vivo, y un botón **"Montar web"** que deja un proyecto Astro independiente en el Escritorio, con dependencias instaladas, git inicializado, repo en GitHub y app conectada en Dokploy (Hetzner). Después solo queda personalizar contenido/logo del cliente y cobrar.

## Arquitectura

```
┌─────────────── astro-templates (este repo, la "fábrica") ───────────────┐
│                                                                          │
│  Builder visual (/)  ──receta v2──►  /api/build  ──spawn──►  build-site  │
│      │                                                          │        │
│      ▼ iframe                                                   ▼        │
│  /preview (SSR)                              Desktop/webs-generadas/<slug>│
│  renderiza componentes                       proyecto Astro independiente │
│  reales con paleta/fuentes                   npm install + git + GitHub   │
│                                              + Dokploy (app+dominio+deploy)│
└──────────────────────────────────────────────────────────────────────────┘
```

### Piezas clave

| Pieza | Archivo | Qué hace |
|---|---|---|
| Schema receta v2 | `src/data/recipeSchema.ts` | Tipos + presets (temas, paletas, fuentes, plantillas de página) |
| Registry | `src/data/componentRegistry.ts` | Mapa de ~100 componentes reales en 9 temas, con fallbacks |
| Mapa de módulos | `src/data/componentMap.ts` | `import.meta.glob` para resolver variantes en el preview |
| Wizard | `src/components/automation/SiteBuilder.tsx` | 10 pasos + preview en vivo + Montar web |
| Preview | `src/pages/preview.astro` | SSR de los componentes reales con la receta por query param |
| API jobs | `src/pages/api/build.ts` | POST lanza el build en background; GET devuelve progreso |
| Orquestador | `scripts/build-site.mjs` | Genera proyecto + npm install + git + GitHub + Dokploy |
| Colores | `src/utils/colors.ts` | hex → HSL y escala Tailwind 50-700 |
| Prompt Lovable | `src/utils/lovablePrompt.ts` | Genera el prompt desde la receta (botón en el paso final) |

### La librería de componentes

- 9 temas: modern, minimalist, creative, corporate, saas, cleantech, elegante, glass, terminal.
- 11 categorías de sección: navigation, heroes, features, about, cta, pricing, testimonials, faq, blog, contact, footers.
- Theming por CSS variables HSL (`--color-primary-500`…) mapeadas en Tailwind a `primary-*`, `secondary-*`, `accent-*`. La paleta del builder se convierte automáticamente en escala.
- Los ~440 archivos numerados vacíos (Hero03-30, etc.) que dejó una IA anterior fueron eliminados.

## Fases ejecutadas (5 julio 2026)

1. ✅ Limpieza: 468 archivos vacíos eliminados; import roto de `ContactSaaS` arreglado; imágenes movidas a `public/images`.
2. ✅ Receta v2 multi-página + registry con fallbacks por tema.
3. ✅ Preview SSR con componentes reales (adapter `@astrojs/node`).
4. ✅ Wizard de 10 pasos con preview en vivo, recetas guardadas y validación.
5. ✅ Orquestador completo + API de jobs con log en vivo.
6. ✅ Verificado end-to-end: receta de prueba → proyecto en `Desktop/webs-generadas/test-elegante` → `npm run build` OK (2 páginas + sitemap).

## Flujo de trabajo con un cliente nuevo

1. `npm run dev` en este repo → abre `http://localhost:4321`.
2. Rellena los 9 pasos (datos del negocio, páginas, estilo, paleta, tipografía, secciones, contenido, extras, deploy).
3. Paso 10 "Montar web": revisa el resumen y pulsa 🚀.
4. Abre el proyecto en `Desktop/webs-generadas/<cliente>` y personaliza (fotos, textos finos, logo).
5. Push → Dokploy redespliega solo.

Alternativa CLI: `npm run build:site -- recipes/cliente.recipe.json`.

## Pendiente / siguientes mejoras (prioridad de negocio)

1. **Parametrizar contenido en más componentes**: solo ~1/3 aceptan props; el resto lleva texto demo. Prioridad: heroes y CTAs de cada tema (title/description/ctas desde la receta).
2. **Miniaturas de variantes** en el paso Secciones (captura estática de cada componente).
3. **Página legal automática** (aviso legal, privacidad, cookies) generada con los datos del negocio — obligatorio para clientes reales en España (RGPD/LSSI).
4. **Sustitución de imágenes por IA o stock** según sector en el momento de generar.
5. **Multi-idioma** en el generador (es/en/ca…).
6. Ver `docs/BUSINESS_IDEAS.md` para la capa de negocio.
