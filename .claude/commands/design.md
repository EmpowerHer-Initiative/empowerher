**[1/6] Read scraped website data**

Check if `context/scrape.md` exists in the project root.

**If `context/scrape.md` does NOT exist:**

Tell the user:

```
context/scrape.md not found.

Before running /design, scrape the client's website using Firecrawl 
(firecrawl.dev) and paste the full markdown output into context/scrape.md.

Scrape each page of the client's site separately and include all content.
Then re-run /design.
```

**Stop here — do not proceed to Step 2.**

**If `context/scrape.md` EXISTS:**

1. Read the file.
2. From the scraped content, extract and analyze:
   - **Brand name** — company/product name
   - **Brand colors** — any hex values visible in the content or CSS
   - **Typography** — font families mentioned
   - **Content tone** — formal/casual, industry jargon, target audience
   - **Site navigation** — extract all nav links from the header/footer of the scraped content
   - **Contact information** — address, phone, email, social links
   - **Pages found** — identify all distinct pages in the scrape
   - **Key messaging** — headlines, taglines, value propositions
3. Display a summary block:

```
Brand Analysis: <client name>

  Colors:      <any colors found, or "not detected — will ask in Step 2">
  Typography:  <font families, or "not detected">
  Tone:        <content tone>
  Pages:       <count> pages found in scrape
  Nav:         <list of nav items>
  Contact:     <email>, <phone>
  Address:     <address>
  Socials:     <list>
```

[1/6] Done

---

**[2/6] Build client profile**

Create `context/client.md` with the client's core information.

**If `context/scrape.md` exists (Step 1 found scraped data):**

Extract the following from the scraped data and write it to `context/client.md`:
- Company/brand name
- Industry
- Products or services offered
- Target audience
- Main value proposition
- Tone of voice
- Brand colors
- Key differentiators
- Website URL
- Address (street, city, state, zip)
- Phone number(s)
- Email address(es)
- Social media links (Facebook, Instagram, YouTube, Twitter/X, etc.)
- Hours of operation (if listed)
- Site page structure (list of all pages and their purpose)

Display the profile to the user and ask: "Does this look right? Anything to add or correct?" — wait for their response. Update `context/client.md` with any corrections.

**If no website was provided:**

Ask the user the following questions (all at once, numbered):

```
To build your client's profile, I need a few details:

  1. What is the client's company/brand name?
  2. What industry are they in?
  3. What products or services do they offer?
  4. Who is their target audience?
  5. What is their main value proposition / what makes them different?
  6. What tone should the site have? (professional, friendly, bold, luxury, etc.)
  7. Do they have brand colors in mind? (hex values, or leave blank for the design skill to decide)
  8. What is their address, phone, and email?
  9. Do they have social media accounts? (URLs)
  10. What pages should the site have? (e.g., Home, About, Services, Contact, Donate)
```

Wait for the user to answer, then write their responses to `context/client.md`.

**File format for `context/client.md`:**

```markdown
# Client Profile

**Name:** ...
**Industry:** ...
**Products/Services:** ...
**Target Audience:** ...
**Value Proposition:** ...
**Tone:** ...
**Brand Colors:** ...
**Key Differentiators:** ...
**Website:** ... (or "None — new project")

## Contact Information
**Address:** ...
**Phone:** ...
**Email:** ...
**Hours:** ... (or "Not listed")

## Social Media
- Facebook: ...
- Instagram: ...
- YouTube: ...
- Twitter/X: ...

## Site Structure
| Page | Purpose |
|------|---------|
| Home | Landing page with hero, events, about |
| About | Mission and history |
| Services | Services offered |
| Contact | Contact form and info |
| ... | ... |
```

[2/6] Done

---

**[3/6] Choose a design direction**

Ask the user: "Which design style do you want? Pick a number:" — then display:

```
── From taste-skill repo ──────────────────────────────

  1. Taste Skill
     Premium frontend with configurable dials
     (variance / motion / density)

  2. Soft Skill
     Expensive soft UI, premium fonts, whitespace,
     depth, smooth spring animations

  3. GPT Taste
     Awwwards-level with deterministic randomization
     and strict GSAP animation requirements

  4. Minimalist Skill
     Clean editorial inspired by Notion & Linear,
     monochrome, crisp borders

  5. Brutalist Skill
     Swiss type + CRT terminal aesthetics,
     raw mechanical interfaces

── From installed skills ──────────────────────────────

  6. High-End Visual Design
     $150k agency-tier, cinematic depth, double-bezel
     architecture, magnetic hover physics

  7. Minimalist UI
     Warm monochrome, typographic contrast,
     bento grids, muted pastels

  8. Industrial Brutalist UI
     Swiss typography + military terminal,
     ASCII framing, analog degradation

  9. Design Taste Frontend
     Motion-engine bento paradigm,
     configurable dials, calibrated defaults
```

