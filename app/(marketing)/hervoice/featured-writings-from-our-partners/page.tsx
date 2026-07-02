import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { FeaturedWriting } from "@/services/db/schema";
import { caller } from "@/services/trpc/server";

import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/reveal";

const PER_PAGE = 4;
const BASE_PATH = "/hervoice/featured-writings-from-our-partners";

export const metadata: Metadata = {
  title: `Featured Writings from Our Partners — ${siteConfig.name}`,
  description:
    "Read featured writings from Afghan girls published through EmpowerHer's partner platforms — NSHSS and Amplify Afghan Women.",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ─── Writing Card ──────────────────────────────────────────────────────────── */

const WritingCard = ({
  writing,
  platform,
  index = 0,
}: {
  writing: FeaturedWriting;
  platform: string;
  index?: number;
}) => (
  <Reveal asChild delay={Math.min(index, 3) * 80}>
    <a
      href={writing.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-border/20 grid gap-5 border-b py-8 last:border-0 sm:grid-cols-[320px_1fr] sm:gap-8 lg:grid-cols-[400px_1fr]"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={writing.image}
          alt={writing.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="bg-primary/10 text-primary w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] uppercase">
          {platform}
        </span>
        <h3 className="group-hover:text-primary mt-2 text-base leading-snug font-semibold transition-colors duration-300">
          &ldquo;{writing.title}&rdquo;
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
          {writing.description}
        </p>
        <span className="text-primary mt-3 inline-flex items-center gap-1.5 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100">
          Read more
          <ArrowUpRight className="size-3" />
        </span>
      </div>
    </a>
  </Reveal>
);

/* ─── Platform Section ───────────────────────────────────────────────────────── */

const PlatformSection = ({
  id,
  platform,
  writingsList,
  currentPage,
  totalPages,
  query,
}: {
  id: string;
  platform: string;
  writingsList: FeaturedWriting[];
  currentPage: number;
  totalPages: number;
  query: Record<string, string | undefined>;
}) => (
  <div id={id} className="scroll-mt-24">
    <Reveal asChild>
      <div className="mb-6 flex items-center gap-4">
        <span className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
          {platform}
        </span>
        <div className="bg-border/30 h-px flex-1" />
      </div>
    </Reveal>
    <div>
      {writingsList.map((writing, i) => (
        <WritingCard
          key={writing.id}
          writing={writing}
          platform={platform}
          index={i}
        />
      ))}
    </div>
    {totalPages > 1 && (
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={BASE_PATH}
          paramName={id}
          query={query}
          hash={`#${id}`}
        />
      </div>
    )}
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────────── */

const paginate = (list: FeaturedWriting[], page: number) => {
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const items = list.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );
  return { items, currentPage, totalPages };
};

export default async function FeaturedWritingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const writings = await caller.featuredWritings.list();

  // Group by the same `from`.
  const grouped = writings.reduce<Record<string, FeaturedWriting[]>>(
    (acc, writing) => {
      (acc[writing.from] ??= []).push(writing);
      return acc;
    },
    {}
  );

  const groups = Object.entries(grouped).map(([platform, list]) => {
    const id = slugify(platform);
    const { items, currentPage, totalPages } = paginate(
      list,
      Number(params[id]) || 1
    );
    return { id, platform, items, currentPage, totalPages };
  });

  return (
    <>
      {/* Header */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="max-w-4xl">
            <Reveal>
              <Link
                href="/hervoice"
                className="group text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                Back to HerVoice
              </Link>
            </Reveal>

            <Reveal asChild delay={80}>
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
                Published Stories
              </p>
            </Reveal>
            <Reveal asChild delay={160}>
              <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
                Featured Writings from Our Partners
              </h1>
            </Reveal>
            <Reveal asChild delay={240}>
              <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
                Afghan girls and women sharing their stories, experiences, and
                perspectives with the world through our network of publication
                partners.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-24">
            {groups.length === 0 ? (
              <Reveal asChild>
                <p className="text-muted-foreground py-16 text-center text-base">
                  No featured writings yet.
                </p>
              </Reveal>
            ) : (
              groups.map(({ id, platform, items, currentPage, totalPages }) => (
                <PlatformSection
                  key={id}
                  id={id}
                  platform={platform}
                  writingsList={items}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  query={Object.fromEntries(
                    groups
                      .filter((other) => other.id !== id)
                      .map((other) => [other.id, params[other.id]])
                  )}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
