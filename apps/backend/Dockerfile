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
RUN turbo prune backend --docker

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
RUN adduser --system --uid 1001 backend

# Copy prod-only node_modules
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy compiled dist and other necessary files
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/lib/db/migrations ./apps/backend/lib/db/migrations

RUN ls -la /app/apps/backend

RUN chown -R backend:nodejs /app
USER backend

ARG PORT=5070
EXPOSE ${PORT}
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

WORKDIR /app/apps/backend
CMD ["node", "dist/app/server.js"]
