/**
 * Central registry of Next.js cache tags used by the public marketing pages.
 *
 * Read routers tag their cached data with these (`cacheTag`), and the admin
 * `revalidate` mutation busts them on demand. Keep every marketing-facing cache
 * tag here so there's a single source of truth.
 */
export const CACHE_TAGS = {
  teachers: "teachers",
  workshops: "workshops",
  partners: "partners",
  resources: "resources",
  hervoice: "hervoice",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const CACHE_TAG_VALUES = Object.values(CACHE_TAGS) as [
  CacheTag,
  ...CacheTag[],
];
