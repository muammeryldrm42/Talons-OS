# OpenClaw-Style Alignment Notes

This repository has been adjusted to follow an OpenClaw-style layout and operating model.

## Alignment checklist

- [x] Monorepo service boundaries are explicit (`apps`, `packages`, `connectors`, `tools`, `infra`).
- [x] Separate API gateway and async worker services.
- [x] Connector modules isolated per channel.
- [x] Tool modules isolated per capability.
- [x] Environment-driven runtime and deploy docs.

## Suggested follow-up for full parity

- Add a single `manifest` page that lists installed connectors/tools/agents.
- Add end-to-end smoke tests for inbound connector events.
- Add templates for new connector and new tool scaffolding.
- Add an opinionated production docker profile.

