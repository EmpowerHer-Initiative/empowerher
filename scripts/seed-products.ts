/**
 * Seed Products — creates test products in Polar for development.
 * Run: pnpm seed:products
 */

import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { Polar } from "@polar-sh/sdk";
import { config } from "dotenv";

const ROOT = resolve(import.meta.dirname, "..");

config({ path: resolve(ROOT, ".env") });

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
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  white: "\x1b[37m",
};

const log = console.log;

function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase() === "y");
    });
  });
}

// ─── Product definitions ───────────────────────────────────────────
type ProductDef = {
  name: string;
  description: string;
  priceAmount: number;
  recurringInterval?: "month" | "year";
};

const PRODUCTS: ProductDef[] = [
  // Monthly subscriptions
  {
    name: "Starter — Monthly",
    description:
      "For individuals getting started. Essential features to hit the ground running.",
    priceAmount: 900,
    recurringInterval: "month",
  },
  {
    name: "Pro — Monthly",
    description:
      "For professionals and small teams. Advanced features and priority support.",
    priceAmount: 2900,
    recurringInterval: "month",
  },
  {
    name: "Business — Monthly",
    description:
      "For growing businesses. Full feature set, team management, and dedicated support.",
    priceAmount: 7900,
    recurringInterval: "month",
  },

  // Yearly subscriptions (17% discount)
  {
    name: "Starter — Yearly",
    description:
      "For individuals getting started. Save 17% with annual billing.",
    priceAmount: 9000,
    recurringInterval: "year",
  },
  {
    name: "Pro — Yearly",
    description:
      "For professionals and small teams. Save 17% with annual billing.",
    priceAmount: 29000,
    recurringInterval: "year",
  },
  {
    name: "Business — Yearly",
    description: "For growing businesses. Save 17% with annual billing.",
    priceAmount: 79000,
    recurringInterval: "year",
  },

  // One-time purchases
  {
    name: "Lifetime Deal",
    description:
      "One-time payment for lifetime access. All current and future features included.",
    priceAmount: 29900,
  },
  {
    name: "Starter Kit",
    description:
      "Digital starter bundle with templates, guides, and resources to get started fast.",
    priceAmount: 4900,
  },
];

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  log();

  // Fetch existing products to avoid duplicates
  let existingNames: Set<string>;
  try {
    const result = await polar.products.list({});
    existingNames = new Set(result.result.items.map((p) => p.name));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(
      `  ${c.bgRed}${c.bold}${c.white} ✗ POLAR API ${c.reset}  ${c.red}${msg}${c.reset}\n`
    );
    process.exit(1);
  }

  const toCreate = PRODUCTS.filter((p) => !existingNames.has(p.name));
  const skipped = PRODUCTS.filter((p) => existingNames.has(p.name));

  if (skipped.length > 0) {
    log(
      `  ${c.yellow}${c.bold}Skipping ${skipped.length}${c.reset} existing product${skipped.length !== 1 ? "s" : ""}:`
    );
    for (const p of skipped) {
      log(`  ${c.gray}│${c.reset} ${c.dim}●${c.reset}  ${p.name}`);
    }
    log();
  }

  if (toCreate.length === 0) {
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ PRODUCTS ${c.reset}  All ${c.green}${PRODUCTS.length}${c.reset} products already exist.\n`
    );
    process.exit(0);
  }

  // Show what will be created
  log(`  ${c.bold}${c.cyan}Products to create${c.reset}`);
  log();

  for (const p of toCreate) {
    const interval = p.recurringInterval
      ? `${c.cyan}/${p.recurringInterval}${c.reset}`
      : `${c.yellow}one-time${c.reset}`;
    const price = `$${(p.priceAmount / 100).toFixed(2)}`;
    log(
      `  ${c.green}+${c.reset}  ${c.bold}${p.name}${c.reset}  ${c.dim}${price}${c.reset} ${interval}`
    );
    log(`     ${c.dim}${p.description}${c.reset}`);
  }
  log();

  const ok = await confirm(
    `  ${c.bold}Create ${toCreate.length} products? (y/N): ${c.reset}`
  );
  if (!ok) {
    log(`\n  ${c.yellow}Aborted.${c.reset}\n`);
    process.exit(0);
  }

  log();

  // Create products
  const created: { name: string; id: string }[] = [];

  for (const p of toCreate) {
    try {
      const product = await polar.products.create({
        name: p.name,
        description: p.description,
        recurringInterval: p.recurringInterval ?? null,
        prices: [
          {
            amountType: "fixed" as const,
            priceAmount: p.priceAmount,
            priceCurrency: "usd",
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      created.push({ name: product.name, id: product.id });
      log(
        `  ${c.green}✓${c.reset}  ${p.name}  ${c.dim}${product.id}${c.reset}`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`  ${c.red}✗${c.reset}  ${p.name}  ${c.red}${msg}${c.reset}`);
    }
  }

  log();

  if (created.length > 0) {
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ CREATED ${c.reset}  ${c.green}${created.length}${c.reset} product${created.length !== 1 ? "s" : ""}`
    );
    log();

    // Offer to sync plans
    const sync = await confirm(
      `  ${c.bold}Run sync:plans to update config/plans.ts? (y/N): ${c.reset}`
    );
    if (sync) {
      log();
      execSync("pnpm sync:plans", { cwd: ROOT, stdio: "inherit" });
    }
  }

  log();
}

main();
