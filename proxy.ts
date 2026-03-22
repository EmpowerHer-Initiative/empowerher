import { NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "./services/auth/action";

export const proxy = async (request: Request) => {
  const nextRequest = request as NextRequest;
  const { pathname } = nextRequest.nextUrl;

  const betterAuthSession = await isAuthenticated();

  if (
    (pathname.startsWith("/admin") || pathname === "/checkout") &&
    !betterAuthSession
  ) {
    let loginPath = `/login?callbackUrl=${pathname}`;
    if (pathname === "/checkout") {
      const productId = nextRequest.nextUrl.searchParams.get("productId");
      if (productId) loginPath += `&productId=${productId}`;
    }
    return NextResponse.redirect(new URL(loginPath, nextRequest.url));
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
    const callbackUrl = nextRequest.nextUrl.searchParams.get("callbackUrl");
    const destination =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";
    return NextResponse.redirect(new URL(destination, nextRequest.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
