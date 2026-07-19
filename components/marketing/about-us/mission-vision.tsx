import { Reveal } from "@/components/reveal";

export const MissionVision = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        <Reveal asChild>
          <div className="group border-border/60 bg-muted/30 hover:border-primary/30 rounded-[2rem] border p-10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl md:p-14">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              What Drives Us
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
              Our Mission
            </h2>
            <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
              EmpowerHer focuses on equipping Afghan women to become beacons of
              hope in the darkest of times when the shadows of the Taliban seek
              to stifle the voices of Afghan women. By nurturing resilience,
              creativity, and leadership, we strive to empower them to shine as
              sources of inspiration and strength, uplifting their communities
              even in the face of adversity.
            </p>
          </div>
        </Reveal>

        <Reveal asChild delay={120}>
          <div className="group border-border/60 bg-muted text-foreground hover:border-primary/40 rounded-[2rem] border p-10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl md:p-14">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Where We&apos;re Headed
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
              Our Vision
            </h2>
            <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
              We envision Afghan women as guiding lights in their communities,
              inspiring hope and progress while leading the way to a more
              equitable, inclusive, and sustainable society.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
