import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/reveal";

import { FORM_URL } from "./_shared";

export const HowToSubmit = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <Reveal asChild>
          <div className="border-primary/20 bg-primary/[0.04] rounded-3xl border p-10 text-center md:p-16">
            <ExternalLink className="text-primary mx-auto size-12" />
            <h2 className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
              How to Submit
            </h2>
            <p className="text-foreground/80 mt-5 text-lg font-medium">
              You must submit your written pieces by clicking on this form:
            </p>
            <div className="mt-8">
              <Link
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Submit Your Entry
                <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-400/50 bg-amber-50 p-5 text-left">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                We do not accept submissions through any of our email addresses.
                Please ONLY submit by clicking on the form above.
              </p>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              For any questions please email us at{" "}
              <a
                href="mailto:hervoice@empowerher-initiative.org"
                className="text-primary font-semibold underline underline-offset-4"
              >
                hervoice@empowerher-initiative.org
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
