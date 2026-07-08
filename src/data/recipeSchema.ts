// Receta v2: define TODO lo que el builder pregunta y lo que el generador necesita.
// Una receta = una web completa (multi-página) lista para generar, subir y desplegar.

export type ThemeId =
  | "modern"
  | "minimalist"
  | "creative"
  | "corporate"
  | "saas"
  | "cleantech"
  | "elegante"
  | "glass"
  | "terminal";

export type SectionCategory =
  | "navigation"
  | "heroes"
  | "features"
  | "about"
  | "cta"
  | "pricing"
  | "testimonials"
  | "faq"
  | "blog"
  | "contact"
  | "footers"
  | "gallery"
  | "team"
  | "legal"
  | "menu"
  | "map";

export type PaletteChoice = {
  id: string;
  label: string;
  /** Colores base en hex; la escala 50-700 se deriva automáticamente. */
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundDark: string;
  text: string;
  textDark: string;
};

export type FontPair = {
  id: string;
  label: string;
  heading: string;
  body: string;
  /** URL family params para Google Fonts (vacío si la fuente es subida) */
  googleFamilies: string[];
  /** fallback CSS stack */
  headingStack: string;
  bodyStack: string;
};

/** Fuente subida por el usuario (ttf/otf/woff/woff2), servida desde /custom-fonts/. */
export type CustomFont = {
  /** nombre de familia CSS, ej. "Recoleta" */
  family: string;
  /** ruta pública, ej. "/custom-fonts/recoleta.woff2" */
  file: string;
  /** formato para @font-face: truetype | opentype | woff | woff2 */
  format: string;
  /** dónde se aplica */
  role: "heading" | "body" | "both";
};

export type PageSection = {
  category: SectionCategory;
  /** id de variante del componentRegistry, ej. "heroes/elegante/HeroElegant" */
  variant: string;
};

export type PageConfig = {
  id: string;
  title: string;
  /** ruta, ej. "/" o "/servicios" */
  path: string;
  sections: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
};

export type RecipeV2 = {
  version: 2;
  project: {
    name: string;
    /** idioma principal (código ISO: es, en, ca, fr, de, it, pt) */
    language: string;
    /** idiomas adicionales: genera copias /en/, /fr/… con hreflang y selector */
    extraLanguages: string[];
    /** carpeta raíz donde se crean los proyectos; por defecto Desktop/webs-generadas */
    outputRoot: string;
  };
  business: {
    brandName: string;
    sector: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    schedule: string;
    socials: {
      instagram: string;
      facebook: string;
      linkedin: string;
      tiktok: string;
      x: string;
      youtube: string;
      whatsapp: string;
    };
  };
  design: {
    theme: ThemeId;
    palette: PaletteChoice;
    typography: FontPair;
    /** fuentes subidas por el usuario; tienen prioridad sobre typography según su role */
    customFonts: CustomFont[];
    darkMode: boolean;
  };
  pages: PageConfig[];
  content: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    services: Array<{ title: string; description: string }>;
  };
  seo: {
    siteTitle: string;
    description: string;
    keywords: string;
  };
  integrations: {
    forms: "none" | "formspree";
    formspreeId: string;
    analytics: "none" | "plausible" | "ga4";
    analyticsId: string;
    cookieBanner: boolean;
    sitemap: boolean;
    widgets: {
      /** Crisp chat: Website ID */
      crispId: string;
      /** Tawk.to: property ID (ej. "abc123/default") */
      tawktoId: string;
      /** URL de reservas Calendly o Cal.com (botón flotante) */
      bookingUrl: string;
      /** URL de embed de Google Maps (iframe, para la sección Mapa) */
      gmapsEmbed: string;
      /** script personalizado (se inyecta tal cual antes de </body>) */
      customScript: string;
    };
  };
  deployment: {
    domain: string;
    createGithub: boolean;
    setupDokploy: boolean;
    installDeps: boolean;
    github: {
      owner: string;
      repo: string;
      visibility: "private" | "public";
      branch: string;
      providerId: string;
    };
    dokploy: {
      url: string;
      environmentId: string;
      serverId: string;
      applicationId: string;
      internalPort: number;
    };
    env: Record<string, string>;
  };
};

