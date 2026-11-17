# Portfolio as one self-contained container (Next.js standalone output).
#   docker compose up --build        → http://localhost:3001
# NEXT_PUBLIC_* values are compiled into the site, so they are build args, not runtime env.
# On a network that cannot reach Docker Hub or npm directly, point these two at your mirrors:
#   docker compose build --build-arg NODE_IMAGE=<mirror>/library/node:22-alpine --build-arg NPM_REGISTRY=<mirror url>
ARG NODE_IMAGE=node:22-alpine

FROM ${NODE_IMAGE} AS base
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_NPM_REGISTRY=$NPM_REGISTRY npm_config_registry=$NPM_REGISTRY
RUN corepack enable
WORKDIR /app

# 1. Dependencies (cached until the lockfile changes)
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 2. Build
FROM base AS build
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3001
ARG NEXT_PUBLIC_SANITY_PROJECT_ID=""
ARG NEXT_PUBLIC_SANITY_DATASET=production
ARG NEXT_PUBLIC_SANITY_API_VERSION=2026-11-01
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION \
    BUILD_STANDALONE=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 3. Run: only the standalone server, static files, public files and the share-image fonts
FROM ${NODE_IMAGE} AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/assets ./assets
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
