"use client";

import { useState } from "react";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
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

type RejectedStudent =
  RouterOutputs["staff"]["rejectedStudents"]["list"][number];

export const columns: ColumnDef<RejectedStudent>[] = [
  {
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.original.email}</div>
    ),
  },
  {
    header: "Added",
    cell: ({ row }) => format(row.original.createdAt, "MMMM d, yyyy"),
  },
  {
    header: "Email Sent",
    cell: ({ row }) =>
      row.original.emailSent ? (
        <Badge>
          Sent
          {row.original.emailSentAt &&
            ` — ${format(row.original.emailSentAt, "MMM d, yyyy")}`}
        </Badge>
      ) : (
        <Badge variant="outline">Not sent</Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell rejectedStudent={row.original} />,
  },
];

const ActionCell = ({
  rejectedStudent,
}: {
  rejectedStudent: RejectedStudent;
}) => {
  const trpc = useTRPC();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteRejected = useMutation(
    trpc.staff.rejectedStudents.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.rejectedStudents.list.pathKey(),
        });
        toast.success("Rejected student deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete rejected student");
      },
    })
  );

  return (
    <div className="flex justify-end">
      <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash />
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete rejected student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {rejectedStudent.email}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteRejected.isPending}
              onClick={() =>
                deleteRejected.mutate(rejectedStudent.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
