import type { ReactElement } from "react";
import type { EmailTemplateName } from "@/services/db/schema";
import { log } from "@/services/log";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import MailComposer from "nodemailer/lib/mail-composer";

import { siteConfig } from "@/lib/site";

let ses: SES | null = null;

function getSes() {
  if (!ses) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_VALUE;
    const secretAccessKey = process.env.AWS_SECRET_KEY_VALUE;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("Missing AWS credentials in environment variables");
    }

    ses = new SES({
      region: process.env.AWS_BUCKET_ORIGIN || "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return ses;
}

export type Attachment = {
  filename: string;
  content: Buffer | Uint8Array;
  contentType: string;
};

type SendOptions = {
  from?: string;
  to: string | string[];
  subject: string;
  react: ReactElement;
  attachments?: Attachment[];
};

function extractTemplateInfo(react: ReactElement): {
  template?: EmailTemplateName;
  templateProps?: Record<string, string>;
} {
  const component = react.type;
  if (
    typeof component === "function" &&
    "templateName" in component &&
    typeof component.templateName === "string"
  ) {
    const { children: _, ...props } = react.props as Record<string, unknown>;
    const stringProps: Record<string, string> = {};
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === "string") {
        stringProps[key] = value;
      }
    }
    return {
      template: component.templateName as EmailTemplateName,
      templateProps: stringProps,
    };
  }
  return {};
}

async function send({ from, to, subject, react, attachments }: SendOptions) {
  const html = await render(react);
  const toAddresses = Array.isArray(to) ? to : [to];
  const source = from ?? siteConfig.noreplyEmail;
  const { template, templateProps } = extractTemplateInfo(react);

  try {
    if (attachments?.length) {
      const mail = new MailComposer({
        from: source,
        to: toAddresses.join(", "),
        subject,
        html,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          content: Buffer.from(a.content),
          contentType: a.contentType,
        })),
      });
      const message = await mail.compile().build();
      await getSes().sendRawEmail({ RawMessage: { Data: message } });
    } else {
      await getSes().sendEmail({
        Source: source,
        Destination: { ToAddresses: toAddresses },
        Message: {
          Subject: { Charset: "UTF-8", Data: subject },
          Body: { Html: { Charset: "UTF-8", Data: html } },
        },
      });
    }
    log({
      type: "email",
      status: "success",
      summary: `Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: {
        to: toAddresses.join(", "),
        subject,
        attachmentCount: attachments?.length,
        template,
        templateProps,
      },
    });
    return { data: true as const };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";
    console.error("[email] Send failed:", error);
    log({
      type: "email",
      status: "failed",
      summary: `Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: {
        to: toAddresses.join(", "),
        subject,
        attachmentCount: attachments?.length,
        template,
        templateProps,
      },
      error: errorMessage,
    });
    return { error: errorMessage };
  }
}

async function resend({
  from,
  to,
  subject,
  html,
}: {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  const toAddresses = Array.isArray(to) ? to : [to];
  const source = from ?? siteConfig.noreplyEmail;

  try {
    await getSes().sendEmail({
      Source: source,
      Destination: { ToAddresses: toAddresses },
      Message: {
        Subject: { Charset: "UTF-8", Data: subject },
        Body: { Html: { Charset: "UTF-8", Data: html } },
      },
    });
    log({
      type: "email",
      status: "success",
      summary: `[Retry] Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: { to: toAddresses.join(", "), subject, retry: true },
    });
    return { data: true as const };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";
    console.error("[email] Resend failed:", error);
    log({
      type: "email",
      status: "failed",
      summary: `[Retry] Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: { to: toAddresses.join(", "), subject, retry: true },
      error: errorMessage,
    });
    return { error: errorMessage };
  }
}

export const email = { send, resend };
