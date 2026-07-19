import { Reveal } from "@/components/reveal";

const communityBenefits = [
  "Express their thoughts and experiences",
  "Discuss challenges they face in their daily lives",
  "Support and encourage one another",
  "Strengthen their sense of community",
];

export const Community = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Belonging
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            A Safe and Supportive Community
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            The purpose of Sisterhood Sessions is to help students build
            long-lasting relationships and create a safe space where they can
            openly share their thoughts, experiences, and life stories. Many of
            our students rarely have environments where they feel truly heard,
            respected, and supported.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <p className="mt-10 text-base font-semibold">
            Through open conversations and peer connection, students can:
          </p>
        </Reveal>

        {/* Numbered list — large serif numbers */}
        <Reveal asChild delay={320}>
          <div className="divide-border/40 mt-6 divide-y">
            {communityBenefits.map((benefit, i) => (
              <div
                key={benefit}
                className="group hover:bg-muted/20 flex items-start gap-8 py-7 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:gap-12"
              >
                <span className="text-muted-foreground/25 group-hover:text-primary/25 font-serif text-4xl leading-none transition-colors duration-500 md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-muted-foreground pt-2 text-base leading-relaxed md:text-lg">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal asChild delay={0}>
          <p className="text-muted-foreground mt-10 text-lg leading-relaxed">
            These sessions help students develop stronger emotional well-being
            and a deeper sense of belonging within the EmpowerHer community.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
