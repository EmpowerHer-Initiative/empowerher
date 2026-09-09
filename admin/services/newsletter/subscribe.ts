import { eq } from "drizzle-orm";

import { db } from "@/services/db/index";
import {
  allStudentsTable,
  rejectedStudentsTable,
  studentsTable,
} from "@/services/db/schema";
import { addNewsletterContact } from "@/services/newsletter/usesend-contacts";

/**
 * Dedupes an email against the full roster (accepted, rejected, newsletter),
 * then inserts it into all_students. Callers own rate-limiting and validation.
 * Shared by the public tRPC `newsletter.subscribe` mutation and the REST
 * `POST /api/newsletter` route so both behave identically.
 */
export async function subscribeEmail(
  rawEmail: string,
): Promise<{ alreadySubscribed: boolean }> {
  const email = rawEmail.trim().toLowerCase();

  for (const table of [studentsTable, rejectedStudentsTable, allStudentsTable]) {
    const [existing] = await db
      .select({ email: table.email })
      .from(table)
      .where(eq(table.email, email))
      .limit(1);

    if (existing) {
      // Still sync to useSend so already-rostered emails land in the contact
      // book too (upsert by email; safe to repeat).
      await addNewsletterContact(email);
      return { alreadySubscribed: true };
    }
  }

  await db.insert(allStudentsTable).values({ email }).onConflictDoNothing();
  await addNewsletterContact(email);

  return { alreadySubscribed: false };
}
