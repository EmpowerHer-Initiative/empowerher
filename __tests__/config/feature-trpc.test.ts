import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

// ─── Expected tRPC feature guards ───────────────────────────────────
// Add entry when adding featureGuard to a tRPC router.
const EXPECTED_TRPC_GUARDS: Record<string, string[]> = {
  contact: ["services/trpc/routers/contact.ts"],
  discounts: ["services/trpc/routers/discounts.ts"],
  payments: ["services/trpc/routers/billing.ts"],
  products: ["services/trpc/routers/products.ts"],
  upload: ["services/trpc/routers/files.ts"],
  admin: ["services/trpc/routers/admin/overview.ts"],
  media: ["services/trpc/routers/files.ts"],
  "admin.users": ["services/trpc/routers/users.ts"],
};

function readFile(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), "utf-8");
}

function findFilesRecursive(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  const entries = readdirSync(resolve(ROOT, dir), { withFileTypes: true });
  for (const entry of entries) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      results.push(...findFilesRecursive(path, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(path);
    }
  }
  return results;
}

describe("tRPC feature guards", () => {
  for (const [flag, files] of Object.entries(EXPECTED_TRPC_GUARDS)) {
    for (const file of files) {
      it(`${file} contains featureGuard("${flag}")`, () => {
        const content = readFile(file);
        expect(content).toContain(`featureGuard("${flag}")`);
      });
    }
  }

  it("no untracked featureGuard calls in tRPC routers", () => {
    const allFiles = findFilesRecursive("services/trpc/routers", /\.ts$/);
    const trackedFiles = new Set(Object.values(EXPECTED_TRPC_GUARDS).flat());

    const untracked: string[] = [];
    for (const file of allFiles) {
      if (trackedFiles.has(file)) continue;
      const content = readFile(file);
      if (content.includes("featureGuard(")) {
        untracked.push(file);
      }
    }

    expect(
      untracked,
      `Router files with featureGuard not in EXPECTED_TRPC_GUARDS: ${untracked.join(", ")}`
    ).toEqual([]);
  });
});
