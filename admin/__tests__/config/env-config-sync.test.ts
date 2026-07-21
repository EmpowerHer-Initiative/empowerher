import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

describe("env ↔ check-env sync", () => {
  it("every .env.example var is tracked in FEATURE_ENV_MAP", () => {
    const envExample = readFileSync(resolve(ROOT, ".env.example"), "utf-8");
    const envVars = envExample
      .split("\n")
      .filter((line) => /^[A-Z_]+=/.test(line))
      .map((line) => line.split("=")[0]);

    const envMapSource = readFileSync(
      resolve(ROOT, "scripts/check-env.ts"),
      "utf-8"
    );

    const untracked = envVars.filter((v) => !envMapSource.includes(`"${v}"`));

    expect(
      untracked,
      `.env.example vars not in FEATURE_ENV_MAP: ${untracked.join(", ")}`
    ).toEqual([]);
  });
});
