/**
 * Syncs admin-managed content (Neon Postgres + winner MDX files in ../admin)
 * into the static JSON files under src/data/ that the Astro pages import.
 *
 * Run with `pnpm sync`. Re-running is idempotent: only the DB-backed keys of
 * each JSON file are replaced; all authored sections (seo, hero, copy, CTAs)
 * are preserved untouched.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { neon } from "@neondatabase/serverless";
import matter from "gray-matter";

/* ─── Config ────────────────────────────────────────────────────────────────── */

const ADMIN_ENV = fileURLToPath(new URL("../../admin/.env", import.meta.url));
const WINNERS_DIR = fileURLToPath(
  new URL("../../admin/content/hervoice/winners", import.meta.url),
);
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

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);

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

/* ─── Winner MDX → markdown story ───────────────────────────────────────────── */

/** `<Poem values={[{ value: "...", translation: "..." }, …]} />` → blockquote. */
function poemToBlockquote(jsx: string): string {
  const items: string[] = [];
  const itemRe = /\{\s*value:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*translation:\s*"((?:[^"\\]|\\.)*)")?\s*,?\s*\}/g;
  for (const m of jsx.matchAll(itemRe)) {
    const value = JSON.parse(`"${m[1]}"`);
    const translation = m[2] ? JSON.parse(`"${m[2]}"`) : undefined;
    items.push(`> ${value}${translation ? ` — *${translation}*` : ""}`);
  }
  if (items.length === 0) {
    throw new Error(`Could not parse <Poem> values:\n${jsx}`);
  }
  return items.join("\n>\n");
}

function mdxBodyToMarkdown(body: string, file: string): string {
  let md = body
    .replace(/<\/?PoemWrapper>/g, "")
    .replace(/<Poem\s+values=\{\[([\s\S]*?)\]\}\s*\/>/g, (_, values) =>
      poemToBlockquote(values),
    )
    .replace(
      /<Image\s+src="([^"]*)"(?:\s+alt="([^"]*)")?\s*\/>/g,
      (_, src, alt) => `![${alt ?? ""}](${src})`,
    );
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  if (/<[A-Za-z]/.test(md)) {
    throw new Error(`Unconverted JSX remains in ${file}:\n${md.match(/<[A-Za-z][^\n]*/)?.[0]}`);
  }
  return md;
}

function contestPosition(place: string): string {
  return place === "honorable"
    ? "Honorable Mention — HerVoice 2026 Writing Contest"
    : `${place} Place — HerVoice 2026 Writing Contest`;
}

function loadWinnerStories() {
  return readdirSync(WINNERS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(readFileSync(`${WINNERS_DIR}/${file}`, "utf8"));
      // frontmatter date is MM-DD-YYYY
      const [month, day, year] = String(data.date).split("-").map(Number);
      return clean({
        slug,
        title: data.title,
        description: data.description ?? "",
        image: data.image,
        imageAlt: data.imageAlt,
        imageCredit: data.imageCredit,
        date: fmtDate(new Date(year, month - 1, day)),
        authorName: data.authorName,
        authorPosition: contestPosition(String(data.contestPlace)),
        authorBio: data.authorBio,
        messageToWorld: data.messageToWorld,
        content: mdxBodyToMarkdown(content, file),
      });
    });
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */

async function main() {
  const sql = neon(loadAdminDatabaseUrl());

  const [partners, resources, stories, writings, teachers, workshops] =
    await Promise.all([
      sql.query(`SELECT name, image, link FROM partners ORDER BY index ASC`),
      sql.query(
        `SELECT id, name, location, description, link, image FROM resources ORDER BY "createdAt" DESC`,
      ),
      sql.query(
        `SELECT slug, title, description, content, image,
                image_alt AS "imageAlt", image_credit AS "imageCredit",
                author_name AS "authorName", author_bio AS "authorBio",
                author_position AS "authorPosition", author_instagram AS "authorInstagram",
                author_facebook AS "authorFacebook", author_linkedin AS "authorLinkedin",
                message_to_world AS "messageToWorld", "createdAt"
         FROM hervoice WHERE NOT hide ORDER BY "createdAt" DESC, title ASC`,
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

  const dbStories = stories.map((s) =>
    clean({
      slug: s.slug,
      title: s.title,
      description: s.description ?? "",
      image: s.image,
      imageAlt: s.imageAlt,
      imageCredit: s.imageCredit,
      date: fmtDate(new Date(s.createdAt)),
      authorName: s.authorName,
      authorPosition: s.authorPosition,
      authorBio: s.authorBio,
      authorInstagram: s.authorInstagram,
      authorFacebook: s.authorFacebook,
      authorLinkedin: s.authorLinkedin,
      messageToWorld: s.messageToWorld,
      content: s.content,
    }),
  );

  // DB stories win on slug collision (same rule as the admin app's loadStory).
  const dbSlugs = new Set(dbStories.map((s) => s.slug));
  const winnerStories = loadWinnerStories().filter((w) => !dbSlugs.has(w.slug));
  const allStories = [...dbStories, ...winnerStories];

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
  patchJson("hervoice-stories.json", (d) => {
    d.stories = allStories;
  });
  patchJson("hervoice.json", (d) => {
    d.featuredWritings.stories = dbStories.map((s) => ({
      slug: s.slug,
      title: s.title,
      image: s.image,
      authorName: s.authorName,
    }));
  });
  patchJson("hervoice-featured-writings.json", (d) => {
    d.writings = writings.map((w) => clean(w));
  });
  patchJson("mentorship.json", (d) => {
    d.workshops.items = workshops.map((w) => clean(w));
  });

  console.log(`partners:           ${partnerItems.length}`);
  console.log(`resources:          ${resources.length}`);
  console.log(`stories:            ${allStories.length} (${dbStories.length} db + ${winnerStories.length} winners)`);
  console.log(`featured writings:  ${writings.length}`);
  console.log(`team members:       ${teachers.length}`);
  console.log(`workshops:          ${workshops.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
