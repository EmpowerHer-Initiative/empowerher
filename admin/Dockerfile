# syntax=docker/dockerfile:1
# Self-hosted (Coolify) build — Next.js standalone server.
FROM node:22-slim AS base
RUN corepack enable
WORKDIR /app

# 1. Install + build
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts: husky "prepare" fails without .git in the container
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts
COPY . .

# Build-time env: NEXT_PUBLIC_* are inlined into the client bundle; the rest
# is needed because cacheComponents prerenders pages that touch the DB/auth.
# Mark all of these as build-time variables in Coolify.
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AGENCY_API_KEY
ARG RESEND_API_KEY
ARG REPO_ID
ENV DATABASE_URL=$DATABASE_URL \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_AGENCY_API_KEY=$NEXT_PUBLIC_AGENCY_API_KEY \
    RESEND_API_KEY=$RESEND_API_KEY \
    REPO_ID=$REPO_ID

# `pnpm exec` skips the prebuild hook (check-env + vitest); tests belong in CI,
# not the deploy image build.
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    pnpm exec next build

# 2. Runtime: standalone output only (self-contained, no node_modules install)
FROM base AS runner
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
