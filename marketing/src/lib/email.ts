import {
  EMAIL_FROM,
  RESEND_API_KEY,
  USESEND_API_KEY,
  USESEND_URL,
} from "astro:env/server";
import { Resend } from "resend";
import { UseSend } from "usesend-js";

// ─────────────────────────────────────────────────────────────────────────────
// Server-side email sender (API routes only — never import from client code).
//
// Two interchangeable providers, selected by env at runtime:
//   - RESEND_API_KEY set  → Resend (always wins, even if useSend vars are set)
//   - USESEND_API_KEY set → useSend (USESEND_URL = self-hosted base URL,
//                           defaults to https://app.usesend.com)
//   - neither             → sendEmail throws a clean "not configured" error;
//                           the module itself never throws at load.
//
// Handover: swap the API key in the environment — no code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

export const emailProvider: "resend" | "usesend" | null = RESEND_API_KEY
  ? "resend"
  : USESEND_API_KEY
    ? "usesend"
    : null;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const usesend =
  !resend && USESEND_API_KEY
    ? new UseSend(USESEND_API_KEY, USESEND_URL || undefined)
    : null;

// usesend-js types claim error is { code, message } but the API can return a
// nested { error: { error: { code, message } } } — without this, failed sends
// would read as success (error.message undefined → falsy).
function errorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as { message?: string; error?: { message?: string } };
    const message = err.message ?? err.error?.message;
    if (message) return message;
  }
  return "Email provider returned an error.";
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64
  contentType?: string;
}

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  // Free-form kind tagged onto Resend sends ("contact", "partner", …).
  type?: string;
  attachments?: EmailAttachment[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  replyTo,
  type,
  attachments,
}: SendEmailInput) => {
  const from = EMAIL_FROM ?? "EmpowerHer <no-reply@alisamadii.com>";
  const toAddresses = Array.isArray(to) ? to : [to];

  if (resend) {
    const { data, error } = await resend.emails.send({
      from,
      to: toAddresses,
      subject,
      html,
      text,
      replyTo,
      attachments,
      tags: [{ name: "type", value: type ?? "send" }],
    });
    if (error) throw new Error(errorMessage(error));
    return data;
  }

  if (usesend) {
    const { data, error } = await usesend.emails.send({
      from,
      to: toAddresses,
      subject,
      html,
      text: text ?? null,
      replyTo,
      // useSend takes { filename, content } only (base64, no contentType).
      attachments: attachments?.map(({ filename, content }) => ({
        filename,
        content,
      })),
    });
    if (error) throw new Error(errorMessage(error));
    return data;
  }

  throw new Error(
    "No email provider configured (set RESEND_API_KEY or USESEND_API_KEY)",
  );
};
