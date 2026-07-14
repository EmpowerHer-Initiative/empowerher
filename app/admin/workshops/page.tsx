"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useIsAdmin } from "@/services/auth/hooks/use-role";
import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { workshopColumns } from "./columns";
import { WorkshopsForm } from "./workshops-form";

export default function WorkshopsPage() {
  const [addWorkshopOpen, setAddWorkshopOpen] = useState(false);

  const { isAdmin } = useIsAdmin();
  const trpc = useTRPC();
  const workshops = useQuery(trpc.staff.workshops.list.queryOptions());

  return (
    <div className="container flex flex-col gap-12">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="mb-0!">Workshops</h1>
          {isAdmin && (
            <Button onClick={() => setAddWorkshopOpen(true)}>
              <Plus /> Add Workshop
            </Button>
          )}
        </div>
        <DataTable
          isLoading={workshops.isPending}
          columns={workshopColumns}
          data={workshops.data ?? []}
          error={workshops.error}
        />
      </section>

      <WorkshopsForm open={addWorkshopOpen} onOpenChange={setAddWorkshopOpen} />
    </div>
  );
}
