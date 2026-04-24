import { db } from "@/services/db/index";
import { verification } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

import { generateId } from "@/lib/utils";

import { baseProcedure, createTRPCRouter } from "../init";

export const verificationRouter = createTRPCRouter({
  get: baseProcedure.input(z.string()).query(async ({ input }) => {
    return db
      .select()
      .from(verification)
      .where(eq(verification.id, input))
      .limit(1)
      .then((result) => result[0]);
  }),

  create: baseProcedure
    .input(
      z.object({
        identifier: z.string().min(1),
        value: z.string(),
        expiresIn: z.number(), // minutes
      })
    )
    .mutation(async ({ input }) => {
      const [verificationResult] = await db
        .insert(verification)
        .values({
          id: generateId(),
          identifier: input.identifier,
          value: input.value,
          expiresAt: new Date(Date.now() + input.expiresIn * 60 * 1000),
        })
        .returning();

      return verificationResult;
    }),

  delete: baseProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.delete(verification).where(eq(verification.id, input));
  }),
});
