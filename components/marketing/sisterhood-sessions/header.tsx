import { Reveal } from "@/components/reveal";

export const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Community &amp; Connection
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] md:text-6xl">
            Sisterhood Sessions
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            Sisterhood Sessions are designed to provide a supportive and caring
            space for all EmpowerHer students enrolled in the mentorship
            program. These sessions allow students to connect with one another,
            share their ideas, build friendships, and offer constructive
            feedback on EmpowerHer programs.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
