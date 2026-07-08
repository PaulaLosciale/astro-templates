// Wrapper para hidratar variantes React (navbars) en el preview.
// client:only exige imports estáticos, así que este componente importa todas
// las variantes React del registry y elige por id.
import React from "react";
import { Navbar } from "../navigation/modern/Navbar";
import { NavbarModern } from "../navigation/modern/NavbarModern";
import { NavbarMinimal } from "../navigation/minimalist/NavbarMinimal";
import { NavbarCreative } from "../navigation/creative/NavbarCreative";
import { NavbarCorporate } from "../navigation/corporate/NavbarCorporate";
import { NavbarSaaS } from "../navigation/saas/NavbarSaaS";
import { NavbarClean } from "../navigation/cleantech/NavbarClean";
import { NavbarElegant } from "../navigation/elegante/NavbarElegant";
import NavbarGlass from "../navigation/glass/NavbarGlass";
import { NavbarTerminal } from "../navigation/terminal/NavbarTerminal";

const reactVariants: Record<string, React.ComponentType<any>> = {
  "navigation/modern/Navbar": Navbar,
  "navigation/modern/NavbarModern": NavbarModern,
  "navigation/minimalist/NavbarMinimal": NavbarMinimal,
  "navigation/creative/NavbarCreative": NavbarCreative,
  "navigation/corporate/NavbarCorporate": NavbarCorporate,
  "navigation/saas/NavbarSaaS": NavbarSaaS,
  "navigation/cleantech/NavbarClean": NavbarClean,
  "navigation/elegante/NavbarElegant": NavbarElegant,
  "navigation/glass/NavbarGlass": NavbarGlass,
  "navigation/terminal/NavbarTerminal": NavbarTerminal,
};

export default function PreviewReactSection({ variantId, ...props }: { variantId: string } & Record<string, any>) {
  const Component = reactVariants[variantId];
  if (!Component) return null;
  return <Component {...props} />;
}
