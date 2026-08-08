"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { EyeOff, Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import { agency } from "@/lib/agency-api";
import { CACHE_TAGS } from "@/services/cache/tags";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RevalidateButton } from "@/components/admin/revalidate-button";

import { HerVoiceForm } from "./hervoice-form";

type Story = RouterOutputs["admin"]["hervoice"]["list"][number];

export default function HerVoiceAdminPage() {
  const [addOpen, setAddOpen] = useState(false);

  const trpc = useTRPC();
  const { data: stories, isPending } = useQuery(
    trpc.admin.hervoice.list.queryOptions()
  );

  return (
    <div className="container">
      <h1>HerVoice</h1>
      <div className="mb-4 flex items-center justify-end gap-2">
        <RevalidateButton
          tag={CACHE_TAGS.hervoice}
          label="Publish"
          description="Update the live pages"
          subject="stories"
        />
        <Button onClick={() => setAddOpen(true)}>
          <Plus /> Add Story
        </Button>
      </div>
      {isPending ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {stories?.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
      {!isPending && stories?.length === 0 && (
        <p className="text-muted-foreground text-sm">No stories yet.</p>
      )}
      <HerVoiceForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

const StoryCard = ({ story }: { story: Story }) => {
  const trpc = useTRPC();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteStory = useMutation(
    trpc.admin.hervoice.delete.mutationOptions({
      onSuccess: () => {
        if (story.image) void agency.uploads.delete({ key: story.image });
        queryClient.invalidateQueries({
          queryKey: trpc.admin.hervoice.list.pathKey(),
        });
        toast.success("Story deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete story");
      },
    })
  );

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="bg-muted flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {story.image ? (
            <img
              src={story.image}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-xs">No image</span>
          )}
        </div>
        <div className="flex min-w-0 flex-col -space-y-0.5">
          <span className="flex items-center gap-2 truncate font-medium">
            {story.title}
            {story.hide && (
              <EyeOff className="text-muted-foreground size-3.5 shrink-0" />
            )}
          </span>
          <span className="text-muted-foreground truncate text-sm">
            {story.authorName ?? "Unknown author"} ·{" "}
            {format(new Date(story.createdAt), "MMM d, yyyy")}
          </span>
        </div>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
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
      </CardContent>

      <HerVoiceForm story={story} open={editOpen} onOpenChange={setEditOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{story.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteStory.isPending}
              onClick={() =>
                deleteStory.mutate(story.id, {
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              Delete story
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
