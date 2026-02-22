## SERIAL 14 — fullstack-v1 Step 1 schema finalized

Date: 2026-02-22

### Scope (files)
- `templates/fullstack-v1/spec.md`
- `templates/fullstack-v1/serial-plan.md`

### Commands + output (trimmed)
```text
> git diff --stat
 templates/fullstack-v1/serial-plan.md |  2 +-
 templates/fullstack-v1/spec.md        | 59 +++++++++++++++++++++++++++++++++--
 2 files changed, 57 insertions(+), 4 deletions(-)

> docker compose -f docker-compose.dev.yml ps
factory-dev-api-1            ... Up ... (healthy)
factory-dev-db-1             ... Up ... (healthy)
factory-dev-orchestrator-1   ... Up ...
factory-web-dev              ... Up ... (healthy)

> curl.exe -i http://localhost:4000/v1/templates | Select-Object -First 25
HTTP/1.1 200 OK
{"ok":true,"templates":[{"id":"basic-web"}]}

> curl.exe -i http://localhost:3000/ | Select-Object -First 15
HTTP/1.1 200 OK
```

## SERIAL 14 — fullstack-v1 Step 2 file map finalized

Date: 2026-02-22

- Finalized deterministic generated file map for fullstack-v1 Step 2 in spec.
- Marked serial-plan Step 2 as completed.
- No runtime behavior changes; API templates and web root remain healthy.
- Change scope remained within allowed docs/spec files only.

### Commands + raw outputs

```text
> git status --short --branch
## feature/serial-14-file-map
 M templates/fullstack-v1/serial-plan.md
 M templates/fullstack-v1/spec.md

> git diff --stat
 templates/fullstack-v1/serial-plan.md |  2 +-
 templates/fullstack-v1/spec.md        | 92 +++++++++++++++++++++++++++--------
 2 files changed, 74 insertions(+), 20 deletions(-)

> docker compose -f docker/docker-compose.dev.yml ps
factory-dev-api-1            ... Up ... (healthy)
factory-dev-db-1             ... Up ... (healthy)
factory-dev-orchestrator-1   ... Up ...
factory-web-dev              ... Up ... (healthy)

> curl.exe -i http://localhost:4000/v1/templates | Select-Object -First 20
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

> curl.exe -i http://localhost:3000/ | Select-Object -First 15
HTTP/1.1 200 OK
X-Powered-By: Next.js
```

### Changed files confirmation

Only these files changed for Step 2:
- `templates/fullstack-v1/spec.md`
- `templates/fullstack-v1/serial-plan.md`
- `docs/VERIFICATION_PROOF_REPORT.md`

## SERIAL 14 — fullstack-v1 Step 3 generator plan mode

Date: 2026-02-22

### Git baseline (short)
```text
> git status --short --branch
## main...origin/main

> git log -5 --oneline
e9a8901 SERIAL 14: finalize fullstack-v1 file map (Step 2) (#45)
53316d9 SERIAL 14: finalize fullstack-v1 schema rules (#44)
37b0459 docs(serial-12): local runtime + ownership proof (#43)
1b08613 docs(serial-12): post-merge proof (#42)
74c9ead SERIAL-12: enforce workspace/project ownership checks
```

### Runtime health
```text
> docker compose -f docker-compose.dev.yml ps
factory-dev-api-1            ... Up ... (healthy)
factory-dev-db-1             ... Up ... (healthy)
factory-dev-orchestrator-1   ... Up ...
factory-web-dev              ... Up ... (healthy)

> curl.exe -i http://localhost:4000/v1/templates | Select-Object -First 20
HTTP/1.1 200 OK

> curl.exe -i http://localhost:3000/ | Select-Object -First 15
HTTP/1.1 200 OK
```

### Plan determinism hashes
```text
> Get-FileHash .\output\plan1.json
Hash      : 50B0604ACE0101DAA3685185AC4B31EF7D3E8C2C24114457B1BED867C92D97E9

> Get-FileHash .\output\plan2.json
Hash      : 50B0604ACE0101DAA3685185AC4B31EF7D3E8C2C24114457B1BED867C92D97E9

> Compare-Object (Get-Content .\output\plan1.json -Raw) (Get-Content .\output\plan2.json -Raw)
COMPARE_RESULT=IDENTICAL
```

### Sample plan excerpt
```json
{
  "ok": true,
  "templateId": "fullstack-v1",
  "mode": "plan",
  "inputs": {
    "name": "demoapp",
    "withAuth": true,
    "database": "postgres",
    "outputDir": "."
  },
  "counts": {
    "totalFiles": 14,
    "totalDirs": 6
  }
}
```

### No files written in plan mode

Statement: No files written in plan mode.

```text
Only shell redirection files were created for proof:
- output/plan1.json
- output/plan2.json

> git diff --name-only
templates/fullstack-v1/serial-plan.md
templates/fullstack-v1/spec.md
templates/fullstack-v1/bin/fullstack-v1.mjs
docs/VERIFICATION_PROOF_REPORT.md
```

## SERIAL 14 — fullstack-v1 Step 4 generator write mode

Date: 2026-02-22

### Git baseline (short)
```text
> git status --short --branch
## main...origin/main

> git log -5 --oneline
8c10de7 SERIAL 14: fullstack-v1 generator plan mode (Step 3) (#46)
e9a8901 SERIAL 14: finalize fullstack-v1 file map (Step 2) (#45)
53316d9 SERIAL 14: finalize fullstack-v1 schema rules (#44)
37b0459 docs(serial-12): local runtime + ownership proof (#43)
1b08613 docs(serial-12): post-merge proof (#42)
```

### Runtime health
```text
> docker compose -f docker-compose.dev.yml ps
factory-dev-api-1            ... Up ... (healthy)
factory-dev-db-1             ... Up ... (healthy)
factory-dev-orchestrator-1   ... Up ...
factory-web-dev              ... Up ... (healthy)

> curl.exe -i http://localhost:4000/v1/templates | Select-Object -First 20
HTTP/1.1 200 OK

> curl.exe -i http://localhost:3000/ | Select-Object -First 15
HTTP/1.1 200 OK
```

### Plan determinism (unchanged)
```text
> Get-FileHash .\output\planA.json
Hash      : C1D594FD872EAB818D457D77606EDC9223BCD0156C93ABD6050B6D86202AC917

> Get-FileHash .\output\planB.json
Hash      : C1D594FD872EAB818D457D77606EDC9223BCD0156C93ABD6050B6D86202AC917

> Compare-Object (Get-Content .\output\planA.json -Raw) (Get-Content .\output\planB.json -Raw)
COMPARE_RESULT=IDENTICAL
```

