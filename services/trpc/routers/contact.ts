import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { siteConfig } from "@/lib/site";

import { baseProcedure, createTRPCRouter } from "../init";
import { featureGuard } from "../middleware/feature-guard";

export const contactRouter = createTRPCRouter({
  create: baseProcedure
    .use(featureGuard("contact"))
    .input(
      z.object({
        name: z.string().min(1).max(200),
        email: z.email(),
        subject: z.string().min(1).max(500),
        phone: z.string().max(20).optional().or(z.literal("")),
        message: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const incomingHeaders = await headers();
      const origin =
        incomingHeaders.get("origin") ||
        incomingHeaders.get("referer") ||
        siteConfig.url;

      const response = await fetch(`https://www.alisamadii.com/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
          metadata: input.phone ? { phone: input.phone } : undefined,
          sourceUrl: siteConfig.url,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const serverMessage = (body as { error?: string })?.error;

        console.error("[contact] API error:", response.status, serverMessage);

        if (response.status === 429) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message:
              serverMessage ||
              "Rate limit exceeded. Please wait a minute and try again.",
          });
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: serverMessage || "Failed to send message",
        });
      }

      return { success: true };
    }),
});
