/**
 * Loaders for the src/data/<collection>.json array files (edited in Pages CMS).
 * Each file is a single JSON array already in display order — imported directly,
 * no sort step. Reorder / add / remove a record = a change to that one file.
 */

import partnersData from "../data/collections/partners.json";
import teamData from "../data/collections/team.json";
import resourcesData from "../data/collections/resource-listings.json";
import featuredWritingsData from "../data/collections/featured-writings.json";
import workshopsData from "../data/collections/workshops.json";
import impactStoriesData from "../data/collections/impact-stories.json";

export type Partner = { name: string; image: string; link: string };
export const partners = partnersData as Partner[];

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  group: string;
};
export const teamMembers = teamData as TeamMember[];
/**
 * Display order of the About-page team bands. Must match the `group` select
 * values in the team collection — this is a structural join key, not editable
 * page copy.
 */
export const TEAM_BANDS = ["Executive Team", "Directors", "Mentors & Lecturers"];

export type Resource = {
  name: string;
  location: string;
  description: string;
  link: string;
  image: string;
};
export const resources = resourcesData as Resource[];

export type FeaturedWriting = {
  title: string;
  description: string;
  image: string;
  link: string;
  from: string;
};
export const featuredWritings = featuredWritingsData as FeaturedWriting[];

export type Workshop = {
  name: string;
  mentors: string[];
  description: string;
  image: string;
  link: string;
};
export const workshops = workshopsData as unknown as Workshop[];

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
};
export const impactStories = impactStoriesData as unknown as ImpactStory[];