Wait for the user to pick a number before proceeding.

[3/6] Done

---

**[4/6] Install + load the design skill**

Based on the user's choice, load the skill:

**Options 1-5 (taste-skill repo):**

Map the choice to the repo path:
- 1 → `skills/taste-skill/SKILL.md`
- 2 → `skills/soft-skill/SKILL.md`
- 3 → `skills/gpt-tasteskill/SKILL.md`
- 4 → `skills/minimalist-skill/SKILL.md`
- 5 → `skills/brutalist-skill/SKILL.md`

Download the SKILL.md from the GitHub repo:

```bash
SKILL_NAME=<skill-folder-name>
REPO_PATH=skills/$SKILL_NAME/SKILL.md
mkdir -p ~/.agents/skills/$SKILL_NAME
curl -sL "https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/$REPO_PATH" -o ~/.agents/skills/$SKILL_NAME/SKILL.md
```

Then read `~/.agents/skills/$SKILL_NAME/SKILL.md` into your context. Every design decision from here must follow that skill's rules.

**Options 6-9 (installed skills):**

Map the choice to the installed skill path:
- 6 → `~/.agents/skills/high-end-visual-design/SKILL.md`
- 7 → `~/.agents/skills/minimalist-ui/SKILL.md`
- 8 → `~/.agents/skills/industrial-brutalist-ui/SKILL.md`
- 9 → `~/.agents/skills/design-taste-frontend/SKILL.md`

Read the SKILL.md into your context. Every design decision from here must follow that skill's rules.

[4/6] Done

---

**[5/6] Update brand config**

Read `context/client.md` and `context/scrape.md` for the client's information.

Update `lib/site.ts`:
- Set `name` to the client's brand name
- Set `description` to a compelling one-liner based on their value proposition
- Set `email`, `noreplyEmail`, `supportEmail` to client values (ask if not in the profile)
- Set `url` to the client's production domain (ask if not in the profile)
- Update `emailPrimaryColor` to match the new primary brand color
- Update `companyName` to the client's legal entity name
- Update existing `pages` metadata entries with client-appropriate titles and descriptions
- **Add NEW entries to the `pages` object** for each client page that doesn't already have a template equivalent. For example, if the client has an About page, add:
  ```typescript
  about: {
    title: "About Us",
    description: "Learn about our mission and community.",
  },
  ```
  Do this for every page in the client's sitemap from `context/scrape.md` that needs a new route.

Update `app/globals.css`:
- Replace `:root` CSS variable values with the client's brand palette (convert hex to oklch)
- Replace `.dark` CSS variable values with appropriate dark-mode versions
- Keep all variable names unchanged — only update values
- Keep all `@import`, `@plugin`, `@custom-variant`, `@theme inline`, `@utility`, and `@layer base` blocks intact

Update `context/aws-ses-setup.md`:
- Replace all `{clientname}` placeholders with the client's name (lowercase, no spaces — e.g., `acme`)
- Replace `CLIENTDOMAIN.com` with the client's actual domain
- This makes the SES setup doc ready to copy-paste for this client

[5/6] Done

---

**[6/6] Design every page**

> **CRITICAL: The scraped data is your single source of truth.**
>
> Use ONLY the scraped data from `context/scrape.md` and the loaded design skill for ALL content and layout decisions. Do not rely on memory, cached data, or assumptions about the client. Every piece of text, every nav link, every contact detail, every page section must come from the scrape or be confirmed by the user.
>
> Only design pages and sections that actually exist in the scraped data. If the client has no blog, do not design blog pages. If the client has no pricing, do not create pricing sections. The scraped sitemap is the source of truth for what pages to create and design.

Read `context/scrape.md` and `context/client.md` before designing anything.

For every file you touch: read it first, keep all existing imports/hooks/logic intact, and only redesign the JSX and Tailwind classes.

