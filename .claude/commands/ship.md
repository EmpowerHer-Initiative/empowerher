# /ship — Convention Check, TypeScript Build & Push to Production

You are a code quality guardian for this Next.js project. When the user runs `/ship`, follow every step below **in order** and stop if any step fails.

---

## Step 1 — Gather changed files

Run:

```bash
git diff --name-only HEAD
git diff --name-only --cached
```

Collect all `.ts` and `.tsx` files that are new or modified. These are the files you must inspect.

---

## Step 2 — Enforce coding conventions on every changed file

Read each file and check for **all three rules**. Fix violations **before** running the build. Do not ask the user — just fix them.

### Rule 1: Arrow functions only

- No bare `function` keyword for component definitions or utility functions.
- Replace `function MyFn(...)` with `const MyFn = (...) =>`.
- Exception: Next.js special exports like `generateMetadata`, `generateStaticParams`, route handlers (`GET`, `POST`, etc.) and middleware — leave those as-is.

### Rule 2: Named exports only (no `export default`)

- Replace `export default function Foo` → `export const Foo = (...) =>`
- Replace `export default Foo` at the bottom of a file → remove it; add `export` in front of the `const` declaration instead.
- Exception: Next.js page/layout/route files inside `app/` that Next.js requires a default export from — leave those as-is.

### Rule 3: File names must be kebab-case

- All file names (components, hooks, utilities) must use **kebab-case**.
- Convert the primary export name to kebab-case for the file name:
  - `UserCard` → `user-card.tsx`
  - `DataTable` → `data-table.tsx`
  - `useMyHook` → `use-my-hook.ts`
  - `Button` → `button.tsx`
- Never use PascalCase, camelCase, snake_case, or compound words without hyphens as file names.
- Never name a file `index.tsx` generically — use the descriptive kebab-case name instead.
- If a file name violates this rule, **rename it** with `git mv` and update every import that references the old name.

After fixing all violations, stage the changed files:

```bash
git add -A
```

---

## Step 3 — TypeScript type-check

Run:

```bash
pnpm typecheck
```

- If it **passes**: proceed to Step 4.
- If it **fails**: read the errors, fix them in the relevant files, re-stage with `git add -A`, and re-run `pnpm typecheck`. Repeat until it passes (maximum 3 attempts). If it still fails after 3 attempts, stop and explain the remaining errors to the user.

---

## Step 4 — Commit

```bash
git commit -m "$ARGUMENTS"
```

If `$ARGUMENTS` is empty, write a concise commit message yourself that summarises the changes (use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.).

---

## Step 5 — Push to production

```bash
git push origin main
```

Report success and list the files that were touched, grouped by: conventions fixed / type errors fixed / unchanged.

---

## Coding conventions summary (for reference)

| Rule      | Wrong                    | Right                       |
| --------- | ------------------------ | --------------------------- |
| Functions | `function Button(props)` | `const Button = (props) =>` |
| Exports   | `export default Button`  | `export const Button = ...` |

## File naming (for reference)

| Wrong                  | Correct              |
| ---------------------- | -------------------- |
| `button-comp.tsx`      | `button.tsx`         |
| `user_card.tsx`        | `user-card.tsx`      |
| `useMyHook.tsx`        | `use-my-hook.ts`     |
| `DataTableWrapper.tsx` | `data-table.tsx`     |
| `index.tsx` (generic)  | `component-name.tsx` |

Tech stack: Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · tRPC · Drizzle ORM · pnpm
