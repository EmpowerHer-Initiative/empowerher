import { drizzle } from "drizzle-orm/neon-http";

import { isFeatureEnabled } from "@/config/features";

if (isFeatureEnabled("auth") && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = process.env.DATABASE_URL
  ? drizzle(process.env.DATABASE_URL)
  : (null as unknown as ReturnType<typeof drizzle>);
