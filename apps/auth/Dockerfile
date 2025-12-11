FROM node:lts-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV PATH="/usr/local/bin:$PATH"

FROM base AS prepare
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune auth --docker

FROM base AS builder
ARG PORT
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG NODE_ENV
ARG ENVIROMENT

WORKDIR /app
ENV CI=true
COPY --from=prepare /app/out/json/ .
RUN pnpm install

COPY --from=prepare /app/out/full/ .

RUN echo "PORT=${PORT}" > apps/auth/.env
RUN echo "DATABASE_HOST=${DATABASE_HOST}" >> apps/auth/.env
RUN echo "DATABASE_PORT=${DATABASE_PORT}" >> apps/auth/.env
RUN echo "DATABASE_USER=${DATABASE_USER}" >> apps/auth/.env
RUN echo "DATABASE_PASSWORD=${DATABASE_PASSWORD}" >> apps/auth/.env
RUN echo "DATABASE_NAME=${DATABASE_NAME}" >> apps/auth/.env
RUN echo "BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}" >> apps/auth/.env
RUN echo "BETTER_AUTH_URL=${BETTER_AUTH_URL}" >> apps/auth/.env
RUN echo "ENVIROMENT=${ENVIROMENT}" >> apps/auth/.env
RUN pnpm add -g turbo@^2
RUN turbo build

FROM node:lts-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth

COPY --from=builder /app/apps/auth/.next/standalone ./
COPY --from=builder /app/apps/auth/.next/static ./apps/auth/.next/static
COPY --from=builder /app/apps/auth/public ./apps/auth/public

RUN chown -R auth:nodejs /app
USER auth

ARG PORT
EXPOSE ${PORT}
ENV PORT=${PORT}
ENV HOST=0.0.0.0
ENV NODE_ENV=stage

CMD ["node", "/app/apps/auth/server.js"]
