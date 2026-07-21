import { Suspense } from "react";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { caller } from "@/services/trpc/server";

import { Skeleton } from "@/components/ui/skeleton";
import { Eligibility } from "@/components/marketing/mentorship/eligibility";
import { MentorshipHero } from "@/components/marketing/mentorship/hero";
import { MentorshipIntro } from "@/components/marketing/mentorship/intro";
import { Opportunities } from "@/components/marketing/mentorship/opportunities";
import { WorkshopStructure } from "@/components/marketing/mentorship/workshop-structure";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.mentorship.title} — ${siteConfig.name}`,
  description: siteConfig.pages.mentorship.description,
};

/* ─── Workshops ─────────────────────────────────────────────────────────────── */

const Workshops = async () => {
  const workshops = await caller.workshops.list();

  if (workshops.length === 0) return null;

  return (
    <section
      id="workshops"
      className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
    >
      <div className="container">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal asChild>
            <div>
              <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
                Apply Now
              </p>
              <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
                Available Workshops
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Alternating image-left / image-right layout */}
        <div className="space-y-6">
          {workshops.map((workshop, i) => (
            <Reveal asChild key={workshop.id}>
              <div
                className={`group border-border/40 bg-background hover:border-primary/20 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden md:aspect-auto md:w-2/5 md:shrink-0">
                  <img
                    src={workshop.image}
                    alt={workshop.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                </div>
                {/* Details */}
                <div className="flex flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
                  <div>
                    {workshop.mentors.length > 0 && (
                      <p className="text-primary mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
                        Mentor — {workshop.mentors.join(", ")}
                      </p>
                    )}
                    <h3 className="text-2xl leading-snug font-semibold md:text-3xl">
                      {workshop.name}
                    </h3>
                    <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                      {workshop.description}
                    </p>
                  </div>
                  <a
                    href={workshop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
                  >
                    Apply Here
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkshopsSkeleton = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="mb-16">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="h-10 w-80 md:h-12" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className={`border-border/40 flex flex-col overflow-hidden rounded-3xl border md:flex-row ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <Skeleton className="aspect-video rounded-none md:aspect-auto md:min-h-80 md:w-2/5 md:shrink-0" />
            <div className="flex flex-1 flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
              <div>
                <Skeleton className="mb-3 h-3 w-40" />
                <Skeleton className="h-8 w-2/3" />
                <div className="mt-4 space-y-2.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function MentorshipPage() {
  return (
    <>
      <MentorshipHero />
      <MentorshipIntro />
      <WorkshopStructure />
      <Eligibility />
      <Opportunities />
      <Suspense fallback={<WorkshopsSkeleton />}>
        <Workshops />
      </Suspense>
    </>
  );
}
