import { db } from "@/services/db/index";
import { resourcesTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const adminResourcesRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db
      .select()
      .from(resourcesTable)
      .orderBy(desc(resourcesTable.createdAt));
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1),
        image: z.string().min(1),
        link: z.string().min(1),
        location: z.string().min(1),
        deadline: z.string().max(255).optional(),
        status: z.enum(["active", "expired", "remote"]).optional(),
        type: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [resource] = await db
        .insert(resourcesTable)
        .values(input)
        .returning();
      return resource;
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          name: z.string().min(1).max(255).optional(),
          description: z.string().min(1).optional(),
          image: z.string().min(1).optional(),
          link: z.string().min(1).optional(),
          location: z.string().min(1).optional(),
          deadline: z.string().max(255).optional(),
          status: z.enum(["active", "expired", "remote"]).optional(),
          type: z.string().max(255).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return db
        .update(resourcesTable)
        .set(data)
        .where(eq(resourcesTable.id, id))
        .returning()
        .then((result) => result[0]);
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(resourcesTable).where(eq(resourcesTable.id, input));
    return { success: true };
  }),
});
