/**
 * Loaders for the JSON record collections under src/data/<collection>/ (one file
 * per record, edited in Pages CMS). Each collection is globbed eagerly and
 * returned sorted by its `sort_order` number field ascending — the same order
 * the CMS drag-to-reorder writes. Adding/removing a record is just adding or
 * deleting a file; no code change.
 */

type WithOrder = { sort_order?: number };

function sorted<T extends WithOrder>(files: Record<string, T>): T[] {
  return Object.values(files).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}

export type Partner = { name: string; image: string; link: string; sort_order?: number };
export const partners = sorted(
  import.meta.glob<Partner>("../data/partners/*.json", { eager: true, import: "default" }),
);

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  group: string;
  sort_order?: number;
};
export const teamMembers = sorted(
  import.meta.glob<TeamMember>("../data/team/*.json", { eager: true, import: "default" }),
);
/**
 * Display order of the About-page team bands. Must match the `group` select
 * values in cms/collections/team.yml — this is a structural join key, not
 * editable page copy.
 */
export const TEAM_BANDS = ["Executive Team", "Directors", "Mentors & Lecturers"];

export type Resource = {
  name: string;
  location: string;
  description: string;
  link: string;
  image: string;
  sort_order?: number;
};
export const resources = sorted(
  import.meta.glob<Resource>("../data/resource-listings/*.json", { eager: true, import: "default" }),
);

export type FeaturedWriting = {
  title: string;
  description: string;
  image: string;
  link: string;
  from: string;
  sort_order?: number;
};
export const featuredWritings = sorted(
  import.meta.glob<FeaturedWriting>("../data/featured-writings/*.json", { eager: true, import: "default" }),
);

export type Workshop = {
  name: string;
  mentors: string[];
  description: string;
  image: string;
  link: string;
  sort_order?: number;
};
export const workshops = sorted(
  import.meta.glob<Workshop>("../data/workshops/*.json", { eager: true, import: "default" }),
);

export type ImpactStory = {
  image: string;
  title: string;
  subtitle?: string;
  date?: string;
  badge?: string;
  stats?: { value: string; label: string }[];
  intro: string;
  links?: { label: string; url: string }[];
  quote: { body: string; author?: string };
  afterQuote?: string;
  impact?: { title: string; body: string };
  sort_order?: number;
};
export const impactStories = sorted(
  import.meta.glob<ImpactStory>("../data/impact-stories/*.json", { eager: true, import: "default" }),
);
