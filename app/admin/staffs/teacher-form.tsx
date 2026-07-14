"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { agency } from "@/lib/agency-api";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type Teacher = RouterOutputs["staff"]["teachers"]["list"][number];

const roles = ["mentor", "executive", "lecturer", "director"] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  headTitle: z.string().min(1, { message: "Title is required" }),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  description: z.string().optional(),
  role: z.enum(roles),
});

export const TeacherForm = ({
  teacher,
  open,
  onOpenChange,
}: {
  teacher?: Teacher;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {open && (
          <Content teacher={teacher} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  teacher,
  onClose,
}: {
  teacher?: Teacher;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createTeacher = useMutation(
    trpc.staff.teachers.create.mutationOptions()
  );
  const updateTeacher = useMutation(
    trpc.staff.teachers.update.mutationOptions()
  );
  const isPending = createTeacher.isPending || updateTeacher.isPending;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Public URL of an avatar uploaded in this dialog session, not yet saved
  const pendingUploadRef = useRef<string | null>(null);
  const savedRef = useRef(false);

  // Dialog closed without saving (cancel, esc, overlay) — remove the
  // unsaved upload from storage so no orphaned files are left behind
  useEffect(() => {
    return () => {
      if (!savedRef.current && pendingUploadRef.current) {
        void agency.uploads.delete({ key: pendingUploadRef.current });
      }
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: teacher?.name ?? "",
      headTitle: teacher?.headTitle ?? "",
      email: teacher?.email ?? "",
      phone: teacher?.phone ?? "",
      avatar: teacher?.avatar ?? "",
      description: teacher?.description ?? "",
      role: teacher?.role ?? "mentor",
    },
  });

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    const { data, error } = await agency.uploads.upload(file, {
      path: "staffs",
      naming: "uuid",
    });
    setIsUploading(false);

    if (error) {
      toast.error(error.message || "Upload failed");
      return;
    }

    // Replaced an earlier unsaved upload — remove it from storage
    if (pendingUploadRef.current) {
      void agency.uploads.delete({ key: pendingUploadRef.current });
    }
    pendingUploadRef.current = data.publicUrl;
    form.setValue("avatar", data.publicUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const options = {
      onSuccess: () => {
        savedRef.current = true;
        pendingUploadRef.current = null;
        // Saved with a new avatar — remove the previous one from storage
        if (teacher?.avatar && teacher.avatar !== values.avatar) {
          void agency.uploads.delete({ key: teacher.avatar });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.staff.teachers.list.pathKey(),
        });
        toast.success(teacher ? "Staff updated" : "Staff added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (teacher) {
      updateTeacher.mutate({ id: teacher.id, ...values }, options);
    } else {
      createTeacher.mutate(values, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{teacher ? "Edit Staff" : "Add Staff"}</DialogTitle>
      </DialogHeader>
      <form
        // eslint-disable-next-line react-hooks/refs -- refs are read in onSuccess (event time), not during render
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="Full name"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="headTitle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="e.g. Lead Mentor"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="+1 555 000 0000"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="avatar"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Avatar</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Avatar"
                      className="size-16 shrink-0 rounded-full border object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading || isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading && <Spinner />}
                    {field.value ? "Change avatar" : "Upload avatar"}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarUpload(file);
                    e.target.value = "";
                  }}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="role"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Role</FieldLabel>
              <FieldContent>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="capitalize"
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Short bio"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending && <Spinner />}
            {teacher ? "Save changes" : "Add staff"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
