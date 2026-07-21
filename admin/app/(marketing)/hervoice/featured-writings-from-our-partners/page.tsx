import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { FeaturedWriting } from "@/services/db/schema";
import { caller } from "@/services/trpc/server";

import { PlatformSection } from "@/components/marketing/hervoice-featured-writings/platform-section";
import { Reveal } from "@/components/reveal";

const PER_PAGE = 4;

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
