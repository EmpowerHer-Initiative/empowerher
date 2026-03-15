import { NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "./services/auth/action";

export async function proxy(request: Request) {
  const nextRequest = request as NextRequest;
  const { pathname } = nextRequest.nextUrl;

  const betterAuthSession = await isAuthenticated();

  if (pathname.startsWith("/admin") && !betterAuthSession) {
    return NextResponse.redirect(new URL("/login", nextRequest.url));
  }

  const hasVerifyEmailInParams =
    nextRequest.nextUrl.searchParams.has("verify-email");
  if (
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/reset-password") &&
    betterAuthSession &&
    !hasVerifyEmailInParams
  ) {
    return NextResponse.redirect(new URL("/", nextRequest.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
