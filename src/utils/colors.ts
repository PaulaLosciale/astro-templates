// Utilidades de color: hex -> HSL y derivación de escalas Tailwind (50-700)
// Los componentes usan clases primary-50/100/500/600/700 mapeadas a CSS vars HSL.

export type Hsl = { h: number; s: number; l: number };

export function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslTriplet({ h, s, l }: Hsl): string {
  return `${h} ${s}% ${l}%`;
}

/** Deriva la escala 50/100/500/600/700 a partir de un color base (el 500). */
export function deriveScale(hex: string): Record<"50" | "100" | "500" | "600" | "700", string> {
  const base = hexToHsl(hex);
  const at = (l: number, s = base.s) => hslTriplet({ h: base.h, s, l });
  return {
    "50": at(97, Math.min(base.s, 60)),
    "100": at(93, Math.min(base.s, 65)),
    "500": hslTriplet(base),
    "600": at(Math.max(base.l - 10, 8)),
    "700": at(Math.max(base.l - 20, 5)),
  };
}

/** Genera el bloque :root de theme.css para un sitio a partir de la paleta de la receta. */
export function paletteToCssVars(palette: {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundDark: string;
  text: string;
  textDark: string;
}): string {
  const p = deriveScale(palette.primary);
  const lines = [
    `  --color-primary-50: ${p["50"]};`,
    `  --color-primary-100: ${p["100"]};`,
    `  --color-primary-500: ${p["500"]};`,
    `  --color-primary-600: ${p["600"]};`,
    `  --color-primary-700: ${p["700"]};`,
    `  --color-secondary-500: ${hslTriplet(hexToHsl(palette.secondary))};`,
    `  --color-accent-500: ${hslTriplet(hexToHsl(palette.accent))};`,
    `  --color-bg-light: ${hslTriplet(hexToHsl(palette.background))};`,
    `  --color-bg-dark: ${hslTriplet(hexToHsl(palette.backgroundDark))};`,
    `  --color-text-light: ${hslTriplet(hexToHsl(palette.text))};`,
    `  --color-text-dark: ${hslTriplet(hexToHsl(palette.textDark))};`,
  ];
  return `:root {\n${lines.join("\n")}\n}`;
}
