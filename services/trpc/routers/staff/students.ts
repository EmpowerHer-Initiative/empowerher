import { createElement } from "react";
import { db } from "@/services/db/index";
import {
  rejectedStudentsTable,
  studentsTable,
  workshopsTable,
} from "@/services/db/schema";
import { email } from "@/services/email";
import ApproveStudentEmail from "@/services/email/emails/approve-student";
import { createTRPCRouter, staffProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

export const staffStudentsRouter = createTRPCRouter({
  list: staffProcedure
    .input(z.object({ period: z.number().int().min(1).default(1) }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.period, input.period))
        .orderBy(asc(studentsTable.workshopId), asc(studentsTable.createdAt));
    }),

  create: staffProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.email().max(255),
        workshopId: z.uuid(),
        period: z.number().int().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedEmail = input.email.trim().toLowerCase();

      const [rejected] = await db
        .select()
        .from(rejectedStudentsTable)
        .where(
          and(
            eq(rejectedStudentsTable.email, normalizedEmail),
            eq(rejectedStudentsTable.period, input.period)
          )
        )
        .limit(1);

      if (rejected) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Student already exists in Rejected Students Table - ${rejected.email} (${rejected.period})`,
        });
      }

      try {
        const [student] = await db
          .insert(studentsTable)
          .values({ ...input, email: normalizedEmail })
          .returning();
        return student;
      } catch (error) {
        if (String(error).toLowerCase().includes("duplicate key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A student with this email already exists in this period",
          });
        }
        throw error;
      }
    }),

  update: staffProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          name: z.string().min(1).max(255).optional(),
          email: z.email().max(255).optional(),
          workshopId: z.uuid().optional(),
          period: z.number().int().min(1).optional(),
          status: z.enum(["pending", "approved"]).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return db
        .update(studentsTable)
        .set(data)
        .where(eq(studentsTable.id, id))
        .returning()
        .then((result) => result[0]);
    }),

  delete: staffProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(studentsTable).where(eq(studentsTable.id, input));
    return { success: true };
  }),

  sendApprovalEmail: staffProcedure
    .input(
      z.object({
        id: z.number().int(),
        dueDate: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const [student] = await db
        .select({
          id: studentsTable.id,
          name: studentsTable.name,
          email: studentsTable.email,
          workshopName: workshopsTable.name,
          classCode: workshopsTable.classCode,
        })
        .from(studentsTable)
        .innerJoin(
          workshopsTable,
          eq(studentsTable.workshopId, workshopsTable.id)
        )
        .where(eq(studentsTable.id, input.id))
        .limit(1);

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      if (!student.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Student has no email address",
        });
      }

      const result = await email.send({
        to: student.email,
        subject: `Congratulations! You've been accepted into EmpowerHer's ${student.workshopName}`,
        react: createElement(ApproveStudentEmail, {
          name: student.name,
          workshopName: student.workshopName,
          googleClassroomCode: student.classCode,
          dueDate: input.dueDate,
        }),
      });

      if ("error" in result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send approval email. Please try again.",
        });
      }

      // SES does not return a message id through our wrapper; emailId acts as
      // a "sent" marker the UI uses to show the approved state.
      const [updated] = await db
        .update(studentsTable)
        .set({ status: "approved", emailId: new Date().toISOString() })
        .where(eq(studentsTable.id, input.id))
        .returning();

      return updated;
    }),
});
