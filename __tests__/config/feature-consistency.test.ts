import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

const config: Record<string, unknown> = JSON.parse(
  readFileSync(resolve(ROOT, "config/config.json"), "utf-8")
);

// Collect all feature keys from config (all top-level booleans)
function getConfigKeys(): string[] {
  return Object.keys(config).filter((key) => typeof config[key] === "boolean");
}

// Collect all flags referenced in route + tRPC guard maps
const ROUTE_GUARDS: Record<string, string[]> = {
  auth: ["app/(auth)/layout.tsx", "app/(marketing)/settings/layout.tsx"],
  contact: ["app/(marketing)/contact/page.tsx"],
  payments: [
    "app/checkout/page.tsx",
    "app/success/page.tsx",
    "app/admin/products/page.tsx",
  ],
  storage: ["app/admin/media/page.tsx"],
  cron: ["app/api/cron/route.ts"],
  email: ["services/email/index.ts"],
};

const TRPC_GUARDS: Record<string, string[]> = {
  contact: ["services/trpc/routers/contact.ts"],
  payments: [
    "services/trpc/routers/billing.ts",
    "services/trpc/routers/discounts.ts",
    "services/trpc/routers/products.ts",
  ],
  storage: ["services/trpc/routers/files.ts"],
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
      `Config flags with no guards: ${orphans.join(", ")}`
    ).toEqual([]);
  });

  it("every guarded flag exists in config.json", () => {
    const missing = [...allGuardedFlags].filter(
      (flag) => !configKeys.includes(flag)
    );
    expect(
      missing,
      `Guarded flags not in config.json: ${missing.join(", ")}`
    ).toEqual([]);
  });
});
