Ask the user: "What is the client's website URL? (press Enter to skip if they don't have one)" — wait for their response before proceeding.

---

**[1/6] Scrape the client's website (if URL provided)**

If the user provided a URL:

1. Use the `firecrawl_scrape` MCP tool to scrape the website. Pass the URL and set `formats: ["markdown"]`.
2. From the scraped content, extract and summarize:
   - **Brand name** — company/product name
   - **Brand colors** — primary, secondary, accent (exact hex values if visible in CSS/markup)
   - **Typography** — font families, heading vs body weights
   - **Content tone** — formal/casual, industry jargon, target audience
   - **Logo and imagery style** — photography vs illustration, dark vs light theme
   - **Overall aesthetic** — modern/classic, minimal/rich, corporate/playful
   - **Page sections** — what sections exist on their current site (hero, features, testimonials, pricing, etc.)
   - **Key messaging** — headline, tagline, value propositions
3. Save the full scraped data and analysis to `context/scrape.md` in the project root. Format it as:

```markdown
# Scraped Brand Data

**Source:** <URL>
**Scraped:** <today's date>

## Brand Identity
- Name: ...
- Colors: ...
- Typography: ...
- Tone: ...
- Aesthetic: ...

## Page Sections
- ...

## Key Messaging
- Headline: ...
- Tagline: ...
- Value propositions: ...

## Raw Content
<full scraped markdown content>
```

4. Display a summary block:

```
🔍 Brand Analysis: <client name>

  Colors:      #XXXX (primary), #XXXX (secondary), #XXXX (accent)
  Typography:  <font families>
  Tone:        <content tone>
  Aesthetic:   <overall feel>
  Sections:    <key sections found>
```

If no URL was provided, skip this step and note that you're starting from a blank slate.

✅ [1/6] Done

---

**[2/6] Build client profile**

Create `context/client.md` with the client's core information.

**If a website was scraped (Step 1 ran):**

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
```

✅ [2/6] Done

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

✅ [3/6] Done

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

✅ [4/6] Done

---

**[5/6] Update brand config**

Read `context/client.md` for the client's information.

Update `lib/site.ts`:
- Set `name` to the client's brand name
- Set `description` to a compelling one-liner based on their value proposition
- Set `email`, `noreplyEmail`, `supportEmail` to client values (ask if not in the profile)
- Set `url` to the client's production domain (ask if not in the profile)
- Update all `pages` metadata with client-appropriate titles and descriptions
- Update `emailPrimaryColor` to match the new primary brand color
- Update `companyName` to the client's legal entity name

Update `app/globals.css`:
- Replace `:root` CSS variable values with the client's brand palette (convert hex to oklch)
- Replace `.dark` CSS variable values with appropriate dark-mode versions
- Keep all variable names unchanged — only update values
- Keep all `@import`, `@plugin`, `@custom-variant`, `@theme inline`, `@utility`, and `@layer base` blocks intact

✅ [5/6] Done

---

**[6/6] Design every page**

Apply the loaded design skill to build out every page. For every file: read it first, keep all existing imports/hooks/logic intact, and only redesign the JSX and Tailwind classes.

**CRITICAL RULES — apply to every file you touch:**
- NEVER modify anything inside `components/ui/` — these are shadcn primitives, they are sacred
- If you need a custom button, card, or interactive element that differs from shadcn, build it inline in the component file using raw HTML elements + Tailwind classes + CSS variables (e.g., `bg-[var(--primary)]`, `text-[var(--foreground)]`)
- Keep all `"use client"` directives, React hooks, tRPC mutations, auth redirects, and form logic exactly as-is
- Use `lucide-react` for icons
- Reference `siteConfig` from `@/lib/site` for any brand text (name, description, email)
- Reference `context/client.md` for the client's profile information when writing copy and content

**IF the client has a website (scraped data exists):**

Analyze the scraped site structure from `context/scrape.md` and the client profile from `context/client.md`. Based on the client's actual sections:
- Create or modify landing page components in `components/landing-page/` to match the client's real site sections
- You are NOT limited to the template's default components (hero, features, pricing, etc.) — create whatever sections the client's site actually has
- Remove template components that don't apply to this client
- Make sure the home page (`app/(marketing)/page.tsx` or `app/page.tsx`) imports and renders the correct components
- Use the client's actual messaging, value props, and content from the scrape

**IF no website (starting from scratch):**

Use the existing template components as starting points and design each from scratch:
- `components/landing-page/hero.tsx` — headline, subheadline, CTA, visual element
- `components/landing-page/results.tsx` — 3-4 stat blocks with numbers
- `components/landing-page/trust.tsx` — logo cloud or trust badges
- `components/landing-page/features.tsx` — 4-6 features with icons from lucide-react
- `components/landing-page/testimonials.tsx` — 3-6 testimonial cards
- `components/landing-page/pricing.tsx` — 2-3 pricing tiers with feature lists
- `components/landing-page/blog.tsx` — latest 3 blog posts from content-collections

**In both cases, also design:**

Navigation and footer:
- `components/navbar.tsx` — responsive navbar with logo, nav links, auth CTAs, mobile menu. Keep existing pathname-based hide logic.
- `components/footer.tsx` — full footer with brand, nav columns, contact, copyright. Keep existing pathname-based hide logic.

Auth pages:
- `components/auth/wrapper.tsx` — enhance with design aesthetic, add Logo, keep props interface intact
- `app/(auth)/login/login-form.tsx` — restyle layout only, keep all form logic
- `app/(auth)/signup/signup-form.tsx` — restyle layout only, keep all form logic
- `app/(auth)/reset-password/reset-password-form.tsx` — restyle layout only, keep all form logic

Other pages:
- `app/contact/contact-form.tsx` — redesign layout, keep all form fields/validation/tRPC mutation
- `app/blog/page.tsx` — redesign blog listing with proper cards/grid
- `app/blog/[slug]/page.tsx` — style article layout with proper typography
- `app/not-found.tsx` — style to match design language, keep logic
- `app/success/page.tsx` — style payment success, keep verification logic
- `app/account-deleted/page.tsx` — style confirmation, keep logic

After completing all files, run:

```bash
pnpm typecheck
```

Fix any TypeScript errors. Do not change component logic to fix type errors — only fix import paths, missing props, or JSX structure issues.

✅ [6/6] Done

---

At the end, display a clean summary:

```
✅ Design complete!

  Design skill:  <chosen skill name>
  Brand:         <client name>
  Colors:        <primary> / <secondary> / <accent>
  Scraped:       <URL or "none — designed from scratch">

  Files updated:
    ✓ context/client.md — client profile
    ✓ context/scrape.md — scraped brand data (if applicable)
    ✓ lib/site.ts — brand config
    ✓ app/globals.css — color tokens
    ✓ Landing sections — <list of components created/modified>
    ✓ navbar + footer
    ✓ auth pages (login, signup, reset-password)
    ✓ contact, blog listing, blog detail, 404, success, account-deleted

  Next steps:
    1. Replace components/icons/logo.tsx with the client's logo SVG
    2. Replace public/og-image.png with the client's social preview
    3. Replace public/favicon.ico with the client's favicon
    4. Upload client's white logo to CDN → update emailLogoUrl in lib/site.ts
    5. Update content/legal/privacy.md and terms.md with client's legal entity
    6. Run `pnpm dev` and review every page
```
