"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { WritingForm } from "./writing-form";

export default function FeaturedWritingsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const trpc = useTRPC();
  const {
    data: writings,
    isPending,
    error,
  } = useQuery(trpc.admin.featuredWritings.list.queryOptions());

  return (
    <div className="container">
      <h1>Featured Writings</h1>
      <div className="mb-4 flex">
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <Plus /> Add Writing
        </Button>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={writings ?? []}
        error={error}
      />
      <WritingForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
