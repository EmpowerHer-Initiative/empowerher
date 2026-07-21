import Link from "next/link";

import { Reveal } from "@/components/reveal";

export const SessionFormat = () => (
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
