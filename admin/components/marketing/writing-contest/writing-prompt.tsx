import { Lightbulb } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const WritingPrompt = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="mx-auto max-w-4xl text-center">
          <Lightbulb className="text-primary mx-auto size-12" />
          <p className="text-primary mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
            Writing Prompt / Theme
          </p>
          <div className="border-primary/20 bg-background mt-8 rounded-3xl border p-10 shadow-sm md:p-16">
            <p className="font-serif text-3xl leading-snug md:text-4xl lg:text-5xl">
              &ldquo;A time when you felt strength in being a woman/girl&rdquo;
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
