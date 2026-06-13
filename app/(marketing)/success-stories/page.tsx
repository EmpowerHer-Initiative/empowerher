import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.successStories.title} — ${siteConfig.name}`,
  description: siteConfig.pages.successStories.description,
};

/* ─── Header ────────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Real Impact
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
          Every Girl Is a Story Worth Telling
        </h1>
        <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
          These programs ran with limited resources and unlimited determination.
          Each one changed lives that the world had already decided to leave
          behind.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Story 1: Page of Hope ─────────────────────────────────────────────────── */

const PageOfHope = () => (
  <section className="bg-foreground text-background">
    <div className="container py-28 md:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Image — left */}
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDSPjOaeh0fiZ3z8JjCWsbc2laUL6tAeqPnMN"
              alt="Page of Hope English Online Book Club"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Floating date tag */}
          <div className="bg-background absolute -right-5 -bottom-5 rounded-2xl px-6 py-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              Aug 2023 – Jan 2025
            </p>
          </div>
        </div>

        {/* Content — right */}
        <div>
          <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Program 01
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
            Page of Hope English Online Book Club
          </h2>

          {/* Stats inline */}
          <div className="mt-10 flex flex-wrap gap-10">
            <div>
              <p className="text-background font-serif text-6xl leading-none">
                11
              </p>
              <p className="text-background/60 mt-2 text-sm">Students</p>
            </div>
            <div>
              <p className="text-background font-serif text-6xl leading-none">
                18
              </p>
              <p className="text-background/60 mt-2 text-sm">Months</p>
            </div>
            <div>
              <p className="text-background font-serif text-6xl leading-none">
                100%
              </p>
              <p className="text-background/60 mt-2 text-sm">
                Advanced to core programs
              </p>
            </div>
          </div>

          <div className="border-background/10 mt-10 space-y-5 border-t pt-10">
            <p className="text-background/75 text-base leading-relaxed">
              The Page of Hope English Online Book Club was established to
              support Afghan teenagers—particularly girls—who were denied access
              to formal education. Over the course of 18 months, the program
              offered more than English instruction; it provided a platform for
              personal growth, leadership, and connection.
            </p>
            <p className="text-background/75 text-base leading-relaxed">
              Founded by EmpowerHer Co-Founder Mahdi Rahimi and generously
              sponsored by the Afghan Girls Financial Assistance Fund (AGFAF),
              the club engaged 11 students in weekly virtual sessions. Students
              took on rotating leadership roles, completed capstone projects,
              and participated in interactive activities including debates,
              storytelling, and team-based learning exercises.
            </p>
            <p className="text-background/75 text-base leading-relaxed">
              <span className="text-background font-semibold">
                Impact &amp; Legacy:
              </span>{" "}
              Several participants have since advanced to AGFAF&apos;s core
              educational programs or taken on mentoring roles within
              EmpowerHer.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Weekly virtual sessions",
              "Little Women & Dear Martin",
              "Leadership development",
              "Capstone projects",
              "Debates & storytelling",
              "Mentoring opportunities",
            ].map((tag) => (
              <span
                key={tag}
                className="border-background/20 text-background/60 rounded-full border px-4 py-1.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Story 2: Educational Support ─────────────────────────────────────────── */

const EducationalSupport = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Content — left */}
        <div className="order-2 lg:order-1">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Program 02
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
            Educational Support for Afghans
          </h2>

          {/* Stats inline */}
          <div className="border-border mt-10 flex flex-wrap gap-10 border-b pb-10">
            <div>
              <p className="font-serif text-6xl leading-none">25</p>
              <p className="text-muted-foreground mt-2 text-sm">Students</p>
            </div>
            <div>
              <p className="font-serif text-6xl leading-none">4</p>
              <p className="text-muted-foreground mt-2 text-sm">Months</p>
            </div>
            <div>
              <p className="font-serif text-6xl leading-none">12</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Grammar sessions
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-5">
            <p className="text-muted-foreground text-base leading-relaxed">
              From June 2024 through October 2024, EmpowerHer ran a four-month
              English course for 25 Afghan students, many of whom were girls and
              women unable to attend school or university due to restrictive
              conditions. The program welcomed learners of all ages, including
              mothers, and focused on developing foundational skills in reading,
              writing, grammar, listening, and speaking.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              The course emphasized creative expression through writing,
              classroom discussions, and 12 focused grammar sessions for
              learning English. With generous support from AGFAF, we were also
              able to provide monthly internet access to ensure students could
              attend regularly and fully participate in the virtual classroom
              environment.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              <span className="text-foreground font-semibold">Timeline:</span>{" "}
              June 2024 – October 2024. Open to girls and women of all ages.
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/get-involved"
              className="group bg-foreground text-background hover:shadow-foreground/10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
            >
              Get Involved
              <span className="bg-background/10 flex size-6 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Image — right */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTv1o7So50TX8DRt9gfxu6sU74iOHozSwBKGJM"
              alt="Educational Support for Afghans"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="border-border bg-background absolute -bottom-5 -left-5 rounded-2xl border px-6 py-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              Jun – Oct 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── SPR Pull ──────────────────────────────────────────────────────────────── */

const SprPull = () => (
  <section className="bg-foreground/[0.03] py-28 md:py-40">
    <div className="container">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Leadership Pathway
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
            The Student Project Roadmap
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed">
            For graduates ready to lead — design and run your own impact-driven
            workshop. A structured, five-step journey from Assistant to Mentor.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/success-stories/spr"
            className="group border-border hover:border-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
          >
            Learn About the SPR
            <span className="bg-foreground/5 flex size-6 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Closing CTA ───────────────────────────────────────────────────────────── */

const ClosingCTA = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Be Part of the Next Story
        </p>
        <h2 className="mt-5 font-serif text-3xl md:text-5xl">
          Want to support more stories like this?
        </h2>
        <div className="mt-10">
          <Link
            href="/get-involved"
            className="group bg-foreground text-background hover:shadow-foreground/10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
          >
            <Heart className="size-4" />
            Get Involved
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function SuccessStoriesPage() {
  return (
    <>
      <Header />
      <PageOfHope />
      <EducationalSupport />
      <SprPull />
      <ClosingCTA />
    </>
  );
}
