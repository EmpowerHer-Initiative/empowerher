import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { Hero } from "@/components/landing-page/hero";

export const metadata: Metadata = {
  title: siteConfig.pages.home.title,
  description: siteConfig.pages.home.description,
  openGraph: {
    title: siteConfig.pages.home.title,
    description: siteConfig.pages.home.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

export default function LandingPage() {
  return <Hero />;
}
