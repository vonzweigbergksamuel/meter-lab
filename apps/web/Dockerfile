# 1) Bygg Svelte-appen
FROM node:lts-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/orpc/package.json packages/orpc/tsconfig.json ./packages/orpc/
COPY packages/orpc/src ./packages/orpc/src
COPY apps/web/package.json apps/web/tsconfig.json apps/web/svelte.config.js apps/web/vite.config.ts apps/web/app.html apps/web/nginx.conf apps/web/eslint.config.js ./apps/web/
COPY apps/web/src ./apps/web/src
RUN mkdir -p apps/web/static
COPY apps/web/static/robots.txt apps/web/static/robots.txt

WORKDIR /app

RUN pnpm install --frozen-lockfile --filter web...

WORKDIR /app/apps/web

RUN pnpm run build

# 2) Nginx som servar de buildade filerna
FROM nginx:alpine
COPY --from=build /app/apps/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/web/build /usr/share/nginx/html
