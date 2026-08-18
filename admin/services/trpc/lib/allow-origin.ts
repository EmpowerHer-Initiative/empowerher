// Strict CORS allow-list — exactly the EmpowerHer origins plus localhost for
// dev. Never a wildcard. Origins are stored WITHOUT a trailing slash because the
// browser `Origin` header never includes one.
export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4321",
  "https://empowerher-initiative.org", // non-www
  "https://www.empowerher-initiative.org", // www — where the marketing forms run
];

/** Allow-list + Vercel preview URL for this deployment, deduped. */
export function getAllowedOrigins(): string[] {
  const origins = [...ALLOWED_ORIGINS];
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  return [...new Set(origins)];
}

/** True when the request origin is on the allow-list. */
export function isOriginAllowed(origin: string | null): boolean {
  return !!origin && getAllowedOrigins().includes(origin);
}

/**
 * Strict CORS headers for the REST routes: sets Access-Control-Allow-Origin to
 * the request origin ONLY when allow-listed; otherwise the header is omitted so
 * the browser blocks the response. Never emits "*".
 */
export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
  if (isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin as string;
  }
  return headers;
}
