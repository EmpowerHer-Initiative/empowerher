import { Reveal } from "@/components/reveal";

import { CountUp } from "./count-up";

export const AtAGlance = () => (
  <section className="border-border/40 bg-primary/[0.03] border-y py-20 md:py-28">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            By the Numbers
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
            EmpowerHer at a Glance
          </h2>
        </div>
      </Reveal>

      <div className="divide-border/40 mt-14 grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x lg:grid-cols-5 lg:divide-y-0">
        {[
          {
            to: 500,
            suffix: "+",
            label: "Students Mentored",
          },
          {
            to: 9,
            suffix: "+",
            label: "Countries Reached",
            detail:
              "Afghanistan, Tajikistan, Kazakhstan, Pakistan, Iran, Turkey, India, Bangladesh, Malaysia",
          },
          {
            to: 8,
            suffix: "+",
            label: "Countries in Our Global Team",
            detail:
              "Afghanistan, Poland, Peru, United States, China, Pakistan, Iran, Bangladesh",
          },
          {
            to: 25,
            suffix: "+",
            label: "Provinces of Afghanistan Reached",
          },
          {
            to: 50,
            suffix: "+",
            label: "Student Publications",
            detail: "Published through HerVoice",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-2 px-2 py-8 sm:px-8 sm:py-2"
          >
            <span className="text-primary font-serif text-4xl md:text-5xl">
              <CountUp to={s.to} decimals={0} suffix={s.suffix} />
            </span>
            <span className="text-foreground text-sm font-medium">
              {s.label}
            </span>
            {s.detail && (
              <span className="text-muted-foreground text-xs leading-relaxed">
                {s.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
