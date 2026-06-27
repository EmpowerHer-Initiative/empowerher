import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  hash?: string;
  /** Query param this pagination drives (default "page"). */
  paramName?: string;
  /** Other query params to preserve in generated links. */
  query?: Record<string, string | undefined>;
};

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
};

export const Pagination = ({
  currentPage,
  totalPages,
  basePath,
  hash,
  paramName = "page",
  query = {},
}: Props) => {
  const pages = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const href = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (page <= 1) params.delete(paramName);
    else params.set(paramName, String(page));
    const qs = params.toString();
    return basePath + (qs ? `?${qs}` : "") + (hash ?? "");
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={!hasPrev}
        render={hasPrev ? <Link href={href(currentPage - 1)} /> : undefined}
      >
        <ChevronLeftIcon />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="text-muted-foreground flex size-9 items-center justify-center text-sm"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "outline" : "ghost"}
            size="sm"
            render={
              page !== currentPage ? <Link href={href(page)} /> : undefined
            }
            className={cn(page === currentPage && "pointer-events-none")}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        disabled={!hasNext}
        render={hasNext ? <Link href={href(currentPage + 1)} /> : undefined}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
