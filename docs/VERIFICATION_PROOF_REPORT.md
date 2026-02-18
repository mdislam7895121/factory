# VERIFICATION PROOF REPORT — SERIAL 11

## Scope
- Serial: 11 — Tenant + Workspace + Project Provisioning MVP
- Branch: `feature/serial-11-provisioning-mvp`
- Mode: additive-only changes; locked serials preserved

## Git Proof
- Branch:
  - `feature/serial-11-provisioning-mvp`
- Working tree (`git status --short`):
  - `M api/prisma/schema.prisma`
  - `M api/src/app.controller.spec.ts`
  - `M api/src/app.module.ts`
  - `M api/src/generated/prisma/*`
  - `?? api/prisma/migrations/20260218053538_serial11_provisioning_mvp/`
  - `?? api/src/serial11/`
  - `?? web/src/app/dashboard/projects/`
  - `?? web/src/app/dashboard/workspaces/`

## Database / Prisma Proof
- Migration reset to clear drift:
  - `npx prisma migrate reset --force` → success
- New migration created and applied:
  - `npx prisma migrate dev --name serial11_provisioning_mvp`
  - created `20260218053538_serial11_provisioning_mvp`
- Client regenerated:
  - `npx prisma generate` → `Generated Prisma Client (v7.3.0) to ./src/generated/prisma`

## Build / Lint / Test Proof
### API
- Build: `npm run build` → pass
- Lint: `npm run lint` → pass
- Tests: `npm test -- --runInBand` → pass (2/2)

### Web
- Build: `npm run build` → pass
- Lint: `npm run lint` → warnings only (no errors)
  - pre-existing warning in `web/src/app/dashboard/page.tsx`
  - warning in new `web/src/app/dashboard/workspaces/page.tsx` (`react-hooks/exhaustive-deps`)

## Runtime Functional API Proof (Serial 11)
Base URL: `http://localhost:4000/v1`

- `GET /templates`
  - `{"ok":true,"templates":[{"id":"basic-web"}]}`
- `POST /workspaces`
  - created workspace id: `376f864e-65cd-44f2-a16a-f7992df3bcb1`
- `GET /workspaces`
  - workspace listed with `projectCount`
- `GET /workspaces/:id`
  - workspace details returned
- `POST /workspaces/:id/projects`
  - created project id: `f54fef6c-f345-48dd-b249-e555677829a8`
  - orchestrator project id: `proj-mlrm213x`
  - preview: `http://localhost:3000/p/proj-mlrm213x/`
  - logsRef: `ws://localhost:4100/v1/ws/projects/proj-mlrm213x/logs`
- `GET /workspaces/:id/projects`
  - project listed
- `GET /projects/:id`
  - project + workspace + provisioningRuns payload returned
- `POST /projects/:id/provision` (1st call)
  - `idempotent=false`, `status=READY`
- `POST /projects/:id/provision` (2nd call)
  - `idempotent=true`, `status=READY`

## Preview / Logs Proof
Selected orchestrator project: `proj-mlrm213x`

- Orchestrator preview:
  - `GET http://localhost:4100/v1/preview/proj-mlrm213x/` → `200`
- Web preview rewrite:
  - `GET http://localhost:3000/p/proj-mlrm213x/` → `200`
- Logs HTTP endpoint:
  - `GET http://localhost:4100/v1/projects/proj-mlrm213x/logs` → `200`
- Logs websocket endpoint:
  - `ws://localhost:4100/v1/ws/projects/proj-mlrm213x/logs`
  - first frame received: `[orchestrator] streaming logs for proj-mlrm213x`

## Serial 10 Quickstart Regression Proof
- Executed: `pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/smoke-factory.ps1`
- Result: pass
  - environment tools pass
  - API health pass
  - generator dry-run pass
  - preview-index dry-run pass
  - web/mobile configuration checks pass

## Web Route Regression Snapshot
- `GET http://localhost:3000/dashboard` → `200`
- `GET http://localhost:3000/dashboard/workspaces` → `200`
- `GET http://localhost:3000/factory-preview` → `200`

## Notes
- `docker compose -f docker/docker-compose.dev.yml up -d --build api web` was required so running containers reflected latest Serial 11 code.
- Prisma generator output pinned to `api/src/generated/prisma` for compatibility with existing `PrismaService` import path.

## SERIAL 11 PATCH-01 — UI Readability + Contrast

### Scope
- Branch: `feature/serial-11-ui-contrast-patch`
- Type: additive UI styling only (no route/API/provisioning logic changes)
- Affected UI routes:
  - `/dashboard`
  - `/dashboard/workspaces`
  - `/dashboard/projects/[projectId]`

### Before/After Screenshots
- BEFORE
  - `proof/serial11-patch01/before-dashboard.png`
  - `proof/serial11-patch01/before-workspaces.png`
  - `proof/serial11-patch01/before-project-build.png`
- AFTER
  - `proof/serial11-patch01/after-dashboard.png`
  - `proof/serial11-patch01/after-workspaces.png`
  - `proof/serial11-patch01/after-project-build.png`

### Commands Run + Output Highlights
- Baseline:
  - `git status --short --branch` → clean branch on patch head
  - `git log -1 --oneline` → `5ecb690 ... SERIAL 11 ...`
  - `docker compose -f docker/docker-compose.dev.yml up -d web` → web running
- BEFORE route probes:
  - `BEFORE_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21587`
  - `BEFORE_ROUTE http://localhost:3000/dashboard/workspaces STATUS=200 LEN=22093`
  - `BEFORE_ROUTE http://localhost:3000/dashboard/projects/73e73f14-2a58-4cad-9fda-7cc81d774bd0 STATUS=200 LEN=21825`
- AFTER route probes:
  - `AFTER_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21583`
  - `AFTER_ROUTE http://localhost:3000/dashboard/workspaces STATUS=200 LEN=22095`
  - `AFTER_ROUTE http://localhost:3000/dashboard/projects/73e73f14-2a58-4cad-9fda-7cc81d774bd0 STATUS=200 LEN=22084`
- Web quality checks:
  - `npm run lint` → pass with existing warnings only (no errors)
  - `npm run build` → pass

### Styling Change Summary (Non-Breaking)
- Added high-contrast UI tokens in `web/src/app/globals.css`:
  - `--bg`, `--fg`, `--muted`, `--card-bg`, `--border`, `--placeholder`, `--focus-ring`
- Added scoped `.factory-ui` styles in `globals.css` to improve readability:
  - consistent dark page tone, near-white primary text, clearer secondary text
  - distinct card backgrounds and visible borders
  - input placeholder/caret visibility and keyboard focus outlines
- Applied `className="factory-ui"` to:
  - `web/src/app/dashboard/page.tsx`
  - `web/src/app/dashboard/workspaces/page.tsx`
  - `web/src/app/dashboard/projects/[projectId]/page.tsx`

### Why This Is Non-Breaking
- No API, data, state, route, or provisioning behavior changed.
- Changes are CSS variable and class-based presentation updates only.
- Permanent Preview routes remained reachable (`STATUS=200`) before and after.
