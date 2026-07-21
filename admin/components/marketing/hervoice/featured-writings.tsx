import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

import {
  WritingsPager,
  type WritingCard,
} from "@/app/(marketing)/hervoice/writings-pager";

const PER_PAGE = 6;

export const WritingsSkeleton = () => (
  <section
    id="writings"
    className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
  >
    <div className="container">
      <div className="mb-14">
        <Skeleton className="mb-4 h-3 w-32" />
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className="border-border/40 bg-background flex flex-col overflow-hidden rounded-2xl border"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-3 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-6 h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FeaturedWritings = ({ stories }: { stories: WritingCard[] }) => {
  return (
    <section
      id="writings"
      className="bg-foreground/[0.02] scroll-mt-20 py-28 md:py-40 lg:scroll-mt-24"
    >
      <div className="container">
        <Reveal asChild>
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
                Published Stories
              </p>
              <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
                Writings
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Editorial card grid — pagination handled client-side */}
        <WritingsPager stories={stories} />

        <Reveal asChild>
          <div className="mt-12 text-center">
            <Link
              href="/hervoice/featured-writings-from-our-partners"
              className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Featured Writings from Our Partners
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
