"use client";

import { useState } from "react";
import { useIsAdmin } from "@/services/auth/hooks/use-role";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ProjectsForm } from "./projects-form";
import { WorkshopsForm } from "./workshops-form";

type Project = RouterOutputs["staff"]["projects"]["list"][number];
type Workshop = RouterOutputs["staff"]["workshops"]["list"][number];

const statusVariant = (status: string) =>
  status === "approved"
    ? "default"
    : status === "rejected"
      ? "destructive"
      : "outline";

export const projectColumns: ColumnDef<Project>[] = [
  {
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground line-clamp-1 max-w-xs text-sm">
        {row.original.description}
      </div>
    ),
  },
  {
    header: "Link",
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        Open <ExternalLink className="size-3" />
      </a>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={statusVariant(row.original.status)}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProjectActionCell project={row.original} />,
  },
];

export const workshopColumns: ColumnDef<Workshop>[] = [
  {
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    header: "Class Code",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.classCode}</Badge>
    ),
  },
  {
    header: "Mentors",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.mentors?.length ? row.original.mentors.join(", ") : "—"}
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={statusVariant(row.original.status)}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <WorkshopActionCell workshop={row.original} />,
  },
];

const ProjectActionCell = ({ project }: { project: Project }) => {
  const trpc = useTRPC();
  const { isAdmin } = useIsAdmin();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteProject = useMutation(
    trpc.staff.projects.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.projects.list.pathKey(),
        });
        toast.success("Project deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete project");
      },
    })
  );

  if (!isAdmin) return null;

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash />
      </Button>

      <ProjectsForm
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {project.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteProject.isPending}
              onClick={() =>
                deleteProject.mutate(project.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const WorkshopActionCell = ({ workshop }: { workshop: Workshop }) => {
  const trpc = useTRPC();
  const { isAdmin } = useIsAdmin();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteWorkshop = useMutation(
    trpc.staff.workshops.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.workshops.list.pathKey(),
        });
        toast.success("Workshop deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete workshop");
      },
    })
  );

  if (!isAdmin) return null;

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash />
      </Button>

      <WorkshopsForm
        workshop={workshop}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete workshop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {workshop.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteWorkshop.isPending}
              onClick={() =>
                deleteWorkshop.mutate(workshop.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete workshop
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
