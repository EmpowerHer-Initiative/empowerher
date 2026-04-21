import { exampleJob } from "./jobs/example";

// ─── Cron Job Registry ──────────────────────────────────────────────
// Add a job:    1. Create a file in ./jobs/  2. Import + add here
// Remove a job: Delete its entry + file
export const cronJobs: Record<string, () => Promise<unknown>> = {
  example: exampleJob,
};
