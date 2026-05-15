import type { ReactElement } from "react";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";

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

type SendOptions = {
  from?: string;
  to: string | string[];
  subject: string;
  react: ReactElement;
};

async function send({ from, to, subject, react }: SendOptions) {
  if (!isFeatureEnabled("email")) {
    return { error: "Email service is not enabled" };
  }

  const html = await render(react);
  const toAddresses = Array.isArray(to) ? to : [to];

  try {
    await getSes().sendEmail({
      Source: from ?? siteConfig.noreplyEmail,
      Destination: { ToAddresses: toAddresses },
      Message: {
        Subject: { Charset: "UTF-8", Data: subject },
        Body: { Html: { Charset: "UTF-8", Data: html } },
      },
    });
    return { data: true as const };
  } catch (error) {
    console.error("[email] Send failed:", error);
    return { error: "Failed to send email" };
  }
}

export const email = { send };
