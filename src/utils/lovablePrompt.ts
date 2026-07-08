// Genera un prompt listo para pegar en Lovable a partir de una receta del builder.
// Sirve como plan B: construir la misma web con Lovable en lugar del generador local.

import type { RecipeV2 } from "../data/recipeSchema";
import { sectionLabels, themes } from "../data/recipeSchema";
import { variantById } from "../data/componentRegistry";

export function buildLovablePrompt(recipe: RecipeV2): string {
  const theme = themes.find((t) => t.id === recipe.design.theme);
  const palette = recipe.design.palette;
  const fonts = recipe.design.typography;
  const socials = Object.entries(recipe.business.socials)
    .filter(([, url]) => url)
    .map(([network, url]) => `${network}: ${url}`)
    .join(", ");

  const pagesBlock = recipe.pages
    .map((page) => {
      const sections = page.sections
        .map((section) => {
          const variant = variantById(section.variant);
          const label = sectionLabels[section.category] ?? section.category;
          return variant ? `  - ${label}: estilo "${variant.label}" (${variant.description})` : `  - ${label}`;
        })
        .join("\n");
      return `- Página "${page.title}" (ruta ${page.path}):\n${sections}`;
    })
    .join("\n");

  const services = recipe.content.services
    .map((service) => `  - ${service.title}: ${service.description}`)
    .join("\n");

  return `Crea una página web completa, multi-página y responsive para el siguiente negocio. Usa React + Tailwind CSS con un diseño pixel-perfect, moderno y profesional. NO uses contenido lorem ipsum: usa el contenido real que te doy y complétalo de forma coherente con el sector cuando falte.

## Negocio
- Marca: ${recipe.business.brandName}
- Sector: ${recipe.business.sector}
- Descripción: ${recipe.business.description}
- Teléfono: ${recipe.business.phone} · Email: ${recipe.business.email}
- Dirección: ${recipe.business.address}, ${recipe.business.city}
- Horario: ${recipe.business.schedule}
${socials ? `- Redes sociales: ${socials}` : ""}
- Idioma de todos los textos: ${recipe.project.language === "es" ? "español" : recipe.project.language}

## Dirección de arte
- Estilo visual: ${theme?.label ?? recipe.design.theme} — ${theme?.description ?? ""} (pensado para: ${theme?.vibe ?? "negocios"})
- Paleta EXACTA (respétala): primario ${palette.primary}, secundario ${palette.secondary}, acento ${palette.accent}, fondo claro ${palette.background}, fondo oscuro ${palette.backgroundDark}, texto ${palette.text}.
${recipe.design.darkMode ? "- Incluye modo oscuro con toggle." : "- Solo modo claro."}
- Tipografía: titulares con "${fonts.heading}" y cuerpo con "${fonts.body}" (Google Fonts).
- Bordes, sombras y espaciado coherentes con el estilo elegido. Animaciones sutiles de entrada (fade/slide) al hacer scroll.

## Estructura del sitio (respeta páginas, orden y tipo de secciones)
${pagesBlock}

## Contenido clave
- Titular principal (hero de Inicio): "${recipe.content.headline}"
- Subtitular: "${recipe.content.subheadline}"
- CTA primario: "${recipe.content.primaryCta}" · CTA secundario: "${recipe.content.secondaryCta}"
- Servicios:
${services}

## SEO
- Title del sitio: "${recipe.seo.siteTitle}"
- Meta description: "${recipe.seo.description}"
${recipe.seo.keywords ? `- Keywords orientativas: ${recipe.seo.keywords}` : ""}
- Etiquetas semánticas correctas (h1 único por página, nav, main, footer), atributos alt en imágenes.

## Funcionalidad
- Navegación entre páginas con menú responsive (hamburguesa en móvil).
${recipe.integrations.forms === "formspree" ? `- Formulario de contacto conectado a Formspree (ID: ${recipe.integrations.formspreeId || "PENDIENTE"}), con estados de envío y éxito.` : "- Formulario de contacto con validación (sin backend, preparado para conectar)."}
${recipe.integrations.analytics !== "none" ? `- Integra ${recipe.integrations.analytics === "plausible" ? "Plausible Analytics" : "Google Analytics 4"} (ID: ${recipe.integrations.analyticsId || "PENDIENTE"}).` : ""}
${recipe.integrations.cookieBanner ? "- Banner de cookies simple con aceptación guardada en localStorage." : ""}
- Botón de WhatsApp flotante si hay número de WhatsApp.
- Footer con datos de contacto reales, enlaces a páginas y redes sociales.

## Calidad
- Mobile-first, accesible (contraste AA, focus visible) y rápido.
- Imágenes: usa placeholders elegantes acordes a la paleta (no fotos de stock aleatorias) que yo pueda sustituir después.`;
}
