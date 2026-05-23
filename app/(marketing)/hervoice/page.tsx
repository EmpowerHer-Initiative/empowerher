import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.hervoice.title} — ${siteConfig.name}`,
  description: siteConfig.pages.hervoice.description,
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const HerVoiceHero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-24">
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
            freely.
          </p>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed">
            Many of our students have demonstrated remarkable resilience and
            courage through storytelling, using their voices to share personal
            truths and inspire others. HerVoice gives them the space to do just
            that — amplifying their experiences and perspectives in a world that
            too often silences them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#writings"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
            >
              Read Stories from HerVoice
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
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — editorial heading */}
        <div>
          <p className="text-background/40 text-xs font-semibold tracking-[0.3em] uppercase">
            Submission Guide
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
            How to Submit
            <br />
            <span className="text-primary italic">Your Story</span>
          </h2>
          <p className="text-background/50 mt-6 max-w-md text-base leading-[1.8]">
            Every submission is a step toward being heard. Follow these four
            steps to share your voice with the world through HerVoice.
          </p>

          {/* Guidelines — border-left style like co-founder quotes */}
          <div className="mt-12 space-y-6">
            <p className="text-background/30 text-xs font-semibold tracking-[0.3em] uppercase">
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
              <div key={label} className="border-background/10 border-l-2 pl-5">
                <p className="text-background/80 text-sm font-semibold">
                  {label}
                </p>
                <p className="text-background/40 mt-1 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — numbered steps in a vertical list */}
        <div className="divide-background/10 space-y-0 divide-y">
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
              desc: 'Email to hervoice@empowerher-initiative.org with the subject line "Submission to HerVoice".',
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
                <h3 className="text-background/90 text-base font-semibold">
                  {step.title}
                </h3>
                <p className="text-background/45 mt-2 text-sm leading-relaxed">
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

const featuredWritings = [
  {
    title: "Building Windows Where They Built Walls",
    author: "Nahid Karimi",
    platform: "NSHSS",
    image:
      "https://www.nshss.org/media/vymjdyup/afghan-girl_2025.png?width=640&height=360&v=1dbfa899b327380&format=webp&quality=80",
    slug: null,
  },
  {
    title:
      "Leading with Resilience: My Journey as an Afghan Student and Advocate",
    author: "Mahdi Rahimi",
    platform: "NSHSS",
    image:
      "https://www.nshss.org/media/03nk1qj0/afghan-students-2025.jpg?width=640&height=360&v=1dc107735d0c7e0&format=webp&quality=80",
    slug: null,
  },
  {
    title: "The Girl from Kabul: A Story of Words and Wounds",
    author: "Sadaf A",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCNVteXp0xR3LuJK2fkyDlQSq5OVpmHz6CThE",
    slug: "the-girl-from-kabul-a-story-of-words-and-wounds",
  },
  {
    title: "If the Taliban Had Never Existed",
    author: "Sakhydadi",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTTVlV0WA82WufQtTg5yH7OAp0KFlsjbkaYIPZ",
    slug: "if-the-taliban-had-never-existed",
  },
  {
    title: "In another time, I was\u2026",
    author: "Suhaila N",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCsBIywp0xR3LuJK2fkyDlQSq5OVpmHz6CThE",
    slug: "i-hope-i-dont-forget-myself",
  },
  {
    title: "A Bridge Between Two Worlds",
    author: "Zahra A",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT56kEagAWxDjwpl6zcWuZFSE0gC1TOnBMHdPh",
    slug: "a-bridge-between-two-worlds",
  },
  {
    title: "How Education and Art Empower Afghan Girls",
    author: "Sabira Hussaini",
    platform: "NSHSS",
    image:
      "https://www.nshss.org/media/0b1hmzo4/sabira-hussani-art.png?width=640&height=360&v=1dc228d45c7d710&format=webp&quality=80",
    slug: null,
  },
  {
    title: "What if the Taliban Didn\u2019t Exist?",
    author: "Farzana A",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La06tY1jbZo7DsLPidlGr6Uf2HKquxXJ3CN",
    slug: null,
  },
  {
    title: "Why does empowering women matter?",
    author: "Sohaila S",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT38knrnKpPsIbjXnuoAM3O2JygVY8KzGFtD6k",
    slug: "empowering-woman",
  },
  {
    title: "The Girl with the Borrowed Light",
    author: "Zarghona N",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT4sck5FSxLP0HVtXjpzDWZR85f7vGSgA1FduQ",
    slug: null,
  },
  {
    title: "Alkahest",
    author: "Asma H",
    platform: "Amplify Afghan Women",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfRmzu73C8OG5vkbyTeNds9rYucAtpJg0PMV7",
    slug: null,
  },
  {
    title: "Online Education and the Fight for a Future",
    author: "Haya",
    platform: "NSHSS",
    image:
      "https://www.nshss.org/media/wgxo3nrb/girl-next-to-window.jpg?width=640&height=360&v=1dc32f91f7e03f0&format=webp&quality=80",
    slug: null,
  },
];

const platformColors: Record<string, string> = {
  NSHSS: "bg-primary/10 text-primary border-primary/20",
  "Amplify Afghan Women": "bg-muted text-muted-foreground border-border/40",
};

const FeaturedWritings = () => (
  <section id="writings" className="bg-foreground/[0.02] py-28 md:py-40">
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
          View Full Archive
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Magazine-style list */}
      <div className="divide-border/40 divide-y">
        {featuredWritings.map((writing, i) => {
          const inner = (
            <>
              <span className="text-muted-foreground/40 shrink-0 font-serif text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative hidden aspect-[16/10] overflow-hidden rounded-lg sm:block">
                <img
                  src={writing.image}
                  alt={writing.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <p className="group-hover:text-primary truncate leading-snug font-medium transition-colors duration-300">
                  &ldquo;{writing.title}&rdquo;
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {writing.author}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${platformColors[writing.platform] ?? "bg-muted text-muted-foreground border-border/40"}`}
                >
                  {writing.platform}
                </span>
                <ArrowRight className="text-muted-foreground/30 group-hover:text-primary size-4 transition-all duration-300 group-hover:translate-x-0.5" />
              </div>
            </>
          );

          const className =
            "group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background sm:grid-cols-[auto_80px_1fr_auto]";

          return writing.slug ? (
            <Link
              key={i}
              href={`/hervoice/${writing.slug}`}
              className={className}
            >
              {inner}
            </Link>
          ) : (
            <div key={i} className={`${className} opacity-70`}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/hervoice/featured-writings-from-our-partners"
          className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          View Full List of Writings
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);

