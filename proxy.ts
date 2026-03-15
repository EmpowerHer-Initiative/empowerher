import { NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "./services/auth/action";

export async function proxy(request: Request) {
  const nextRequest = request as NextRequest;
  const { pathname } = nextRequest.nextUrl;

  const betterAuthSession = await isAuthenticated();

  if (
    pathname !== "/login" &&
    pathname !== "/signup" &&
    pathname !== "/reset-password" &&
    !betterAuthSession &&
    pathname !== "/setup" &&
    pathname !== "/upgrade-app"
  ) {
    return NextResponse.redirect(new URL("/login", nextRequest.url));
  }

  if (
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/reset-password") &&
    betterAuthSession
  ) {
    const isMobile =
      nextRequest.nextUrl.searchParams.get("platform") === "mobile";
    if (isMobile) {
      return NextResponse.redirect(
        new URL("/mobile-auth-callback", nextRequest.url)
      );
    }

    return NextResponse.redirect(new URL("/", nextRequest.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
