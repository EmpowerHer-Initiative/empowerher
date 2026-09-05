---
name: email-setup
description: Set up transactional contact-form email and newsletter subscribe with Resend and/or useSend in any project (Astro, Next.js, Vite/Node). Use when adding email sending, a contact form backend, or newsletter signup.
---

# Email setup: Resend + useSend (contact form & newsletter)

Battle-tested recipe for wiring contact-form sending and newsletter subscribing with two interchangeable providers. Follow it exactly — the gotchas below were found the hard way and are already baked into the code.

## Provider rule

Two providers, selected by env vars at runtime:

- `RESEND_API_KEY` set → **Resend**. Always wins, even if useSend vars are also set.
- else `USESEND_API_KEY` set → **useSend** (`USESEND_URL` = self-hosted instance base URL; defaults to `https://app.usesend.com`).
- neither → provider is `null`. Routes return a clean "not configured" error. Never throw at module load.

## Env vars

```bash
# Email provider — set ONE of the two API keys. If both are set, Resend wins.

# Resend — https://resend.com/api-keys
RESEND_API_KEY=

# useSend — API key from the useSend dashboard; USESEND_URL is the base URL of a
# self-hosted instance (defaults to https://app.usesend.com when empty).
USESEND_API_KEY=
USESEND_URL=

# Newsletter list — one env for both providers: Resend segment id (optional,
# contacts are global) or useSend contact-book id (required for useSend).
NEWSLETTER_LIST_ID=

# Where contact-form submissions are delivered.
CONTACT_TO_EMAIL=

# Sender — REQUIRED, no fallback. Must be a domain verified with the active
# provider in production. onboarding@resend.dev works for testing on Resend.
# Format: "Name <addr@domain>".
CONTACT_FROM_EMAIL=
```

**Env vars must be read at RUNTIME, never inlined at build time.** A build-time read bakes the secret into the bundle AND ignores env changes on the deploy host.

- Astro: use `astro:env` with `context: "server", access: "secret"` — add every var to the `env.schema` block in `astro.config.mjs` via `envField.string({ context: "server", access: "secret", optional: true })`. Do NOT use `import.meta.env` for these (it inlines values into `dist/` at build).
- Next.js / Node / Vite SSR: plain `process.env`.
- Never expose any of these to the client (no `PUBLIC_` / `NEXT_PUBLIC_` prefix).

## Dependencies

```bash
pnpm add resend usesend-js zod lru-cache
# only if using a React email template for the notification HTML:
pnpm add @react-email/components @react-email/render
```

## `src/lib/email.ts`

Copy verbatim. Only the top import block differs per framework.

Astro env import:

```ts
import {
  CONTACT_FROM_EMAIL as CONTACT_FROM_EMAIL_ENV,
  CONTACT_TO_EMAIL as CONTACT_TO_EMAIL_ENV,
  NEWSLETTER_LIST_ID,
  RESEND_API_KEY,
  USESEND_API_KEY,
  USESEND_URL,
} from "astro:env/server";
```

Next.js / Node / Vite SSR equivalent:

```ts
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const USESEND_API_KEY = process.env.USESEND_API_KEY;
const USESEND_URL = process.env.USESEND_URL;
const NEWSLETTER_LIST_ID = process.env.NEWSLETTER_LIST_ID;
const CONTACT_TO_EMAIL_ENV = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL_ENV = process.env.CONTACT_FROM_EMAIL;
```

Body (identical everywhere):

