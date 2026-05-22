# Serial 20B — Launch Onboarding + Magic Demo Activation
## Proof of Completion

**Branch:** `claude/code-audit-review-bERxc`  
**Date:** 2026-05-22  
**Build:** PASS (8/8 pages)  
**Tests:** 336/337 passing (1 pre-existing Prisma env failure, unrelated to 20B)

---

## Changes Delivered

### 20B-01 · Hero Prompt Activation (`web/src/app/page.tsx`)
- Added `useRouter` and `useCallback` imports
- `handleBuild()` — validates prompt, tracks analytics, pushes to `/demo?prompt=<encoded>`
- Textarea `onFocus` → `track('landing_prompt_focus')`
- Textarea `onKeyDown` Enter → calls `handleBuild()`
- Starter chips `onClick` → `setPrompt(ex)` + `track('starter_prompt_click', { prompt_length })`
- Build button disabled when `!prompt.trim()`, text changes to "Generate live app →" when filled
- Final CTA "Start building free →" points to `/demo` (was `/dashboard`)

### 20B-02 through 20B-10 · Demo Wizard (`web/src/app/demo/page.tsx`)

**Step machine:** `validating → (beta?) → assembling → blueprint → council → reveal`

| Step | Trigger | Duration |
|---|---|---|
| `validating` | Page load | 800ms |
| `beta` | API `/beta/status` returns non-open mode | User action |
| `assembling` | Beta cleared or mode=open | Agent delays + 600ms |
| `blueprint` | All agents visible | User click |
| `council` | "Build this →" click | 9600ms scripted |
| `reveal` | Council complete + "Open preview →" click | Permanent |
| `error` | Prompt < 5 chars, > 500 chars, or API error | User retry |

**Prompt analysis:**
- `detectCategory()` — 8 keyword maps (healthcare, ecommerce, education, logistics, finance, social, analytics, saas)
- `extractAppName()` — strips "build a/an/the" prefix, falls back to category default
- Zero AI calls — fully client-side

**AI team assembly:**
- `AGENTS_BY_CATEGORY` — 6 specialized agents per category with staggered reveal delays (0–1000ms)
- Fade-in animation per agent card

**Blueprint generation:**
- `BLUEPRINTS` — per-category static blueprint: targetUsers, features, roles, pages, workflows, safeDefaults
- Expandable "View technical blueprint" section with NestJS/Next.js/PostgreSQL/Redis stack
- "Build this →" CTA advances to council

**Council theater (17 scripted events, 0–9500ms):**
- Replicates `SCRIPT_STEPS` from `demo.service.ts` client-side
- Progressive event list with running/success states
- Verdict card: APPROVED (green) or APPROVED WITH WARNINGS (amber)
- "Open preview →" advances to reveal

**Beta gate (4 modes):**
- `open` — skip beta step, proceed directly to assembling
- `invite` — invite code form → `POST /beta/validate`
- `waitlist` — waitlist confirmation card
- `closed` — closed platform message

**Reveal / share:**
- Mock preview URL (`preview.factory.run/demo-<random>`)
- Copy link button with clipboard API + "✓ Copied!" feedback
- Web Share API button (mobile)
- "Remix this app" → back to `/` homepage

**Analytics events (no PII):**
- `beta_gate_seen` · `ai_team_assembled` · `blueprint_viewed` · `council_started` · `preview_revealed` · `share_clicked` · `remix_clicked`

**Error states:**
- Prompt too short (< 5 chars), too long (> 500 chars)
- Beta API failure → gracefully defaults to `open` mode
- Invite code invalid → inline error message

**Mobile polish:**
- `auto-fill` grid for agents (minmax 140px)
- `flex-wrap` on all button rows
- TopBar progress dots only (labels hidden on small screens via `display:none` + class `.step-label`)

### Proof Doc
- `docs/proof/serial-20b-launch-onboarding.md` — this file

---

## Files Changed

```
web/src/app/page.tsx         +24 -7    (20B-01 hero activation)
web/src/app/demo/page.tsx    +692      (20B full wizard, new file)
docs/proof/serial-20b-launch-onboarding.md  (this file)
```

## Build Output

```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /dashboard
├ ƒ /dashboard/projects/[projectId]
├ ○ /dashboard/workspaces
├ ○ /demo                    ← new
└ ○ /factory-preview
```

## Test Results

```
Test Suites: 1 failed (pre-existing Prisma env), 9 passed, 10 total
Tests:       1 failed (pre-existing), 336 passed, 337 total
```

---

**SERIAL 20B — LOCKED ✓**
