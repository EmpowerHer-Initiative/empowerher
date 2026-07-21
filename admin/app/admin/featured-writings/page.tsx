"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { WritingForm } from "./writing-form";

type Sort = "newest" | "oldest";

export default function FeaturedWritingsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");

  const trpc = useTRPC();
  const {
    data: writings,
    isPending,
    error,
  } = useQuery(trpc.admin.featuredWritings.list.queryOptions());

  const sorted = useMemo(() => {
    if (!writings) return [];
    return [...writings].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [writings, sort]);

  return (
    <div className="container">
      <h1>Featured Writings</h1>
      <div className="mb-4 flex items-center gap-2">
        <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <Plus /> Add Writing
        </Button>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={sorted}
        error={error}
      />
      <WritingForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
