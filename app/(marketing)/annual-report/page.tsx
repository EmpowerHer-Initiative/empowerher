import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.annualReport.title} — ${siteConfig.name}`,
  description: siteConfig.pages.annualReport.description,
};

/* ─── Header ─────────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Transparency &amp; Impact
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Annual Impact Reports
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            Each year we document the reach and outcomes of our programs — the
            girls we&apos;ve supported, the stories we&apos;ve amplified, and
            the communities we&apos;ve strengthened. These reports hold us
            accountable to our mission.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Report Card ─────────────────────────────────────────────────────────────── */

const ReportCard = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        {/* Year badge */}
        <Reveal asChild>
          <div className="mb-10 flex items-center gap-4">
            <div className="bg-border/30 h-px flex-1" />
            <span className="border-border/40 text-muted-foreground rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase">
              2024 – 2025
            </span>
            <div className="bg-border/30 h-px flex-1" />
          </div>
        </Reveal>

        <div className="">
          {/* Content */}
          <Reveal asChild delay={160}>
            <div className="pt-2">
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                Annual Report 2024–2025
              </h2>

              <div className="text-muted-foreground mt-8 space-y-4 text-base leading-relaxed">
                <p>
                  EmpowerHer is a youth-led initiative founded by Nahid Karimi
                  and Mahdi Rahimi in the United States, dedicated to equipping
                  Afghan girls and women with the tools, confidence, and
                  opportunities to create meaningful change.
                </p>
                <p>
                  Through creative arts, storytelling, education, leadership,
                  and cultural exchange, EmpowerHer provides safe spaces for
                  girls to express themselves, preserve their histories, and
                  amplify their voices.
                </p>
                <p>
                  EmpowerHer runs two key programs: the{" "}
                  <Link
                    href="/mentorship"
                    className="text-foreground font-medium underline-offset-2 hover:underline"
                  >
                    Mentorship Program
                  </Link>
                  , where students receive a month of free mentorship through
                  workshops to develop skills, leadership, and networks for
                  launching their own impact projects, and{" "}
                  <Link
                    href="/hervoice"
                    className="text-foreground font-medium underline-offset-2 hover:underline"
                  >
                    HerVoice
                  </Link>
                  , which gives girls a platform to share their stories and
                  experiences.
                </p>
              </div>

              <div className="border-border/30 mt-10 border-t pt-10">
                <a
                  href="/EmpowerHer 2025 Annual Impact Report-2.pdf"
                  download
                  className="group bg-foreground text-background inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-80 active:scale-[0.98]"
                >
                  <Download className="size-4" />
                  Download PDF
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Commitment ─────────────────────────────────────────────────────────────── */

const Commitment = () => (
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

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AnnualReportPage() {
  return (
    <>
      <Header />
      <ReportCard />
      <Commitment />
    </>
  );
}
