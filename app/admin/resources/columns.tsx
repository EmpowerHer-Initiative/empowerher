"use client";

import { useState } from "react";
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

import { ResourcesForm } from "./resources-form";

type Resource = RouterOutputs["admin"]["resources"]["list"][number];

export const columns: ColumnDef<Resource>[] = [
  {
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    header: "Location",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.location}
      </div>
    ),
  },
  {
    header: "Deadline",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.deadline || "—"}
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
        variant={row.original.status === "expired" ? "destructive" : "outline"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell resource={row.original} />,
  },
];

const ActionCell = ({ resource }: { resource: Resource }) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteResource = useMutation(
    trpc.admin.resources.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.resources.list.pathKey(),
        });
        toast.success("Resource deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete resource");
      },
    })
  );

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash />
      </Button>

      <ResourcesForm
        resource={resource}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {resource.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteResource.isPending}
              onClick={() =>
                deleteResource.mutate(resource.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
