# TalonsOS

Open-source multi-channel AI operating system inspired by the category that OpenClaw sits in, but structured as a cleaner full-stack monorepo.

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

This repository is a **production-minded scaffold**, not the finished product. It gives you the monorepo structure, contracts, base services, and representative starter code so you can extend it into a full platform.

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
