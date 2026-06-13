import { db } from "@/services/db/index";
import { projectsTable } from "@/services/db/schema";
import {
  adminProcedure,
  createTRPCRouter,
  staffProcedure,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const staffProjectsRouter = createTRPCRouter({
  list: staffProcedure.query(async () => {
    return db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.createdAt));
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1),
        image: z.string().min(1).max(255),
        link: z.string().min(1).max(255),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [project] = await db
          .insert(projectsTable)
          .values(input)
          .returning();
        return project;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A project with this name already exists",
          });
        }
        throw error;
      }
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          name: z.string().min(1).max(255).optional(),
          description: z.string().min(1).optional(),
          image: z.string().min(1).max(255).optional(),
          link: z.string().min(1).max(255).optional(),
          status: z.enum(["pending", "approved", "rejected"]).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      try {
        return await db
          .update(projectsTable)
          .set(data)
          .where(eq(projectsTable.id, id))
          .returning()
          .then((result) => result[0]);
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A project with this name already exists",
          });
        }
        throw error;
      }
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(projectsTable).where(eq(projectsTable.id, input));
    return { success: true };
  }),
});
