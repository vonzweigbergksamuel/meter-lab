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
RUN turbo prune auth-next --docker

FROM base AS builder
ENV CI=true
COPY --from=prepare /app/out/json/ .
RUN pnpm install

COPY --from=prepare /app/out/full/ .
RUN pnpm add -g turbo@^2
RUN turbo build

FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/auth-next/.next/standalone ./
COPY --from=builder /app/apps/auth-next/.next/static ./apps/auth-next/.next/static
COPY --from=builder /app/apps/auth-next/public ./apps/auth-next/public

RUN chown -R nextjs:nodejs /app
USER nextjs

ARG PORT
EXPOSE ${PORT}
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

CMD ["node", "/app/apps/auth-next/server.js"]
