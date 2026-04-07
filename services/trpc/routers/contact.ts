import { db } from "@/services/db/index";
import { contactMessages } from "@/services/db/schema";
import { sendEmail } from "@/services/email/index";
import { z } from "zod";

import { agencyConfig, siteConfig } from "@/lib/site";

import { baseProcedure, createTRPCRouter } from "../init";
import { getIp, rateLimit } from "../middleware/rate-limit";

export const contactRouter = createTRPCRouter({
  submit: baseProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        email: z.email(),
        phone: z.string().max(20).optional().or(z.literal("")),
        message: z.string().min(10).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      await rateLimit(2, 60000);

      const ip = await getIp();

      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
        ipAddress: ip,
      });

      await sendEmail(
        "contactMessage",
        siteConfig.email,
        {
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
        },
        { from: agencyConfig.email }
      );

      return { success: true };
    }),
});
