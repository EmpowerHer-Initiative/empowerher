import { db } from "@/services/db/index";
import { workshopsTable } from "@/services/db/schema";
import {
  adminProcedure,
  createTRPCRouter,
  staffProcedure,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const staffWorkshopsRouter = createTRPCRouter({
  list: staffProcedure.query(async () => {
    return db
      .select()
      .from(workshopsTable)
      .orderBy(desc(workshopsTable.createdAt));
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1),
        image: z.string().min(1).max(255),
        link: z.string().min(1).max(255),
        classCode: z.string().min(1).max(255),
        mentors: z.array(z.string().max(255)).optional(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [workshop] = await db
          .insert(workshopsTable)
          .values(input)
          .returning();
        return workshop;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A workshop with this name already exists",
          });
        }
        throw error;
      }
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.uuid(),
          name: z.string().min(1).max(255).optional(),
          description: z.string().min(1).optional(),
          image: z.string().min(1).max(255).optional(),
          link: z.string().min(1).max(255).optional(),
          classCode: z.string().min(1).max(255).optional(),
          mentors: z.array(z.string().max(255)).optional(),
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
          .update(workshopsTable)
          .set(data)
          .where(eq(workshopsTable.id, id))
          .returning()
          .then((result) => result[0]);
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A workshop with this name already exists",
          });
        }
        throw error;
      }
    }),

  delete: adminProcedure.input(z.uuid()).mutation(async ({ input }) => {
    await db.delete(workshopsTable).where(eq(workshopsTable.id, input));
    return { success: true };
  }),
});
