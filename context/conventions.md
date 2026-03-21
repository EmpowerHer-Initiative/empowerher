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
const { mutate } = useMutation(trpc.router.procedure.mutationOptions());
```

Never call `fetch` directly. All internal data goes through tRPC.

## External API pattern (Axios)

For external APIs (non-tRPC), use the shared `api` axios instance and `ApiRoutes` route builder.

**Files live in `lib/`:**

- `lib/api.ts` — axios instance + auth interceptor
- `lib/api-routes.ts` — `ApiRoutes` route builder object

**`lib/api.ts` shape:**

```ts
import axios from "axios";
import { getSessionToken } from "./action";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**`lib/api-routes.ts` shape:**

```ts
export const ApiRoutes = {
  resource: {
    list: () => `/resource`,
    get: (id: string) => `/resource/${id}`,
    create: () => `/resource`,
    update: (id: string) => `/resource/${id}`,
    delete: (id: string) => `/resource/${id}`,
  },
};
```

**Rules:**

- Never call `axios.get/post/...` directly — always use the `api` instance
- Never hardcode URL strings at the call site — always use `ApiRoutes`
- Route builders are plain functions that return strings — no logic, no fetch calls inside them
- Query params go through a shared `appendQueryParams(path, params)` util

## Forms

Always use React Hook Form + Zod. Never use uncontrolled inputs or `useState` for form state.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
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

Use semantic Tailwind tokens — never raw colors like `text-gray-500`.

| Intent       | Token                                      |
| ------------ | ------------------------------------------ |
| Primary UI   | `bg-primary` / `text-primary`             |
| Subtle text  | `text-muted-foreground`                   |
| Backgrounds  | `bg-muted` / `bg-card` / `bg-background` |
| Borders      | `border` / `border-border`                |
| Danger       | `text-destructive` / `bg-destructive`     |
| Success      | `text-green-600` (no semantic token yet)  |

Always use `bg-card` for card surfaces, `bg-muted` for subtle section backgrounds.

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
