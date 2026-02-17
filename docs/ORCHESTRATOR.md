# SERIAL 01 Orchestrator API

This document covers the local orchestrator API introduced for SERIAL 01.

## Service

- Container service name: `orchestrator`
- Port: `4100`
- Health endpoint: `GET /health`

## API Endpoints

- `GET /v1/projects` - list projects and runtime status
- `POST /v1/projects` - create project from template
- `POST /v1/projects/:id/start` - start project container
- `POST /v1/projects/:id/stop` - stop project container
- `GET /v1/projects/:id/status` - get project status
- `GET /v1/projects/:id/logs` - fetch recent project logs
- `WS /v1/ws/projects/:id/logs` - stream project logs

## Local template/workspace paths

- Templates: `orchestrator/templates/`
- Runtime workspace copies: `orchestrator/workspaces/`
- Runtime metadata: `orchestrator/data/projects.json`

## Quick proof commands

```powershell
docker compose -f docker/docker-compose.dev.yml up -d --build
Invoke-RestMethod http://localhost:4100/health | ConvertTo-Json -Depth 6
```
