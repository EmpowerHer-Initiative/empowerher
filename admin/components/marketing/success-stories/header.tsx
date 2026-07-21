import { Reveal } from "@/components/reveal";

export const Header = () => (
  <section className="pt-28 pb-12 md:pt-40 md:pb-16">
    <div className="container">
      <Reveal asChild>
        <div className="flex items-center justify-center gap-6">
          <span className="via-border h-px max-w-[120px] flex-1 bg-gradient-to-r from-transparent to-transparent" />
          <h1 className="text-center font-serif text-4xl md:text-6xl">
            Success Stories
          </h1>
          <span className="via-border h-px max-w-[120px] flex-1 bg-gradient-to-r from-transparent to-transparent" />
        </div>
      </Reveal>
      <Reveal asChild delay={80}>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-center text-base leading-relaxed">
          Each program created meaningful change in the lives of participating
          girls. These are their stories.
        </p>
      </Reveal>
    </div>
  </section>
);
