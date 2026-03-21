# Client Context

> This is a placeholder. When a real client is onboarded (via the `/client` command), replace this file with their specifics.

## Example Client Profile

**Business:** E-commerce store selling digital products or physical goods
**Technical level:** Non-technical — accesses only the admin panel, never reviews code
**Primary goal:** Sell products online, manage orders, track revenue from a simple dashboard
**Brand/tone:** Clean, minimal, professional — no heavy animations or cluttered UI

## What Claude should infer for any client

- The admin panel is for the **client** — keep it simple, clear labels, no jargon
- The storefront/landing page is for the **client's customers** — conversion-focused
- If the client only needs a subset of modules (e.g. landing page only, no auth/payments), those modules will be removed via the `/client` setup command — do not assume all modules are always active
- Never hardcode client-specific copy (business name, prices, product names) in shared template files — keep those in config or content files

## Module availability per client

| Module             | Optional        |
| ------------------ | --------------- |
| Landing page       | Always included |
| Auth (Better Auth) | Optional        |
| Payments (Stripe)  | Optional        |
| Admin panel        | Optional        |
| Blog / posts       | Optional        |
