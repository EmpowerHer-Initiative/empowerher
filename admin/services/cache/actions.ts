"use server";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/services/auth/auth";
import { CACHE_TAGS, type CacheTag } from "@/services/cache/tags";

type Result =
  | { data: null; error?: undefined }
  | { data?: undefined; error: string };

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

/**
 * Manually refresh a single marketing section's cached data. Admin-only —
 * mutations no longer revalidate automatically, so an admin publishes changes
 * from the section's button when they want them to go live.
 *
 * Server actions are public endpoints — gate here; the client UI is not enough.
 */
export const revalidateSection = async (tag: CacheTag): Promise<Result> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return { error: "Unauthorized" };
  if (!VALID_TAGS.has(tag)) return { error: "Invalid cache tag" };

  revalidateTag(tag, { expire: 0 });
  return { data: null };
};
