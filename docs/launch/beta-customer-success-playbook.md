# Beta Customer Success Playbook

**Audience:** Factory founder / early CS team  
**Purpose:** Operational guide for running beta customer success before public launch.

---

## Overview

The goal of beta CS is simple:

> Get real users to activation (demo → preview → workspace), learn what's breaking,
> and turn that into product improvements.

You are not trying to close deals yet. You are trying to learn.

---

## Daily Founder Review Routine (15 min/day)

Open `/admin/customer-success`.

1. **Check critical leads** — any red health badges? Act immediately.
2. **Scan open tasks** — complete or snooze stale items.
3. **Review stuck users** — who hasn't completed a demo in 48h?
4. **Check feedback volume** — did any new support tickets come in?
5. **Update notes** — record anything you learned from user conversations.

Do this at the same time every day. Consistency > intensity.

---

## How to Read the Health Score

Health score is 0–100. It reflects 8 dimensions weighted by importance:

| Dimension | Weight | What it means |
|-----------|--------|---------------|
| Demo completed | 20% | Most important activation step |
| Preview revealed | 20% | Second most important — user sees the output |
| Onboarding progress | 15% | How far through setup they've come |
| Workspace opened | 15% | Are they managing a project? |
| Feedback submitted | 10% | Engaged users share feedback |
| Support burden | 10% | High tickets = friction, not engagement |
| Billing intent | 5% | Strong signal of long-term value |
| Recent activity | 5% | Recency matters — inactive users churn |

Health levels:

| Score | Health | What to do |
|-------|--------|------------|
| 70–100 | GOOD | Monitor. Ask for case study. |
| 45–69 | WATCH | Check in casually. Offer help. |
| 25–44 | AT_RISK | Send personal check-in this week. |
| 0–24 | CRITICAL | Reach out today. Don't wait. |

---

## How to Handle Stuck Users

A user is stuck when they have not completed the demo after joining.

**First 24h:** No action. Let them explore.

**24–48h without demo completion:**
- Create a `DEMO_HELP` task.
- Send a friendly message: "Want me to walk you through the first build?"
- Offer a Loom video or live demo.

**48–72h without any activity:**
- Mark status as `STUCK`.
- Create an `ACTIVATION_NUDGE` task.
- Try a different angle — ask what they're trying to build.

**72h+ with no response:**
- Mark as `CHURN_RISK`.
- Create a `CHURN_PREVENTION` task.
- One last personal outreach. If no reply in 48h, close the lead.

**Key rule:** Never send more than 2 follow-ups without a reply. Respect their time.

---

## How to Prioritise Feedback

Use `/admin/support` to see the pain ranking.

**CRITICAL severity bugs:** Fix immediately. These block activation.

**HIGH severity:**
- If 3+ users report the same thing → schedule next sprint.
- If 1 user reports it → note it, don't over-index.

**FEATURE_REQUEST:**
- Collect them. Do not commit to timelines.
- When 5+ users ask for the same feature → add to roadmap.

**BILLING tickets:**
- Always respond within 24h.
- These users are ready to pay — don't make them wait.

---

## When to Invite the Next Cohort

Criteria to unlock next cohort:

- [ ] Current cohort activation rate ≥ 30%
- [ ] No CRITICAL bugs open for 48h
- [ ] Support volume < 3 tickets/day
- [ ] At least 1 converted user (paid or committed)
- [ ] Beta readiness score ≥ 60

If all criteria are met: open next cohort.
If 1–2 criteria missing: fix blockers first.
If 3+ criteria missing: pause and focus on activation.

---

## When to Pause Beta

Pause beta immediately if:

- Auth is broken (no one can sign in)
- Preview generation failing for > 30 minutes
- Security incident of any kind
- More than 5 simultaneous CRITICAL health users

To pause: close all cohorts (`isOpen: false`), send brief email to leads, investigate.

Restart only after incident is resolved and confirmed.

---

## When to Charge / Upsell

Signal checklist before offering paid plan:

- [ ] User has completed demo ✓
- [ ] User has revealed at least 1 preview ✓
- [ ] User has opened workspace ✓
- [ ] User has submitted at least 1 piece of feedback ✓
- [ ] User has been active for 3+ days ✓
- [ ] Health score ≥ 70 ✓

If 5/6 boxes checked: create a `BILLING_HELP` task and reach out personally.

Do not send pricing to users who haven't seen a preview yet. They haven't experienced the value.

---

## Cohort Strategy

| Cohort Type | Max Size | Goal |
|-------------|----------|------|
| INTERNAL_TESTERS | 5–10 | Bug finding |
| FOUNDERS | 15–25 | Use case diversity, fast feedback |
| DEVELOPERS | 10–20 | Technical edge cases |
| AGENCIES | 10–15 | Volume users, multi-project |
| FREELANCERS | 10–15 | Solo power users |
| CREATORS | 10–20 | Virality signal |
| SMALL_BUSINESS | 15–25 | Revenue signal |

Run 1–2 cohorts at a time. Learn before scaling.

---

## Integration Path: Onboarding + Feedback

The customer success module is designed to connect with:

1. **Serial 30 — Onboarding** (`/v1/onboarding/:userId`):
   - Map `userId` → `leadId` on join
   - Sync `onboardingState` and `onboardingStepCount` to `patchLeadActivity`
   - Trigger `ACTIVATION_NUDGE` task when `detectStuck` fires

2. **Serial 29 — Feedback** (`/admin/support/tickets`):
   - Sync `feedbackCount` and `supportTicketCount` to `patchLeadActivity`
   - Link support tickets to leads by `emailHash`
   - High ticket counts → auto-create `BUG_TRIAGE` task

Implementation: add a scheduled job or webhook to call `patchLeadActivity` when onboarding events or feedback events are recorded.

---

## Task Type Reference

| Task Type | When to use |
|-----------|-------------|
| EMAIL_FOLLOWUP | Routine check-in |
| DEMO_HELP | User stuck before demo |
| BUG_TRIAGE | User reported a bug |
| BILLING_HELP | User asked about pricing |
| FEATURE_DISCOVERY | User mentioned a new use case |
| ACTIVATION_NUDGE | User needs a push to next step |
| CHURN_PREVENTION | User is at risk of leaving |

---

## Rollback

If the customer success system needs to be removed:

1. Remove `CustomerSuccessModule` from `AppModule`
2. Delete `api/src/customer-success/`
3. Delete `web/src/app/admin/customer-success/`
4. No database migrations, no data loss

All data is in-memory. Rollback is instantaneous.