### Write mode functional proof
```text
> node .\templates\fullstack-v1\bin\fullstack-v1.mjs write --name demoapp --withAuth true --database postgres --outputDir .\output\write-demo --json > .\output\write1.json
> node .\templates\fullstack-v1\bin\fullstack-v1.mjs write --name demoapp --withAuth true --database postgres --outputDir .\output\write-demo --json
{
  "ok": false,
  "error": "TargetNotEmpty"
}
WRITE_NO_FORCE_EXIT=1

> node .\templates\fullstack-v1\bin\fullstack-v1.mjs write --name demoapp --withAuth true --database postgres --outputDir .\output\write-demo --force --json > .\output\write2.json
{
  "ok": true,
  "mode": "write",
  "write": {
    "force": true
  }
}
```

### Safety statement

No files are written outside `targetFolder`. Path traversal guard blocks absolute paths, `..` paths, and resolved escape paths.

বাংলা নোট: write mode default-safe—non-empty target এ `--force` ছাড়া লিখে না, তাই accidental overwrite risk কম।

### Result summary
- SERIAL 14 smallest deliverable completed: Step 1 schema and validation rules finalized.
- Runtime regression checks stayed green for API templates and web root.
## SERIAL 12 — Local Runtime + Ownership Proof (Docker OK)

Date: 2026-02-22

 Engine:
  Version:          29.2.1

> docker info
Server Version: 29.2.1
Operating System: Docker Desktop
```

### Compose runtime proof
```text
> docker compose -f docker-compose.dev.yml down -v --remove-orphans
[+] down 9/9

> docker compose -f docker-compose.dev.yml up -d --build
[+] up 12/12

> docker compose -f docker-compose.dev.yml ps
factory-dev-api-1            factory-dev-api            api            Up ... (healthy)
factory-dev-db-1             postgres:16-alpine         db             Up ... (healthy)
factory-dev-orchestrator-1   factory-dev-orchestrator   orchestrator   Up ...
factory-web-dev              factory-dev-web            web            Up ... (health: starting)
```

### API readiness proof
```text
> curl.exe -i --retry 15 --retry-delay 2 --retry-connrefused http://localhost:4000/v1/templates | Select-Object -First 80
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"ok":true,"templates":[{"id":"basic-web"}]}
```

### Ownership smoke proof
```text
> POST /v1/workspaces as A
HTTP/1.1 201 Created
WS_ID=6dcd3637-4c7f-404d-8937-d70457421351

> POST /v1/workspaces/{wsId}/projects as A
HTTP/1.1 201 Created
PROJECT_ID=5e24c861-d26b-4f37-a5ca-8d24827ead48

> GET /v1/projects/{projectId} as A
HTTP/1.1 200 OK

> GET /v1/projects/{projectId} as B
HTTP/1.1 404 Not Found
```

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

## SERIAL 11 PATCH-02 — Root Landing Professionalization

### Scope
- Branch: `feature/serial-11-root-landing-patch02`
- Updated route: `/` only (`web/src/app/page.tsx`)
- Purpose: replace root builder UI with a professional public SaaS landing while keeping `/dashboard` as app area.

### Before/After Screenshot
- BEFORE: `proof/serial11-patch02/before-root.png`
- AFTER: `proof/serial11-patch02/after-root.png`

### Baseline Route Probes (BEFORE)
- `BEFORE_ROUTE http://localhost:3000/ STATUS=200 LEN=21304`
- `BEFORE_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21583`
- `BEFORE_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20075`

### Verification Route Probes (AFTER)
- `AFTER_ROUTE http://localhost:3000/ STATUS=200 LEN=21300`
- `AFTER_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21586`
- `AFTER_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20073`

### Landing Content Implemented
- Headline: **Build and ship apps with the Factory**
- Subtext: templates → provision → preview → logs flow
- Primary CTA: **Get started — Open dashboard** (`/dashboard`)
- Secondary CTA: **View preview** (`/factory-preview`)
- 3 feature cards: Templates, Live preview, Live logs
- 3-step "How it works" list

### Quality Checks
- `npm run lint` → pass with existing warnings only (no errors)
- `npm run build` → pass

### Non-Breaking Rationale
- No API, auth, provisioning, or route behavior changes.
- Only root page presentation (`web/src/app/page.tsx`) changed.
- `/dashboard` and `/factory-preview` remain reachable with `STATUS=200`.

## SERIAL 11 PATCH-03 — Design System v1 Lock (Serious Professional SaaS)

### Scope
- Branch: `feature/serial-11-design-system-v1`
- Web-only additive styling and UI primitives; no API/behavior changes
- In-scope pages updated:
  - `web/src/app/page.tsx`
  - `web/src/app/dashboard/page.tsx`
  - `web/src/app/dashboard/workspaces/page.tsx`
  - `web/src/app/dashboard/projects/[projectId]/page.tsx`

### Design System v1 Tokens (exact)
- `--bg: #0F172A`
- `--bg2: #111827`
- `--card: #1F2937`
- `--card2: #243045`
- `--border: #2E3A4F`
- `--fg: #F9FAFB`
- `--fg2: #CBD5E1`
- `--muted: #94A3B8`
- `--disabled: #64748B`
- `--primary: #6366F1`
- `--primaryHover: #4F46E5`
- `--success: #10B981`
- `--warning: #F59E0B`
- `--danger: #EF4444`

### Typography / Spacing / Interaction
- Base font: `Inter, system-ui, ...`
- Body: `16px`, line-height `1.6`
- Headings: weight `600`, line-height `1.2`
- Small text utility: `13px` muted
- Card standard: `padding 24px`, `radius 12px`, `border 1px solid var(--border)`
- Focus ring: `2px solid var(--primary)`
- Hover: subtle card/button lighten

### New UI Primitives (additive, no deps)
- `web/src/components/ui/Button.tsx`
- `web/src/components/ui/Card.tsx`
- `web/src/components/ui/Input.tsx`
- `web/src/components/ui/Badge.tsx`

### Before/After Screenshots
- BEFORE
  - `proof/serial11-patch03/before-root.png`
  - `proof/serial11-patch03/before-dashboard.png`
  - `proof/serial11-patch03/before-workspaces.png`
- AFTER
  - `proof/serial11-patch03/after-root.png`
  - `proof/serial11-patch03/after-dashboard.png`
  - `proof/serial11-patch03/after-workspaces.png`

### Baseline Probes (BEFORE)
- `BEFORE_ROUTE http://localhost:3000/ STATUS=200 LEN=21296`
- `BEFORE_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21577`
- `BEFORE_ROUTE http://localhost:3000/dashboard/workspaces STATUS=200 LEN=22093`
- `BEFORE_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20076`

### Verification Probes (AFTER)
- `AFTER_ROUTE http://localhost:3000/ STATUS=200 LEN=21293`
- `AFTER_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21586`
- `AFTER_ROUTE http://localhost:3000/dashboard/workspaces STATUS=200 LEN=22094`
- `AFTER_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20075`

### Quality
- `npm run lint` → pass with existing warnings only (no errors)
- `npm run build` → pass

### Non-Breaking Rationale
- No route changes, no auth changes, no API/provisioning logic changes.
- DS v1 is implemented through tokens + wrapper + small className-based primitives.
- Permanent preview and dashboard routes remained reachable (`STATUS=200`).

## SERIAL 11 PATCH-04 — Marketing-grade SaaS landing polish + hydration warning guard

