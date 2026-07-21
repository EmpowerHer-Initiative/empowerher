import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: 600000, // 10 minutes max TTL
});

type WindowPreset = "30s" | "1m" | "2m" | "5m" | "10m" | "15m" | "30m" | "1h";

const presetMs: Record<WindowPreset, number> = {
  "30s": 30_000,
  "1m": 60_000,
  "2m": 120_000,
  "5m": 300_000,
  "10m": 600_000,
  "15m": 900_000,
  "30m": 1_800_000,
  "1h": 3_600_000,
};

const resolveWindow = (window: WindowPreset | number): number => {
  if (typeof window === "string") return presetMs[window];
  return window * 1000;
};

export const getIp = async () => {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
};

export async function rateLimit(
  maxRequests = 10,
  window: WindowPreset | number = "1m"
) {
  const ip = (await getIp()) || "unknown";
  const windowMs = resolveWindow(window);

  const timeWindow = Math.floor(Date.now() / windowMs);
  const key = `${ip}:${timeWindow}`;

  const current = rateLimitCache.get(key) || 0;

  if (current >= maxRequests) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
    });
  }

  rateLimitCache.set(key, current + 1);
  return true;
}
