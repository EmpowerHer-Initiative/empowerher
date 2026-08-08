import type { ReactElement } from "react";
import { render } from "@react-email/render";

import { agency } from "@/lib/agency-api";
import { siteConfig } from "@/lib/site";
import type { EmailTemplateName } from "@/services/db/schema";
import { log } from "@/services/log";

// Sent emails are viewable at `${AGENCY_EMAIL_HUB_URL}/${id}`.
const AGENCY_EMAIL_HUB_URL = "https://hub.alisamadii.com/emails";

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
    // `emails.send` throws AttachmentTooLargeError synchronously (>1 MB combined);
    // API failures come back on `error` rather than throwing.
    const { data, error } = await agency.emails.send({
      from: source,
      to: toAddresses,
      subject,
      html,
      ...(attachments?.length
        ? {
            attachments: attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              contentType: a.contentType,
            })),
          }
        : {}),
    });

    if (error) {
      throw new Error(error.message);
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
        emailId: data.id,
        emailUrl: `${AGENCY_EMAIL_HUB_URL}/${data.id}`,
      },
    });
    return { data: { id: data.id } };
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
    const { data, error } = await agency.emails.send({
      from: source,
      to: toAddresses,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    log({
      type: "email",
      status: "success",
      summary: `[Retry] Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: {
        to: toAddresses.join(", "),
        subject,
        retry: true,
        emailId: data.id,
        emailUrl: `${AGENCY_EMAIL_HUB_URL}/${data.id}`,
      },
    });
    return { data: { id: data.id } };
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
