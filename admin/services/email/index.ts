import type { ReactElement } from "react";
import { render } from "@react-email/render";

import { sendEmailRaw } from "@/lib/email-client";
import { siteConfig } from "@/lib/site";
import type { EmailTemplateName } from "@/services/db/schema";
import { log } from "@/services/log";

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
  /** Agency hub log category. Defaults to the template name. */
  type?: string;
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

async function send({ from, to, subject, react, attachments, type }: SendOptions) {
  const html = await render(react);
  const toAddresses = Array.isArray(to) ? to : [to];
  const source = from ?? siteConfig.noreplyEmail;
  const { template, templateProps } = extractTemplateInfo(react);

  try {
    const { id, provider } = await sendEmailRaw({
      from: source,
      to: toAddresses,
      subject,
      html,
      type: type ?? template ?? "send",
      attachments,
    });

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
        emailId: id,
        // Hub Emails tab only knows Resend ids.
        ...(provider === "resend"
          ? { emailUrl: `${siteConfig.emailHubUrl}/${id}` }
          : {}),
      },
    });
    return { data: { id } };
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
    const { id, provider } = await sendEmailRaw({
      from: source,
      to: toAddresses,
      subject,
      html,
      type: "resend",
    });

    log({
      type: "email",
      status: "success",
      summary: `[Retry] Email to ${toAddresses.join(", ")}: ${subject}`,
      metadata: {
        to: toAddresses.join(", "),
        subject,
        retry: true,
        emailId: id,
        // Hub Emails tab only knows Resend ids.
        ...(provider === "resend"
          ? { emailUrl: `${siteConfig.emailHubUrl}/${id}` }
          : {}),
      },
    });
    return { data: { id } };
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
