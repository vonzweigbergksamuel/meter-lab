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
RUN turbo prune emqx --docker

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
RUN pnpm turbo run build --filter=emqx

FROM node:lts-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 emqx

COPY --from=builder /app/apps/emqx/dist ./apps/emqx/dist
COPY --from=builder /app/apps/emqx/package.json ./apps/emqx/package.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/emqx/node_modules ./apps/emqx/node_modules

RUN chown -R emqx:nodejs /app
USER emqx

WORKDIR /app/apps/emqx

CMD ["node", "dist/src/index.js"]
