"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Pencil, Star, Trash } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { StudentsForm } from "./students-form";

type Student = RouterOutputs["staff"]["students"]["list"][number];

export const columns: ColumnDef<Student>[] = [
  {
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col -space-y-1 text-sm">
        <div className="flex items-center gap-1 font-medium">
          {row.original.name}
          {row.original.emailId && (
            <Star className="fill-primary text-primary size-3" />
          )}
        </div>
        <div className="text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    header: "Workshop",
    cell: ({ row }) => <WorkshopCell workshopId={row.original.workshopId} />,
  },
  {
    header: "Added",
    cell: ({ row }) => format(row.original.createdAt, "MMMM d, yyyy"),
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusCell student={row.original} />,
  },
  {
    header: "Email",
    cell: ({ row }) =>
      row.original.emailId ? (
        <Link
          href={`/admin/logs?search=${encodeURIComponent(row.original.email ?? "")}`}
          className={buttonVariants({ size: "sm" })}
        >
          View email
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];

const WorkshopCell = ({ workshopId }: { workshopId: string }) => {
  const trpc = useTRPC();
  const { data: workshops } = useQuery(
    trpc.staff.workshops.list.queryOptions()
  );

  const workshop = workshops?.find((item) => item.id === workshopId);

  if (!workshop) return <Badge variant="outline">—</Badge>;

  return (
    <Badge
      className={cn(
        workshop?.name.toLowerCase().startsWith("leadership") && "bg-blue-500",
        workshop?.name.toLowerCase().startsWith("writing") && "bg-green-500",
        workshop?.name.toLowerCase().startsWith("cultural") && "bg-yellow-500",
        workshop?.name.toLowerCase().startsWith("creative") && "bg-red-500",
        workshop?.name.toLowerCase().startsWith("html") && "bg-purple-500"
      )}
    >
      {workshop.name}
    </Badge>
  );
};

const StatusCell = ({ student }: { student: Student }) => {
  const trpc = useTRPC();
  const [approveOpen, setApproveOpen] = useState(false);

  const updateStudent = useMutation(
    trpc.staff.students.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.students.list.pathKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update status");
      },
    })
  );

  return (
    <>
      <Select
        value={student.status}
        onValueChange={(status) => {
          if (status === "approved") {
            setApproveOpen(true);
          } else {
            updateStudent.mutate({ id: student.id, status: "pending" });
          }
        }}
      >
        <SelectTrigger size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          {approveOpen && (
            <ApproveContent
              student={student}
              onClose={() => setApproveOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const ApproveContent = ({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) => {
  const trpc = useTRPC();
  const [dueDate, setDueDate] = useState("");

  const sendApprovalEmail = useMutation(
    trpc.staff.students.sendApprovalEmail.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.students.list.pathKey(),
        });
        toast.success(`Approval email sent to ${student.email}`);
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send approval email");
      },
    })
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Approve {student.name}</DialogTitle>
        <DialogDescription>
          An acceptance email with the workshop&apos;s Google Classroom code
          will be sent to {student.email}.
        </DialogDescription>
      </DialogHeader>
      <Input
        placeholder="Invitation due date (e.g. May 10, 2026)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!dueDate.trim() || sendApprovalEmail.isPending}
          onClick={() =>
            sendApprovalEmail.mutate({
              id: student.id,
              dueDate: dueDate.trim(),
            })
          }
        >
          {sendApprovalEmail.isPending && <Spinner />}
          Approve & send email
        </Button>
      </DialogFooter>
    </>
  );
};

const ActionCell = ({ student }: { student: Student }) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteStudent = useMutation(
    trpc.staff.students.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.students.list.pathKey(),
        });
        toast.success("Student deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete student");
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

      <StudentsForm
        student={student}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {student.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteStudent.isPending}
              onClick={() =>
                deleteStudent.mutate(student.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
