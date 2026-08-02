/**
 * Syncs admin-managed content (Neon Postgres) into the static JSON files under
 * src/data/ that the Astro pages import: partners, resources, featured
 * writings, team, workshops.
 *
 * HerVoice stories are NOT synced — they are authored in Pages CMS as a
 * collection (src/content/hervoice/, one markdown file per story).
 *
 * Run with `pnpm sync`. Re-running is idempotent: only the DB-backed keys of
 * each JSON file are replaced; all authored sections (seo, hero, copy, CTAs)
 * are preserved untouched.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { neon } from "@neondatabase/serverless";

/* ─── Config ────────────────────────────────────────────────────────────────── */

const ADMIN_ENV = fileURLToPath(new URL("../../admin/.env", import.meta.url));
const DATA_DIR = fileURLToPath(new URL("../src/data", import.meta.url));

// Partner links that must stay internal routes instead of the DB's external URL.
const PARTNER_LINK_OVERRIDES: Record<string, string> = {
  AGFAF: "/agfaf",
};

const LOGO_PLACEHOLDER =
  "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT8waekQlgkEDp7B3XRvCJzMmyWOSiao4I6cq9";

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

// The shell exports a DATABASE_URL pointing at a different database, so the
// admin .env file is the only trusted source — never read process.env here.
function loadAdminDatabaseUrl(): string {
  if (!existsSync(ADMIN_ENV)) {
    throw new Error(`admin .env not found at ${ADMIN_ENV}`);
  }
  const env = parseEnv(readFileSync(ADMIN_ENV, "utf8")) as Record<
    string,
    string
  >;
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing from admin/.env");
  }
  return env.DATABASE_URL;
}

/** Trim strings; drop keys whose value is null/undefined/empty string. */
function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const val = typeof v === "string" ? v.trim() : v;
    if (val === null || val === undefined || val === "") continue;
    out[k] = val;
  }
  return out as T;
}

/** Replace only the given top-level patches in a data file, preserve the rest. */
function patchJson(
  file: string,
  patch: (data: Record<string, any>) => void,
): void {
  const path = `${DATA_DIR}/${file}`;
  const data = JSON.parse(readFileSync(path, "utf8"));
  patch(data);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */

async function main() {
  const sql = neon(loadAdminDatabaseUrl());

  const [partners, resources, writings, teachers, workshops] =
    await Promise.all([
      sql.query(`SELECT name, image, link FROM partners ORDER BY index ASC`),
      sql.query(
        `SELECT id, name, location, description, link, image FROM resources ORDER BY "createdAt" DESC`,
      ),
      sql.query(
        `SELECT id, title, description, image, link, "from" FROM featured_writings ORDER BY "createdAt" DESC`,
      ),
      sql.query(
        `SELECT name, head_title AS "headTitle", avatar, role FROM teachers ORDER BY index ASC`,
      ),
      sql.query(
        `SELECT name, mentors, description, image, link FROM workshops WHERE status = 'approved' ORDER BY "createdAt" DESC`,
      ),
    ]);

  const partnerItems = partners.map((p) =>
    clean({
      name: p.name,
      image: p.image,
      link: PARTNER_LINK_OVERRIDES[p.name] ?? p.link,
    }),
  );

  const teamMember = (t: Record<string, any>) => ({
    name: (t.name as string).trim(),
    role: (t.headTitle as string)?.trim() ?? "",
    image: t.avatar || LOGO_PLACEHOLDER,
  });
  const teamGroups = [
    { label: "Executive Team", roles: ["executive"] },
    { label: "Directors", roles: ["director"] },
    { label: "Mentors & Lecturers", roles: ["mentor", "lecturer"] },
  ].map(({ label, roles }) => ({
    label,
    members: teachers.filter((t) => roles.includes(t.role)).map(teamMember),
  }));

  patchJson("home.json", (d) => {
    d.partners.partners = partnerItems;
  });
  patchJson("about-us.json", (d) => {
    d.partners.items = partnerItems;
    d.team.groups = teamGroups;
  });
  patchJson("resources.json", (d) => {
    d.resources = resources.map((r) => clean(r));
  });
  patchJson("hervoice-featured-writings.json", (d) => {
    d.writings = writings.map((w) => clean(w));
  });
  patchJson("mentorship.json", (d) => {
    d.workshops.items = workshops.map((w) => clean(w));
  });

  console.log(`partners:           ${partnerItems.length}`);
  console.log(`resources:          ${resources.length}`);
  console.log(`featured writings:  ${writings.length}`);
  console.log(`team members:       ${teachers.length}`);
  console.log(`workshops:          ${workshops.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
