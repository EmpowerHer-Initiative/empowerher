import { revalidateTag } from "next/cache";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { partnersTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";

export const adminPartnersRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db.select().from(partnersTable).orderBy(asc(partnersTable.index));
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        image: z.string().min(1).max(255),
        link: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      // New partners go to the end of the list
      const [{ nextIndex }] = await db
        .select({
          nextIndex: sql<number>`coalesce(max(${partnersTable.index}), -1) + 1`,
        })
        .from(partnersTable);

      const [partner] = await db
        .insert(partnersTable)
        .values({ ...input, index: nextIndex })
        .returning();
      revalidateTag("partners", { expire: 0 });
      return partner;
    }),

  reorder: adminProcedure
    .input(z.array(z.number().int()).min(1))
    .mutation(async ({ input }) => {
      // Two-phase update: index has a unique constraint, so park all rows on
      // negative values first, then assign the final positions. Sequential
      // (not a transaction) — the neon-http driver doesn't support them.
      for (const [position, id] of input.entries()) {
        await db
          .update(partnersTable)
          .set({ index: -(position + 1) })
          .where(eq(partnersTable.id, id));
      }
      for (const [position, id] of input.entries()) {
        await db
          .update(partnersTable)
          .set({ index: position })
          .where(eq(partnersTable.id, id));
      }
      revalidateTag("partners", { expire: 0 });
      return { success: true };
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          name: z.string().min(1).max(255).optional(),
          image: z.string().min(1).max(255).optional(),
          link: z.string().min(1).max(255).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const [partner] = await db
        .update(partnersTable)
        .set(data)
        .where(eq(partnersTable.id, id))
        .returning();
      revalidateTag("partners", { expire: 0 });
      return partner;
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(partnersTable).where(eq(partnersTable.id, input));
    revalidateTag("partners", { expire: 0 });
    return { success: true };
  }),
});
