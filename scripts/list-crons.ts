/**
 * Cron Job Visualizer — lists all registered cron jobs and their Vercel schedules.
 * Run: pnpm crons
 */

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

// ─── Check feature flag ────────────────────────────────────────────
const projectConfig: Record<string, unknown> = JSON.parse(
  readFileSync(resolve(ROOT, "config/config.json"), "utf-8")
);

if (!projectConfig.cron) {
  console.log(
    `\n  \x1b[43m\x1b[1m\x1b[37m ⚠ SKIPPED \x1b[0m  \x1b[33mcron\x1b[0m is disabled in \x1b[33mconfig/config.json\x1b[0m\n`
  );
  process.exit(0);
}

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
  bgCyan: "\x1b[46m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  white: "\x1b[37m",
};

const log = console.log;

// ─── Cron schedule labels ──────────────────────────────────────────
function describeSchedule(schedule: string): string {
  const presets: Record<string, string> = {
    "* * * * *": "every minute",
    "*/5 * * * *": "every 5 minutes",
    "*/10 * * * *": "every 10 minutes",
    "*/15 * * * *": "every 15 minutes",
    "*/30 * * * *": "every 30 minutes",
    "0 * * * *": "every hour",
    "0 */2 * * *": "every 2 hours",
    "0 */6 * * *": "every 6 hours",
    "0 */12 * * *": "every 12 hours",
    "0 0 * * *": "daily at midnight",
    "0 0 * * 0": "weekly on Sunday",
    "0 0 1 * *": "monthly on the 1st",
  };
  return presets[schedule] ?? schedule;
}

// ─── Read vercel.json crons ────────────────────────────────────────
interface VercelCron {
  path: string;
  schedule: string;
}

const vercelPath = resolve(ROOT, "vercel.json");
let vercelCrons: VercelCron[] = [];
try {
  const vercelJson = JSON.parse(readFileSync(vercelPath, "utf-8"));
  vercelCrons = vercelJson.crons ?? [];
} catch {
  // vercel.json missing or invalid
}

// ─── Read registered jobs from services/cron/jobs/ ─────────────────
const jobsDir = resolve(ROOT, "services/cron/jobs");
let jobFiles: string[] = [];
try {
  jobFiles = readdirSync(jobsDir)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
    .map((f) => f.replace(".ts", ""));
} catch {
  // jobs dir missing
}

// ─── Build job map ─────────────────────────────────────────────────
// Parse job name from vercel.json path: /api/cron?job=example → example
function extractJobName(path: string): string | null {
  const match = path.match(/[?&]job=([^&]+)/);
  return match?.[1] ?? null;
}

interface JobEntry {
  name: string;
  schedule: string | null;
  path: string | null;
  hasFile: boolean;
  inVercel: boolean;
}

const jobMap = new Map<string, JobEntry>();

// Add from vercel.json
for (const cron of vercelCrons) {
  const name = extractJobName(cron.path);
  if (name) {
    jobMap.set(name, {
      name,
      schedule: cron.schedule,
      path: cron.path,
      hasFile: false,
      inVercel: true,
    });
  }
}

// Add from job files
for (const name of jobFiles) {
  const existing = jobMap.get(name);
  if (existing) {
    existing.hasFile = true;
  } else {
    jobMap.set(name, {
      name,
      schedule: null,
      path: null,
      hasFile: true,
      inVercel: false,
    });
  }
}

// ─── Output ────────────────────────────────────────────────────────
const jobs = [...jobMap.values()].sort((a, b) => a.name.localeCompare(b.name));
const synced = jobs.filter((j) => j.hasFile && j.inVercel);
const missingFile = jobs.filter((j) => !j.hasFile && j.inVercel);
const missingVercel = jobs.filter((j) => j.hasFile && !j.inVercel);

log();
log(
  `  ${c.bgCyan}${c.bold}${c.white} CRONS ${c.reset}  ${c.cyan}${jobs.length}${c.reset} job${jobs.length !== 1 ? "s" : ""} found`
);
log();

// Synced jobs
if (synced.length > 0) {
  for (const job of synced) {
    const scheduleLabel = job.schedule
      ? describeSchedule(job.schedule)
      : "no schedule";
    log(
      `  ${c.green}●${c.reset}  ${c.white}${c.bold}${job.name.padEnd(20)}${c.reset} ${c.dim}${scheduleLabel.padEnd(22)}${c.reset} ${c.gray}${job.path ?? ""}${c.reset}`
    );
  }
  log();
}

// Missing job file (in vercel.json but no file)
if (missingFile.length > 0) {
  log(
    `  ${c.bgYellow}${c.bold}${c.white} ⚠ NO HANDLER ${c.reset}  ${c.yellow}${missingFile.length}${c.reset} cron${missingFile.length !== 1 ? "s" : ""} in ${c.yellow}vercel.json${c.reset} with no job file`
  );
  log();
  for (const job of missingFile) {
    log(
      `  ${c.yellow}│${c.reset} ${c.dim}○${c.reset}  ${job.name}  ${c.gray}→ create ${c.yellow}services/cron/jobs/${job.name}.ts${c.reset}`
    );
  }
  log();
}

// Missing vercel.json entry (has file but no schedule)
if (missingVercel.length > 0) {
  log(
    `  ${c.bgRed}${c.bold}${c.white} ✗ NOT SCHEDULED ${c.reset}  ${c.red}${missingVercel.length}${c.reset} job${missingVercel.length !== 1 ? "s" : ""} with no ${c.yellow}vercel.json${c.reset} entry`
  );
  log();
  for (const job of missingVercel) {
    log(
      `  ${c.red}│${c.reset} ${c.dim}○${c.reset}  ${job.name}  ${c.gray}→ add to ${c.yellow}vercel.json${c.reset}`
    );
  }
  log();
}

// All clear
if (missingFile.length === 0 && missingVercel.length === 0) {
  log(
    `  ${c.bgGreen}${c.bold}${c.white} ✓ CRONS ${c.reset}  All ${c.green}${synced.length}${c.reset} jobs are in sync.\n`
  );
}

process.exit(missingFile.length > 0 || missingVercel.length > 0 ? 1 : 0);
