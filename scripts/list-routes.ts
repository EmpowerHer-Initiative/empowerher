/**
 * Route Visualizer — prints all tRPC procedures in a formatted table.
 * Run: pnpm routes
 */

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ROUTERS_DIR = resolve(ROOT, "services/trpc/routers");

interface Route {
  router: string;
  procedure: string;
  type: "query" | "mutation";
  access: "base" | "authenticated" | "admin";
  guard: string | null;
}

function parseRouterFile(filePath: string, routerPrefix: string): Route[] {
  const content = readFileSync(filePath, "utf-8");
  const routes: Route[] = [];

  // Match procedure definitions like: procedureName: baseProcedure.use(featureGuard("key")).query(
  const procedureRegex =
    /(\w+):\s*(baseProcedure|authenticatedProcedure|adminProcedure)/g;
  let match: RegExpExecArray | null;

  while ((match = procedureRegex.exec(content)) !== null) {
    const procedureName = match[1];
    const accessType = match[2];

    // Determine query vs mutation — find the next .query( or .mutation( after the procedure name
    const afterMatch = content.slice(match.index);
    const queryPos = afterMatch.search(/\.query\s*\(/);
    const mutationPos = afterMatch.search(/\.mutation\s*\(/);
    // Next procedure boundary (to avoid matching the wrong procedure's type)
    const nextProcedure = afterMatch
      .slice(50)
      .search(/\w+:\s*(baseProcedure|authenticatedProcedure|adminProcedure)/);
    const boundary =
      nextProcedure === -1 ? afterMatch.length : nextProcedure + 50;
    const isQuery =
      queryPos !== -1 &&
      queryPos < boundary &&
      (mutationPos === -1 || queryPos < mutationPos);
    const isMutation =
      mutationPos !== -1 &&
      mutationPos < boundary &&
      (queryPos === -1 || mutationPos < queryPos);

    // Extract feature guard (only within this procedure's boundary)
    const guardSection = afterMatch.slice(0, boundary);
    const guardMatch = guardSection.match(/featureGuard\("([^"]+)"\)/);

    const access =
      accessType === "adminProcedure"
        ? "admin"
        : accessType === "authenticatedProcedure"
          ? "authenticated"
          : "base";

    routes.push({
      router: routerPrefix,
      procedure: procedureName,
      type: isMutation && !isQuery ? "mutation" : "query",
      access,
      guard: guardMatch?.[1] ?? null,
    });
  }

  return routes;
}

function scanRouters(dir: string, prefix: string = ""): Route[] {
  const routes: Route[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      routes.push(...scanRouters(fullPath, entry.name));
    } else if (
      entry.name.endsWith(".ts") &&
      !entry.name.startsWith("_") &&
      !entry.name.includes("action") &&
      entry.name !== "init.ts"
    ) {
      const routerName = prefix
        ? `${prefix}.${entry.name.replace(".ts", "")}`
        : entry.name.replace(".ts", "");
      routes.push(...parseRouterFile(fullPath, routerName));
    }
  }

  return routes;
}

// ─── ANSI helpers ───────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
  white: "\x1b[37m",
  bgCyan: "\x1b[46m",
};

const routes = scanRouters(ROUTERS_DIR);

// Group by router
const grouped: Record<string, Route[]> = {};
for (const route of routes) {
  (grouped[route.router] ??= []).push(route);
}

const log = console.log;

log();
log(
  `  ${c.bgCyan}${c.bold}${c.white} ROUTES ${c.reset}  ${c.cyan}${routes.length}${c.reset} procedures across ${c.cyan}${Object.keys(grouped).length}${c.reset} routers`
);
log();

for (const [router, procedures] of Object.entries(grouped).sort(([a], [b]) =>
  a.localeCompare(b)
)) {
  log(`  ${c.bold}${c.cyan}${router}${c.reset}`);

  for (const proc of procedures) {
    const typeColor = proc.type === "query" ? c.green : c.yellow;
    const typeLabel = proc.type === "query" ? "GET " : "POST";
    const accessColor =
      proc.access === "admin"
        ? c.magenta
        : proc.access === "authenticated"
          ? c.blue
          : c.gray;
    const accessLabel = proc.access.padEnd(13);
    const guardLabel = proc.guard
      ? `${c.dim}guard:${c.reset} ${proc.guard}`
      : "";

    log(
      `  ${c.gray}│${c.reset} ${typeColor}${typeLabel}${c.reset}  ${c.white}${proc.procedure.padEnd(22)}${c.reset} ${accessColor}${accessLabel}${c.reset} ${guardLabel}`
    );
  }

  log();
}
