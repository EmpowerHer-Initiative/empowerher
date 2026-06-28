"use server";

import { createElement } from "react";
import { email } from "@/services/email";
import PartnerEmail from "@/services/email/emails/partner-with-us";
import VolunteerEmail from "@/services/email/emails/volunteer-with-us";
import { rateLimit } from "@/services/trpc/middleware/rate-limit";
import { z } from "zod";

import { siteConfig } from "@/lib/site";

type ActionResult = { success: true } | { error: string };

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

const partnerSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  businessEmail: z.email(),
  position: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function submitPartner(
  input: z.infer<typeof partnerSchema>
): Promise<ActionResult> {
  const parsed = partnerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fill in all required fields correctly." };
  }

  try {
    await rateLimit(3, "1h");
  } catch {
    return { error: "Too many submissions. Please try again later." };
  }

  const d = parsed.data;
  const result = await email.send({
    to: siteConfig.email,
    subject: `New Partner Submission - ${d.firstName} ${d.lastName}`,
    react: createElement(PartnerEmail, {
      firstName: d.firstName,
      lastName: d.lastName,
      businessEmailAddress: d.businessEmail,
      position: d.position,
      organization: d.organization,
      message: d.message,
    }),
  });

  if ("error" in result) {
    return { error: "Failed to send your inquiry. Please try again." };
  }
  return { success: true };
}

const volunteerSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.email(),
  message: z.string().min(1).max(5000),
});

export async function submitVolunteer(
  formData: FormData
): Promise<ActionResult> {
  const parsed = volunteerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: "Please fill in all required fields correctly." };
  }

  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please attach your CV / Resume (PDF)." };
  }
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return { error: "Your CV must be a PDF file." };
  }
  if (file.size > MAX_CV_BYTES) {
    return { error: "Your CV is too large. Maximum size is 5 MB." };
  }

  try {
    await rateLimit(3, "1h");
  } catch {
    return { error: "Too many submissions. Please try again later." };
  }

  const d = parsed.data;
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await email.send({
    to: siteConfig.email,
    subject: `New Volunteer Submission - ${d.firstName} ${d.lastName}`,
    react: createElement(VolunteerEmail, {
      firstName: d.firstName,
      lastName: d.lastName,
      businessEmailAddress: d.email,
      message: d.message,
    }),
    attachments: [
      {
        filename: file.name || `${d.firstName}-${d.lastName}-CV.pdf`,
        content: buffer,
        contentType: "application/pdf",
      },
    ],
  });

  if ("error" in result) {
    return { error: "Failed to send your application. Please try again." };
  }
  return { success: true };
}
