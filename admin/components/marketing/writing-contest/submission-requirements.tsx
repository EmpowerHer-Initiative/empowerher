import { AlertTriangle } from "lucide-react";

import { Reveal } from "@/components/reveal";

const submissionRules = [
  "Articles and biographies are not accepted. We value creativity and your ability to work with language to produce a meaningful and original piece of writing.",
  "All submissions must be original work written by the participant and not previously published elsewhere.",
  "Entries must be written in English.",
  "Each entry must have a title.",
  "Each participant may submit one entry only.",
  "Submissions must reflect the writer's own lived experience or personal perspective. Plagiarism or AI-generated content is strictly prohibited.",
  "Writing must align with the theme and purpose of the HerVoice Writing Contest.",
  "Submissions must be respectful and must not include hate speech, harassment, or harmful content.",
  "All entries must be submitted by the official deadline; late submissions will not be considered.",
];

export const SubmissionRequirements = () => (
  <section className="bg-foreground/[0.025] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Guidelines
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Submission Requirements
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Format options */}
          <Reveal asChild>
            <div className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm">
              <h3 className="font-serif text-2xl">Format Options</h3>
              <div className="mt-6 space-y-4">
                <div className="bg-muted/60 rounded-2xl p-6">
                  <p className="text-foreground text-lg font-semibold">
                    Stories
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Maximum 900 words (any type of writing; must be your
                    original work and not written by Generative AI).
                  </p>
                </div>
                <div className="bg-muted/60 rounded-2xl p-6">
                  <p className="text-foreground text-lg font-semibold">Poems</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Maximum 40 lines.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-l-4 border-red-200 border-l-red-600 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" />
                  <p className="text-sm leading-relaxed text-red-800">
                    Submissions that exceed the stated word or line limits will
                    not be accepted.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Important rules */}
          <Reveal asChild delay={80}>
            <div className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm">
              <h3 className="font-serif text-2xl">Important Rules</h3>
              <ul className="mt-6 space-y-4">
                {submissionRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-3">
                    <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                    <span className="text-foreground/80 text-sm leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
