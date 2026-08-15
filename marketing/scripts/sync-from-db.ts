/**
 * DEPRECATED — no longer syncs anything.
 *
 * Partners, resources, featured writings, team members and workshops used to be
 * mirrored from the admin Neon DB into src/data/*.json here. They are now
 * first-class Pages CMS collections (src/data/<collection>/, one JSON file per
 * record) edited directly in the CMS — the admin DB is no longer their source.
 *
 * See cms/collections/*.yml and src/lib/collections.ts. HerVoice stories remain
 * a Pages CMS collection at src/content/hervoice/.
 *
 * This stub is kept so `pnpm sync` fails loud instead of silently doing nothing.
 */
console.error(
  "`pnpm sync` is deprecated: partners, resources, featured-writings, team and\n" +
    "workshops are now Pages CMS collections (src/data/<collection>/), not DB-synced.\n" +
    "Edit them in the CMS. Nothing to sync — exiting.",
);
process.exit(1);
