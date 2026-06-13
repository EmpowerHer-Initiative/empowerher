"use client";

import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

type Resource = RouterOutputs["admin"]["resources"]["list"][number];

const statuses = ["active", "expired", "remote"] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().min(1, { message: "Image URL is required" }),
  link: z.string().min(1, { message: "Link is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  deadline: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(statuses),
});

export const ResourcesForm = ({
  resource,
  open,
  onOpenChange,
}: {
  resource?: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {open && (
          <Content resource={resource} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  resource,
  onClose,
}: {
  resource?: Resource;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createResource = useMutation(
    trpc.admin.resources.create.mutationOptions()
  );
  const updateResource = useMutation(
    trpc.admin.resources.update.mutationOptions()
  );
  const isPending = createResource.isPending || updateResource.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: resource?.name ?? "",
      description: resource?.description ?? "",
      image: resource?.image ?? "",
      link: resource?.link ?? "",
      location: resource?.location ?? "",
      deadline: resource?.deadline ?? "",
      type: resource?.type ?? "",
      status: resource?.status ?? "active",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const options = {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.resources.list.pathKey(),
        });
        toast.success(resource ? "Resource updated" : "Resource added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (resource) {
      updateResource.mutate({ id: resource.id, ...values }, options);
    } else {
      createResource.mutate(values, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{resource ? "Edit Resource" : "Add Resource"}</DialogTitle>
      </DialogHeader>
      <form
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
                  placeholder="Resource name"
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
              <FieldLabel>Image URL</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="https://… (upload via Media)"
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
            name="location"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Location</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="e.g. Remote"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="deadline"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Deadline</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="e.g. May 10, 2026"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Type</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="e.g. Scholarship"
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
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {resource ? "Save changes" : "Add resource"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
