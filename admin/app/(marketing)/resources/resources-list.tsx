"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Resource } from "@/services/db/schema";

import { Reveal } from "@/components/reveal";

const PAGE_SIZE = 10;

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

/* ─── Pagination ─────────────────────────────────────────────────────────────── */

// Builds a compact page list with ellipsis: 1 … 4 5 [6] 7 8 … 20
const buildPages = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= 1; i++) {
    if (current - i > 1) pages.add(current - i);
    if (current + i < total) pages.add(current + i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
};

const Pagination = ({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) => {
  if (total <= 1) return null;

  const pages = buildPages(current, total);

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-border/40 text-sm transition-colors hover:border-primary/30 disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className={arrow}
      >
        <ArrowUpRight className="size-4 -rotate-[135deg]" />
      </button>

      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`gap-${i}`}
            className="text-muted-foreground inline-flex size-11 items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === current ? "page" : undefined}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border text-sm font-medium transition-colors",
              page === current
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/40 hover:border-primary/30"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className={arrow}
      >
        <ArrowUpRight className="size-4 rotate-45" />
      </button>
    </nav>
  );
};

/* ─── Resource List ──────────────────────────────────────────────────────────── */

export const ResourceList = ({ resources }: { resources: Resource[] }) => {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLElement>(null);

  const total = resources.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changePage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={listRef} className="scroll-mt-24 pb-28 md:pb-40">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <Reveal asChild>
            <p className="text-muted-foreground mb-8 text-sm">
              Number of Resources found:{" "}
              <span className="text-foreground font-semibold">{total}</span>
            </p>
          </Reveal>
          {total === 0 ? (
            <Reveal asChild>
              <div className="border-border/40 rounded-3xl border border-dashed py-20 text-center">
                <p className="text-muted-foreground text-base">
                  No resources available yet.
                </p>
              </div>
            </Reveal>
          ) : (
            <>
              <div className="space-y-6">
                {paginated.map((resource) => (
                  <Reveal key={resource.id}>
                    <ResourceCard resource={resource} />
                  </Reveal>
                ))}
              </div>
              <Pagination
                current={page}
                total={totalPages}
                onChange={changePage}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