### Scope
- Branch: `feature/serial-11-marketing-landing-patch04`
- Updated files (allowed scope only):
  - `web/src/app/page.tsx`
  - `web/src/app/globals.css`
  - `web/src/app/layout.tsx`
  - `docs/VERIFICATION_PROOF_REPORT.md`

### Landing updates (public `/` only)
- Added structured marketing sections in order:
  1. Top nav (brand, links, CTA)
  2. Hero with primary/secondary CTA
  3. Trust row
  4. Product screenshot mock window (monospace preview/log lines)
  5. How it works (3 steps)
  6. Core capabilities cards
  7. Pricing teaser (Starter/Pro/Enterprise-Contact)
  8. Security + reliability list
  9. FAQ (4 items)
  10. Footer links
- `/dashboard` remains app area; no route or behavior changes.

### Hydration guard (minimal)
- File: `web/src/app/layout.tsx`
- Exact change: added `suppressHydrationWarning` on root `<html>` and `<body>` only.

### Baseline probes (BEFORE)
- `BEFORE_ROUTE http://localhost:3000/ STATUS=200 LEN=36292`
- `BEFORE_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21867`
- `BEFORE_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20073`

### Verification probes (AFTER)
- `AFTER_ROUTE http://localhost:3000/ STATUS=200 LEN=36283`
- `AFTER_ROUTE http://localhost:3000/dashboard STATUS=200 LEN=21866`
- `AFTER_ROUTE http://localhost:3000/factory-preview STATUS=200 LEN=20074`

### Screenshots (local proof artifacts)
- `proof/serial11-patch04/before-root.png`
- `proof/serial11-patch04/before-dashboard.png`
- `proof/serial11-patch04/after-root.png`
- `proof/serial11-patch04/after-dashboard.png`

### Quality checks
- `npm run lint` → pass with existing warnings only (no errors)
- `npm run build` → pass

### Non-breaking note
- No API/orchestrator changes.
- No dashboard flow logic changes.
- Styling/content polish limited to root landing + minimal global marketing classes.

## SERIAL 11 PATCH-04 (Option 2) — Customer-first Builder Home + Light/Dark Toggle

### Scope
- Branch: `feature/serial-11-builder-home-option2`
- Updated files (web-only, minimal scope):
  - `web/src/app/page.tsx`
  - `web/src/app/layout.tsx`
  - `web/src/app/globals.css`
  - `web/src/app/theme-toggle.tsx`
  - `web/src/app/recent-projects.tsx`

### Implemented
- Replaced `/` with customer-first builder home sections:
  - Prompt-first panel
  - Templates panel
  - Recent projects panel
- Added persistent light/dark toggle:
  - storage key: `factory-theme`
  - pre-hydration initialization script in layout chooses saved theme or system default
- Kept dashboard/admin flows untouched (no edits under `/dashboard/*`).

### Baseline probes (BEFORE)
- `/ STATUS=200 LEN=36285`
- `/dashboard STATUS=200 LEN=21862`
- `/dashboard/workspaces STATUS=200 LEN=22137`
- `/factory-preview STATUS=200 LEN=20077`

### Verification probes (AFTER)
- `/ STATUS=200 LEN=36280`
- `/dashboard STATUS=200 LEN=21866`
- `/dashboard/workspaces STATUS=200 LEN=22143`
- `/factory-preview STATUS=200 LEN=20075`

### Screenshots (proof artifacts)
- BEFORE
  - `proof/serial11-patch04-option2/before-root.png` (70804 bytes)
  - `proof/serial11-patch04-option2/before-dashboard.png` (53084 bytes)
- AFTER
  - `proof/serial11-patch04-option2/after-root.png` (67960 bytes)
  - `proof/serial11-patch04-option2/after-dashboard.png` (51437 bytes)

### Quality checks
- `npm run lint` → pass with existing warnings only (0 errors, 4 pre-existing warnings)
- `npm run build` → pass

### Git proof snapshot
- `git status --short --branch`:
  - `## feature/serial-11-builder-home-option2`
  - `M web/src/app/globals.css`
  - `M web/src/app/layout.tsx`
  - `M web/src/app/page.tsx`
  - `?? web/src/app/recent-projects.tsx`
  - `?? web/src/app/theme-toggle.tsx`


## SERIAL 11 — PATCH-04 (Option 2) FINALIZATION (Post-merge CI completion)

### Gate: PR checks are fully green (no pending)
>>> CMD: gh pr checks 30
API	pass	1m12s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069851933	 CI/Proof Runner Gate (pull_request)	pass	3m46s	https://github.com/mdislam7895121/factory/actions/runs/22158536984/job/64068965689	 Deployment Readiness	pass	12s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852048	 Factory Checks	pass	15s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069851952	 Live Smoke	pass	6s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069835620	 Ops Incident Drill	pass	9s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852047	 Ops Monitoring	pass	11s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852065	 Production Build	pass	1m16s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852098	 Proof Runner Gate	pass	7m49s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64068971537	 Release Packaging	pass	1m34s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069994842	 Security Hardening	pass	14s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852167	 Web	pass	52s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852063	 ops-live-proof-localonly	pass	29s	https://github.com/mdislam7895121/factory/actions/runs/22158538460/job/64069852058	

