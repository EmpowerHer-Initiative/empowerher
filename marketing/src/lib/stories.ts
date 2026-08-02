/**
 * Loads HerVoice stories from the Pages CMS collection at src/content/hervoice/
 * (one markdown file per story, yaml-frontmatter). Slug = filename.
 */
import matter from "gray-matter";

export type Story = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  imageCredit?: string;
  /** Display date, e.g. "March 4, 2026". */
  date: string;
  isoDate: string;
  /** Contest winners are showcased on /hervoice/winners, not the listing. */
  hideFromListing?: boolean;
  authorName?: string;
  authorPosition?: string;
  authorBio?: string;
  authorInstagram?: string;
  authorFacebook?: string;
  authorLinkedin?: string;
  messageToWorld?: string;
  /** Story body as markdown. */
  content: string;
};

const files = import.meta.glob("../content/hervoice/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Format from date parts — unquoted YAML dates parse as UTC-midnight Date
// objects, and formatting those directly can shift a day in local time.
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export const stories: Story[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = matter(raw);
    const isoDate =
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date);
    return {
      ...data,
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
      isoDate,
      date: fmtDate(isoDate),
      content: content.trim(),
    } as Story;
  })
  .sort(
    (a, b) =>
      b.isoDate.localeCompare(a.isoDate) || a.title.localeCompare(b.title),
  );
