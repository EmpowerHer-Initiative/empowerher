"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { agency } from "@/lib/agency-api";
import { useIsAdmin } from "@/services/auth/hooks/use-role";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { WorkshopsForm } from "./workshops-form";

type Workshop = RouterOutputs["staff"]["workshops"]["list"][number];

const statusVariant = (status: string) =>
  status === "approved"
    ? "default"
    : status === "rejected"
      ? "destructive"
      : "outline";

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

const WorkshopActionCell = ({ workshop }: { workshop: Workshop }) => {
  const trpc = useTRPC();
  const { isAdmin } = useIsAdmin();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteWorkshop = useMutation(
    trpc.staff.workshops.delete.mutationOptions({
      onSuccess: () => {
        // Row is gone — remove its image from storage (best-effort)
        if (workshop.image) {
          void agency.uploads.delete({ key: workshop.image });
        }
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
