import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Laptop,
  Mail,
  Network,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.spr.title} — ${siteConfig.name}`,
  description: siteConfig.pages.spr.description,
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Full-bleed image behind */}
    <div className="absolute inset-0">
      <img
        src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqmNmG6BYobifLHTavDVU7h0yBGlSc4z8XEQn"
        alt=""
        className="h-full w-full object-cover"
      />
      <div className="bg-foreground/70 absolute inset-0" />
    </div>

    <div className="relative container py-28 md:py-40">
      <Link
        href="/success-stories"
        className="group text-background/60 hover:text-background mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back to Success Stories
      </Link>

      <div className="max-w-2xl">
        <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
          Leadership Pathway
        </p>
        <h1 className="text-background mt-5 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
          Student Project Roadmap
        </h1>
        <p className="text-background/75 mt-8 max-w-xl text-base leading-relaxed md:text-lg">
          A structured leadership pathway for EmpowerHer graduates who wish to
          design and lead their own impact-driven online classes — directly
          expanding educational access for Afghan girls.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Intro ─────────────────────────────────────────────────────────────────── */

const Intro = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          Through a step-by-step process, students work closely with
          EmpowerHer&apos;s team to gain practical teaching experience, design
          their own curriculum, and ultimately become mentors to the next cohort
          of Afghan girls. This is not just a program — it is how we grow our
          own leaders from within.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Eligibility ───────────────────────────────────────────────────────────── */

const eligibilityRules = [
  "Students must successfully complete and obtain Certificates of Completion for two consecutive workshops.",
  "Students must be actively engaged in the two workshops they attended and punctual with all assigned work, including discussions, projects, assignments, and other mentorship materials.",
  "Students must pass an interview with the Mentorship Program Director assessing skillsets and language proficiency.",
];

const Eligibility = () => (
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
          Requirements
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Eligibility Requirements
        </h2>
        <p className="text-background/65 mt-6 text-base leading-relaxed">
          Before applying, confirm you meet all three criteria below.
        </p>

        <ol className="mt-12 space-y-8">
          {eligibilityRules.map((rule, i) => (
            <li key={i} className="flex gap-6">
              <span className="text-background/20 mt-0.5 shrink-0 font-serif text-4xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-background/75 text-base leading-relaxed">
                {rule}
              </p>
            </li>
          ))}
        </ol>

        {/* How to apply — inline */}
        <div className="border-background/10 mt-16 border-t pt-12">
          <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Application
          </p>
          <h3 className="text-background mt-4 font-serif text-3xl">
            How to Apply
          </h3>
          <p className="text-background/75 mt-5 text-base leading-relaxed">
            Submit an inquiry to{" "}
            <a
              href="mailto:apply@empowerher-initiative.org"
              className="border-background/30 hover:border-background/70 border-b transition-colors"
            >
              apply@empowerher-initiative.org
            </a>
            . Include your full name, the two EmpowerHer workshops you have
            attended, and your reasons for wanting to join this roadmap. Once
            received, the Mentorship Program Director will schedule an interview
            shortly.
          </p>
          <div className="mt-8">
            <a
              href="mailto:apply@empowerher-initiative.org"
              className="group bg-background text-foreground hover:shadow-background/20 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
            >
              <Mail className="size-4" />
              Apply via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Step by Step ──────────────────────────────────────────────────────────── */

const steps = [
  {
    number: "01",
    title: "Welcome as Assistant",
    description:
      "Successful candidates are welcomed as Assistants for two workshop cycles. We will match you with any available mentor and their respective workshop.",
  },
  {
    number: "02",
    title: "Hands-On Experience",
    description:
      "Assistants gain hands-on experience supporting new participants and learning how an EmpowerHer workshop operates — including MIS applications, registration, communication, and leading online sessions.",
  },
  {
    number: "03",
    title: "Design Your Workshop",
    description:
      "During these two workshop cycles, assistants design their own online workshops and prepare mentorship materials. All materials are subject to approval from EmpowerHer's Mentorship Program Director.",
  },
  {
    number: "04",
    title: "Academic Demo Session",
    description:
      "Assistants conduct a 90-minute Academic Demo Session, mentoring a staff member using their own materials to demonstrate teaching and leadership skills.",
  },
  {
    number: "05",
    title: "Promoted to Mentor",
    description:
      "After successfully completing the demo, Assistants are promoted to Mentor positions, officially joining the EmpowerHer Mentorship Program and mentoring many more Afghan girls.",
  },
];

const StepByStep = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          The Process
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Step by Step Guide
        </h2>

        {/* Vertical timeline */}
        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="bg-border absolute top-4 bottom-4 left-[1.125rem] w-px" />

          <ol className="space-y-0">
            {steps.map((step, i) => (
              <li
                key={step.number}
                className="relative flex gap-8 pb-12 last:pb-0"
              >
                {/* Circle node */}
                <div className="border-border bg-background relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2">
                  <span className="text-muted-foreground text-[10px] font-bold">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-0.5">
                  <h3 className="text-lg leading-snug font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Benefits ──────────────────────────────────────────────────────────────── */

const benefits = [
  {
    icon: Laptop,
    title: "Hands-On Leadership Experience",
    description:
      "Gain practical skills in leading online classes and mentoring peers.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Professional Development",
    description:
      "Learn how a nonprofit operates and develop communication, project management, and organizational skills.",
  },
  {
    icon: Zap,
    title: "Direct Impact",
    description:
      "Expand educational access for Afghan girls through student-led initiatives.",
  },
  {
    icon: Users,
    title: "Mentorship & Guidance",
    description:
      "Receive structured support and feedback from EmpowerHer's experienced team throughout the roadmap.",
  },
  {
    icon: Network,
    title: "Resource & Networking",
    description:
      "Use EmpowerHer's resources to enhance your skills and connect with a broader network.",
  },
  {
    icon: TrendingUp,
    title: "Promotion",
    description:
      "Based on strong performance and demonstrated leadership, EmpowerHer may offer talented members opportunities for promotion.",
  },
];

const Benefits = () => (
  <section className="bg-foreground/[0.03] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          What You Gain
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Roadmap Benefits
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <div className="divide-border border-border grid gap-0 divide-y border-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`flex gap-5 p-8 ${i >= 2 && i < 4 ? "sm:border-border sm:border-t" : ""} ${i >= 4 ? "sm:border-border sm:border-t" : ""}`}
            >
              <div className="mt-0.5 shrink-0">
                <benefit.icon className="text-primary size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer note */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="border-border bg-background flex gap-4 rounded-2xl border p-6">
          <AlertCircle className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Important Note</p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              EmpowerHer does not provide a monthly salary for its staff
              members. All roles within this roadmap are volunteer-based.
              Participation as an Assistant or Mentor is completely free and no
              monetary compensation is provided.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <a
          href="mailto:apply@empowerher-initiative.org"
          className="group bg-foreground text-background hover:shadow-foreground/10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
        >
          Apply Now
          <span className="bg-background/10 flex size-6 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" />
          </span>
        </a>
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function SprPage() {
  return (
    <>
      <Hero />
      <Intro />
      <Eligibility />
      <StepByStep />
      <Benefits />
    </>
  );
}
