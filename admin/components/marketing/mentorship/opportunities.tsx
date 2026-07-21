import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const Opportunities = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="mb-16">
          <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
            After Completion
          </p>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
            Opportunities After
            <br />
            Completing Programs
          </h2>
        </div>
      </Reveal>

      <Reveal asChild delay={160}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">01</p>
            <h3 className="mt-6 text-xl font-semibold">
              Leadership Opportunities
            </h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Graduates may be selected as assistant mentors and eventually lead
              their own workshops. EmpowerHer identifies a number of promising
              students and works closely with them to help launch their own
              initiatives.
            </p>
            <Link
              href="/success-stories/spr"
              className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              Student Project Roadmap (SPR)
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">02</p>
            <h3 className="mt-6 text-xl font-semibold">Publication Access</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Students may publish their work through HerVoice and our partner
              platforms.
            </p>
            <Link
              href="/hervoice"
              className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              Explore HerVoice
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="border-border bg-background hover:border-primary/30 rounded-2xl border p-10 shadow-sm transition-colors">
            <p className="text-primary/40 font-serif text-5xl">03</p>
            <h3 className="mt-6 text-xl font-semibold">Continued Engagement</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Ongoing involvement in projects, events, and the EmpowerHer
              community.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal asChild delay={240}>
        <p className="text-muted-foreground mt-10 text-sm leading-relaxed">
          Additional information will be shared during our virtual sessions by
          EmpowerHer mentors.
        </p>
      </Reveal>
    </div>
  </section>
);
