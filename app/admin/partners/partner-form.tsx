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

type Partner = RouterOutputs["admin"]["partners"]["list"][number];

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().min(1, { message: "Logo is required" }),
  link: z.string().min(1, { message: "Link is required" }),
});

export const PartnerForm = ({
  partner,
  open,
  onOpenChange,
}: {
  partner?: Partner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {open && (
          <Content partner={partner} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  partner,
  onClose,
}: {
  partner?: Partner;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createPartner = useMutation(
    trpc.admin.partners.create.mutationOptions()
  );
  const updatePartner = useMutation(
    trpc.admin.partners.update.mutationOptions()
  );
  const isPending = createPartner.isPending || updatePartner.isPending;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Public URL of a logo uploaded in this dialog session, not yet saved
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
      name: partner?.name ?? "",
      image: partner?.image ?? "",
      link: partner?.link ?? "",
    },
  });

  const handleLogoUpload = async (file: File) => {
    setIsUploading(true);
    const { data, error } = await agency.uploads.upload(file, {
      path: "Partners and Supporters",
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
        savedRef.current = true;
        pendingUploadRef.current = null;
        // Saved with a new logo — remove the previous one from storage
        if (partner?.image && partner.image !== values.image) {
          void agency.uploads.delete({ key: partner.image });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.admin.partners.list.pathKey(),
        });
        toast.success(partner ? "Partner updated" : "Partner added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (partner) {
      updatePartner.mutate({ id: partner.id, ...values }, options);
    } else {
      createPartner.mutate(values, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{partner ? "Edit Partner" : "Add Partner"}</DialogTitle>
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
                  placeholder="Partner name"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="link"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Link</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="https://example.org"
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
              <FieldLabel>Logo</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  {field.value && (
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5">
                      <img
                        src={field.value}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading || isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading && <Spinner />}
                    {field.value ? "Change logo" : "Upload logo"}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleLogoUpload(file);
                    e.target.value = "";
                  }}
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
            {partner ? "Save changes" : "Add partner"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
