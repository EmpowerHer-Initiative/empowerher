import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Max 500 unique IPs
  ttl: 600_000, // Longest window used below
});

/**
 * Check if a key has exceeded the rate limit. Returns true if limited.
 */
export function isRateLimited(
  key: string,
  maxRequests = 5,
  windowMs = 600_000,
): boolean {
  const timeWindow = Math.floor(Date.now() / windowMs);
  const bucket = `${key}:${timeWindow}`;

  const current = rateLimitCache.get(bucket) || 0;

  if (current >= maxRequests) return true;

  rateLimitCache.set(bucket, current + 1);
  return false;
}

export function clientIp(request: Request, fallback?: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return fallback || "unknown";
}
