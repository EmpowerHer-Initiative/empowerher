import { Reveal } from "@/components/reveal";

export const MentorshipIntro = () => (
  <section className="pt-28 md:pt-40">
    <div className="container">
      <div className="mx-auto max-w-3xl space-y-10">
        <Reveal asChild>
          <blockquote className="border-primary/20 border-l-2 pl-8 font-serif text-2xl leading-relaxed italic md:text-3xl">
            Through this platform, EmpowerHer encourages students to think
            outside the box and view their challenges as sources of
            resilience&mdash;life lessons that empower them to pursue their
            goals and dreams.
          </blockquote>
        </Reveal>
        <Reveal asChild delay={80}>
          <p className="text-muted-foreground leading-[1.8]">
            EmpowerHer creates a safe, supportive space where students can
            discuss their struggles openly, feel heard and seen, and reflect on
            their experiences.
          </p>
        </Reveal>
        <Reveal asChild delay={160}>
          <div className="border-primary/20 bg-primary/[0.04] rounded-2xl border p-8">
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              Our Impact
            </p>
            <p className="text-muted-foreground leading-[1.8]">
              Whether through launching a project, mentoring a sibling or
              friend, or simply taking a first step, EmpowerHer helps students
              grow&mdash;one story, one action, and one empowered voice at a
              time.
            </p>
          </div>
        </Reveal>
        <Reveal asChild delay={240}>
          <p className="leading-[1.8] font-medium">
            Join us in empowering the next generation of Afghan leaders and
            changemakers through our comprehensive mentorship program.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
