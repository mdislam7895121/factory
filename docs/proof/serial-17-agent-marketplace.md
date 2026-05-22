# Serial 17 — Agent Marketplace

## Status: LOCKED ✅

**Branch:** `claude/code-audit-review-bERxc`
**Scope:** Agent pack marketplace — metadata registry, install/uninstall lifecycle, search & discovery, trust badge system, compatibility validation, regulated-pack enforcement, demo UI integration.

---

## Proof Items

### 17-01 — Types (`agent-manifest.types.ts`)
- `AgentManifest` interface with 25 required fields
- `TrustBadge` union: `VERIFIED | COMMUNITY | OFFICIAL | REGULATED | ENTERPRISE_READY`
- `PricingModel` union: `FREE | FREEMIUM | PAID | ENTERPRISE`
- `PackVisibility` union: `PUBLIC | PRIVATE | UNLISTED`
- `InstallRequest`, `InstallResult`, `UninstallResult`, `CompatibilityResult`, `MarketplaceSearchParams`, `PackSummary` interfaces

### 17-02 — Registry (`marketplace.registry.ts`)
10 packs with full manifest data:

| Slug | Category | Regulated | Pricing | Trust Badges |
|------|----------|-----------|---------|--------------|
| `healthcare-starter-pack` | healthcare | ✅ | PAID | VERIFIED, OFFICIAL, REGULATED |
| `ecommerce-pro-pack` | ecommerce | ❌ | PAID | VERIFIED, OFFICIAL |
| `restaurant-ops-pack` | restaurant | ❌ | FREEMIUM | VERIFIED |
| `logistics-delivery-pack` | logistics | ❌ | PAID | VERIFIED, ENTERPRISE_READY |
| `crm-growth-pack` | crm | ❌ | FREEMIUM | VERIFIED, OFFICIAL |
| `saas-launch-pack` | saas | ✅ | PAID | VERIFIED, REGULATED |
| `education-platform-pack` | education | ❌ | FREEMIUM | VERIFIED |
| `ai-automation-pack` | automation | ❌ | ENTERPRISE | VERIFIED, OFFICIAL, ENTERPRISE_READY |
| `creator-studio-pack` | creator | ❌ | FREE | COMMUNITY, VERIFIED |
| `marketplace-builder-pack` | marketplace | ❌ | PAID | VERIFIED |

Registry integrity tests (10/10):
- ✅ All 10 packs have required manifest fields
- ✅ All slugs and IDs are unique
- ✅ Regulated packs have `guardedModeRequired = true`
- ✅ `VERIFIED` badge packs have `verified = true`
- ✅ `REGULATED` badge on regulated packs
- ✅ `OFFICIAL` badge present on official packs
- ✅ Every capability has `id`, `name`, `description`
- ✅ Every pack has at least one starter prompt
- ✅ No CoT/hidden metadata in registry JSON
- ✅ No executable code fields (`executableCode`, `systemPrompt`, `rawPrompt` undefined)

### 17-03 — Service (`marketplace.service.ts`)
```
MarketplaceService (Injectable)
├── listPacks(params?) → PackSummary[]        — filter + sort
├── getPack(slug) → AgentManifest            — throws NotFoundException
├── getPacksByDomain(ids[]) → PackSummary[]  — domain-filtered
├── validateCompatibility(slug, ws) → CompatibilityResult
├── install(request) → InstallResult         — additive, per-workspace
├── uninstall(slug, ws) → UninstallResult
├── isInstalled(slug, ws) → boolean
└── getInstalledPacks(ws) → PackSummary[]
```
- State: `Map<workspaceId, Set<packSlug>>` — in-process, no DB dependency
- Additive-only installs: uninstall only affects target workspace; other workspaces unaffected

### 17-04 — Controller (`marketplace.controller.ts`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/v1/marketplace/packs` | List/search/filter packs |
| GET | `/v1/marketplace/packs/:slug` | Single pack detail |
| POST | `/v1/marketplace/install` | Install pack into workspace |
| POST | `/v1/marketplace/uninstall` | Remove pack from workspace |
| GET | `/v1/marketplace/installed/:workspaceId` | List installed packs |

