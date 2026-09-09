import { and, desc, eq } from "drizzle-orm";

import { db } from "@/services/db/index";
import { commentsTable, type Comment } from "@/services/db/schema";

/**
 * Approved comments for a blog, newest first. `slug` is the stored `blogName`
 * — the full path `/hervoice/<slug>` (see the marketing site's keying).
 * Shared by the public tRPC `comments.getBlogComments` and the REST
 * `GET /api/comments` route so both behave identically.
 */
export async function getApprovedComments(slug: string): Promise<Comment[]> {
  return db
    .select()
    .from(commentsTable)
    .where(
      and(
        eq(commentsTable.blogName, slug),
        eq(commentsTable.status, "approved"),
      ),
    )
    .orderBy(desc(commentsTable.createdAt));
}

/**
 * Inserts a comment as "pending" — moderation happens in the admin panel.
 * Callers own rate-limiting and validation. Shared by the public tRPC
 * `comments.add` mutation and the REST `POST /api/comments` route.
 */
export async function addComment(input: {
  from: string;
  blogName: string;
  message: string;
}): Promise<void> {
  await db.insert(commentsTable).values(input);
}
