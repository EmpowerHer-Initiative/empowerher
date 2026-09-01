# syntax=docker/dockerfile:1

# ---- build stage ----
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /app

# deps layer — cached until pnpm-lock.yaml / package.json change
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# source layer — content/JSON changes invalidate from here down only
COPY . .
RUN pnpm build

# ---- serve stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
