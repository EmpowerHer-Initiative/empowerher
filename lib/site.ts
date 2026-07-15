// ─────────────────────────────────────────────────────────────────────────────
// Site Configuration — Single source of truth for all client-specific values.
// Update this file for each client. It drives: metadata, social previews,
// page titles, email templates, navbar/footer, landing page content, and more.
//
// ONBOARDING CHECKLIST — things to update beyond this file:
// □ .env — database, auth secret, OAuth, AWS SES
// □ components/icons/logo.tsx — replace SVG paths with client logo
// □ public/og-image.png — social preview image (1200×630)
// □ public/favicon.ico — client favicon
// □ app/globals.css — update --primary and other theme colors
// □ content/legal/privacy.md — company name, domains, legal entity
// □ content/legal/terms.md — company name, domains, legal entity
// □ Upload client's white logo to CDN → update emailLogoUrl below
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  // Site identity
  name: "EmpowerHer Initiative",
  description:
    "A nonprofit organization empowering Afghan women and girls across the Middle East and Central Asia through mentorship, leadership development, educational support, storytelling, publication, and community engagement.",

  // Contact email (shown on site — navbar, footer, 404)
  email: "info@empowerher-initiative.org",

  // Email sending
  noreplyEmail: "noreply@empowerher-initiative.org",
  supportEmail: "info@empowerher-initiative.org",
  // Sender for student application emails (accept/reject)
  applyEmail: "EmpowerHer Mentorship Program <apply@empowerher-initiative.org>",

  // Email template branding
  emailLogoUrl: "https://cdn.alisamadii.com/company/business-logo-black.png",
  emailPrimaryColor: "#43a9e2",

  // Legal entity name (copyright, email signatures)
  companyName: "EmpowerHer Initiative",

  // Production URL — no trailing slash
  url: "https://empowerher-initiative.org",

  // Open Graph / social preview image
  // → Drop your hero image as public/og-image.png (1200×630 recommended)
  ogImage: "/og-image.png",

  // ─────────────────────────────────────────────────────────────────────────
  // Per-page metadata
  // ─────────────────────────────────────────────────────────────────────────
  pages: {
    home: {
      title: "EmpowerHer",
      description:
        "Empowering Afghan girls through storytelling, learning, and action.",
    },
    login: {
      title: "Login",
    },
    signup: {
      title: "Sign Up",
    },
    resetPassword: {
      title: "Reset Password",
    },
    accountDeleted: {
      title: "Account Deleted",
    },
    contact: {
      title: "Contact",
      description: "Get in touch with the EmpowerHer team.",
    },
    about: {
      title: "About Us",
      description:
        "Learn about our mission, vision, story, and the team behind EmpowerHer.",
    },
    mentorship: {
      title: "Mentorship Program",
      description:
        "Free workshops and mentorship for Afghan girls to build resilience, gain support, and launch impact projects.",
    },
    sso: {
      title: "Sahar Education's Secret Scholars Online Platform (SS0)",
      description:
        "EmpowerHer x Sahar Education — a self-paced Math and English learning platform for EmpowerHer members.",
    },
    sisterhoodSessions: {
      title: "Sisterhood Sessions",
      description:
        "A supportive and caring space for EmpowerHer students to connect, share ideas, and build friendships.",
    },
    hervoice: {
      title: "HerVoice",
      description:
        "A platform for Afghan girls to share their stories, amplify their voices, and inspire change through creative expression.",
    },
    successStories: {
      title: "Success Stories",
      description:
        "Past program outcomes and impact stories from EmpowerHer participants.",
    },
    spr: {
      title: "Student Project Roadmap",
      description:
        "A leadership pathway for EmpowerHer graduates to design and lead their own impact-driven online classes.",
    },
    getInvolved: {
      title: "Get Involved",
      description:
        "Partner with us or volunteer to support Afghan girls' education and empowerment.",
    },
    resources: {
      title: "Resources",
      description:
        "Educational resources, scholarships, and opportunities for Afghan girls.",
    },
    afgaf: {
      title: "AGFAF",
      description:
        "Afghan Girls Financial Assistance Fund — our primary sponsor and partner.",
    },
    annualReport: {
      title: "Annual Impact Reports",
      description: "View and download EmpowerHer's annual impact reports.",
    },
    writingContest: {
      title: "HerVoice 2026 Writing Contest",
      description: "Submit your story to the HerVoice 2026 Writing Contest.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Agency identity — hardcoded, never changes per client.
// Used in agency-sent emails (e.g. contact form notifications).
// ─────────────────────────────────────────────────────────────────────────────
export const agencyConfig = {
  name: "AliSamadii",
  companyName: "AliSamadii LLC",
  email: "agency@alisamadii.com",
  logoUrl: "https://cdn.alisamadii.com/company/logo-white.png",
  primaryColor: "#FC8464",
};
