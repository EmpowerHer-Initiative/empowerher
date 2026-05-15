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