DTOs with `class-validator`: `InstallDto`, `UninstallDto`, `SearchQueryDto`

### 17-05 — Compatibility Validation
- Conflict detection: `ecommerce-pro-pack` conflicts with `marketplace-builder-pack`
- Missing dependency warnings included in `compatibilityNotes`
- Regulated pack guarded-mode warning always included
- `{ compatible: false, reasons: [...] }` for unknown packs

### 17-06 — Trust Badge System
- Healthcare pack: `['VERIFIED', 'OFFICIAL', 'REGULATED']`
- AI Automation pack: `['VERIFIED', 'OFFICIAL', 'ENTERPRISE_READY']`
- Creator Studio pack: `['COMMUNITY', 'VERIFIED']`
- Invariant: `REGULATED` badge ↔ `regulated: true` ↔ `guardedModeRequired: true`

### 17-07 — Demo UI Integration
Added to `/demo` page:
- `.mkt-section` container with `display:none`, fade-in animation
- `.mkt-card` cards: icon, name, truncated description, trust badges
- `.mkt-badge` variants: `verified` (green), `official` (blue), `regulated` (yellow), `enterprise` (grey), `community` (purple-tinted)
- `.mkt-install-btn` → calls `POST /v1/marketplace/install`; on success switches to `.installed` (green)
- `.mkt-built-with` label: "🏗️ Built using \<Pack Name\>"
- `showMarketplacePacks(domainIds[])` — triggered after blueprint + council sections appear
- Fetches `GET /v1/marketplace/packs?tags=<domain-ids>` and renders top 3 matching packs

### 17-08 — Search & Discovery
- Query matches: name, description, tags, supportedDomains
- Category filter: exact match
- Tag filter: OR across provided tags
- `regulated` boolean filter
- `pricingModel` filter
- Sort: `INSTALL_COUNT` (desc), `RATING` (desc), `NAME` (asc), `NEWEST` (id desc)
- Default sort: `INSTALL_COUNT` desc

### 17-09 — Safety
- No CoT or metadata leaks in registry (`/chain.of.thought|hidden prompt|system prompt/i` not found)
- No regulated pack can set `guardedModeRequired = false`
- Install result JSON contains no CoT or metadata
- Workspace isolation: uninstall in workspace A does not affect workspace B
- No executable code in manifests (`executableCode`, `systemPrompt`, `rawPrompt` undefined)

### 17-10 — Module Registration
- `MarketplaceModule` registered in `AppModule.imports`
- `MarketplaceService` exported from `MarketplaceModule` for cross-module use

### 17-11 — Test Suite
```
51 tests / 51 passed — 0 failures
 ├── 10 registry integrity tests
 ├── 17 service operation tests (list, get, domain, search, filter, sort)
 ├── 8 install lifecycle tests
 ├── 4 uninstall lifecycle tests
 ├── 4 compatibility validation tests
 ├── 3 trust badge verification tests
 └── 5 safety tests
```
Run: `npx jest src/agents/marketplace/marketplace.spec.ts --no-coverage`

---

## Files Changed

| File | Status |
|------|--------|
| `api/src/agents/marketplace/agent-manifest.types.ts` | NEW |
| `api/src/agents/marketplace/marketplace.registry.ts` | NEW |
| `api/src/agents/marketplace/marketplace.service.ts` | NEW |
| `api/src/agents/marketplace/marketplace.controller.ts` | NEW |
| `api/src/agents/marketplace/marketplace.module.ts` | NEW |
| `api/src/agents/marketplace/marketplace.spec.ts` | NEW |
| `api/src/app.module.ts` | MODIFIED |
| `api/src/demo/demo.service.ts` | MODIFIED |
| `docs/proof/serial-17-agent-marketplace.md` | NEW |
