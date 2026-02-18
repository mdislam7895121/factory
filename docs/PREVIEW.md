# Permanent Preview Workflow (SERIAL B)

This guide keeps preview running while the agent works. You can keep your browser open continuously.

## Start preview (one command)

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
```

This command starts Docker Compose and waits for readiness with retries.

## Route truth (current branch)

- Root (`/`) = builder/prompt-first home
- Dashboard route (`/dashboard`) = dashboard UI
- Landing route (`/landing`) = not present on current branch

Use these URLs:
- Main preview: `http://localhost:3000/`
- Dashboard (if exists): `http://localhost:3000/dashboard`
- Landing (if exists): `http://localhost:3000/landing`

## Check preview status (one command)

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-status.ps1
```

This prints docker status, netstat for ports `3000` and `4100`, and health checks.

## If browser says connection refused

1. Confirm Docker Desktop is running.
2. Run:
   ```powershell
   pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
   ```
3. Check listeners:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :4100
   ```

## If `Invoke-WebRequest` shows `ResponseEnded`

This is a startup/warmup transient. `preview-up.ps1` already retries with backoff.
Run `preview-up.ps1` again and wait until it reports `web_ready=True` with `status=200`.

## View logs

```powershell
docker compose -f docker/docker-compose.dev.yml logs -f --tail 120 web orchestrator api
```

## Stop preview (one command)

Safe stop (default, keeps volumes):

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-down.ps1
```

Wipe volumes explicitly:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-down.ps1 -Wipe
```

## Important workflow behavior

Preview is intended to remain running while the agent continues coding. Do not tear it down unless you explicitly need to stop it.
