FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/migrate/package.json ./packages/migrate/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter migrate

COPY packages/migrate ./packages/migrate

FROM base AS migrations
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/migrate/node_modules ./node_modules
COPY packages/migrate/package.json ./
COPY packages/migrate/src ./src

COPY apps/backend/db/migrations ./migrations/backend
COPY apps/auth/lib/db/migrations ./migrations/auth

CMD ["pnpm", "migrate:all"]
