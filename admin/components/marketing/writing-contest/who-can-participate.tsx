import { CheckCircle2 } from "lucide-react";

import { Reveal } from "@/components/reveal";

const whoCanParticipate = [
  "All Afghan girls and women regardless of any age can submit their writings. Men are not eligible.",
  "You can submit your writings if you live in Afghanistan ONLY. Submissions from other countries are not accepted.",
  "You must have an intermediate English level and be able to express your ideas and stories clearly without any help from AI (ChatGPT or any other platforms).",
  "You must have a valid ID, contact information, and be able to receive our cash prizes, if you are selected as a winner.",
];

export const WhoCanParticipate = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Eligibility
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Who Can Participate
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4">
          {whoCanParticipate.map((item, i) => (
            <Reveal asChild key={item} delay={i * 80}>
              <div className="border-border/60 bg-background flex items-start gap-4 rounded-2xl border p-6 shadow-sm">
                <CheckCircle2 className="text-primary mt-0.5 size-6 shrink-0" />
                <p className="text-foreground/80 text-base leading-relaxed">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
