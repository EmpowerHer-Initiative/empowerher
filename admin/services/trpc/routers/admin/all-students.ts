import { TRPCError } from "@trpc/server";
import { count, desc, eq, ilike, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import {
  allStudentsTable,
  rejectedStudentsTable,
  studentsTable,
} from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";

// The roster spans three tables (accepted, rejected, newsletter). The same
// email can appear in several of them (and across periods) with different
// createdAt values and casing, so a plain UNION still yields duplicate rows.
// Normalize emails and group to one row per email, keeping the latest date.
const unionSubquery = () => {
  const rows = db
    .select({
      email: sql<string>`lower(trim(${studentsTable.email}))`.as("email"),
      createdAt: studentsTable.createdAt,
    })
    .from(studentsTable)
    .where(isNotNull(studentsTable.email))
    .union(
      db
        .select({
          email: sql<string>`lower(trim(${rejectedStudentsTable.email}))`.as(
            "email"
          ),
          createdAt: rejectedStudentsTable.createdAt,
        })
        .from(rejectedStudentsTable)
    )
    .union(
      db
        .select({
          email: sql<string>`lower(trim(${allStudentsTable.email}))`.as(
            "email"
          ),
          createdAt: allStudentsTable.createdAt,
        })
        .from(allStudentsTable)
    )
    .as("all_students_rows");

  return db
    .select({
      email: rows.email,
      createdAt: sql`max(${rows.createdAt})`
        .mapWith(allStudentsTable.createdAt)
        .as("created_at"),
    })
    .from(rows)
    .groupBy(rows.email)
    .as("all_students_union");
};

export const adminAllStudentsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search } = input;
      const union = unionSubquery();

      return db
        .select()
        .from(union)
        .where(search ? ilike(union.email, `%${search}%`) : undefined)
        .orderBy(desc(union.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
    }),

  count: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const union = unionSubquery();

      return db
        .select({ count: count() })
        .from(union)
        .where(
          input.search ? ilike(union.email, `%${input.search}%`) : undefined
        )
        .then((result) => result[0]?.count ?? 0);
    }),

  // On-demand only (copy-to-clipboard action) — never fetched on page load.
  listEmails: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const union = unionSubquery();

      const rows = await db
        .select({ email: union.email })
        .from(union)
        .where(
          input.search ? ilike(union.email, `%${input.search}%`) : undefined
        )
        .orderBy(desc(union.createdAt));

      return rows.map((row) => row.email).filter(Boolean);
    }),

  add: adminProcedure
    .input(z.object({ email: z.email().max(255) }))
    .mutation(async ({ input }) => {
      const normalizedEmail = input.email.trim().toLowerCase();

      const [rejected] = await db
        .select()
        .from(rejectedStudentsTable)
        .where(eq(rejectedStudentsTable.email, normalizedEmail))
        .limit(1);

      const [student] = await db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.email, normalizedEmail))
        .limit(1);

      if (rejected || student) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Student already exists",
        });
      }

      try {
        const [added] = await db
          .insert(allStudentsTable)
          .values({ email: normalizedEmail })
          .returning();
        return added;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Student already exists",
          });
        }
        throw error;
      }
    }),

  bulkInsert: adminProcedure
    .input(z.array(z.email()).min(1))
    .mutation(async ({ input }) => {
      const emails = Array.from(
        new Set(input.map((value) => value.trim().toLowerCase()))
      );

      const inserted = await db
        .insert(allStudentsTable)
        .values(emails.map((value) => ({ email: value })))
        .onConflictDoNothing()
        .returning({ id: allStudentsTable.id });

      return {
        inserted: inserted.length,
        skipped: emails.length - inserted.length,
      };
    }),
});
