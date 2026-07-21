# Payments & Polar

Full payment system: Polar integration, webhook handling, database schema, access control, and related hooks.

## Architecture Overview

```
Polar Dashboard ──► Webhooks ──► Better Auth Plugin ──► DB (products, orders, subscriptions)
                                                             │
User ──► authClient.checkout() ──► Polar Hosted Checkout ────┘
User ──► authClient.customer.portal() ──► Polar Customer Portal
```

## How It Works

1. **Products** — created/updated in Polar Dashboard, synced to local DB via `product.created`/`product.updated` webhooks
2. **Checkout** — initiated client-side via `authClient.checkout({ products: [productId] })`, redirects to Polar hosted page
3. **Orders** — created via `order.created` webhook when payment completes, stored in local `orders` table
4. **Subscriptions** — created/updated via `subscription.created`/`subscription.updated` webhooks
5. **Customer Portal** — accessed via `authClient.customer.portal()`, handles cancellations, plan changes
6. **Customer Linking** — Polar auto-creates customer on signup via `createCustomerOnSignUp: true`, links via `externalId = user.id`

## Database Schema

### products
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Polar product ID |
| name | text | |
| description | text | |
| priceAmount | integer | In cents |
| priceCurrency | text | Default "usd" |
| recurringInterval | enum | day/week/month/year |
| isRecurring | boolean | |
| isArchived | boolean | |
| trialInterval | enum | day/week/month/year |
| trialIntervalCount | integer | |
| metadata | jsonb | |

### subscriptions
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Polar subscription ID |
| userId | text | |
| email | text | |
| amount | integer | In cents |
| currency | text | |
| productId | text | FK to products |
| status | enum | SubscriptionStatus (active, trialing, past_due, canceled, unpaid, incomplete, incomplete_expired, paused) |
| recurringInterval | enum | day/week/month/year |
| cancelAtPeriodEnd | boolean | |
| trialStart/trialEnd | timestamp | |
| startedAt/canceledAt | timestamp | |
| customerCancellationReason | text | |
| metadata | jsonb | |

### orders
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Polar order ID |
| userId | text | |
| email | text | |
| productId | text | |
| billingName | text | |
| subscriptionId | text | |
| billingReason | enum | OrderBillingReason |
| totalAmount | integer | In cents |
| invoiceNumber | text | |
| status | enum | OrderStatus (paid, refunded) |
| discountAmount | integer | |
| metadata | jsonb | |

## Webhook Handlers (services/auth/auth-action.ts)

- `createProduct(data)` — inserts product from Polar webhook
- `updateProduct(data)` — updates product fields
- `createOrder(data)` — inserts order, links user via `customer.externalId`
- `updateOrder(data)` — updates order status/amounts
- `revokeSubscriptionOnRefund(subscriptionId)` — revokes via Polar API
- `deleteCustomer(data)` — deletes user by email
- `createSubscription(data)` — inserts subscription record
- `updateSubscription(data)` — updates subscription state

## tRPC Billing Router (services/trpc/routers/billing.ts)

- `getCustomerState` — returns active subscription + paid orders for current user
- `listSubscriptions` — user's subscriptions with product names
- `listOrders` — user's orders with product names
- `getSubscriptionDetails` — fetches live subscription from Polar API
- `cancelSubscription` — revokes subscription via Polar API
- `deleteCustomer` — deletes Polar customer + user record

## React Hooks (services/auth/hooks/use-payments.ts)

- `useGetCustomerState()` — subscription + orders state
- `useCheckout()` — calls `authClient.checkout({ products: [productId] })`
- `useGeneratePortalLink()` — calls `authClient.customer.portal()`
- `useCancelSubscription()` — calls tRPC `cancelSubscription`
- `useSubscriptionDetails(id)` — fetches subscription details

## Access Control (services/auth/hooks/use-access.ts)

- `hasPlan(key)` — check if user has specific plan by config key
- `hasPlanByProductId(productId)` — check by product ID
- `hasPlanOrHigher(key)` — tier comparison
- `hasSubscription` — any active subscription
- `hasProduct(key)` — one-time purchase check
- `hasProductByProductId(productId)` — one-time purchase by ID

## Environment Variables

- `POLAR_ACCESS_TOKEN` — Polar API access token
- `POLAR_WEBHOOK_SECRET` — webhook signing secret
- `POLAR_SERVER` — "sandbox" or "production"

## Key Flows

### Checkout
1. User clicks "Subscribe" → `useCheckout().mutate({ productId })`
2. `authClient.checkout({ products: [productId] })` redirects to Polar
3. User pays on Polar hosted page
4. Polar sends `order.created` + `subscription.created` webhooks
5. Handlers write to local DB
6. User redirected to `/success`

### Customer Portal
1. User clicks "Manage Billing" → `useGeneratePortalLink().mutate()`
2. `authClient.customer.portal()` redirects to Polar portal
3. User can cancel, update payment method, view invoices

### Cancellation
1. Via portal: user cancels in Polar portal → `subscription.updated` webhook fires
2. Via app: `useCancelSubscription().mutate({ subscriptionId })` → Polar API revoke
