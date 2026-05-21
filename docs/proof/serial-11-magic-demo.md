# SERIAL 11 — Magic Demo Flow Proof
**Date:** 2026-05-21 | **Branch:** `claude/code-audit-review-bERxc`

---

## 1. Files Created / Modified

| File | Role |
|------|------|
| `api/src/demo/demo.service.ts` | HTML generator + session mgmt + scripted build events |
| `api/src/demo/demo.controller.ts` | Routes: GET /demo, GET /demo/gallery, POST /demo/start, GET /demo/activity/:id |
| `api/src/demo/demo.module.ts` | Module wiring |
| `api/src/app.module.ts` | Added DemoModule import |
| `api/.env.example` | Added DEMO_RUNTIME_ID |
| `docs/proof/serial-11-magic-demo.md` | This file |

---

## 2. Task Coverage

### 11-01: Unified Create Experience ✅
- Hero headline: "Describe your app. Watch AI build it."
- Big textarea with `Cmd+Enter` submit
- Build button with disabled state during fetch
- 8 starter chips that fill the prompt box
- `POST /demo/start` creates session, transitions to theater

### 11-02: AI Build Theater ✅
- 9 agent cards (Planner → Architect → Frontend → Backend → Database → QA → DevOps → Security → Healer)
- States: idle (grey dot), working (blue pulse border), success (green border), failed (red border)
- Agent cards update in real time via 500ms activity poll
- Live feed appends newest event to top with agent label + title + timestamp
- Progress bar fills linearly over ~10s build window
- Elapsed timer ticks live

### 11-03: Preview Reveal Experience ✅
- On `BUILD_COMPLETE` event → 1.6s cinematic pause → `showPhase('reveal')`
- Trophy emoji with `pop` CSS keyframe animation
- Preview panel with macOS-style browser chrome (traffic light dots, URL bar)
- If `DEMO_RUNTIME_ID` set: real iframe embedded at `/p/:id/shell`
- If not: click-through CTA to sign up

### 11-04: Viral Share Layer ✅
- **Copy Link**: `navigator.clipboard.writeText` → "Copied!" feedback
- **Open on Phone**: Shows QR modal with `/p/:id/qr` image
- **Share**: `navigator.share` with clipboard fallback
- **Remix**: links to `/p/:id/remix` (or CTA if no runtime)
- All share actions work on the demo reveal phase

### 11-05: Mobile-First Demo Flow ✅
- `max-width: 640px` centered containers throughout
- `min-height: 100vh` phases, no fixed-width assumptions
- `font-size: clamp(26px, 6vw, 48px)` headline scales
- Textarea sized for thumb-reachable submit button
- Chips wrap naturally at any viewport width
- Share buttons: `grid-template-columns: repeat(2, 1fr)` → `repeat(4, 1fr)` responsive

### 11-06: Starter Demo Gallery ✅
- 8 high-conversion prompts:
  1. 🐾 Airbnb for pets
  2. 🤖 AI CRM
  3. 📊 SaaS analytics
  4. 🍔 Food delivery
  5. 💼 AI job board
  6. ₿ Crypto tracker
  7. 🎓 Learning platform
  8. 📦 Inventory manager
- `GET /demo/gallery` returns JSON
- Chips rendered in landing phase

### 11-07: Build Summary Experience ✅
- Shown in building phase after `BUILD_COMPLETE` event
- 4-card grid: Tests passed (42), Vulnerabilities (0), AI agents (9), Build time (Xs)
- Prompt echoed back in reveal phase hero

### 11-08: Viral Recording Mode ✅
- `GET /demo?record=1` renders recording-optimized layout:
  - Top bar hidden (full-bleed canvas)
  - Agent icons larger (26px vs 22px)
  - Cards taller (100px vs 86px)
  - Feed list taller (280px vs 180px)
  - Hero padding increased for cinematic framing
  - Agent grid fills to 9 columns on desktop
  - Reveal delay 2.8s (more dramatic) vs 1.6s
  - Trophy emoji larger (72px vs 52px)
  - Reveal headline larger (42px vs 32px)

---

## 3. API Routes Added

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/demo` | None | Demo landing page (HTML) |
| `GET`  | `/demo?prompt=...` | None | Pre-filled prompt |
| `GET`  | `/demo?record=1` | None | Recording mode (11-08) |
| `GET`  | `/demo/gallery` | None | 8 starter prompts JSON |
| `POST` | `/demo/start` | None | Create demo session (rate-limited 10/IP/hr) |
| `GET`  | `/demo/activity/:demoProjectId` | None | Activity events (demo projects only) |

---

## 4. Security Properties

- **Demo project isolation**: `GET /demo/activity/:id` rejects any ID not starting with `demo-`
- **Rate limiting**: 10 demo sessions per IP per hour via Redis INCR + EXPIRE
- **IP hashing**: SHA-256 prefix, no raw IP stored
- **XSS prevention**: All dynamic values escaped with `esc()` before HTML insertion
- **Prompt security**: `prompt.slice(0, 500)` + metadata uses only `promptSnippet.slice(0, 80)`
- **CSP header**: `default-src 'self'` with minimal unsafe-inline for styles/scripts (no CDN)
- **BLOCKED_META_KEYS**: Demo events use `{ demo: true, promptSnippet }` — no secret keys

---

## 5. Infrastructure Reuse

| Serial | Feature | Reused In |
|--------|---------|-----------|
| SERIAL 07 | `ActivityStreamService.append()` | Demo scripted events |
| SERIAL 07 | `ActivityStreamService.query()` | Demo activity poll |
| SERIAL 07 | `ActivityStreamService.redactEvent()` | Public-safe event data |
| SERIAL 09 | `/p/:id/shell` | Embedded iframe in reveal |
| SERIAL 09 | `/p/:id/qr` | QR code in share modal |
| SERIAL 10 | Redis rate limiting pattern | Demo session IP limiter |

---

## 6. Build Verification

```
tsc --noEmit: PASS (0 errors)
npm test:     1 pre-existing failure (prisma.service.spec.ts: DATABASE_URL not set in CI)
              1 pass (app.controller.spec.ts)
              No new test failures introduced
```

---

## 7. Known Limitations

- Demo sessions emit scripted (fake) events — no real orchestrator provisioned
- `DEMO_RUNTIME_ID` must be manually configured to show a real embedded preview
- Activity polling every 500ms (no SSE) — acceptable latency for 10s build demo
- No analytics / conversion tracking on demo sessions (future work)
