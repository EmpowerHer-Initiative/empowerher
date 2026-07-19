import Link from "next/link";
import { allHervoices } from "content-collections";

import { RIBBON_BG } from "@/components/hervoice/shared";
import { Reveal } from "@/components/reveal";

type Hervoice = (typeof allHervoices)[number];

type CashWinner = {
  rank: string;
  ribbon: keyof typeof RIBBON_BG;
  prize: string;
  slug: string;
  story?: Hervoice;
};

export const CashPrizeWinners = ({
  cashWinners,
}: {
  cashWinners: CashWinner[];
}) => (
  <section className="bg-white px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <Reveal asChild>
        <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
          Writings from Cash Prize Winners
        </h2>
      </Reveal>

      {/* Top 3 — larger cards */}
      <Reveal asChild>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cashWinners.slice(0, 3).map((w) => (
            <WinnerCard
              key={w.slug}
              rank={w.rank}
              ribbon={w.ribbon}
              prize={w.prize}
              title={w.story?.title || ""}
              author={w.story?.authorName || ""}
              image={w.story?.image || ""}
              slug={w.slug}
              large
            />
          ))}
        </div>
      </Reveal>

      {/* 4th & 5th — smaller cards */}
      <Reveal asChild delay={80}>
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {cashWinners.slice(3).map((w) => (
            <WinnerCard
              key={w.slug}
              rank={w.rank}
              ribbon={w.ribbon}
              prize={w.prize}
              title={w.story?.title || ""}
              author={w.story?.authorName || ""}
              image={w.story?.image || ""}
              slug={w.slug}
            />
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

function WinnerCard({
  rank,
  ribbon,
  prize,
  title,
  author,
  image,
  slug,
  large,
}: {
  rank: string;
  ribbon: keyof typeof RIBBON_BG;
  prize: string;
  title: string;
  author: string;
  image: string;
  slug: string;
  large?: boolean;
}) {
  return (
    <Link
      href={`/hervoice/${slug}`}
      className="group relative overflow-hidden rounded-2xl border border-[#ECE3D2] bg-white shadow-[0_12px_32px_-16px_rgba(26,34,48,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-18px_rgba(26,34,48,.45)]"
    >
      <div
        className={`relative overflow-hidden ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block rounded-md px-2.5 py-1 font-[family-name:var(--hv-display)] text-[11px] font-bold tracking-[0.1em] text-white ${RIBBON_BG[ribbon]}`}
          >
            {rank}
          </span>
          <span className="font-[family-name:var(--hv-display)] text-sm font-bold text-[var(--hv-gold2)]">
            {prize}
          </span>
        </div>
        <h3
          className={`mt-2 font-[family-name:var(--hv-display)] font-bold text-[var(--hv-ink)] ${large ? "text-xl" : "text-lg"}`}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-[var(--hv-ink3)]">by {author}</p>
      </div>
    </Link>
  );
}
