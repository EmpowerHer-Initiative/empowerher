import { useEffect, useRef, useState } from "react";

import { addComment, getComments, type Comment } from "../../lib/comments";

// Public comments for a HerVoice story. React island (client:load) that reads
// approved comments + submits new ones via src/lib/comments.ts → the admin
// app's public /api/comments route. `slug` is the full `/hervoice/<slug>` path
// (the stored `blogName`).

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

export default function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    comment?: string;
    form?: string;
  }>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let active = true;
    getComments(slug).then((result) => {
      if (!active) return;
      setLoading(false);
      if (!result.ok) {
        setLoadError(true);
        return;
      }
      setComments(result.comments);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const from = String(data.get("name") || "").trim();
    const message = String(data.get("comment") || "").trim();

    const nextErrors: typeof errors = {};
    if (from.length < 3) nextErrors.name = "Please enter your name (min 3 characters).";
    if (message.length < 3)
      nextErrors.comment = "Please write a comment (min 3 characters).";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    const result = await addComment({ from, slug, message });
    setSubmitting(false);

    if (!result.ok) {
      setErrors({
        form:
          result.error === "rate_limited"
            ? "Too many comments — please try again in a minute."
            : "Something went wrong. Please try again.",
      });
      return;
    }

    form.reset();
    setSubmitted(true);
  };

  return (
    <section className="border-border/40 mx-auto mt-20 max-w-3xl border-t pt-16">
      <h2 className="font-serif text-2xl md:text-3xl">
        Comments
        {comments.length > 0 && (
          <span className="text-muted-foreground/60 ml-2 text-lg">
            {comments.length}
          </span>
        )}
      </h2>

      {submitted && (
        <div className="border-border/40 bg-primary/[0.03] mt-8 rounded-2xl border p-6 text-sm">
          <p className="text-foreground font-medium">Thank you 🙏</p>
          <p className="text-muted-foreground mt-1">
            Your comment was submitted — it will appear once approved.
          </p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            maxLength={255}
            aria-invalid={errors.name ? "true" : undefined}
            className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 w-full rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none disabled:opacity-60"
          />
          {errors.name && <p className="text-destructive mt-2 text-xs">{errors.name}</p>}
        </div>
        <div>
          <textarea
            name="comment"
            rows={4}
            placeholder="Share your thoughts…"
            maxLength={5000}
            aria-invalid={errors.comment ? "true" : undefined}
            className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 w-full resize-y rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none disabled:opacity-60"
          />
          {errors.comment && (
            <p className="text-destructive mt-2 text-xs">{errors.comment}</p>
          )}
        </div>
        {errors.form && <p className="text-destructive text-xs">{errors.form}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60"
          >
            <SendIcon className="size-4" />
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        {loading ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Loading comments…
          </p>
        ) : loadError ? (
          <p className="text-destructive py-10 text-center text-sm">
            Couldn&apos;t load comments. Please try again later.
          </p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <ul className="space-y-8">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-4">
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {initial(comment.from)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <p className="font-medium">{comment.from}</p>
                    <span className="text-muted-foreground/60 text-xs">
                      {formatDate(comment.createdAt)}
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