### Gate: merge commit check-runs completed (sha: e2481d7f48c6e03c689643b0a3edfdaf6dfc392d)
>>> CMD: gh api /repos/mdislam7895121/factory/commits/e2481d7f48c6e03c689643b0a3edfdaf6dfc392d/check-runs
{"total_count":15,"check_runs":[{"id":64070647012,"name":"notify-on-failure","node_id":"CR_kwDORNoYts8AAAAO6uh85A","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"969f947e-b3f6-5fb6-a42c-d85ca0316064","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070647012","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159022327/job/64070647012","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159022327/job/64070647012","status":"completed","conclusion":"skipped","started_at":"2026-02-18T21:50:05Z","completed_at":"2026-02-18T21:50:05Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070647012/annotations"},"check_suite":{"id":57833428396},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070636870,"name":"uptime-check","node_id":"CR_kwDORNoYts8AAAAO6uhVRg","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"77ed0b87-ac5c-5019-a177-6f9565ddc82a","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070636870","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159022327/job/64070636870","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159022327/job/64070636870","status":"completed","conclusion":"success","started_at":"2026-02-18T21:50:02Z","completed_at":"2026-02-18T21:50:05Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070636870/annotations"},"check_suite":{"id":57833428396},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070553236,"name":"Release Packaging","node_id":"CR_kwDORNoYts8AAAAO6ucOlA","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"5875ab2e-3024-5e78-9f33-ad5d3c7b1453","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070553236","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070553236","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070553236","status":"completed","conclusion":"success","started_at":"2026-02-18T21:49:15Z","completed_at":"2026-02-18T21:50:31Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070553236/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411657,"name":"Production Build","node_id":"CR_kwDORNoYts8AAAAO6uTliQ","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"df1353d0-4df5-57c4-a58f-a7e7cd1a02fb","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411657","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411657","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411657","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:49:12Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411657/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411631,"name":"API","node_id":"CR_kwDORNoYts8AAAAO6uTlbw","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"1d7d1308-11ed-597e-9850-1fdd46491698","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411631","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411631","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411631","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:49:13Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411631/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411609,"name":"Factory Checks","node_id":"CR_kwDORNoYts8AAAAO6uTlWQ","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"edfc45de-4424-554b-ae7c-84cb567b3747","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411609","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411609","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411609","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:05Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411609/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411598,"name":"Web","node_id":"CR_kwDORNoYts8AAAAO6uTlTg","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"373d7246-a740-552d-9aac-9898a151c27e","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411598","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411598","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411598","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:47Z","output":{"title":null,"summary":null,"text":null,"annotations_count":4,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411598/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411577,"name":"Ops Incident Drill","node_id":"CR_kwDORNoYts8AAAAO6uTlOQ","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"d2ec0eb3-978f-534f-be83-d365dea204cd","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411577","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411577","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411577","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:04Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411577/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411571,"name":"Ops Monitoring","node_id":"CR_kwDORNoYts8AAAAO6uTlMw","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"12aa0237-cf68-5bbc-be5c-e53b236534f4","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411571","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411571","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411571","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:06Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411571/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411564,"name":"Deployment Readiness","node_id":"CR_kwDORNoYts8AAAAO6uTlLA","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"052e81d4-28a2-59fc-9d16-06adf3e55cb0","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411564","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411564","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411564","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:04Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411564/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411561,"name":"Security Hardening","node_id":"CR_kwDORNoYts8AAAAO6uTlKQ","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"3c8fefd0-e37e-5fe1-b227-c177c61ef18a","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411561","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411561","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411561","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:06Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411561/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070411541,"name":"ops-live-proof-localonly","node_id":"CR_kwDORNoYts8AAAAO6uTlFQ","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"6452badc-9539-5931-8a0d-6cdc36d87dfc","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411541","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411541","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070411541","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:54Z","completed_at":"2026-02-18T21:48:09Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070411541/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64070391854,"name":"Live Smoke","node_id":"CR_kwDORNoYts8AAAAO6uSYLg","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"c3b126ce-b278-5166-bb44-e6ecaa13e839","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070391854","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070391854","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64070391854","status":"completed","conclusion":"success","started_at":"2026-02-18T21:47:43Z","completed_at":"2026-02-18T21:47:51Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64070391854/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64069612759,"name":"Smoke Prod Gate","node_id":"CR_kwDORNoYts8AAAAO6ti01w","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"699b3cad-74df-5d0d-b994-38538dacb4d8","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64069612759","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726295/job/64069612759","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726295/job/64069612759","status":"completed","conclusion":"success","started_at":"2026-02-18T21:40:29Z","completed_at":"2026-02-18T21:40:32Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64069612759/annotations"},"check_suite":{"id":57832551653},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64069612687,"name":"Proof Runner Gate","node_id":"CR_kwDORNoYts8AAAAO6ti0jw","head_sha":"e2481d7f48c6e03c689643b0a3edfdaf6dfc392d","external_id":"495795dc-93bd-585c-804f-5d125c96ad6a","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64069612687","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64069612687","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22158726284/job/64069612687","status":"completed","conclusion":"success","started_at":"2026-02-18T21:40:29Z","completed_at":"2026-02-18T21:47:40Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64069612687/annotations"},"check_suite":{"id":57832551631},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]}]}

