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

import { Reveal } from "@/components/reveal";

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
      <Reveal>
        <Link
          href="/success-stories"
          className="group text-background/60 hover:text-background mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to Success Stories
        </Link>
      </Reveal>

      <Reveal asChild delay={120}>
        <div className="max-w-2xl">
          <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
            Leadership Pathway
          </p>
          <h1 className="text-background mt-5 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
            Student Project Roadmap
          </h1>
          <p className="text-background/75 mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            The Student Project Roadmap (SRP) is a leadership pathway for
            EmpowerHer students who have completed their workshops and met
            eligibility requirements and wish to deepen their practical
            leadership experience. Through a structured, step-by-step process,
            students work closely with EmpowerHer&apos;s team to design and lead
            their own impact-driven online classes, directly advancing
            EmpowerHer&apos;s mission and expanding educational access for more
            Afghan girls.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── Intro ─────────────────────────────────────────────────────────────────── */

/* ─── Eligibility ───────────────────────────────────────────────────────────── */

const eligibilityRules = [
  "Students must successfully complete and obtain Certificates of Completion for two consecutive workshops.",
  "Students must be actively engaged in the two workshops they attended and punctual with all assigned work, including discussions, projects, assignments, and other mentorship materials.",
  "Students must pass an interview with the Mentorship Program Director assessing skillsets and language proficiency.",
];

const ruleAccents = [
  "from-amber-300 to-amber-500 shadow-amber-500/30",
  "from-rose-300 to-rose-500 shadow-rose-500/30",
  "from-emerald-300 to-emerald-500 shadow-emerald-500/30",
];

const Eligibility = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1f3a] to-[#13294d] py-28 text-white md:py-40">
    {/* Soft glow accents */}
    <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-amber-400/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-emerald-400/10 blur-3xl" />

    <div className="relative container">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
            Requirements
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Eligibility Requirements
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70">
            Before applying, confirm you meet all three criteria below.
          </p>
        </Reveal>

        <ol className="mt-12 space-y-5">
          {eligibilityRules.map((rule, i) => (
            <li
              key={i}
              className="animate-fade-up group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09]"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ruleAccents[i % ruleAccents.length]} font-serif text-xl text-[#0b1f3a] shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:-rotate-6`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="self-center text-base leading-relaxed text-white/85">
                {rule}
              </p>
            </li>
          ))}
        </ol>

        {/* How to apply — inline */}
        <Reveal asChild>
          <div className="mt-16 border-t border-white/15 pt-12">
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
              Application
            </p>
            <h3 className="mt-4 font-serif text-3xl text-white">
              How to Apply
            </h3>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              Submit an inquiry to{" "}
              <a
                href="mailto:apply@empowerher-initiative.org"
                className="font-medium text-amber-300 underline decoration-amber-300/40 underline-offset-4 transition-colors hover:decoration-amber-300"
              >
                apply@empowerher-initiative.org
              </a>
              . Include your full name, the two EmpowerHer workshops you have
              attended, and your reasons for wanting to join this roadmap. Once
              received, the Mentorship Program Director will schedule an
              interview shortly.
            </p>
            <div className="mt-8">
              <a
                href="mailto:apply@empowerher-initiative.org"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0b1f3a] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
              >
                <Mail className="size-4" />
                Apply via Email
              </a>
            </div>
          </div>
        </Reveal>
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
      "Successful candidates are welcomed as Assistants for two workshop cycles. We will match you with any available mentor and his/her respective workshop.",
  },
  {
    number: "02",
    title: "Hands-On Experience",
    description:
      "Assistants gain hands-on experience supporting new participants and learning how an EmpowerHer workshop operates. They will learn about EmpowerHer's internal system, including training on how to check MIS applications, registration applications, communicate effectively, and lead online sessions.",
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
      "Towards the end of Assistant training and the two month workshop cycle, assistants conduct a one and half hour long Academic Demo Session, mentoring a staff member (with their materials) to demonstrate their teaching and leadership skills.",
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
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            The Process
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Step by Step Guide
          </h2>
        </Reveal>

        {/* Vertical timeline */}
        <Reveal asChild delay={100}>
          <div className="relative mt-16">
            {/* Connecting line */}
            <div className="bg-border absolute top-4 bottom-4 left-[1.125rem] w-px" />

            <ol className="space-y-0">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="group relative flex gap-8 pb-12 last:pb-0"
                >
                  {/* Circle node */}
                  <div className="border-primary/40 bg-background group-hover:border-primary group-hover:bg-primary group-hover:shadow-primary/25 relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:shadow-lg">
                    <span className="text-primary group-hover:text-primary-foreground text-[10px] font-bold transition-colors duration-500">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                    <h3 className="group-hover:text-primary text-lg leading-snug font-semibold transition-colors duration-500">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
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
    title: "Resource & Networking Opportunities",
    description:
      "Use EmpowerHer's resources to enhance your skills and connect with a broader network.",
  },
  {
    icon: TrendingUp,
    title: "Promotion",
    description:
      "Based on strong workshop performance, dedication, and demonstrated leadership, EmpowerHer may offer talented members opportunities for promotion.",
  },
];

const Benefits = () => (
  <section className="bg-foreground/[0.03] py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="mx-auto max-w-2xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            What You Gain
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Roadmap Benefits
          </h2>
        </div>
      </Reveal>

      <div className="mx-auto mt-16 max-w-2xl">
        <Reveal asChild delay={80}>
          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group border-border/60 bg-background hover:border-primary/30 hover:shadow-primary/5 flex gap-5 rounded-2xl border p-7 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <benefit.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{benefit.title}</h3>
                  <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Volunteer note */}
      <Reveal asChild>
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="flex gap-4 rounded-2xl border border-l-4 border-red-200 border-l-red-600 bg-red-50 p-6">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Important Note
              </p>
              <p className="text-foreground/80 mt-1.5 text-sm leading-relaxed">
                EmpowerHer does not provide a monthly salary for its staff
                members. All roles within this roadmap are volunteer-based.
                Participation as an Assistant or Mentor is completely free, and
                no monetary compensation is provided.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal asChild delay={80}>
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
      </Reveal>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function SprPage() {
  return (
    <>
      <Hero />
      <Eligibility />
      <StepByStep />
      <Benefits />
    </>
  );
}
