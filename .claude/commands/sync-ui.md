## Step 0 — Sync UI showcase

Before anything else, check whether `app/ui/page.tsx` is in sync with `components/ui/`.

1. List every file in `components/ui/` (e.g. `button.tsx`, `badge.tsx`, …).
2. Read `app/ui/page.tsx` and collect every component name that is already imported from `@/components/ui/*`.
3. For each file in `components/ui/` that is **not yet imported** in `app/ui/page.tsx`:
   - Read the component file to understand its props, variants, and sizes.
   - Add a new `Section` block to `app/ui/page.tsx` that demonstrates every variant, size, and notable state the component exposes — following the same `Section` / `Row` pattern already used in the file.
   - Add the required import at the top of the file.
4. If any components were added, run `pnpm typecheck` to confirm no errors before moving on.
5. If all components are already covered, skip this step silently.