### Local runtime proof: web container healthy
>>> CMD: docker compose -f docker/docker-compose.dev.yml ps web
NAME                IMAGE             COMMAND                  SERVICE   CREATED          STATUS                    PORTS factory-dev-web-1   factory-dev-web   "docker-entrypoint.sΓÇª"   web       12 minutes ago   Up 11 minutes (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp

### Post-merge screenshots (local, gitignored)
- proof/serial11-patch04-option2/postmerge-root.png
- proof/serial11-patch04-option2/postmerge-dashboard.png

## SERIAL 13 — Marketing-grade Polish (Dark Aura Premium)

### Scope
- Branch: `feature/serial-13-marketing-polish`
- Modified files:
  - `web/src/app/page.tsx`
  - `web/src/app/globals.css`
- No API, dashboard logic, routing, or backend changes.

### Baseline proofs
>>> CMD: git status --short --branch
## feature/serial-13-marketing-polish

>>> CMD: git log -1 --oneline
529df5e SERIAL 12: Persistent live preview infrastructure (#36)

>>> CMD: git diff --stat origin/main...HEAD
(no output)

>>> CMD: route probes
BASELINE_ROUTE http://localhost:3000/ StatusCode=200
BASELINE_ROUTE http://localhost:3000/dashboard StatusCode=200
BASELINE_ROUTE http://localhost:3000/factory-preview StatusCode=200

### Screenshots
- BEFORE: `proof/serial13-marketing-polish/before-root.png`
- AFTER: `proof/serial13-marketing-polish/after-root.png`

### After proofs
>>> CMD: route probes
AFTER_ROUTE http://localhost:3000/ StatusCode=200
AFTER_ROUTE http://localhost:3000/dashboard StatusCode=200
AFTER_ROUTE http://localhost:3000/factory-preview StatusCode=200

### Quality checks
>>> CMD: npm run lint (web)
- Result: pass with existing warnings only in dashboard files (no errors).

>>> CMD: npm run build (web)
- Result: success.

## SERIAL 12 — Persistent Preview Infrastructure

### Scope
- Branch: `feature/serial-12-persistent-preview`
- Type: infrastructure-only, additive-only changes
- No UI/page/dashboard logic changes

### Docker dev stability changes
- `docker/docker-compose.dev.yml`
  - `web.container_name: factory-web-dev`
  - `web.restart: unless-stopped`
  - `web.healthcheck: curl -fsS http://localhost:3000`
  - `web.ports: 3000:3000`
  - `web.command: sh -lc "npm install && npm run dev"`
  - `web` bind mount preserved (`../web -> /workspace/web`) for hot reload

### Dev watch mode note
- `web` runs `npm run dev` inside container with source bind mount and node_modules volume; this preserves Next.js dev watch/hot reload behavior.

### Route probes (before)
>>> CMD: Invoke-WebRequest probes
BEFORE_ROUTE http://localhost:3000/ StatusCode=200
BEFORE_ROUTE http://localhost:3000/dashboard StatusCode=200
BEFORE_ROUTE http://localhost:3000/dashboard/workspaces StatusCode=200
BEFORE_ROUTE http://localhost:3000/factory-preview StatusCode=200

### docker ps output
>>> CMD: docker ps --filter "name=factory-web-dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
NAMES             STATUS                   PORTS
factory-web-dev   Up 5 minutes (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp

### Healthcheck result
>>> CMD: docker inspect factory-web-dev --format "Health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} Restart={{.HostConfig.RestartPolicy.Name}}"
Health=healthy Restart=unless-stopped

### preview-start.ps1 output
>>> CMD: pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-start.ps1
=== PREVIEW START ===
[+] up 4/4
 ✔ Container factory-dev-orchestrator-1 Running
 ✔ Container factory-dev-db-1           Healthy
 ✔ Container factory-dev-api-1          Healthy
 ✔ Container factory-web-dev            Running
PREVIEW_URL=http://localhost:3000

### preview-status.ps1 output
>>> CMD: pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-status.ps1
=== PREVIEW STATUS ===
NAME              IMAGE             SERVICE   STATUS                   PORTS
factory-web-dev   factory-dev-web   web       Up 5 minutes (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
ContainerRunning=True
HealthStatus=healthy
PortBinding=0.0.0.0:3000 [::]:3000
HttpStatus=200
SUCCESS

### Route probes (after)
>>> CMD: Invoke-WebRequest probes
AFTER_ROUTE http://localhost:3000/ StatusCode=200
AFTER_ROUTE http://localhost:3000/dashboard StatusCode=200
AFTER_ROUTE http://localhost:3000/dashboard/workspaces StatusCode=200
AFTER_ROUTE http://localhost:3000/factory-preview StatusCode=200

## SERIAL 11 — CI/Security Hardening failure analysis (PR #32)

### Failed run details
- PR run ID: `22161828160`
- PR run URL: `https://github.com/mdislam7895121/factory/actions/runs/22161828160`
- Failed job: `Security Hardening` (job ID `64080794693`)
- Main push run ID (same SHA): `22162093240`
- Main run URL: `https://github.com/mdislam7895121/factory/actions/runs/22162093240`

### Key log excerpt (Security baseline scan, CI strict)
```
Mode: CI STRICT
PHASE 1: Dependency Audits
Scanning api...
  [WARN] Found HIGH/CRITICAL vulnerabilities
Scanning web...
  [OK] No HIGH/CRITICAL vulnerabilities
Scanning mobile...
  [WARN] Found HIGH/CRITICAL vulnerabilities
RESULT: FAIL (HIGH/CRITICAL vulnerabilities in CI mode)
##[error]Process completed with exit code 1.
```

### Classification
- **Real policy failure (not transient).**
- Evidence: both PR run `22161828160` and main push run `22162093240` fail in the same `Security Hardening` step with the same CI-strict result.

### Resolution applied (minimal)
- Added targeted dependency override for `minimatch >=10.2.1` in:
  - `api/package.json`
  - `mobile/package.json`
- Updated lockfiles via `npm install` in `api/` and `mobile/`.
- Local strict gate re-run:
  - `pwsh -File scripts/security-scan.ps1 -CiStrict` → `RESULT: PASS (No security issues in CI mode)`.

### Proof links (fix PR)
- Fix PR: `https://github.com/mdislam7895121/factory/pull/33`
- Merge SHA: `56c3fb504efe87f149d86dd1eff85a4ecd84bd48`
- Main check-runs URL pattern:
  - `https://api.github.com/repos/mdislam7895121/factory/commits/56c3fb504efe87f149d86dd1eff85a4ecd84bd48/check-runs`

### Notes
- This addendum exists because PR checks continued running after admin squash merge.
- No code changes in this finalization; report-only update.

## SERIAL 11 — PATCH-04 (Option 2) FINALIZATION — POST-MERGE COMMIT PROOF

### Main is clean + synced
>>> CMD: git status --short --branch
## main...origin/main

>>> CMD: git log -1 --oneline
dd9e529 SERIAL 11 PATCH-04: Finalize proof (post-merge checks completed) (#31)

### Gate: merge commit check-runs completed (sha: dd9e529d28be2da401e6802881414bff4f813589)
>>> CMD: gh api /repos/mdislam7895121/factory/commits/dd9e529d28be2da401e6802881414bff4f813589/check-runs
{"total_count":17,"check_runs":[{"id":64078243417,"name":"notify-on-failure","node_id":"CR_kwDORNoYts8AAAAO61xmWQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"87c3b842-5bec-5561-969a-484e99103444","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64078243417","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22161248177/job/64078243417","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22161248177/job/64078243417","status":"completed","conclusion":"skipped","started_at":"2026-02-18T23:05:16Z","completed_at":"2026-02-18T23:05:16Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64078243417/annotations"},"check_suite":{"id":57839870402},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64078235195,"name":"uptime-check","node_id":"CR_kwDORNoYts8AAAAO61xGOw","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"7a13faed-a545-5f54-b73a-881c2c9e8c2b","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64078235195","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22161248177/job/64078235195","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22161248177/job/64078235195","status":"completed","conclusion":"success","started_at":"2026-02-18T23:05:13Z","completed_at":"2026-02-18T23:05:16Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64078235195/annotations"},"check_suite":{"id":57839870402},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64075610500,"name":"notify-on-failure","node_id":"CR_kwDORNoYts8AAAAO6zQ5hA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"1ed73887-20ff-56bd-b706-d7da0de8681d","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64075610500","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22160462250/job/64075610500","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22160462250/job/64075610500","status":"completed","conclusion":"skipped","started_at":"2026-02-18T22:36:40Z","completed_at":"2026-02-18T22:36:39Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64075610500/annotations"},"check_suite":{"id":57837631900},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64075598097,"name":"uptime-check","node_id":"CR_kwDORNoYts8AAAAO6zQJEQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"64874e36-5e59-5afe-9fd1-34609002859d","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64075598097","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22160462250/job/64075598097","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22160462250/job/64075598097","status":"completed","conclusion":"success","started_at":"2026-02-18T22:36:35Z","completed_at":"2026-02-18T22:36:39Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64075598097/annotations"},"check_suite":{"id":57837631900},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074474496,"name":"Release Packaging","node_id":"CR_kwDORNoYts8AAAAO6yLkAA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"e9bcf569-d2f3-536b-a7e3-e30afa72f5d5","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074474496","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074474496","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074474496","status":"completed","conclusion":"success","started_at":"2026-02-18T22:25:23Z","completed_at":"2026-02-18T22:26:53Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074474496/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341858,"name":"Ops Monitoring","node_id":"CR_kwDORNoYts8AAAAO6yDd4g","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"c2966a0c-e759-551c-a5eb-77be32fbb67f","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341858","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341858","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341858","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:15Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341858/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341837,"name":"Web","node_id":"CR_kwDORNoYts8AAAAO6yDdzQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"2bedbe65-2396-5651-912d-e9efc005b2f0","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341837","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341837","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341837","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:53Z","output":{"title":null,"summary":null,"text":null,"annotations_count":4,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341837/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341836,"name":"ops-live-proof-localonly","node_id":"CR_kwDORNoYts8AAAAO6yDdzA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"e758211a-52d3-5075-9a93-9752690568be","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341836","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341836","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341836","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:25Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341836/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341811,"name":"Ops Incident Drill","node_id":"CR_kwDORNoYts8AAAAO6yDdsw","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"b27dafb3-e707-5095-92eb-63fbe8a0e9c8","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341811","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341811","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341811","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:18Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341811/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341801,"name":"Factory Checks","node_id":"CR_kwDORNoYts8AAAAO6yDdqQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"4befeb3a-8ef8-5ae6-9712-5058a2a233bf","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341801","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341801","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341801","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:15Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341801/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341792,"name":"Deployment Readiness","node_id":"CR_kwDORNoYts8AAAAO6yDdoA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"3493e86a-5bf9-59f4-a8ee-2c7544ccdc09","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341792","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341792","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341792","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:24:16Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341792/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341789,"name":"API","node_id":"CR_kwDORNoYts8AAAAO6yDdnQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"ea7c2354-13b8-5c4b-b880-0ec8c06f5658","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341789","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341789","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341789","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:25:26Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341789/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341785,"name":"Production Build","node_id":"CR_kwDORNoYts8AAAAO6yDdmQ","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"07453da7-ed18-5b8c-918e-0387c955eab3","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341785","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341785","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341785","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:07Z","completed_at":"2026-02-18T22:25:21Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341785/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074341776,"name":"Security Hardening","node_id":"CR_kwDORNoYts8AAAAO6yDdkA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"9d81e31f-35ee-592b-9e88-3b7bb5e95d46","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341776","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341776","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074341776","status":"completed","conclusion":"success","started_at":"2026-02-18T22:24:08Z","completed_at":"2026-02-18T22:24:28Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074341776/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64074319068,"name":"Live Smoke","node_id":"CR_kwDORNoYts8AAAAO6yCE3A","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"597fbd8f-4aff-5fc3-9d71-b4f7ebe53fac","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074319068","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074319068","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64074319068","status":"completed","conclusion":"success","started_at":"2026-02-18T22:23:55Z","completed_at":"2026-02-18T22:24:05Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64074319068/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64073446920,"name":"Proof Runner Gate","node_id":"CR_kwDORNoYts8AAAAO6xM2CA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"b203a0ec-b362-5389-9f0c-bc7a8ed3957f","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64073446920","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64073446920","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159829359/job/64073446920","status":"completed","conclusion":"success","started_at":"2026-02-18T22:15:32Z","completed_at":"2026-02-18T22:23:52Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64073446920/annotations"},"check_suite":{"id":57835805377},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]},{"id":64073446836,"name":"Smoke Prod Gate","node_id":"CR_kwDORNoYts8AAAAO6xM1tA","head_sha":"dd9e529d28be2da401e6802881414bff4f813589","external_id":"0a2df850-a93b-50e5-aa37-bd7b7140e34e","url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64073446836","html_url":"https://github.com/mdislam7895121/factory/actions/runs/22159830916/job/64073446836","details_url":"https://github.com/mdislam7895121/factory/actions/runs/22159830916/job/64073446836","status":"completed","conclusion":"success","started_at":"2026-02-18T22:15:32Z","completed_at":"2026-02-18T22:15:36Z","output":{"title":null,"summary":null,"text":null,"annotations_count":0,"annotations_url":"https://api.github.com/repos/mdislam7895121/factory/check-runs/64073446836/annotations"},"check_suite":{"id":57835809666},"app":{"id":15368,"client_id":"Iv1.05c79e9ad1f6bdfa","slug":"github-actions","node_id":"MDM6QXBwMTUzNjg=","owner":{"login":"github","id":9919,"node_id":"MDEyOk9yZ2FuaXphdGlvbjk5MTk=","avatar_url":"https://avatars.githubusercontent.com/u/9919?v=4","gravatar_id":"","url":"https://api.github.com/users/github","html_url":"https://github.com/github","followers_url":"https://api.github.com/users/github/followers","following_url":"https://api.github.com/users/github/following{/other_user}","gists_url":"https://api.github.com/users/github/gists{/gist_id}","starred_url":"https://api.github.com/users/github/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github/subscriptions","organizations_url":"https://api.github.com/users/github/orgs","repos_url":"https://api.github.com/users/github/repos","events_url":"https://api.github.com/users/github/events{/privacy}","received_events_url":"https://api.github.com/users/github/received_events","type":"Organization","user_view_type":"public","site_admin":false},"name":"GitHub Actions","description":"Automate your workflow from idea to production","external_url":"https://help.github.com/en/actions","html_url":"https://github.com/apps/github-actions","created_at":"2018-07-30T09:30:17Z","updated_at":"2025-12-02T18:13:15Z","permissions":{"actions":"write","administration":"read","artifact_metadata":"write","attestations":"write","checks":"write","contents":"write","copilot_requests":"write","deployments":"write","discussions":"write","issues":"write","merge_queues":"write","metadata":"read","models":"read","packages":"write","pages":"write","pull_requests":"write","repository_hooks":"write","repository_projects":"write","security_events":"write","statuses":"write","vulnerability_alerts":"read"},"events":["branch_protection_rule","check_run","check_suite","create","delete","deployment","deployment_status","discussion","discussion_comment","fork","gollum","issues","issue_comment","label","merge_group","milestone","page_build","public","pull_request","pull_request_review","pull_request_review_comment","push","registry_package","release","repository","repository_dispatch","status","watch","workflow_dispatch","workflow_run"]},"pull_requests":[]}]}

### Local runtime proof: web container healthy
>>> CMD: docker compose -f docker/docker-compose.dev.yml ps web
NAME                IMAGE             COMMAND                  SERVICE   CREATED       STATUS                 PORTS factory-dev-web-1   factory-dev-web   "docker-entrypoint.sΓÇª"   web       2 hours ago   Up 2 hours (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp

### Post-merge screenshots (local, gitignored)
- proof/serial11-patch04-option2/postmerge-root.png
- proof/serial11-patch04-option2/postmerge-dashboard.png

## SERIAL 12 - Ownership + Workspace isolation (Cookie-based principal)

### Docker daemon recovery
>>> CMD: docker context ls
NAME            DESCRIPTION                               DOCKER ENDPOINT                             ERROR
default *       Current DOCKER_HOST based configuration   npipe:////./pipe/docker_engine              
desktop-linux   Docker Desktop                            npipe:////./pipe/dockerDesktopLinuxEngine   

>>> CMD: docker context use desktop-linux
Current context is now "desktop-linux"
desktop-linux

>>> CMD: docker info (first ~30 lines)
Client:
 Version:    29.2.1
 Context:    desktop-linux
...
Server:
 Containers: 29
  Running: 6
  Paused: 0
  Stopped: 23
 Images: 8
 Server Version: 29.2.1
 Storage Driver: overlayfs
...

### Container status
>>> CMD: docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
NAMES                        STATUS                             PORTS
factory-web-dev              Up 23 seconds (health: starting)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
factory-dev-orchestrator-1   Up About a minute                  0.0.0.0:4100->4100/tcp, [::]:4100->4100/tcp
factory-dev-api-1            Up 54 seconds (healthy)            0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp
factory-dev-db-1             Up About a minute (healthy)        0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp

### API route mapping
>>> CMD: docker logs --tail 120 factory-dev-api-1 | Select-String -Pattern "Mapped|API listening|Nest application successfully started"
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/, GET} route +8ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/db/health, GET} route +1ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/templates, GET} route +2ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/workspaces, POST} route +1ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/workspaces, GET} route +1ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/workspaces/:id, GET} route +2ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/workspaces/:id/projects, POST} route +1ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/workspaces/:id/projects, GET} route +1ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/projects/:id, GET} route +0ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [RouterExplorer] Mapped {/v1/projects/:id/provision, POST} route +2ms
[Nest] 238  - 02/21/2026, 9:20:18 AM     LOG [NestApplication] Nest application successfully started +258ms
API listening on http://0.0.0.0:4000

