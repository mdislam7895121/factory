# SERIAL 31 — Proof: Beta Invite Cohorts + Early Customer Success CRM

**Branch:** `claude/code-audit-review-bERxc`
**Date:** 2026-05-23

---

## 31-01 — Customer success module exists

```
api/src/customer-success/customer-success.types.ts
api/src/customer-success/customer-success.service.ts
api/src/customer-success/customer-success.controller.ts
api/src/customer-success/customer-success.module.ts
api/src/customer-success/customer-success.spec.ts
```

Registered in `api/src/app.module.ts`:
```typescript
import { CustomerSuccessModule } from './customer-success/customer-success.module';
// ...
imports: [ ..., CustomerSuccessModule ],
```

Types defined:
- `BetaCohort`, `BetaInviteLead`, `CustomerSuccessNote`, `CustomerSuccessTask`
- `CustomerHealthScore`, `HealthDimension`, `CohortActivationSummary`
- Cohort types: FOUNDERS, AGENCIES, FREELANCERS, DEVELOPERS, SMALL_BUSINESS, CREATORS, INTERNAL_TESTERS
- Lead statuses: INVITED, JOINED, ACTIVE, STUCK, CONVERTED, CHURN_RISK, CLOSED
- Task types: EMAIL_FOLLOWUP, DEMO_HELP, BUG_TRIAGE, BILLING_HELP, FEATURE_DISCOVERY, ACTIVATION_NUDGE, CHURN_PREVENTION
- Task statuses: OPEN, DONE, SNOOZED, CANCELLED

---

## 31-02 — Cohorts work

API routes (all under `/admin/customer-success`):

| Method | Route | Description |
|--------|-------|-------------|
| POST | /cohorts | Create a cohort |
| GET | /cohorts | List all cohorts |
| GET | /cohorts/:id | Get single cohort |
| GET | /cohorts/:id/summary | Cohort activation summary |

Test evidence:
```
✓ creates a cohort with valid input
✓ rejects invalid cohort type
✓ rejects empty cohort name
✓ getCohort throws for unknown id
✓ listCohorts returns all cohorts
✓ POST /admin/customer-success/cohorts creates cohort
✓ GET /admin/customer-success/cohorts returns list
```

---

## 31-03 — Invite leads work

| Method | Route | Description |
|--------|-------|-------------|
| POST | /leads | Add a lead |
| GET | /leads?cohortId= | List leads (filterable) |
| PATCH | /leads/:id/status | Update lead status |
| POST | /leads/:id/notes | Add note |
| GET | /leads/:id/notes | Get notes |
| POST | /leads/:id/tasks | Create task |
| GET | /leads/:id/health | Compute health score |

Test evidence:
```
✓ adds a lead to a cohort
✓ increments cohort leadCount on add
✓ rejects lead without valid email
✓ rejects lead for unknown cohort
✓ getLead throws for unknown id
✓ listLeads can filter by cohortId
✓ updateLeadStatus changes status
✓ updateLeadStatus rejects invalid status
✓ CONVERTED status sets correct status
✓ CHURN_RISK status is accepted
✓ POST /admin/customer-success/leads adds a lead
✓ PATCH /admin/customer-success/leads/:id/status updates status
```

---

## 31-04 — Health score works

`CustomerSuccessService.computeHealthScore(leadId)` — 8 weighted dimensions:

| Dimension | Weight |
|-----------|--------|
| Demo completed | 20% |
| Preview revealed | 20% |
| Onboarding progress | 15% |
| Workspace opened | 15% |
| Feedback submitted | 10% |
| Support burden | 10% |
| Billing intent | 5% |
| Recent activity | 5% |

Output: `{ score: 0–100, health: GOOD|WATCH|AT_RISK|CRITICAL, dimensions[], recommendedAction }`

Health thresholds: GOOD ≥70 / WATCH ≥45 / AT_RISK ≥25 / CRITICAL <25

