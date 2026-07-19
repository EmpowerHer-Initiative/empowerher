import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { getHervoiceStories } from "@/services/trpc/routers/hervoice";

import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.hervoice.title} — ${siteConfig.name}`,
  description: siteConfig.pages.hervoice.description,
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const HerVoiceHero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-24">
        {/* Left: large editorial title */}
        <Reveal asChild>
          <div>
            <p className="text-primary mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
              Publication Platform
            </p>
            <h1 className="font-serif text-5xl leading-[1.0] md:text-7xl lg:text-8xl">
              HerVoice
            </h1>
          </div>
        </Reveal>

        {/* Right: description + CTA */}
        <Reveal asChild delay={120}>
          <div className="lg:pb-4">
            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              HerVoice is EmpowerHer&apos;s creative storytelling and
              publication platform, where students can publish their original
              writings and express themselves freely. At EmpowerHer, we believe
              in the power of words to heal, connect, and drive change.
            </p>
            <blockquote className="border-primary/20 mt-8 border-l-2 pl-6 font-serif text-xl leading-relaxed italic">
              Many of our students have demonstrated remarkable resilience and
              courage through storytelling, using their voices to share personal
              truths and inspire others.
            </blockquote>
            <p className="text-muted-foreground mt-8 text-base leading-relaxed">
              HerVoice gives them the space to do just that&mdash;amplifying
              their experiences and perspectives in a world that too often
              silences them.
            </p>
            <div className="border-primary/20 bg-primary/[0.04] mt-8 rounded-2xl border p-6">
              <p className="text-muted-foreground/50 text-xs font-semibold tracking-[0.2em] uppercase">
                Global Partners
              </p>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                With the support of our partners&mdash;including the National
                Society of High School Scholars (Atlanta, Georgia), and Amplify
                Afghan Women (Melbourne, Australia)&mdash;we are proud to bring
                these stories to a global audience.
              </p>
            </div>
            <p className="mt-8 text-base leading-relaxed font-medium">
              Through HerVoice, every story becomes a step toward empowerment,
              visibility, and hope.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#writings"
                className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
              >
                Read Stories from HerVoice Here
                <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/writing-contest"
                className="group border-primary/40 text-foreground hover:border-primary hover:bg-primary/5 hover:shadow-primary/10 inline-flex items-center gap-2 rounded-full border px-6 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                2026 Writing Contest
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── How to Submit ─────────────────────────────────────────────────────────── */

const HowToSubmit = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — editorial heading */}
        <Reveal asChild>
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Submission Guide
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
              How to Submit
              <br />
              <span className="text-primary italic">Your Story</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
              Every submission is a step toward being heard. Follow these four
              steps to share your voice with the world through HerVoice.
            </p>

            {/* Guidelines — border-left style like co-founder quotes */}
            <div className="mt-12 space-y-5">
              <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
                Important Guidelines
              </p>
              {[
                [
                  "Content Quality",
                  "Write from the heart with honest reflection on your personal journey.",
                ],
                [
                  "Image Required",
                  "Include a relevant image that connects to your story.",
                ],
                [
                  "No Hate Speech",
                  "Submissions with inappropriate content will not be published.",
                ],
                [
                  "Review Process",
                  "All submissions will be reviewed by the EmpowerHer team.",
                ],
              ].map(([label, text]) => (
                <div
                  key={label}
                  className="group border-primary/30 hover:border-primary hover:bg-primary/[0.04] rounded-r-lg border-l-2 py-1.5 pl-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:translate-x-1"
                >
                  <p className="text-foreground group-hover:text-primary text-lg font-semibold transition-colors duration-500">
                    {label}
                  </p>
                  <p className="text-muted-foreground mt-1 text-base leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — numbered steps in a vertical list */}
        <Reveal asChild delay={120}>
          <div className="divide-border space-y-0 divide-y">
            {[
              {
                num: "01",
                title: "Write Your Story",
                desc: "Write from the heart, reflecting honestly on your personal journey, challenges, and experiences.",
              },
              {
                num: "02",
                title: "Review & Edit",
                desc: "Carefully review your piece for grammar, spelling, and clarity. Rough drafts may be rejected.",
              },
              {
                num: "03",
                title: "Prepare Materials",
                desc: "Include your story and a relevant image (REQUIRED). Insert the image or share a link.",
              },
              {
                num: "04",
                title: "Submit",
                desc: 'Email to hervoice@empowerher-initiative.org. Subject: "Submission to HerVoice".',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-6 py-8 first:pt-0 last:pb-0"
              >
                <span className="text-primary font-serif text-5xl md:text-6xl">
                  {step.num}
                </span>
                <div className="pt-1">
                  <h3 className="text-foreground text-lg font-semibold md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Eligibility ──────────────────────────────────────────────────────────── */

const Eligibility = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        {/* Left — heading + who can submit */}
        <Reveal asChild>
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Requirements
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
              Eligibility
            </h2>
            <p className="text-foreground/70 mt-6 text-base leading-[1.8]">
              HerVoice is open exclusively to students who have been accepted
              into EmpowerHer&apos;s Mentorship Program.
            </p>

            {/* Priority callout — editorial blockquote style */}
            <div className="border-primary/30 border-l-primary bg-primary/[0.05] mt-10 rounded-2xl border border-l-4 p-6">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                Priority Given To
              </p>
              <p className="text-foreground mt-2 text-base">
                Students from EmpowerHer&apos;s{" "}
                <Link
                  href="/mentorship"
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                >
                  Creative Writing and Storytelling Workshop
                </Link>
              </p>
              <p className="text-muted-foreground mt-3 text-sm">
                However, submissions are welcome from all currently enrolled
                participants.
              </p>
            </div>

            {/* Workshop + Submission — minimal divider list */}
            <div className="divide-border/40 mt-12 space-y-0 divide-y">
              <div className="pb-6">
                <h3 className="text-sm font-semibold">Workshop Enrollment</h3>
                <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                  If you are attending{" "}
                  <span className="text-foreground font-medium">any</span>{" "}
                  EmpowerHer workshop, you are eligible to submit your writing.
                </p>
              </div>
              <div className="pt-6">
                <h3 className="text-sm font-semibold">Submission Process</h3>
                <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                  Email your submission to{" "}
                  <a
                    href="mailto:hervoice@empowerher-initiative.org"
                    className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                  >
                    hervoice@empowerher-initiative.org
                  </a>{" "}
                  and include the{" "}
                  <span className="text-foreground font-medium">
                    name of the workshop
                  </span>{" "}
                  you are attending.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right — content requirements as large stat-style cards */}
        <Reveal asChild delay={120}>
          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Content Requirements
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-border/60 bg-muted/60 hover:border-primary/30 overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg">
                <p className="text-primary font-serif text-4xl md:text-5xl">
                  900–1000
                </p>
                <p className="mt-3 text-sm font-semibold">Word Count</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  12-point font, single-spaced
                </p>
              </div>
              <div className="border-border/60 bg-muted/60 hover:border-primary/30 overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg">
                <p className="text-primary font-serif text-4xl md:text-5xl">
                  40
                </p>
                <p className="mt-3 text-sm font-semibold">Max Poetry Lines</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Poems should not exceed this limit
                </p>
              </div>
            </div>

            {/* Warning — red notice */}
            <div className="mt-6 rounded-xl border border-l-4 border-red-200 border-l-red-600 bg-red-50 py-4 pr-5 pl-5">
              <p className="text-foreground/80 text-sm">
                Due to a high volume of submissions, we{" "}
                <span className="font-semibold text-red-700">
                  cannot accept pieces that exceed the word limit
                </span>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Writings ─────────────────────────────────────────────────────── */

const PER_PAGE = 6;

const WritingsSkeleton = () => (
  <section
    id="writings"
    className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
  >
    <div className="container">
      <div className="mb-14">
        <Skeleton className="mb-4 h-3 w-32" />
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className="border-border/40 bg-background flex flex-col overflow-hidden rounded-2xl border"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-3 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-6 h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedWritings = async ({ page }: { page: number }) => {
  const all = await getHervoiceStories();
  const stories = all
    .filter((s) => !s.hide)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalPages = Math.max(1, Math.ceil(stories.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedStories = stories.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <section
      id="writings"
      className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
    >
      <div className="container">
        <Reveal asChild>
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
                Published Stories
              </p>
              <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
                Writings
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Editorial card grid */}
        <Reveal asChild delay={80}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedStories.map((story, i) => (
              <Link
                key={story.slug}
                href={`/hervoice/${story.slug}`}
                className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                  {story.image && (
                    <img
                      src={story.image}
                      alt={story.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                    />
                  )}
                  <span className="bg-background/90 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 font-serif text-xs backdrop-blur-sm">
                    {String((currentPage - 1) * PER_PAGE + i + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="group-hover:text-primary font-serif text-xl leading-snug transition-colors duration-300">
                    &ldquo;{story.title}&rdquo;
                  </p>
                  {story.authorName && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      {story.authorName}
                    </p>
                  )}
                  <span className="text-muted-foreground/50 group-hover:text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium transition-colors duration-300">
                    Read story
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/hervoice"
              hash="#writings"
            />
          </div>
        )}

        <Reveal asChild>
          <div className="mt-12 text-center">
            <Link
              href="/hervoice/featured-writings-from-our-partners"
              className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Featured Writings from Our Partners
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ─── Congressional Testimonies ─────────────────────────────────────────────── */

const CongressionalTestimonies = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <Reveal asChild>
          <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
            Amplifying Voices
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="text-foreground font-serif text-4xl leading-[1.1] md:text-5xl">
            Congressional Testimonies
          </h2>
        </Reveal>

        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed">
            These two congressional testimonies were shared for publication by
            the Afghan Scouts Relief Fund (ASRF) with the EmpowerHer HerVoice
            Initiative.
          </p>
        </Reveal>

        {/* Centered blockquote */}
        <Reveal asChild>
          <div className="border-border my-16 border-l-2 pl-8">
            <p className="text-muted-foreground font-serif text-xl leading-relaxed md:text-2xl">
              &ldquo;These testimonies are representative of the passion of so
              many Afghan women to share their powerful experiences and their
              drive to become their best selves and contribute in their own
              unique ways to society. By sharing the obstacles they have
              overcome and their amazing pursuits, they serve as an inspiration
              to many of their peers who want to navigate their own path to
              success.&rdquo;
            </p>
            <p className="text-muted-foreground mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
              — Afghan Scouts Relief Fund (ASRF)
            </p>
          </div>
        </Reveal>

        <Reveal asChild delay={80}>
          <p className="text-muted-foreground mb-10 text-sm">
            Coming from a country where their very existence is dehumanized, and
            their human rights are not recognized, their resilience in the face
            of adversity should be a message to the whole world that we must
            support the future of Afghan women in every possible way.
          </p>
        </Reveal>

        {/* Videos */}
        <Reveal asChild delay={160}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <video
                controls
                poster="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT4ggEVZxLP0HVtXjpzDWZR85f7vGSgA1FduQY"
                className="w-full"
              >
                <source
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTFAaVBPi81Sgch3ByG9m45xzoRfbnkKwIXpZO"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="text-muted-foreground mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
                Congressional Testimony — Part 1
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <video
                controls
                poster="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTawihdJkAtfy8gUMVlFj5QpoO3BkxsndH9Dm2"
                className="w-full"
              >
                <source
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT1BPtxl2QzEuUaBX9YLlpwGm6Z8oisI4dSv7k"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="text-muted-foreground mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
                Congressional Testimony — Part 2
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Partners ──────────────────────────────────────────────────────────────── */

const partnerOrgs = [
  {
    name: "Amplify Afghan Women",
    location: "Melbourne, Australia",
    href: "https://sites.google.com/view/amplifyafghans/home",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnBzmSPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O9",
  },
  {
    name: "National Society of High School Scholars (NSHSS)",
    location: "Atlanta, Georgia",
    href: "https://www.nshss.org/",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTjPNmNesfkIRBuYnTVcl8O9LdXP5103pNyJUt",
  },
  {
    name: "Humanitas Media",
    location: "Minneapolis, Minnesota",
    href: "https://humanitasmedia.org/",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT2HJysqLQtJ7K2Z4UcWn3gCXRdBvVoY9Ohil8",
  },
  {
    name: "Inanna Publications",
    location: "Toronto, Canada",
    href: "https://inanna.ca/",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTTIznPr82WufQtTg5yH7OAp0KFlsjbkaYIPZB",
  },
];

const PartnerSupport = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-3xl">
          <p className="text-primary mb-6 text-xs font-semibold tracking-[0.3em] uppercase">
            Our Partners
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
            Support from Partners
          </h2>
          <p className="text-foreground/70 mt-8 text-base leading-[1.8] md:text-lg">
            EmpowerHer is proud to partner with four respected publication
            organizations: Amplify Afghan Women, the National Society of High
            School Scholars (NSHSS), Humanitas Media, and Inanna Publications.
            Through HerVoice and our partners&apos; platforms, we advocate for
            girls&apos; education, storytelling, and creative expression. Our
            partners help our students publish their work and reach wider
            audiences across the globe. With the support of these organizations
            and their communities, we are creating a space where Afghan girls
            can share their stories and voices with the world.
          </p>
        </div>
      </Reveal>

      <Reveal asChild delay={120}>
        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {partnerOrgs.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-border/60 bg-background hover:border-primary/40 hover:shadow-primary/5 flex items-center gap-5 rounded-2xl border p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="border-border/60 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary leading-snug font-semibold transition-colors duration-300">
                  {p.name}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {p.location}
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-5 shrink-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── Writing Contest CTA ───────────────────────────────────────────────────── */

const WritingContestCTA = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="bg-primary text-primary-foreground mx-auto flex max-w-5xl flex-col gap-8 overflow-hidden rounded-[2rem] px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14 md:py-16">
          <div>
            <p className="text-primary-foreground/60 text-xs font-semibold tracking-[0.3em] uppercase">
              Contest Results
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
              HerVoice 2026 Writing Contest
            </h2>
            <p className="text-primary-foreground/70 mt-4 max-w-lg text-base leading-relaxed">
              Look at the results of the HerVoice 2026 Writing Contest,
              including cash prize winners and honorable mentions.
            </p>
          </div>
          <Link
            href="/hervoice/winners"
            className="group bg-background text-foreground inline-flex shrink-0 items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
          >
            Explore Stories
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default async function HerVoicePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <>
      <HerVoiceHero />
      <HowToSubmit />
      <Eligibility />
      <Suspense fallback={<WritingsSkeleton />}>
        <FeaturedWritings page={currentPage} />
      </Suspense>
      <CongressionalTestimonies />
      <PartnerSupport />
      <WritingContestCTA />
    </>
  );
}
