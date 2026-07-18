"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { CACHE_TAGS } from "@/services/cache/tags";
import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevalidateButton } from "@/components/admin/revalidate-button";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { ResourcesForm } from "./resources-form";

type Sort = "newest" | "oldest";

export default function ResourcesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");

  const trpc = useTRPC();
  const {
    data: resources,
    isPending,
    error,
  } = useQuery(trpc.admin.resources.list.queryOptions());

  const sorted = useMemo(() => {
    if (!resources) return [];
    return [...resources].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [resources, sort]);

  return (
    <div className="container">
      <h1>Resources</h1>
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
        <div className="ml-auto flex items-center gap-2">
          <RevalidateButton
            tag={CACHE_TAGS.resources}
            label="Publish"
            description="Update the live pages"
            subject="resources"
          />
          <Button onClick={() => setAddOpen(true)}>
            <Plus /> Add Resource
          </Button>
        </div>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={sorted}
        error={error}
      />
      <ResourcesForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
