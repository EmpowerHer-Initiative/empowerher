import { Award, DollarSign, Globe, Star, Trophy } from "lucide-react";

import { Reveal } from "@/components/reveal";

const prizes = [
  { place: "1st Place", amount: "400", accent: "text-amber-600 bg-amber-100" },
  { place: "2nd Place", amount: "300", accent: "text-slate-600 bg-slate-100" },
  {
    place: "3rd Place",
    amount: "200",
    accent: "text-orange-600 bg-orange-100",
  },
  {
    place: "4th Place",
    amount: "150",
    accent: "text-emerald-600 bg-emerald-100",
  },
  { place: "5th Place", amount: "50", accent: "text-violet-600 bg-violet-100" },
];

const recognitionBenefits = [
  {
    icon: Globe,
    title: "Publication on HerVoice Platform",
    description:
      "All 5 cash prize winners and 3 honorable mentions will have their stories published on the HerVoice platform, sharing their voices with the wider EmpowerHer community.",
  },
  {
    icon: Star,
    title: "Featured on NSHSS Website",
    description:
      "Stories from the 1st, 2nd, and 3rd place winners will also be featured on our partner organization's website, The National Society of High School Scholars (NSHSS), reaching audiences in over 170 countries.",
  },
  {
    icon: Award,
    title: "Priority for Future Opportunities",
    description:
      "Cash prize winners and honorable mentions will be prioritized for future EmpowerHer workshops and opportunities to use our Student Project Roadmap to create their own impact projects. (Acceptance to workshops is not guaranteed, but their applications will receive priority consideration.)",
  },
  {
    icon: DollarSign,
    title: "Cash Prizes",
    description:
      "Winners will receive cash prizes ranging from $50 to $400 USD to support their educational and personal development goals.",
  },
];

export const Awards = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Recognition
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Awards &amp; Recognition
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
            We carefully review all submissions with full consideration of each
            participant&apos;s circumstances. From this contest, we will select{" "}
            <span className="text-foreground font-semibold">5 winners</span> and{" "}
            <span className="text-foreground font-semibold">
              3 honorable mentions
            </span>
            .
          </p>
        </Reveal>

        {/* Prizes */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {prizes.map((prize, i) => (
            <Reveal
              asChild
              key={prize.place}
              delay={i * 80}
              className={`lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""}`}
            >
              <div className="border-border/60 bg-background flex flex-col items-center rounded-3xl border p-8 text-center shadow-sm">
                <div
                  className={`flex size-20 items-center justify-center rounded-full ${prize.accent}`}
                >
                  <Trophy className="size-9" />
                </div>
                <h3 className="mt-5 font-serif text-2xl">{prize.place}</h3>
                <p className="text-primary mt-2 font-serif text-5xl">
                  ${prize.amount}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">US Dollars</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Recognition benefits */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {recognitionBenefits.map((b, i) => (
            <Reveal asChild key={b.title} delay={i * 80}>
              <div className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <b.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                </div>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  {b.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
