// ─────────────────────────────────────────────────────────────────────────────
// Site Configuration
// Update this file for each client. This is the only place you need to touch
// for metadata, social previews, and page titles.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  // Site identity
  name: "YourBrand",
  description:
    "The all-in-one platform that helps you create, launch, and scale your ideas faster than ever before.",

  // Contact email
  email: "a@alisamadii.com",

  // Production URL — no trailing slash
  url: "https://yourdomain.com",

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
