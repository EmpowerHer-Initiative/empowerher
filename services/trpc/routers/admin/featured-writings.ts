import { db } from "@/services/db/index";
import { featuredWritingsTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const adminFeaturedWritingsRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db
      .select()
      .from(featuredWritingsTable)
      .orderBy(desc(featuredWritingsTable.createdAt));
  }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1),
        image: z.string().min(1).max(255),
        link: z.string().min(1).max(255),
        from: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const [writing] = await db
        .insert(featuredWritingsTable)
        .values(input)
        .returning();
      return writing;
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().min(1).optional(),
          image: z.string().min(1).max(255).optional(),
          link: z.string().min(1).max(255).optional(),
          from: z.string().min(1).max(255).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return db
        .update(featuredWritingsTable)
        .set(data)
        .where(eq(featuredWritingsTable.id, id))
        .returning()
        .then((result) => result[0]);
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db
      .delete(featuredWritingsTable)
      .where(eq(featuredWritingsTable.id, input));
    return { success: true };
  }),
});
