"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Pencil, Phone, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TeacherForm } from "./teacher-form";

type Teacher = RouterOutputs["staff"]["teachers"]["list"][number];

export default function StaffsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const { isAdmin, isPending: isRolePending } = useIsAdmin();
  const trpc = useTRPC();
  const { data: teachers, isPending } = useQuery(
    trpc.staff.teachers.list.queryOptions(undefined, { enabled: isAdmin })
  );

  if (!isRolePending && !isAdmin) {
    notFound();
  }

  return (
    <div className="container">
      <h1>Staffs</h1>
      <div className="mb-4 flex">
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <Plus /> Add Staff
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))
          : teachers?.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isAdmin={isAdmin}
              />
            ))}
      </div>
      {!isPending && teachers?.length === 0 && (
        <p className="text-muted-foreground text-sm">No staff members yet.</p>
      )}
      <TeacherForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

const TeacherCard = ({
  teacher,
  isAdmin,
}: {
  teacher: Teacher;
  isAdmin: boolean;
}) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteTeacher = useMutation(
    trpc.staff.teachers.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.teachers.list.pathKey(),
        });
        toast.success("Staff deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete staff");
      },
    })
  );

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={teacher.avatar ?? ""} />
            <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-medium">{teacher.name}</span>
            <span className="text-muted-foreground text-sm">
              {teacher.headTitle}
            </span>
          </div>
          <Badge variant="outline" className="ml-auto capitalize">
            {teacher.role}
          </Badge>
        </div>
        {teacher.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {teacher.description}
          </p>
        )}
        <div className="text-muted-foreground flex flex-col gap-1 text-xs">
          {teacher.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="size-3" /> {teacher.email}
            </span>
          )}
          {teacher.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="size-3" /> {teacher.phone}
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash />
            </Button>
          </div>
        )}
      </CardContent>

      <TeacherForm
        teacher={teacher}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete staff</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {teacher.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteTeacher.isPending}
              onClick={() =>
                deleteTeacher.mutate(teacher.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete staff
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
