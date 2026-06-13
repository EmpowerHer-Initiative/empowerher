import { db } from "@/services/db/index";
import { teachersTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const staffTeachersRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    // Custom order: executive > director > mentor > lecturer
    return db
      .select()
      .from(teachersTable)
      .orderBy(
        sql`CASE
          WHEN ${teachersTable.role} = 'executive' THEN 1
          WHEN ${teachersTable.role} = 'director' THEN 2
          WHEN ${teachersTable.role} = 'mentor' THEN 3
          WHEN ${teachersTable.role} = 'lecturer' THEN 4
          ELSE 5
        END`,
        asc(teachersTable.index)
      );
  }),

  create: adminProcedure
    .input(
      z.object({
        index: z.number().int(),
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
        const [teacher] = await db
          .insert(teachersTable)
          .values({ ...input, email: input.email || undefined })
          .returning();
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

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          index: z.number().int().optional(),
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
        return await db
          .update(teachersTable)
          .set({ ...data, email: data.email || undefined })
          .where(eq(teachersTable.id, id))
          .returning()
          .then((result) => result[0]);
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
    return { success: true };
  }),
});
