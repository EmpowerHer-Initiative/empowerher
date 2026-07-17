import { revalidateTag } from "next/cache";
import { TRPCError } from "@trpc/server";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { teachersTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";

export const staffTeachersRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db.select().from(teachersTable).orderBy(asc(teachersTable.index));
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        headTitle: z.string().min(1).max(255),
        email: z.email().max(255).optional().or(z.literal("")),
        phone: z.string().max(255).optional(),
        avatar: z.string().max(255).optional(),
        description: z.string().optional(),
        role: z
          .enum(["mentor", "executive", "lecturer", "director"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // New members go to the end of the list
        const [{ nextIndex }] = await db
          .select({
            nextIndex: sql<number>`coalesce(max(${teachersTable.index}), -1) + 1`,
          })
          .from(teachersTable);

        const [teacher] = await db
          .insert(teachersTable)
          .values({
            ...input,
            index: nextIndex,
            email: input.email || undefined,
          })
          .returning();
        revalidateTag("teachers", { expire: 0 });
        return teacher;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A teacher with this name or index already exists",
          });
        }
        throw error;
      }
    }),

  reorder: adminProcedure
    .input(z.array(z.number().int()).min(1))
    .mutation(async ({ input }) => {
      // Two-phase update: index has a unique constraint, so park all rows on
      // negative values first, then assign the final positions. Sequential
      // (not a transaction) — the neon-http driver doesn't support them.
      for (const [position, id] of input.entries()) {
        await db
          .update(teachersTable)
          .set({ index: -(position + 1) })
          .where(eq(teachersTable.id, id));
      }
      for (const [position, id] of input.entries()) {
        await db
          .update(teachersTable)
          .set({ index: position })
          .where(eq(teachersTable.id, id));
      }
      revalidateTag("teachers", { expire: 0 });
      return { success: true };
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          name: z.string().min(1).max(255).optional(),
          headTitle: z.string().min(1).max(255).optional(),
          email: z.email().max(255).optional().or(z.literal("")),
          phone: z.string().max(255).optional(),
          avatar: z.string().max(255).optional(),
          description: z.string().optional(),
          role: z
            .enum(["mentor", "executive", "lecturer", "director"])
            .optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      try {
        const [teacher] = await db
          .update(teachersTable)
          .set({ ...data, email: data.email || undefined })
          .where(eq(teachersTable.id, id))
          .returning();
        revalidateTag("teachers", { expire: 0 });
        return teacher;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A teacher with this name or index already exists",
          });
        }
        throw error;
      }
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(teachersTable).where(eq(teachersTable.id, input));
    revalidateTag("teachers", { expire: 0 });
    return { success: true };
  }),
});
