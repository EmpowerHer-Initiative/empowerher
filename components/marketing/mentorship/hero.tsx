import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const MentorshipHero = () => (
  <section className="relative overflow-hidden py-28 md:py-40">
    <img
      src="https://cdn.empowerher-initiative.org/mentorship-hero.jpeg"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
    <div className="relative container">
      <div className="mx-auto max-w-4xl">
        <Reveal asChild>
          <p className="mb-8 text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
            Core Program
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Mentorship
            <br />
            Program
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-20">
            <p className="text-lg leading-relaxed text-white/75">
              EmpowerHer&apos;s main program is the Mentorship Program, where
              students can apply to one of our workshops and receive free
              mentorship from our dedicated and highly trained mentors and
              lecturers.
            </p>
            <p className="text-lg leading-relaxed text-white/75">
              This program aims to provide Afghan girls with the resources,
              opportunities, and networks they need to launch their own impact
              projects.
            </p>
          </div>
        </Reveal>
        <Reveal asChild delay={240}>
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#workshops"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 active:scale-[0.98]"
            >
              Find Workshop Applications Here
              <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
