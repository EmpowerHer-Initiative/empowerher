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
      auth.ts        — sessions, reset-password
      users.ts       — user CRUD (self-service + admin)
      products.ts    — product catalog
      billing.ts     — checkout, subscriptions, invoices
      discounts.ts   — promotion codes
      files.ts       — upload/download + admin media
      contact.ts     — contact form
      verification.ts — verification tokens
      admin/         — dashboard overview stats
```

## Modules and optionality

The template contains all modules. Per-client setup strips what isn't needed:

- **Landing page** — always present
- **Auth** — optional (Better Auth)
- **Payments** — optional (Stripe via `billing.ts` + `products.ts` routers)
- **Admin panel** — optional
- **Blog/posts** — optional
- **Background jobs** — optional (Trigger.dev — see removal checklist below)

## Trigger.dev — Background jobs (optional)

All Trigger.dev code is intentionally isolated. Every file that belongs to it is marked with `// [TRIGGER.DEV]`.

### Structure

```
services/trigger/
  client.ts          — typed task exports + tasks helper (import from here in tRPC routers)
  tasks/             — one file per task, e.g. example-task.ts
trigger.config.ts    — root config (required by the CLI)
```

### How to add a task

1. Create `services/trigger/tasks/my-task.ts` and export a `task({ id, run })`.
2. Export the type from `services/trigger/client.ts`.
3. Trigger it from a tRPC router: `await tasks.trigger<typeof myTask>("my-task", payload)`.

### Removal checklist (for clients who don't need background jobs)

1. `rm -rf services/trigger/`
2. `rm trigger.config.ts`
3. `rm .mcp.json`
4. `pnpm remove @trigger.dev/sdk`
5. Remove `trigger:dev` and `trigger:deploy` scripts from `package.json`
6. Remove `TRIGGER_SECRET_KEY` from `.env` and `.env.example`
7. Remove any `tasks.trigger(...)` calls from tRPC routers

---

## Syncing template improvements to client projects

Each client repo has two remotes:

- `origin` — the client's own GitHub repo
- `template` — `github.com/alisamadiillc/clients` (this template)

### Pull a specific improvement

```bash
# 1. Fetch latest template commits
git fetch template

# 2. See what's new (adjust --since as needed)
git log template/main --oneline --since="2 weeks ago"

# 3. Cherry-pick only the commits that apply to this client
git cherry-pick <commit-sha>

# 4. Resolve any conflicts, then push
git push
```

### Rules

- **Cherry-pick, don't merge.** Never `git merge template/main` — it will pull in everything including modules this client doesn't use.
- Pick bug fixes and shared improvements (email service, auth, tRPC patterns) into every client.
- Skip feature-specific commits (new modules, client-specific schema changes).

---

## How to add backend logic

New data requirements → add a procedure in `services/trpc/routers/admin/` using `adminProcedure`. Never fetch directly from a component.
