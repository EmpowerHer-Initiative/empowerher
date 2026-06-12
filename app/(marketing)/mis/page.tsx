import type { Metadata } from "next";
import { ExternalLink, Info } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Monthly Internet Scholarship (MIS) — ${siteConfig.name}`,
  description:
    "EmpowerHer provides monthly internet scholarships to help members participate in our programs.",
};

export default function MISPage() {
  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Financial Support
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] md:text-6xl">
            Monthly Internet Scholarship (MIS)
          </h1>

          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            EmpowerHer provides monthly internet scholarships to thirty-five
            members to help them participate in our programs. We understand the
            financial challenges girls face in Afghanistan and how difficult it
            can be to access reliable internet. That&apos;s why we&apos;re proud
            to offer this financial support.
          </p>

          <p className="text-muted-foreground mt-6 text-base leading-[1.8]">
            Please note: EmpowerHer does not send funds through
            &ldquo;Hawala&rdquo; or any platform that allows cash withdrawal.
            Instead, we provide internet credit through the Ding application,
            which lets students activate any internet bundles they need. Also,
            Ding and our system do not support Salam SIM cards, so please do not
            include Salam numbers in your MIS or workshop registration forms.
          </p>

          {/* Advisory callout */}
          <div className="border-primary/20 bg-primary/[0.04] mt-10 flex items-start gap-4 rounded-2xl border p-6">
            <Info className="text-primary mt-0.5 size-5 shrink-0" />
            <p className="text-foreground/80 text-base leading-relaxed">
              Please be advised that EmpowerHer provides MIS exclusively to
              students formally accepted into its programs. This support is not
              available to individuals outside EmpowerHer or to those currently
              attending virtual or in-person programs offered by other
              organizations.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="https://forms.gle/SwLAo5a5tNfn73rh6"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
            >
              MIS Application
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
