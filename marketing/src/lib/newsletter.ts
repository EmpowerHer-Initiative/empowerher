// Newsletter subscribe — POSTs to the admin app's public REST route
// (`/api/newsletter`), which dedupes + stores the email. CORS is locked to the
// EmpowerHer origins server-side.
const ADMIN_API_URL = "https://admin.empowerher-initiative.org";

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; error: string };

export async function subscribeNewsletter(
  email: string,
): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${ADMIN_API_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}) as Record<string, unknown>);

    if (!res.ok) {
      return { ok: false, error: String(data.error || "server_error") };
    }
    return { ok: true, alreadySubscribed: !!data.alreadySubscribed };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
