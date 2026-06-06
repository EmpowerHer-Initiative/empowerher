# Module Map

Every optional module is listed here with everything it owns. To remove a module from a client project, delete its files, remove its router imports from `_app.ts`, remove its env vars from `scripts/check-env.ts`, and uninstall its dependencies.

---

## Auth

> Core — only remove if the client needs zero authentication.

**Files**

- `services/auth/` — entire directory
- `app/(auth)/` — login, signup, reset-password pages
- `app/settings/` — user settings pages
- `app/account-deleted/page.tsx`
- `components/auth/`
- `app/api/[...all]/route.ts` — Better Auth API handler

**tRPC routers**

- `services/trpc/routers/auth.ts` — sessions, reset-password, rate-limit
- `services/trpc/routers/users.ts` — user CRUD (self-service + admin)
- `services/trpc/routers/verification.ts` — verification tokens

**Schema tables** (`services/db/schema.ts`)

- `user`, `session`, `account`, `verification`

**Env vars**

- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Dependencies**

- `better-auth`

---

## Payments

> Optional. Remove for clients who don't sell anything.

**Files**

- `services/trpc/routers/billing.ts` — checkout, subscriptions, invoices, customer
- `services/trpc/routers/products.ts` — product catalog CRUD
- `services/trpc/routers/discounts.ts` — promotion code verification
- `app/checkout/page.tsx`
- `app/success/page.tsx`
- `app/admin/products/page.tsx`
- `app/admin/products/columns.tsx`
- `components/settings/billing/`

**Schema tables** (`services/db/schema.ts`)

- `products`, `subscription`, `invoices`, `webhookEvents`

**Touches**

- `services/auth/auth.ts` — Polar plugin registration
- `services/auth/auth-action.ts` — webhook sync handlers
- `services/auth/hooks/use-payments.ts`
- `services/trpc/routers/_app.ts` — `billingRouter`, `productsRouter` imports

**Env vars**

- `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_SERVER`

**Dependencies**

- `@polar-sh/better-auth`, `@polar-sh/sdk`

---

## Blog / Posts

> Optional. Remove for clients who don't need a blog or content section.

**Files**

- `app/blog/` — entire directory (or `app/(posts)/` depending on route group name)
- `content/blog/` — markdown source files
- `content-collections.ts` — remove or strip the blog collection

**Schema tables**

- None (file-based, no DB)

**Touches**

- `components/navbar.tsx` — blog link in nav
- `next.config.mjs` — `@content-collections/next` plugin

**Dependencies** (devDependencies)

- `@content-collections/core`, `@content-collections/mdx`, `@content-collections/next`
- `rehype-autolink-headings`, `rehype-pretty-code`, `rehype-slug`
- `remark-gfm`
- `mdast-util-from-markdown`, `mdast-util-to-string`, `unist-util-visit`

---

## Storage (R2)

> Optional. Remove for clients who don't upload files or images.

**Files**

- `services/trpc/routers/files.ts` — upload/download URLs + admin media browsing
- `services/trpc/routers/files-action.ts` — R2 delete helper
- `services/trpc/lib/r2.ts`
- `app/admin/media/page.tsx`

**Touches**

- `services/trpc/routers/_app.ts` — `filesRouter` import

**Env vars**

- `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

**Dependencies**

- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `react-dropzone`

---

## Email (AWS SES)

> Optional. Remove for clients who use a third-party tool (e.g. Resend, Loops) or no email at all.

**Files**

- `services/email/` — entire directory

**Touches**

- `services/auth/auth.ts` — `emailService.send({ ... })` calls for password reset and email verification

**Env vars**

- `AWS_BUCKET_ORIGIN`, `AWS_ACCESS_KEY_VALUE`, `AWS_SECRET_KEY_VALUE`

**Dependencies**

- `@aws-sdk/client-ses`, `@react-email/components`, `@react-email/render`

**devDependencies**

- `react-email`, `@react-email/preview-server`

**Scripts**

- `email:dev`
