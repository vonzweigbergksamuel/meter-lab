# 1) Bygg Svelte-appen
FROM node:lts-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/orpc/package.json packages/orpc/tsconfig.json ./packages/orpc/
COPY packages/orpc/src ./packages/orpc/src
COPY apps/web ./apps/web

WORKDIR /app

RUN pnpm install --frozen-lockfile --filter web...

WORKDIR /app/apps/web

RUN pnpm run build

# 2) Nginx som servar de buildade filerna
FROM nginx:alpine
COPY --from=build /app/apps/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/web/build /usr/share/nginx/html
