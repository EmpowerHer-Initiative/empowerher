// HerVoice comments — talks to the admin app's public REST route
// (`/api/comments`). Reads approved comments and submits new ones (stored as
// pending until moderated). CORS is locked to the EmpowerHer origins
// server-side. Comments are keyed by `blogName` = the full `/hervoice/<slug>`
// path, matching existing rows + the admin moderation panel.
const ADMIN_API_URL = "https://admin.empowerher-initiative.org";
// const ADMIN_API_URL = "http://localhost:3000"; // for local dev, must match the admin app's port

export interface Comment {
  id: number;
  from: string;
  blogName: string;
  message: string;
  createdAt: string;
  status: string;
}

export type GetCommentsResult =
  { ok: true; comments: Comment[] } | { ok: false; error: string };

export type AddCommentResult = { ok: true } | { ok: false; error: string };

export async function getComments(slug: string): Promise<GetCommentsResult> {
  try {
    const res = await fetch(
      `${ADMIN_API_URL}/api/comments?slug=${encodeURIComponent(slug)}`,
    );
    const data = await res.json().catch(() => ({}) as Record<string, unknown>);

    if (!res.ok || !data.ok) {
      return { ok: false, error: String(data.error || "server_error") };
    }
    return { ok: true, comments: (data.comments as Comment[]) ?? [] };
  } catch {
    return { ok: false, error: "network_error" };
  }
}

export async function addComment(input: {
  from: string;
  slug: string;
  message: string;
}): Promise<AddCommentResult> {
  try {
    const res = await fetch(`${ADMIN_API_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: input.from,
        blogName: input.slug,
        message: input.message,
      }),
    });
    const data = await res.json().catch(() => ({}) as Record<string, unknown>);

    if (!res.ok || !data.ok) {
      return { ok: false, error: String(data.error || "server_error") };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