Recommended actions (examples):
- "Send demo help — user has not completed demo"
- "Schedule activation nudge — preview not seen"
- "Triage support tickets — high support load"
- "Immediate churn prevention outreach"
- "Continue monitoring — user is healthy"

Test evidence:
```
✓ computeHealthScore returns score 0-100
✓ healthy lead scores higher than new inactive lead
✓ computeHealthScore returns 8 dimensions
✓ health level is CRITICAL for inactive new lead
✓ health level is GOOD for fully activated lead
✓ recommendedAction is non-empty string
```

---

## 31-05 — Activation summary works

`CustomerSuccessService.getCohortSummary(cohortId)` returns:
```typescript
{
  cohortId, cohortName,
  invitedCount, joinedCount, activeCount, activatedCount,
  stuckCount, convertedCount, churnRiskCount, closedCount,
  avgStepsToPreview, supportVolume, upgradeIntentCount,
  topStuckReasons: string[],
  activationRate: number  // percentage
}
```

`getOverallSummary()` returns summary for every cohort.

Test evidence:
```
✓ getCohortSummary returns correct invited count
✓ getCohortSummary calculates activationRate
✓ getOverallSummary returns summary for all cohorts
✓ GET /admin/customer-success/summary returns array
```

---

## 31-06 — Follow-up tasks work

Task lifecycle: `OPEN → DONE | SNOOZED | CANCELLED`

`createTask(leadId, { type, title, body?, dueAt? })` — validates type and title (min 3 chars)
`completeTask(taskId)` — sets status=DONE, completedAt=timestamp
`listTasks(leadId?, status?)` — filterable

Test evidence:
```
✓ createTask returns a task with OPEN status
✓ createTask rejects invalid task type
✓ createTask rejects short title
✓ completeTask sets status to DONE
✓ listTasks can filter by leadId
✓ GET /admin/customer-success/tasks returns task list
```

---

## 31-07 — Admin customer success UI visible

File: `web/src/app/admin/customer-success/page.tsx`

3-tab layout:
- **Overview** — cohort summary cards with activation rate, metric grids (joined, activated, stuck, churn risk, converted, support), recommended next actions ranked by health score
- **Leads** — lead table (name, masked email, status badge, health badge, steps count) with detail panel (activity checklist, recommended action, notes textarea + save)
- **Tasks** — task list with type emoji, title, lead name, status badge; filtered by OPEN/DONE

UI features:
- Status badges with per-status colors (cyan=INVITED, indigo=JOINED, green=ACTIVE, amber=STUCK, purple=CONVERTED, red=CHURN_RISK, muted=CLOSED)
- Health badges color-coded (green/amber/orange/red)
- Seeded sample data (5 leads, 3 cohorts, 4 tasks, health scores)
- Live API fetch with graceful fallback to sample data
- Top-bar alert chips for open task count and critical leads
- No raw email displayed anywhere — `emailMasked` only

Build confirmation: `✓ /admin/customer-success` in static pages

Layout: `web/src/app/admin/customer-success/layout.tsx` — noindex

---

## 31-08 — Onboarding / Feedback integration path documented

Documented in playbook at `docs/launch/beta-customer-success-playbook.md`:

**Serial 30 (Onboarding) integration:**
- Map `userId` → `leadId` on join
- Sync `onboardingState` and `onboardingStepCount` to `patchLeadActivity`
- Trigger `ACTIVATION_NUDGE` task when `detectStuck` fires

**Serial 29 (Feedback) integration:**
- Sync `feedbackCount` and `supportTicketCount` to `patchLeadActivity`
- Link tickets to leads by `emailHash`
- High ticket counts → auto-create `BUG_TRIAGE` task

`patchLeadActivity(leadId, patch)` method exists on the service to receive updates from either module without circular dependencies.

Existing modules are untouched — no breaking changes.

---

## 31-09 — Beta operator playbook exists

