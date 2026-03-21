# Code Conventions

## File layout order

1. Imports
2. Types / constants
3. **Main exported component** (always before sub-components)
4. Local sub-components (below the main export)

## Component splitting

Keep everything in one file unless ALL three are true:

1. 200+ lines
2. Independent data fetching (its own `useQuery` to a different endpoint)
3. Meaningfully reusable or unrelated in concern

If multiple sub-components share one `useQuery` — keep them in the same file.

## Page files

Pages import and render section components only — no data fetching, no inline logic.

## UI components — always use shadcn

Always reach for an existing shadcn component before writing any custom UI. Never build a raw HTML element when a shadcn primitive covers it.

Available components in `@/components/ui/`:

`alert` · `alert-dialog` · `avatar` · `badge` · `button` · `card` · `checkbox` · `dialog` · `dropdown-menu` · `field` · `input` · `input-group` · `input-otp` · `label` · `select` · `separator` · `skeleton` · `sonner` · `spinner` · `table` · `textarea`

**Rules:**

- Use `Button` — never `<button>`
- Use `Input` — never `<input>`
- Use `Card` for any boxed content sections
- Use `Dialog` / `AlertDialog` for modals and confirmations
- Use `Skeleton` for loading states — never a custom spinner (use `Spinner` only for inline/button loading)
- Use `Badge` for status labels
- Use `DropdownMenu` for action menus
- If a component you need is not in the list, install it with `pnpm dlx shadcn@latest add <component>` — do not build it from scratch

## Tables

Always use `<DataTable>` from `@/components/data-table`. Never build a raw `<Table>`.
Columns go in a co-located `columns.tsx` file next to the page.

```
app/admin/products/
  page.tsx
  columns.tsx
```

## tRPC pattern

```tsx
const trpc = useTRPC();
const { data, isPending } = useQuery(trpc.router.procedure.queryOptions());
const createSomething = useMutation(trpc.router.procedure.mutationOptions());
// access: createSomething.mutate(), createSomething.isPending, createSomething.isError
```

Never call `fetch` directly. All internal data goes through tRPC.

## Forms

Always use React Hook Form + Zod. Never use uncontrolled inputs or `useState` for form state.

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

- Schema always defined with Zod, co-located with the form component
- Use `Field` + `Input` + `Label` from shadcn for form fields
- Submit button uses `isPending` from the mutation — show `<Spinner />` inside it

## Loading and error states

- Use `<Skeleton />` for initial data loading (page-level, list-level)
- Use `<Spinner />` only for inline actions (inside buttons, small inline areas)
- Never show a blank screen — always render a skeleton that matches the layout
- For errors: use `sonner` toast for transient errors, inline message for form validation errors

## Toasts (Sonner)

```tsx
import { toast } from "sonner";

toast.success("Saved");
toast.error("Something went wrong");
```

- Success actions → `toast.success`
- Failed mutations → `toast.error`
- Never use `alert()` or custom modal for transient feedback

## Color tokens

**Never use arbitrary Tailwind colors.** No `text-gray-500`, no `bg-blue-600`, no `text-red-400`. Always use shadcn CSS variable tokens. This is a hard rule — no exceptions.

If a color you need isn't in the list below, use the closest semantic token. Never invent a color.

| Token | Usage |
| ----- | ----- |
| `bg-background` / `text-foreground` | Page background and default text |
| `bg-card` / `text-card-foreground` | Card surfaces |
| `bg-popover` / `text-popover-foreground` | Popovers, dropdowns |
| `bg-primary` / `text-primary-foreground` | Primary actions, active state |
| `bg-secondary` / `text-secondary-foreground` | Secondary actions |
| `bg-muted` / `text-muted-foreground` | Subtle backgrounds, placeholder text, captions |
| `bg-accent` / `text-accent-foreground` | Hover states, highlights |
| `bg-destructive` / `text-destructive-foreground` | Errors, delete actions |
| `border` | Default borders |
| `ring` | Focus rings |
| `input` | Input borders |

**Examples:**

```tsx
// ✓ correct
<p className="text-muted-foreground" />
<div className="bg-card border" />
<button className="bg-primary text-primary-foreground" />
<span className="text-destructive" />

// ✗ wrong
<p className="text-gray-500" />
<div className="bg-white border-gray-200" />
<button className="bg-blue-600 text-white" />
<span className="text-red-500" />
```

## Coding rules

| Rule       | Wrong                         | Right                                                               |
| ---------- | ----------------------------- | ------------------------------------------------------------------- |
| Functions  | `function MyComp()`           | `const MyComp = () =>`                                              |
| Exports    | `export default function Foo` | `export const Foo = () =>` (except Next.js page/layout/route files) |
| File names | `UserCard.tsx`                | `user-card.tsx`                                                     |

## Before writing code

1. Read relevant existing files first — never assume what's there
2. Check if a shared component already exists before creating one
3. New admin data → add to `services/trpc/routers/admin/` using `adminProcedure`
4. Table UI → use `DataTable` + `columns.tsx`
