import cmsBridge from "@alisamadiillc/cms-bridge/astro";
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.empowerher-initiative.org",
  integrations: [sitemap(), cmsBridge()],
  vite: {
    plugins: [tailwindcss()],
  },
});
