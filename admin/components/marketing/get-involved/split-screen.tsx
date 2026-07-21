import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const SplitScreen = () => (
  <section className="flex min-h-screen flex-col lg:flex-row">
    {/* Partner — left half */}
    <div className="group relative flex min-h-[60vh] flex-1 flex-col justify-end overflow-hidden lg:min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT3hSLjjKpPsIbjXnuoAM3O2JygVY8KzGFtD6k"
          alt="Partner with EmpowerHer"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      {/* Content */}
      <Reveal asChild>
        <div className="relative px-10 pt-32 pb-16 md:px-14 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
            Organizations &amp; Companies
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-white md:text-5xl">
            Partner With Us
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            EmpowerHer would love to partner with organizations that share its
            values. Please leave us a message by clicking the arrow below.
          </p>
          <Link
            href="/get-involved/partner-with-us"
            className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]"
          >
            Become a Partner
            <span className="flex size-6 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </Reveal>
    </div>

    {/* Divider line on desktop */}
    <div className="hidden w-px bg-white/10 lg:block" />

    {/* Volunteer — right half */}
    <div className="group relative flex min-h-[60vh] flex-1 flex-col justify-end overflow-hidden lg:min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDe1RCWh0fiZ3z8JjCWsbc2laUL6tAeqPnMNS"
          alt="Volunteer with EmpowerHer"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      {/* Content */}
      <Reveal asChild delay={120}>
        <div className="relative px-10 pt-32 pb-16 md:px-14 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
            Open to All
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-white md:text-5xl">
            Volunteer With Us
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            EmpowerHer accepts volunteers for different roles within our
            programs. To express your interest, please click the arrow below and
            send us a message.
          </p>
          <Link
            href="/get-involved/volunteer-with-us"
            className="group/btn mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]"
          >
            Start Volunteering
            <span className="flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
