import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/services/auth/auth";

const handler = toNextJsHandler(auth);

export const GET = (req: NextRequest) =>
  handler.GET ? handler.GET(req) : new Response("Not Found", { status: 404 });

export const POST = (req: NextRequest) =>
  handler.POST ? handler.POST(req) : new Response("Not Found", { status: 404 });
