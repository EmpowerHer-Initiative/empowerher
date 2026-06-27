import type { Metadata } from "next";
import Link from "next/link";
import { allHervoices } from "content-collections";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Pagination } from "@/components/pagination";

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
        <div>
          <p className="text-primary mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
            Creative Storytelling Platform
          </p>
          <h1 className="font-serif text-6xl leading-[1.0] md:text-8xl lg:text-9xl">
            Her
            <br />
            Voice
          </h1>
        </div>

        {/* Right: description + CTA */}
        <div className="lg:pb-4">
          <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
            HerVoice is EmpowerHer&apos;s creative storytelling platform, where
            students can publish their original writings and express themselves
            freely. At EmpowerHer, we believe in the power of words to heal,
            connect, and drive change.
          </p>
          <blockquote className="border-primary/20 mt-8 border-l-2 pl-6 font-serif text-xl leading-relaxed italic">
            Many of our students have demonstrated remarkable resilience and
            courage through storytelling, using their voices to share personal
            truths and inspire others.
          </blockquote>
          <p className="text-muted-foreground mt-8 text-base leading-relaxed">
            HerVoice gives them the space to do just that&mdash;amplifying their
            experiences and perspectives in a world that too often silences
            them.
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
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              2026 Writing Contest
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
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
          <div className="mt-12 space-y-6">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
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
              <div key={label} className="border-border border-l-2 pl-5">
                <p className="text-muted-foreground text-sm font-semibold">
                  {label}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — numbered steps in a vertical list */}
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
              <span className="text-primary font-serif text-4xl md:text-5xl">
                {step.num}
              </span>
              <div className="pt-1">
                <h3 className="text-foreground text-base font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
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
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Requirements
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
            Eligibility
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-[1.8]">
            HerVoice is open exclusively to students who have been accepted into
            EmpowerHer&apos;s Mentorship Program.
          </p>

          {/* Priority callout — editorial blockquote style */}
          <div className="border-primary/20 mt-10 border-l-2 pl-6">
            <p className="text-muted-foreground/50 text-xs font-semibold tracking-[0.2em] uppercase">
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
            <p className="text-muted-foreground/60 mt-3 text-sm">
              However, submissions are welcome from all currently enrolled
              participants.
            </p>
          </div>

          {/* Workshop + Submission — minimal divider list */}
          <div className="divide-border/40 mt-12 space-y-0 divide-y">
            <div className="pb-6">
              <h3 className="text-sm font-semibold">Workshop Enrollment</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                If you are attending{" "}
                <span className="text-foreground font-medium">any</span>{" "}
                EmpowerHer workshop, you are eligible to submit your writing.
              </p>
            </div>
            <div className="pt-6">
              <h3 className="text-sm font-semibold">Submission Process</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
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

        {/* Right — content requirements as large stat-style cards */}
        <div className="flex flex-col justify-center">
          <p className="text-muted-foreground/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Content Requirements
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="bg-muted/30 overflow-hidden rounded-[2rem] p-8">
              <p className="text-primary font-serif text-4xl md:text-5xl">
                900–1000
              </p>
              <p className="mt-3 text-sm font-semibold">Word Count</p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                12-point font, single-spaced
              </p>
            </div>
            <div className="bg-muted/30 overflow-hidden rounded-[2rem] p-8">
              <p className="text-primary font-serif text-4xl md:text-5xl">40</p>
              <p className="mt-3 text-sm font-semibold">Max Poetry Lines</p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                Poems should not exceed this limit
              </p>
            </div>
          </div>

          {/* Warning — subtle inline */}
          <div className="mt-6 border-l-2 border-rose-300/50 pl-5">
            <p className="text-muted-foreground text-sm">
              Due to a high volume of submissions, we{" "}
              <span className="text-foreground font-semibold">
                cannot accept pieces that exceed the word limit
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Writings ─────────────────────────────────────────────────────── */

const PER_PAGE = 8;

