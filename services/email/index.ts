// packages/email/index.ts
import { createElement } from "react";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

import { isFeatureEnabled } from "@/config/features";
import { siteConfig } from "@/lib/site";

import ResetPassword from "./emails/reset-password";
import VerifyEmail from "./emails/verify-email";
import { renderEmail, renderText } from "./utils";

type TemplateProps = {
  verifyEmail: { verificationCode: string };
  resetPassword: { resetPasswordLink: string };
};

// Template registry — add new emails here, that's it
type EmailTemplate = {
  subject: string | ((props: Record<string, unknown>) => string);
  fromLabel: string;
  component: React.ComponentType<Record<string, unknown>>;
};

export const templates: Record<string, EmailTemplate> = {
  verifyEmail: {
    subject: "Verify your email",
    fromLabel: "Verify your email",
    component: VerifyEmail,
  },
  resetPassword: {
    subject: "Reset your password",
    fromLabel: "Reset your password",
    component: ResetPassword,
  },
};

let sesClient: SESClient | null = null;

function getSesClient() {
  if (!sesClient) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_VALUE;
    const secretAccessKey = process.env.AWS_SECRET_KEY_VALUE;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("Missing AWS credentials in environment variables");
    }

    sesClient = new SESClient({
      region: process.env.AWS_BUCKET_ORIGIN || "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return sesClient;
}

const defaultFrom = siteConfig.noreplyEmail;

// One function to rule them all
export async function sendEmail<T extends keyof TemplateProps>(
  template: T,
  to: string | string[],
  props: TemplateProps[T],
  options?: { from?: string }
) {
  if (!isFeatureEnabled("email")) {
    return { error: "Email service is not enabled" };
  }

  const { subject, fromLabel, component } = templates[template];
  const resolvedSubject =
    typeof subject === "function"
      ? subject(props as Record<string, unknown>)
      : subject;
  const fromAddress = options?.from ?? defaultFrom;
  const toAddresses = Array.isArray(to) ? to : [to];
  const element = createElement(component, props);
  const htmlContent = await renderEmail(element);
  const textContent = await renderText(element);

  try {
    await getSesClient().send(
      new SendEmailCommand({
        Source: `${fromLabel} <${fromAddress}>`,
        Destination: { ToAddresses: toAddresses },
        Message: {
          Subject: { Data: resolvedSubject, Charset: "UTF-8" },
          Body: {
            Html: { Data: htmlContent, Charset: "UTF-8" },
            Text: { Data: textContent, Charset: "UTF-8" },
          },
        },
      })
    );
    return { data: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
