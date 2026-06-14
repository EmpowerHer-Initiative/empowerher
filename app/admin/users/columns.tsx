"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Ban, CircleUserRound, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { useUpdateAdminUser } from "@/services/auth/hooks/use-admin";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

type UserFromAPI = RouterOutputs["users"]["list"][number];

export const columnsLoading: ColumnDef<UserFromAPI>[] = [
  {
    header: "User",
    cell: () => <div className="flex items-center gap-2"></div>,
  },
  {
    header: "Joined",
    cell: () => <div></div>,
  },
  {
    id: "actions",
    cell: () => {
      return <div className="flex justify-end"></div>;
    },
  },
];

export const columns: ColumnDef<UserFromAPI>[] = [
  {
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage src={row.original.image ?? ""} />
          <AvatarFallback>{row.original.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col -space-y-1 text-sm">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground">{row.original.email}</div>
        </div>
        <div className="ml-auto text-xs text-red-600">
          {row.original.banned && <Ban size={14} />}
        </div>
        {/* {row.original.role === "admin" && (
          <UserStar size={16} className="text-yellow-500" />
        )} */}
      </div>
    ),
  },
  {
    header: "Joined",
    cell: ({ row }) => (
      <div>
        {format(
          typeof row.original.createdAt === "string"
            ? parseISO(row.original.createdAt)
            : row.original.createdAt,
          "MMMM d, yyyy"
        )}
        {/* (
        {formatDistanceToNow(row.original.createdAt, { addSuffix: true })}) */}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];

const ActionCell = ({ user }: { user: UserFromAPI }) => {
  const router = useRouter();
  const trpc = useTRPC();

  const [isOpen, setIsOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const updateAdminUser = useUpdateAdminUser();
  const deleteAccount = useMutation(
    trpc.users.delete.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.pathKey(),
        });
      },
    })
  );

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex justify-end">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="w-[300px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/admin/users/${user.id}`);
              }}
            >
              <CircleUserRound /> View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                if (user.banned) {
                  updateAdminUser.mutate({
                    banned: false,
                    role: "user",
                    banReason: "",
                    id: user.id,
                  });
                } else {
                  setTimeout(() => {
                    setBanOpen(true);
                  }, 100);
                }
                setIsOpen(false);
              }}
            >
              <Ban /> {user.banned ? "Unban" : "Ban"}
            </DropdownMenuItem> */}
            {currentUser?.user.id !== user.id && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setDeleteOpen(true);
                }}
              >
                <Trash /> Delete user
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={banOpen} onOpenChange={setBanOpen}>
        <AlertDialogContent
          className="md:max-w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <AlertDialogHeader className="gap-0">
            <AlertDialogTitle className="text-base">Ban user</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to ban {user.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            className="flex flex-col gap-2"
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.target as HTMLFormElement);

              const banReason = formData.get("banReason") as string;

              updateAdminUser.mutate(
                {
                  id: user.id,
                  banned: !user.banned,
                  role: "user",
                  banReason,
                },
                {
                  onSuccess: () => {
                    setBanOpen(false);
                  },
                }
              );
            }}
          >
            <Textarea
              placeholder="Ban Reason (optional)"
              name="banReason"
              rows={10}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form");
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }}
            />
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={updateAdminUser.isPending}
              onClick={() => formRef.current?.requestSubmit()}
            >
              Ban user
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm" onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteAccount.isPending}
              onClick={() =>
                deleteAccount.mutate(user.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
