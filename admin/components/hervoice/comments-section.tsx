"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/services/trpc/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

export function CommentsSection({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const comments = useQuery(
    trpc.comments.getBlogComments.queryOptions({ slug })
  );

  const addComment = useMutation(
    trpc.comments.add.mutationOptions({
      onSuccess: () => {
        toast.success("Comment submitted — it will appear once approved.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add comment");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const from = (data.get("name") as string)?.trim();
    const message = (data.get("comment") as string)?.trim();
    if (!from || !message) return;

    addComment.mutate(
      { from, blogName: slug, message },
      { onSuccess: () => form.reset() }
    );
  };

  const list = comments.data ?? [];

  return (
    <section className="border-border/40 mt-20 border-t pt-16">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-5" />
        <h2 className="font-serif text-2xl md:text-3xl">
          Comments
          {list.length > 0 && (
            <span className="text-muted-foreground/60 ml-2 text-lg">
              {list.length}
            </span>
          )}
        </h2>
      </div>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          name="name"
          required
          minLength={3}
          maxLength={255}
          placeholder="Your name"
        />
        <Textarea
          name="comment"
          required
          minLength={3}
          maxLength={5000}
          rows={4}
          placeholder="Share your thoughts…"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={addComment.isPending}>
            {addComment.isPending ? <Spinner /> : "Post comment"}
          </Button>
        </div>
      </form>

      {/* List */}
      <div className="mt-12">
        {comments.isPending ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
            <Spinner /> Loading comments…
          </div>
        ) : comments.isError ? (
          <p className="text-destructive py-10 text-center text-sm">
            Couldn&apos;t load comments. Please try again later.
          </p>
        ) : list.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <ul className="space-y-8">
            {list.map((comment) => (
              <li key={comment.id} className="flex gap-4">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {initial(comment.from)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <p className="font-medium">{comment.from}</p>
                    <span className="text-muted-foreground/60 text-xs">
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