```ts
import { Resend } from "resend";
import { UseSend } from "usesend-js";

export const emailProvider: "resend" | "usesend" | null = RESEND_API_KEY
  ? "resend"
  : USESEND_API_KEY
    ? "usesend"
    : null;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const usesend =
  !resend && USESEND_API_KEY
    ? new UseSend(USESEND_API_KEY, USESEND_URL || undefined)
    : null;

export const CONTACT_TO_EMAIL = CONTACT_TO_EMAIL_ENV || null;

// Required — no fallback. Handlers guard on it and refuse to send when unset.
export const CONTACT_FROM_EMAIL = CONTACT_FROM_EMAIL_ENV || null;

function errorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as { message?: string; error?: { message?: string } };
    const message = err.message ?? err.error?.message;
    if (message) return message;
  }
  return "Email provider returned an error.";
}

export interface SendEmailOptions {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  replyTo,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<{ error: string | null }> {
  const sender = from ?? CONTACT_FROM_EMAIL;
  if (!sender) {
    return { error: "CONTACT_FROM_EMAIL is not configured." };
  }

  const payload = {
    from: sender,
    to: [to],
    replyTo,
    subject,
    html,
  };

  try {
    if (resend) {
      const { error } = await resend.emails.send(payload);
      return { error: error ? errorMessage(error) : null };
    }
    if (usesend) {
      const { error } = await usesend.emails.send(payload);
      return { error: error ? errorMessage(error) : null };
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Unknown email provider error.",
    };
  }

  return { error: "No email provider configured." };
}

export const newsletterConfigured =
  emailProvider === "resend" ||
  (emailProvider === "usesend" && Boolean(NEWSLETTER_LIST_ID));

function isDuplicateError(message: string): boolean {
  return /already|duplicate/i.test(message);
}

export async function subscribeContact(
  email: string,
): Promise<{ error: string | null }> {
  try {
    if (resend) {
      const { error } = await resend.contacts.create({
        email,
        unsubscribed: false,
        ...(NEWSLETTER_LIST_ID
          ? { segments: [{ id: NEWSLETTER_LIST_ID }] }
          : {}),
      });
      if (!error) return { error: null };
      const message = errorMessage(error);
      return { error: isDuplicateError(message) ? null : message };
    }
    if (usesend && NEWSLETTER_LIST_ID) {
      const { error } = await usesend.contacts.create(NEWSLETTER_LIST_ID, {
        email,
        subscribed: true,
      });
      if (!error) return { error: null };
      const message = errorMessage(error);
      return { error: isDuplicateError(message) ? null : message };
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Unknown email provider error.",
    };
  }

  return { error: "Newsletter is not configured." };
}
```

## Known gotchas — do NOT "simplify" these away

1. **usesend-js error shape lies.** Its types claim `error: { code, message }` but the API actually returns nested `{ error: { error: { code, message } } }`. `errorMessage()` handles both shapes — without it, failed sends report success (`error.message` is undefined → falsy).
2. **Duplicate-detection regex is `/already|duplicate/i` ONLY.** Never add bare `exists` — "Contact book does not exist" would then be treated as a successful subscribe, silently swallowing every subscriber on a misconfigured list id.
3. **Resend `audienceId` is deprecated.** Contacts are global in Resend's current API; list membership goes through `segments: [{ id }]`. `NEWSLETTER_LIST_ID` is optional for Resend, required for useSend (it's the `contactBookId` positional arg).
4. **Provider clients are `null` until configured** so importing the module never throws — handlers check `emailProvider` / `newsletterConfigured` and return a clean error instead.

## `src/lib/rate-limit.ts`

Copy verbatim (dep: `lru-cache`):

```ts
import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Max 500 unique IPs
  ttl: 600_000, // Longest window used below
});

/**
 * Check if a key has exceeded the rate limit. Returns true if limited.
 */
export function isRateLimited(
  key: string,
  maxRequests = 5,
  windowMs = 600_000,
): boolean {
  const timeWindow = Math.floor(Date.now() / windowMs);
  const bucket = `${key}:${timeWindow}`;

  const current = rateLimitCache.get(bucket) || 0;

  if (current >= maxRequests) return true;

  rateLimitCache.set(bucket, current + 1);
  return false;
}

export function clientIp(request: Request, fallback?: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return fallback || "unknown";
}
```

Cache `ttl` must be >= the longest `windowMs` used, or counts reset early. In-memory = per-process; fine for one container per site.

## Hardening rules — non-negotiable for production sites

1. **Honeypot**: every form gets a hidden text input named `company` (`tabindex="-1" autocomplete="off" aria-hidden="true"` + hidden via CSS). Client includes its value in the POST body. Server: if `company` is non-empty → return fake `{ ok: true }` and send/subscribe NOTHING.
2. **Rate limit**: `isRateLimited(\`<route>:\${ip}\`)` before doing any work → 429 on limit. Default 5 requests / 10 min per IP per endpoint.
3. **Validation caps** (zod): name `.min(1).max(200)`, email `.max(320)` + email format, message `.min(10).max(5000)`. Validate server-side always — client validation is cosmetic.
4. **Never return provider error text to the browser.** `console.error` the real error server-side; respond with a generic "Could not send your message / Could not subscribe. Please try again later."

## Endpoints

### Astro — two API routes (`prerender = false`)

`src/pages/api/contact.ts`:

