# Serial 20C — Public Discovery + Creator App Feed
## Proof of Completion

**Branch:** `claude/code-audit-review-bERxc`  
**Date:** 2026-05-22  
**Build:** PASS (9/9 pages)  
**Tests:** 336/337 passing (1 pre-existing Prisma env failure, unrelated)

---

## Changes Delivered

### 20C-01 · Discovery Home Feed (`web/src/app/discover/page.tsx`)

- **URL:** `/discover` (484 lines, SSG static)
- **Tabs:** Trending · New · Most Remixed · Most Viewed · Staff Picks · AI Companies
- **20 seeded apps** with per-category gradient backgrounds, emoji, creator handle, stats
- **App cards:** category badge, `⚖️ Regulated` badge for guarded apps, ❤️/🔀/👁 stats, "Remix →" CTA, runtime status dot (green/amber/grey)
- **8 visible per page** with "Load more" button (+4 each click)
- **Responsive grid:** `minmax(min(280px,100%), 1fr)` collapses to 1 column on mobile
- **Safety filter (20C-08):** guarded apps excluded from "New" tab

### 20C-02 · Creator Spotlight (`web/src/app/discover/page.tsx`)

- **5 featured creators** with avatar circles, display name, @handle, verified badge, specialty tag
- **Stats:** follower count + app count per creator
- **Follow button** with local toggle state (fires `creator_follow` analytics event)
- Horizontal scroll row (mobile-safe)

### 20C-03 · Remix Chain Visualization (`web/src/app/discover/page.tsx`)

- **3 remix chains** rendered as vertical lineage cards connected by `↓` arrows
- Root card highlighted in indigo; depth-1 indented; depth-2 double-indented
- Shows emoji, app name, creator handle per node

### 20C-04 · Public App Pages (`web/src/app/apps/[slug]/page.tsx`)

- **URL:** `/apps/[slug]` (342 lines, server-rendered dynamic)
- **6 seeded app slugs** (medibook-pro, shopforge, financepulse, tutorai, routeiq, creatoros)
- Unknown slugs → 404 state with back link to `/discover`
- **Sections:** Hero (gradient card, emoji, category/regulated/council badges, status dot) → Stats bar (likes/remixes/views/build time) → Description + creator + features + tech stack → Marketplace packs → Remix tree (3 mock children) → Activity stream (5 entries with fade-in) → CTA buttons
- **Generated with Factory ✦** badge on hero
- **🛡️ Council Approved** badge when `councilApproved: true`
- Like button increments local state + fires analytics

### 20C-05 · Discovery Search + Filter (`web/src/app/discover/page.tsx`)

- **Search input** — instant client-side filter by app name or creator handle
- **Category filter chips** — All · Healthcare · E-Commerce · Finance · Education · Logistics · Social · Analytics · SaaS (horizontal scroll)
- Filters compose with active tab (tab → category → search)

### 20C-06 · Social Proof Engine (`web/src/app/discover/page.tsx`)

- **Hero strip** with animated counters: 12,847 apps built · 4,291 creators · 89,342 remixes · N live right now (ticks every 5s)
- Count-up animation on mount via `useEffect`

### 20C-07 · Feed Performance + Pagination (`web/src/app/discover/page.tsx`)

- **8 cards initial** + "Load more" (+4 each)
- `minmax(min(280px,100%), 1fr)` grid — no layout shift
- Category/search filters reset pagination to page 1
- Horizontal creator scroll: no layout shift
- Filter chips: `overflowX: 'auto'` — mobile-safe

### 20C-08 · Discovery Trust + Safety

- **Backend:** `discover()` filters `hidden: true` apps and `moderationStatus HIDDEN/FLAGGED` apps
- **Backend:** Creator `BANNED` trust flag excludes all apps from that creator
- **Frontend:** guarded apps excluded from "New" tab
- `BLOCKED_META_KEYS` pattern respected — no raw internal keys exposed

### 20C-09 · Mobile Viral Feed

- Grid collapses to 1 column on small screens
- Creator spotlight: horizontal scroll with `overflowX: auto`
- Tabs: horizontal scroll, `whiteSpace: nowrap`
- Filter chips: horizontal scroll
- Remix CTA + Share buttons: `flexWrap: wrap` on CTA rows

