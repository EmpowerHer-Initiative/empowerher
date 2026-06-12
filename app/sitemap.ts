import type { MetadataRoute } from "next";
import { allHervoices } from "content-collections";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const hervoiceRoutes: MetadataRoute.Sitemap = allHervoices.map((post) => ({
    url: `${siteConfig.url}/hervoice/${post._meta.path}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...hervoiceRoutes];
}
