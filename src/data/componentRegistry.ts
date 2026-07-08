// Registry de la librería real de componentes: cada variante que el builder puede
// elegir, con su archivo, export y tema. El generador copia estos archivos al
// proyecto final y el preview los renderiza en vivo.

import type { RecipeV2, SectionCategory, ThemeId } from "./recipeSchema";

export type ComponentVariant = {
  /** id estable: categoria/tema/Archivo (sin extensión) */
  id: string;
  category: SectionCategory;
  theme: ThemeId | "base";
  label: string;
  description: string;
  /** ruta relativa a src/components */
  file: string;
  /** nombre del export para .tsx con named export; null = default o .astro */
  exportName: string | null;
  isReact: boolean;
};

function v(
  category: SectionCategory,
  theme: ThemeId | "base",
  file: string,
  label: string,
  description: string,
  opts: { exportName?: string | null; isReact?: boolean } = {},
): ComponentVariant {
  const id = file.replace(/\.(astro|tsx)$/, "");
  return {
    id,
    category,
    theme,
    label,
    description,
    file,
    exportName: opts.exportName ?? null,
    isReact: opts.isReact ?? file.endsWith(".tsx"),
  };
}

export const componentVariants: ComponentVariant[] = [
  // --- Navegación ---
  v("navigation", "base", "navigation/Header01.astro", "Header clásico", "Barra simple con logo, links y CTA."),
  v("navigation", "base", "navigation/Header02.astro", "Header centrado", "Logo centrado con navegación equilibrada."),
  v("navigation", "base", "navigation/Header03.astro", "Header con acciones", "Navegación con botones de acción destacados."),
  v("navigation", "base", "navigation/Header04.astro", "Header compacto", "Barra fina para webs sencillas."),
  v("navigation", "modern", "navigation/modern/Header05.astro", "Header moderno", "Header estático del tema modern."),
  v("navigation", "modern", "navigation/modern/NavbarModern.tsx", "Navbar moderna", "Navbar interactiva con menú móvil.", { exportName: "NavbarModern" }),
  v("navigation", "modern", "navigation/modern/Navbar.tsx", "Navbar app", "Navbar estilo aplicación con CTA.", { exportName: "Navbar" }),
  v("navigation", "minimalist", "navigation/minimalist/NavbarMinimal.tsx", "Navbar minimal", "Navegación reducida a lo esencial.", { exportName: "NavbarMinimal" }),
  v("navigation", "creative", "navigation/creative/Header06.astro", "Header creativo", "Header estático con carácter."),
  v("navigation", "creative", "navigation/creative/NavbarCreative.tsx", "Navbar creativa", "Navegación atrevida con acentos.", { exportName: "NavbarCreative" }),
  v("navigation", "corporate", "navigation/corporate/NavbarCorporate.tsx", "Navbar corporativa", "Navegación formal con jerarquía clara.", { exportName: "NavbarCorporate" }),
  v("navigation", "saas", "navigation/saas/NavbarSaaS.tsx", "Navbar SaaS", "Navbar de producto con login y CTA.", { exportName: "NavbarSaaS" }),
  v("navigation", "cleantech", "navigation/cleantech/NavbarClean.tsx", "Navbar clean", "Navegación fresca y ligera.", { exportName: "NavbarClean" }),
  v("navigation", "elegante", "navigation/elegante/NavbarElegant.tsx", "Navbar elegante", "Navegación editorial minimalista.", { exportName: "NavbarElegant" }),
  v("navigation", "glass", "navigation/glass/NavbarGlass.tsx", "Navbar glass", "Barra translúcida con blur.", { exportName: null }),
  v("navigation", "terminal", "navigation/terminal/NavbarTerminal.tsx", "Navbar terminal", "Barra estilo consola dev.", { exportName: "NavbarTerminal" }),

  // --- Galería / Equipo / Legal / Carta / Mapa (base: valen para todos los temas) ---
  v("gallery", "base", "gallery/base/GalleryGrid.astro", "Galería grid", "Rejilla de fotos con hover y pieza destacada."),
  v("team", "base", "team/base/TeamGrid.astro", "Equipo tarjetas", "Tarjetas de equipo con avatar de iniciales."),
  v("legal", "base", "legal/base/LegalText.astro", "Texto legal", "Plantilla de aviso legal/privacidad con datos del negocio."),
  v("menu", "base", "menu/base/MenuList.astro", "Carta clásica", "Carta de restaurante por secciones con precios."),
  v("map", "base", "map/base/MapEmbed.astro", "Mapa Google", "Mapa embebido de Google Maps con ubicación."),

  // --- Heroes ---
  v("heroes", "modern", "heroes/modern/HeroModern.astro", "Hero moderno", "Titular partido con acento de color y panel visual."),
  v("heroes", "modern", "heroes/modern/Hero01.astro", "Hero split", "Hero a dos columnas con imagen."),
  v("heroes", "minimalist", "heroes/minimalist/HeroMinimal.astro", "Hero minimal", "Solo tipografía y aire, sin ruido."),
  v("heroes", "minimalist", "heroes/minimalist/Hero03.astro", "Hero centrado", "Mensaje centrado con CTA único."),
  v("heroes", "creative", "heroes/creative/HeroCreative.astro", "Hero creativo", "Composición asimétrica con colores vivos."),
  v("heroes", "creative", "heroes/creative/Hero02.astro", "Hero collage", "Hero con elementos superpuestos."),
  v("heroes", "corporate", "heroes/corporate/HeroCorporate.astro", "Hero corporativo", "Mensaje sólido orientado a confianza."),
  v("heroes", "corporate", "heroes/corporate/HeroCorporateSplit.astro", "Hero corporativo split", "Dos columnas con métricas de confianza e imagen."),
  v("heroes", "saas", "heroes/saas/HeroSaaS.astro", "Hero SaaS", "Promesa de producto con CTA de registro."),
  v("heroes", "cleantech", "heroes/cleantech/HeroClean.astro", "Hero clean", "Hero fresco con estética sostenible."),
  v("heroes", "elegante", "heroes/elegante/HeroElegant.astro", "Hero editorial", "Foto a pantalla completa con titular de moda."),
  v("heroes", "elegante", "heroes/elegante/HeroElegantSplit.astro", "Hero elegante split", "Mitad texto serif, mitad fotografía editorial."),
  v("heroes", "glass", "heroes/glass/HeroGlass.astro", "Hero glass", "Paneles translúcidos sobre blobs de color."),
  v("heroes", "glass", "heroes/glass/HeroGlassCentered.astro", "Hero glass centrado", "Panel central translúcido sobre blobs vibrantes."),
  v("heroes", "terminal", "heroes/terminal/HeroTerminal.astro", "Hero terminal", "Estética de consola con acento verde."),
  v("heroes", "terminal", "heroes/terminal/HeroTerminalCompact.astro", "Hero terminal ventana", "Ventana de terminal con prompt y CTA."),

  // --- Features / Servicios ---
  v("features", "modern", "features/modern/FeaturesModern.astro", "Features moderno", "Grid de beneficios con iconos."),
  v("features", "modern", "features/modern/Features01.astro", "Features grid", "Tarjetas de servicio en rejilla."),
  v("features", "minimalist", "features/minimalist/FeaturesMinimal.astro", "Features minimal", "Lista limpia sin decoración."),
  v("features", "minimalist", "features/minimalist/Features03.astro", "Features lista", "Beneficios en columna con numeración."),
  v("features", "creative", "features/creative/FeaturesCreative.astro", "Features creativo", "Tarjetas con personalidad y color."),
  v("features", "creative", "features/creative/Features02.astro", "Features bento", "Composición tipo bento asimétrica."),
  v("features", "corporate", "features/corporate/FeaturesCorporate.astro", "Features corporativo", "Servicios con estructura formal."),
  v("features", "saas", "features/saas/FeaturesSaaS.astro", "Features SaaS", "Capacidades de producto orientadas a valor."),
  v("features", "cleantech", "features/cleantech/FeaturesClean.astro", "Features clean", "Beneficios con aire tecnológico limpio."),
  v("features", "elegante", "features/elegante/FeaturesElegant.astro", "Features elegante", "Servicios en clave editorial."),
  v("features", "elegante", "features/elegante/FeaturesElegantEditorial.astro", "Features editorial numerado", "Servicios numerados en rejilla con línea fina."),
  v("features", "glass", "features/glass/FeaturesGlass.astro", "Features glass", "Tarjetas translúcidas con blur."),
  v("features", "glass", "features/glass/FeaturesGlassPanels.astro", "Features glass paneles", "Seis paneles translúcidos con iconos."),
  v("features", "terminal", "features/terminal/FeaturesTerminal.astro", "Features terminal", "Capacidades presentadas como consola."),

  // --- About ---
  v("about", "modern", "about/modern/AboutModern.astro", "About moderno", "Historia de la marca con imagen."),
  v("about", "modern", "about/modern/About01.astro", "About split", "Texto e imagen a dos columnas."),
  v("about", "minimalist", "about/minimalist/AboutMinimal.astro", "About minimal", "Biografía sobria centrada en texto."),
  v("about", "creative", "about/creative/AboutCreative.astro", "About creativo", "Presentación con carácter visual."),
  v("about", "creative", "about/creative/About02.astro", "About collage", "Sobre nosotros con composición libre."),
  v("about", "corporate", "about/corporate/AboutCorporate.astro", "About corporativo", "Presentación institucional."),
  v("about", "saas", "about/saas/AboutSaaS.astro", "About SaaS", "Misión y equipo orientado a producto."),
  v("about", "cleantech", "about/cleantech/AboutClean.astro", "About clean", "Valores y sostenibilidad."),
  v("about", "elegante", "about/elegante/AboutElegant.astro", "About elegante", "Historia de marca editorial."),

  // --- CTA ---
  v("cta", "modern", "cta/modern/CTAModern.astro", "CTA moderno", "Banda de conversión con botón destacado."),
  v("cta", "modern", "cta/modern/CTA01.astro", "CTA panel", "Panel de llamada a la acción con fondo de color."),
  v("cta", "minimalist", "cta/minimalist/CTAMinimal.astro", "CTA minimal", "Frase + botón, sin distracción."),
  v("cta", "minimalist", "cta/minimalist/CTA03.astro", "CTA línea", "CTA en una sola línea."),
  v("cta", "creative", "cta/creative/CTACreative.astro", "CTA creativo", "Llamada a la acción con energía visual."),
  v("cta", "creative", "cta/creative/CTA02.astro", "CTA grande", "CTA a gran tamaño tipográfico."),
  v("cta", "corporate", "cta/corporate/CTACorporate.astro", "CTA corporativo", "Cierre formal orientado a contacto."),
  v("cta", "saas", "cta/saas/CTASaaS.astro", "CTA SaaS", "Empuje final a prueba gratuita."),
  v("cta", "cleantech", "cta/cleantech/CTAClean.astro", "CTA clean", "Conversión con estética limpia."),
  v("cta", "elegante", "cta/elegante/CTAElegant.astro", "CTA elegante", "Invitación premium y discreta."),
  v("cta", "glass", "cta/glass/CTAGlass.astro", "CTA glass", "Panel translúcido de conversión."),
  v("cta", "terminal", "cta/terminal/CTATerminal.astro", "CTA terminal", "Comando final estilo consola."),

  // --- Pricing ---
  v("pricing", "modern", "pricing/modern/PricingModern.astro", "Pricing moderno", "Tres planes con plan destacado."),
  v("pricing", "modern", "pricing/modern/Pricing01.astro", "Pricing tarjetas", "Planes en tarjetas comparables."),
  v("pricing", "minimalist", "pricing/minimalist/PricingMinimal.astro", "Pricing minimal", "Tabla de precios sobria."),
  v("pricing", "creative", "pricing/creative/PricingCreative.astro", "Pricing creativo", "Planes con personalidad."),
  v("pricing", "creative", "pricing/creative/Pricing02.astro", "Pricing destacado", "Un plan protagonista."),
  v("pricing", "corporate", "pricing/corporate/PricingCorporate.astro", "Pricing corporativo", "Precios con enfoque B2B."),
  v("pricing", "saas", "pricing/saas/PricingSaaS.astro", "Pricing SaaS", "Planes mensual/anual de producto."),
  v("pricing", "cleantech", "pricing/cleantech/PricingClean.astro", "Pricing clean", "Precios con estética ligera."),

  // --- Testimonios ---
  v("testimonials", "modern", "testimonials/modern/TestimonialsModern.astro", "Testimonios moderno", "Opiniones en tarjetas con avatar."),
  v("testimonials", "modern", "testimonials/modern/Testimonials01.astro", "Testimonios grid", "Rejilla de reseñas."),
  v("testimonials", "minimalist", "testimonials/minimalist/TestimonialsMinimal.astro", "Testimonios minimal", "Citas destacadas sin adorno."),
  v("testimonials", "minimalist", "testimonials/minimalist/Testimonials02.astro", "Testimonio único", "Una gran cita protagonista."),
  v("testimonials", "creative", "testimonials/creative/TestimonialsCreative.astro", "Testimonios creativo", "Reseñas con composición viva."),
  v("testimonials", "corporate", "testimonials/corporate/TestimonialsCorporate.astro", "Testimonios corporativo", "Casos de éxito con logos."),
  v("testimonials", "saas", "testimonials/saas/TestimonialsSaaS.astro", "Testimonios SaaS", "Social proof de usuarios."),
  v("testimonials", "cleantech", "testimonials/cleantech/TestimonialsClean.astro", "Testimonios clean", "Opiniones con aire limpio."),

  // --- FAQ ---
  v("faq", "modern", "faq/modern/FAQModern.astro", "FAQ moderno", "Acordeón de preguntas frecuentes."),
  v("faq", "modern", "faq/modern/FAQ01.astro", "FAQ dos columnas", "Preguntas en rejilla."),
  v("faq", "minimalist", "faq/minimalist/FAQMinimal.astro", "FAQ minimal", "Preguntas y respuestas planas."),
  v("faq", "creative", "faq/creative/FAQCreative.astro", "FAQ creativo", "FAQ con estilo propio."),
  v("faq", "creative", "faq/creative/FAQ02.astro", "FAQ destacado", "Preguntas con tarjetas de color."),
  v("faq", "corporate", "faq/corporate/FAQCorporate.astro", "FAQ corporativo", "Dudas frecuentes en tono formal."),
  v("faq", "saas", "faq/saas/FAQSaaS.astro", "FAQ SaaS", "Objeciones de compra resueltas."),
  v("faq", "cleantech", "faq/cleantech/FAQClean.astro", "FAQ clean", "Preguntas con estética ligera."),

  // --- Blog ---
  v("blog", "modern", "blog/modern/BlogModern.astro", "Blog moderno", "Últimos artículos en tarjetas."),
  v("blog", "modern", "blog/modern/BlogGrid01.astro", "Blog grid", "Rejilla de posts con imagen."),
  v("blog", "minimalist", "blog/minimalist/BlogMinimal.astro", "Blog minimal", "Lista editorial de artículos."),
  v("blog", "creative", "blog/creative/BlogCreative.astro", "Blog creativo", "Posts con composición libre."),
  v("blog", "corporate", "blog/corporate/BlogCorporate.astro", "Blog corporativo", "Noticias de empresa."),
  v("blog", "saas", "blog/saas/BlogSaaS.astro", "Blog SaaS", "Changelog y artículos de producto."),
  v("blog", "cleantech", "blog/cleantech/BlogClean.astro", "Blog clean", "Artículos con aire limpio."),

  // --- Contacto ---
  v("contact", "modern", "contact/modern/ContactModern.astro", "Contacto moderno", "Formulario interactivo con datos de contacto."),
  v("contact", "modern", "contact/modern/Contact01.astro", "Contacto split", "Formulario y datos a dos columnas."),
  v("contact", "minimalist", "contact/minimalist/ContactMinimal.astro", "Contacto minimal", "Formulario reducido a lo esencial."),
  v("contact", "creative", "contact/creative/ContactCreative.astro", "Contacto creativo", "Contacto con personalidad."),
  v("contact", "corporate", "contact/corporate/ContactCorporate.astro", "Contacto corporativo", "Contacto formal con oficinas."),
  v("contact", "saas", "contact/saas/ContactSaaS.astro", "Contacto SaaS", "Contacto de ventas y soporte."),
  v("contact", "cleantech", "contact/cleantech/ContactClean.astro", "Contacto clean", "Formulario con estética limpia."),

  // --- Footers ---
  v("footers", "modern", "footers/modern/FooterModern.astro", "Footer moderno", "Footer con columnas de enlaces."),
  v("footers", "modern", "footers/modern/Footer01.astro", "Footer completo", "Footer con enlaces, legal y redes."),
  v("footers", "minimalist", "footers/minimalist/FooterMinimal.astro", "Footer minimal", "Cierre sencillo en una línea."),
  v("footers", "creative", "footers/creative/FooterCreative.astro", "Footer creativo", "Cierre con carácter visual."),
  v("footers", "creative", "footers/creative/Footer02.astro", "Footer grande", "Footer con marca a gran tamaño."),
  v("footers", "corporate", "footers/corporate/FooterCorporate.astro", "Footer corporativo", "Footer institucional con legal."),
  v("footers", "saas", "footers/saas/FooterSaaS.astro", "Footer SaaS", "Footer de producto con enlaces."),
  v("footers", "cleantech", "footers/cleantech/FooterClean.astro", "Footer clean", "Cierre limpio y ligero."),
];

