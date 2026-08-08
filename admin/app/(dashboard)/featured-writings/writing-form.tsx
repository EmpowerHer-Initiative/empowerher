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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type FeaturedWriting =
  RouterOutputs["admin"]["featuredWritings"]["list"][number];

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().min(1, { message: "Image URL is required" }),
  link: z.string().min(1, { message: "Link is required" }),
  from: z.string().min(1, { message: "Author is required" }),
});

export const WritingForm = ({
  writing,
  open,
  onOpenChange,
}: {
  writing?: FeaturedWriting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {open && (
          <Content writing={writing} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  writing,
  onClose,
}: {
  writing?: FeaturedWriting;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createWriting = useMutation(
    trpc.admin.featuredWritings.create.mutationOptions()
  );
  const updateWriting = useMutation(
    trpc.admin.featuredWritings.update.mutationOptions()
  );
  const isPending = createWriting.isPending || updateWriting.isPending;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Public URL of an image uploaded in this dialog session, not yet saved
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
      title: writing?.title ?? "",
      description: writing?.description ?? "",
      image: writing?.image ?? "",
      link: writing?.link ?? "",
      from: writing?.from ?? "",
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const { data, error } = await agency.uploads.upload(file, {
      path: "featured-writings",
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
    form.setValue("image", data.publicUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const options = {
      onSuccess: () => {
        // Uploaded file ended up unused (a URL was pasted over it) — remove it
        if (
          pendingUploadRef.current &&
          pendingUploadRef.current !== values.image
        ) {
          void agency.uploads.delete({ key: pendingUploadRef.current });
        }
        savedRef.current = true;
        pendingUploadRef.current = null;
        // Saved with a new image — remove the previous one from storage
        if (writing?.image && writing.image !== values.image) {
          void agency.uploads.delete({ key: writing.image });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.admin.featuredWritings.list.pathKey(),
        });
        toast.success(writing ? "Writing updated" : "Writing added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (writing) {
      updateWriting.mutate({ id: writing.id, ...values }, options);
    } else {
      createWriting.mutate(values, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {writing ? "Edit Featured Writing" : "Add Featured Writing"}
        </DialogTitle>
      </DialogHeader>
      <form
        // eslint-disable-next-line react-hooks/refs -- refs are read in onSuccess (event time), not during render
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="Writing title"
                  aria-invalid={fieldState.invalid}
                />
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
                  rows={3}
                  placeholder="Short description"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="image"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Image</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Writing cover"
                      className="size-16 shrink-0 rounded-md border object-cover"
                    />
                  )}
                  <Input
                    {...field}
                    placeholder="https://… or upload a file"
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading || isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading && <Spinner />}
                    Upload
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="link"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Link</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="https://…"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="from"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Author</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="Author name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
        </div>
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
            {writing ? "Save changes" : "Add writing"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
