# Serial 18 — Creator Identity + Social Layer

## Status: LOCKED ✅

**Branch:** `claude/code-audit-review-bERxc`
**Scope:** Creator profiles, social signals, public creator pages, remix chain visibility, app discovery, preview shell social integration, demo reveal social card.

---

## Proof Items

### 18-01 — Schema (`prisma/schema.prisma`)
Additive models added (no breaking changes):

```
enum ProfileVisibility { PUBLIC PRIVATE }
enum SocialSignalType  { LIKE SAVE SHARE VIEW REMIX }

model CreatorProfile {
  id, userId (unique), handle (unique), displayName, bio?,
  avatarUrl?, websiteUrl?, publicEmail?, country?,
  skills (String[]), verified, visibility, createdAt, updatedAt
  @@index([handle]) @@index([userId])
}

model CreatorFollow {
  id, followerUserId, creatorUserId, createdAt
  @@unique([followerUserId, creatorUserId])
  @@index([creatorUserId]) @@index([followerUserId])
}

model AppSocialSignal {
  id, projectId, runtimeId?, previewRouteId?, userId?,
  signalType, ipHash?, createdAt
  @@index([projectId]) @@index([signalType]) @@index([createdAt])
}
```

### 18-02 — Creator Profile Service (`social/creator-profile.service.ts`)
```
CreatorProfileService (Injectable)
├── createProfile(req)      → CreatorProfileData  (conflict-checked, normalized handle)
├── updateProfile(req)      → CreatorProfileData
├── getPublicProfile(handle)→ PublicProfile        (throws if PRIVATE or unknown)
├── getOwnProfile(userId)   → CreatorProfileData   (always accessible by owner)
├── getProfileByUserId      → CreatorProfileData | undefined
├── getHandleForUserId      → string | undefined
├── follow(userId, handle)  → { following: true }
├── unfollow(userId, handle)→ { following: false }
├── isFollowing             → boolean
├── validateHandle(handle)  → void (throws BadRequestException on violation)
└── attributeApp(userId, projectId) → void
```

Handle validation rules:
- 3–30 chars, lowercase `[a-z0-9-]`, no leading/trailing/consecutive hyphens
- Reserved handles: `admin, api, demo, login, me, ...` (17 reserved)
- Uppercase input passed to `validateHandle` is rejected (callers must provide lowercase)
- `createProfile` auto-lowercases before validation

### 18-03 — Social Signal Service (`social/social-signal.service.ts`)
```
SocialSignalService (Injectable)
├── recordSignal(params)    → { recorded, reason? }   (IP-hashed, dedup-aware)
├── getSignalCounts(projectId) → AppSignalCounts
├── hashIp(ip)              → 32-char hex (SHA-256 prefix)
├── publishApp(app)         → void
├── unpublishApp(projectId) → void
├── getPublicApp(projectId) → PublishedApp | undefined
├── discover(params)        → DiscoverResult
├── registerRemix(params)   → void
├── getRemixSource(runtimeId) → RemixSource | null  (null if PRIVATE)
└── getRemixCount(sourceId) → number
```

Signal dedup rules:
- Anonymous LIKE / SAVE: deduplicated within 60s window per `(ipHash, projectId, signalType)`
- Authenticated (userId present): no IP dedup applied
- VIEW / SHARE / REMIX: never deduplicated

### 18-04 — Social API (`social/social.controller.ts`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/u/:handle` | Public HTML creator page (18-05) |
| POST | `/v1/social/profile` | Create creator profile |
| PATCH | `/v1/social/profile` | Update creator profile |
| GET | `/v1/social/profile/me?userId=` | Get own profile |
| POST | `/v1/social/follow/:handle` | Follow creator |
| POST | `/v1/social/unfollow/:handle` | Unfollow creator |
| GET | `/v1/social/apps/:projectId/stats` | Get signal counts |
| POST | `/v1/social/apps/:projectId/signal` | Record signal |
| POST | `/v1/social/apps/publish` | Publish app to discovery |
| POST | `/v1/social/apps/:projectId/unpublish` | Unpublish app |
| GET | `/v1/social/discover` | Discovery feed |
| POST | `/v1/social/report/:handle` | Report creator (placeholder) |

### 18-05 — Public Creator Page (`GET /u/:handle`)
Mobile-first HTML page rendering:
- Creator avatar (initial letter fallback), display name, `@handle`
- Verified badge (green `✓ Verified`)
- Bio, website link, public email (only if set), country flag
- Stats row: Apps / Followers / Following counts
- Skills chips
- Follow button (localStorage-persisted state)
- App cards loaded from `/v1/social/discover?creatorHandle=<handle>`
- "Powered by Factory" footer
- 404 page for unknown or PRIVATE creators

### 18-06 — Preview Shell Social Integration (`preview/preview-shell.service.ts`)
`ShellContext` extended with optional social fields:
- `creatorHandle`, `creatorDisplayName`
- `likeCount`, `saveCount`, `remixCount`
- `remixedFromHandle`, `remixedFromSlug`

Social bar (`#social-bar`) added to PUBLIC shells:
- Creator identity row with link to `/u/:handle`
- ❤️ Like button → `POST /v1/social/apps/:projectId/signal { signalType: 'LIKE' }`
- 🔖 Save button → same for `SAVE`
- 👤 View creator link
- Remix lineage row: "🔀 Remixed from @handle" with links
- Buttons show `.liked` / `.saved` state on success