**DESIGN RULES — apply to every file you touch:**
- NEVER modify anything inside `components/ui/` — these are shadcn primitives, they are sacred
- If you need a custom button, card, or interactive element that differs from shadcn, build it inline in the component file using raw HTML elements + Tailwind classes + CSS variables (e.g., `bg-[var(--primary)]`, `text-[var(--foreground)]`)
- Keep all `"use client"` directives, React hooks, tRPC mutations, auth redirects, and form logic exactly as-is
- Use `lucide-react` for icons
- Reference `siteConfig` from `@/lib/site` for any brand text (name, description, email)
- Reference `context/scrape.md` for the client's actual content — headings, copy, descriptions, contact info
- Reference `context/client.md` for the client's profile summary
- **Clickable contact info** — whenever address, phone, or email appears anywhere on the site (footer, contact page, landing sections), make them interactive links:
  - Address → `<a href="https://www.google.com/maps/search/?api=1&query=ENCODED_ADDRESS" target="_blank" rel="noopener noreferrer">` (URL-encode full address for `query` param)
  - Phone → `<a href="tel:+1XXXXXXXXXX">` (E.164 format in href, formatted display text)
  - Email → `<a href="mailto:email@example.com">`
- **Image placeholders with AI prompt button:** When a section needs an image and no real image URL is available from the scrape, create a CSS-only placeholder (geometric patterns, gradient backgrounds, or colored blocks matching the intended dimensions). On each placeholder, add a small button in the top-right corner. When clicked, it toggles a prompt panel beneath the placeholder containing a ready-to-copy AI image generation prompt. The prompt must be contextual — describe the exact image needed for that section, matching the client's industry, brand tone, color palette, and the section's purpose (e.g., "A warm, softly lit photograph of a mosque interior with geometric Islamic patterns on the walls, natural light streaming through arched windows, muted emerald and cream tones, editorial photography style"). Only show this button on placeholders — never on real images. Build this inline in the component (do not modify components/ui/).
- **ImagePlaceholder component:** Create `components/image-placeholder.tsx` as a reusable "use client" component for all image placeholders. Props: `aspectRatio` (string like "16/9"), `prompt` (the AI image generation prompt), and optional `className`. It renders a placeholder background with a small "AI Prompt" button (top-right). Clicking the button opens a shadcn Dialog showing the aspect ratio badge and the full prompt with a copy button. Use this component wherever a placeholder image is needed. When writing the `prompt` prop value, reference the client's profile from `context/client.md` to ensure the prompt matches their brand, industry, tone, and the specific section context. Always set the `aspectRatio` prop to match the design's intended image dimensions (e.g., "4/3" for landscape, "4/5" for portrait, "1/1" for square, "16/9" for wide). The aspect ratio is displayed in the dialog so the user knows what size to generate.

---

**Phase A — Plan page routes**

Analyze the client's sitemap from `context/scrape.md`. For each page in the scrape, determine:

1. Does this page map to an existing template route? (e.g., client "Contact" → existing `app/contact/`)
2. Does it need a NEW route under `app/`? (e.g., client "About" → new `app/about/`)
3. Is it purely a homepage section rather than a standalone page?

Display the mapping to the user:

```
Page Mapping:
  Home        → app/page.tsx (redesign landing sections)
  About       → NEW app/about/page.tsx
  Services    → NEW app/services/page.tsx
  Cemetery    → NEW app/cemetery/page.tsx
  Contact     → EXISTING app/contact/page.tsx (redesign)
  Donate      → NEW app/donate/page.tsx
  Resources   → NEW app/resources/page.tsx
```

Ask: "Does this mapping look right? Any pages to skip or merge?" — wait for response.

---

**Phase B — Create new page routes**

For each NEW page route from Phase A:

1. Create `app/<page-name>/page.tsx` with metadata and all page content in the same file. Define section components inside the file — do NOT create separate component files.

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.pages.pageName.title,
  description: siteConfig.pages.pageName.description,
};

const SectionOne = () => { /* ... */ };
const SectionTwo = () => { /* ... */ };

