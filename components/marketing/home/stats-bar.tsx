import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

import { CountUp } from "./count-up";

export const StatsBar = () => (
  <section className="border-border/40 bg-primary/[0.03] border-y py-20 md:py-28">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight md:text-5xl">
            Abandoned Futures: Let Afghan Girls Learn
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed md:text-lg">
            Since September 2021, all Afghan girls over the age of 12 have been
            banned from attending school.
          </p>
          <a
            href="https://www.unesco.org/en/articles/let-girls-and-women-afghanistan-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-primary text-primary-foreground hover:shadow-primary/25 mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
          >
            More Details
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>

      <div className="divide-border/40 mt-14 grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
          {
            to: 1.1,
            decimals: 1,
            suffix: " million",
            label: "Girls have lost access to formal education.",
          },
          {
            to: 2.5,
            decimals: 1,
            suffix: " million",
            label:
              "School-aged Afghan girls (80%) are currently out of school.",
          },
          {
            to: 30,
            decimals: 0,
            suffix: "%",
            label:
              "Nearly 30% of Afghan girls have never attended primary school.",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-2 px-2 py-8 md:px-8 md:py-2"
          >
            <span className="text-primary font-serif text-4xl md:text-5xl">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </span>
            <span className="text-muted-foreground max-w-xs text-sm leading-snug">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
