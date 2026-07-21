"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/services/auth/auth-client";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { queryClient } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export const DangerSettings = () => {
  const [inputValue, setInputValue] = useState("");
  const user = useCurrentUser();

  const router = useRouter();
  const deleteAccount = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.deleteUser();
      if (error) throw new Error(error.message || error.statusText);
      return data;
    },
    onSuccess: () => {
      router.push("/account-deleted");
      router.refresh();

      // Clear all queries
      queryClient.clear();

      // Delete all local storage and session storage items
      localStorage.clear();
      sessionStorage.clear();
    },
  });

  if (user.isPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This action is permanent and cannot be undone. Here&apos;s what will
            happen when you delete your account:
          </p>

          <ul className="space-y-3 text-sm">
            <li>
              <p className="font-medium">Account Data</p>
              <p className="text-muted-foreground">
                Your profile, settings, and all personal data will be
                permanently deleted from our database
              </p>
            </li>

            <li>
              <p className="font-medium">Browser Data</p>
              <p className="text-muted-foreground">
                All cookies, local storage, and session storage will be cleared
                from your browser
              </p>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="justify-end">
          <Dialog>
            <DialogTrigger
              render={<Button variant="destructive">Delete Account</Button>}
            />
            <DialogContent>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action is permanent and cannot be undone. Here&apos;s what
                will happen when you delete your account:
              </DialogDescription>
              <Input
                placeholder="Say 'DELETE' to confirm deletion"
                size="lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={inputValue !== "DELETE" || deleteAccount.isPending}
                  onClick={() => {
                    deleteAccount.mutate(undefined, {
                      onError: (error) => {
                        toast.error(error.message);
                      },
                    });
                  }}
                >
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};
