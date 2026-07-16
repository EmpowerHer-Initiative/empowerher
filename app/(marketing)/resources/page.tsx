import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { caller } from "@/services/trpc/server";

import { Reveal } from "@/components/reveal";

import { ResourceList } from "./resources-list";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

/* ─── Page Header ────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Education &amp; Opportunities
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Resources
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            A curated collection of educational programs, scholarships, and
            opportunities for Afghan girls and women — vetted by our team and
            organized to help you find the right path forward.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Footer Note ────────────────────────────────────────────────────────────── */

const FooterNote = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Know a resource?
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Help us grow this list.
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
            If you know of an educational resource, scholarship, or program that
            supports Afghan girls and women, we&apos;d love to hear about it.
            Reach out and help us connect more girls with the opportunities they
            deserve.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-foreground mt-8 inline-flex items-center gap-2 text-sm font-medium hover:opacity-70"
          >
            {siteConfig.email}
            <ArrowUpRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default async function ResourcesPage() {
  const resources = await caller.resources.list();

  return (
    <>
      <Header />
      <ResourceList resources={resources} />
      <FooterNote />
    </>
  );
}
