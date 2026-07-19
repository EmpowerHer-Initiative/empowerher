import type { Metadata } from "next";
import { allHervoices } from "content-collections";

import { siteConfig } from "@/lib/site";

import { HerVoiceCTA, RIBBON_BG } from "@/components/hervoice/shared";
import { CashPrizeWinners } from "@/components/marketing/hervoice-winners/cash-prize-winners";
import { Hero } from "@/components/marketing/hervoice-winners/hero";
import { HonorableMentions } from "@/components/marketing/hervoice-winners/honorable-mentions";
import { JudgeTestimonials } from "@/components/marketing/hervoice-winners/judge-testimonials";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `HerVoice 2026 Writing Contest Winners — ${siteConfig.name}`,
  description:
    "Results of the HerVoice 2026 Writing Contest, including cash prize winners and honorable mentions.",
};

const CASH_WINNERS = [
  {
    rank: "1ST",
    ribbon: "g" as const,
    prize: "$400",
    slug: "bread-and-a-red-apple",
  },
  {
    rank: "2ND",
    ribbon: "b" as const,
    prize: "$300",
    slug: "when-did-i-feel-that-i-am-a-strong-girl",
  },
  {
    rank: "3RD",
    ribbon: "s" as const,
    prize: "$200",
    slug: "what-i-carried-in-my-voice",
  },
  {
    rank: "4TH",
    ribbon: "t" as const,
    prize: "$150",
    slug: "confession-in-the-shadow",
  },
  {
    rank: "5TH",
    ribbon: "p" as const,
    prize: "$50",
    slug: "a-story-from-the-window-of-a-mud-house",
  },
] satisfies {
  rank: string;
  ribbon: keyof typeof RIBBON_BG;
  prize: string;
  slug: string;
}[];

const HONORABLE_SLUGS = [
  "the-girl-who-studied-in-the-dark",
  "running-towards-freedom",
  "the-day-i-said-no",
];

function getStory(slug: string) {
  return allHervoices.find((h) => h._meta.path === slug);
}

export default function WinnersPage() {
  const cashWinners = CASH_WINNERS.map((w) => ({
    ...w,
    story: getStory(w.slug),
  }));

  const honorables = HONORABLE_SLUGS.map((slug) => getStory(slug)).filter(
    Boolean
  );

  return (
    <div className="font-[family-name:var(--hv-sans)] text-[var(--hv-ink)] antialiased">
      {/* ── SECTION 1: Hero ── */}
      <Hero />

      {/* ── SECTION 2: Cash Prize Winners ── */}
      <CashPrizeWinners cashWinners={cashWinners} />

      {/* ── SECTION 3: Honorable Mentions ── */}
      <HonorableMentions honorables={honorables} />

      {/* ── SECTION 4: Judge Testimonials ── */}
      <JudgeTestimonials />

      {/* ── SECTION 5: CTA Banner ── */}
      <Reveal>
        <HerVoiceCTA />
      </Reveal>
    </div>
  );
}
