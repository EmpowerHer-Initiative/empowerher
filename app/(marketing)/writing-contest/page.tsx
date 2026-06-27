import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { ImagePlaceholder } from "@/components/image-placeholder";

export const metadata: Metadata = {
  title: `${siteConfig.pages.writingContest.title} — ${siteConfig.name}`,
  description: siteConfig.pages.writingContest.description,
};

/* ─── Hero ───────────────────────────────────────────────────────────────────── */

const Hero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        {/* Text */}
        <div className="max-w-xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            HerVoice · 2026
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Writing Contest
          </h1>
          <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
            Every Afghan girl carries a story that the world needs to hear.
            HerVoice 2026 is our annual writing contest — a platform for Afghan
            girls and women to reclaim their narratives, share their truths, and
            inspire a global audience through the power of the written word.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group bg-foreground text-background inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-80 active:scale-[0.98]"
            >
              Get Notified
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/hervoice"
              className="border-border/60 text-foreground/70 hover:border-foreground/30 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Explore HerVoice
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="border-border/30 overflow-hidden rounded-3xl border">
          <ImagePlaceholder
            aspectRatio="4/3"
            prompt="Afghan girl writing in a journal, warm golden light, soft focus background. Empowering, hopeful atmosphere. Storytelling and creative writing theme. Warm amber and soft blue tones. Editorial photography style, high quality."
          />
        </div>
      </div>
    </div>
  </section>
);

/* ─── Coming Soon ────────────────────────────────────────────────────────────── */

const ComingSoon = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <div className="border-border inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Details Coming Soon
          </span>
        </div>

        <h2 className="text-foreground mt-8 font-serif text-4xl leading-tight md:text-6xl">
          Contest details are being finalized.
        </h2>

        <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed">
          We&apos;re putting the finishing touches on the HerVoice 2026 Writing
          Contest. Submission guidelines, themes, deadlines, and prizes will be
          announced shortly. Stay connected — you won&apos;t want to miss it.
        </p>

        <div className="border-border mt-12 grid grid-cols-1 gap-px border sm:grid-cols-3">
          {[
            { label: "Theme", value: "To Be Announced" },
            { label: "Deadline", value: "2026" },
            { label: "Prize", value: "Global Platform" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-foreground/5 px-8 py-8 backdrop-blur-sm"
            >
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                {item.label}
              </p>
              <p className="text-muted-foreground mt-3 text-lg font-medium">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="border-border text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            Get Notified When It Opens
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── About HerVoice ─────────────────────────────────────────────────────────── */

const AboutHerVoice = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              About HerVoice
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Where Afghan girls write their own story.
            </h2>
          </div>
          <div className="text-muted-foreground space-y-5 text-base leading-relaxed">
            <p>
              HerVoice is EmpowerHer&apos;s creative storytelling platform where
              students share original writing and express themselves freely. We
              believe in the power of words to heal, connect, and inspire
              change.
            </p>
            <p>
              Many of our students have demonstrated remarkable resilience and
              courage through storytelling — using their voices to share
              personal truths and inspire others. HerVoice gives them the space
              to do just that, amplifying their experiences and perspectives in
              a world that too often silences them.
            </p>
            <p>
              Through partnerships with the National Society of High School
              Scholars (NSHSS) and Amplify Afghan Women, every story submitted
              through HerVoice has the potential to reach a global audience.
            </p>
          </div>
        </div>

        {/* Divider row */}
        <div className="divide-border/30 border-border/30 mt-20 grid grid-cols-3 divide-x border-y py-10">
          {[
            { label: "Form", value: "Fiction, Nonfiction, Poetry" },
            { label: "Reach", value: "Global Partners" },
            { label: "Language", value: "English" },
          ].map((stat) => (
            <div key={stat.label} className="px-8 first:pl-0 last:pr-0">
              <p className="font-serif text-2xl leading-snug">{stat.value}</p>
              <p className="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Past Voices ────────────────────────────────────────────────────────────── */

const pastWritings = [
  {
    title: "Building Windows Where They Built Walls",
    author: "Nahid Karimi",
    platform: "NSHSS",
  },
  {
    title:
      "Leading with Resilience: My Journey as an Afghan Student and Advocate",
    author: "Mahdi Rahimi",
    platform: "NSHSS",
  },
  {
    title: "The Girl from Kabul: A Story of Words and Wounds",
    author: "Sadaf A",
    platform: "Amplify Afghan Women",
  },
  {
    title: "If the Taliban Had Never Existed",
    author: "Sakhydadi",
    platform: "Amplify Afghan Women",
  },
  {
    title: "A Bridge Between Two Worlds",
    author: "Zahra A",
    platform: "Amplify Afghan Women",
  },
  {
    title: "How Education and Art Empower Afghan Girls",
    author: "Sabira Hussaini",
    platform: "NSHSS",
  },
];

const PastVoices = () => (
  <section className="bg-foreground/[0.025] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Voices That Came Before
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Stories that moved the world.
            </h2>
          </div>
          <Link
            href="/hervoice/featured-writings-from-our-partners"
            className="group text-muted-foreground hover:text-foreground hidden shrink-0 items-center gap-2 text-sm font-medium transition-colors duration-300 md:flex"
          >
            All writings
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
          </Link>
        </div>

        <div className="mt-14">
          {pastWritings.map((writing, i) => (
            <div
              key={writing.title}
              className="border-border/30 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b py-6 last:border-0"
            >
              <span className="text-muted-foreground/40 w-6 text-xs font-bold tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-foreground text-sm leading-snug font-semibold">
                  &ldquo;{writing.title}&rdquo;
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {writing.author}
                </p>
              </div>
              <span className="border-border/40 text-muted-foreground hidden shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase sm:block">
                {writing.platform}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/hervoice/featured-writings-from-our-partners"
            className="group text-foreground/70 hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
          >
            Read all featured writings
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function WritingContestPage() {
  return (
    <>
      <Hero />
      <ComingSoon />
      <AboutHerVoice />
      <PastVoices />
    </>
  );
}
