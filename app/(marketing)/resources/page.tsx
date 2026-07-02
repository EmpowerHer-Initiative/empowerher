import type { Metadata } from "next";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { Resource } from "@/services/db/schema";
import { caller } from "@/services/trpc/server";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

/* ─── Resource Card ──────────────────────────────────────────────────────────── */

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 flex flex-col gap-8 rounded-3xl border p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl lg:flex-row lg:p-10">
    {/* Content */}
    <div className="flex flex-1 flex-col items-start gap-4">
      <h3 className="font-serif text-2xl leading-tight md:text-3xl">
        {resource.name}
      </h3>

      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
        <MapPin className="size-4" />
        {resource.location}
      </span>

      <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
        {resource.description}
      </p>

      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group/btn bg-primary text-primary-foreground hover:shadow-primary/25 mt-auto inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
      >
        View
        <ExternalLink className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5" />
      </a>
    </div>

    {/* Logo */}
    {resource.image && (
      <div className="border-border/30 relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-6 lg:aspect-square lg:w-72">
        <img
          src={resource.image}
          alt={resource.name}
          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
      </div>
    )}
  </div>
);

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

/* ─── Resource List ──────────────────────────────────────────────────────────── */

const ResourceList = ({ resources }: { resources: Resource[] }) => (
  <section className="pb-28 md:pb-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <Reveal asChild>
          <p className="text-muted-foreground mb-8 text-sm">
            Number of Resources found:{" "}
            <span className="text-foreground font-semibold">
              {resources.length}
            </span>
          </p>
        </Reveal>
        <div className="space-y-6">
          {resources.map((resource) => (
            <Reveal key={resource.id}>
              <ResourceCard resource={resource} />
            </Reveal>
          ))}
        </div>
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
