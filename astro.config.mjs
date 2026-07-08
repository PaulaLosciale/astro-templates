// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";

// El builder se usa en local con `npm run dev`. El adapter node permite las
// rutas dinámicas (/preview y /api/build) que necesitan renderizado bajo demanda.
export default defineConfig({
  integrations: [tailwind(), react()],
  adapter: node({ mode: "standalone" }),
});
