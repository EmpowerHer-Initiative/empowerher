import Link from "next/link";
import { allHervoices } from "content-collections";

import { Reveal } from "@/components/reveal";

type Hervoice = (typeof allHervoices)[number];

export const HonorableMentions = ({
  honorables,
}: {
  honorables: (Hervoice | undefined)[];
}) => (
  <section className="bg-[var(--hv-paper)] px-6 py-16 md:py-24">
    <div className="mx-auto max-w-5xl">
      <Reveal asChild>
        <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
          Writings from Honorable Mention Winners
        </h2>
      </Reveal>

      <Reveal asChild>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {honorables.map(
            (story) =>
              story && (
                <Link
                  key={story._meta.path}
                  href={`/hervoice/${story._meta.path}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#ECE3D2] bg-white shadow-[0_12px_32px_-16px_rgba(26,34,48,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-18px_rgba(26,34,48,.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--hv-display)] text-lg font-bold text-[var(--hv-ink)]">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--hv-ink3)]">
                      by {story.authorName}
                    </p>
                  </div>
                </Link>
              )
          )}
        </div>
      </Reveal>
    </div>
  </section>
);
