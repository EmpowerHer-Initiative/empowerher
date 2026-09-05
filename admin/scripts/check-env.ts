import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";

const ROOT = resolve(import.meta.dirname, "..");

// ─── Feature → required env vars mapping ────────────────────────────
// Add a new feature: featureName: ["VAR_1", "VAR_2"]
// Remove a feature: delete the line
// "VAR_A|VAR_B" means at least one of the alternatives must be set.
const FEATURE_ENV_MAP: Record<string, string[]> = {
  auth: ["BETTER_AUTH_SECRET", "DATABASE_URL", "NEXT_PUBLIC_API_URL"],
  // cron: ["CRON_SECRET"],
  agencyApi: ["NEXT_PUBLIC_AGENCY_API_KEY"],
  email: ["RESEND_API_KEY|USESEND_API_KEY"],
};

// Known vars that are never required (fine to leave unset).
const OPTIONAL_ENV = ["USESEND_URL"];

// ─── Collect all required vars ─────────────────────────────────────
const required = new Set<string>();

for (const vars of Object.values(FEATURE_ENV_MAP)) {
  vars.forEach((v) => required.add(v));
}

// ─── Ensure .env exists ─────────────────────────────────────────────
const envPath = resolve(ROOT, ".env");
const examplePath = resolve(ROOT, ".env.example");

if (!existsSync(envPath)) {
  if (existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log("Created .env from .env.example — fill in the values.\n");
  } else {
    console.error("No .env or .env.example found.");
    process.exit(1);
  }
}

// ─── Validate ───────────────────────────────────────────────────────
const envFile = parse(readFileSync(envPath));
const merged = { ...envFile, ...process.env };

const missing: string[] = [];
for (const key of required) {
  // "A|B" entries pass when any one alternative is set.
  const alternatives = key.split("|");
  if (!alternatives.some((alt) => merged[alt]?.trim())) {
    missing.push(key);
  }
}

// ─── Detect untracked vars (in .env but not in FEATURE_ENV_MAP) ─────
const allKnown = new Set([
  ...Object.values(FEATURE_ENV_MAP)
    .flat()
    .flatMap((key) => key.split("|")),
  ...OPTIONAL_ENV,
]);
const untracked: string[] = [];
for (const key of Object.keys(envFile)) {
  if (!allKnown.has(key)) {
    untracked.push(key);
  }
}

// ─── ANSI helpers ───────────────────────────────────────────────────
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

const hasErrors = missing.length > 0 || untracked.length > 0;

if (!hasErrors) {
  log();
  log(
    `  ${c.bgGreen}${c.bold}${c.white} ✓ ENV ${c.reset}  All ${c.green}${required.size}${c.reset} required variables are set.`
  );
  log();
  process.exit(0);
}

log();

// ─── Missing vars ───────────────────────────────────────────────────
if (missing.length > 0) {
  const grouped: Record<string, string[]> = {};
  for (const key of missing) {
    const feature =
      Object.entries(FEATURE_ENV_MAP).find(([, vars]) =>
        vars.includes(key)
      )?.[0] ?? "unknown";
    (grouped[feature] ??= []).push(key);
  }

  log(
    `  ${c.bgRed}${c.bold}${c.white} ✗ MISSING ${c.reset}  ${c.red}${missing.length}${c.reset} variable${missing.length > 1 ? "s" : ""} not set`
  );
  log();

  for (const [feature, vars] of Object.entries(grouped)) {
    log(`  ${c.cyan}${c.bold}${feature}${c.reset}`);
    for (const v of vars) {
      log(`  ${c.red}│${c.reset} ${c.dim}○${c.reset}  ${v}`);
    }
    log();
  }

  log(
    `  ${c.gray}Set these in ${c.yellow}.env${c.gray} or remove the feature entry from ${c.yellow}scripts/check-env.ts${c.reset}`
  );
  log();
}

// ─── Untracked vars ─────────────────────────────────────────────────
if (untracked.length > 0) {
  log(
    `  ${c.bgRed}${c.bold}${c.white} ✗ UNTRACKED ${c.reset}  ${c.red}${untracked.length}${c.reset} variable${untracked.length > 1 ? "s" : ""} in ${c.yellow}.env${c.reset} not in FEATURE_ENV_MAP`
  );
  log();

  for (const v of untracked) {
    log(`  ${c.yellow}│${c.reset} ${c.dim}?${c.reset}  ${v}`);
  }

  log();
  log(
    `  ${c.gray}Add these to ${c.yellow}FEATURE_ENV_MAP${c.gray} in ${c.yellow}scripts/check-env.ts${c.gray} or remove from ${c.yellow}.env${c.reset}`
  );
  log();
}

process.exit(1);
