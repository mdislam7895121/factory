# Architecture Overview

Factory is a local-first full-stack workspace with four core runtime services in development.

## Components

- `web` (Next.js): user-facing dashboard and entry points.
- `api` (Node/Nest): readiness/health endpoints and template APIs.
- `db` (PostgreSQL): primary persistence for API.
- `orchestrator` (Node): project orchestration runtime for factory workflows.

## Development topology

Docker Compose file: `docker/docker-compose.dev.yml`

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- Orchestrator: `http://localhost:4100`
- Postgres: `localhost:5432`

## Health and readiness contract

- API DB health: `GET /db/health` (expects HTTP 200)
- API readiness: `GET /ready` (expects HTTP 200 and JSON checks)
- Template list: `GET /v1/templates`

## Operational references

- Monitoring and readiness runbook: `docs/ops/MONITORING.md`
- Production smoke script: `scripts/prod-smoke.ps1`
- Local demo workflow: `docs/DEMO_WORKFLOW.md`