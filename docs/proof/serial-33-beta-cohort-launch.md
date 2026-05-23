# SERIAL 33 — Proof: First Beta Cohort Launch + Customer Interviews

**Branch:** `claude/code-audit-review-bERxc`  
**Date:** 2026-05-23

---

## 33-01 — First Cohort Plan exists

File: `docs/beta/first-cohort-plan.md`

Contents:
- 5 target user profiles (non-technical founder, agency, freelancer, startup builder, creator)
- 3-phase cohort sizing (5 → 20 → 50 users) with explicit gates
- Acceptance criteria for beta candidates and for "activated" users
- Cohort type mapping to CS CRM types (FOUNDERS, AGENCIES, etc.)
- Per-candidate selection checklist
- Wave 1 success metrics (3/5 demo, 2/5 preview, 5/5 feedback, 1/5 "I'd pay")
- No-launch rules (Netlify must be live, smoke must pass, founder availability)

---

## 33-02 — Customer Interview Script exists

File: `docs/beta/customer-interview-script.md`

Contents:
- 4 sections: Context (5 min), Experience (10 min), Value + WTP (8 min), Closing (3 min)
- Questions covering all 8 required topics:
  - What were you trying to build?
  - What did you expect Factory to do?
  - Where did you get confused?
  - Did the preview/share/remix concept make sense?
  - Would you pay? Why or why not?
  - What would make this useful for your business?
  - What stopped you?
  - What would you tell a friend this does?
- Post-interview capture template with 6 sections (context, experience, value, quote, blockers, next actions)
- Cross-interview pattern recognition table (UX / copy / aha / blocker / roadmap / revenue signals)

---

## 33-03 — Invite Message Pack exists

File: `docs/beta/invite-message-pack.md`

Contains 6 ready-to-send messages:
1. **Short DM** — Twitter/LinkedIn/Slack opener (under 80 words)
2. **Email invite** — full invite with value prop, honest beta framing, clear ask
3. **Founder explanation** — for warm intros from mutual contacts
4. **Follow-up** — if no reply after 5 days (non-pushy)
5. **Feedback request** — sent within 24h post-use
6. **"What to test" instructions** — sent alongside beta link

Copy rules documented:
- DO say: "working app preview", "beta — honest and early", "shareable preview link"
- DO NOT say: "production-ready", "guaranteed results", "replace your developer"

---

## 33-04 — Netlify Creation Checklist exists

File: `docs/beta/netlify-site-creation-checklist.md`

Exact 8-step operator checklist:
1. Log in to Netlify account `md-tazizul-islam-c5abzm8`
2. Add new site → Import from GitHub
3. Select `mdtazizulislam/factory`
4. Verify build settings (base=web, command=npm run build, publish=.next)
5. Set required env vars (NEXT_PUBLIC_API_BASE_URL, etc.) with secrets never-list
6. First deploy — expected timeline 3–5 minutes
7. Copy live URL
8. Run smoke script against live URL

Includes:
- Build failure diagnosis table (4 common errors + fixes)
- Rollback instructions (instant via Netlify deploys tab)
- Optional site renaming (factory-app)
- Custom domain reference to `docs/launch/domain-dns-runbook.md`

---

## 33-05 — Go/No-Go Tracker exists

File: `docs/beta/go-no-go-tracker.md`

Current verdict: `NO_GO`

Tracker includes:
- Infrastructure checks (7 items — Netlify, GitHub, branch, env vars, Railway, preview)
- Frontend route checks (9 routes)
- Security header checks (4 headers)
- Feature readiness (8 features — all BUILT, pending live URL)
- Smoke script status
- Beta readiness (invitees, schedule, CRM cohort)
- Verdict log with dates
- Verdict definitions (NO_GO / GO_INTERNAL_TESTING / GO_PRIVATE_ALPHA / GO_FIRST_5_BETA)
- 10-step path to `GO_FIRST_5_BETA`
- Update instructions (git add → commit → push pattern)

---

## 33-06 — Founder Daily Routine exists

File: `docs/beta/founder-daily-routine.md`

30-minute daily structure:
1. Infrastructure check (5 min) — Netlify + Railway + /status
2. Feedback inbox scan (7 min) — CRITICAL triage, billing priority
3. Support tickets (3 min) — pain ranking awareness
4. Stuck users (5 min) — 48h rule, STUCK/CHURN_RISK filter
5. Talk to 1 user (variable, 20 min) — interview or DM
6. Update top 3 blockers (3 min)
7. Decide next fix (2 min) — "would fixing this cause 1 more user to reach preview?"

Also documents:
- Weekly rhythm (Mon review, Tue-Thu build, Fri verdict)
- Anti-patterns to avoid (building without talking, treating all feedback equally)
- Focus protection rules (first 2 hours for product, batch inbox checks)
- Escalation triggers (2+ crashes, 15+ min outage, security concern, 5 days no user contact)

---

## 33-07 — Customer Success Integration Note exists

File: `docs/beta/customer-success-integration.md`

Documents the full system map as an ASCII flow diagram connecting:
- Serial 33 (Onboarding page) → Serial 30 (Activation Engine) → Serial 29 (Feedback Loop)
- Serial 31 (CS CRM) → Founder Daily Review → Serial 27 (Monitoring)
- Serial 32 (Go/No-Go) → all of the above

Integration paths (with code snippets) for:
- Onboarding events → CS CRM (`patchLeadActivity`) — designed, not yet wired
- Feedback counts → CS health score — designed, not yet wired
- Stuck detection → auto-create task — designed, not yet wired

Admin interface map (5 interfaces across 4 serials with URLs and purposes)

Future sprint items documented (4 integrations tagged for Serial 35+)

---

## No-Launch Rule

Documented in `docs/beta/first-cohort-plan.md`:

> Do not invite Wave 1 until:
> 1. Netlify live URL exists and smoke passes
> 2. At least home page, /demo, and /status load correctly
> 3. The feedback widget is working
> 4. The founder has 30 minutes per day available for the beta week

Current status: Rule #1 not yet satisfied. Netlify site not created.

---

## git diff --stat (SERIAL 33 changes)

New files:
```
docs/beta/first-cohort-plan.md
docs/beta/customer-interview-script.md
docs/beta/invite-message-pack.md
docs/beta/netlify-site-creation-checklist.md
docs/beta/go-no-go-tracker.md
docs/beta/founder-daily-routine.md
docs/beta/customer-success-integration.md
docs/proof/serial-33-beta-cohort-launch.md
```

No code changes — this is a documentation serial.

---

## Push proof

See git log after commit. Branch: `claude/code-audit-review-bERxc`
