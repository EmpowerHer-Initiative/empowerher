/**
 * Webhook Setup & Sync — manages Polar webhook endpoints, secrets, and events.
 *
 * Without flags: report-only (safe for predev/prebuild hooks)
 * With --fix:    interactive — creates endpoints, syncs secrets, enables events
 *
 * Run via: pnpm sm → check-webhooks (report or fix mode)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { Polar } from "@polar-sh/sdk";
import { config } from "dotenv";

const FIX_MODE = process.argv.includes("--fix");
const ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_WEBHOOK_URL =
  "https://webhooks.alisamadii.com/api/auth/polar/webhooks";

config({ path: resolve(ROOT, ".env") });

// ─── Validate env ──────────────────────────────────────────────────
if (!process.env.POLAR_ACCESS_TOKEN?.trim()) {
  console.log(
    `\n  \x1b[43m\x1b[1m\x1b[37m ⚠ SKIPPED \x1b[0m  \x1b[33mPOLAR_ACCESS_TOKEN\x1b[0m not set — skipping webhook check\n`
  );
  process.exit(0);
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
  bgYellow: "\x1b[43m",
  white: "\x1b[37m",
};

const log = console.log;

// ─── Interactive helpers ───────────────────────────────────────────
function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase() === "y");
    });
  });
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

// ─── .env updater ──────────────────────────────────────────────────
function updateEnvSecret(newSecret: string): void {
  const envPath = resolve(ROOT, ".env");
  let content = readFileSync(envPath, "utf-8");

  const regex = /^POLAR_WEBHOOK_SECRET=.*$/m;
  if (regex.test(content)) {
    content = content.replace(regex, `POLAR_WEBHOOK_SECRET=${newSecret}`);
  } else {
    content = content.trimEnd() + `\nPOLAR_WEBHOOK_SECRET=${newSecret}\n`;
  }

  writeFileSync(envPath, content, "utf-8");
}

// ─── Event categories ──────────────────────────────────────────────
const CATEGORY_PREFIXES: [string, string][] = [
  ["product.", "products"],
  ["order.", "orders"],
  ["checkout.", "checkout"],
  ["subscription.", "subscriptions"],
  ["customer.", "customers"],
  ["refund.", "refunds"],
  ["benefit.", "benefits"],
];

function categorize(event: string): string {
  for (const [prefix, category] of CATEGORY_PREFIXES) {
    if (event.startsWith(prefix)) return category;
  }
  return "other";
}

function groupByCategory(events: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const e of events.sort()) {
    const cat = categorize(e);
    (grouped[cat] ??= []).push(e);
  }
  return grouped;
}

// ─── Parse local events from auth.ts ───────────────────────────────
function getLocalEvents(): Set<string> {
  const authPath = resolve(ROOT, "services/auth/auth.ts");
  const content = readFileSync(authPath, "utf-8");
  const events = new Set<string>();

  const payloadRegex = /payload\.type\s*===\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = payloadRegex.exec(content)) !== null) {
    events.add(match[1]);
  }

  const handlerMap: Record<string, string> = {
    onProductCreated: "product.created",
    onProductUpdated: "product.updated",
    onOrderCreated: "order.created",
    onOrderUpdated: "order.updated",
    onOrderPaid: "order.paid",
    onOrderRefunded: "order.refunded",
    onCustomerCreated: "customer.created",
    onCustomerUpdated: "customer.updated",
    onCustomerDeleted: "customer.deleted",
    onSubscriptionCreated: "subscription.created",
    onSubscriptionUpdated: "subscription.updated",
    onSubscriptionActive: "subscription.active",
    onSubscriptionCanceled: "subscription.canceled",
    onSubscriptionUncanceled: "subscription.uncanceled",
    onSubscriptionRevoked: "subscription.revoked",
    onCheckoutCreated: "checkout.created",
    onCheckoutUpdated: "checkout.updated",
    onRefundCreated: "refund.created",
    onRefundUpdated: "refund.updated",
  };

  for (const [handler, event] of Object.entries(handlerMap)) {
    if (content.includes(handler)) {
      events.add(event);
    }
  }

  return events;
}

// ─── Endpoint type ─────────────────────────────────────────────────
type Endpoint = {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  secret: string;
};

// ─── Fetch Polar webhook endpoints ────────────────────────────────
async function getPolarEndpoints(): Promise<{
  events: Set<string>;
  endpoints: Endpoint[];
}> {
  const result = await polar.webhooks.listWebhookEndpoints({});
  const events = new Set<string>();
  const endpoints: Endpoint[] = [];

  for (const ep of result.result.items) {
    endpoints.push({
      id: ep.id,
      url: ep.url,
      events: [...ep.events],
      enabled: ep.enabled,
      secret: ep.secret,
    });

    if (ep.enabled) {
      for (const evt of ep.events) {
        events.add(evt);
      }
    }
  }

  return { events, endpoints };
}

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  log();

  const localEvents = getLocalEvents();
  let hasIssues = false;

  // ═══════════════════════════════════════════════════════════════════
  // Stage 1: Fetch state
  // ═══════════════════════════════════════════════════════════════════
  let polarData: Awaited<ReturnType<typeof getPolarEndpoints>>;
  try {
    polarData = await getPolarEndpoints();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(
      `  ${c.bgRed}${c.bold}${c.white} ✗ POLAR API ${c.reset}  ${c.red}${msg}${c.reset}\n`
    );
    process.exit(1);
  }

  // ═══════════════════════════════════════════════════════════════════
  // Stage 2: Endpoint resolution
  // ═══════════════════════════════════════════════════════════════════
  let target: Endpoint | null =
    polarData.endpoints.find((ep) => ep.enabled) ??
    polarData.endpoints[0] ??
    null;

  if (!target) {
    if (!FIX_MODE) {
      log(
        `  ${c.bgRed}${c.bold}${c.white} ✗ NO ENDPOINT ${c.reset}  No webhook endpoint configured in Polar`
      );
      log();
      log(
        `  ${c.gray}Run ${c.yellow}pnpm sm → check-webhooks → fix${c.gray} to create one automatically${c.reset}`
      );
      log();
      process.exit(1);
    }

    // Interactive: create endpoint
    log(
      `  ${c.bold}${c.cyan}No webhook endpoint found — let's create one${c.reset}`
    );
    log();

    const input = await prompt(
      `  ${c.bold}Webhook URL ${c.dim}(${DEFAULT_WEBHOOK_URL})${c.reset}${c.bold}: ${c.reset}`
    );
    const url = input || DEFAULT_WEBHOOK_URL;

    log();
    log(`  Creating endpoint...`);

    const created = await polar.webhooks.createWebhookEndpoint({
      url,
      format: "raw",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events: [...localEvents] as any,
    });

    target = {
      id: created.id,
      url: created.url,
      events: [...created.events],
      enabled: created.enabled,
      secret: created.secret,
    };

    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ CREATED ${c.reset}  ${c.dim}${target.url}${c.reset}  ${c.gray}(${target.events.length} events)${c.reset}`
    );
    log();

    // Write secret to .env
    updateEnvSecret(target.secret);
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ SECRET ${c.reset}  ${c.green}POLAR_WEBHOOK_SECRET${c.reset} saved to ${c.dim}.env${c.reset}`
    );
    log();

    // Endpoint was just created with all local events — skip to summary
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ WEBHOOKS ${c.reset}  All ${c.green}${localEvents.size}${c.reset} events are in sync.\n`
    );
    process.exit(0);
  }

  // Show endpoints
  log(`  ${c.bold}${c.cyan}Webhook Endpoints${c.reset}`);
  for (const ep of polarData.endpoints) {
    const status = ep.enabled
      ? `${c.green}enabled${c.reset}`
      : `${c.red}disabled${c.reset}`;
    log(
      `  ${c.gray}│${c.reset} ${c.dim}${ep.url}${c.reset}  ${status}  ${c.gray}(${ep.events.length} events)${c.reset}`
    );
  }
  log();

  // ═══════════════════════════════════════════════════════════════════
  // Stage 3: Secret sync
  // ═══════════════════════════════════════════════════════════════════
  const currentSecret = process.env.POLAR_WEBHOOK_SECRET?.trim() || "";

  if (currentSecret === target.secret) {
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ SECRET ${c.reset}  ${c.dim}POLAR_WEBHOOK_SECRET in sync${c.reset}`
    );
  } else if (!currentSecret) {
    if (FIX_MODE) {
      updateEnvSecret(target.secret);
      log(
        `  ${c.bgGreen}${c.bold}${c.white} ✓ SECRET ${c.reset}  ${c.green}POLAR_WEBHOOK_SECRET${c.reset} saved to ${c.dim}.env${c.reset}`
      );
    } else {
      log(
        `  ${c.bgRed}${c.bold}${c.white} ✗ SECRET ${c.reset}  ${c.red}POLAR_WEBHOOK_SECRET${c.reset} is empty in ${c.yellow}.env${c.reset}`
      );
      log(
        `  ${c.gray}Run ${c.yellow}pnpm sm → check-webhooks → fix${c.gray} to sync automatically${c.reset}`
      );
      hasIssues = true;
    }
  } else {
    if (FIX_MODE) {
      updateEnvSecret(target.secret);
      log(
        `  ${c.bgGreen}${c.bold}${c.white} ✓ SECRET ${c.reset}  ${c.green}POLAR_WEBHOOK_SECRET${c.reset} updated in ${c.dim}.env${c.reset}`
      );
    } else {
      log(
        `  ${c.bgYellow}${c.bold}${c.white} ⚠ SECRET ${c.reset}  ${c.yellow}POLAR_WEBHOOK_SECRET${c.reset} in ${c.yellow}.env${c.reset} does not match Polar endpoint`
      );
      log(
        `  ${c.gray}Run ${c.yellow}pnpm sm → check-webhooks → fix${c.gray} to sync automatically${c.reset}`
      );
      hasIssues = true;
    }
  }
  log();

  // ═══════════════════════════════════════════════════════════════════
  // Stage 4: Event sync
  // ═══════════════════════════════════════════════════════════════════
  const polarEvents = polarData.events;
  const inSync = [...localEvents].filter((e) => polarEvents.has(e));
  const notHandled = [...polarEvents].filter((e) => !localEvents.has(e));
  const notEnabled = [...localEvents].filter((e) => !polarEvents.has(e));

  if (FIX_MODE && notEnabled.length > 0) hasIssues = true;

  // ─── In Sync ───────────────────────────────────────────────────
  if (inSync.length > 0) {
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ SYNCED ${c.reset}  ${c.green}${inSync.length}${c.reset} event${inSync.length !== 1 ? "s" : ""} in sync`
    );
    log();

    const grouped = groupByCategory(inSync);
    for (const [category, events] of Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      log(`  ${c.cyan}${c.bold}${category}${c.reset}`);
      for (const e of events) {
        log(`  ${c.green}│${c.reset} ${c.dim}●${c.reset}  ${e}`);
      }
      log();
    }
  }

  // ─── Not Handled ───────────────────────────────────────────────
  if (notHandled.length > 0) {
    log(
      `  ${c.bgYellow}${c.bold}${c.white} ⚠ NOT HANDLED ${c.reset}  ${c.yellow}${notHandled.length}${c.reset} event${notHandled.length !== 1 ? "s" : ""} enabled in Polar but not handled locally`
    );
    log();

    const grouped = groupByCategory(notHandled);
    for (const [category, events] of Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      log(`  ${c.cyan}${c.bold}${category}${c.reset}`);
      for (const e of events) {
        log(`  ${c.yellow}│${c.reset} ${c.dim}○${c.reset}  ${e}`);
      }
      log();
    }

    log(
      `  ${c.gray}Add handlers in ${c.yellow}services/auth/auth.ts${c.gray} or disable in Polar Dashboard${c.reset}`
    );
    log();
  }

  // ─── Not Enabled ───────────────────────────────────────────────
  if (notEnabled.length > 0) {
    log(
      `  ${c.bgRed}${c.bold}${c.white} ✗ NOT ENABLED ${c.reset}  ${c.red}${notEnabled.length}${c.reset} event${notEnabled.length !== 1 ? "s" : ""} handled locally but not enabled in Polar`
    );
    log();

    const grouped = groupByCategory(notEnabled);
    for (const [category, events] of Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      log(`  ${c.cyan}${c.bold}${category}${c.reset}`);
      for (const e of events) {
        log(`  ${c.red}│${c.reset} ${c.dim}○${c.reset}  ${e}`);
      }
      log();
    }

    if (FIX_MODE) {
      log(
        `  ${c.bold}Will enable ${c.yellow}${notEnabled.length}${c.reset} event${notEnabled.length !== 1 ? "s" : ""} on endpoint:${c.reset}`
      );
      log(`  ${c.dim}${target.url}${c.reset}`);
      log();
      for (const e of notEnabled.sort()) {
        log(`  ${c.green}+${c.reset}  ${e}`);
      }
      log();

      const ok = await confirm(`  ${c.bold}Confirm? (y/N): ${c.reset}`);

      if (ok) {
        const merged = [...new Set([...target.events, ...notEnabled])];
        await polar.webhooks.updateWebhookEndpoint({
          id: target.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          webhookEndpointUpdate: { events: merged as any },
        });
        log();
        log(
          `  ${c.bgGreen}${c.bold}${c.white} ✓ ENABLED ${c.reset}  ${c.green}${notEnabled.length}${c.reset} event${notEnabled.length !== 1 ? "s" : ""} added to ${c.dim}${target.url}${c.reset}`
        );
        log();
        hasIssues = false;
      } else {
        log();
        log(`  ${c.yellow}Aborted.${c.reset}\n`);
      }
    } else {
      log(
        `  ${c.gray}Run ${c.yellow}pnpm sm → check-webhooks → fix${c.gray} to enable automatically, or remove handlers from ${c.yellow}services/auth/auth.ts${c.reset}`
      );
      log();
    }
  }

  // ─── All clear ─────────────────────────────────────────────────
  if (!hasIssues) {
    log(
      `  ${c.bgGreen}${c.bold}${c.white} ✓ WEBHOOKS ${c.reset}  All ${c.green}${localEvents.size}${c.reset} events are in sync.\n`
    );
  }

  process.exit(hasIssues ? 1 : 0);
}

main();
