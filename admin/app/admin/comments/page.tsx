"use client";

import { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { TabLineAnimate } from "@/components/tab-line-animate";

import { CommentCard } from "./comment-card";

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

type StatusFilter = (typeof tabs)[number]["value"];
type CommentStatus = "pending" | "approved" | "rejected";

const PAGE_SIZE = 12;

const CommentsPage = () => {
  const [tab, setTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const trpc = useTRPC();
  const {
    data: comments,
    isPending,
    error,
  } = useQuery(
    trpc.admin.comments.list.queryOptions({
      status: tab === "all" ? undefined : [tab as CommentStatus],
    })
  );

  const filtered = useMemo(() => {
    if (!comments) return [];
    if (!search) return comments;
    const query = search.toLowerCase();
    return comments.filter(
      (comment) =>
        comment.from.toLowerCase().includes(query) ||
        comment.blogName.toLowerCase().includes(query) ||
        comment.message.toLowerCase().includes(query)
    );
  }, [comments, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Clamp during render so a shrinking result set never leaves us on a dead page.
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const changeTab = (value: StatusFilter) => {
    setTab(value);
    setPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="container">
      <h1>Comments</h1>
      <TabLineAnimate
        tabs={tabs.map((item) => ({ label: item.label, value: item.value }))}
        tab={tab}
        setTab={(value) => changeTab(value as StatusFilter)}
        className="mb-8"
      />
      <div className="mb-6 flex items-center gap-2">
        <InputGroup className="w-full max-w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search comments"
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {error ? (
        <div className="text-destructive py-16 text-center text-sm">
          {error.message || "Failed to load comments"}
        </div>
      ) : isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center text-sm">
          No comments found.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft />
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
                <ChevronRight />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <CommentsPage />
    </Suspense>
  );
};

export default Page;