### API readiness probe
>>> CMD: curl.exe -i --retry 10 --retry-delay 2 --retry-connrefused http://localhost:4000/v1/templates
HTTP/1.1 200 OK
...
{"ok":true,"templates":[{"id":"basic-web"}]}

### Ownership proof - Workspace creation (User A)
>>> CMD: curl.exe -i -X POST http://localhost:4000/v1/workspaces -H "Content-Type: application/json" -H "Cookie: factory_user_id=u_a" --data-raw '{ "name": "ws-a" }'
HTTP/1.1 201 Created
...
{"ok":true,"workspace":{"id":"0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1","name":"ws-a","ownerId":"u_a","createdAt":"2026-02-21T09:22:00.057Z","updatedAt":"2026-02-21T09:22:00.057Z"}}
WS_ID=0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1

### Ownership proof - Project creation (User A)
>>> CMD: curl.exe -i -X POST http://localhost:4000/v1/workspaces/0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1/projects -H "Content-Type: application/json" -H "Cookie: factory_user_id=u_a" --data-raw '{ "templateId": "basic-web", "name": "proj-a" }'
HTTP/1.1 201 Created
...
{"ok":true,"project":{"id":"c00f767d-ed72-4ec7-880c-a546f1887080","workspaceId":"0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1",...}}
PROJECT_ID=c00f767d-ed72-4ec7-880c-a546f1887080

