// ─────────────────────────────────────────────────────────────────────────────
// Site Configuration — Single source of truth for all client-specific values.
// Update this file for each client. It drives: metadata, social previews,
// page titles, email templates, navbar/footer, landing page content, and more.
//
// ONBOARDING CHECKLIST — things to update beyond this file:
// □ .env — database, auth secret, OAuth, Polar/Stripe, AWS SES
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
  name: "YourBrand",
  description:
    "The all-in-one platform that helps you create, launch, and scale your ideas faster than ever before.",

  // Contact email (shown on site — navbar, footer, 404)
  email: "a@alisamadii.com",

  // Email sending
  noreplyEmail: "noreply@alisamadii.com",
  supportEmail: "support@alisamadii.com",

  // Email template branding
  emailLogoUrl: "https://cdn.alisamadii.com/company/logo-white.png",
  emailPrimaryColor: "#141414",

  // Legal entity name (copyright, email signatures)
  companyName: "AliSamadii LLC",

  // Production URL — no trailing slash
  url: "https://alisamadii.com",

  // Open Graph / social preview image
  // → Drop your hero image as public/og-image.png (1200×630 recommended)
  ogImage: "/og-image.png",

  // ─────────────────────────────────────────────────────────────────────────
  // Per-page metadata
  // ─────────────────────────────────────────────────────────────────────────
  pages: {
    home: {
      title: "YourBrand",
      description:
        "The all-in-one platform that helps you create, launch, and scale your ideas faster than ever before.",
    },
    blog: {
      title: "Blog",
      description: "Thoughts, guides, and updates from the team.",
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
  },
};
