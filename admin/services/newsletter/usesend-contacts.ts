import { UseSend } from "usesend-js";

// Syncs newsletter subscribers into a useSend contact book. Independent of the
// Resend/useSend send-provider selection in lib/email-client.ts — contacts are
// a useSend-only concept, so this always uses the useSend API key when present.
const CONTACT_BOOK_ID =
  process.env.USESEND_CONTACT_BOOK_ID || "cmtpuvqtq0001nt2i8uv4us4q";

let usesendClient: UseSend | null = null;

function getClient(): UseSend | null {
  if (!process.env.USESEND_API_KEY) return null;
  usesendClient ??= new UseSend(
    process.env.USESEND_API_KEY,
    process.env.USESEND_URL || undefined
  );
  return usesendClient;
}

/**
 * Upserts a subscriber into the useSend contact book. `contacts.create` is an
 * upsert by email, so re-subscribing is safe. No-op when USESEND_API_KEY is
 * unset. Never throws — newsletter signup must not fail if useSend is down.
 */
export async function addNewsletterContact(rawEmail: string): Promise<void> {
  const client = getClient();
  if (!client) return;

  const email = rawEmail.trim().toLowerCase();

  try {
    const { error } = await client.contacts.create(CONTACT_BOOK_ID, {
      email,
      subscribed: true,
    });
    if (error) {
      console.error("useSend contact sync failed:", error);
    }
  } catch (err) {
    console.error("useSend contact sync threw:", err);
  }
}
