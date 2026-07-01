"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

type Workshop = RouterOutputs["staff"]["workshops"]["list"][number];

const statuses = ["pending", "approved", "rejected"] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().min(1, { message: "Image URL is required" }),
  link: z.string().min(1, { message: "Link is required" }),
  classCode: z.string().min(1, { message: "Class code is required" }),
  mentors: z.string().optional(),
  status: z.enum(statuses),
});

export const WorkshopsForm = ({
  workshop,
  open,
  onOpenChange,
}: {
  workshop?: Workshop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {open && (
          <Content workshop={workshop} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  workshop,
  onClose,
}: {
  workshop?: Workshop;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createWorkshop = useMutation(
    trpc.staff.workshops.create.mutationOptions()
  );
  const updateWorkshop = useMutation(
    trpc.staff.workshops.update.mutationOptions()
  );
  const isPending = createWorkshop.isPending || updateWorkshop.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workshop?.name ?? "",
      description: workshop?.description ?? "",
      image: workshop?.image ?? "",
      link: workshop?.link ?? "",
      classCode: workshop?.classCode ?? "",
      mentors: workshop?.mentors?.join(", ") ?? "",
      status: workshop?.status ?? "pending",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const { mentors, ...rest } = values;
    const data = {
      ...rest,
      mentors: mentors
        ? mentors
            .split(",")
            .map((mentor) => mentor.trim())
            .filter(Boolean)
        : [],
    };

    const options = {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.staff.workshops.list.pathKey(),
        });
        toast.success(workshop ? "Workshop updated" : "Workshop added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (workshop) {
      updateWorkshop.mutate({ id: workshop.id, ...data }, options);
    } else {
      createWorkshop.mutate(data, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{workshop ? "Edit Workshop" : "Add Workshop"}</DialogTitle>
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
                  placeholder="Workshop name"
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
                  placeholder="https://… (upload via Admin → Media)"
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
            name="classCode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Class Code</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="e.g. e5y22pk"
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
          name="mentors"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Mentors</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="Comma separated, e.g. Sara, Maryam"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
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
            {workshop ? "Save changes" : "Add workshop"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
