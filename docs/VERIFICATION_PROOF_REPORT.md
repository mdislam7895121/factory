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

