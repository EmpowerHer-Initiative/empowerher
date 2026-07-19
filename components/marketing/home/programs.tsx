import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Users } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const Programs = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              What We Do
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl">
              Our Programs
            </h2>
          </div>
          <Link
            href="/mentorship"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            View all programs <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Reveal>

      <Reveal asChild delay={80}>
        <p className="text-muted-foreground mt-8 max-w-3xl text-base leading-[1.8]">
          Our projects are designed to meet Afghan girls where they are—and help
          them grow into who they&rsquo;re meant to be. Each initiative provides
          a safe, inclusive space where participants gain the tools, guidance,
          and community they need to rise. From leadership workshops to
          storytelling programs, every project builds confidence, sharpens
          skills, and encourages bold self-expression. Together, we&rsquo;re
          creating spaces where Afghan girls can learn, lead, and shape their
          own futures.
        </p>
      </Reveal>

      <Reveal asChild delay={160}>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* HerVoice — large card */}
          <Link href="/hervoice" className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] md:aspect-auto md:h-full">
              <img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTEK40ctbfRbjSv9fDHMpJXBriOWVtPmoQZNC3"
                alt="HerVoice"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-8">
                <div className="flex items-center gap-2 text-white/60">
                  <BookOpen className="size-4" />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase">
                    Storytelling Platform
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-3xl text-white md:text-4xl">
                  HerVoice
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/70">
                  A platform for Afghan girls to share their stories, amplify
                  their voices, and inspire change through creative expression.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all duration-500 group-hover:gap-2.5">
                  Explore <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Mentorship */}
          <Link href="/mentorship" className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] md:aspect-auto md:h-full md:min-h-[360px]">
              <img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTztHu6kOQlbZOApif7EkNI4MXGo08zhqH6CwY"
                alt="Mentorship"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6">
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="size-4" />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase">
                    Core Program
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl text-white">
                  Mentorship
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  EmpowerHer&apos;s core program offers Afghan girls free
                  workshops and mentorship to build resilience, gain support,
                  and launch impact projects.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all duration-500 group-hover:gap-2.5">
                  Explore <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
