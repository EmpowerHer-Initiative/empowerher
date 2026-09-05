# syntax=docker/dockerfile:1
# Self-hosted (Coolify) build — Astro Node adapter, standalone server.
FROM node:22-slim AS base
RUN corepack enable
WORKDIR /app

# 1. Install + build
FROM base AS builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 2. Runtime: prod deps only + built server
FROM base AS runner
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