### 20C-10 · Analytics + Engagement Events

Events fired (no PII, no raw text):
| Event | Trigger |
|---|---|
| `discover_tab_change` | Tab click (tab name) |
| `discover_category_filter` | Category chip click |
| `discover_search` | Search input (query.length only) |
| `discover_app_remix_click` | Remix button on feed card |
| `discover_feed_load_more` | Load more button |
| `creator_follow` | Follow button toggle |
| `discover_share_click` | Share CTA |
| `feed_scroll_depth` | 25/50/75/100% scroll |
| `app_open` | App page mount |
| `preview_open` | Like click on app page |
| `remix_open` | Remix CTA on app page |
| `share_click` | Share CTA on app page |

### 20C-11 · Admin Discovery Moderation Foundations (backend)

New types in `social.types.ts`:
- `ModerationStatus = 'APPROVED' | 'PENDING' | 'HIDDEN' | 'FLAGGED'`
- `CreatorTrustFlag = 'NONE' | 'VERIFIED' | 'WARNED' | 'BANNED'`
- `PublishedApp.category?`, `.featured?`, `.hidden?`, `.moderationStatus?`
- `CreatorProfileData.trustFlag`
- `DiscoverParams.sortBy` extended with `'STAFF_PICKS'`
- `DiscoverParams.category?`, `.cursor?`, `.limit?`, `.remixableOnly?`
- `DiscoverResult.cursor?` (base64-encoded next page index)

New service methods in `social-signal.service.ts`:
- `featureApp(projectId, featured)` — toggle featured flag
- `hideApp(projectId, hidden)` — toggle hidden flag
- `setModerationStatus(projectId, status)` — set moderation state
- `setCreatorTrustFlag(handle, flag)` — set creator trust level
- `getCreatorTrustFlag(handle)` — read trust level

New admin endpoints in `social.controller.ts` (gated by `ADMIN_API_KEY` env var):
- `POST /v1/admin/apps/:projectId/feature`
- `POST /v1/admin/apps/:projectId/hide`
- `POST /v1/admin/apps/:projectId/moderation`
- `POST /v1/admin/creators/:handle/trust`

Discovery enhancements:
- `GET /v1/social/discover?category=&cursor=&limit=&remixableOnly=` (new params)
- Cursor pagination with base64-encoded index
- `STAFF_PICKS` sort (featured apps only)

### 20C-12 · Proof Doc

- `docs/proof/serial-20c-public-discovery.md` — this file

---

## Landing Page Update (`web/src/app/page.tsx`)

- Nav "Discover" link → `/discover` (was `#discovery` anchor)
- "Browse the full ecosystem →" CTA button added below discovery section cards

---

## Files Changed

```
api/src/social/social.types.ts              +33 -2   (moderation types, extended params)
api/src/social/social-signal.service.ts     +75 -2   (discover enhancements, admin methods)
api/src/social/social.controller.ts         +78 -2   (extended discover, admin endpoints)
api/src/social/creator-profile.service.ts   +1       (trustFlag field init)
web/src/app/discover/page.tsx               +484     (new — discovery feed)
web/src/app/apps/[slug]/page.tsx            +342     (new — public app pages)
web/src/app/page.tsx                        +8 -1    (discover nav link + CTA)
docs/proof/serial-20c-public-discovery.md   +this    (proof doc)
```

## Build Output

```
Route (app)
├ ○ /
├ ○ /_not-found
├ ƒ /apps/[slug]       ← new
├ ○ /dashboard
├ ƒ /dashboard/projects/[projectId]
├ ○ /dashboard/workspaces
├ ○ /demo
├ ○ /discover          ← new
└ ○ /factory-preview
```

## Test Results

```
Test Suites: 1 failed (pre-existing Prisma env), 9 passed, 10 total
Tests:       1 failed (pre-existing), 336 passed, 337 total
Social tests: 52/52 passing (no regressions from backend changes)
```

## Rollback Plan

If discover page needs to be reverted:
```
git revert HEAD  # reverts the Serial 20C commit
```
No database migrations — all changes are in-memory service only.

---

**SERIAL 20C — LOCKED ✓**
