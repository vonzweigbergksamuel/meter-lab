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
ENV CI=true
COPY --from=prepare /app/out/json/ .
RUN pnpm install

COPY --from=prepare /app/out/full/ .
RUN pnpm add -g turbo@^2
RUN turbo build

FROM base AS dependencies
ENV CI=true
COPY --from=prepare /app/out/json/ .
RUN pnpm install --prod

FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth

# Copy prod-only node_modules
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/auth/node_modules ./apps/auth/node_modules

# Copy compiled dist and other necessary files
COPY --from=builder /app/apps/auth/dist ./apps/auth/dist
COPY --from=builder /app/apps/auth/package.json ./apps/auth/package.json
COPY --from=builder /app/apps/auth/services/db/migrations ./apps/auth/services/db/migrations

COPY apps/auth/entrypoint.sh /app/apps/auth/entrypoint.sh

RUN chmod +x /app/apps/auth/entrypoint.sh
RUN chown -R auth:nodejs /app
USER auth

ARG PORT
EXPOSE ${PORT}
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

ENTRYPOINT ["/app/apps/auth/entrypoint.sh"]
