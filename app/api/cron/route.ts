import { isFeatureEnabled } from "@/config/features";
import { cronJobs } from "@/services/cron";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!isFeatureEnabled("cron")) {
    return NextResponse.json({ error: "Cron is disabled" }, { status: 404 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobName = req.nextUrl.searchParams.get("job");

  if (jobName) {
    const job = cronJobs[jobName];
    if (!job) {
      return NextResponse.json({ error: `Job "${jobName}" not found` }, { status: 404 });
    }
    const result = await job();
    return NextResponse.json({ job: jobName, result });
  }

  // No job specified — run all
  const results: Record<string, unknown> = {};
  for (const [name, job] of Object.entries(cronJobs)) {
    results[name] = await job();
  }
  return NextResponse.json({ results });
}
