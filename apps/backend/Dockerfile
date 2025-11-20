FROM node:lts-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node apps/backend/package.json apps/backend/tsconfig.json ./
COPY --chown=node:node apps/backend/src ./src
COPY --chown=node:node apps/backend/env.ts ./
COPY --chown=node:node apps/backend/core ./core
COPY --chown=node:node apps/backend/di ./di
COPY --chown=node:node apps/backend/services ./services
COPY --chown=node:node apps/backend/utils ./utils

USER node

RUN pnpm install

ARG PORT
EXPOSE ${PORT}

RUN pnpm run build

CMD ["pnpm", "run", "start"]