```ts
import { render } from "@react-email/render";
import type { APIRoute } from "astro";
import { z } from "zod";

import { ContactNotification } from "../../emails/contact-notification";
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  emailProvider,
  sendEmail,
} from "../../lib/email";
import { clientIp, isRateLimited } from "../../lib/rate-limit";
import { fail, json } from "../../lib/response";

export const prerender = false;

// Server-side validation mirrors the client; never trust the browser alone.
const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().max(320).pipe(z.email("A valid email is required.")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  // Honeypot — real users never see this field, bots fill it.
  company: z.string().optional(),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!emailProvider || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return fail(
      "NOT_CONFIGURED",
      "The contact form is not configured yet (missing RESEND_API_KEY or USESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL).",
      500,
    );
  }

  if (isRateLimited(`contact:${clientIp(request, clientAddress)}`)) {
    return fail(
      "RATE_LIMITED",
      "Too many requests. Please try again later.",
      429,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("BAD_REQUEST", "Invalid request body.", 400);
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION", parsed.error.issues[0].message, 400);
  }
  const { name, email, message, company } = parsed.data;

  // Honeypot tripped: pretend success, send nothing.
  if (company) {
    return json({ ok: true });
  }

  const html = await render(ContactNotification({ name, email, message }));

  const { error } = await sendEmail({
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `New contact message from ${name}`,
    html,
  });

  if (error) {
    console.error("[api/contact] send failed:", error);
    return fail(
      "SEND_FAILED",
      "Could not send your message. Please try again later.",
      502,
    );
  }

  return json({ ok: true });
};
```

`src/pages/api/newsletter.ts`:

```ts
import type { APIRoute } from "astro";
import { z } from "zod";

import { newsletterConfigured, subscribeContact } from "../../lib/email";
import { clientIp, isRateLimited } from "../../lib/rate-limit";
import { fail, json } from "../../lib/response";

export const prerender = false;

const NewsletterSchema = z.object({
  email: z.string().trim().max(320).pipe(z.email("A valid email is required.")),
  // Honeypot — real users never see this field, bots fill it.
  company: z.string().optional(),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!newsletterConfigured) {
    return fail(
      "NOT_CONFIGURED",
      "Newsletter is not configured yet (missing RESEND_API_KEY or USESEND_API_KEY, or NEWSLETTER_LIST_ID).",
      500,
    );
  }

  if (isRateLimited(`newsletter:${clientIp(request, clientAddress)}`)) {
    return fail(
      "RATE_LIMITED",
      "Too many requests. Please try again later.",
      429,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("BAD_REQUEST", "Invalid request body.", 400);
  }

  const parsed = NewsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION", parsed.error.issues[0].message, 400);
  }

  // Honeypot tripped: pretend success, subscribe nothing.
  if (parsed.data.company) {
    return json({ ok: true });
  }

  const { error } = await subscribeContact(parsed.data.email);
  if (error) {
    console.error("[api/newsletter] subscribe failed:", error);
    return fail(
      "SEND_FAILED",
      "Could not subscribe. Please try again later.",
      502,
    );
  }

  return json({ ok: true });
};
```

`fail`/`json` are tiny response helpers — `json(body, status)` wraps `new Response(JSON.stringify(body))`, `fail(code, message, status)` returns `{ error: { code, message } }`. Recreate them if the project doesn't have `src/lib/response.ts`.

### Next.js — server actions, no API routes needed

`"use server"` functions replace both routes; call the lib directly:

```ts
"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { newsletterConfigured, subscribeContact } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

const NewsletterSchema = z.object({
  email: z.string().trim().max(320).pipe(z.email("A valid email is required.")),
  company: z.string().optional(),
});

export async function subscribeAction(input: unknown) {
  if (!newsletterConfigured) return { error: "Newsletter is not configured." };

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(`newsletter:${ip}`))
    return { error: "Too many requests. Please try again later." };

  const parsed = NewsletterSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (parsed.data.company) return { ok: true }; // honeypot

  const { error } = await subscribeContact(parsed.data.email);
  if (error) {
    console.error("[newsletter] subscribe failed:", error);
    return { error: "Could not subscribe. Please try again later." };
  }
  return { ok: true };
}
```

Contact action: same skeleton, `ContactSchema` + `sendEmail` + rendered HTML. `clientIp(request)` from rate-limit.ts is for `Request`-based handlers; in server actions read headers via `next/headers` as above.

### Other Node servers (Express, Hono, Vite SSR…)

Same handler sequence in the framework's route syntax: configured-check → rate limit → parse → validate → honeypot → send/subscribe → generic error out, real error to logs.

## Verification checklist

Run against the built/running app (fake keys prove wiring without sending):

1. useSend-only fake key + list id → POST contact/newsletter → 502 with GENERIC message; server log shows the real provider error ("Invalid API token").
2. Both provider keys set (fake) → error text changes to Resend's ("API key is invalid") → proves Resend priority.
3. No provider env → `NOT_CONFIGURED`.
4. Body with `"company": "anything"` → `{ ok: true }` instantly, nothing sent.
5. 6th request from same IP inside 10 min → 429.
6. Oversize message (>5000 chars) / bad email → validation error.
7. Grep the build output for the API key value — must NOT appear (runtime env only).
8. Before first production use: one REAL send + one REAL subscribe with live keys; confirm inbox delivery and contact in the list.
