/**
 * Sync Plans — fetches all active Polar products and generates config/plans.ts
 *
 * Polar product naming convention:
 * - Subscription plans: "{Plan} — Monthly" and "{Plan} — Yearly" (e.g. "Starter — Monthly")
 *   The script strips "— Monthly/Yearly" and groups both under a single key (e.g. "starter")
 * - One-time products: just the name (e.g. "Lifetime Deal" → "lifetimeDeal")
 *
 * Run via: pnpm sm → sync-plans
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Polar } from "@polar-sh/sdk";
import { config } from "dotenv";

const ROOT = resolve(import.meta.dirname, "..");

config({ path: resolve(ROOT, ".env") });

// ─── Validate env ──────────────────────────────────────────────────
if (!process.env.POLAR_ACCESS_TOKEN?.trim()) {
  console.log(
    `\n  \x1b[41m\x1b[1m\x1b[37m ✗ MISSING \x1b[0m  \x1b[31mPOLAR_ACCESS_TOKEN\x1b[0m is not set in \x1b[33m.env\x1b[0m\n`
  );
  process.exit(1);
}

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server:
    (process.env.POLAR_SERVER as "sandbox" | "production") || "production",
});

// ─── ANSI helpers ──────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m",
  white: "\x1b[37m",
  red: "\x1b[31m",
};

// ─── Helpers ───────────────────────────────────────────────────────
function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

/** Strip interval suffix: "Starter — Monthly" → "Starter" */
function stripInterval(name: string): string {
  return name.replace(/\s*[—–-]\s*(Monthly|Yearly)\s*$/i, "").trim();
}

type PolarPrice = { amountType: string; priceAmount?: number };

function getPriceAmount(price: PolarPrice | undefined): number {
  if (!price) return 0;
  return "priceAmount" in price ? (price.priceAmount ?? 0) : 0;
}

type GroupedPlan = {
  key: string;
  name: string;
  monthlyProductId: string;
  yearlyProductId: string;
};

type OneTimeEntry = { key: string; name: string; productId: string };

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log();

  let products: Awaited<
    ReturnType<typeof polar.products.list>
  >["result"]["items"];
  try {
    const result = await polar.products.list({});
    products = result.result.items.filter((p) => !p.isArchived);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(
      `  ${c.bgRed}${c.bold}${c.white} ✗ POLAR API ${c.reset}  ${c.red}${msg}${c.reset}\n`
    );
    process.exit(1);
  }

  if (products.length === 0) {
    console.log(`  ${c.yellow}No active products found in Polar.${c.reset}\n`);
    process.exit(0);
  }

  // ─── Group recurring plans by base name ─────────────────────────
  const planMap = new Map<string, GroupedPlan>();
  const oneTimeProducts: OneTimeEntry[] = [];

  for (const product of products) {
    const interval = product.recurringInterval;

    if (interval) {
      const baseName = stripInterval(product.name);
      const key = toCamelCase(baseName);
      const existing = planMap.get(key) ?? {
        key,
        name: baseName,
        monthlyProductId: "",
        yearlyProductId: "",
      };

      if (interval === "month") {
        existing.monthlyProductId = product.id;
      } else {
        existing.yearlyProductId = product.id;
      }

      planMap.set(key, existing);
    } else {
      oneTimeProducts.push({
        key: toCamelCase(product.name),
        name: product.name,
        productId: product.id,
      });
    }
  }

  // Sort by monthly price (cheapest first)
  const plans = [...planMap.values()].sort((a, b) => {
    const productA = products.find((p) => p.id === a.monthlyProductId);
    const productB = products.find((p) => p.id === b.monthlyProductId);
    return (
      getPriceAmount(productA?.prices[0] as PolarPrice | undefined) -
      getPriceAmount(productB?.prices[0] as PolarPrice | undefined)
    );
  });

  // Sort one-time by price
  oneTimeProducts.sort((a, b) => {
    const productA = products.find((p) => p.id === a.productId);
    const productB = products.find((p) => p.id === b.productId);
    return (
      getPriceAmount(productA?.prices[0] as PolarPrice | undefined) -
      getPriceAmount(productB?.prices[0] as PolarPrice | undefined)
    );
  });

  // ─── Generate file ──────────────────────────────────────────────
  const formatPlanEntries = (entries: GroupedPlan[]) =>
    entries
      .map(
        (e) =>
          `  ${e.key}: { name: "${e.name}", monthlyProductId: "${e.monthlyProductId}", yearlyProductId: "${e.yearlyProductId}" },`
      )
      .join("\n");

  const formatOneTimeEntries = (entries: OneTimeEntry[]) =>
    entries
      .map(
        (e) => `  ${e.key}: { name: "${e.name}", productId: "${e.productId}" },`
      )
      .join("\n");

  const content = `// Auto-generated by: pnpm sm → sync-plans
// Do not edit manually — re-run the script after changing Polar products.
//
// Polar product naming convention:
// - Subscription plans: "{Plan} — Monthly" and "{Plan} — Yearly"
//   Grouped by base name (e.g. "starter" matches both monthly and yearly)
// - One-time products: just the product name (e.g. "Lifetime Deal" → "lifetimeDeal")

export const plans = {
${formatPlanEntries(plans)}
} as const satisfies Record<string, { name: string; monthlyProductId: string; yearlyProductId: string }>;

export const oneTimeProducts = {
${formatOneTimeEntries(oneTimeProducts)}
} as const satisfies Record<string, { name: string; productId: string }>;

export type PlanKey = keyof typeof plans;
export type ProductKey = keyof typeof oneTimeProducts;
`;

  const outPath = resolve(ROOT, "config/plans.ts");
  writeFileSync(outPath, content, "utf-8");

  // ─── Output ─────────────────────────────────────────────────────
  console.log(
    `  ${c.bgGreen}${c.bold}${c.white} ✓ SYNCED ${c.reset}  ${c.green}config/plans.ts${c.reset}\n`
  );

  if (plans.length > 0) {
    console.log(`  ${c.bold}${c.cyan}Subscription Plans${c.reset}`);
    for (const p of plans) {
      console.log(`  ${c.green}│${c.reset} ${c.bold}${p.key}${c.reset}`);
      if (p.monthlyProductId) {
        console.log(
          `  ${c.green}│${c.reset}   monthly  ${c.gray}${p.monthlyProductId}${c.reset}`
        );
      }
      if (p.yearlyProductId) {
        console.log(
          `  ${c.green}│${c.reset}   yearly   ${c.gray}${p.yearlyProductId}${c.reset}`
        );
      }
    }
    console.log();
  }

  if (oneTimeProducts.length > 0) {
    console.log(`  ${c.bold}${c.cyan}One-Time Products${c.reset}`);
    for (const p of oneTimeProducts) {
      console.log(
        `  ${c.green}│${c.reset} ${p.key} → ${c.dim}${p.name}${c.reset} ${c.gray}(${p.productId})${c.reset}`
      );
    }
    console.log();
  }

  console.log(
    `  ${c.gray}Update ${c.yellow}config/access.ts${c.gray} to map features to these plans.${c.reset}\n`
  );
}

main();
