import type { FeaturedWriting } from "@/services/db/schema";

import { Pagination } from "@/components/pagination";
import { Reveal } from "@/components/reveal";

import { BASE_PATH } from "./_shared";
import { WritingCard } from "./writing-card";

export const PlatformSection = ({
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
