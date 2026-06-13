"use client";

import { useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { ResourcesForm } from "./resources-form";

export default function ResourcesPage() {
  const [addOpen, setAddOpen] = useState(false);

  const trpc = useTRPC();
  const {
    data: resources,
    isPending,
    error,
  } = useQuery(trpc.admin.resources.list.queryOptions());

  return (
    <div className="container">
      <h1>Resources</h1>
      <div className="mb-4 flex">
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <Plus /> Add Resource
        </Button>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={resources ?? []}
        error={error}
      />
      <ResourcesForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
