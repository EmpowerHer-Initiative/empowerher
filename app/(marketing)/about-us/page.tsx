import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.about.title} — ${siteConfig.name}`,
  description: siteConfig.pages.about.description,
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const AboutHero = () => (
  <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
    <img
      src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTrO039TyJ9E7UkRP3K1djBMpWoJuiOHs42atf"
      alt="About EmpowerHer"
      className="absolute inset-0 h-full w-full object-cover"
    />
    {/* Gradient overlay */}
    <div className="from-foreground/90 via-foreground/40 to-foreground/10 absolute inset-0 bg-gradient-to-t" />

    <div className="relative flex h-full flex-col justify-end pb-20 md:pb-28">
      <div className="container">
        <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
          Our Story
        </p>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
          Born from lived experience.
          <br />
          Built for Afghan women.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          A movement dedicated to equipping Afghan women with resilience,
          creativity, and leadership to shine as sources of inspiration — even
          in the face of adversity.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Mission & Vision ──────────────────────────────────────────────────────── */

const MissionVision = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
        <div>
          <p className="text-primary mb-6 text-xs font-semibold tracking-[0.3em] uppercase">
            Our Mission
          </p>
          <h2 className="font-serif text-3xl leading-[1.2] md:text-4xl lg:text-5xl">
            Beacons of hope in the darkest of times
          </h2>
          <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
            EmpowerHer focuses on equipping Afghan women to become beacons of
            hope in the darkest of times when the shadows of the Taliban seek to
            stifle the voices of Afghan women. By nurturing resilience,
            creativity, and leadership, we strive to empower them to shine as
            sources of inspiration and strength, uplifting their communities
            even in the face of adversity.
          </p>
        </div>

        <div className="lg:pt-16">
          <p className="text-muted-foreground mb-6 text-xs font-semibold tracking-[0.3em] uppercase">
            Our Vision
          </p>
          <h2 className="font-serif text-3xl leading-[1.2] md:text-4xl lg:text-5xl">
            Guiding lights for an equitable society
          </h2>
          <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
            We envision Afghan women as guiding lights in their communities,
            inspiring hope and progress while leading the way to a more
            equitable, inclusive, and sustainable society.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Story ─────────────────────────────────────────────────────────────────── */

const OurStory = () => (
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <p className="text-background/40 mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          How We Started
        </p>

        <div className="text-background/75 space-y-7 text-lg leading-relaxed">
          <p>
            EmpowerHer was born out of the lived experiences of its Co-Founders,{" "}
            <span className="text-background font-semibold">Mahdi Rahimi</span>{" "}
            and{" "}
            <span className="text-background font-semibold">Nahid Karimi</span>,
            both of whom were raised in Kabul, Afghanistan.
          </p>
          <p>
            Growing up, they witnessed firsthand the deep-rooted inequalities
            and daily struggles Afghan communities — particularly women and
            girls — face. From societal restrictions to systemic educational
            barriers, the challenges were immense, but the desire to create
            change was even greater.
          </p>
        </div>

        {/* Pull Quote */}
        <blockquote className="border-background/30 my-14 border-l-2 pl-8">
          <p className="text-background font-serif text-2xl leading-snug md:text-3xl">
            &ldquo;The fall of Kabul on August 15, 2021, marked a turning point
            — not only for their own lives but for the future of millions of
            Afghan girls who were suddenly stripped of their basic right to
            education.&rdquo;
          </p>
        </blockquote>

        <div className="text-background/75 space-y-7 text-lg leading-relaxed">
          <p>
            With schools closed to girls over the age of 12 and women
            increasingly pushed out of public life, Mahdi and Nahid knew silence
            was not an option.
          </p>
          <p>
            After resettling in the United States, they immediately began
            organizing virtual programs aimed at supporting Afghan youth — both
            men and women — inside Afghanistan and across the diaspora. These
            early efforts, though impactful, were limited in scope and duration.
            They reached small groups and operated with minimal resources, yet
            they revealed something powerful: the need was urgent, and the
            demand was growing.
          </p>
          <p>
            It was from this realization that EmpowerHer emerged — not just as a
            project, but as a movement. A more comprehensive, organized, and
            sustainable platform was needed to continue this work on a larger
            scale. Founded and led by Afghan youth who understand the struggles
            of their own people, EmpowerHer stands today as a symbol of
            resilience, hope, and empowerment.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── What We Do ────────────────────────────────────────────────────────────── */

const whatWeDo = [
  {
    index: "01",
    title: "Advocacy",
    description:
      "We amplify the voices of Afghan women and girls through storytelling, leadership training, and global engagement. Our initiatives empower them to speak out, share their experiences, and inspire meaningful change toward justice and equal opportunity.",
  },
  {
    index: "02",
    title: "Education & Leadership",
    description:
      "Through skill-based workshops focused on leadership, personal development, communication, and decision-making, we equip Afghan girls with the confidence and tools to lead their communities with strength and purpose.",
  },
  {
    index: "03",
    title: "Creative Expression",
    description:
      "We empower Afghan girls to reclaim their voices through writing, storytelling, and the arts. Our programs provide platforms for creative expression as a powerful form of resistance and healing, helping them share their lived experiences with the world.",
  },
  {
    index: "04",
    title: "Community Engagement",
    description:
      "Our graduates and members can access EmpowerHer's resources and engage with our vibrant community. We support them in creating impactful initiatives both within and outside Afghanistan through virtual and in-person programs.",
  },
];

const WhatWeDo = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
            Our Work
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
            What We Do
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed md:text-right">
          Four interconnected pillars that work together to create lasting
          change for Afghan women.
        </p>
      </div>

      {/* Alternating full-width blocks */}
      <div className="divide-border/40 divide-y">
        {whatWeDo.map((item, i) => (
          <div
            key={item.index}
            className={`group hover:bg-muted/30 flex flex-col gap-8 py-10 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex-row md:items-center md:gap-0 ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/4">
              <span className="text-muted-foreground/20 group-hover:text-primary/20 font-serif text-6xl transition-colors duration-500 md:text-8xl">
                {item.index}
              </span>
            </div>
            <div
              className={`md:w-3/4 ${i % 2 !== 0 ? "md:pr-16" : "md:pl-16"}`}
            >
              <h3 className="text-2xl font-semibold md:text-3xl">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Team ──────────────────────────────────────────────────────────────────── */

