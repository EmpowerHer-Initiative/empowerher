"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, Trash } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Comment = RouterOutputs["admin"]["comments"]["list"][number];

const statusAccent: Record<Comment["status"], string> = {
  pending: "border-l-amber-400",
  approved: "border-l-emerald-500",
  rejected: "border-l-rose-400",
};

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const trpc = useTRPC();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateComment = useMutation(
    trpc.admin.comments.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.comments.list.pathKey(),
        });
        toast.success("Status updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update status");
      },
    })
  );

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
    <Card
      className={cn(
        "h-full gap-0 border-l-4 py-0",
        statusAccent[comment.status]
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {comment.from.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{comment.from}</p>
            <p className="text-muted-foreground text-xs">
              {format(comment.createdAt, "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <Select
          value={comment.status}
          onValueChange={(status) =>
            updateComment.mutate({
              id: comment.id,
              status: status as Comment["status"],
            })
          }
        >
          <SelectTrigger size="sm" className="w-28 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="flex-1 px-4 py-2">
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {comment.message}
        </p>
      </CardContent>

      <CardFooter className="mt-2 flex items-center justify-between gap-2 border-t px-4 py-3">
        <Link
          href={`/hervoice/${comment.blogName}`}
          target="_blank"
          className="text-muted-foreground hover:text-foreground flex min-w-0 items-center gap-1 text-xs transition-colors"
        >
          <ExternalLink className="size-3 shrink-0" />
          <span className="truncate">{comment.blogName}</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash />
        </Button>
      </CardFooter>

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
    </Card>
  );
};
