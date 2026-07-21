import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const ReportCard = () => (
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
                  EmpowerHer is dedicated to equipping Afghan girls and women
                  with the tools, confidence, and opportunities to create
                  meaningful and lasting change.
                </p>
                <p>
                  Through creative arts, storytelling, education, leadership
                  development, and cultural exchange, the organization provides
                  supportive spaces where participants can express themselves,
                  preserve their lived experiences, and amplify their voices.
                </p>
                <p>
                  The initiative operates through two core programs: the{" "}
                  <Link
                    href="/mentorship"
                    className="text-foreground font-medium underline-offset-2 hover:underline"
                  >
                    Mentorship Program
                  </Link>
                  , a structured six-week cycle of workshops designed to develop
                  leadership skills, strengthen capacity, and support
                  participants in designing and advancing impact-driven
                  projects; and{" "}
                  <Link
                    href="/hervoice"
                    className="text-foreground font-medium underline-offset-2 hover:underline"
                  >
                    HerVoice
                  </Link>
                  , a storytelling platform that publishes and elevates the
                  voices and lived experiences of Afghan girls and women.
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
