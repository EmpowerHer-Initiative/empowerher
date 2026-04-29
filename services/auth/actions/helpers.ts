import { db } from "@/services/db/index";
import { user } from "@/services/db/schema";
import { eq } from "drizzle-orm";

export async function findUserByCustomerId(customerId: string) {
  return db
    .select()
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1)
    .then((res) => res[0]);
}
