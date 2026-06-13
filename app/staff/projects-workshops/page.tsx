"use client";

import { useState } from "react";
import { useIsAdmin } from "@/services/auth/hooks/use-role";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { projectColumns, workshopColumns } from "./columns";
import { ProjectsForm } from "./projects-form";
import { WorkshopsForm } from "./workshops-form";

export default function ProjectsWorkshopsPage() {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addWorkshopOpen, setAddWorkshopOpen] = useState(false);

  const { isAdmin } = useIsAdmin();
  const trpc = useTRPC();
  const projects = useQuery(trpc.staff.projects.list.queryOptions());
  const workshops = useQuery(trpc.staff.workshops.list.queryOptions());

  return (
    <div className="container flex flex-col gap-12">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="mb-0!">Projects</h1>
          {isAdmin && (
            <Button onClick={() => setAddProjectOpen(true)}>
              <Plus /> Add Project
            </Button>
          )}
        </div>
        <DataTable
          isLoading={projects.isPending}
          columns={projectColumns}
          data={projects.data ?? []}
          error={projects.error}
        />
      </section>

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

      <ProjectsForm open={addProjectOpen} onOpenChange={setAddProjectOpen} />
      <WorkshopsForm open={addWorkshopOpen} onOpenChange={setAddWorkshopOpen} />
    </div>
  );
}
