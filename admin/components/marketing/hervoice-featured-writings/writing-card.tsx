import { ArrowUpRight } from "lucide-react";

import type { FeaturedWriting } from "@/services/db/schema";

import { Reveal } from "@/components/reveal";

export const WritingCard = ({
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
