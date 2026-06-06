"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/services/auth/auth-client";
import {
  useChangeOwnPassword,
  useCurrentUser,
  useDismissPasswordChange,
} from "@/services/auth/hooks/use-user";
import type { UserMetadata } from "@/services/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const UserControl = () => {
  const { data, error } = useCurrentUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate: changePassword, isPending: isChanging } =
    useChangeOwnPassword();
  const { mutate: dismiss, isPending: isDismissing } =
    useDismissPasswordChange();

  const isPending = isChanging || isDismissing;

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      authClient.signOut();
    }
  }, [error]);

  const metadata = data?.user?.metadata as UserMetadata | undefined;

  useEffect(() => {
    if (metadata?.mustChangePassword === true) {
      setDialogOpen(true);
    }
  }, [metadata?.mustChangePassword]);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleSubmit = (values: z.infer<typeof passwordSchema>) => {
    changePassword(
      { newPassword: values.newPassword },
      {
        onSuccess: () => {
          setDialogOpen(false);
          form.reset();
          toast.success("Password changed successfully");
        },
        onError: (err) => {
          form.setError("confirmPassword", {
            message: err.message || "Failed to change password",
          });
        },
      }
    );
  };

  const handleIgnore = () => {
    dismiss(undefined, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  };

  if (!metadata?.mustChangePassword) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <DialogDescription>
            Your account was created by an administrator. You can set a new
            password or keep the current one.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter new password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirm Password</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm new password"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleIgnore} disabled={isPending}>
            Ignore
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isPending}
          >
            Change password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
