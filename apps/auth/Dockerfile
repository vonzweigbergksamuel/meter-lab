FROM node:lts-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV PATH="/usr/local/bin:$PATH"

WORKDIR /app

FROM base AS prepare
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune auth --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ .
RUN pnpm add -g turbo@^2
RUN turbo build

# RUN cd apps/auth && node scripts/migrate.js 2>/dev/null || echo "Migration skipped at build time (needs runtime DB credentials)"
# RUN node scripts/seed-admin.js 2>/dev/null || echo "Seed admin skipped at build time (needs runtime DB credentials)"

FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth

COPY --from=builder /app .

RUN chown -R auth:nodejs /app
USER auth

ARG PORT
EXPOSE ${PORT}
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

CMD ["node", "apps/auth/dist/app/server.js"]
