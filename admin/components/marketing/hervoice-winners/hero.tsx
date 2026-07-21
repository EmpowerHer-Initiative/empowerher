import Link from "next/link";

import { Arrow, Seal, Stat } from "@/components/hervoice/shared";

export const Hero = () => (
  <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_130%_at_12%_0%,#FFFFFF_0%,var(--hv-paper)_46%,var(--hv-paper2)_100%)]">
    <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_38%_36%,rgba(46,155,230,.16),transparent_62%)]" />
    <div className="pointer-events-none absolute -bottom-44 -left-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(224,174,60,.18),transparent_62%)]" />

    <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center md:py-28">
      <h1 className="hv-rise mt-5 font-[family-name:var(--hv-display)] text-[clamp(36px,5.5vw,72px)] leading-[0.92] font-bold tracking-[-0.03em] [animation-delay:80ms]">
        HerVoice <span className="text-[var(--hv-blue2)]">2026</span>
        <br />
        Writing Contest
      </h1>

      <p className="hv-rise mt-8 max-w-2xl text-lg leading-relaxed [text-wrap:pretty] text-[var(--hv-ink2)] [animation-delay:160ms]">
        HerVoice is EmpowerHer&apos;s creative publication platform, dedicated
        to amplifying and documenting the voices, stories, and ideas of Afghan
        girls through original writing. We believe in the power of storytelling
        to inspire, heal, connect communities, and create meaningful change.
      </p>

      <div className="hv-rise mt-10 flex items-center justify-center [animation-delay:240ms]">
        <Seal />
      </div>

      <div className="hv-rise mt-10 flex flex-wrap justify-center gap-8 [animation-delay:320ms]">
        <Stat n="300+" label="Submissions" />
        <Stat n="21+" label="Provinces across Afghanistan" gold />
        <Stat n="5" label="Cash Winners" />
        <Stat n="3" label="Honorees" gold />
      </div>

      <div className="hv-rise mt-10 [animation-delay:400ms]">
        <Link
          href="/writing-contest"
          className="group/btn inline-flex items-center gap-2.5 rounded-full bg-[var(--hv-blue2)] px-7 py-4 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(30,120,196,.7)] transition hover:-translate-y-0.5 hover:bg-[var(--hv-blue)] hover:shadow-[0_16px_30px_-12px_rgba(46,155,230,.75)]"
        >
          Read Contest Guidelines &amp; Details
          <Arrow className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);
