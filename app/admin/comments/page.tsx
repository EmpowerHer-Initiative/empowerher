"use client";

import { Suspense, useMemo, useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DataTable } from "@/components/data-table";
import { TabLineAnimate } from "@/components/tab-line-animate";

import { columns } from "./columns";

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

type StatusFilter = (typeof tabs)[number]["value"];
type CommentStatus = "pending" | "approved" | "rejected";

const CommentsPage = () => {
  const [tab, setTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

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

  return (
    <div className="container">
      <h1>Comments</h1>
      <TabLineAnimate
        tabs={tabs.map((item) => ({ label: item.label, value: item.value }))}
        tab={tab}
        setTab={(value) => setTab(value as StatusFilter)}
        className="mb-8"
      />
      <div className="mb-4 flex items-center gap-2">
        <InputGroup className="w-full max-w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search comments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={filtered}
        error={error}
      />
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
