import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.getInvolved.title} — ${siteConfig.name}`,
  description: siteConfig.pages.getInvolved.description,
};

/* ─── Split Screen ──────────────────────────────────────────────────────────── */

const SplitScreen = () => (
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
      <div className="relative px-10 pt-32 pb-16 md:px-14 md:pb-20 lg:px-16 lg:pb-24">
        <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
          Organizations &amp; Companies
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-white md:text-5xl">
          Partner With Us
        </h2>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
          EmpowerHer would love to partner with organizations that share its
          values. Aligned companies and nonprofits are encouraged to reach out —
          a member of our team will be in touch to explore opportunities.
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
      <div className="relative px-10 pt-32 pb-16 md:px-14 md:pb-20 lg:px-16 lg:pb-24">
        <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
          Open to All
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-white md:text-5xl">
          Volunteer With Us
        </h2>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
          EmpowerHer welcomes volunteers from around the world. Serve as a
          lecturer, mentor, assistant, or administrative member and bring your
          perspective across borders to empower Afghan girls.
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
    </div>
  </section>
);

/* ─── Why It Matters ─────────────────────────────────────────────────────────── */

const WhyItMatters = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Why It Matters
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Your support reaches girls who have no other path
          </h2>
        </div>
        <div className="text-muted-foreground space-y-6">
          <p className="text-base leading-relaxed">
            Since September 2021, Afghan girls over the age of 12 have been
            banned from attending school. EmpowerHer exists to bridge that gap —
            through mentorship, workshops, and publication platforms — giving
            girls the tools to learn, grow, and lead when the world has closed
            its doors on them.
          </p>
          <p className="text-base leading-relaxed">
            Whether you bring organizational resources or personal expertise,
            your contribution directly shapes the lives of girls navigating some
            of the harshest conditions on earth.
          </p>
          <div className="border-border grid grid-cols-3 gap-8 border-t pt-8">
            {[
              { value: "1.1M", label: "Girls lost access to education" },
              { value: "2.5M", label: "School-aged girls out of school" },
              { value: "30%", label: "Never attended primary school" },
            ].map((stat) => (
              <div key={stat.value}>
                <p className="font-serif text-4xl leading-none">{stat.value}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function GetInvolvedPage() {
  return (
    <>
      <SplitScreen />
      <WhyItMatters />
    </>
  );
}
