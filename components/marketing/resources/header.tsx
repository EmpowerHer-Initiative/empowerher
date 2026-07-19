import { Reveal } from "@/components/reveal";

export const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Education &amp; Opportunities
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Resources
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            A curated collection of educational programs, scholarships, and
            opportunities for Afghan girls and women — vetted by our team and
            organized to help you find the right path forward.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
