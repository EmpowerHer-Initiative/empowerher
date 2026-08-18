import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { subscribeEmail } from "@/services/newsletter/subscribe";
import { corsHeaders } from "@/services/trpc/lib/allow-origin";
import { rateLimit } from "@/services/trpc/middleware/rate-limit";

// Public newsletter signup used by the marketing site's forms. Middleware
// (proxy.ts) leaves /api unauthenticated; CORS is locked to the EmpowerHer
// origins via corsHeaders().
const bodySchema = z.object({ email: z.email().max(255) });

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));

  try {
    // rateLimit throws a TRPCError when exceeded — map it to a 429.
    try {
      await rateLimit(5, "1m");
    } catch {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429, headers: cors },
      );
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400, headers: cors },
      );
    }

    const { alreadySubscribed } = await subscribeEmail(parsed.data.email);
    return NextResponse.json(
      { ok: true, alreadySubscribed },
      { status: 200, headers: cors },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: cors },
    );
  }
}
