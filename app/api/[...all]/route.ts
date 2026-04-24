import { NextResponse } from "next/server";
import { auth } from "@/services/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

import { isFeatureEnabled } from "@/config/features";

const disabledHandler = () =>
  NextResponse.json({ error: "Auth is disabled" }, { status: 404 });

const handler = isFeatureEnabled("auth")
  ? toNextJsHandler(auth)
  : { GET: disabledHandler, POST: disabledHandler };

export const { POST, GET } = handler;
