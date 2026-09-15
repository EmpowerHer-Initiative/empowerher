import cmsBridge from "@alisamadiillc/cms-bridge/astro";
// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import aiInspector from "./src/integrations/ai-inspector.ts";

// AI Inspector: set enabled:false to fully remove it from public builds.
// Visiting /<token> turns on the click-to-copy edit overlay for that browser.
const AI_EDIT_TOKEN = "edit-h4w8rq";

// https://astro.build/config
export default defineConfig({
  site: "https://www.empowerher-initiative.org",
  // Pages stay prerendered; the adapter only serves the /api/* form
  // endpoints (prerender = false) from the Node standalone server.
  adapter: node({ mode: "standalone" }),
  // Server secrets read at RUNTIME (never baked into dist) — from .env in
  // dev, from platform env vars (Coolify) in production. All optional so a
  // Docker build without env succeeds; the API routes guard missing values.
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
  integrations: [
    // Keep the secret AI-edit activation route out of the public sitemap.
    sitemap({ filter: (url) => !url.includes(`/${AI_EDIT_TOKEN}`) }),
    cmsBridge({ auto: true }),
    // pathPrefix: this repo holds two projects; the Astro site lives in
    // marketing/, so copied payloads must be repo-relative.
    // aiInspector({ enabled: true, token: AI_EDIT_TOKEN, pathPrefix: "marketing/" }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
