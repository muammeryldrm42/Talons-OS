# OpenClaw-Style TalonsOS Monorepo

TalonsOS is now organized to feel like a modern OpenClaw-style repository: modular services, connectors, tools, operational defaults, and clear paths for local dev and production deployment.

## OpenClaw-style goals

- Multi-service monorepo with strict boundaries (`apps`, `packages`, `connectors`, `tools`, `infra`)
- API gateway + worker split
- Connector-first integrations (Slack, Telegram, Discord, WebChat, Webhook)
- Tool-first execution model (browser, search, docs, email, calendar, github, terminal)
- Deployable local-first stack (Docker Compose + pnpm workspace)
- Security and observability defaults already scaffolded

## Repository map

```text
apps/
  web       Next.js control panel and workspace UI
  gateway   Fastify API + inbound webhooks + dispatch
  worker    Async jobs, queue consumers, retries
  ingest    Document parsing, chunking, embeddings

packages/
  core, auth, security, queue, connectors-sdk, ...

connectors/
  slack, telegram, discord, webchat, webhook

tools/
  browser, search, documents, email, calendar, github, image, terminal, webhook

infra/
  compose, railway, vercel
```

## Quick start

```bash
cp .env.example .env
pnpm install
docker compose -f infra/compose/docker-compose.yml up -d
pnpm dev
```

Run individual services:

```bash
pnpm dev:web
pnpm dev:gateway
pnpm dev:worker
pnpm dev:ingest
```

## Gateway contract

Routes:

- `GET /`
- `GET /health`, `GET /healthz`
- `GET /ready`, `GET /readyz`
- `POST /inbound`
- `POST /inbound/:connector`
- `GET /ws`
- `GET /agents`, `GET /agents/:agentId`, `GET /agents/:agentId/skills`
- `GET /skills`, `GET /skills/:skillId`, `GET /skills/:skillId/agents`
- `GET /catalog/overview`

Inbound auth (`INBOUND_AUTH_TOKEN`) accepts:

- `Authorization: Bearer <token>`
- `x-talons-token: <token>`

Inbound dedupe is active via `INBOUND_DEDUPE_WINDOW_MS`.

## What makes this "OpenClaw-style"

- Clear service ownership with typed package contracts
- Connectors and tools as first-class extension points
- Production-minded defaults (health/readiness/auth/dedupe)
- Easy evolution from local scaffold to cloud deployment

## Next steps

1. Add connector credentials in settings/admin flow.
2. Wire preferred AI provider(s) and policy controls.
3. Enable production observability and alerting.
4. Build agent workflows on top of queue + tools + connectors.

