import { Reveal } from "@/components/reveal";

export const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Transparency &amp; Impact
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Annual Impact Reports
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            Each year we document the reach and outcomes of our programs — the
            girls we&apos;ve supported, the stories we&apos;ve amplified, and
            the communities we&apos;ve strengthened. These reports hold us
            accountable to our mission.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
