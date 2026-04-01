// [TRIGGER.DEV] — Remove this file when removing Trigger.dev from the project.
import { db } from "@/services/db";
import { appointments } from "@/services/db/schema";
import { sendEmail } from "@/services/email";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { and, eq, gte, isNull, lte } from "drizzle-orm";

const formatDate = (date: Date) =>
  date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

export const appointmentReminderTask = schedules.task({
  id: "appointment-reminder",
  cron: "* * * * *", // every minute (change to "0 * * * *" for production)
  maxDuration: 60,
  run: async (payload) => {
    const now = payload.timestamp;
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find all appointments in the next 24 hours that haven't been reminded yet
    const upcoming = await db
      .select()
      .from(appointments)
      .where(
        and(
          isNull(appointments.reminderSentAt),
          gte(appointments.scheduledAt, now),
          lte(appointments.scheduledAt, in24h)
        )
      );

    logger.log(`Found ${upcoming.length} appointment(s) to remind`);

    const results = await Promise.allSettled(
      upcoming.map(async (appointment) => {
        const result = await sendEmail(
          "appointmentReminder",
          appointment.userEmail,
          {
            userName: appointment.userName,
            title: appointment.title,
            description: appointment.description ?? undefined,
            scheduledAt: formatDate(appointment.scheduledAt),
          }
        );

        if (result.error) {
          throw new Error(
            `Failed to send reminder to ${appointment.userEmail}: ${result.error}`
          );
        }

        // Mark as reminded so it doesn't get sent again
        await db
          .update(appointments)
          .set({ reminderSentAt: now })
          .where(eq(appointments.id, appointment.id));

        logger.log(`Reminder sent`, {
          to: appointment.userEmail,
          title: appointment.title,
        });

        return { email: appointment.userEmail, title: appointment.title };
      })
    );

    const succeeded = results
      .filter(
        (r): r is PromiseFulfilledResult<{ email: string; title: string }> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);

    const failed = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => {
        const message: string =
          r.reason instanceof Error ? r.reason.message : String(r.reason);
        const email = message.match(/to (.+?):/)?.[1] ?? "unknown";
        logger.error(message);
        return { email, reason: message };
      });

    return { sent: succeeded, failed, total: upcoming.length };
  },
});
