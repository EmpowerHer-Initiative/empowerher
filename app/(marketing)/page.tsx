import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.pages.home.title,
  description: siteConfig.pages.home.description,
  openGraph: {
    title: siteConfig.pages.home.title,
    description: siteConfig.pages.home.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Hero Section</h1>
    </section>
  );
};

export default function LandingPage() {
  return <Hero />;
}