/** Cadena de fallback cuando un tema no tiene variante para una categoría. */
const themeFallbacks: Record<ThemeId, ThemeId[]> = {
  modern: [],
  minimalist: ["modern"],
  creative: ["modern"],
  corporate: ["modern"],
  saas: ["modern"],
  cleantech: ["modern"],
  elegante: ["minimalist", "modern"],
  glass: ["creative", "modern"],
  terminal: ["corporate", "saas", "modern"],
};

export function variantById(id: string): ComponentVariant | undefined {
  return componentVariants.find((variant) => variant.id === id);
}

export function variantsByCategory(category: SectionCategory): ComponentVariant[] {
  return componentVariants.filter((variant) => variant.category === category);
}

/** Variantes del tema para una categoría, con fallback a temas compatibles. */
export function variantsFor(category: SectionCategory, theme: ThemeId): ComponentVariant[] {
  const all = variantsByCategory(category);
  const own = all.filter((variant) => variant.theme === theme);
  if (own.length > 0) return own;
  for (const fallback of themeFallbacks[theme]) {
    const matches = all.filter((variant) => variant.theme === fallback);
    if (matches.length > 0) return matches;
  }
  return all.filter((variant) => variant.theme === "base");
}

export function defaultVariantFor(category: SectionCategory, theme: ThemeId): ComponentVariant | undefined {
  return variantsFor(category, theme)[0] ?? variantsByCategory(category)[0];
}

/**
 * Todas las variantes de una categoría agrupadas para el selector del builder:
 * primero las recomendadas para el tema (tema propio + base), después el resto
 * de estilos, para poder mezclar piezas de cualquier tema en una misma web.
 */
export function groupedVariantsFor(
  category: SectionCategory,
  theme: ThemeId,
): { recommended: ComponentVariant[]; others: ComponentVariant[] } {
  const all = variantsByCategory(category);
  const recommendedList = variantsFor(category, theme);
  const base = all.filter((variant) => variant.theme === "base" && !recommendedList.includes(variant));
  const recommended = [...recommendedList, ...base];
  const others = all.filter((variant) => !recommended.includes(variant));
  return { recommended, others };
}

/** Rellena variantes vacías o inexistentes de una receta según su tema. */
export function applyThemeDefaults<T extends RecipeV2>(recipe: T): T {
  const pages = recipe.pages.map((page) => ({
    ...page,
    sections: page.sections.map((section) => {
      if (section.variant && variantById(section.variant)) return section;
      const fallback = defaultVariantFor(section.category, recipe.design.theme);
      return { ...section, variant: fallback?.id ?? "" };
    }),
  }));
  return { ...recipe, pages };
}
