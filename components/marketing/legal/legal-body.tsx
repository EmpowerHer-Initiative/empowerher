import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

import { Article } from "./_shared";

export const LegalBody = () => (
  <div className="container pb-32">
    <div className="mx-auto max-w-5xl">
      <Reveal>
        <Article id="terms" eyebrow="Part One" title="Terms of Use">
          <p>
            {/* TODO: Replace with the drafted Terms of Use copy. */}
            Terms of Use content coming soon. This section will outline the
            rules and conditions for using the EmpowerHer website, programs, and
            services.
          </p>
        </Article>
      </Reveal>

      <Reveal>
        <Article id="privacy" eyebrow="Part Two" title="Privacy Policy">
          <p>
            {/* TODO: Replace with the drafted Privacy Policy copy. */}
            Privacy Policy content coming soon. This section will describe what
            information we collect, how we use it, and the choices you have over
            your data.
          </p>
        </Article>
      </Reveal>

      <div className="border-border/30 text-muted-foreground border-t pt-10 text-xs">
        Last updated: 2026. Questions? Email{" "}
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
);
