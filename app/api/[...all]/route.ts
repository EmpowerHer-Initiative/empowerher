import { NextRequest, NextResponse } from "next/server";

import { isFeatureEnabled } from "@/config/features";

const disabledHandler = () =>
  NextResponse.json({ error: "Auth is disabled" }, { status: 404 });

async function handleRequest(req: NextRequest) {
  const { auth } = await import("@/services/auth/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const handler = toNextJsHandler(auth);
  return handler.GET ? handler.GET(req) : disabledHandler();
}

export const GET = isFeatureEnabled("auth")
  ? (req: NextRequest) => handleRequest(req)
  : disabledHandler;

export const POST = isFeatureEnabled("auth")
  ? (req: NextRequest) => {
      return import("@/services/auth/auth").then(({ auth }) =>
        import("better-auth/next-js").then(({ toNextJsHandler }) => {
          const handler = toNextJsHandler(auth);
          return handler.POST ? handler.POST(req) : disabledHandler();
        })
      );
    }
  : disabledHandler;
