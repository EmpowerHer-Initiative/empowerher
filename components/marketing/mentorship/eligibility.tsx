import Link from "next/link";

import { Reveal } from "@/components/reveal";

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

export const Eligibility = () => (
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
