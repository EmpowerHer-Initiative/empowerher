import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const Commitment = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Our Commitment
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Accountability is part of our mission.
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed">
            As a youth-led initiative operating on trust and community support,
            we believe radical transparency is not optional — it is essential.
            Our annual reports capture not just our wins but our learnings,
            ensuring every partner, donor, and supporter can see exactly how
            their investment in Afghan girls&apos; futures is being used.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/about-us"
              className="border-border text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              About EmpowerHer
            </Link>
            <Link
              href="/get-involved"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Get Involved
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
