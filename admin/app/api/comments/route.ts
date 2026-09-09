import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { addComment, getApprovedComments } from "@/services/comments";
import { corsHeaders } from "@/services/trpc/lib/allow-origin";
import { rateLimit } from "@/services/trpc/middleware/rate-limit";

// Public comments API used by the marketing site's HerVoice story pages.
// Middleware (proxy.ts) leaves /api unauthenticated; CORS is locked to the
// EmpowerHer origins via corsHeaders(). Comments are keyed by `blogName`, the
// full path `/hervoice/<slug>` (matches existing rows + the admin panel).
const postSchema = z.object({
  from: z.string().min(1).max(255),
  blogName: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug || slug.length > 255) {
    return NextResponse.json(
      { ok: false, error: "invalid_slug" },
      { status: 400, headers: cors },
    );
  }

  try {
    const comments = await getApprovedComments(slug);
    return NextResponse.json({ ok: true, comments }, { status: 200, headers: cors });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: cors },
    );
  }
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));

  try {
    // rateLimit throws a TRPCError when exceeded — map it to a 429.
    try {
      await rateLimit(1, 60);
    } catch {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429, headers: cors },
      );
    }

    const parsed = postSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400, headers: cors },
      );
    }

    // Status defaults to "pending" — moderation happens in the admin panel.
    await addComment(parsed.data);
    return NextResponse.json({ ok: true }, { status: 200, headers: cors });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: cors },
    );
  }
}