const FeaturedWritings = ({ page }: { page: number }) => {
  const stories = allHervoices
    .filter((s) => !s.contestPlace && !s.hide)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              Published Stories
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              Writings
            </h2>
          </div>
          <Link
            href="/hervoice/featured-writings-from-our-partners"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            Featured Writings from Our Partners
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Magazine-style list */}
        <div className="divide-border/40 divide-y">
          {paginatedStories.map((story, i) => (
            <Link
              key={story._meta.path}
              href={`/hervoice/${story._meta.path}`}
              className="group hover:bg-background grid grid-cols-[auto_1fr_auto] items-center gap-5 py-8 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] sm:grid-cols-[auto_180px_1fr_auto] lg:grid-cols-[auto_260px_1fr_auto]"
            >
              <span className="text-muted-foreground/40 shrink-0 font-serif text-sm">
                {String((currentPage - 1) * PER_PAGE + i + 1).padStart(2, "0")}
              </span>
              <div className="relative hidden aspect-[16/10] overflow-hidden rounded-xl sm:block">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="group-hover:text-primary truncate leading-snug font-medium transition-colors duration-300">
                  &ldquo;{story.title}&rdquo;
                </p>
                {story.authorName && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {story.authorName}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <ArrowRight className="text-muted-foreground/30 group-hover:text-primary size-4 transition-all duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

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

        <div className="mt-12 text-center">
          <Link
            href="/hervoice/featured-writings-from-our-partners"
            className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            Featured Writings from Our Partners
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ─── Congressional Testimonies ─────────────────────────────────────────────── */

const CongressionalTestimonies = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          Amplifying Voices
        </p>
        <h2 className="text-foreground font-serif text-4xl leading-[1.1] md:text-5xl">
          Congressional Testimonies
        </h2>

        {/* Centered blockquote */}
        <div className="border-border my-16 border-l-2 pl-8">
          <p className="text-muted-foreground font-serif text-xl leading-relaxed md:text-2xl">
            &ldquo;These testimonies are representative of the passion of so
            many Afghan women to share their powerful experiences and their
            drive to become their best selves and contribute in their own unique
            ways to society. By sharing the obstacles they have overcome and
            their amazing pursuits, they serve as an inspiration to many of
            their peers who want to navigate their own path to success.&rdquo;
          </p>
          <p className="text-muted-foreground mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
            — Afghan Scouts Relief Fund (ASRF)
          </p>
        </div>

        <p className="text-muted-foreground mb-10 text-sm">
          Coming from a country where their very existence is dehumanized, and
          their human rights are not recognized, their resilience in the face of
          adversity should be a message to the whole world that we must support
          the future of Afghan women in every possible way.
        </p>

        {/* Videos */}
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
      </div>
    </div>
  </section>
);

/* ─── Partners ──────────────────────────────────────────────────────────────── */

const PartnerSupport = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
        <div>
          <p className="text-primary mb-6 text-xs font-semibold tracking-[0.3em] uppercase">
            Our Partners
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
            Support from Partners
          </h2>
        </div>

        <div>
          <p className="text-muted-foreground text-base leading-relaxed">
            EmpowerHer is proud to partner with two respected publication
            organizations: Amplify Afghan Women, and the National Society of
            High School Scholars (NSHSS). Through HerVoice and our
            partners&apos; platforms, we aim to advocate for girls&apos;
            education, storytelling, and creative expression. Our partners help
            our members publish their pieces on their platforms and reach a
            wider audience across the globe. With the support of our partners
            and their communities, we are creating a space where girls can share
            their stories with the world.
          </p>

          <div className="divide-border/40 mt-10 space-y-0 divide-y">
            <a
              href="https://sites.google.com/view/amplifyafghans/home"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-primary flex items-center justify-between py-5 transition-colors duration-300"
            >
              <span className="font-semibold">Amplify Afghan Women</span>
              <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1.5 text-xs transition-colors duration-300">
                Melbourne, Australia
                <ArrowUpRight className="size-4" />
              </span>
            </a>
            <a
              href="https://www.nshss.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-primary flex items-center justify-between py-5 transition-colors duration-300"
            >
              <span className="font-semibold">
                National Society of High School Scholars (NSHSS)
              </span>
              <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1.5 text-xs transition-colors duration-300">
                Atlanta, Georgia
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Writing Contest CTA ───────────────────────────────────────────────────── */

const WritingContestCTA = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="bg-primary text-primary-foreground mx-auto flex max-w-5xl flex-col gap-8 overflow-hidden rounded-[2rem] px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14 md:py-16">
        <div>
          <p className="text-primary-foreground/60 text-xs font-semibold tracking-[0.3em] uppercase">
            Contest Results
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
            HerVoice 2026 Writing Contest
          </h2>
          <p className="text-primary-foreground/70 mt-4 max-w-lg text-base leading-relaxed">
            Look at the results of the HerVoice 2026 Writing Contest, including
            cash prize winners and honorable mentions.
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
      <FeaturedWritings page={currentPage} />
      <CongressionalTestimonies />
      <PartnerSupport />
      <WritingContestCTA />
    </>
  );
}
