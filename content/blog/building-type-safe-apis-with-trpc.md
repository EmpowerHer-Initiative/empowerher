---
title: Building Type-Safe APIs with tRPC
description: How to set up tRPC with Next.js App Router and TanStack Query for end-to-end type safety without code generation.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2024-12-05
---

## Why tRPC?

REST and GraphQL both require you to define a schema, generate types, and keep them in sync with your server. tRPC skips that entirely — your TypeScript types *are* the contract. If the server changes a procedure, the client breaks at compile time, not at runtime.

## Setting up the router

Define your procedures in a router file. Each procedure is a function that validates its input with Zod and returns typed data.

```ts
// services/trpc/routers/posts.ts
import { z } from "zod";
import { publicProcedure, router } from "../init";

export const postsRouter = router({
  list: publicProcedure.query(async () => {
    return db.query.posts.findMany({ orderBy: desc(posts.createdAt) });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.query.posts.findFirst({ where: eq(posts.id, input.id) });
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1), body: z.string() }))
    .mutation(async ({ input }) => {
      return db.insert(posts).values(input).returning();
    }),
});
```

## Querying on the client

With the `useTRPC` hook and TanStack Query, data fetching is declarative and fully typed.

```tsx
"use client";

const PostList = () => {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(trpc.posts.list.queryOptions());

  if (isPending) return <Skeleton className="h-40 w-full" />;

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

## Mutations

```tsx
"use client";

const CreatePost = () => {
  const trpc = useTRPC();
  const createPost = useMutation(trpc.posts.create.mutationOptions());

  return (
    <Button
      onClick={() => createPost.mutate({ title: "Hello", body: "World" })}
      disabled={createPost.isPending}
    >
      {createPost.isPending ? <Spinner /> : "Create post"}
    </Button>
  );
};
```

## Key benefits

- **Zero codegen** — types flow from server to client through TypeScript inference
- **Refactor-safe** — rename a procedure and every caller fails to compile
- **Colocation** — router files live next to the features they power
- **Streaming** — works with React Suspense and Next.js streaming out of the box
