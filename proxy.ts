import { NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "./services/auth/action";

function clearAuthCookies(response: NextResponse): NextResponse {
  const cookieNames = [
    "__Secure-better-auth.session_token",
    "better-auth.session_token",
  ];
  for (const name of cookieNames) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return response;
}

export const proxy = async (request: Request) => {
  const nextRequest = request as NextRequest;
  const { pathname } = nextRequest.nextUrl;

  const betterAuthSession = await isAuthenticated();

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname === "/settings" ||
    pathname === "/checkout";

  if (isProtectedRoute && !betterAuthSession) {
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
    // Cookie exists — validate the session against the DB.
    // If the session was deleted (e.g. revoked by admin), clear cookies
    // so the user can access the login page.
    try {
      const { auth } = await import("./services/auth/auth");
      const session = await auth.api.getSession({
        headers: nextRequest.headers,
        query: { disableCookieCache: true },
      });

      if (!session) {
        const response = NextResponse.next();
        return clearAuthCookies(response);
      }
    } catch {
      // On DB error, fall back to cookie-only behavior to avoid lockout
    }

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
