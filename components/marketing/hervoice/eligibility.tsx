import Link from "next/link";

import { Reveal } from "@/components/reveal";

export const Eligibility = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        {/* Left — heading + who can submit */}
        <Reveal asChild>
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Requirements
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
              Eligibility
            </h2>
            <p className="text-foreground/70 mt-6 text-base leading-[1.8]">
              HerVoice is open exclusively to students who have been accepted
              into EmpowerHer&apos;s Mentorship Program.
            </p>

            {/* Priority callout — editorial blockquote style */}
            <div className="border-primary/30 border-l-primary bg-primary/[0.05] mt-10 rounded-2xl border border-l-4 p-6">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                Priority Given To
              </p>
              <p className="text-foreground mt-2 text-base">
                Students from EmpowerHer&apos;s{" "}
                <Link
                  href="/mentorship"
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                >
                  Creative Writing and Storytelling Workshop
                </Link>
              </p>
              <p className="text-muted-foreground mt-3 text-sm">
                However, submissions are welcome from all currently enrolled
                participants.
              </p>
            </div>

            {/* Workshop + Submission — minimal divider list */}
            <div className="divide-border/40 mt-12 space-y-0 divide-y">
              <div className="pb-6">
                <h3 className="text-sm font-semibold">Workshop Enrollment</h3>
                <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                  If you are attending{" "}
                  <span className="text-foreground font-medium">any</span>{" "}
                  EmpowerHer workshop, you are eligible to submit your writing.
                </p>
              </div>
              <div className="pt-6">
                <h3 className="text-sm font-semibold">Submission Process</h3>
                <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                  Email your submission to{" "}
                  <a
                    href="mailto:hervoice@empowerher-initiative.org"
                    className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                  >
                    hervoice@empowerher-initiative.org
                  </a>{" "}
                  and include the{" "}
                  <span className="text-foreground font-medium">
                    name of the workshop
                  </span>{" "}
                  you are attending.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right — content requirements as large stat-style cards */}
        <Reveal asChild delay={120}>
          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Content Requirements
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-border/60 bg-muted/60 hover:border-primary/30 overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg">
                <p className="text-primary font-serif text-4xl md:text-5xl">
                  900–1000
                </p>
                <p className="mt-3 text-sm font-semibold">Word Count</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  12-point font, single-spaced
                </p>
              </div>
              <div className="border-border/60 bg-muted/60 hover:border-primary/30 overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-lg">
                <p className="text-primary font-serif text-4xl md:text-5xl">
                  40
                </p>
                <p className="mt-3 text-sm font-semibold">Max Poetry Lines</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Poems should not exceed this limit
                </p>
              </div>
            </div>

            {/* Warning — red notice */}
            <div className="mt-6 rounded-xl border border-l-4 border-red-200 border-l-red-600 bg-red-50 py-4 pr-5 pl-5">
              <p className="text-foreground/80 text-sm">
                Due to a high volume of submissions, we{" "}
                <span className="font-semibold text-red-700">
                  cannot accept pieces that exceed the word limit
                </span>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
