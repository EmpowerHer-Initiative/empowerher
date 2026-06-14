# Full-Stack Next.js Template — Complete Reference

> A reusable, production-ready Next.js starter that Ali's agency deploys for each new client. Build everything once, trim per project. This document explains **every** feature, technology, convention, script, and provider abstraction in the template — and how to brief Claude to design a client landing page on top of it.

---

## Table of Contents

- [Full-Stack Next.js Template — Complete Reference](#full-stack-nextjs-template--complete-reference)
  - [Table of Contents](#table-of-contents)
  - [1. What This Template Is](#1-what-this-template-is)
  - [2. Tech Stack — Every Layer](#2-tech-stack--every-layer)
  - [3. End-to-End Type Safety](#3-end-to-end-type-safety)
  - [4. tRPC — The Easy Way to Work With APIs](#4-trpc--the-easy-way-to-work-with-apis)
    - [Procedure tiers (`services/trpc/init.ts`)](#procedure-tiers-servicestrpcinitts)
    - [The client-side pattern](#the-client-side-pattern)
    - [Routers (`services/trpc/routers/`)](#routers-servicestrpcrouters)
  - [5. Authentication (Better Auth)](#5-authentication-better-auth)
    - [Middleware (`proxy.ts`)](#middleware-proxyts)
    - [Auth API route](#auth-api-route)
    - [Client hooks (`services/auth/hooks/`)](#client-hooks-servicesauthhooks)
  - [6. Database (Drizzle + Neon)](#6-database-drizzle--neon)
    - [Tables](#tables)
  - [7. Payments (Polar)](#7-payments-polar)
    - [How it works](#how-it-works)
    - [Webhook handlers (`services/auth/auth-action.ts`)](#webhook-handlers-servicesauthauth-actionts)
    - [Access control (`services/auth/hooks/use-access.ts`)](#access-control-servicesauthhooksuse-accessts)
    - [Plan config (`config/plans.ts`)](#plan-config-configplansts)
    - [Payment hooks (`services/auth/hooks/use-payments.ts`)](#payment-hooks-servicesauthhooksuse-paymentsts)
  - [8. Email — One Place to Rule Them All](#8-email--one-place-to-rule-them-all)
    - [Provider: AWS SES (default)](#provider-aws-ses-default)
    - [Why "one place"](#why-one-place)
    - [Templates (`services/email/emails/`)](#templates-servicesemailemails)
    - [Local preview](#local-preview)
    - [Email health check — `pnpm sm → check-email`](#email-health-check--pnpm-sm--check-email)
  - [9. Storage / File Uploads (Cloudflare R2)](#9-storage--file-uploads-cloudflare-r2)
  - [10. Provider Abstraction Pattern](#10-provider-abstraction-pattern)
  - [11. Activity Logging](#11-activity-logging)
  - [12. Cron / Background Jobs](#12-cron--background-jobs)
  - [13. Developer Scripts (`pnpm sm`)](#13-developer-scripts-pnpm-sm)
  - [14. Every Page in the App](#14-every-page-in-the-app)
    - [Marketing — `app/(marketing)/` (headless, design these)](#marketing--appmarketing-headless-design-these)
    - [Auth — `app/(auth)/` (headless forms, working logic)](#auth--appauth-headless-forms-working-logic)
    - [Checkout / success](#checkout--success)
    - [Admin — `app/admin/` (full UI, do NOT strip)](#admin--appadmin-full-ui-do-not-strip)
    - [Infrastructure](#infrastructure)
    - [API routes — `app/api/`](#api-routes--appapi)
  - [15. Admin Panel](#15-admin-panel)
  - [16. Settings Pages](#16-settings-pages)
  - [17. Blog / Content System](#17-blog--content-system)
  - [18. Site Configuration](#18-site-configuration)
  - [19. UI System (shadcn + Base UI)](#19-ui-system-shadcn--base-ui)
  - [20. Code Conventions](#20-code-conventions)
    - [Automatic import ordering (on save / format)](#automatic-import-ordering-on-save--format)
  - [21. Claude Commands \& Skills](#21-claude-commands--skills)
  - [22. Module Optionality](#22-module-optionality)
  - [23. Environment Variables](#23-environment-variables)
  - [24. Testing \& Commit Gating](#24-testing--commit-gating)
    - [Git hooks (`.husky/`)](#git-hooks-husky)
    - [Invariant tests (`__tests__/`)](#invariant-tests-__tests__)
    - [End-to-end tests (Cypress)](#end-to-end-tests-cypress)
  - [25. Deployment](#25-deployment)
  - [26. How to Brief Claude to Design a Landing Page](#26-how-to-brief-claude-to-design-a-landing-page)

---

## 1. What This Template Is

A **headless** full-stack Next.js application. The backend (auth, payments, email, storage, tRPC API, database, admin panel, settings) is **fully built and production-ready**. The marketing-facing UI (landing page, navbar, footer, blog, auth forms, contact) is intentionally stripped to bare shells so every new client starts from a blank design slate.

- **One app** — single Next.js App Router project (not a monorepo). A sibling monorepo template exists separately.
- **Modular** — every feature (auth, payments, blog, storage, email, cron) can be removed per client by deleting its files, router imports, env vars, and dependencies.
- **Deployed to** Vercel, with a Neon serverless PostgreSQL database.

---

## 2. Tech Stack — Every Layer

| Layer           | Technology                                        | Notes                                                          |
| --------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Framework       | **Next.js 16**                                    | App Router, Turbopack dev server                               |
| Runtime         | **React 19**                                      | Server + client components                                     |
| Language        | **TypeScript 5/6**                                | Strict, end-to-end inference                                   |
| Styling         | **Tailwind CSS 4**                                | CSS-variable design tokens, `@theme inline`                    |
| UI primitives   | **shadcn/ui on Base UI**                          | **Base UI, NOT Radix** — no `asChild`, use `render` prop       |
| API             | **tRPC 11**                                       | Type-safe RPC, no REST boilerplate                             |
| Data fetching   | **TanStack React Query 5**                        | Via `@trpc/tanstack-react-query`                               |
| ORM             | **Drizzle ORM**                                   | `services/db/schema.ts` is the source of truth                 |
| Database        | **Neon PostgreSQL**                               | Serverless driver (`@neondatabase/serverless`)                 |
| Auth            | **Better Auth**                                   | Email/password + OTP + admin + bearer (mobile) + Polar plugins |
| Payments        | **Polar**                                         | **NOT Stripe.** Hosted checkout + customer portal + webhooks   |
| Validation      | **Zod 4**                                         | Shared schemas for forms + tRPC inputs                         |
| Forms           | **React Hook Form**                               | `@hookform/resolvers` + Zod resolver                           |
| Email render    | **React Email**                                   | `@react-email/components` — write emails as React              |
| Email send      | **AWS SES**                                       | `@aws-sdk/client-ses` + `nodemailer` (for attachments)         |
| Storage         | **Cloudflare R2**                                 | S3-compatible via `@aws-sdk/client-s3` + presigned URLs        |
| File upload UI  | **react-dropzone**                                | Never raw `<input type=file>`                                  |
| Tables          | **TanStack React Table 8**                        | Wrapped in shared `<DataTable>`                                |
| Content         | **content-collections**                           | MDX blog + legal pages, typed at build                         |
| URL state       | **nuqs**                                          | Type-safe search-param state                                   |
| Toasts          | **Sonner**                                        | `toast.success` / `toast.error`                                |
| Animation       | **motion** (Framer Motion) + `tailwindcss-motion` |                                                                |
| Theming         | **next-themes**                                   | Light/dark mode                                                |
| Icons           | **lucide-react** + custom SVG icons               |                                                                |
| Package manager | **pnpm**                                          | Never npm/yarn                                                 |
| Tests           | **Vitest** (unit) + **Cypress** (e2e)             | Runs in `prebuild`                                             |
| Git hooks       | **Husky** + **commitlint**                        | Conventional Commits enforced                                  |

---

## 3. End-to-End Type Safety

Type safety flows unbroken from the **database** to the **UI** with no manual type duplication:

```
Drizzle schema (services/db/schema.ts)
   │  inferred row/insert types
   ▼
tRPC routers (services/trpc/routers/*)
   │  inferRouterInputs / inferRouterOutputs
   ▼
AppRouter type (services/trpc/routers/_app.ts)
   │  imported by the client
   ▼
React components (useQuery / useMutation autocompletes inputs + outputs)
```

Concretely:

- **Schema → API:** Drizzle generates TypeScript types from `pgTable` definitions. Routers select/insert against those typed tables. Postgres enums (e.g. `SubscriptionStatus`, `OrderStatus`) are pulled straight from the Polar SDK into the schema, so the DB enum and the SDK can never drift.
- **API → Client:** `_app.ts` exports `AppRouter`, `RouterInputs`, and `RouterOutputs`. The React client imports only the **type** of the router — zero runtime coupling — and gets full autocomplete on every procedure's input and output.
- **Zod everywhere:** Procedure inputs are validated with Zod schemas. The same Zod schema can power a React Hook Form, so the form and the API share one definition. Invalid input is rejected before any handler runs.
- **Config is typed too:** `config/plans.ts` is generated `as const satisfies Record<...>`, producing literal `PlanKey` / `ProductKey` union types used by the access-control hooks.

If a column is renamed in the schema, TypeScript breaks the build everywhere that column is consumed — including UI components. That is the point.

---

## 4. tRPC — The Easy Way to Work With APIs

tRPC removes REST boilerplate entirely. There are no route files to write, no fetch calls, no manual response typing, no OpenAPI. You call backend procedures like local async functions and get full type inference.

### Procedure tiers (`services/trpc/init.ts`)

| Procedure                | Guarantees                                                  | Use for                                          |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| `baseProcedure`          | none                                                        | public endpoints (contact form, public products) |
| `authenticatedProcedure` | valid session, throws `UNAUTHORIZED` otherwise              | anything user-specific                           |
| `adminProcedure`         | session **and** `user.role === "admin"`, throws `FORBIDDEN` | all admin data                                   |
| `verificationProcedure`  | valid, non-expired verification record by id                | reset-password / verify flows                    |

The auth middleware also enforces a mobile rule: **bearer tokens are only allowed for the Expo mobile app** (`x-trpc-source: expo-react`); web must use session cookies. Sessions are fetched once and cached via React `cache()`.

### The client-side pattern

```tsx
const trpc = useTRPC();

// Query
const { data, isPending } = useQuery(trpc.users.list.queryOptions());

// Mutation
const createUser = useMutation(trpc.users.create.mutationOptions());
createUser.mutate({ email, name });
createUser.isPending; // drive button spinner
```

Rules: **never call `fetch` directly** for internal data — everything goes through tRPC. New backend data → add a procedure (admin data → `adminProcedure` in `services/trpc/routers/admin/`). Never fetch directly from a component.

### Routers (`services/trpc/routers/`)

Mounted in `_app.ts` under these namespaces:

- **`auth`** — sessions, reset-password, rate-limited login support
- **`contact`** — public contact form submission (rate-limited, emails the agency)
- **`users`** — user CRUD: self-service + admin management
- **`products`** — product catalog CRUD (synced from Polar)
- **`discounts`** — promotion-code verification
- **`payments`** — customer state, subscriptions, orders, cancellation, customer deletion
- **`files`** — upload/download presigned URLs + admin media browsing
- **`logs`** — activity-log querying (admin)
- **`verification`** — verification tokens
- **`admin`** (`admin/overview`) — dashboard overview stats

The `pnpm sm → list-routes` script prints every procedure with its access tier (base / authenticated / admin) and type (query / mutation).

---

## 5. Authentication (Better Auth)

Configured in `services/auth/auth.ts`. Plugins and features:

- **Email + password** with password reset (emails a reset link via the email service).
- **Email OTP verification** (`emailOTP` plugin) — overrides default email verification; sends a 6-digit code through the email service using the `verify-email` template.
- **Admin plugin** — role field on users, admin-only capabilities (ban, impersonate, force password change).
- **Bearer plugin** — token auth for the Expo mobile app.
- **Account linking** — Google trusted provider, links accounts across different emails (Google OAuth is scaffolded/commented, ready to enable).
- **Polar plugin** — registers checkout, customer portal, usage, and the full webhook handler set (see Payments).
- **`nextCookies`** — proper cookie handling in the App Router.
- **Session cookie cache** — 60-second cache to cut DB hits.
- **User deletion** enabled; users carry a typed `metadata` JSON field (e.g. `mustChangePassword`).
- **Database hooks** — on user create, links/creates the matching Polar customer by `externalId = user.id`.

### Middleware (`proxy.ts`)

Runs on every request. Protects `/admin`, `/settings`, `/checkout` (redirects to `/login?callbackUrl=…`, preserving `productId` for checkout). Redirects logged-in users away from auth pages. Validates the session against the DB and clears stale cookies if a session was revoked by an admin. **Heavy imports (auth, Polar, DB) are loaded dynamically inside the handler** to keep cold starts fast.

### Auth API route

`app/api/[...all]/route.ts` — the Better Auth catch-all handler.

### Client hooks (`services/auth/hooks/`)

`use-user`, `use-admin`, `use-access`, `use-payments`, `use-functions` — plus the `auth-client.ts` Better Auth client.

---

## 6. Database (Drizzle + Neon)

Schema: `services/db/schema.ts`. Client: `services/db/index.ts` (Neon serverless driver). Config: `drizzle.config.ts`.

### Tables

| Table            | Owner module | Purpose                                                  |
| ---------------- | ------------ | -------------------------------------------------------- |
| `user`           | auth         | id, name, email, role, ban fields, typed `metadata` JSON |
| `session`        | auth         | tokens, IP, user agent, impersonation                    |
| `account`        | auth         | OAuth/password credentials per provider                  |
| `verification`   | auth         | OTP / reset tokens with expiry                           |
| `product`        | payments     | catalog mirror of Polar products                         |
| `subscription`   | payments     | status enum from Polar SDK, trial/cancel fields          |
| `orders`         | payments     | one-time + recurring orders, invoice numbers             |
| `webhook_events` | payments     | raw Polar webhook payload log                            |
| `activity_log`   | logging      | email + data-change audit trail                          |

**Important:** Never run `db:push`, `db:migrate`, or `db:generate` — Ali runs all database commands himself. Edit the schema freely; do not apply it.

---

## 7. Payments (Polar)

**Polar, not Stripe.** Full flow documented in `context/payments.md`.

```
Polar Dashboard → Webhooks → Better Auth Polar plugin → DB (products, orders, subscriptions)
User → authClient.checkout() → Polar hosted checkout
User → authClient.customer.portal() → Polar customer portal
```

### How it works

1. **Products** created in the Polar Dashboard, synced to the local `product` table via `product.created` / `product.updated` webhooks.
2. **Checkout** initiated client-side with `authClient.checkout({ products: [productId] })`, redirects to Polar's hosted page.
3. **Orders** written on `order.created`; refunds handled on `order.refunded` (also revokes the linked subscription).
4. **Subscriptions** written/updated on `subscription.created` / `subscription.updated`.
5. **Customer portal** via `authClient.customer.portal()` for cancellations, plan changes, payment methods.
6. **Customer linking** — Polar customer linked to the user by `externalId = user.id`.

### Webhook handlers (`services/auth/auth-action.ts`)

`createProduct`, `updateProduct`, `createOrder`, `updateOrder`, `revokeSubscriptionOnRefund`, `deleteCustomer`, `createSubscription`, `updateSubscription`. Every raw payload is also stored in `webhook_events`.

### Access control (`services/auth/hooks/use-access.ts`)

A typed gate based on `config/plans.ts`:

- `hasPlan(key)` / `hasPlanByProductId(id)` — exact plan match (covers monthly + yearly).
- `hasPlanOrHigher(key)` — tier comparison (key order = price order from the sync script).
- `hasSubscription` — any active subscription.
- `hasProduct(key)` / `hasProductByProductId(id)` — one-time purchase checks.
- Helpers to fetch product IDs and display names by key.

### Plan config (`config/plans.ts`)

**Auto-generated** by `pnpm sm → sync-plans`, which reads active Polar products and groups `"{Plan} — Monthly"` / `"{Plan} — Yearly"` under one camelCase key. One-time products map by name. Produces literal `PlanKey` / `ProductKey` types. Never edit by hand.

### Payment hooks (`services/auth/hooks/use-payments.ts`)

`useGetCustomerState`, `useCheckout`, `useGeneratePortalLink`, `useCancelSubscription`, `useSubscriptionDetails`.

---

## 8. Email — One Place to Rule Them All

This is a core design goal of the template: **all email lives in `services/email/`, and the sending provider is swappable from one file.**

### Provider: AWS SES (default)

`services/email/index.ts` exports a single `email` object with `send` and `resend`. It lazily constructs one SES client from env vars and exposes a clean interface:

```ts
await email.send({
  to: "user@example.com",
  subject: "Verify your email",
  react: createElement(VerifyEmail, { verificationCode: otp }),
  attachments: [...], // optional — switches to nodemailer MailComposer + sendRawEmail
});
```

- Plain emails use SES `sendEmail`.
- Emails with attachments are composed with **nodemailer MailComposer** and sent via SES `sendRawEmail`.
- Every send is **logged to `activity_log`** (success or failure, with template name + props) via `services/log`.
- Templates are rendered to HTML with `@react-email/render`.

### Why "one place"

To switch providers (Resend, Loops, Postmark, etc.) you only rewrite the two functions inside `services/email/index.ts`. Every caller — Better Auth password reset, OTP verification, contact form, admin actions — imports the same `email.send(...)` and keeps working unchanged. The rest of the app never knows which provider sends mail.

> Ali's note: newer client templates lean on the recent **React Email** package for authoring these templates as React components — write the email like a component, render to HTML, hand the HTML to whichever provider is wired into `services/email/index.ts`.

### Templates (`services/email/emails/`)

`verify-email.tsx`, `reset-password.tsx`, `setup-account.tsx`, `contact-form.tsx`, all wrapped in a shared branded `components/layout.tsx` (logo, content card, footer with support/privacy/terms links — all driven by `siteConfig`). Template names are typed as `EmailTemplateName`. `render-template.ts` can render any template by name for previews/logging.

> Email templates are the one place that keeps `export default function` and may use `.PreviewProps` — required by React Email's preview server. Do **not** convert them to arrow functions or named exports.

### Local preview

`pnpm email:dev` runs the React Email preview server against `services/email/emails`.

### Email health check — `pnpm sm → check-email`

An interactive terminal TUI (arrow-key menu) that talks to the SES API to verify deliverability before going live:

1. **Account Status** — sending enabled, sandbox vs production, 24h send limit, send rate, remaining quota.
2. **Identity Verification Status** — which domains/addresses are verified (highlights the configured no-reply/support addresses).
3. **DKIM Status** — DKIM enabled + verification state, prints CNAME records to add if not yet verified.
4. **Send Test Email** — sends a real test email through the actual email service.
5. **Send Statistics** — last two weeks of sends, deliveries, bounces, complaints, rejects with totals.
6. **Check Specific Email/Domain** — verification status for any identity.
7. **List Email Templates** — registered templates + configured sender addresses.

Credentials and ARNs are redacted from any error output.

---

## 9. Storage / File Uploads (Cloudflare R2)

`services/storage/` wraps Cloudflare R2 (S3-compatible) via the AWS S3 SDK:

- `getUploadUrl` / `getDownloadUrl` — presigned URLs (default 5-min expiry).
- `getPublicUrl`, `deleteObject`, `listFiles` (paginated, with cursor) for the admin media browser.
- `normalizeKey` guards against path traversal and strips the public URL prefix.

tRPC routers: `files.ts` (upload/download URLs + admin media), `files-action.ts` (R2 delete helper). Upload UI uses **react-dropzone** via `hooks/use-upload.ts`.

> **Axios rule:** uploads PUT directly to the presigned R2 URL with **raw `axios`/`fetch`**, never the authed `api` instance — the `Authorization: Bearer` header would trigger CORS rejection on the presigned URL. Use the configured instance only for the own backend.

R2 CORS and SES IAM policies for new-project setup are in `README.md` and `context/aws-ses-setup.md`.

---

## 10. Provider Abstraction Pattern

Three services follow the same **swappable-provider** shape so a client can change a vendor without touching app code:

| Service             | Default provider | Public API (`index.ts`)                                                       | Implementation (`client.ts`) |
| ------------------- | ---------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| `services/email`    | AWS SES          | `email.send`, `email.resend`                                                  | SES + nodemailer             |
| `services/storage`  | Cloudflare R2    | `getUploadUrl`, `getDownloadUrl`, `getPublicUrl`, `deleteObject`, `listFiles` | S3 SDK                       |
| `services/payments` | Polar            | `cancelSubscription`, `getSubscriptionDetails`, `deleteCustomerByEmail`       | Polar SDK                    |

Each exposes a stable interface from `index.ts` and hides the vendor in `client.ts` + `types.ts`. `services/not-supported.ts` provides a `notSupported(fn)` helper so a provider that doesn't implement a capability fails loudly and explicitly rather than silently.

---

## 11. Activity Logging

`services/log/index.ts` writes to the `activity_log` table — a fire-and-forget audit trail (errors swallowed so logging never breaks a request). Two log types:

- **`email`** — every send/resend with recipient, subject, template, props, retry flag, and error.
- **`data_change`** — entity, entityId, action (create/update/delete), and a `from → to` diff of changed fields.

Surfaced in the admin panel at `app/admin/logs/` (queried via the `logs` tRPC router).

---

## 12. Cron / Background Jobs

A lightweight, dependency-free cron system (Trigger.dev is also supported but optional/isolated):

- **Registry:** `services/cron/index.ts` maps job names → async functions. Jobs live in `services/cron/jobs/`.
- **Endpoint:** `app/api/cron/route.ts` — `GET /api/cron?job=<name>`, protected by `Bearer ${CRON_SECRET}`. With no `job` param it runs all jobs.
- **Schedule:** `vercel.json` `crons` array (e.g. `/api/cron?job=example` hourly).
- **Visualizer:** `pnpm sm → list-crons` cross-checks `vercel.json` schedules against job files, flagging schedules without handlers and handlers without schedules.

---

## 13. Developer Scripts (`pnpm sm`)

`pnpm sm` (alias for `tsx scripts/run.ts`) opens an arrow-key menu of operational tools. All are colorized terminal TUIs. These run automatically in `predev`/`prebuild` (env, webhooks, plans) and on demand:

| Script             | What it does                                                                                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **check-env**      | Validates required env vars grouped by feature flag (`auth`, `cron`, `payments`, `storage`, `email`). Auto-creates `.env` from `.env.example`. Flags missing **and** untracked vars.                                          |
| **check-webhooks** | Syncs Polar webhook endpoints. Report mode (safe for hooks) or `--fix` (interactive): creates the endpoint, writes `POLAR_WEBHOOK_SECRET` to `.env`, enables locally-handled events. Parses handlers directly from `auth.ts`. |
| **check-email**    | AWS SES health check TUI (see [Email](#8-email--one-place-to-rule-them-all)).                                                                                                                                                 |
| **sync-plans**     | Regenerates `config/plans.ts` from active Polar products.                                                                                                                                                                     |
| **seed-products**  | Creates a standard set of test products (Starter/Pro/Business monthly+yearly, Lifetime Deal, Starter Kit) in Polar, then offers to sync plans.                                                                                |
| **list-routes**    | Prints all tRPC procedures grouped by router with access tier + query/mutation.                                                                                                                                               |
| **list-crons**     | Prints cron jobs and their Vercel schedules, flagging mismatches.                                                                                                                                                             |

Build pipeline: `predev`/`prebuild` run `check-env`, `check-webhooks`, `sync-plans`; `prebuild` additionally runs `vitest`. Other scripts: `pnpm typecheck`, `pnpm build`, `pnpm format`, `pnpm cy:open` / `cy:run`, `pnpm email:dev`.

---

## 14. Every Page in the App

Route groups under `app/`:

### Marketing — `app/(marketing)/` (headless, design these)

- **`page.tsx`** — landing page. **Single file with empty shell sections.** Sections are defined as components _inside this file_ (never split into `components/`). This is where client landing design happens.
- **`contact/`** — single-column contact form, working tRPC submission.
- **`features/`** — features page shell.
- **`blog/`** — listing (`page.tsx`) + detail (`[slug]/page.tsx`) + `layout.tsx`. Minimal markup, content from content-collections.
- **`(legal)/[...slug]/`** — privacy/terms from `content/legal/`.
- **`account-deleted/`** — plain confirmation page.
- **`settings/`** — settings shell (full working UI, see below).
- **`actions.tsx`**, **`layout.tsx`** — marketing layout + server actions.

### Auth — `app/(auth)/` (headless forms, working logic)

- **`login/`**, **`signup/`**, **`reset-password/`** — each a centered form (`*-form.tsx`) with React Hook Form + Zod + Better Auth. `layout.tsx` centers them.

### Checkout / success

- **`checkout/page.tsx`** — protected; kicks off Polar checkout.
- **`success/page.tsx`** — plain payment-status page (verification logic intact).

### Admin — `app/admin/` (full UI, do NOT strip)

- Overview, users (+ `[id]` detail with profile/payments), products, media, logs.

### Infrastructure

- **`layout.tsx`** (root, theme provider, providers), **`globals.css`** (design tokens — edit per client), **`not-found.tsx`**, **`robots.ts`**, **`sitemap.ts`**, **`ui/page.tsx`** (component showcase).

### API routes — `app/api/`

- **`[...all]/route.ts`** — Better Auth handler.
- **`trpc/[trpc]/route.ts`** — tRPC fetch adapter.
- **`cron/route.ts`** — cron runner.

---

## 15. Admin Panel

`app/admin/` — **fully built, working UI** (do not strip). Protected by middleware + `adminProcedure`.

- **Overview** (`page.tsx` + `components/admin/overview.tsx`) — dashboard stats via `admin/overview` router.
- **Users** (`users/`) — DataTable list + `[id]` detail page with: personal info, email addresses, social accounts, devices/sessions, password management, force-password-change, user metadata, and a payments tab (orders + subscriptions). Create-user dialog included.
- **Products** (`products/`) — DataTable of the Polar-synced catalog.
- **Media** (`media/`) — R2 file browser.
- **Logs** (`logs/`) — activity-log viewer with JSON formatting.
- **Chrome** — `admin-toolbar.tsx`, `navbar-admin.tsx`.

All admin tables use the shared `<DataTable>` with a co-located `columns.tsx`.

---

## 16. Settings Pages

`app/(marketing)/settings/` + `components/settings/` — **fully built, working UI** (do not strip):

- **General** — avatar upload, edit name/email.
- **Accounts** — linked social/OAuth accounts.
- **Billing** — subscriptions, orders, customer-portal link (Polar).
- **Danger zone** — account deletion.

---

## 17. Blog / Content System

Powered by **content-collections** (`content-collections.ts`), compiled at build:

- Two collections: **`blog`** (`content/blog/*.md`) and **`legal`** (`content/legal/*.md`).
- MDX pipeline: `remark-gfm`, `rehype-pretty-code` (syntax highlighting), `rehype-slug` + `rehype-autolink-headings`. Headings are extracted for TOC.
- Typed frontmatter via Zod; import the typed array (`import { allBlog } from "content-collections"`), render with `<MDXContent code={post.mdx} />`.
- Wired into Next via `@content-collections/next` in `next.config.mjs`. Static routes via `generateStaticParams`.
- Ships with 9 starter blog posts documenting the stack itself.

---

## 18. Site Configuration

`lib/site.ts` — **single source of truth for all client-specific values.** Drives metadata, social previews, page titles, email branding, navbar/footer, and landing content.

- `siteConfig` — name, description, contact/no-reply/support emails, `emailLogoUrl`, `emailPrimaryColor`, `companyName`, production `url`, `ogImage`, and per-page `pages` metadata (title + description).
- `agencyConfig` — hardcoded agency identity used for agency-sent emails (contact-form notifications). Never changes per client.

The file header carries an **onboarding checklist** (env, logo, OG image, favicon, theme colors, legal docs, email logo).

---

## 19. UI System (shadcn + Base UI)

shadcn primitives in `components/ui/`: `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `field`, `input`, `input-group`, `input-otp`, `label`, `popover`, `select`, `separator`, `skeleton`, `sonner`, `spinner`, `table`, `tabs`, `textarea`.

Shared custom components: `data-table.tsx`, `navbar.tsx`, `footer.tsx`, `pagination.tsx`, `theme-provider.tsx`, `user-control.tsx`, `image-placeholder.tsx`, `json-format.tsx`, `tab-line-animate.tsx`, plus `components/icons/` (logo + icon set).

**Critical:** This is **Base UI, not Radix.** No `asChild` — render a trigger as a button via the `render` prop:

```tsx
<AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
  <TrashIcon />
</AlertDialogTrigger>
```

Never modify files in `components/ui/` — they are the design-system primitives. If you need a custom interactive element, build it inline with raw HTML + Tailwind + CSS-variable tokens.

---

## 20. Code Conventions

Enforced across the codebase (`context/conventions.md`):

- **Arrow functions only** — never `function` (except `generateMetadata`, route handlers, middleware, email templates).
- **Named exports only** — no `export default` (except Next.js `app/` page/layout/route files and email templates).
- **kebab-case filenames** — `user-card.tsx`, never `UserCard.tsx` or generic `index.tsx`.
- **File layout order** — imports → types/constants → main exported component → local sub-components.
- **Component splitting** — keep one file unless all of: 200+ lines, independent data fetching, genuinely reusable. Popover/Dialog/AlertDialog logic goes in a co-located `Content` sub-component that only mounts when open.
- **Pages render sections only** — no data fetching or inline logic in page files.
- **Always shadcn** — `Button` not `<button>`, `Input` not `<input>`, `Card` for boxed content, `Skeleton` for loading (`Spinner` only inline), `Badge` for status, `DropdownMenu` for actions, `<DataTable>` for all tables (columns in co-located `columns.tsx`).
- **Forms** — React Hook Form + Zod resolver, co-located schema, `Field`/`Input`/`Label`, submit driven by mutation `isPending`.
- **Toasts** — Sonner only; never `alert()`.
- **Tailwind** — `dvh` not `vh`; `size-*` when width=height; `!` suffix at end; `cn()` from `@/lib/utils` for all conditional classes (never template literals).
- **Colors** — only shadcn CSS-variable tokens (`bg-background`, `text-muted-foreground`, `bg-primary`, etc.). **Never** arbitrary Tailwind colors like `text-gray-500`.
- **Rate limiting** — always `rateLimit()` from `services/trpc/middleware/rate-limit.ts` (presets `"30s"`–`"1h"` or seconds); `getIp()` for IP access. Never hand-roll with `Map`.
- **Middleware** — dynamic-import heavy modules in `proxy.ts`.
- **DB** — edit schema freely; never run DB commands.
- **Marketing exception** — on `app/(marketing)/page.tsx` you may use raw `<button>`/`<a>` + Tailwind instead of shadcn `Button`, to keep marketing design unconstrained.

### Automatic import ordering (on save / format)

Imports are **not** sorted by hand. The template uses **`@ianvs/prettier-plugin-sort-imports`** (plus `prettier-plugin-tailwindcss` for class sorting), so every time a file is formatted — on save, on `pnpm format`, and in the pre-commit hook — imports are re-grouped into a fixed **hierarchy**, with a blank line between each tier. The order is defined by `importOrder` in `.prettierrc`:

1. **React** — `react`, `react/*`
2. **Next.js** — `next`, `next/*`
3. **Third-party packages** — everything from `node_modules` (`@trpc/*`, `drizzle-orm`, `zod`, `better-auth`, …)
   — _blank line_ —
4. **Types & env** — `types`, `@/env`, `@/types/*`
   — _blank line_ —
5. **DB / helpers** — `*/helper`, `@/db`
   — _blank line_ —
6. **Internal infrastructure**, in this exact sub-order: `@/providers/*` → `@/emails/*` → `@/db/*` → `@/config/*` → `@/lib/*` → `@/hooks/*` → `@/services/*`
   — _blank line_ —
7. **Components** — `@/components/ui/*` then `@/components/*`
   — _blank line_ —
8. **Styles & app** — `@/styles/*`, `@/app/*`
   — _blank line_ —
9. **Relative imports** — anything starting with `./` or `../`

The idea: the further down an import sits, the _closer to this file_ it is. Framework and third-party packages live at the top; shared services, config, and hooks form their own labeled block in the middle; local components and relative siblings sit at the bottom. The result is that every file in the codebase reads the same way — you always know where to look for "what framework is this," "what shared service does this use," and "what local files does this touch." Contributors (and Claude) never argue about import order because the formatter is the single authority. Prettier settings also pinned here: 2-space tabs, semicolons, double quotes, ES5 trailing commas.

---

## 21. Claude Commands & Skills

Project-level slash commands in `.claude/commands/`:

- **`/design`** — the flagship 6-step client-design workflow. Reads scraped site data (`context/scrape.md`), builds a client profile (`context/client.md`), lets the user pick a design skill, updates `lib/site.ts` + `app/globals.css` brand tokens, maps the client sitemap to routes, then designs the landing page and every page from the scraped content — keeping all backend logic intact. Ends with `pnpm typecheck`.
- **`/scroll-prompt`** — generates a self-contained HTML file with AI image/video prompts for scroll-driven canvas animations (first frame / last frame / animation prompt).
- **`/sync-template`** — cherry-picks new commits from the `template` remote into a client repo (never merge — cherry-pick only).
- **`/sync-ui`** — keeps `app/ui/page.tsx` (component showcase) in sync with `components/ui/`.

`.claude/settings.json` pre-allows safe Bash commands (git, `pnpm typecheck/build/format`).

---

## 22. Module Optionality

Every feature can be removed per client (`context/modules.md`). To remove a module: delete its files, drop its router import from `_app.ts`, remove its env vars from `scripts/check-env.ts`, and uninstall its deps.

| Module                        | Always on?                       | Key deps                                    |
| ----------------------------- | -------------------------------- | ------------------------------------------- |
| Landing page                  | Yes                              | —                                           |
| Auth                          | Core (remove only for zero-auth) | `better-auth`                               |
| Payments                      | Optional                         | `@polar-sh/better-auth`, `@polar-sh/sdk`    |
| Admin panel                   | Optional                         | —                                           |
| Blog/posts                    | Optional                         | content-collections + rehype/remark plugins |
| Storage (R2)                  | Optional                         | `@aws-sdk/client-s3`, `react-dropzone`      |
| Email (SES)                   | Optional                         | `@aws-sdk/client-ses`, React Email          |
| Cron                          | Optional                         | —                                           |
| Background jobs (Trigger.dev) | Optional, isolated               | `@trigger.dev/sdk`                          |

---

## 23. Environment Variables

Grouped by feature in `scripts/check-env.ts` (validated on every dev/build):

```env
# auth
DATABASE_URL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_API_URL=
# (Google OAuth optional: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

# cron
CRON_SECRET=

# payments (Polar)
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=   # auto-written by check-webhooks --fix
POLAR_SERVER=           # sandbox | production

# storage (Cloudflare R2)
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# email (AWS SES)
AWS_BUCKET_ORIGIN=      # region, e.g. us-east-1
AWS_ACCESS_KEY_VALUE=
AWS_SECRET_KEY_VALUE=
```

---

## 24. Testing & Commit Gating

The template can't reach an inconsistent state — invariants are enforced by **Vitest unit tests that run on every commit** via a Husky pre-commit hook. If an invariant is violated, the commit is **blocked**.

### Git hooks (`.husky/`)

- **`pre-commit`** runs, in order:
  1. `pnpm format` (Prettier)
  2. `pnpm typecheck` (`tsc --noEmit`)
  3. `git add -u` (restage formatted files)
  4. `tsx scripts/check-env.ts` (env validation)
  5. `pnpm test` (Vitest) ← **blocks the commit if any test fails**
- **`commit-msg`** runs `commitlint` — enforces **Conventional Commits**.

The same checks gate the build: `prebuild` runs `check-env`, `check-webhooks`, `sync-plans`, then `vitest run`.

### Invariant tests (`__tests__/`)

**`__tests__/cron/cron-sync.test.ts` — cron ↔ Vercel sync.** Cross-checks the job files in `services/cron/jobs/` against the `crons` array in `vercel.json`. It asserts:

- every **job file** has a matching `vercel.json` cron entry (you wrote a handler but forgot to schedule it → fail);
- every **`vercel.json` entry** has a matching job file (you scheduled a job that has no handler → fail);
- neither side is empty.

So if you have a cron in Vercel without the exact corresponding job in the project (or vice-versa), the test throws and you **cannot commit** until they match. This is exactly the safety net the `list-crons` script visualizes — but enforced automatically.

**`__tests__/config/env-config-sync.test.ts` — env ↔ check-env sync.** Asserts every variable declared in `.env.example` is tracked in the `FEATURE_ENV_MAP` of `scripts/check-env.ts`. Add a new env var to `.env.example` without registering its feature → commit blocked.

### End-to-end tests (Cypress)

`cypress/e2e/` holds ~22 specs covering the real app: homepage, navbar, login, signup, reset-password, session + orphaned-session handling, checkout, success, settings, account-deleted, legal, blog, 404, UI showcase, and the full admin surface (overview, users, user-detail, products, media), plus a smoke test. Run with `pnpm cy:open` (interactive) or `pnpm cy:run` (headless). Config in `cypress.config.ts`; Vitest config (with the `@` alias) in `vitest.config.ts`.

> Takeaway: the project is **self-validating**. The pre-commit gate means a broken type, an unformatted file, a missing env registration, or a cron/Vercel mismatch is caught locally before it can land.

---

## 25. Deployment

- **Host:** Vercel (cron via `vercel.json`).
- **DB:** Neon serverless PostgreSQL.
- **Build:** `prebuild` validates env, syncs webhooks + plans, runs Vitest; then `next build`.
- **New-project setup:** apply the R2 CORS policy and SES IAM policy from `README.md` / `context/aws-ses-setup.md`; verify the client domain in SES (DKIM + TXT); set all env vars.

---

## 26. How to Brief Claude to Design a Landing Page

When handing this document to Claude to design a client landing page, Claude must respect the headless boundaries and conventions:

**Design these (headless shells):** `app/(marketing)/page.tsx` (define all sections _inside this one file_ — never create section files in `components/`), navbar, footer, blog, auth forms, contact, success, 404, account-deleted.

**Never touch:** `components/ui/` (shadcn primitives), backend logic (services, tRPC routers, API routes, Drizzle schema, auth config), admin pages, settings pages. Keep all `"use client"` directives, hooks, tRPC mutations, auth redirects, and form logic exactly as-is — only redesign JSX + Tailwind.

**Brand inputs:**

1. `lib/site.ts` — name, emails, URL, company, page metadata (add new `pages` entries for new routes).
2. `app/globals.css` — replace `:root` and `.dark` CSS-variable values with the client palette (oklch); keep variable names and `@theme`/`@layer` blocks intact.
3. `components/icons/logo.tsx` — client logo SVG.
4. `public/og-image.png`, `public/favicon.ico` — social preview + favicon.
5. `content/legal/privacy.md` + `terms.md` — client legal entity.
6. `emailLogoUrl` in `lib/site.ts` — client white logo on CDN.

**Design rules Claude must follow:**

- Use only shadcn primitives from `components/ui/`; for anything custom, build inline with raw HTML + Tailwind + CSS-variable tokens (`bg-[var(--primary)]`).
- `lucide-react` for icons; `siteConfig` for all brand text.
- Color tokens only — never arbitrary Tailwind colors.
- `dvh` not `vh`; `size-*` for equal width/height; `cn()` for conditional classes.
- Make all contact info clickable (maps link / `tel:` / `mailto:`).
- Use the `ImagePlaceholder` component (`components/image-placeholder.tsx`) for any image without a real URL — it renders a placeholder with an AI-prompt dialog (contextual prompt + aspect ratio).
- After designing, run `pnpm typecheck` and fix only import/prop/JSX issues (never change logic to satisfy types).

For the full automated flow, run **`/design`** — it scrapes, profiles, picks a design skill, updates brand config, maps routes, and designs every page from the client's actual content.

---

_This template is the product of significant invested time and is intentionally reusable. Build once, trim per client, ship fast._