Privacy: social bar only rendered when `isPublic && (creatorHandle || projectId)` — private previews show nothing.

### 18-07 — Remix Chain Visibility
`SocialSignalService.registerRemix(params)` records:
- `forkRuntimeId → { sourceRuntimeId, sourcePreviewRouteId, visibility }`

`getRemixSource(forkRuntimeId)` returns `RemixSource | null`:
- Returns `null` when chain entry is `PRIVATE` or unknown
- Returns `{ sourceRuntimeId, sourcePreviewRouteId }` only for `PUBLIC` chains

### 18-08 — Discovery Foundation (`GET /v1/social/discover`)
Sort options: `TRENDING` (score = likes×3 + saves×2 + views), `NEWEST`, `MOST_REMIXED`, `MOST_VIEWED`
Filters: `domain`, `marketplacePackSlug`, `creatorHandle`
Always enforces: **PUBLIC apps only** — private apps never appear

### 18-09 — Abuse + Privacy Controls
- Profile visibility `PRIVATE` → creator page returns 404, public profile API throws NotFoundException
- `getPublicProfile` never exposes `userId`
- `publicEmail` only included when creator explicitly set it
- IP hashed to SHA-256 (32-char prefix) before any storage — raw IP never stored
- Anonymous LIKE/SAVE deduplicated within 60s window
- `GET /u/:handle` 404s for private/unknown profiles
- Report route (`POST /v1/social/report/:handle`) accepted without leaking data
- Safety guard in `toPublicProfile`: checks output for blocked keys (`password`, `token`, `credential`, `hidden`, `chain_of_thought`, `system`, ...)

### 18-10 — Demo Integration (`demo/demo.service.ts`)
After build reveal:
- Creator card (`#creator-card`): avatar initial, "Anonymous builder", like/remix counters, "View profile" button
- Publish prompt (`#publish-prompt`): "Publish this app to your creator profile" CTA
- Publish CTA calls `POST /v1/social/apps/publish` with `projectId` + prompt text as title
- Stats loaded from `GET /v1/social/apps/:projectId/stats`

### 18-11 — Tests (`social/social.spec.ts`)
```
52 tests / 52 passed — 0 failures

CreatorProfileService (27 tests):
 ├── Handle validation (9 tests: length, case, chars, hyphens, reserved)
 ├── Profile CRUD (6 tests: create, normalize, conflict detection, update)
 ├── Public vs private (4 tests: public, private hidden, 404, own always accessible)
 ├── Privacy (3 tests: no userId leak, publicEmail opt-in, no metadata leak)
 └── Follow/unfollow + counts (5 tests: follow, unfollow, self-follow error, followerCount, appCount)

SocialSignalService (25 tests):
 ├── Signal recording (2 tests: basic count, zero for unknown)
 ├── IP hashing (3 tests: consistent hash, uniqueness, non-reversible)
 ├── Dedup (5 tests: anonymous like, save, authenticated bypass, VIEW bypass)
 ├── App registry (4 tests: publish, private hidden, unpublish, getPublicApp)
 ├── Discovery (5 tests: domain filter, creator filter, NEWEST, MOST_VIEWED, PUBLIC-only)
 ├── Remix chain (4 tests: register public, private null, unknown null, count)
 └── Safety (2 tests: no metadata in counts, no metadata in discover)
```
Run: `npx jest src/social/social.spec.ts --no-coverage`

### 18-12 — Module Registration
- `SocialModule` registered in `AppModule.imports`
- Exports: `CreatorProfileService`, `SocialSignalService`

---

## Files Changed

| File | Status |
|------|--------|
| `api/prisma/schema.prisma` | MODIFIED — added 3 models + 2 enums |
| `api/src/social/social.types.ts` | NEW |
| `api/src/social/creator-profile.service.ts` | NEW |
| `api/src/social/social-signal.service.ts` | NEW |
| `api/src/social/social.controller.ts` | NEW |
| `api/src/social/social.module.ts` | NEW |
| `api/src/social/social.spec.ts` | NEW |
| `api/src/preview/preview-shell.service.ts` | MODIFIED — social bar |
| `api/src/demo/demo.service.ts` | MODIFIED — creator card + publish CTA |
| `api/src/app.module.ts` | MODIFIED — added SocialModule |
| `docs/proof/serial-18-creator-social-layer.md` | NEW |

---

## Privacy Proof

| Threat | Mitigation |
|--------|-----------|
| Raw email exposure | Only `publicEmail` (opt-in) shown; internal email never accessible |
| userId leakage | `stripPrivateFields` removes `userId` from all API responses |
| IP tracking | SHA-256 hash (32-char prefix) only — raw IP never stored |
| Private profile scraping | PRIVATE profiles 404 on all public endpoints |
| Private app in discovery | `visibility !== 'PUBLIC'` filter enforced in `discover()` |
| Internal metadata in output | Blocked-keys safety guard in `toPublicProfile` |
| Remix source leakage | `getRemixSource` returns null for PRIVATE chains |

---

## Rollback Plan

All changes are additive:
- Schema models can be dropped without affecting existing models
- `SocialModule` can be removed from `AppModule.imports` without breakage
- `ShellContext` social fields are all optional — existing shell callers unaffected
- Demo creator card is hidden (`display:none`) until `showCreatorCard()` is called
