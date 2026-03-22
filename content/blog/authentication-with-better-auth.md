---
title: Authentication with Better Auth
description: Set up sign-in, sign-up, sessions, and OAuth providers in a Next.js app using Better Auth — without the lock-in.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-02-28
---

## What is Better Auth?

Better Auth is a TypeScript authentication library that runs entirely on your own infrastructure. No third-party service, no per-seat pricing, no vendor lock-in. You own the session data, the user records, and the OAuth tokens.

It integrates directly with Drizzle and Next.js App Router with minimal config.

## Server setup

```ts
// services/auth/index.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/services/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

## Route handler

Better Auth needs a single catch-all route to handle all auth endpoints:

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/services/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Reading the session

On the server, call `auth.api.getSession` directly:

```ts
import { auth } from "@/services/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/sign-in");
```

On the client, use the `authClient`:

```tsx
"use client";

import { authClient } from "@/services/auth/client";

const { data: session } = authClient.useSession();
```

## Sign-in and sign-out

```tsx
// sign in with email
await authClient.signIn.email({ email, password });

// sign in with Google
await authClient.signIn.social({ provider: "google" });

// sign out
await authClient.signOut();
```

## Protecting routes with middleware

```ts
// middleware.ts
import { auth } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/settings/:path*"] };
```
