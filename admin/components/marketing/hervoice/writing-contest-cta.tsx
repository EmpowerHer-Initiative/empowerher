import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const WritingContestCTA = () => (
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
