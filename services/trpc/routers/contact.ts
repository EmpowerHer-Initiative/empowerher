import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { siteConfig } from "@/lib/site";

import { baseProcedure, createTRPCRouter } from "../init";
import { featureGuard } from "../middleware/feature-guard";

export const contactRouter = createTRPCRouter({
  submit: baseProcedure
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
      const apiUrl = process.env.CLIENT_API_URL;
      const apiKey = process.env.CLIENT_API_SECRET;

      if (!apiUrl || !apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Contact API is not configured",
        });
      }

      const response = await fetch(
        `${apiUrl}/api/contact/RREqH17RvSstTXs5UnVl1iFn1151GpZY`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
            metadata: input.phone ? { phone: input.phone } : undefined,
            sourceUrl: siteConfig.url,
          }),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message =
          (body as { error?: string }).error || "Failed to send message";

        if (response.status === 429) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Rate limit exceeded. Please wait a minute and try again.",
          });
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }

      return { success: true };
    }),
});
