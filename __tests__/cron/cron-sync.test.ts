import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const JOBS_DIR = resolve(ROOT, "services/cron/jobs");

function getJobFileNames(): string[] {
  return readdirSync(JOBS_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => f.replace(".ts", ""));
}

function getVercelCronJobNames(): string[] {
  const vercelJson = JSON.parse(
    readFileSync(resolve(ROOT, "vercel.json"), "utf-8"),
  );
  return (vercelJson.crons ?? []).map(
    (cron: { path: string }) =>
      new URL(cron.path, "http://localhost").searchParams.get("job")!,
  );
}

describe("cron job sync", () => {
  const jobFiles = getJobFileNames();
  const vercelJobs = getVercelCronJobNames();

  it("every job file has a matching vercel.json cron entry", () => {
    const missing = jobFiles.filter((name) => !vercelJobs.includes(name));
    expect(missing, `Job files missing from vercel.json: ${missing.join(", ")}`).toEqual([]);
  });

  it("every vercel.json cron entry has a matching job file", () => {
    const extra = vercelJobs.filter((name) => !jobFiles.includes(name));
    expect(extra, `vercel.json entries without job files: ${extra.join(", ")}`).toEqual([]);
  });

  it("job files directory is not empty", () => {
    expect(jobFiles.length).toBeGreaterThan(0);
  });

  it("vercel.json crons array is not empty", () => {
    expect(vercelJobs.length).toBeGreaterThan(0);
  });
});
