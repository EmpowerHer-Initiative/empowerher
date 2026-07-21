import { Suspense } from "react";
import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { AboutCTA } from "@/components/marketing/about-us/cta";
import { AboutHero } from "@/components/marketing/about-us/hero";
import { MissionVision } from "@/components/marketing/about-us/mission-vision";
import { OurStory } from "@/components/marketing/about-us/our-story";
import { Partners } from "@/components/marketing/about-us/partners";
import {
  TeamSection,
  TeamSectionSkeleton,
} from "@/components/marketing/about-us/team";
import { WhatWeDo } from "@/components/marketing/about-us/what-we-do";
import { PartnersSkeleton } from "@/components/partners-section";

export const metadata: Metadata = {
  title: `${siteConfig.pages.about.title} — ${siteConfig.name}`,
  description: siteConfig.pages.about.description,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <OurStory />
      <WhatWeDo />
      <Suspense fallback={<TeamSectionSkeleton />}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={<PartnersSkeleton />}>
        <Partners />
      </Suspense>
      <AboutCTA />
    </>
  );
}
