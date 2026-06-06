import { createElement } from "react";
import { headers } from "next/headers";
import { email } from "@/services/email";
import ContactFormEmail from "@/services/email/emails/contact-form";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";
import { z } from "zod";

import { siteConfig } from "@/lib/site";

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 submission per minute per IP

export const contactRouter = createTRPCRouter({
  send: baseProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        email: z.string().email(),
        subject: z.string().min(1).max(500),
        phone: z.string().max(20).optional().or(z.literal("")),
        message: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const h = await headers();

      const ipAddress =
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        "Unknown";
      const userAgent = h.get("user-agent") ?? "Unknown";
      const referer = h.get("referer") ?? undefined;
      const submittedAt = new Date().toISOString();

      // Rate limit by IP
      const lastSent = rateLimitMap.get(ipAddress);
      if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
        throw new Error("Please wait before sending another message.");
      }
      rateLimitMap.set(ipAddress, Date.now());

      const result = await email.send({
        to: siteConfig.email,
        subject: `Contact: ${input.subject}`,
        react: createElement(ContactFormEmail, {
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
          phone: input.phone || undefined,
          ipAddress,
          userAgent,
          referer,
          submittedAt,
        }),
      });

      if ("error" in result) {
        throw new Error("Failed to send message. Please try again.");
      }

      return { success: true };
    }),
});
