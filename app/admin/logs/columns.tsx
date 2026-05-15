"use client";

import { useState } from "react";
import type { EmailLogMetadata } from "@/services/db/schema";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
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
import { Button } from "@/components/ui/button";

type LogFromAPI = RouterOutputs["logs"]["list"][number];

export const columns: ColumnDef<LogFromAPI>[] = [
  {
    header: "Type",
    cell: ({ row }) => (
      <span
        className={
          row.original.type === "email"
            ? "rounded bg-green-500/15 px-2 py-0.5 text-xs text-green-500 uppercase"
            : "rounded bg-blue-500/15 px-2 py-0.5 text-xs text-blue-500 uppercase"
        }
      >
        {row.original.type}
      </span>
    ),
  },
  {
    header: "Summary",
    cell: ({ row }) => {
      const meta = row.original.metadata as EmailLogMetadata | null;
      return (
        <div className="flex flex-col">
          <span className="text-foreground text-sm">
            {row.original.summary}
          </span>
          {meta && "to" in meta && (
            <span className="text-muted-foreground text-xs">{meta.to}</span>
          )}
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.original.status === "success"
            ? "rounded bg-green-500/15 px-2 py-0.5 text-xs text-green-500"
            : "text-destructive bg-destructive/15 rounded px-2 py-0.5 text-xs"
        }
      >
        {row.original.status}
      </span>
    ),
  },
  {
    header: "Error",
    cell: ({ row }) =>
      row.original.error ? (
        <span className="text-destructive text-xs">{row.original.error}</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(
          typeof row.original.createdAt === "string"
            ? new Date(row.original.createdAt)
            : row.original.createdAt,
          { addSuffix: true }
        )}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell log={row.original} />,
  },
];

const ActionCell = ({ log }: { log: LogFromAPI }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const trpc = useTRPC();

  const deleteLog = useMutation(
    trpc.logs.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Log entry deleted");
        queryClient.invalidateQueries({
          queryKey: trpc.logs.list.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.logs.count.pathKey(),
        });
      },
    })
  );

  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteOpen(true);
        }}
      >
        <Trash size={14} />
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm" onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete log entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this log entry? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteLog.isPending}
              onClick={() =>
                deleteLog.mutate(log.id, {
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
