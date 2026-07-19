import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { AboutContest } from "@/components/marketing/writing-contest/about-contest";
import { Awards } from "@/components/marketing/writing-contest/awards";
import { Deadlines } from "@/components/marketing/writing-contest/deadlines";
import { Hero } from "@/components/marketing/writing-contest/hero";
import { HowToSubmit } from "@/components/marketing/writing-contest/how-to-submit";
import { Judges } from "@/components/marketing/writing-contest/judges";
import { SubmissionRequirements } from "@/components/marketing/writing-contest/submission-requirements";
import { WhoCanParticipate } from "@/components/marketing/writing-contest/who-can-participate";
import { WritingPrompt } from "@/components/marketing/writing-contest/writing-prompt";

export const metadata: Metadata = {
  title: `${siteConfig.pages.writingContest.title} — ${siteConfig.name}`,
  description: siteConfig.pages.writingContest.description,
};

export default function WritingContestPage() {
  return (
    <>
      <Hero />
      <AboutContest />
      <WritingPrompt />
      <WhoCanParticipate />
      <SubmissionRequirements />
      <HowToSubmit />
      <Deadlines />
      <Awards />
      <Judges />
    </>
  );
}