### Ownership proof - Owner read (User A)
>>> CMD: curl.exe -i http://localhost:4000/v1/projects/c00f767d-ed72-4ec7-880c-a546f1887080 -H "Cookie: factory_user_id=u_a"
HTTP/1.1 200 OK
...
{"ok":true,"project":{"id":"c00f767d-ed72-4ec7-880c-a546f1887080",...}}

### Ownership proof - Unauthorized read (User B)
>>> CMD: curl.exe -i http://localhost:4000/v1/projects/c00f767d-ed72-4ec7-880c-a546f1887080 -H "Cookie: factory_user_id=u_b"
HTTP/1.1 404 Not Found
...
NotFoundException: project not found

**RESULT: PASS** - User B correctly denied (404, NOT 200)

### DB proof - Project.workspaceId
>>> CMD: docker exec factory-dev-db-1 psql -U postgres -d factory_dev -t -A -c 'SELECT id, "workspaceId" FROM "Project" WHERE id=''c00f767d-ed72-4ec7-880c-a546f1887080'';'
c00f767d-ed72-4ec7-880c-a546f1887080|0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1

### DB proof - Workspace.ownerId
>>> CMD: docker exec factory-dev-db-1 psql -U postgres -d factory_dev -t -A -c 'SELECT id, "ownerId" FROM "Workspace" WHERE id=''0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1'';'
0fb36b78-4a27-4dfd-a3d9-5ae7dab798b1|u_a

### DB proof - PublicProject count
>>> CMD: docker exec factory-dev-db-1 psql -U postgres -d factory_dev -t -A -c 'SELECT count(*) FROM "PublicProject" WHERE id=''c00f767d-ed72-4ec7-880c-a546f1887080'';'
0

### Git status
>>> CMD: git status --short --branch
## serial-12-ownership-workspace...origin/serial-12-ownership-workspace
 M api/prisma/schema.prisma
 M api/src/generated/prisma/edge.js
 M api/src/generated/prisma/index-browser.js
 M api/src/generated/prisma/index.d.ts
 M api/src/generated/prisma/index.js
 M api/src/generated/prisma/package.json
 M api/src/generated/prisma/schema.prisma
 M api/src/serial11/serial11.controller.ts
 M api/src/serial11/serial11.service.ts
?? api/prisma/migrations/20260220093038_serial12_workspace_owner/

### Git diff stat
>>> CMD: git diff --stat
 api/prisma/schema.prisma                  |    3 +
 api/src/generated/prisma/edge.js          |   20 +-
 api/src/generated/prisma/index-browser.js |   16 +-
 api/src/generated/prisma/index.d.ts     | 1590 +++++++++++++++++++++++++++--
 api/src/generated/prisma/index.js         |   20 +-
 api/src/generated/prisma/package.json     |    2 +-
 api/src/generated/prisma/schema.prisma    |   17 +
 api/src/serial11/serial11.controller.ts   |   36 +-
 api/src/serial11/serial11.service.ts      |   48 +-
 9 files changed, 1605 insertions(+), 147 deletions(-)

## SERIAL 12 — Post-merge Proof (Signed)

Date: 2026-02-22
PR: https://github.com/mdislam7895121/factory/pull/41

### Merge confirmation (PR #41)
```text
> gh pr view 41 --repo mdislam7895121/factory --json number,state,mergeable,mergeStateStatus,headRefName,baseRefName,isDraft,title,url,statusCheckRollup
{
  "baseRefName": "main",
  "headRefName": "feature/serial-12-ownership-signed",
  "isDraft": false,
  "mergeStateStatus": "CLEAN",
  "mergeable": "MERGEABLE",
  "number": 41,
  "state": "OPEN",
  "title": "SERIAL 12: workspace/project ownership enforcement (signed)",
  "url": "https://github.com/mdislam7895121/factory/pull/41"
}

> gh pr merge 41 --repo mdislam7895121/factory --merge --delete-branch=false
GraphQL: Merge commits are not allowed on this repository. (mergePullRequest)

> gh pr merge 41 --repo mdislam7895121/factory --rebase --delete-branch=false
GraphQL: Base branch requires signed commits. Rebase merges cannot be automatically signed by GitHub (mergePullRequest)

> git fetch origin
> git checkout main
Already on 'main'
Your branch is up to date with 'origin/main'.
> git pull --ff-only
Already up to date.
> git merge --ff-only origin/feature/serial-12-ownership-signed
Updating a492ba7..74c9ead
Fast-forward
...
15 files changed, 1884 insertions(+), 153 deletions(-)
...
> git push origin main
To https://github.com/mdislam7895121/factory.git
   a492ba7..74c9ead  main -> main

> gh pr view 41 --repo mdislam7895121/factory --json number,state,mergedAt,closed,mergeCommit,url
{
  "closed": true,
  "mergeCommit": {
    "oid": "74c9ead3a9f2a20b83aac1b1bcc20e1cac232c72"
  },
  "mergedAt": "2026-02-22T09:10:10Z",
  "number": 41,
  "state": "MERGED",
  "url": "https://github.com/mdislam7895121/factory/pull/41"
}
```