File: `docs/launch/beta-customer-success-playbook.md`

Sections:
1. Daily founder review routine (15 min/day)
2. How to read the health score (table of 8 dimensions + 4 health levels)
3. How to handle stuck users (24h / 48h / 72h+ escalation timeline)
4. How to prioritise feedback (CRITICAL / HIGH / FEATURE / BILLING)
5. When to invite next cohort (5 criteria checklist)
6. When to pause beta (immediate triggers)
7. When to charge / upsell (6-signal checklist)
8. Cohort strategy (table of 7 cohort types with max size and goal)
9. Integration path for Onboarding + Feedback
10. Task type reference table
11. Rollback instructions

---

## 31-10 — No raw email / prompt leakage

**Email handling:**
- `hashEmail(email)` — FNV32 → `u_<hex8>` (private, not exposed in responses)
- `maskEmail(email)` — `al***@domain.com` (stored as `emailMasked`)
- Raw email is never written to any field

**Content blocking:**
- `CS_BLOCKED_META_KEYS` — blocks password, token, secret, key, auth, credential, DATABASE_URL, AUTH_SECRET, API_KEY, PRIVATE_KEY, ACCESS_TOKEN
- Notes body is validated against blocked keywords
- `sanitizeText()` strips `<` and `>` before storage

Test evidence:
```
✓ emailHash is deterministic for same email
✓ emailHash differs for different emails
✓ emailMasked shows partial local + domain only
✓ raw email is never stored on lead
✓ lead list never exposes raw emails
✓ addNote rejects blocked keywords in body
✓ health score output has no stack traces or internal paths
✓ summary output has no raw emails
✓ task body contains no raw prompt
```

---

## 31-11 — Tests: 47/47 PASS

```
PASS src/customer-success/customer-success.spec.ts
Tests: 47 passed, 47 total

Full suite:
Test Suites: 1 failed, 20 passed, 21 total
Tests:       1 failed, 1012 passed, 1013 total
(1 failure = pre-existing Prisma service spec — not a regression)
```

47 tests covering:
- Cohort creation (5 tests)
- Lead creation + filtering (7 tests)
- Email masking / hashing (5 tests)
- Status transitions (4 tests)
- Health score (6 tests)
- Activation summary (3 tests)
- Follow-up tasks (5 tests)
- Notes creation (4 tests)
- Privacy / no leakage (3 tests)
- Controller endpoints (5 tests)

---

## Build PASS

```
✓ Compiled successfully in 15.8s
✓ Generating static pages (25/25) in 566.9ms
✓ 25 static pages + dynamic routes

New pages added:
  /admin/customer-success
```

---

## Privacy proof

- Raw emails never appear in any API response or stored field
- `emailMasked` uses `first2***@domain` format
- `emailHash` uses FNV32 — never reversed
- All output strings validated against `CS_BLOCKED_META_KEYS`

---

## Rollback plan

1. Remove `CustomerSuccessModule` from `AppModule.imports`
2. Delete `api/src/customer-success/`
3. Delete `web/src/app/admin/customer-success/`
4. Delete `docs/launch/beta-customer-success-playbook.md`

No database changes, no migrations. Data is in-memory — rollback is instantaneous.

---

## git diff --stat (SERIAL 31 changes)

**Modified:**
```
api/src/app.module.ts  |  3 ++-
```

**New files:**
```
api/src/customer-success/customer-success.types.ts
api/src/customer-success/customer-success.service.ts
api/src/customer-success/customer-success.controller.ts
api/src/customer-success/customer-success.module.ts
api/src/customer-success/customer-success.spec.ts
web/src/app/admin/customer-success/page.tsx
web/src/app/admin/customer-success/layout.tsx
docs/launch/beta-customer-success-playbook.md
docs/proof/serial-31-beta-customer-success.md
```

---

## Push proof

See git log after commit. Branch: `claude/code-audit-review-bERxc`
