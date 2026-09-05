import { Resend } from "resend";
import { UseSend } from "usesend-js";

// Server-only email client. Two interchangeable providers, selected by env at
// runtime:
//   - RESEND_API_KEY set  → Resend (always wins, even if useSend vars are set)
//   - USESEND_API_KEY set → useSend (USESEND_URL = self-hosted base URL,
//                           defaults to https://app.usesend.com)
// When the client moves to their own account, swapping the API key in the
// environment is the only change needed.

export type EmailProvider = "resend" | "usesend";

export function emailProvider(): EmailProvider | null {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.USESEND_API_KEY) return "usesend";
  return null;
}

let resendClient: Resend | null = null;
let usesendClient: UseSend | null = null;

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

export type RawAttachment = {
  filename: string;
  content: Buffer | Uint8Array;
  contentType: string;
};

export type SendRawOptions = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: RawAttachment[];
  /** Resend-only "type" tag (shows in the hub Emails tab). */
  type?: string;
};

/** Sends via the active provider. Throws when unconfigured or on provider error. */
export async function sendEmailRaw({
  from,
  to,
  subject,
  html,
  replyTo,
  attachments,
  type,
}: SendRawOptions): Promise<{ id: string; provider: EmailProvider }> {
  const provider = emailProvider();

  if (provider === "resend") {
    resendClient ??= new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resendClient.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
      tags: [{ name: "type", value: type ?? "send" }],
      ...(attachments?.length
        ? {
            attachments: attachments.map((a) => ({
              filename: a.filename,
              content: Buffer.from(a.content),
              contentType: a.contentType,
            })),
          }
        : {}),
    });
    if (error || !data) {
      throw new Error(error ? errorMessage(error) : "Failed to send email");
    }
    return { id: data.id, provider };
  }

  if (provider === "usesend") {
    usesendClient ??= new UseSend(
      process.env.USESEND_API_KEY as string,
      process.env.USESEND_URL || undefined,
    );
    const { data, error } = await usesendClient.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
      // useSend takes { filename, content } only (base64, no contentType).
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content).toString("base64"),
      })),
    });
    if (error || !data?.emailId) {
      throw new Error(error ? errorMessage(error) : "Failed to send email");
    }
    return { id: data.emailId, provider };
  }

  throw new Error(
    "No email provider configured (set RESEND_API_KEY or USESEND_API_KEY)",
  );
}