export const themes: Array<{ id: ThemeId; label: string; description: string; vibe: string }> = [
  { id: "modern", label: "Modern", description: "Limpio, actual, con acentos de color y formas suaves.", vibe: "Agencias, apps, servicios digitales" },
  { id: "minimalist", label: "Minimalista", description: "Máximo aire, tipografía protagonista, casi sin adornos.", vibe: "Estudios, portfolios, consultoría" },
  { id: "creative", label: "Creativo", description: "Atrevido, asimétrico, colores vivos y personalidad.", vibe: "Diseñadores, artistas, marcas jóvenes" },
  { id: "corporate", label: "Corporativo", description: "Serio, estructurado, transmite confianza y solidez.", vibe: "Empresas, despachos, B2B" },
  { id: "saas", label: "SaaS", description: "Orientado a producto: features, pricing y conversión.", vibe: "Startups, apps, productos digitales" },
  { id: "cleantech", label: "Clean tech", description: "Fresco y tecnológico con estética sostenible.", vibe: "Energía, salud, medio ambiente" },
  { id: "elegante", label: "Elegante", description: "Editorial de lujo: fotos grandes, serifas, mucho contraste.", vibe: "Moda, restaurantes premium, bodas" },
  { id: "glass", label: "Glassmorfismo", description: "Paneles translúcidos, blobs de color, muy vistoso.", vibe: "Tech, eventos, productos creativos" },
  { id: "terminal", label: "Terminal", description: "Estética dev/hacker: mono-espaciada, dark, precisa.", vibe: "Developers, automatización, IT" },
];

export const palettePresets: PaletteChoice[] = [
  { id: "azul-confianza", label: "Azul confianza", primary: "#2563eb", secondary: "#7c3aed", accent: "#06b6d4", background: "#ffffff", backgroundDark: "#0b1220", text: "#0f172a", textDark: "#f1f5f9" },
  { id: "verde-natural", label: "Verde natural", primary: "#059669", secondary: "#0d9488", accent: "#84cc16", background: "#f8fafc", backgroundDark: "#08130f", text: "#052e16", textDark: "#ecfdf5" },
  { id: "tierra-calida", label: "Tierra cálida", primary: "#b45309", secondary: "#78350f", accent: "#e11d48", background: "#faf6f0", backgroundDark: "#1c1410", text: "#292524", textDark: "#fef3c7" },
  { id: "negro-editorial", label: "Negro editorial", primary: "#18181b", secondary: "#52525b", accent: "#c2410c", background: "#fafafa", backgroundDark: "#09090b", text: "#18181b", textDark: "#fafafa" },
  { id: "violeta-creativo", label: "Violeta creativo", primary: "#7c3aed", secondary: "#db2777", accent: "#f59e0b", background: "#ffffff", backgroundDark: "#150a24", text: "#1e1b4b", textDark: "#ede9fe" },
  { id: "coral-comercial", label: "Coral comercial", primary: "#f97316", secondary: "#2563eb", accent: "#ec4899", background: "#fff7ed", backgroundDark: "#1a120b", text: "#1c1917", textDark: "#ffedd5" },
  { id: "burdeos-premium", label: "Burdeos premium", primary: "#9f1239", secondary: "#1e293b", accent: "#d4a373", background: "#fdf8f6", backgroundDark: "#180509", text: "#1f2937", textDark: "#fce7f3" },
  { id: "lima-operator", label: "Lima operator", primary: "#84cc16", secondary: "#38bdf8", accent: "#facc15", background: "#f7fee7", backgroundDark: "#070b12", text: "#1a2e05", textDark: "#f8fafc" },
];