export default function PageNamePage() {
  return (
    <>
      <SectionOne />
      <SectionTwo />
    </>
  );
}
```

2. Only split into a separate `-content.tsx` client component file if the page genuinely needs `"use client"` (interactivity, hooks) while the parent needs server-side metadata. Otherwise keep everything in `page.tsx`.

3. Pull ALL text content from the corresponding page section in `context/scrape.md`. Apply the loaded design skill for layout and styling.

---

**Phase C — Design landing page**

All landing page sections live directly in `app/(marketing)/page.tsx`. Do NOT create separate component files in `components/` for marketing content.

Based on the client's ACTUAL homepage sections from `context/scrape.md`:

1. Define each section as a component inside `app/(marketing)/page.tsx` (e.g., `const HeroSection = () => { ... }`, `const EventsSection = () => { ... }`)

2. Only include sections that exist on the client's actual homepage — do not add sections they don't have

3. Compose all sections in the default export `LandingPage` component in the order they appear on the client's homepage

---

**Phase D — Update navigation and footer**

All navigation content must come directly from `context/scrape.md`.

**Navbar** (`components/navbar.tsx`):
- Read the "Site Navigation" section from `context/scrape.md`
- Replace the nav links with the client's exact navigation items, in the same order
- Map each nav item to its correct route (new or existing)
- Keep all existing pathname-based hide logic unchanged
- Add any new page pathnames to the hide list if needed

**Footer** (`components/footer.tsx`):
- Read "Contact Information" and "Social Media" from `context/scrape.md` or `context/client.md`
- Update the footer with the client's real contact info — all clickable:
  - Address (street, city, state, zip) — wrap in `<a href="https://www.google.com/maps/search/?api=1&query=ENCODED_ADDRESS" target="_blank" rel="noopener noreferrer">`. URL-encode the full address string for the `query` param using `encodeURIComponent()` at build time or hardcode the encoded string.
  - Phone number(s) — wrap in `<a href="tel:+1XXXXXXXXXX">` (use E.164 format in href, display formatted number as text)
  - Email address(es) — wrap in `<a href="mailto:email@example.com">`
  - Social media links with icons — each links to its URL with `target="_blank"`
- Update the quick links to match the client's actual pages
- Keep all existing pathname-based hide logic unchanged

---

**Phase E — Design existing and infrastructure pages**

For template pages that ALSO exist on the client's site (e.g., contact), redesign them with the client's actual content from `context/scrape.md`.

For template pages that do NOT exist on the client's site (e.g., blog, pricing), keep backend logic intact but do NOT include them in navigation — they stay hidden and undesigned.

**Always design these infrastructure pages** (they are app infrastructure, not client content):

Auth pages:
- `components/auth/wrapper.tsx` — enhance with design aesthetic, add Logo, keep props interface intact
- `app/(auth)/login/login-form.tsx` — restyle layout only, keep all form logic
- `app/(auth)/signup/signup-form.tsx` — restyle layout only, keep all form logic
- `app/(auth)/reset-password/reset-password-form.tsx` — restyle layout only, keep all form logic

Other infrastructure pages:
- `app/not-found.tsx` — style to match design language, keep logic
- `app/success/page.tsx` — style payment success, keep verification logic
- `app/account-deleted/page.tsx` — style confirmation, keep logic

---

After completing all files, run:

```bash
pnpm typecheck
```

Fix any TypeScript errors. Do not change component logic to fix type errors — only fix import paths, missing props, or JSX structure issues.

[6/6] Done

---

At the end, display a clean summary:

```
Design complete!

  Design skill:  <chosen skill name>
  Brand:         <client name>
  Colors:        <primary> / <secondary> / <accent>
  Scraped:       <URL or "none — designed from scratch">
  Pages scraped: <count>

  Files updated:
    context/client.md — client profile with contact info
    context/scrape.md — read (user-provided)
    lib/site.ts — brand config + new page metadata
    app/globals.css — color tokens

    Landing page:
    app/(marketing)/page.tsx — all sections defined inline

    New pages created:
    <list each new app/<page>/page.tsx created>

    Navigation:
    navbar — links from scraped site navigation
    footer — real address, phone, email, social links

    Infrastructure pages:
    auth pages (login, signup, reset-password)
    404, success, account-deleted

  Next steps:
    1. Replace components/icons/logo.tsx with the client's logo SVG
    2. Replace public/og-image.png with the client's social preview
    3. Replace public/favicon.ico with the client's favicon
    4. Upload client's white logo to CDN → update emailLogoUrl in lib/site.ts
    5. Update content/legal/privacy.md and terms.md with client's legal entity
    6. Run `pnpm dev` and review every page
    7. Verify all navigation links work correctly
    8. Replace any placeholder/static data with dynamic sources if needed
```
