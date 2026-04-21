import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

const config: Record<string, unknown> = JSON.parse(
  readFileSync(resolve(ROOT, "config/config.json"), "utf-8"),
);

// Collect all feature keys from config (top-level + nested)
function getConfigKeys(): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "boolean") {
      keys.push(key);
    } else if (typeof value === "object" && value !== null) {
      keys.push(key);
      for (const [child, childVal] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (child !== "enabled" && typeof childVal === "boolean") {
          keys.push(`${key}.${child}`);
        }
      }
    }
  }
  return keys;
}

// Collect all flags referenced in route + tRPC guard maps
// (same maps as the other test files — single source of truth would be better,
//  but keeping tests independent is more important)
const ROUTE_GUARDS: Record<string, string[]> = {
  auth: ["app/(auth)/layout.tsx"],
  blog: ["app/(marketing)/blog/layout.tsx"],
  settings: ["app/(marketing)/settings/layout.tsx"],
  contact: ["app/(marketing)/contact/page.tsx"],
  admin: ["app/admin/layout.tsx"],
  "admin.users": [
    "app/admin/users/page.tsx",
    "app/admin/users/[id]/page.tsx",
  ],
  "admin.products": ["app/admin/products/page.tsx"],
  "admin.media": ["app/admin/media/page.tsx"],
  payments: ["app/checkout/page.tsx", "app/success/page.tsx"],
  cron: ["app/api/cron/route.ts"],
  email: ["services/email/index.ts"],
};

const TRPC_GUARDS: Record<string, string[]> = {
  contact: ["services/trpc/routers/contact.ts"],
  discounts: ["services/trpc/routers/discounts.ts"],
  payments: ["services/trpc/routers/payments.ts"],
  "admin.products": ["services/trpc/routers/payments.ts"],
  upload: ["services/trpc/routers/upload/_index.ts"],
  admin: ["services/trpc/routers/admin/overview.ts"],
  "admin.media": ["services/trpc/routers/admin/media.ts"],
  "admin.users": ["services/trpc/routers/admin/users.ts"],
};

const allGuardedFlags = new Set([
  ...Object.keys(ROUTE_GUARDS),
  ...Object.keys(TRPC_GUARDS),
]);

const configKeys = getConfigKeys();

describe("feature flag consistency", () => {
  it("every config flag has at least one guard (route or tRPC)", () => {
    const orphans = configKeys.filter((key) => !allGuardedFlags.has(key));
    expect(
      orphans,
      `Config flags with no guards: ${orphans.join(", ")}`,
    ).toEqual([]);
  });

  it("every guarded flag exists in config.json", () => {
    const missing = [...allGuardedFlags].filter(
      (flag) => !configKeys.includes(flag),
    );
    expect(
      missing,
      `Guarded flags not in config.json: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