### Post-merge local sync proof
```text
> git checkout main
Already on 'main'
Your branch is up to date with 'origin/main'.

> git fetch origin

> git pull --ff-only
Already up to date.
```

### Main commit head proof
```text
> git log -8 --oneline --decorate
74c9ead (HEAD -> main, origin/main, origin/feature/serial-12-ownership-signed, origin/HEAD, feature/serial-12-ownership-signed) SERIAL-12: enforce workspace/project ownership checks
fa46a8d fix(migrations): regenerate baseline chain with PublicProject + index
67ae9d9 SERIAL-12: enforce workspace/project ownership checks
e146103 fix(migrations): regenerate baseline chain with PublicProject + index
187ab45 feat(serial-12): enforce public project ownership (clean rebuild)
657c913 chore: ignore local prisma migration backup
a492ba7 SERIAL 13: marketing-grade polish for root builder home (#37)
529df5e SERIAL 12: Persistent live preview infrastructure (#36)
```

### Signature verification on main
```text
> git log --show-signature -8
commit 74c9ead3a9f2a20b83aac1b1bcc20e1cac232c72 (HEAD -> main, origin/main, origin/feature/serial-12-ownership-signed, origin/HEAD, feature/serial-12-ownership-signed)
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4
Author: MD TAZIZUL ISLAM <vitorgarh@gmail.com>
Date:   Sat Feb 21 04:26:26 2026 -0500

    SERIAL-12: enforce workspace/project ownership checks

commit fa46a8d9b102ec227688cd9434eefe0735cfe922
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4

commit 67ae9d9ad3930d81d4210814e0062ef90ff55967
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4

commit e146103d74b0ac3ab332a4d962cd7dcd616934cb
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4

commit 187ab45efd6040ed249e070fe954bcfeb20161bd
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4

commit 657c9132a9c006103642714a0b1f14934d244b64
Good "git" signature for vitorgarh@gmail.com with ED25519 key SHA256:R0tYm9VWcp/raUeMTykjR7ZdxspMdeeeFwpI7JQ47b4
```

### Runtime proof — fresh dev stack
```text
> docker compose -f docker/docker-compose.dev.yml down -v --remove-orphans
[+] down 9/9
 ✔ Container factory-web-dev                    Removed
 ✔ Container factory-dev-api-1                  Removed
 ✔ Container factory-dev-orchestrator-1         Removed
 ✔ Container factory-dev-db-1                   Removed
 ✔ Volume factory-dev_pgdata                    Removed
 ✔ Volume factory-dev_api_node_modules          Removed
 ✔ Network factory-dev_factory-dev              Removed
 ✔ Volume factory-dev_orchestrator_node_modules Removed
 ✔ Volume factory-dev_web_node_modules          Removed

> docker compose -f docker/docker-compose.dev.yml up -d --build
[+] up 12/12
 ✔ Image factory-dev-api                        Built
 ✔ Image factory-dev-web                        Built
 ✔ Image factory-dev-orchestrator               Built
 ✔ Network factory-dev_factory-dev              Created
 ✔ Volume factory-dev_orchestrator_node_modules Created
 ✔ Volume factory-dev_pgdata                    Created
 ✔ Volume factory-dev_api_node_modules          Created
 ✔ Volume factory-dev_web_node_modules          Created
 ✔ Container factory-dev-db-1                   Healthy
 ✔ Container factory-dev-orchestrator-1         Created
 ✔ Container factory-dev-api-1                  Healthy
 ✔ Container factory-web-dev                    Created

> docker compose -f docker/docker-compose.dev.yml ps
NAME                         IMAGE                      COMMAND                  SERVICE        CREATED         STATUS                             PORTS
factory-dev-api-1            factory-dev-api            "docker-entrypoint.s…"  api            2 minutes ago   Up 2 minutes (healthy)             0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp
factory-dev-db-1             postgres:16-alpine         "docker-entrypoint.s…"  db             2 minutes ago   Up 2 minutes (healthy)             0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
factory-dev-orchestrator-1   factory-dev-orchestrator   "docker-entrypoint.s…"  orchestrator   2 minutes ago   Up 2 minutes                       0.0.0.0:4100->4100/tcp, [::]:4100->4100/tcp
factory-web-dev              factory-dev-web            "docker-entrypoint.s…"  web            2 minutes ago   Up 10 seconds (health: starting)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
```

### Runtime proof — templates endpoint
```text
> curl.exe -i --retry 15 --retry-delay 2 --retry-connrefused http://localhost:4000/v1/templates | Select-Object -First 80
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
{"ok":true,"templates":[{"id":"basic-web"}]}
```

### Ownership smoke proof
```text
> $cookieA = 'factory_user_id=u_a'
> $cookieB = 'factory_user_id=u_b'

> $wsCreate = curl.exe -s -i -X POST http://localhost:4000/v1/workspaces -H "Content-Type: application/json" -H "Cookie: $cookieA" --data-raw '{ "name": "ws-a" }'
> $wsCreate | Select-Object -First 80
HTTP/1.1 201 Created
...
{"ok":true,"workspace":{"id":"24f07b6c-504d-4bb4-a282-de9c1c1638cb","name":"ws-a","ownerId":"u_a","createdAt":"2026-02-22T09:15:44.208Z","updatedAt":"2026-02-22T09:15:44.208Z"}}

> $wsJson = ($wsCreate | Select-Object -Last 1) | ConvertFrom-Json
> $wsId = $wsJson.workspace.id
WS_ID=24f07b6c-504d-4bb4-a282-de9c1c1638cb

> $projCreate = curl.exe -s -i -X POST http://localhost:4000/v1/workspaces/$wsId/projects -H "Content-Type: application/json" -H "Cookie: $cookieA" --data-raw '{ "templateId": "basic-web", "name": "proj-a" }'
> $projCreate | Select-Object -First 120
HTTP/1.1 201 Created
...
{"ok":true,"project":{"id":"670bbed0-526c-4732-8978-92128cdb11dc","workspaceId":"24f07b6c-504d-4bb4-a282-de9c1c1638cb","name":"proj-a","templateId":"basic-web","orchestratorProjectId":"proj-mlxj8rcu","status":"QUEUED","previewUrl":"http://localhost:3000/p/proj-mlxj8rcu/","logsRef":"ws://localhost:4100/v1/ws/projects/proj-mlxj8rcu/logs","provisionError":null,"createdAt":"2026-02-22T09:15:44.799Z","updatedAt":"2026-02-22T09:15:44.799Z"}}

> $projJson = ($projCreate | Select-Object -Last 1) | ConvertFrom-Json
> $projectId = $projJson.project.id
PROJECT_ID=670bbed0-526c-4732-8978-92128cdb11dc

> curl.exe -i http://localhost:4000/v1/projects/$projectId -H "Cookie: $cookieA" | Select-Object -First 25
HTTP/1.1 200 OK

> curl.exe -i http://localhost:4000/v1/projects/$projectId -H "Cookie: $cookieB" | Select-Object -First 25
HTTP/1.1 404 Not Found
```

