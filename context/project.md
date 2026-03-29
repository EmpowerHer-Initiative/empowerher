# Project Context — Agency Template (shadcn)

## What this is

A **reusable Next.js template** that Ali deploys for each new client via a Claude `/client` setup command. Clients get a tailored subset of modules — the template is built to have everything, then trimmed per project.

## Deployment

- **Host:** Vercel
- **DB:** Neon (PostgreSQL, serverless)
- **Package manager:** pnpm

## Tech Stack

| Layer         | Tech                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| Framework     | Next.js (App Router, Turbopack)                                         |
| Language      | TypeScript 5                                                            |
| Styling       | Tailwind CSS 4 + shadcn/ui (Base Nova) — uses **Base UI**, not Radix UI |
| API           | tRPC 11                                                                 |
| Data fetching | TanStack React Query 5                                                  |
| ORM           | Drizzle ORM                                                             |
| Database      | Neon PostgreSQL                                                         |
| Auth          | Better Auth                                                             |
| Validation    | Zod 4                                                                   |
| Forms         | React Hook Form                                                         |

## Key scripts

- `pnpm typecheck` — type-check without emitting
- `pnpm build` — full production build
- Always use `pnpm`, never `npm` or `yarn`

## App structure

```
app/
  (auth)/          — sign-in, sign-up, etc.
  (posts)/         — blog/content pages
  admin/           — admin panel (users, products, orders, overview)
  api/             — API route handlers
  settings/        — user settings
  page.tsx         — landing page root

components/
  admin/           — admin-specific components
  auth/            — auth forms/UI
  landing-page/    — landing page sections
  settings/        — settings UI
  ui/              — shadcn primitives
  data-table.tsx   — shared DataTable (always use this for lists)
  navbar.tsx       — top nav
  footer.tsx       — footer

services/
  auth/            — Better Auth config
  db/              — Drizzle schema + client
  email/           — email templates/sending
  trpc/
    routers/
      admin/       — admin-only procedures (adminProcedure)
      payments.ts  — Stripe-related procedures
      user.ts      — user procedures
```

## Modules and optionality

The template contains all modules. Per-client setup strips what isn't needed:

- **Landing page** — always present
- **Auth** — optional (Better Auth)
- **Payments** — optional (Stripe via `payments.ts` router)
- **Admin panel** — optional
- **Blog/posts** — optional

## How to add backend logic

New data requirements → add a procedure in `services/trpc/routers/admin/` using `adminProcedure`. Never fetch directly from a component.
