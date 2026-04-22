import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");

// ─── Expected route guards ──────────────────────────────────────────
// Add entry when adding a new guarded route. Test fails if guard is missing.
const EXPECTED_GUARDS: Record<string, string[]> = {
  auth: ["app/(auth)/layout.tsx"],
  blog: ["app/(marketing)/blog/layout.tsx"],
  settings: ["app/(marketing)/settings/layout.tsx"],
  contact: ["app/(marketing)/contact/page.tsx"],
  admin: ["app/admin/layout.tsx"],
  "admin.users": ["app/admin/users/page.tsx", "app/admin/users/[id]/page.tsx"],
  products: ["app/admin/products/page.tsx"],
  media: ["app/admin/media/page.tsx"],
  payments: ["app/checkout/page.tsx", "app/success/page.tsx"],
  cron: ["app/api/cron/route.ts"],
  email: ["services/email/index.ts"],
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

describe("feature route guards", () => {
  for (const [flag, files] of Object.entries(EXPECTED_GUARDS)) {
    for (const file of files) {
      it(`${file} contains isFeatureEnabled("${flag}")`, () => {
        const content = readFile(file);
        expect(content).toContain(`isFeatureEnabled("${flag}")`);
      });
    }
  }

  it("no untracked isFeatureEnabled calls in app/ files", () => {
    const allFiles = findFilesRecursive("app", /\.(tsx?|ts)$/);
    const trackedFiles = new Set(Object.values(EXPECTED_GUARDS).flat());

    const untracked: string[] = [];
    for (const file of allFiles) {
      if (trackedFiles.has(file)) continue;
      const content = readFile(file);
      if (content.includes("isFeatureEnabled(")) {
        untracked.push(file);
      }
    }

    expect(
      untracked,
      `Files with isFeatureEnabled not in EXPECTED_GUARDS: ${untracked.join(", ")}`
    ).toEqual([]);
  });
});
