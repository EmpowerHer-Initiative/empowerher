import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

const config: Record<string, unknown> = JSON.parse(
  readFileSync(resolve(ROOT, "config/config.json"), "utf-8"),
);

// Parse FEATURE_ENV_MAP keys from check-env.ts source
function getEnvMapKeys(): string[] {
  const source = readFileSync(
    resolve(ROOT, "scripts/check-env.ts"),
    "utf-8",
  );
  const mapMatch = source.match(
    /FEATURE_ENV_MAP[^{]*\{([\s\S]*?)^};/m,
  );
  if (!mapMatch) throw new Error("Could not parse FEATURE_ENV_MAP");

  const keys: string[] = [];
  const keyRegex = /^\s*(\w+)\s*:/gm;
  let match;
  while ((match = keyRegex.exec(mapMatch[1])) !== null) {
    if (match[1] !== "_always") keys.push(match[1]);
  }
  return keys;
}

// Get top-level config keys (excluding nested object children)
function getTopLevelConfigKeys(): string[] {
  return Object.keys(config);
}

const envMapKeys = getEnvMapKeys();
const configKeys = getTopLevelConfigKeys();

describe("env ↔ config sync", () => {
  it("every FEATURE_ENV_MAP key exists in config.json", () => {
    const missing = envMapKeys.filter((key) => !configKeys.includes(key));
    expect(
      missing,
      `FEATURE_ENV_MAP keys not in config.json: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every .env.example var is tracked in FEATURE_ENV_MAP", () => {
    const envExample = readFileSync(
      resolve(ROOT, ".env.example"),
      "utf-8",
    );
    const envVars = envExample
      .split("\n")
      .filter((line) => /^[A-Z_]+=/.test(line))
      .map((line) => line.split("=")[0]);

    const envMapSource = readFileSync(
      resolve(ROOT, "scripts/check-env.ts"),
      "utf-8",
    );

    const untracked = envVars.filter(
      (v) => !envMapSource.includes(`"${v}"`),
    );

    expect(
      untracked,
      `.env.example vars not in FEATURE_ENV_MAP: ${untracked.join(", ")}`,
    ).toEqual([]);
  });
});
