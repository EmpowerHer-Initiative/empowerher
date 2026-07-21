"use server";

import { email } from "@/services/email";
import VerifyEmail from "@/services/email/emails/verify-email";

export async function sendTestEmail() {
  return email.send({
    to: "alisamadi0583@gmail.com",
    subject: "Test email",
    react: <VerifyEmail verificationCode="TEST-123456" />,
  });
}

export async function sendTestEmailWithAttachment(formData: FormData) {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { error: "No file provided" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return email.send({
    to: "alisamadi0583@gmail.com",
    subject: "Test email with attachment",
    react: <VerifyEmail verificationCode="ATTACHMENT-TEST" />,
    attachments: [
      {
        filename: file.name,
        content: buffer,
        contentType: file.type || "application/octet-stream",
      },
    ],
  });
}