const executiveTeam = [
  {
    name: "Mahdi Rahimi",
    role: "Co-Founder & Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfgQqh43C8OG5vkbyTeNds9rYucAtpJg0PMV7",
  },
  {
    name: "Nahid Karimi",
    role: "Co-Founder & Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTPXlWDWYhZvxtB3ycfP5jQXiMRAWOCrnJ2oYe",
  },
];

const directors = [
  {
    name: "Sara F",
    role: "Mentorship Program Director & Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT8waekQlgkEDp7B3XRvCJzMmyWOSiao4I6cq9",
  },
  {
    name: "Daniel Fletcher",
    role: "Social Media Director",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqlVv7UBYobifLHTavDVU7h0yBGlSc4z8XEQn",
  },
  {
    name: "Ali Reza Samadi",
    role: "IT & Systems Manager",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTaIvbdmAtfy8gUMVlFj5QpoO3BkxsndH9Dm2E",
  },
  {
    name: "Edna Gebremedhin",
    role: "Social Media & Outreach Coordinator | Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTatnMPKAtfy8gUMVlFj5QpoO3BkxsndH9Dm2E",
  },
];

const mentorsTeam = [
  {
    name: "Leena Geloo",
    role: "Cultural Exchange and Language Learning (CELL) Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTUhliWsMuHB63DFcWbZp7rAk9VUJPgitsO2Ca",
  },
  {
    name: "Sarah Ghaznawi",
    role: "Resume Building Workshop Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTKWc50tCVy1oGkRMuS0Lravl9JbQIxWFcNhtq",
  },
  {
    name: "Atifa Annabi",
    role: "Communication & Public Speaking Workshop Mentor",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTLYYVyf6noMe1jZlBSmFX7gAOT28J3hWKaNI0",
  },
  {
    name: "Orly Bloom",
    role: "Lecturer",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTWSJkk9XFwogO1GlqLJaX2yrjpNUsTDBdMI0C",
  },
  {
    name: "Leo Martinez",
    role: "Lecturer",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n",
  },
  {
    name: "Lily Jean Loveland",
    role: "Lecturer",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTS7YSk2xH1XUo4r0Hn2pxVOeJj6STiyCaKZ7v",
  },
];

const memberSizes = {
  lg: {
    avatar: "h-28 w-28 md:h-36 md:w-36",
    name: "text-base",
    role: "text-xs",
  },
  md: {
    avatar: "h-20 w-20 md:h-28 md:w-28",
    name: "text-sm",
    role: "text-xs",
  },
  sm: {
    avatar: "h-16 w-16 md:h-20 md:w-20",
    name: "text-sm",
    role: "text-xs",
  },
} as const;

const TeamMember = ({
  member,
  size = "md",
}: {
  member: { name: string; role: string; image: string };
  size?: keyof typeof memberSizes;
}) => (
  <div className="group flex flex-col items-center text-center">
    <div
      className={`border-border/40 group-hover:border-primary/40 group-hover:shadow-primary/10 relative mb-4 overflow-hidden rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-lg ${memberSizes[size].avatar}`}
    >
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
      />
    </div>
    <p className={`leading-tight font-semibold ${memberSizes[size].name}`}>
      {member.name}
    </p>
    <p
      className={`text-muted-foreground mt-1 leading-snug ${memberSizes[size].role}`}
    >
      {member.role}
    </p>
  </div>
);

const TeamSection = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="mb-16">
        <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
          The People Behind It
        </p>
        <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
          Our Team
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg">
          Founded and led by Afghan youth who understand the struggles of their
          own people.
        </p>
      </div>

      <div className="mb-14">
        <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          Executive Team
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 md:gap-x-14">
          {executiveTeam.map((member) => (
            <TeamMember key={member.name} member={member} size="lg" />
          ))}
        </div>
      </div>

      <div className="border-border/40 mb-14 border-t pt-14">
        <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          Directors
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 md:gap-x-14">
          {directors.map((member) => (
            <TeamMember key={member.name} member={member} size="md" />
          ))}
        </div>
      </div>

      <div className="border-border/40 border-t pt-14">
        <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
          Mentors & Lecturers
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 md:gap-x-14">
          {mentorsTeam.map((member) => (
            <TeamMember key={member.name} member={member} size="sm" />
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── CTA ───────────────────────────────────────────────────────────────────── */

const AboutCTA = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
            Take Action
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
            Join the
            <br />
            Movement
          </h2>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row md:items-center">
          <Link
            href="/get-involved"
            className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
          >
            Get Involved
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/mentorship"
            className="border-border/60 text-foreground/80 hover:border-foreground/30 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            Explore Programs
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <OurStory />
      <WhatWeDo />
      <TeamSection />
      <AboutCTA />
    </>
  );
}
