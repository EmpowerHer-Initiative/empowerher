import { Reveal } from "@/components/reveal";

export const AboutHero = () => (
  <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
    <img
      src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTrO039TyJ9E7UkRP3K1djBMpWoJuiOHs42atf"
      alt="About EmpowerHer"
      className="absolute inset-0 h-full w-full object-cover"
    />
    {/* Gradient overlay */}
    <div className="from-foreground/90 via-foreground/40 to-foreground/10 absolute inset-0 bg-gradient-to-t" />

    <div className="relative flex h-full flex-col justify-end pb-20 md:pb-28">
      <div className="container">
        <Reveal asChild>
          <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
            Our Story
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Born from lived experience.
            <br />
            Built for Afghan women.
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            A movement dedicated to equipping Afghan women with resilience,
            creativity, and leadership to shine as sources of inspiration — even
            in the face of adversity.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
