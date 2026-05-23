# Feedback Triage Template — Factory Beta

**Last updated:** 2026-05-23  
**Use after:** Each Wave of user interviews + feedback widget submissions

---

## Purpose

Sort raw feedback into actionable priorities.  
Prevent the mistake of building the most-requested feature when the actual blocker is different.

---

## Priority Formula

```
Priority score = Severity + Frequency + Revenue impact + Activation impact
```

Each dimension is scored 0–3:

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| **Severity** | Cosmetic annoyance | Slows user down | Prevents completion | Crashes / data loss |
| **Frequency** | 1 user mentioned it | 2 users | 3 users | 4+ users |
| **Revenue impact** | No effect on WTP | Slight reduction | "I'd pay if fixed" | Blocks all payment intent |
| **Activation impact** | Post-activation | Pre-preview, minor | Prevents reaching preview | Prevents starting demo |

**Score range:** 0–12

| Score | Priority | Bucket |
|-------|----------|--------|
| 10–12 | P0 | Fix before next user touches the product |
| 7–9 | P1 | Fix before Wave 2 |
| 4–6 | P2 | Improvement sprint |
| 0–3 | P3 | Backlog |

---

## Triage Process

1. Collect all raw feedback (widget tickets + interview notes)
2. Deduplicate: group tickets that describe the same underlying problem
3. Score each group using the formula above
4. Assign to P0/P1/P2/P3 bucket
5. For P0: fix immediately and re-test before inviting more users
6. For P1: schedule in the next serial sprint
7. For P2/P3: log in backlog, revisit after Wave 2

---

## Triage Table

Copy this table after each Wave. Fill in one row per distinct feedback theme.

| # | Theme | Raw tickets | Severity (0–3) | Frequency (0–3) | Revenue (0–3) | Activation (0–3) | Total | Bucket | Owner | Status |
|---|-------|-------------|----------------|-----------------|---------------|-----------------|-------|--------|-------|--------|
| 1 | — | — | — | — | — | — | — | — | — | — |
| 2 | — | — | — | — | — | — | — | — | — | — |
| 3 | — | — | — | — | — | — | — | — | — | — |

---

## P0 Bucket — Fix Before Next User

*Score 10–12. Do not invite new users until these are resolved.*

| # | Issue | Score | Fix | Verified fixed | Date |
|---|-------|-------|-----|----------------|------|
| — | — | — | — | — | — |

**Rule:** If a P0 is unresolved after 48 hours, pause all outreach.

---

## P1 Bucket — Fix Before Wave 2

*Score 7–9. Must be resolved before expanding to 20 users.*

| # | Issue | Score | Fix plan | Target serial | Status |
|---|-------|-------|----------|---------------|--------|
| — | — | — | — | — | — |

---

## P2 Bucket — Improvement Sprint

*Score 4–6. Valuable but not blocking activation.*

| # | Issue | Score | Notes | Target |
|---|-------|-------|-------|--------|
| — | — | — | — | Backlog |

---

## P3 Bucket — Backlog

*Score 0–3. Log and revisit when higher priorities are clear.*

| # | Issue | Score | Notes |
|---|-------|-------|-------|
| — | — | — | — |

---

## Common Mistakes to Avoid

**Building the loudest request, not the highest-impact fix:**  
A user who complains most articulately may have a P3 issue.  
A user who silently dropped off may have hit a P0.  
Use the formula, not the volume of complaints.

**Treating UX polish as P1 before P0 blockers are clear:**  
If 3 users couldn't reach preview, that's P0 no matter how ugly the UI looks.

**Shipping a fix without re-testing:**  
Mark `Verified fixed` only after a real user (or the founder) walks through the flow again.

**Feature requests disguised as bug reports:**  
"It doesn't save my work" might mean: "I want a save button" (P3) or "I lost my work when I refreshed" (P0).  
Dig into the root cause before scoring.

---

## Decision Rule for Feature Requests

| Signal | Action |
|--------|--------|
| 1 user asked for feature X | Note it, do not build |
| 2 users asked for feature X | Watch for a third |
| 3 users independently asked for feature X | Add to roadmap, score with formula |
| 3 users asked AND it has revenue / activation impact | P1 or P0 |

---

## After Triage

1. Update `docs/beta/interview-findings.md` → Must-Fix Blockers table
2. Update `docs/beta/beta-learning-scorecard.md` → Signal 7 (Biggest Blocker)
3. Add P0 and P1 items to the next SERIAL spec
4. Update `docs/beta/go-no-go-tracker.md` if a P0 is blocking go/no-go
5. Commit this triage file with wave number in commit message:  
   `git commit -m "Feedback triage: Wave 1 complete — [N] P0s, [N] P1s"`
