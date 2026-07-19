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
import { Checkbox } from "@/components/ui/checkbox";
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

type Story = RouterOutputs["admin"]["hervoice"]["list"][number];

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  content: z.string().min(1, { message: "Content is required" }),
  image: z.string(),
  imageAlt: z.string(),
  imageCredit: z.string(),
  authorName: z.string(),
  authorBio: z.string(),
  authorPosition: z.string(),
  authorInstagram: z.string(),
  authorFacebook: z.string(),
  authorLinkedin: z.string(),
  messageToWorld: z.string(),
  hide: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// Empty strings → undefined so the DB stores null
const clean = (v: string) => (v.trim() === "" ? undefined : v);

export const HerVoiceForm = ({
  story,
  open,
  onOpenChange,
}: {
  story?: Story;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto md:max-w-5xl">
        {open && <Content story={story} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
};

const Content = ({
  story,
  onClose,
}: {
  story?: Story;
  onClose: () => void;
}) => {
  const trpc = useTRPC();

  const createStory = useMutation(trpc.admin.hervoice.create.mutationOptions());
  const updateStory = useMutation(trpc.admin.hervoice.update.mutationOptions());
  const isPending = createStory.isPending || updateStory.isPending;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadRef = useRef<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!savedRef.current && pendingUploadRef.current) {
        void agency.uploads.delete({ key: pendingUploadRef.current });
      }
    };
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: story?.title ?? "",
      description: story?.description ?? "",
      content: story?.content ?? "",
      image: story?.image ?? "",
      imageAlt: story?.imageAlt ?? "",
      imageCredit: story?.imageCredit ?? "",
      authorName: story?.authorName ?? "",
      authorBio: story?.authorBio ?? "",
      authorPosition: story?.authorPosition ?? "",
      authorInstagram: story?.authorInstagram ?? "",
      authorFacebook: story?.authorFacebook ?? "",
      authorLinkedin: story?.authorLinkedin ?? "",
      messageToWorld: story?.messageToWorld ?? "",
      hide: story?.hide ?? false,
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const { data, error } = await agency.uploads.upload(file, {
      path: "HerVoice",
      naming: "uuid",
    });
    setIsUploading(false);

    if (error) {
      toast.error(error.message || "Upload failed");
      return;
    }

    if (pendingUploadRef.current) {
      void agency.uploads.delete({ key: pendingUploadRef.current });
    }
    pendingUploadRef.current = data.publicUrl;
    form.setValue("image", data.publicUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSubmit = (values: FormValues) => {
    const payload = {
      title: values.title,
      content: values.content,
      description: clean(values.description),
      image: clean(values.image),
      imageAlt: clean(values.imageAlt),
      imageCredit: clean(values.imageCredit),
      authorName: clean(values.authorName),
      authorBio: clean(values.authorBio),
      authorPosition: clean(values.authorPosition),
      authorInstagram: clean(values.authorInstagram),
      authorFacebook: clean(values.authorFacebook),
      authorLinkedin: clean(values.authorLinkedin),
      messageToWorld: clean(values.messageToWorld),
      hide: values.hide,
    };

    const options = {
      onSuccess: () => {
        savedRef.current = true;
        pendingUploadRef.current = null;
        if (story?.image && story.image !== values.image) {
          void agency.uploads.delete({ key: story.image });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.admin.hervoice.list.pathKey(),
        });
        toast.success(story ? "Story updated" : "Story added");
        onClose();
      },
      onError: (error: { message: string }) => {
        toast.error(error.message || "Something went wrong");
      },
    };

    if (story) {
      updateStory.mutate({ id: story.id, ...payload }, options);
    } else {
      createStory.mutate(payload, options);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{story ? "Edit Story" : "Add Story"}</DialogTitle>
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
                  placeholder="Story title"
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
                  rows={2}
                  placeholder="Short excerpt shown on cards and metadata"
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Content (Markdown)</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  rows={14}
                  className="font-mono text-sm"
                  placeholder="Story body in markdown…"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        {/* Cover image */}
        <Controller
          control={form.control}
          name="image"
          render={({ field }) => (
            <Field>
              <FieldLabel>Cover image</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  {field.value && (
                    <div className="bg-muted flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                      <img
                        src={field.value}
                        alt="Cover"
                        className="h-full w-full object-cover"
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
                    {field.value ? "Change image" : "Upload image"}
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
              </FieldContent>
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="imageAlt"
            render={({ field }) => (
              <Field>
                <FieldLabel>Image alt / caption</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="Describes the image" />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="imageCredit"
            render={({ field }) => (
              <Field>
                <FieldLabel>Image credit</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="Photo source / attribution" />
                </FieldContent>
              </Field>
            )}
          />
        </div>

        {/* Author */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <Field>
                <FieldLabel>Author name</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="e.g. Z.H." />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="authorPosition"
            render={({ field }) => (
              <Field>
                <FieldLabel>Author position</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="Title / role" />
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="authorBio"
          render={({ field }) => (
            <Field>
              <FieldLabel>Author bio</FieldLabel>
              <FieldContent>
                <Textarea {...field} rows={3} placeholder="About the author" />
              </FieldContent>
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Controller
            control={form.control}
            name="authorInstagram"
            render={({ field }) => (
              <Field>
                <FieldLabel>Instagram</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="https://instagram.com/…" />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="authorFacebook"
            render={({ field }) => (
              <Field>
                <FieldLabel>Facebook</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="https://facebook.com/…" />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="authorLinkedin"
            render={({ field }) => (
              <Field>
                <FieldLabel>LinkedIn</FieldLabel>
                <FieldContent>
                  <Input {...field} placeholder="https://linkedin.com/in/…" />
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="messageToWorld"
          render={({ field }) => (
            <Field>
              <FieldLabel>Message to the world</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Text quote, or a video URL (https://…)"
                />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="hide"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              <FieldLabel className="font-normal">
                Hide from the public listing
              </FieldLabel>
            </Field>
          )}
        />

        <DialogFooter className="sticky bottom-0 mt-8 bg-white">
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
            {story ? "Save changes" : "Add story"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
