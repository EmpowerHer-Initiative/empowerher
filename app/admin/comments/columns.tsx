"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Comment = RouterOutputs["admin"]["comments"]["list"][number];

export const columns: ColumnDef<Comment>[] = [
  {
    header: "From",
    cell: ({ row }) => <div className="font-medium">{row.original.from}</div>,
  },
  {
    header: "Blog",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.blogName}
      </div>
    ),
  },
  {
    header: "Message",
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-sm text-sm">
        {row.original.message}
      </div>
    ),
  },
  {
    header: "Date",
    cell: ({ row }) => format(row.original.createdAt, "MMM d, yyyy"),
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusCell comment={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell comment={row.original} />,
  },
];

const StatusCell = ({ comment }: { comment: Comment }) => {
  const trpc = useTRPC();

  const updateComment = useMutation(
    trpc.admin.comments.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.comments.list.pathKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update status");
      },
    })
  );

  return (
    <Select
      value={comment.status}
      onValueChange={(status) =>
        updateComment.mutate({
          id: comment.id,
          status: status as Comment["status"],
        })
      }
    >
      <SelectTrigger size="sm" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
};

const ActionCell = ({ comment }: { comment: Comment }) => {
  const trpc = useTRPC();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteComment = useMutation(
    trpc.admin.comments.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.comments.list.pathKey(),
        });
        toast.success("Comment deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete comment");
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
            <AlertDialogTitle>Delete comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteComment.isPending}
              onClick={() =>
                deleteComment.mutate(comment.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
