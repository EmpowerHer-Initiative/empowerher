import { NextRequest } from "next/server";
import { auth } from "@/services/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = (req: NextRequest) =>
  handler.GET ? handler.GET(req) : new Response("Not Found", { status: 404 });

export const POST = (req: NextRequest) =>
  handler.POST ? handler.POST(req) : new Response("Not Found", { status: 404 });
