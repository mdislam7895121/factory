# DEV Sandbox (L2)

This repository includes a dev-only sandbox layer for local Replit-like development with Docker Compose and Dev Containers.

## Scope

- Dev-only files:
  - docker/docker-compose.dev.yml
  - .devcontainer/devcontainer.json
  - .devcontainer/Dockerfile
- No production Docker or application logic changes.

## Environment Variables (Dev Defaults)

- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=postgres
- POSTGRES_DB=factory_dev
- DATABASE_URL=postgresql://postgres:postgres@db:5432/factory_dev

Do not commit real secrets. Override values with environment variables when needed.

## One-command Start (PowerShell)

```powershell
docker compose -f docker/docker-compose.dev.yml up -d --build
```

## Open in Dev Containers (VS Code)

1. Ensure Docker Desktop is running.
2. Open the repository in VS Code.
3. Run command: `Dev Containers: Reopen in Container`.
4. The dev container uses docker/docker-compose.dev.yml and attaches to the api service.

## Verify Sandbox (PowerShell)

```powershell
docker compose -f docker/docker-compose.dev.yml ps
Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Select-Object StatusCode
Invoke-RestMethod http://localhost:4000/db/health | ConvertTo-Json -Depth 6
```

Expected:
- Web returns StatusCode 200.
- API health returns JSON with ok=true.

## Stop Sandbox

```powershell
docker compose -f docker/docker-compose.dev.yml down
```

## Rollback

```powershell
git restore --source=HEAD -- docker/docker-compose.dev.yml .devcontainer/devcontainer.json .devcontainer/Dockerfile docs/DEV_SANDBOX.md
git clean -f docker/docker-compose.dev.yml .devcontainer/devcontainer.json .devcontainer/Dockerfile docs/DEV_SANDBOX.md
```

## Troubleshooting

- Port conflict: 3000/4000/5432 already in use.
  - Stop conflicting local services or remap ports in dev-only compose file.
- If dependencies fail to install:
  - Rebuild: `docker compose -f docker/docker-compose.dev.yml up -d --build --force-recreate`
- If API cannot connect to DB:
  - Confirm db service is healthy in `docker compose ... ps`.
  - Confirm DATABASE_URL points to host `db`.

## AI Factory Shortcuts

Use the unified entrypoint for common actions:

```powershell
pwsh -File scripts/factory.ps1 dev:up
pwsh -File scripts/factory.ps1 dev:status
pwsh -File scripts/factory.ps1 dev:logs
pwsh -File scripts/factory.ps1 dev:smoke
pwsh -File scripts/factory.ps1 proof:l2
pwsh -File scripts/factory.ps1 dev:down
```

Preview URLs:

- Web: http://localhost:3000
- API health: http://localhost:4000/db/health
