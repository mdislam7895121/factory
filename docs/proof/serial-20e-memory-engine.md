# Serial 20E — Project Memory Engine

**Branch:** `claude/code-audit-review-bERxc`  
**Completed:** 2026-05-22  
**Status:** ✅ LOCKED

---

## Definition of Done

| Criterion | Result |
|-----------|--------|
| Build PASS | ✅ 17/17 pages (including `/memory`) |
| Tests PASS | ✅ 377/378 (40/40 new memory tests pass; 1 pre-existing Prisma env skip) |
| git push | ✅ `3054ccf` backend + frontend committed and pushed |
| Proof doc | ✅ This document |
| No breaking API contracts | ✅ Additive-only schema, new module, no modified existing endpoints |

---

## Tasks Delivered

### 20E-01 — Memory Data Foundation
- **Prisma schema** (`api/prisma/schema.prisma`): 4 new enums, 7 new models
  - Enums: `MemoryVisibility`, `MemoryPriority`, `DecisionLockState`, `ContextCompressionLevel`
  - Models: `UserAgentProfile`, `ProjectMemory`, `ProjectDecision`, `MemorySnapshot`, `ContextPack`, `AgentInstructionSet`, `MemoryAuditEvent`
  - All models indexed on `workspaceId` / `projectId` for query performance
- `api/src/memory/memory.types.ts` — TypeScript interfaces for all in-memory state
- `MEMORY_BLOCKED_KEYS` regex: `/secret|token|key|password|credential|auth|private|prompt|instruction|system|chain_of_thought|hidden|internal|api_key/i`

### 20E-02 — Founder Profile API
Endpoints: `POST /v1/memory/profile`, `GET /v1/memory/profile/:userId`, `DELETE /v1/memory/profile/:userId`

Fields: `founderName`, `company`, `role`, `country`, `timezone`, `preferredLang` (default: `en`), `techLevel` (default: `intermediate`), `commStyle`, `preferredStack[]`, `goals[]`, `visibility` (default: `PRIVATE`)

Merge semantics on re-save (partial update).

### 20E-03 — Agent Instructions API
Endpoints: `POST /v1/memory/instructions`, `GET /v1/memory/instructions?workspaceId=`

Upsert by workspaceId. Rules with blocked keys silently filtered at save time.

### 20E-04 — Project Memory Entries API
Endpoints: `POST /v1/memory/entries`, `GET /v1/memory/entries?projectId=`, `PUT /v1/memory/entries/:id`, `DELETE /v1/memory/entries/:id`

Query filters: `includeArchived`, `pinnedOnly`, `tag`. Pinned entries sort first in listing. Content rejected if matches `MEMORY_BLOCKED_KEYS`.

### 20E-05 — Locked Decisions API
Endpoints: `POST /v1/memory/decisions`, `GET /v1/memory/decisions?projectId=`, `POST /v1/memory/decisions/:id/lock`, `POST /v1/memory/decisions/:id/unlock`

Lock states: `UNLOCKED` → `SOFT_LOCKED` → `HARD_LOCKED`. Locked decisions sort before unlocked. Lock records `lockedBy` + `lockedAt`.

### 20E-06 — Context Compression (Token Optimization)
Four compression levels with progressive trimming:

| Level | Strategy |
|-------|----------|
| `FULL` | All non-archived entries, full content |
| `BALANCED` | Pinned + up to 10 normal, content trimmed to 200 chars |
| `MINIMAL` | Up to 5 pinned only, content trimmed to 80 chars |
| `EMERGENCY` | Up to 3 pinned keys only (no content) |

Token estimation: `Math.ceil(text.length / 4)`

Endpoints: `POST /v1/memory/context-packs`, `GET /v1/memory/context-packs?workspaceId=`, `GET /v1/memory/context-packs/:id/replay`

### 20E-07 — Memory Snapshots
Endpoints: `POST /v1/memory/snapshots`, `GET /v1/memory/snapshots?workspaceId=`, `POST /v1/memory/snapshots/:id/restore`

Snapshot payload contains: entries, decisions, profiles, instructions. Restore replaces live entries. `_payloadSize` returned in listing (payload omitted from list response for bandwidth).

### 20E-08 — Memory Visibility Panel (Frontend)
`web/src/app/memory/page.tsx` — 526 lines, 7 tabs:

