import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted (Coolify) runtime — Vercel ignores this entirely.
  output: "standalone",
  cacheComponents: true,
  experimental: {
    // Volunteer form attaches a CV (PDF) to the email via a Server Action.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default withContentCollections(nextConfig);
