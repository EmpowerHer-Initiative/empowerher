// Type-safe CMS field paths for cms-bridge components.
//
// cms-bridge 0.7.x dropped the built-in `@alisamadiillc/cms-bridge/fields`
// subpath and now types every component's `field` prop as a plain `string`
// (see components/index.d.ts in the package). Sites that want autocompleted,
// typo-checked paths bring their own `DotPaths<typeof pages.json>` helper —
// this file is ours. `CmsField` is a strict union of page-relative dot-paths,
// and (being a subtype of `string`) drops straight into any `field` prop.
import type pages from "_pages.json";

/**
 * Every dot-path into `T`: nested object keys joined with `.`, arrays expanded
 * with a `${number}` index segment. Leaves terminate the recursion.
 *
 *   DotPaths<{ story: { image: string; paragraphs: string[] } }>
 *     => "story" | "story.image" | "story.paragraphs" | `story.paragraphs.${number}`
 */
export type DotPaths<T> = T extends readonly (infer E)[]
  ? `${number}` | `${number}.${DotPaths<E>}`
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: K | `${K}.${DotPaths<T[K]>}`;
      }[Extract<keyof T, string>]
    : never;

/**
 * Page-relative field paths across every page in `pages.json`. `Pages[keyof
 * Pages]` is the union of page slices; `DotPaths` distributes over it, so paths
 * stay page-relative (`reviews.heading`, never `home.reviews.heading`).
 */
type Pages = typeof pages;
export type CmsField = DotPaths<Pages[keyof Pages]>;
