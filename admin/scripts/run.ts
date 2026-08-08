import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const SCRIPTS_DIR = import.meta.dirname;
const ROOT = resolve(SCRIPTS_DIR, "..");

// ─── Script registry ──────────────────────────────────────────────
const scripts = [
  { name: "check-env", desc: "Validate required env vars by feature flag" },
  { name: "list-routes", desc: "Show all tRPC routes" },
  { name: "list-crons", desc: "Show cron jobs from vercel.json" },
];

// ─── ANSI helpers ─────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const maxName = Math.max(...scripts.map((s) => s.name.length));

let selected = 0;

function render() {
  process.stdout.write("\x1b[2J\x1b[H");
  console.log(`\n${c.bold}  Scripts${c.reset}\n`);
  scripts.forEach(({ name, desc }, i) => {
    const pad = " ".repeat(maxName - name.length + 2);
    if (i === selected) {
      console.log(
        `  ${c.cyan}❯${c.reset} ${c.bold}${name}${c.reset}${pad}${c.dim}${desc}${c.reset}`
      );
    } else {
      console.log(`    ${c.dim}${name}${pad}${desc}${c.reset}`);
    }
  });
  console.log(`\n${c.gray}  ↑/↓ move · Enter run · q quit${c.reset}`);
}

function runScript(name: string) {
  process.stdout.write("\x1b[2J\x1b[H");
  process.stdin.setRawMode(false);
  process.stdin.pause();

  const file = resolve(SCRIPTS_DIR, `${name}.ts`);
  console.log(`${c.bold}▶ ${name}${c.reset}\n`);
  const result = spawnSync("tsx", [file], {
    cwd: ROOT,
    stdio: "inherit",
  });
  process.exit(result.status ?? 0);
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf-8");

render();

process.stdin.on("data", (key: string) => {
  if (key === "\u0003" || key === "q") {
    process.stdout.write("\x1b[?25h");
    process.exit(0);
  }

  if (key === "\r") {
    runScript(scripts[selected].name);
    return;
  }

  if (key === "\x1b[A" || key === "k") {
    selected = (selected - 1 + scripts.length) % scripts.length;
    render();
  }

  if (key === "\x1b[B" || key === "j") {
    selected = (selected + 1) % scripts.length;
    render();
  }
});
