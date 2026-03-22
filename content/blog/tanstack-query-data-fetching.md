---
title: Data Fetching with TanStack Query
description: How TanStack Query handles caching, background refetching, and optimistic updates to make your UI feel instant.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-03-18
---

## What TanStack Query does

TanStack Query (formerly React Query) manages server state — data that lives on a remote server and needs to be fetched, cached, and kept in sync. It handles loading states, error states, background refetching, and cache invalidation so you don't have to.

In this stack, it's paired with tRPC so every procedure gets full query/mutation support with zero configuration.

## useQuery

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/services/trpc/client";

const PostList = () => {
  const trpc = useTRPC();
  const { data, isPending, isError } = useQuery(
    trpc.posts.list.queryOptions()
  );

  if (isPending) return <Skeleton className="h-40 w-full" />;
  if (isError) return <p className="text-destructive">Failed to load posts.</p>;

  return (
    <ul className="flex flex-col gap-4">
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

## useMutation with cache invalidation

After a mutation succeeds, invalidate the relevant query so the list refreshes automatically:

```tsx
const trpc = useTRPC();
const queryClient = useQueryClient();

const deletePost = useMutation(
  trpc.posts.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.posts.list.queryKey() });
      toast.success("Post deleted");
    },
    onError: () => toast.error("Something went wrong"),
  })
);
```

## Optimistic updates

For instant UI feedback before the server responds:

```tsx
const toggleLike = useMutation(
  trpc.posts.toggleLike.mutationOptions({
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: trpc.posts.list.queryKey() });
      const previous = queryClient.getQueryData(trpc.posts.list.queryKey());
      queryClient.setQueryData(trpc.posts.list.queryKey(), (old) =>
        old?.map((p) => p.id === postId ? { ...p, liked: !p.liked } : p)
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(trpc.posts.list.queryKey(), ctx?.previous);
    },
  })
);
```

## Prefetching on the server

Prefetch queries in a Server Component and pass the dehydrated state to the client to avoid a loading flicker:

```tsx
// app/posts/page.tsx (Server Component)
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { createQueryClient } from "@/services/trpc/query-client";

export default async function PostsPage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery(trpc.posts.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
```

The client hydrates instantly with data already in the cache — no loading spinner on first paint.
