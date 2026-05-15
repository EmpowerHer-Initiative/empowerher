import { db } from "@/services/db";
import { activityLog, type ActivityLogMetadata } from "@/services/db/schema";

type LogEntry = {
  type: "email" | "data_change";
  status: "success" | "failed";
  actor?: string;
  summary?: string;
  metadata: ActivityLogMetadata;
  error?: string;
};

export function log(entry: LogEntry) {
  db.insert(activityLog)
    .values({
      type: entry.type,
      status: entry.status,
      actor: entry.actor ?? null,
      summary: entry.summary ?? null,
      metadata: entry.metadata,
      error: entry.error ?? null,
    })
    .catch(() => {});
}
