// ─────────────────────────────────────────────────────────────────────────────
// Site Configuration — Single source of truth for all client-specific values.
// Update this file for each client. It drives: metadata, social previews,
// page titles, email templates, navbar/footer, CORS origins, and more.
//
// The only thing NOT covered here: legal docs (content/legal/*.md) —
// update company name & domains there manually.
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

  // Per-page metadata
  // title: shown in browser tab and social previews as "Page | SiteName"
  // description: overrides the default for that page (optional)
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
