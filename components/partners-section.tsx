import type { Partner } from "@/services/db/schema";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

// Minimal shape so both server (Date) and client-serialized (string) rows fit
type PartnerItem = Pick<Partner, "id" | "name" | "image" | "link">;

export const PartnersSection = ({ partners }: { partners: PartnerItem[] }) => {
  if (partners.length === 0) return null;

  return (
    <section className="py-28 md:py-32">
      <div className="container">
        <Reveal asChild>
          <p className="text-muted-foreground text-center text-xs font-semibold tracking-[0.3em] uppercase">
            Trusted Partners & Supporters
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className="group block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:scale-105"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-16 w-auto object-contain md:h-24"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export const PartnersSkeleton = () => (
  <section className="py-28 md:py-32">
    <div className="container">
      <Skeleton className="mx-auto h-3 w-64" />
      <div className="mt-12 flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-32 md:h-24 md:w-40" />
        ))}
      </div>
    </div>
  </section>
);
