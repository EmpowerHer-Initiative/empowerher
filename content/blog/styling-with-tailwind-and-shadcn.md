---
title: Styling with Tailwind CSS and shadcn/ui
description: How to combine Tailwind utility classes with shadcn component primitives for a consistent, maintainable design system.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-01-20
---

## The two-layer approach

Tailwind CSS gives you utility classes. shadcn/ui gives you accessible, unstyled component primitives built on Radix UI. Together, they form a design system where you own every pixel but don't build from scratch.

The key insight: **shadcn components use CSS variables for color**, so your entire color palette can be swapped by changing a few tokens in `globals.css`.

## Color tokens over arbitrary values

Never reach for `text-gray-500` or `bg-blue-600`. Use semantic tokens instead:

```tsx
// ✗ wrong — hardcoded, breaks dark mode, breaks theming
<p className="text-gray-500">Secondary text</p>
<div className="bg-white border-gray-200">Card</div>

// ✓ correct — respects the active theme
<p className="text-muted-foreground">Secondary text</p>
<div className="bg-card border">Card</div>
```

The token list:

| Token | Use |
|-------|-----|
| `bg-background` / `text-foreground` | Page surface and body text |
| `bg-card` / `text-card-foreground` | Card surfaces |
| `bg-muted` / `text-muted-foreground` | Subtle areas and captions |
| `bg-primary` / `text-primary-foreground` | CTAs and active states |
| `bg-destructive` | Errors and destructive actions |

## Composing with Card

Always use `Card` for boxed content. Never build a raw `div` with manual shadow and border classes.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PostCard = ({ title, description }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);
```

## Viewport height

Always use `dvh` units instead of `vh` to account for mobile browser chrome:

```tsx
// ✗ wrong
<div className="min-h-screen" />

// ✓ correct
<div className="min-h-dvh" />
```

## Equal dimensions

When width and height are the same, use `size-*`:

```tsx
// ✗ wrong
<div className="h-6 w-6" />

// ✓ correct
<div className="size-6" />
```

## Adding new components

If you need a component not already installed, add it from the shadcn registry — never build it from scratch:

```bash
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add calendar
```

The component lands in `components/ui/` and is immediately available as `@/components/ui/tooltip`.
