import { Suspense } from "react";
import type { Metadata } from "next";

import { getHervoiceStories } from "@/lib/cache/hervoice";
import { siteConfig } from "@/lib/site";

import { CongressionalTestimonies } from "@/components/marketing/hervoice/congressional-testimonies";
import { Eligibility } from "@/components/marketing/hervoice/eligibility";
import {
  FeaturedWritings,
  WritingsSkeleton,
} from "@/components/marketing/hervoice/featured-writings";
import { HerVoiceHero } from "@/components/marketing/hervoice/hero";
import { HowToSubmit } from "@/components/marketing/hervoice/how-to-submit";
import { PartnerSupport } from "@/components/marketing/hervoice/partner-support";
import { WritingContestCTA } from "@/components/marketing/hervoice/writing-contest-cta";

export const metadata: Metadata = {
  title: `${siteConfig.pages.hervoice.title} — ${siteConfig.name}`,
  description: siteConfig.pages.hervoice.description,
};

async function FeaturedWritingsSection() {
  const all = await getHervoiceStories();
  const stories = all
    .filter((s) => !s.hide)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      image: s.image,
      authorName: s.authorName,
    }));

  return <FeaturedWritings stories={stories} />;
}

export default function HerVoicePage() {
  return (
    <>
      <HerVoiceHero />
      <HowToSubmit />
      <Eligibility />
      <Suspense fallback={<WritingsSkeleton />}>
        <FeaturedWritingsSection />
      </Suspense>
      <CongressionalTestimonies />
      <PartnerSupport />
      <WritingContestCTA />
    </>
  );
}
