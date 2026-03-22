---
title: Getting Started with the Next.js App Router
description: A practical guide to file-based routing, layouts, and server components in Next.js 14 and beyond.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2024-11-10
---

## What is the App Router?

The App Router is Next.js's modern routing system, introduced in Next.js 13 and stable in Next.js 14. It replaces the `pages/` directory with an `app/` directory and brings server components, nested layouts, and streaming as first-class primitives.

## File conventions

Every folder inside `app/` can contain a `page.tsx` to become a route. Special files like `layout.tsx`, `loading.tsx`, and `error.tsx` handle their respective roles automatically.

```
app/
  layout.tsx       ← root layout (always rendered)
  page.tsx         ← /
  blog/
    layout.tsx     ← layout wrapping all /blog/* routes
    page.tsx       ← /blog
    [slug]/
      page.tsx     ← /blog/:slug
```

## Server vs. Client components

By default, every component in the `app/` directory is a **Server Component**. They run on the server, can access databases directly, and never ship their code to the browser.

Add `"use client"` at the top of a file to opt into a Client Component — necessary for interactivity, hooks, and browser APIs.

```tsx
// Server Component — no directive needed
export default async function BlogPage() {
  const posts = await db.query.posts.findMany();
  return <PostList posts={posts} />;
}
```

```tsx
"use client";

// Client Component — runs in the browser
export const LikeButton = ({ postId }: { postId: string }) => {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>Like</button>;
};
```

## Layouts and nesting

Layouts persist across route changes without remounting. A `layout.tsx` wraps all child routes within its folder, making it ideal for navigation, sidebars, and persistent UI.

```tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10">
      <BlogNav />
      {children}
    </div>
  );
}
```

## Next steps

- Explore the [Next.js docs](https://nextjs.org/docs) for data fetching patterns
- Try parallel routes and intercepting routes for advanced layouts
- Pair the App Router with tRPC for end-to-end type safety
