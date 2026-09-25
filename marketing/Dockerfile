# syntax=docker/dockerfile:1
# Self-hosted (Coolify) build — Astro Node adapter, standalone server.
FROM node:22-slim AS base
WORKDIR /app

# 1. Install + build
FROM base AS builder
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

# 2. Runtime: prod deps only + built server
FROM base AS runner
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
