import { Reveal } from "@/components/reveal";

export const WhyTheyMatter = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild delay={0}>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            The Purpose
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Why Sisterhood Sessions Matter
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            Sisterhood Sessions were created in response to the loss of hope
            many girls and women in Afghanistan are experiencing due to
            restrictions on education and opportunity. EmpowerHer aims to
            provide not only educational support but also a space where students
            feel encouraged, heard, and valued.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <blockquote className="border-border text-muted-foreground mt-14 border-l-2 pl-8 font-serif text-2xl leading-[1.4] md:text-3xl">
            During these sessions, EmpowerHer assistants support students with
            both personal challenges and workshop-related concerns. The
            conversations are designed to foster confidence, resilience, and
            hope as students continue advocating for their right to education
            and a better future.
          </blockquote>
        </Reveal>
      </div>
    </div>
  </section>
);
