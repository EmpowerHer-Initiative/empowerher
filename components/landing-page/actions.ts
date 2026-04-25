"use server";

import { sendEmail } from "@/services/email";

export async function sendTestEmail() {
  const result = await sendEmail("verifyEmail", "alisamadi0583@gmail.com", {
    verificationCode: "TEST-123456",
  });

  if ("error" in result) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
