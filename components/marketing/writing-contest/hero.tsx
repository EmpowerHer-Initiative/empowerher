import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Reveal } from "@/components/reveal";

import { FORM_URL } from "./_shared";

export const Hero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <Reveal asChild>
          <div className="max-w-xl">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              HerVoice · 2026
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
              Writing Contest
            </h1>
            <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
              HerVoice is EmpowerHer&apos;s creative storytelling platform where
              students share original writing and express themselves freely. We
              believe in the power of words to heal, connect, and inspire
              change.
            </p>
            <div className="border-primary/30 bg-primary/[0.05] border-l-primary mt-8 rounded-2xl border border-l-4 p-5">
              <p className="text-foreground text-sm leading-relaxed">
                HerVoice is directed by our CWS Mentor and Co-Founder,{" "}
                <span className="font-semibold">Nahid Karimi</span>.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Submit Your Entry
                <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/hervoice"
                className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Explore HerVoice
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal asChild delay={120}>
          <div className="border-border/30 overflow-hidden rounded-3xl border">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTUAlOSJMuHB63DFcWbZp7rAk9VUJPgitsO2Ca"
              alt="HerVoice 2026 Writing Contest"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