export const fontPresets: FontPair[] = [
  { id: "inter", label: "Inter (neutra moderna)", heading: "Inter", body: "Inter", googleFamilies: ["Inter:wght@400;500;600;700;800;900"], headingStack: "'Inter', system-ui, sans-serif", bodyStack: "'Inter', system-ui, sans-serif" },
  { id: "playfair-inter", label: "Playfair + Inter (editorial)", heading: "Playfair Display", body: "Inter", googleFamilies: ["Playfair+Display:wght@400;600;700;900", "Inter:wght@400;500;600"], headingStack: "'Playfair Display', Georgia, serif", bodyStack: "'Inter', system-ui, sans-serif" },
  { id: "space-grotesk", label: "Space Grotesk + Inter (tech)", heading: "Space Grotesk", body: "Inter", googleFamilies: ["Space+Grotesk:wght@400;500;700", "Inter:wght@400;500;600"], headingStack: "'Space Grotesk', system-ui, sans-serif", bodyStack: "'Inter', system-ui, sans-serif" },
  { id: "dm-serif", label: "DM Serif + DM Sans (elegante)", heading: "DM Serif Display", body: "DM Sans", googleFamilies: ["DM+Serif+Display", "DM+Sans:wght@400;500;700"], headingStack: "'DM Serif Display', Georgia, serif", bodyStack: "'DM Sans', system-ui, sans-serif" },
  { id: "poppins-open", label: "Poppins + Open Sans (amable)", heading: "Poppins", body: "Open Sans", googleFamilies: ["Poppins:wght@500;600;700;800", "Open+Sans:wght@400;500;600"], headingStack: "'Poppins', system-ui, sans-serif", bodyStack: "'Open Sans', system-ui, sans-serif" },
  { id: "fraunces-work", label: "Fraunces + Work Sans (premium)", heading: "Fraunces", body: "Work Sans", googleFamilies: ["Fraunces:wght@400;600;700;900", "Work+Sans:wght@400;500;600"], headingStack: "'Fraunces', Georgia, serif", bodyStack: "'Work Sans', system-ui, sans-serif" },
  { id: "montserrat-lato", label: "Montserrat + Lato (comercial)", heading: "Montserrat", body: "Lato", googleFamilies: ["Montserrat:wght@500;600;700;800;900", "Lato:wght@400;700"], headingStack: "'Montserrat', system-ui, sans-serif", bodyStack: "'Lato', system-ui, sans-serif" },
  { id: "jetbrains", label: "JetBrains Mono (terminal)", heading: "JetBrains Mono", body: "JetBrains Mono", googleFamilies: ["JetBrains+Mono:wght@400;500;700;800"], headingStack: "'JetBrains Mono', monospace", bodyStack: "'JetBrains Mono', monospace" },
];

/** Plantillas de página: qué páginas puede tener la web y sus secciones por defecto. */
export const pageTemplates: Array<{ id: string; title: string; path: string; defaultSections: SectionCategory[]; recommended: boolean; group: string }> = [
  { id: "home", title: "Inicio", path: "/", defaultSections: ["navigation", "heroes", "features", "testimonials", "cta", "footers"], recommended: true, group: "Esenciales" },
  { id: "servicios", title: "Servicios", path: "/servicios", defaultSections: ["navigation", "features", "pricing", "faq", "cta", "footers"], recommended: true, group: "Esenciales" },
  { id: "sobre", title: "Sobre nosotros", path: "/sobre-nosotros", defaultSections: ["navigation", "about", "team", "testimonials", "cta", "footers"], recommended: true, group: "Esenciales" },
  { id: "contacto", title: "Contacto", path: "/contacto", defaultSections: ["navigation", "contact", "map", "footers"], recommended: true, group: "Esenciales" },
  { id: "portfolio", title: "Portfolio / Trabajos", path: "/portfolio", defaultSections: ["navigation", "gallery", "cta", "footers"], recommended: false, group: "Contenido" },
  { id: "galeria", title: "Galería de fotos", path: "/galeria", defaultSections: ["navigation", "gallery", "footers"], recommended: false, group: "Contenido" },
  { id: "equipo", title: "Equipo", path: "/equipo", defaultSections: ["navigation", "team", "cta", "footers"], recommended: false, group: "Contenido" },
  { id: "blog", title: "Blog / Noticias", path: "/blog", defaultSections: ["navigation", "blog", "footers"], recommended: false, group: "Contenido" },
  { id: "precios", title: "Precios", path: "/precios", defaultSections: ["navigation", "pricing", "faq", "cta", "footers"], recommended: false, group: "Contenido" },
  { id: "faq", title: "Preguntas frecuentes", path: "/preguntas-frecuentes", defaultSections: ["navigation", "faq", "cta", "footers"], recommended: false, group: "Contenido" },
  { id: "carta", title: "Carta / Menú (restaurante)", path: "/carta", defaultSections: ["navigation", "menu", "cta", "footers"], recommended: false, group: "Sectores" },
  { id: "reservas", title: "Reservas / Pedir cita", path: "/reservas", defaultSections: ["navigation", "cta", "contact", "footers"], recommended: false, group: "Sectores" },
  { id: "ubicacion", title: "Cómo llegar", path: "/como-llegar", defaultSections: ["navigation", "map", "contact", "footers"], recommended: false, group: "Sectores" },
  { id: "aviso-legal", title: "Aviso legal", path: "/aviso-legal", defaultSections: ["navigation", "legal", "footers"], recommended: false, group: "Legal" },
  { id: "privacidad", title: "Política de privacidad", path: "/politica-de-privacidad", defaultSections: ["navigation", "legal", "footers"], recommended: false, group: "Legal" },
  { id: "cookies", title: "Política de cookies", path: "/politica-de-cookies", defaultSections: ["navigation", "legal", "footers"], recommended: false, group: "Legal" },
];

