import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { caller } from "@/services/trpc/server";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.mentorship.title} — ${siteConfig.name}`,
  description: siteConfig.pages.mentorship.description,
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const MentorshipHero = () => (
  <section className="relative overflow-hidden py-28 md:py-40">
    <img
      src="https://cdn.empowerher-initiative.org/mentorship-hero.jpeg"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
    <div className="relative container">
      <div className="mx-auto max-w-4xl">
        <Reveal asChild>
          <p className="mb-8 text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
            Core Program
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Mentorship
            <br />
            Program
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-20">
            <p className="text-lg leading-relaxed text-white/75">
              EmpowerHer&apos;s main program is the Mentorship Program, where
              students can apply to one of our workshops and receive free
              mentorship from our dedicated and highly trained mentors and
              lecturers.
            </p>
            <p className="text-lg leading-relaxed text-white/75">
              This program aims to provide Afghan girls with the resources,
              opportunities, and networks they need to launch their own impact
              projects.
            </p>
          </div>
        </Reveal>
        <Reveal asChild delay={240}>
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#workshops"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 active:scale-[0.98]"
            >
              Find Workshop Applications Here
              <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Intro ─────────────────────────────────────────────────────────────────── */

const MentorshipIntro = () => (
  <section className="pt-28 md:pt-40">
    <div className="container">
      <div className="mx-auto max-w-3xl space-y-10">
        <Reveal asChild>
          <blockquote className="border-primary/20 border-l-2 pl-8 font-serif text-2xl leading-relaxed italic md:text-3xl">
            Through this platform, EmpowerHer encourages students to think
            outside the box and view their challenges as sources of
            resilience&mdash;life lessons that empower them to pursue their
            goals and dreams.
          </blockquote>
        </Reveal>
        <Reveal asChild delay={80}>
          <p className="text-muted-foreground leading-[1.8]">
            EmpowerHer creates a safe, supportive space where students can
            discuss their struggles openly, feel heard and seen, and reflect on
            their experiences.
          </p>
        </Reveal>
        <Reveal asChild delay={160}>
          <div className="border-primary/20 bg-primary/[0.04] rounded-2xl border p-8">
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              Our Impact
            </p>
            <p className="text-muted-foreground leading-[1.8]">
              Whether through launching a project, mentoring a sibling or
              friend, or simply taking a first step, EmpowerHer helps students
              grow&mdash;one story, one action, and one empowered voice at a
              time.
            </p>
          </div>
        </Reveal>
        <Reveal asChild delay={240}>
          <p className="leading-[1.8] font-medium">
            Join us in empowering the next generation of Afghan leaders and
            changemakers through our comprehensive mentorship program.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Workshop Structure ────────────────────────────────────────────────────── */

const workshopStructure = [
  {
    number: "01",
    title: "Cycle Duration",
    description: "Each workshop runs in 6-week cycles (about 1.5 months).",
  },
  {
    number: "02",
    title: "Sessions per Week",
    description: "Workshops meet twice weekly — on Saturdays and Sundays.",
  },
  {
    number: "03",
    title: "Session Length",
    description: "Each session is 2 hours long.",
  },
  {
    number: "04",
    title: "Saturday Sessions",
    description:
      "Led by assigned mentors. Focused on skill-building, presentations, and guided activities.",
  },
  {
    number: "05",
    title: "Sunday Sessions",
    description:
      "Dedicated to guest speaker presentations, group discussions, lecturers, and Q&A. Covers themes related to empowerment, leadership, storytelling, and resilience.",
  },
  {
    number: "06",
    title: "Workshop Format",
    description:
      "Fully virtual via Google Meet. Materials including assignments and other activities are posted through separate Google Classrooms.",
  },
  {
    number: "07",
    title: "Participant Limit",
    description:
      "Each workshop accepts 16 participants to ensure personalized attention.",
  },
  {
    number: "08",
    title: "Mentorship Style",
    description:
      "Collaborative and discussion-based, encouraging peer support and active participation. Mentors guide students through both personal reflection and project development.",
  },
  {
    number: "09",
    title: "Project-Based Learning",
    description:
      "Participants complete capstone or final projects such as creative writing, art, real-world projects, impact proposals, or cultural presentations reflecting what they have learned.",
  },
];

const WorkshopStructure = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal asChild>
          <div>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              How It Works
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              Workshop Structure
            </h2>
          </div>
        </Reveal>
        <Reveal asChild delay={80}>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Every detail is designed to maximize learning, connection, and
            empowerment.
          </p>
        </Reveal>
      </div>

      {/* Card grid — brand-accented */}
      <Reveal asChild delay={160}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workshopStructure.map((item) => (
            <div
              key={item.number}
              className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top accent bar */}
              <span className="from-primary to-secondary absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100" />

              <div className="flex items-baseline justify-between">
                <span className="text-primary/30 group-hover:text-primary font-serif text-5xl leading-none transition-colors duration-500">
                  {item.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal asChild delay={240}>
        <div className="mt-14 flex justify-center">
          <Link
            href="/sisterhood-sessions"
            className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            Learn About Sisterhood Sessions
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── Eligibility ───────────────────────────────────────────────────────────── */

const eligibilityRules: React.ReactNode[] = [
  "Afghan girls residing in Afghanistan and any other Middle Eastern or Central Asian countries are welcome to apply to our programs.",
  "Intermediate or advanced English proficiency is required.",
  "Although there is no age limit to apply to any of EmpowerHer's workshops, our team prefers applicants aged 14 and above.",
  <>
    Afghan girls residing in Europe or America (any region outside the Middle
    East and Central Asia) are not eligible to apply to our programs; however,
    we encourage them to volunteer with us through the following link:{" "}
    <Link
      href="/get-involved/volunteer-with-us"
      className="text-primary hover:text-primary/80 underline underline-offset-4"
    >
      Volunteer
    </Link>
  </>,
  "Men are not eligible to apply to our programs at this time.",
];

const Eligibility = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
        <Reveal asChild>
          <div>
            <p className="text-primary mb-6 text-xs font-semibold tracking-[0.3em] uppercase">
              Requirements
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              Who Can Apply
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              Please review the following requirements before applying to any
              EmpowerHer workshop.
            </p>
          </div>
        </Reveal>

        <Reveal asChild delay={120}>
          <div className="space-y-3">
            {eligibilityRules.map((rule, i) => (
              <div
                key={i}
                className="group hover:border-primary/30 hover:bg-primary/[0.04] flex gap-5 rounded-2xl border border-transparent p-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full font-serif text-lg transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-foreground/80 mt-1 text-sm leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Opportunities ─────────────────────────────────────────────────────────── */

const Opportunities = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="mb-16">
          <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
            After Completion
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
            Opportunities After
            <br />
            Completing Programs
          </h2>
        </div>
      </Reveal>

      <Reveal asChild delay={160}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">01</p>
            <h3 className="mt-6 text-xl font-semibold">
              Leadership Opportunities
            </h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Graduates may be selected as assistant mentors and eventually lead
              their own workshops. EmpowerHer identifies a number of promising
              students and works closely with them to help launch their own
              initiatives.
            </p>
            <Link
              href="/success-stories/spr"
              className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              Student Project Roadmap (SPR)
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">02</p>
            <h3 className="mt-6 text-xl font-semibold">Publication Access</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Students may publish their work through HerVoice and our partner
              platforms.
            </p>
            <Link
              href="/hervoice"
              className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              Explore HerVoice
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">03</p>
            <h3 className="mt-6 text-xl font-semibold">Continued Engagement</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Ongoing involvement in projects, events, and the EmpowerHer
              community.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal asChild delay={240}>
        <p className="text-muted-foreground mt-10 text-sm leading-relaxed">
          Additional information will be shared during our virtual sessions by
          EmpowerHer mentors.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ─── Workshops ─────────────────────────────────────────────────────────────── */

const Workshops = async () => {
  const workshops = await caller.workshops.list();

  if (workshops.length === 0) return null;

  return (
    <section
      id="workshops"
      className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
    >
      <div className="container">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal asChild>
            <div>
              <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
                Apply Now
              </p>
              <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
                Available Workshops
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Alternating image-left / image-right layout */}
        <div className="space-y-6">
          {workshops.map((workshop, i) => (
            <Reveal asChild key={workshop.id}>
              <div
                className={`group border-border/40 bg-background hover:border-primary/20 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden md:aspect-auto md:w-2/5 md:shrink-0">
                  <img
                    src={workshop.image}
                    alt={workshop.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                </div>
                {/* Details */}
                <div className="flex flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
                  <div>
                    {workshop.mentors.length > 0 && (
                      <p className="text-primary mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
                        Mentor — {workshop.mentors.join(", ")}
                      </p>
                    )}
                    <h3 className="text-2xl leading-snug font-semibold md:text-3xl">
                      {workshop.name}
                    </h3>
                    <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                      {workshop.description}
                    </p>
                  </div>
                  <a
                    href={workshop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
                  >
                    Apply Here
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkshopsSkeleton = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="mb-16">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="h-10 w-80 md:h-12" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className={`border-border/40 flex flex-col overflow-hidden rounded-3xl border md:flex-row ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <Skeleton className="aspect-video rounded-none md:aspect-auto md:min-h-80 md:w-2/5 md:shrink-0" />
            <div className="flex flex-1 flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
              <div>
                <Skeleton className="mb-3 h-3 w-40" />
                <Skeleton className="h-8 w-2/3" />
                <div className="mt-4 space-y-2.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function MentorshipPage() {
  return (
    <>
      <MentorshipHero />
      <MentorshipIntro />
      <WorkshopStructure />
      <Eligibility />
      <Opportunities />
      <Suspense fallback={<WorkshopsSkeleton />}>
        <Workshops />
      </Suspense>
    </>
  );
}
