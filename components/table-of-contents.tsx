"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Heading = {
  depth: number;
  text: string;
  id: string;
};

type Props = {
  headings: Heading[];
};

export const TableOfContents = ({ headings }: Props) => {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      // Offset accounts for the sticky header height
      const scrollY = window.scrollY + 120;

      const positions = headings.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.offsetTop }] : [];
      });

      // The active heading is the last one whose top is at or above the scroll position.
      // When multiple headings are visible, this always gives priority to the topmost one.
      const active = positions.filter(({ top }) => top <= scrollY).at(-1);

      if (active) setActiveId(active.id);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <div className="bg-muted shadow-card sticky flex shrink-0 flex-col gap-1 rounded-2xl p-8 md:top-18 md:w-64">
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        On this page
      </p>
      {headings.map((heading) => (
        <Link
          key={heading.id}
          href={`#${heading.id}`}
          style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
          className={cn(
            "text-muted-foreground hover:text-foreground py-0.5 text-sm transition-colors",
            activeId === heading.id && "text-foreground font-medium"
          )}
        >
          {heading.text}
        </Link>
      ))}
    </div>
  );
};
