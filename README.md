# Meter Lab

A Turborepo monorepo containing a SvelteKit web app and Hono backend.

## What is Meter Lab?

Meter Lab is a collection of micro services meant to facilitate testing of IoT devices/dongles.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `apps/web`: A [SvelteKit](https://svelte.dev/docs/kit/introduction/) application with Tailwind CSS
- `apps/backend`: A [Hono](https://hono.dev/) backend API server
- `apps/emqx`: A [TypeScript](https://www.typescriptlang.org/) send mock data to emqx broker

### Packages

- `packages/orpc`: Shared package (work in progress)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for code formatting and linting (backend and root)
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io) for the web app
- [pnpm](https://pnpm.io/) as the package manager

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Build

To build all apps and packages:

```bash
pnpm build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```bash
pnpm turbo build --filter=web
pnpm turbo build --filter=backend
pnpm turbo build --filter=emqx
```

### Develop

To develop all apps and packages:

```bash
pnpm dev
```

You can develop a specific package:

```bash
pnpm turbo dev --filter=web
pnpm turbo dev --filter=backend
```

### Lint

To lint all apps and packages:

```bash
pnpm lint
```

### Format

To format code:

```bash
# Format everything (uses Biome, ignores web app)
pnpm format

# Format web app (uses Prettier)
cd apps/web && pnpm format
```

## Docker Compose

To run the entire stack with Docker:

```bash
docker compose up -d --build
```

This will start:
- Frontend on port 80
- Backend on port 3001

## Useful charts

![Services1](/img/services1.png)
![Services2](/img/services2.png)