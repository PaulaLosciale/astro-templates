// Mapa de módulos reales de la librería, resuelto en build/dev por Vite.
// Permite al preview renderizar cualquier variante del registry sin imports manuales.

import type { ComponentVariant } from "./componentRegistry";

const astroModules = import.meta.glob<Record<string, any>>(
  "../components/{about,blog,contact,cta,faq,features,footers,heroes,navigation,pricing,testimonials,gallery,team,legal,menu,map}/**/*.astro",
  { eager: true },
);

const reactModules = import.meta.glob<Record<string, any>>(
  "../components/{navigation,contact}/**/*.tsx",
  { eager: true },
);

/** Devuelve el componente (Astro o React) para una variante del registry. */
export function resolveComponent(variant: ComponentVariant): any {
  const key = `../components/${variant.file}`;
  const module = variant.isReact ? reactModules[key] : astroModules[key];
  if (!module) return null;
  if (variant.isReact && variant.exportName) return module[variant.exportName] ?? module.default ?? null;
  return module.default ?? null;
}
