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
COPY . .
RUN pnpm add -g turbo@^2
RUN turbo prune auth --docker

FROM base AS dependencies
ENV CI=true
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

FROM base AS builder
ENV CI=true
COPY --from=prepare /app/out/full/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=auth

FROM node:lts-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth

COPY --from=builder /app/apps/auth/dist ./apps/auth/dist
COPY --from=builder /app/apps/auth/package.json ./apps/auth/package.json
COPY --from=builder /app/apps/auth/env.ts ./apps/auth/env.ts
COPY --from=dependencies /app/node_modules ./node_modules

RUN chown -R auth:nodejs /app
USER auth

WORKDIR /app/apps/auth

ARG PORT=3001
EXPOSE ${PORT}
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

CMD ["node", "dist/app/server.js"]
