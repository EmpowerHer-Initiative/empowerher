import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.sisterhoodSessions.title} — ${siteConfig.name}`,
  description: siteConfig.pages.sisterhoodSessions.description,
};

/* ─── Header ────────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Community &amp; Connection
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] md:text-6xl">
            Sisterhood Sessions
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            Sisterhood Sessions are designed to provide a supportive and caring
            space for all EmpowerHer students enrolled in the mentorship
            program. These sessions allow students to connect with one another,
            share their ideas, build friendships, and offer constructive
            feedback on EmpowerHer programs.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Why They Matter ───────────────────────────────────────────────────────── */

const WhyTheyMatter = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            The Purpose
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Why Sisterhood Sessions Matter
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            Sisterhood Sessions were created in response to the loss of hope
            many girls and women in Afghanistan are experiencing due to
            restrictions on education and opportunity. EmpowerHer aims to
            provide not only educational support but also a space where students
            feel encouraged, heard, and valued.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <blockquote className="border-border text-muted-foreground mt-14 border-l-2 pl-8 font-serif text-2xl leading-[1.4] md:text-3xl">
            During these sessions, EmpowerHer assistants support students with
            both personal challenges and workshop-related concerns. The
            conversations are designed to foster confidence, resilience, and
            hope as students continue advocating for their right to education
            and a better future.
          </blockquote>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── A Safe and Supportive Community ──────────────────────────────────────── */

const communityBenefits = [
  "Express their thoughts and experiences",
  "Discuss challenges they face in their daily lives",
  "Support and encourage one another",
  "Strengthen their sense of community",
];

const Community = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Belonging
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            A Safe and Supportive Community
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            The purpose of Sisterhood Sessions is to help students build
            long-lasting relationships and create a safe space where they can
            openly share their thoughts, experiences, and life stories. Many of
            our students rarely have environments where they feel truly heard,
            respected, and supported.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <p className="mt-10 text-base font-semibold">
            Through open conversations and peer connection, students can:
          </p>
        </Reveal>

        {/* Numbered list — large serif numbers */}
        <Reveal asChild delay={320}>
          <div className="divide-border/40 mt-6 divide-y">
            {communityBenefits.map((benefit, i) => (
              <div
                key={benefit}
                className="group hover:bg-muted/20 flex items-start gap-8 py-7 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:gap-12"
              >
                <span className="text-muted-foreground/25 group-hover:text-primary/25 font-serif text-4xl leading-none transition-colors duration-500 md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-muted-foreground pt-2 text-base leading-relaxed md:text-lg">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal asChild delay={0}>
          <p className="text-muted-foreground mt-10 text-lg leading-relaxed">
            These sessions help students develop stronger emotional well-being
            and a deeper sense of belonging within the EmpowerHer community.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Session Format ────────────────────────────────────────────────────────── */

const SessionFormat = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <Reveal asChild delay={0}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            The Details
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Session Format
          </h2>
        </Reveal>

        <Reveal asChild delay={160}>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="border-border/40 bg-background rounded-3xl border p-10">
              <h3 className="text-xl font-semibold">When They Take Place</h3>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                Sisterhood Sessions take place at the end of each workshop
                session on Saturdays and Sundays.
              </p>
            </div>
            <div className="border-border/40 bg-background rounded-3xl border p-10">
              <h3 className="text-xl font-semibold">Session Duration</h3>
              <p className="text-primary mt-4 font-serif text-5xl">30 min</p>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                Each Sisterhood Session lasts 30 minutes, providing dedicated
                time for connection and conversation.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal asChild delay={0}>
          <p className="text-muted-foreground mt-14 text-base leading-relaxed md:text-lg">
            These sessions ensure that every workshop not only focuses on
            learning and skill development but also prioritizes community,
            connection, and emotional support. By creating time for reflection
            and conversation, Sisterhood Sessions help students strengthen their
            relationships with one another and feel supported throughout their
            EmpowerHer journey.
          </p>
        </Reveal>

        <Reveal asChild delay={80}>
          <div className="mt-12">
            <Link
              href="/mentorship"
              className="border-border/60 text-foreground/70 hover:border-foreground/30 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Back to Mentorship Program
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function SisterhoodSessionsPage() {
  return (
    <>
      <Header />
      <WhyTheyMatter />
      <Community />
      <SessionFormat />
    </>
  );
}
