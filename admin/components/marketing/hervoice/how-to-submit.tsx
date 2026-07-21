import { Reveal } from "@/components/reveal";

export const HowToSubmit = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — editorial heading */}
        <Reveal asChild>
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Submission Guide
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
              How to Submit
              <br />
              <span className="text-primary italic">Your Story</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
              Every submission is a step toward being heard. Follow these four
              steps to share your voice with the world through HerVoice.
            </p>

            {/* Guidelines — border-left style like co-founder quotes */}
            <div className="mt-12 space-y-5">
              <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
                Important Guidelines
              </p>
              {[
                [
                  "Content Quality",
                  "Write from the heart with honest reflection on your personal journey.",
                ],
                [
                  "Image Required",
                  "Include a relevant image that connects to your story.",
                ],
                [
                  "No Hate Speech",
                  "Submissions with inappropriate content will not be published.",
                ],
                [
                  "Review Process",
                  "All submissions will be reviewed by the EmpowerHer team.",
                ],
              ].map(([label, text]) => (
                <div
                  key={label}
                  className="group border-primary/30 hover:border-primary hover:bg-primary/[0.04] rounded-r-lg border-l-2 py-1.5 pl-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:translate-x-1"
                >
                  <p className="text-foreground group-hover:text-primary text-lg font-semibold transition-colors duration-500">
                    {label}
                  </p>
                  <p className="text-muted-foreground mt-1 text-base leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — numbered steps in a vertical list */}
        <Reveal asChild delay={120}>
          <div className="divide-border space-y-0 divide-y">
            {[
              {
                num: "01",
                title: "Write Your Story",
                desc: "Write from the heart, reflecting honestly on your personal journey, challenges, and experiences.",
              },
              {
                num: "02",
                title: "Review & Edit",
                desc: "Carefully review your piece for grammar, spelling, and clarity. Rough drafts may be rejected.",
              },
              {
                num: "03",
                title: "Prepare Materials",
                desc: "Include your story and a relevant image (REQUIRED). Insert the image or share a link.",
              },
              {
                num: "04",
                title: "Submit",
                desc: 'Email to hervoice@empowerher-initiative.org. Subject: "Submission to HerVoice".',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-6 py-8 first:pt-0 last:pb-0"
              >
                <span className="text-primary font-serif text-5xl md:text-6xl">
                  {step.num}
                </span>
                <div className="pt-1">
                  <h3 className="text-foreground text-lg font-semibold md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
