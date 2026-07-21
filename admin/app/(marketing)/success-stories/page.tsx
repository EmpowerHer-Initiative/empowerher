import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { ClosingCTA } from "@/components/marketing/success-stories/closing-cta";
import { Header } from "@/components/marketing/success-stories/header";
import { Stories } from "@/components/marketing/success-stories/stories";

export const metadata: Metadata = {
  title: `${siteConfig.pages.successStories.title} — ${siteConfig.name}`,
  description: siteConfig.pages.successStories.description,
};

export default function SuccessStoriesPage() {
  return (
    <>
      <Header />
      <Stories />
      <ClosingCTA />
    </>
  );
}
