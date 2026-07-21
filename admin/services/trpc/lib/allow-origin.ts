import { siteConfig } from "@/lib/site";

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  // Production origin — derived from siteConfig.url
  siteConfig.url,
];
