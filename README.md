# TalonsOS

Open-source multi-channel AI operating system scaffold for teams that want something cleaner, more operable, and easier to extend than the average OpenClaw-style repo.

## Why this repo is stronger

- Clear monorepo boundaries between apps, packages, connectors, and tools
- Typed runtime config instead of loosely scattered environment access
- Production-minded gateway defaults: request IDs, standardized errors, readiness endpoints, secured inbound hooks, and duplicate-event protection
- Shared observability package you can reuse across every service instead of ad-hoc `console.log`
- Deployment notes and infra split cleanly from runtime code

## What is included

- Next.js control panel in `apps/web`
- Fastify gateway in `apps/gateway`
- Worker service in `apps/worker`
- Ingestion service in `apps/ingest`
- Shared packages for auth, config, agents, tools, memory, RAG, skills, queue, observability, and security
- Connector SDK plus starter connectors
- Tool SDK plus starter tools
- Docker Compose for local infra
- GitHub Actions CI scaffold

## Architecture

```text
apps/web      -> control panel, chat UI, settings
apps/gateway  -> REST + WebSocket + inbound webhooks + dispatch
apps/worker   -> queue processors, schedules, retries
apps/ingest   -> file parsing, chunking, embeddings, vector upserts

packages/*    -> shared runtime libraries
connectors/*  -> Telegram, Discord, Slack, WebChat, etc.
tools/*       -> browser, search, documents, email, calendar, github, terminal
infra/*       -> Docker, compose, CI, deploy notes
```

## Status

This repository is a production-minded scaffold, not the finished product. It gives you the monorepo structure, contracts, base services, and a stronger operational baseline so you can extend it into a full platform without first untangling the repo itself.

## Quick start

1. Copy `.env.example` to `.env`
2. Start infra with Docker Compose
3. Install workspace dependencies with pnpm
4. Run the app targets you need

```bash
cp .env.example .env
docker compose -f infra/compose/docker-compose.yml up -d
pnpm install
pnpm dev
```

Useful app-specific commands:

```bash
pnpm dev:web
pnpm dev:gateway
pnpm dev:worker
pnpm dev:ingest
pnpm check
```

## Gateway baseline

The gateway now ships with a stronger default runtime shape:

- `GET /`, `GET /health`, `GET /healthz`, `GET /ready`, `GET /readyz`
- `POST /inbound`
- `POST /inbound/:connector`
- `GET /ws`

If `INBOUND_AUTH_TOKEN` is set, inbound requests must include either `Authorization: Bearer <token>` or `x-talons-token: <token>`.

Duplicate inbound messages are ignored inside the `INBOUND_DEDUPE_WINDOW_MS` window using a message fingerprint derived from workspace, connector, channel, message, and user IDs.

Example inbound call:

```bash
curl -X POST http://localhost:4000/inbound/telegram \
  -H "Content-Type: application/json" \
  -H "x-talons-token: change-me" \
  -d '{
    "workspaceId": "demo",
    "userExternalId": "user-123",
    "channelExternalId": "chat-456",
    "messageExternalId": "msg-789",
    "text": "Hello from Telegram",
    "raw": {}
  }'
```

## Packages

- `@talonsos/core` shared types
- `@talonsos/config` typed environment parsing
- `@talonsos/db` Prisma schema and client helpers
- `@talonsos/auth` auth and permission helpers
- `@talonsos/ai` provider routing layer
- `@talonsos/agents` registry and execution contracts
- `@talonsos/memory` short/long-term memory hooks
- `@talonsos/rag` retrieval and citation helpers
- `@talonsos/tools` tool SDK and registry
- `@talonsos/workflows` trigger and step engine
- `@talonsos/queue` queue names and helpers
- `@talonsos/observability` logger and tracing stubs
- `@talonsos/security` encryption, secrets, and sandbox policies
- `@talonsos/connectors-sdk` shared connector interfaces
- `@talonsos/skills` manifest loader and registry
- `@talonsos/ui` shared React UI

## Deployment shape

- `apps/web` -> Vercel
- `apps/gateway` -> Railway/Fly/Docker
- `apps/worker` -> Railway worker/Docker
- `apps/ingest` -> Docker worker
- Postgres/Redis/Qdrant/MinIO -> managed or Compose

## Notes

- No secret tokens are committed to the repo.
- Channel tokens and provider API keys should be added by users through a settings UI or a secure admin flow.
- The local model path can be added later through Ollama or another self-hosted provider.
