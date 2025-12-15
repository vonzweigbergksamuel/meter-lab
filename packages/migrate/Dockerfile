FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune migrate --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

WORKDIR /app/packages/migrate

COPY apps/backend/db/migrations ./migrations/backend
COPY apps/auth/lib/db/migrations ./migrations/auth

CMD ["pnpm", "migrate:all"]
