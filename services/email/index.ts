import type { ReactElement } from "react";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import MailComposer from "nodemailer/lib/mail-composer";

import { isFeatureEnabled } from "@/config/features";
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

async function send({ from, to, subject, react, attachments }: SendOptions) {
  if (!isFeatureEnabled("email")) {
    return { error: "Email service is not enabled" };
  }

  const html = await render(react);
  const toAddresses = Array.isArray(to) ? to : [to];
  const source = from ?? siteConfig.noreplyEmail;

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
    return { data: true as const };
  } catch (error) {
    console.error("[email] Send failed:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export const email = { send };