/* ─── Congressional Testimonies ─────────────────────────────────────────────── */

const CongressionalTestimonies = () => (
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <p className="text-background/40 mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          Amplifying Voices
        </p>
        <h2 className="text-background font-serif text-4xl leading-[1.1] md:text-5xl">
          Congressional Testimonies
        </h2>

        {/* Centered blockquote */}
        <div className="border-background/20 my-16 border-l-2 pl-8">
          <p className="text-background/80 font-serif text-xl leading-relaxed md:text-2xl">
            &ldquo;These testimonies are representative of the passion of so
            many Afghan women to share their powerful experiences and their
            drive to become their best selves and contribute in their own unique
            ways to society. By sharing the obstacles they have overcome and
            their amazing pursuits, they serve as an inspiration to many of
            their peers who want to navigate their own path to success.&rdquo;
          </p>
          <p className="text-background/40 mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
            — Afghan Scouts Relief Fund (ASRF)
          </p>
        </div>

        <p className="text-background/50 mb-10 text-sm">
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
            <p className="text-background/40 mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
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
            <p className="text-background/40 mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
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
            organizations. Through HerVoice and our partners&apos; platforms, we
            advocate for girls&apos; education, storytelling, and creative
            expression. Our partners help our members publish their pieces and
            reach a wider audience across the globe — creating a space where
            girls can share their stories with the world.
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

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HerVoicePage() {
  return (
    <>
      <HerVoiceHero />
      <HowToSubmit />
      <Eligibility />
      <FeaturedWritings />
      <CongressionalTestimonies />
      <PartnerSupport />
    </>
  );
}
