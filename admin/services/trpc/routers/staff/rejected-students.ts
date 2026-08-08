import { createElement } from "react";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { siteConfig } from "@/lib/site";
import { db } from "@/services/db/index";
import { rejectedStudentsTable, studentsTable } from "@/services/db/schema";
import { email } from "@/services/email";
import RejectStudentEmail from "@/services/email/emails/reject-student";
import { createTRPCRouter, staffProcedure } from "@/services/trpc/init";

const LIMIT_SEND_REJECTION_EMAIL = 20;

export const staffRejectedStudentsRouter = createTRPCRouter({
  list: staffProcedure
    .input(z.object({ period: z.number().int().min(1).default(1) }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(rejectedStudentsTable)
        .where(eq(rejectedStudentsTable.period, input.period))
        .orderBy(desc(rejectedStudentsTable.createdAt));
    }),

  create: staffProcedure
    .input(
      z.object({
        email: z.email().max(255),
        period: z.number().int().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedEmail = input.email.trim().toLowerCase();

      const [student] = await db
        .select()
        .from(studentsTable)
        .where(
          and(
            eq(studentsTable.email, normalizedEmail),
            eq(studentsTable.period, input.period)
          )
        )
        .limit(1);

      if (student) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Student already exists in Accepted Students Table - ${student.name}`,
        });
      }

      try {
        const [rejected] = await db
          .insert(rejectedStudentsTable)
          .values({ email: normalizedEmail, period: input.period })
          .returning();
        return rejected;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This email is already in the rejected list for this period",
          });
        }
        throw error;
      }
    }),

  delete: staffProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db
      .delete(rejectedStudentsTable)
      .where(eq(rejectedStudentsTable.id, input));
    return { success: true };
  }),

  sendRejectionEmails: staffProcedure
    .input(z.object({ period: z.number().int().min(1) }))
    .mutation(async ({ input }) => {
      const unsentCondition = and(
        eq(rejectedStudentsTable.period, input.period),
        eq(rejectedStudentsTable.emailSent, false)
      );

      const [{ count: totalUnsent }] = await db
        .select({ count: count() })
        .from(rejectedStudentsTable)
        .where(unsentCondition);

      if (totalUnsent === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No unsent rejection emails for this period",
        });
      }

      const recipients = await db
        .select()
        .from(rejectedStudentsTable)
        .where(unsentCondition)
        .orderBy(desc(rejectedStudentsTable.createdAt))
        .limit(LIMIT_SEND_REJECTION_EMAIL);

      let sent = 0;
      const failed: string[] = [];

      for (const recipient of recipients) {
        const result = await email.send({
          from: siteConfig.applyEmail,
          to: recipient.email,
          subject: "Update on Your EmpowerHer Application",
          react: createElement(RejectStudentEmail),
        });

        if ("error" in result) {
          failed.push(recipient.email);
          continue;
        }

        await db
          .update(rejectedStudentsTable)
          .set({
            emailSent: true,
            emailSentAt: new Date(),
            emailId: result.data.id,
          })
          .where(eq(rejectedStudentsTable.id, recipient.id));
        sent++;
      }

      return { sent, failed, remaining: totalUnsent - sent };
    }),
});
