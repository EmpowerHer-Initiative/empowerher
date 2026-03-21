# Project Conventions

You are a senior developer on this Next.js project. Follow every rule below on every task, without being asked.

---

## File layout order

Within any component file, always order code in this sequence:

1. **Imports**
2. **Types / constants** (e.g. static data, format helpers)
3. **Main exported component** — always right after imports and constants
4. **Local sub-components** (e.g. `StatCard`, `SectionHeading`, column definitions) — always below the main export

The main export comes first so you immediately see the high-level structure of the file. Sub-components are implementation details — they live below.

**Wrong:**
```tsx
const StatCard = () => { ... };             // helpers at the top

export const AdminOverview = () => { ... }; // main component buried below
```

**Right:**
```tsx
const formatCurrency = ...;                 // utils / constants first

export const AdminOverview = () => { ... }; // main export second

const StatCard = () => { ... };             // local sub-components last
const SectionHeading = () => { ... };
const recentOrdersColumns = [...];
```

---

## When to split a component into its own file

**Do NOT split by default.** Keep everything in one file as long as it is readable and all the logic belongs together.

### The trigger for splitting is ALL of the following being true:

1. The file is getting long and hard to scan (rough guide: 200+ lines)
2. A component inside the file has its **own independent data fetching** (its own `useQuery` / `useMutation` call to a different endpoint)
3. That component is meaningfully reusable or completely unrelated in concern to the rest of the file

If a file has one `useQuery` and multiple sub-components that all render data from that single query — **keep them all in the same file**. Splitting them out would force artificial prop-drilling or duplicate network calls for no benefit.

### Wrong — splitting when there is one shared query:

```
overview-users.tsx       ← calls trpc.admin.overview.getStats
overview-revenue.tsx     ← calls trpc.admin.overview.getStats (duplicate!)
overview-orders.tsx      ← calls trpc.admin.overview.getStats (duplicate!)
```

### Right — keep it together:

```
overview.tsx   ← one useQuery, StatCard/SectionHeading as local components, all sections inline
```

### Right — split when genuinely independent:

```
user-profile.tsx       ← useQuery(trpc.admin.users.getById)
user-subscriptions.tsx ← useQuery(trpc.payments.getSubscriptions)
user-orders.tsx        ← useQuery(trpc.payments.getOrders)
```

### Local-only components stay local

Small presentational helpers (e.g. `StatCard`, `SectionHeading`) that are only used within one file should be defined in that file, not extracted. Extract only when used in 2+ files.

---

## Page files must stay thin

Pages only import and render section components. No data fetching, no logic, no JSX beyond layout structure.

**Wrong:**
```tsx
export default function AdminPage() {
  const trpc = useTRPC();
  const { data } = useQuery(...);
  return (
    <div>
      <h1>Overview</h1>
      {/* hundreds of lines */}
    </div>
  );
}
```

**Right:**
```tsx
import { AdminOverview } from "@/components/admin/overview";

export default function AdminPage() {
  return (
    <div className="container">
      <h1>Overview</h1>
      <AdminOverview />
    </div>
  );
}
```

---

## Table rule — always use `<DataTable>`

This project has a shared `DataTable` component at `@/components/data-table`. **Never** build a raw `<Table>` manually for listing data. Always use `DataTable`.

```tsx
// Option A — pass columns + data directly
<DataTable
  columns={columns}
  data={data ?? []}
  isLoading={isPending}
  onRowClick={(row) => router.push(`/admin/users/${row.original.id}`)}
/>

// Option B — pass a pre-built table instance
<DataTable table={tableInstance} isLoading={isPending} />
```

### Props

| Prop | Type | Notes |
|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | Define in a separate `columns.tsx` co-located with the page |
| `data` | `TData[]` | Always default to `[]` when data may be undefined |
| `isLoading` | `boolean \| number` | Pass `true` or a row count for the skeleton |
| `error` | `TRPCClientErrorBase \| null` | Optional — shown in empty state |
| `onRowClick` | `(row: Row<TData>) => void` | Optional — makes rows clickable |

### Columns file pattern

Define columns in a co-located `columns.tsx` file next to the page that uses them.

```
app/admin/products/
  page.tsx
  columns.tsx
```

---

## tRPC query pattern

Always use `useTRPC()` + `useQuery` / `useMutation`. Never call fetch directly.

```tsx
const trpc = useTRPC();
const { data, isPending } = useQuery(trpc.payments.getProducts.queryOptions());
const { mutate, isPending: isSaving } = useMutation(
  trpc.admin.users.update.mutationOptions()
);
```

---

## Coding conventions (always enforced)

| Rule | Wrong | Right |
|---|---|---|
| Functions | `function MyComp()` | `const MyComp = () =>` |
| Exports | `export default function Foo` | `export const Foo = () =>` — except Next.js page/layout/route files |
| File names | `UserCard.tsx`, `useMyHook.tsx` | `user-card.tsx`, `use-my-hook.ts` |

---

## Before writing any code

1. Read the relevant existing files first — never assume what's there.
2. Identify if a shared component already exists before creating a new one.
3. Ask: does this component have its own independent data fetching? If not, keep it in the same file.
4. If adding a new admin data requirement, add it to `services/trpc/routers/admin/` using `adminProcedure`.
5. If the task involves a table → use `DataTable` + a `columns.tsx` file.
