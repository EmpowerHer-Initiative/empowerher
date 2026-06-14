"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";

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
import { Button } from "@/components/ui/button";

import { WritingForm } from "./writing-form";

type FeaturedWriting =
  RouterOutputs["admin"]["featuredWritings"]["list"][number];

export const columns: ColumnDef<FeaturedWriting>[] = [
  {
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    header: "Author",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">{row.original.from}</div>
    ),
  },
  {
    header: "Description",
    cell: ({ row }) => (
      <div className="line-clamp-1 max-w-sm text-sm">
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
    id: "actions",
    cell: ({ row }) => <ActionCell writing={row.original} />,
  },
];

const ActionCell = ({ writing }: { writing: FeaturedWriting }) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteWriting = useMutation(
    trpc.admin.featuredWritings.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.featuredWritings.list.pathKey(),
        });
        toast.success("Writing deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete writing");
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

      <WritingForm
        writing={writing}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete writing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {writing.title}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteWriting.isPending}
              onClick={() =>
                deleteWriting.mutate(writing.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete writing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
