# Permanent Local Preview (SERIAL B)

This workflow keeps local preview stable while coding, with Docker Compose as the source of truth.

## Routing policy

- Customer landing: `http://localhost:3000/` (`/`)
- Admin dashboard: `http://localhost:3000/dashboard` (`/dashboard`)

Current route reality in this repo already includes `/dashboard`, so no dashboard route change is needed.

## Keep preview running

From repo root:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
```

What this does:

- starts/rebuilds Docker Compose dev stack from `docker/docker-compose.dev.yml`
- waits until `http://localhost:3000` responds with HTTP 200
- verifies local listening ports for web (`3000`), orchestrator (`4100`), and api (`4000`)
- prints customer and admin URLs
- verifies landing and dashboard route status codes
- prints orchestrator health JSON

The script does not tear down services. Preview stays up while the agent is working.

## Status checks while coding

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-status.ps1
```

This shows:

- `docker compose ps`
- `docker ps` port mappings
- local listen state for `3000`, `4100`, `4000`
- web HTTP status and orchestrator health output

## Optional browser open

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1 -OpenBrowser
```
