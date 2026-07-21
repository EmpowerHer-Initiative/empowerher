import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const AboutCTA = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <Reveal asChild>
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
        </Reveal>
        <Reveal asChild delay={120}>
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
        </Reveal>
      </div>
    </div>
  </section>
);
