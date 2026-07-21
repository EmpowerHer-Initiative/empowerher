import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const HerVoiceHero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-24">
        {/* Left: large editorial title */}
        <Reveal asChild>
          <div>
            <p className="text-primary mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
              Publication Platform
            </p>
            <h1 className="font-serif text-5xl leading-[1.0] md:text-7xl lg:text-8xl">
              HerVoice
            </h1>
          </div>
        </Reveal>

        {/* Right: description + CTA */}
        <Reveal asChild delay={120}>
          <div className="lg:pb-4">
            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              HerVoice is EmpowerHer&apos;s creative storytelling and
              publication platform, where students can publish their original
              writings and express themselves freely. At EmpowerHer, we believe
              in the power of words to heal, connect, and drive change.
            </p>
            <blockquote className="border-primary/20 mt-8 border-l-2 pl-6 font-serif text-xl leading-relaxed italic">
              Many of our students have demonstrated remarkable resilience and
              courage through storytelling, using their voices to share personal
              truths and inspire others.
            </blockquote>
            <p className="text-muted-foreground mt-8 text-base leading-relaxed">
              HerVoice gives them the space to do just that&mdash;amplifying
              their experiences and perspectives in a world that too often
              silences them.
            </p>
            <div className="border-primary/20 bg-primary/[0.04] mt-8 rounded-2xl border p-6">
              <p className="text-muted-foreground/50 text-xs font-semibold tracking-[0.2em] uppercase">
                Global Partners
              </p>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                With the support of our partners&mdash;including the National
                Society of High School Scholars (Atlanta, Georgia), and Amplify
                Afghan Women (Melbourne, Australia)&mdash;we are proud to bring
                these stories to a global audience.
              </p>
            </div>
            <p className="mt-8 text-base leading-relaxed font-medium">
              Through HerVoice, every story becomes a step toward empowerment,
              visibility, and hope.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#writings"
                className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
              >
                Read Stories from HerVoice Here
                <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/writing-contest"
                className="group border-primary/40 text-foreground hover:border-primary hover:bg-primary/5 hover:shadow-primary/10 inline-flex items-center gap-2 rounded-full border px-6 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                2026 Writing Contest
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
