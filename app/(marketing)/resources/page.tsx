import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Resource } from "@/services/db/schema";
import { caller } from "@/services/trpc/server";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

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

const Pagination = ({ current, total }: { current: number; total: number }) => {
  if (total <= 1) return null;

  const href = (page: number) => (page === 1 ? "?" : `?page=${page}`);
  const pages = buildPages(current, total);

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-border/40 text-sm transition-colors hover:border-primary/30 aria-disabled:pointer-events-none aria-disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <Link
        href={href(current - 1)}
        aria-disabled={current === 1}
        className={arrow}
      >
        <ArrowUpRight className="size-4 -rotate-[135deg]" />
      </Link>

      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`gap-${i}`}
            className="text-muted-foreground inline-flex size-11 items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page === current ? "page" : undefined}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border text-sm font-medium transition-colors",
              page === current
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/40 hover:border-primary/30"
            )}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={href(current + 1)}
        aria-disabled={current === total}
        className={arrow}
      >
        <ArrowUpRight className="size-4 rotate-45" />
      </Link>
    </nav>
  );
};

const ResourceList = ({
  resources,
  total,
  page,
  totalPages,
}: {
  resources: Resource[];
  total: number;
  page: number;
  totalPages: number;
}) => (
  <section className="pb-28 md:pb-40">
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
              {resources.map((resource) => (
                <Reveal key={resource.id}>
                  <ResourceCard resource={resource} />
                </Reveal>
              ))}
            </div>
            <Pagination current={page} total={totalPages} />
          </>
        )}
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

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resources = await caller.resources.list();
  const { page: pageParam } = await searchParams;

  const total = resources.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);

  const paginated = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Header />
      <ResourceList
        resources={paginated}
        total={total}
        page={page}
        totalPages={totalPages}
      />
      <FooterNote />
    </>
  );
}
