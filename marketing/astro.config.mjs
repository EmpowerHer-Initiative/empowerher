// @ts-check
import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.empowerher-initiative.org",
  // Pages stay prerendered; the adapter only serves the /api/* form
  // endpoints (prerender = false) from the Cloudflare Worker.
  adapter: cloudflare(),
  // Server secrets read at RUNTIME (never baked into dist) — from .env in
  // dev, from Worker env (wrangler secrets / dashboard) in production. All
  // optional so a build without env succeeds; the API routes guard missing
  // values.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      USESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      USESEND_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CONTACT_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      EMAIL_FROM: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
