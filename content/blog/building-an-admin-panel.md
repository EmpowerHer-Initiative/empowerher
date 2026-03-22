---
title: Building an Admin Panel with Next.js
description: Patterns for building a secure, well-structured admin panel — route protection, data tables, and role-based access with adminProcedure.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-03-20
---

## Structure

The admin panel lives under `app/admin/` and is protected at the middleware level. Each resource gets its own folder with a `page.tsx` and a `columns.tsx`:

```
app/admin/
  layout.tsx       ← sidebar + auth guard
  page.tsx         ← overview/dashboard
  users/
    page.tsx
    columns.tsx
  products/
    page.tsx
    columns.tsx
  orders/
    page.tsx
    columns.tsx
```

## Route protection

Guard the entire admin tree in middleware:

```ts
// middleware.ts
if (request.nextUrl.pathname.startsWith("/admin")) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
```

## adminProcedure

All admin data goes through tRPC using `adminProcedure`, which checks the session role server-side before executing:

```ts
// services/trpc/init.ts
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

```ts
// services/trpc/routers/admin/users.ts
export const usersRouter = router({
  list: adminProcedure.query(() => db.query.users.findMany()),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      db.delete(users).where(eq(users.id, input.id))
    ),
});
```

## DataTable

Always use the shared `<DataTable>` component. Columns go in `columns.tsx`:

```tsx
// app/admin/users/columns.tsx
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
```

```tsx
// app/admin/users/page.tsx
const UsersPage = () => {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(trpc.admin.users.list.queryOptions());

  if (isPending) return <Skeleton className="h-96 w-full" />;

  return <DataTable columns={columns} data={data ?? []} />;
};
```

## Key rules

- Never fetch directly from admin pages — always go through `adminProcedure`
- Never share admin routers with public-facing procedures
- Keep destructive actions behind `AlertDialog` for confirmation
- Use `Badge` for status labels, `DropdownMenu` for row actions
