---
title: Deploying Next.js to Vercel
description: A practical guide to setting up Vercel deployments, environment variables, and preview environments for Next.js projects.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-03-14
---

## Why Vercel?

Vercel is built by the team that created Next.js. Deployments are zero-config — push to GitHub and your app is live in under a minute. Every pull request gets its own preview URL, making it easy for clients to review changes before they go live.

## Initial setup

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js and sets the build command to `next build`
4. Add your environment variables and deploy

That's it for a basic deployment.

## Environment variables

Never commit `.env` files. Set variables in the Vercel dashboard under **Settings → Environment Variables**. Scope them per environment:

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `DATABASE_URL` | Neon prod branch | Neon dev branch | Local |
| `NEXTAUTH_SECRET` | ✓ | ✓ | ✓ |
| `GOOGLE_CLIENT_ID` | ✓ | ✓ | — |

Pull them locally with the Vercel CLI:

```bash
pnpm dlx vercel env pull .env.local
```

## Preview deployments

Every branch and pull request gets a unique URL like `my-app-git-feature-xyz.vercel.app`. Share these with clients for sign-off before merging. Preview deployments use their own environment variable scope so they can point to a staging database.

## Custom domains

In **Settings → Domains**, add your domain and point the DNS records as instructed. Vercel handles SSL automatically via Let's Encrypt.

## Build output and caching

Next.js App Router uses a combination of static, dynamic, and streaming rendering. Vercel caches static pages at the edge globally. For ISR pages, set `revalidate`:

```ts
export const revalidate = 3600; // revalidate every hour
```

For on-demand revalidation after a CMS update:

```ts
import { revalidatePath } from "next/cache";
revalidatePath("/blog");
```

## Checklist before going live

- [ ] All env vars set in Vercel dashboard
- [ ] Custom domain added and DNS propagated
- [ ] Database connection pooling enabled (Neon supports this natively)
- [ ] `pnpm build` passes locally with no type errors
