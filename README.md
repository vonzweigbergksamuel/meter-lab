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

## GitHub Environment Variables

To use the CI/CD pipeline, you need to configure the following environment variables and secrets in your GitHub repository settings under the `meter-lab` environment.

### Variables (Repository Variables)

These should be set as **Variables** in your GitHub environment:

#### Application URLs

- `PUBLIC_BACKEND_URL` - Public URL for the backend API
- `PUBLIC_AUTH_URL` - Public URL for the auth service
- `PUBLIC_WEBSOCKET_URL` - Public WebSocket URL
- `PUBLIC_IS_LOCAL` - Whether the deployment is local (default: `false`)
- `ORIGIN` - Origin URL for CORS
- `DOMAIN` - Domain name for the application

#### Service URLs

- `AUTH_SERVICE_URL` - Public URL for the auth service
- `BACKEND_URL` - Internal backend URL
- `BETTER_AUTH_URL` - Better Auth service URL

#### Ports

- `WEB_PORT` - Web application port
- `BACKEND_PORT` - Backend API port (default: `5070`)
- `AUTH_PORT` - Auth service port (default: `5090`)
- `AUTH_DB_PUBLIC_PORT` - Public port for auth database (default: `5433`)

#### Message Queue & Broker

- `REDIS_URL` - Redis connection URL
- `RABBIT_URL` - RabbitMQ connection URL
- `RABBIT_QUEUE` - RabbitMQ queue name
- `RABBIT_USER` - RabbitMQ username
- `RABBIT_PASS` - RabbitMQ password
- `EMQX_URL` - EMQX MQTT broker URL
- `EMQX_TOPIC` - EMQX topic name
- `EMQX_USERNAME` - EMQX username
- `EMQX_PASSWORD` - EMQX password

#### Testing

- `TEST_RUNNER_USERNAME` - Test runner username
- `TEST_RUNNER_PASSWORD` - Test runner password
- `BACKEND_RUN_MIGRATIONS` - Whether to run database migrations (default: `false`)

#### Admin Configuration

- `ADMIN_NAME` - Admin user name

### Secrets (Repository Secrets)

These should be set as **Secrets** in your GitHub environment:

#### GitHub Container Registry

- `GHCR_TOKEN` - GitHub Container Registry authentication token

#### SSH Deployment

- `SSH_PRIVATE_KEY` - SSH private key for deployment server access
- `SSH_HOST` - SSH host for deployment (e.g., `user@hostname`)

#### Database - Auth

- `AUTH_DB_HOST` - Auth database host
- `AUTH_DB_PORT` - Auth database port
- `AUTH_DB_USER` - Auth database username
- `AUTH_DB_PASSWORD` - Auth database password
- `AUTH_DB_NAME` - Auth database name

#### Database - Backend

- `BACKEND_DB_HOST` - Backend database host
- `BACKEND_DB_PORT` - Backend database port
- `BACKEND_DB_USER` - Backend database username
- `BACKEND_DB_PASSWORD` - Backend database password
- `BACKEND_DB_NAME` - Backend database name

#### Authentication

- `BETTER_AUTH_SECRET` - Better Auth secret key


## Useful charts

![Services1](/img/services1.png)
![Services2](/img/services2.png)
