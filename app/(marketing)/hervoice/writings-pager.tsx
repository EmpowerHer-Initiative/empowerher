"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const PER_PAGE = 6;

export type WritingCard = {
  slug: string;
  title: string;
  image: string | null;
  authorName: string | null;
};

export const WritingsPager = ({ stories }: { stories: WritingCard[] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(stories.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const paginated = stories.slice(start, start + PER_PAGE);

  return (
    <>
      <Reveal asChild delay={80}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((story, i) => (
            <Link
              key={story.slug}
              href={`/hervoice/${story.slug}`}
              className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                )}
                <span className="bg-background/90 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 font-serif text-xs backdrop-blur-sm">
                  {String(start + i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="group-hover:text-primary font-serif text-xl leading-snug transition-colors duration-300">
                  &ldquo;{story.title}&rdquo;
                </p>
                {story.authorName && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {story.authorName}
                  </p>
                )}
                <span className="text-muted-foreground/50 group-hover:text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium transition-colors duration-300">
                  Read story
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === currentPage ? "outline" : "ghost"}
              size="sm"
              className={cn(n === currentPage && "pointer-events-none")}
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      )}
    </>
  );
};