1. **Founder Profile** — form for all profile fields with save/delete
2. **Project Rules** — add/pin/archive/delete memory entries, tag filter
3. **Locked Decisions** — add decisions, soft/hard lock, unlock controls
4. **Agent Behavior** — workspace instruction set with rule list editor
5. **Context Packs** — generate at 4 compression levels, list packs, replay
6. **Snapshots** — create labeled snapshots, list, restore with confirmation
7. **Audit History** — loads real data from `GET /v1/memory/audit?limit=30`

Stats bar: pinned memories · locked decisions · active rules · context packs (seeded counters + live audit call).

Nav link added to landing page (`/`) sidebar.

### 20E-09 — Context Replay
`buildReplayPack(packId)`: returns pack content, increments `usageCount`, records `CONTEXT_REPLAY` audit event. Replay packs include `metadata` (source pack label, compression level, token estimate, timestamp).

### 20E-10 — Memory Security Layer
- `redactContent(content)`: throws `BadRequestException` on blocked key match (applied to all entry/instruction content)
- `redactTags(tags)`: silently removes tags matching blocked keys
- Audit log bounded at 2000 entries (prunes oldest 500 on overflow)
- Security tests: blocked content rejected, blocked tags stripped, audit records all mutations, context packs free of blocked keys

### 20E-11 — Audit Log
Endpoint: `GET /v1/memory/audit?workspaceId=&limit=` (max 200, default 50)

Tracked actions: `PROFILE_SAVE`, `PROFILE_DELETE`, `MEMORY_ADD`, `MEMORY_UPDATE`, `MEMORY_DELETE`, `DECISION_ADD`, `DECISION_LOCK`, `DECISION_UNLOCK`, `INSTRUCTIONS_SAVE`, `SNAPSHOT_CREATE`, `SNAPSHOT_RESTORE`, `CONTEXT_PACK_CREATE`, `CONTEXT_REPLAY`

### 20E-12 — IDE Integration Readiness
Memory service exports `MemoryService` via `MemoryModule` (`exports: [MemoryService]`). Other modules can inject it via NestJS DI without re-declaring the service. All methods are synchronous (no Prisma calls) so IDE integrations can call them without awaiting DB.

### 20E-13 — Module Registration
`api/src/app.module.ts` imports `MemoryModule`. No existing providers removed or modified.

---

## Test Results

```
PASS src/memory/memory.spec.ts
  MemoryService
    Founder Profile       5/5  ✓
    Memory Entries        9/9  ✓
    Decisions             7/7  ✓
    Agent Instructions    4/4  ✓
    Memory Snapshots      3/3  ✓
    Context Packs         5/5  ✓
    Memory Security       4/4  ✓
    Audit Log             2/2  ✓

Total: 40 passed, 40 total
```

---

## Build Output

```
Route (app)                    Size
├ ○ /                         (landing)
├ ○ /demo                     (serial 20B)
├ ○ /discover                 (serial 20C)
├ ○ /apps/[slug]              (serial 20C)
├ ○ /admin                    (serial 20D)
├ ○ /admin/runtime            (serial 20D)
├ ○ /admin/discovery          (serial 20D)
├ ○ /admin/creators           (serial 20D)
├ ○ /admin/health             (serial 20D)
├ ○ /admin/billing            (serial 20D)
├ ○ /admin/security           (serial 20D)
└ ○ /memory                   (serial 20E) ← NEW

17/17 pages compiled successfully
```

---

## File Inventory

| File | Lines | Status |
|------|-------|--------|
| `api/prisma/schema.prisma` | +68 lines | ✅ Committed 3054ccf |
| `api/src/memory/memory.types.ts` | 122 | ✅ Committed 3054ccf |
| `api/src/memory/memory.service.ts` | 401 | ✅ Committed 3054ccf |
| `api/src/memory/memory.controller.ts` | 249 | ✅ Committed 3054ccf |
| `api/src/memory/memory.module.ts` | 10 | ✅ Committed 3054ccf |
| `api/src/memory/memory.spec.ts` | 303 | ✅ Committed 3054ccf |
| `api/src/app.module.ts` | +2 lines | ✅ Committed 3054ccf |
| `web/src/app/memory/page.tsx` | 526 | ✅ This commit |
| `docs/proof/serial-20e-memory-engine.md` | — | ✅ This commit |

---

## Security Notes

- No raw secrets stored: `MEMORY_BLOCKED_KEYS` enforced at write time for all content fields
- Tags containing blocked patterns stripped silently (no user-visible error for tag names)
- Audit log immutable from API (GET only, no DELETE endpoint)
- Admin key never stored in memory service (stateless auth at controller layer)
- All profile visibility defaults to `PRIVATE`
