import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const SCRIPTS_DIR = import.meta.dirname;
const SELF = "run.ts";

const scripts = readdirSync(SCRIPTS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== SELF)
  .map((f) => f.replace(".ts", ""));

let selected = 0;

function render() {
  process.stdout.write("\x1b[2J\x1b[H");
  console.log("\n\x1b[1m📋 Available scripts\x1b[0m\n");
  scripts.forEach((name, i) => {
    if (i === selected) {
      console.log(`  \x1b[36m❯\x1b[0m \x1b[1m${name}\x1b[0m`);
    } else {
      console.log(`    \x1b[2m${name}\x1b[0m`);
    }
  });
  console.log("\n\x1b[2m↑/↓ to move · Enter to run · q to quit\x1b[0m");
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
    process.stdout.write("\x1b[2J\x1b[H");
    process.stdin.setRawMode(false);
    process.stdin.pause();

    const script = scripts[selected];
    const file = resolve(SCRIPTS_DIR, `${script}.ts`);
    console.log(`\x1b[1m▶ Running: ${script}\x1b[0m\n`);
    try {
      execSync(`tsx ${file}`, {
        cwd: resolve(SCRIPTS_DIR, ".."),
        stdio: "inherit",
      });
    } catch {
      process.exit(1);
    }
    process.exit(0);
  }

  // Arrow up
  if (key === "\x1b[A" || key === "k") {
    selected = (selected - 1 + scripts.length) % scripts.length;
    render();
  }

  // Arrow down
  if (key === "\x1b[B" || key === "j") {
    selected = (selected + 1) % scripts.length;
    render();
  }
});
