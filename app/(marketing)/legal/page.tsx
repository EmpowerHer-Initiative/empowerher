import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `Terms & Privacy — ${siteConfig.name}`,
  description:
    "The terms of use and privacy policy for the EmpowerHer Initiative.",
};

/* ─── Section primitive ──────────────────────────────────────────────────────── */

const Article = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="border-border/30 scroll-mt-32 border-t py-16">
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="text-muted-foreground space-y-4 text-sm leading-[1.9] md:col-span-8">
        {children}
      </div>
    </div>
  </section>
);

export default function LegalPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-28 md:py-40">
        <div className="container">
          <Reveal asChild>
            <div className="max-w-4xl">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
                Legal
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
                Terms <span className="text-primary italic">&amp;</span> Privacy
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
                How we operate, what we expect, and how we protect the
                information you share with the EmpowerHer Initiative.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <div className="container pb-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Article id="terms" eyebrow="Part One" title="Terms of Use">
              <p>
                {/* TODO: Replace with the drafted Terms of Use copy. */}
                Terms of Use content coming soon. This section will outline the
                rules and conditions for using the EmpowerHer website, programs,
                and services.
              </p>
            </Article>
          </Reveal>

          <Reveal>
            <Article id="privacy" eyebrow="Part Two" title="Privacy Policy">
              <p>
                {/* TODO: Replace with the drafted Privacy Policy copy. */}
                Privacy Policy content coming soon. This section will describe
                what information we collect, how we use it, and the choices you
                have over your data.
              </p>
            </Article>
          </Reveal>

          <div className="border-border/30 text-muted-foreground border-t pt-10 text-xs">
            Last updated: {new Date().getFullYear()}. Questions? Email{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
            .
          </div>
        </div>
      </div>
    </main>
  );
}
