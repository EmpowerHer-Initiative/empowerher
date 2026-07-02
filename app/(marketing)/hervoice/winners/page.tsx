import type { Metadata } from "next";
import Link from "next/link";
import { allHervoices } from "content-collections";

import { siteConfig } from "@/lib/site";

import {
  Arrow,
  HerVoiceCTA,
  RIBBON_BG,
  Seal,
  Stat,
} from "@/components/hervoice/shared";
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
];

const HONORABLE_SLUGS = [
  "the-girl-who-studied-in-the-dark",
  "running-towards-freedom",
  "the-day-i-said-no",
];

const JUDGES = [
  {
    name: "Dr. Ellen Leggett",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT5RG1ajWxDjwpl6zcWuZFSE0gC1TOnBMHdPh3",
    title:
      "Professor of Psychology and Founding Director of Applied Psychology Master’s Program (Retired), University of Southern California",
    quote:
      "It was an honor to read about and bear witness to the incredibly moving stories told by these writers. Many of us aspire to be courageous and to overcome adversity in our lives, and the writings of these Afghan women teach us all a humbling lesson. With elegant beauty and wisdom, the inspirational stories recounted by these writers demonstrate strength of character, love of learning, and the best of human persistence and resilience in the face of pain. A reverberating question stays with me: What feats would these remarkable women accomplish in a world that welcomed them? And the world does need them. Let their voices teach you.",
  },
  {
    name: "Dr. Susan M. Blaustein",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnlKrZzPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O",
    title:
      "Instructor, Columbia University, Founder/Board Chair, WomenStrong International",
    quote:
      "My immediate impression, when reading the submissions, was that this body of work has been produced by an extraordinarily talented, capable, bold, and determined group of young women. I was deeply moved by their courage, grit, and refusal to be restrained in shadow and silence. These are young women who, like all young women and girls everywhere, have dreams, rights, and hopes for their futures, yet in far too many cruel places on earth, those dreams and rights are denied. I am honored to have worked closely with Afghan women and girls over the past seven years as they have repeatedly faced and overcome seemingly insurmountable challenges. We must continue to raise awareness of, and refuse to tolerate, this tremendous injustice, which threatens the future and promise of Afghanistan and stands in clear violation of the rights of women and girls.",
  },
  {
    name: "Dr. Sonia Palmieri",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTK2M6BgCVy1oGkRMuS0Lravl9JbQIxWFcNhtq",
    title:
      "Associate Professor, Department of Pacific Affairs, Australian National University",
    quote:
      "I was incredibly moved by the stories of bravery, confidence, tragedy and injustice shared by the Afghan artists. As an academic, creative writing is something I admire, perhaps in part because it is so difficult for me. But the huge response to the EmpowerHer writing competition shows that there is a wealth of creativity among Afghan women, and that writing can be a powerful way to process a range of both conflicting and complementary emotions — sadness, rage, frustration, joy. Certainly, the entrants wanted to share a profound sense of injustice at the hands of the Taliban. They did this with strong, pictorial clarity. Yet this was always underpinned by narratives of resilience and hope. Afghan women’s refusal of defeat in such conditions will change the world.",
  },
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
      <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_130%_at_12%_0%,#FFFFFF_0%,var(--hv-paper)_46%,var(--hv-paper2)_100%)]">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_38%_36%,rgba(46,155,230,.16),transparent_62%)]" />
        <div className="pointer-events-none absolute -bottom-44 -left-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(224,174,60,.18),transparent_62%)]" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center md:py-28">
          <h1 className="hv-rise mt-5 font-[family-name:var(--hv-display)] text-[clamp(36px,5.5vw,72px)] leading-[0.92] font-bold tracking-[-0.03em] [animation-delay:80ms]">
            HerVoice <span className="text-[var(--hv-blue2)]">2026</span>
            <br />
            Writing Contest
          </h1>

          <p className="hv-rise mt-8 max-w-2xl text-lg leading-relaxed [text-wrap:pretty] text-[var(--hv-ink2)] [animation-delay:160ms]">
            HerVoice is EmpowerHer&apos;s creative publication platform,
            dedicated to amplifying and documenting the voices, stories, and
            ideas of Afghan girls through original writing. We believe in the
            power of storytelling to inspire, heal, connect communities, and
            create meaningful change.
          </p>

          <div className="hv-rise mt-10 flex items-center justify-center [animation-delay:240ms]">
            <Seal />
          </div>

          <div className="hv-rise mt-10 flex flex-wrap justify-center gap-8 [animation-delay:320ms]">
            <Stat n="300+" label="Submissions" />
            <Stat n="21+" label="Provinces across Afghanistan" gold />
            <Stat n="5" label="Cash Winners" />
            <Stat n="3" label="Honorees" gold />
          </div>

          <div className="hv-rise mt-10 [animation-delay:400ms]">
            <Link
              href="/writing-contest"
              className="group/btn inline-flex items-center gap-2.5 rounded-full bg-[var(--hv-blue2)] px-7 py-4 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(30,120,196,.7)] transition hover:-translate-y-0.5 hover:bg-[var(--hv-blue)] hover:shadow-[0_16px_30px_-12px_rgba(46,155,230,.75)]"
            >
              Read Contest Guidelines &amp; Details
              <Arrow className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Cash Prize Winners ── */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal asChild>
            <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
              Writings from Cash Prize Winners
            </h2>
          </Reveal>

          {/* Top 3 — larger cards */}
          <Reveal asChild>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {cashWinners.slice(0, 3).map((w) => (
                <WinnerCard
                  key={w.slug}
                  rank={w.rank}
                  ribbon={w.ribbon}
                  prize={w.prize}
                  title={w.story?.title || ""}
                  author={w.story?.authorName || ""}
                  image={w.story?.image || ""}
                  slug={w.slug}
                  large
                />
              ))}
            </div>
          </Reveal>

          {/* 4th & 5th — smaller cards */}
          <Reveal asChild delay={80}>
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {cashWinners.slice(3).map((w) => (
                <WinnerCard
                  key={w.slug}
                  rank={w.rank}
                  ribbon={w.ribbon}
                  prize={w.prize}
                  title={w.story?.title || ""}
                  author={w.story?.authorName || ""}
                  image={w.story?.image || ""}
                  slug={w.slug}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: Honorable Mentions ── */}
      <section className="bg-[var(--hv-paper)] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal asChild>
            <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
              Writings from Honorable Mention Winners
            </h2>
          </Reveal>

          <Reveal asChild>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {honorables.map(
                (story) =>
                  story && (
                    <Link
                      key={story._meta.path}
                      href={`/hervoice/${story._meta.path}`}
                      className="group relative overflow-hidden rounded-2xl border border-[#ECE3D2] bg-white shadow-[0_12px_32px_-16px_rgba(26,34,48,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-18px_rgba(26,34,48,.45)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-[family-name:var(--hv-display)] text-lg font-bold text-[var(--hv-ink)]">
                          {story.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--hv-ink3)]">
                          by {story.authorName}
                        </p>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: Judge Testimonials ── */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal asChild>
            <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
              What Our Judges Felt Reading These Stories
            </h2>
          </Reveal>

          <div className="mt-14 space-y-10">
            {JUDGES.map((judge, i) => (
              <Reveal asChild key={judge.name} delay={i * 100}>
                <div className="flex flex-col gap-8 rounded-2xl border border-[#ECE3D2] bg-[var(--hv-paper)] p-8 md:flex-row md:p-10">
                  <img
                    src={judge.image}
                    alt={judge.name}
                    className="h-40 w-40 shrink-0 self-center rounded-2xl border-2 border-[var(--hv-gold)]/40 object-cover md:self-start"
                  />
                  <div className="flex-1">
                    <blockquote className="font-[family-name:var(--hv-serif-i)] text-[17px] leading-relaxed text-[var(--hv-ink2)] italic">
                      &ldquo;{judge.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6">
                      <div className="h-px w-full bg-[var(--hv-gold)]/30" />
                      <div className="mt-4">
                        <p className="font-[family-name:var(--hv-display)] text-sm font-bold text-[var(--hv-ink)]">
                          {judge.name}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-[var(--hv-ink3)]">
                          {judge.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CTA Banner ── */}
      <Reveal>
        <HerVoiceCTA />
      </Reveal>
    </div>
  );
}

function WinnerCard({
  rank,
  ribbon,
  prize,
  title,
  author,
  image,
  slug,
  large,
}: {
  rank: string;
  ribbon: keyof typeof RIBBON_BG;
  prize: string;
  title: string;
  author: string;
  image: string;
  slug: string;
  large?: boolean;
}) {
  return (
    <Link
      href={`/hervoice/${slug}`}
      className="group relative overflow-hidden rounded-2xl border border-[#ECE3D2] bg-white shadow-[0_12px_32px_-16px_rgba(26,34,48,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-18px_rgba(26,34,48,.45)]"
    >
      <div
        className={`relative overflow-hidden ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block rounded-md px-2.5 py-1 font-[family-name:var(--hv-display)] text-[11px] font-bold tracking-[0.1em] text-white ${RIBBON_BG[ribbon]}`}
          >
            {rank}
          </span>
          <span className="font-[family-name:var(--hv-display)] text-sm font-bold text-[var(--hv-gold2)]">
            {prize}
          </span>
        </div>
        <h3
          className={`mt-2 font-[family-name:var(--hv-display)] font-bold text-[var(--hv-ink)] ${large ? "text-xl" : "text-lg"}`}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-[var(--hv-ink3)]">by {author}</p>
      </div>
    </Link>
  );
}
