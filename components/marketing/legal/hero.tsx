import { Reveal } from "@/components/reveal";

export const Hero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-4xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Legal
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Terms <span className="text-primary italic">&amp;</span> Privacy
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
            How we operate, what we expect, and how we protect the information
            you share with the EmpowerHer Initiative.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);
