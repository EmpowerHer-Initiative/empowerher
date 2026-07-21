import "server-only";

import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "./routers/_app";

function getApiUrl(): string {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${base}/api/trpc`;
}

/**
 * Creates a tRPC client that calls the API via HTTP with the given headers forwarded.
 * Use this for server-side calls when the API lives on a different app (e.g., admin → dashboard).
 * Forwards cookies so the API can verify the session.
 */
export function createHttpCaller(headers: Headers) {
  const cookie = headers.get("cookie");

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getApiUrl(),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              ...(cookie ? { Cookie: cookie } : {}),
            },
            credentials: "include",
          });
        },
      }),
    ],
  });
}
