import type { Metadata } from "next";
import { ExternalLink, Info } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.sso.title} — ${siteConfig.name}`,
  description: siteConfig.pages.sso.description,
};

export default function SSOPage() {
  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            EmpowerHer &times; Sahar Education
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] md:text-6xl">
            Sahar Education&apos;s Secret Scholars Online Platform (SS0)
          </h1>

          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            EmpowerHer is proud to partner with Sahar Education to provide
            students with a self-paced learning platform through which our
            members can independently study Math and English under the
            supervision of Sahar Education&apos;s team. Through this
            partnership, 60 EmpowerHer members will have access to fully
            virtual, self-paced classes designed to support their academic
            growth and personal development.
          </p>

          {/* Inline links */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-8">
            <a
              href="https://web.learningupgrade.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Learn more about the platform
              <ExternalLink className="size-4" />
            </a>
            <a
              href="https://www.sahareducation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Sahar Education
              <ExternalLink className="size-4" />
            </a>
          </div>

          {/* Info callout */}
          <div className="border-primary/20 bg-primary/[0.04] mt-10 flex items-start gap-4 rounded-2xl border p-6">
            <Info className="text-primary mt-0.5 size-5 shrink-0" />
            <p className="text-foreground/80 text-base leading-relaxed">
              Additional information will be provided upon acceptance of the
              students&apos; applications.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-4">
            <a
              href="https://forms.gle/sEmejUW1JmRFScJ27"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
            >
              Apply
              <ExternalLink className="size-4" />
            </a>
            <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
              Closed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