export const sectionLabels: Record<SectionCategory, string> = {
  navigation: "Navegación",
  heroes: "Hero",
  features: "Servicios / Features",
  about: "Sobre nosotros",
  cta: "Llamada a la acción",
  pricing: "Precios",
  testimonials: "Testimonios",
  faq: "Preguntas frecuentes",
  blog: "Blog / Artículos",
  contact: "Contacto",
  footers: "Footer",
  gallery: "Galería",
  team: "Equipo",
  legal: "Texto legal",
  menu: "Carta / Menú",
  map: "Mapa / Ubicación",
};

/** Idiomas disponibles para el sitio generado. */
export const availableLanguages: Array<{ code: string; label: string }> = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ca", label: "Català" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

/**
 * Rellena con los valores por defecto cualquier campo que falte en una receta
 * guardada con una versión anterior del builder (evita crashes al cargar).
 */
export function normalizeRecipe(raw: any): RecipeV2 {
  const d = defaultRecipe;
  return {
    ...d,
    ...raw,
    project: { ...d.project, ...raw?.project },
    business: { ...d.business, ...raw?.business, socials: { ...d.business.socials, ...raw?.business?.socials } },
    design: { ...d.design, ...raw?.design, customFonts: raw?.design?.customFonts ?? [] },
    pages: Array.isArray(raw?.pages) ? raw.pages : d.pages,
    content: { ...d.content, ...raw?.content },
    seo: { ...d.seo, ...raw?.seo },
    integrations: { ...d.integrations, ...raw?.integrations, widgets: { ...d.integrations.widgets, ...raw?.integrations?.widgets } },
    deployment: {
      ...d.deployment,
      ...raw?.deployment,
      github: { ...d.deployment.github, ...raw?.deployment?.github },
      dokploy: { ...d.deployment.dokploy, ...raw?.deployment?.dokploy },
      env: raw?.deployment?.env ?? {},
    },
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Codifica la receta para pasarla al iframe de preview por query param. */
export function encodeRecipe(recipe: RecipeV2): string {
  const json = JSON.stringify(recipe);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeRecipe(encoded: string): RecipeV2 {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export const defaultRecipe: RecipeV2 = {
  version: 2,
  project: {
    name: "nueva-web",
    language: "es",
    extraLanguages: [],
    outputRoot: "",
  },
  business: {
    brandName: "Nueva Web",
    sector: "Servicios",
    description: "Descripción corta del negocio para SEO y textos base.",
    phone: "+34 600 000 000",
    email: "hola@example.com",
    address: "Calle Ejemplo 1",
    city: "Madrid",
    schedule: "L-V 9:00-18:00",
    socials: { instagram: "", facebook: "", linkedin: "", tiktok: "", x: "", youtube: "", whatsapp: "" },
  },
  design: {
    theme: "modern",
    palette: palettePresets[0],
    typography: fontPresets[0],
    customFonts: [],
    darkMode: false,
  },
  pages: pageTemplates
    .filter((p) => p.recommended)
    .map((p) => ({
      id: p.id,
      title: p.title,
      path: p.path,
      sections: p.defaultSections.map((category) => ({ category, variant: "" })),
    })),
  content: {
    headline: "Una web lista para vender desde el primer día",
    subheadline: "Diseño profesional, carga instantánea y todo listo para crecer.",
    primaryCta: "Pide presupuesto",
    secondaryCta: "Ver servicios",
    services: [
      { title: "Servicio principal", description: "Describe el servicio estrella del cliente." },
      { title: "Segundo servicio", description: "Otro servicio o especialidad destacada." },
      { title: "Tercer servicio", description: "Completa la oferta con un tercer punto fuerte." },
    ],
  },
  seo: {
    siteTitle: "Nueva Web",
    description: "Descripción del sitio para buscadores (150-160 caracteres).",
    keywords: "",
  },
  integrations: {
    forms: "none",
    formspreeId: "",
    analytics: "none",
    analyticsId: "",
    cookieBanner: false,
    sitemap: true,
    widgets: {
      crispId: "",
      tawktoId: "",
      bookingUrl: "",
      gmapsEmbed: "",
      customScript: "",
    },
  },
  deployment: {
    domain: "example.com",
    createGithub: false,
    setupDokploy: false,
    installDeps: true,
    github: { owner: "", repo: "", visibility: "private", branch: "main", providerId: "" },
    dokploy: { url: "", environmentId: "", serverId: "", applicationId: "", internalPort: 80 },
    env: {},
  },
};
