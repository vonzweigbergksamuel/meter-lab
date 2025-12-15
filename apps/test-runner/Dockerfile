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
RUN turbo prune test-runner --docker

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
RUN pnpm turbo run build --filter=test-runner

FROM node:lts-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 test-runner

COPY --from=builder /app/apps/test-runner/dist ./apps/test-runner/dist
COPY --from=builder /app/apps/test-runner/package.json ./apps/test-runner/package.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/test-runner/node_modules ./apps/test-runner/node_modules

RUN chown -R test-runner:nodejs /app
USER test-runner

WORKDIR /app/apps/test-runner

CMD ["node", "dist/src/index.js"]
