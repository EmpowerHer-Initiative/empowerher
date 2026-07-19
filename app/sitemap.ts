import type { MetadataRoute } from "next";
import { allHervoices } from "content-collections";

import { siteConfig } from "@/lib/site";
import { getHervoiceStories } from "@/services/trpc/routers/hervoice";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/hervoice`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const dbStories = await getHervoiceStories();
  const stories = [
    ...dbStories.map((s) => ({ slug: s.slug, date: s.createdAt })),
    ...allHervoices.map((p) => ({ slug: p._meta.path, date: p.date })),
  ];

  const hervoiceRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${siteConfig.url}/hervoice/${s.slug}`,
    lastModified: new Date(s.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...hervoiceRoutes];
}
