# First 5 Beta Users — Tracking Template

**Status:** Template only — no users invited yet (Netlify not live)  
**Last updated:** 2026-05-23  
**Rule:** Do not fill user rows until Go/No-Go reaches `GO_PRIVATE_ALPHA`

---

## How to Use This File

1. Add a row for each invited user (use alias, not real name)
2. Update status columns as user progresses
3. Link to interview notes in `/admin/customer-success`
4. Keep this file committed — it is the source of truth for Wave 1

---

## User Tracking Table

| Alias | User Type | Target Pain | Invited | Interview | Activation | WTP | Next Action |
|-------|-----------|-------------|---------|-----------|------------|-----|-------------|
| User-A | — | — | ❌ | ❌ | ❌ | — | Wait for Netlify |
| User-B | — | — | ❌ | ❌ | ❌ | — | Wait for Netlify |
| User-C | — | — | ❌ | ❌ | ❌ | — | Wait for Netlify |
| User-D | — | — | ❌ | ❌ | ❌ | — | Wait for Netlify |
| User-E | — | — | ❌ | ❌ | ❌ | — | Wait for Netlify |

---

## Column Definitions

**Alias:** Use a name like "User-A" or "Alice M." — no raw email addresses in this file.

**User Type:** Match to one of the 5 profiles from `first-cohort-plan.md`:
- `FOUNDER` — Non-technical founder
- `AGENCY` — Small agency owner
- `FREELANCER` — Freelancer
- `BUILDER` — Startup builder
- `CREATOR` — Creator with app idea

**Target Pain:** One sentence describing what they want to build.  
Example: "Booking system for her photography studio"

**Invited:** ❌ / ✅ SENT `[date]`

**Interview:** ❌ / ✅ DONE `[date]` / 📅 SCHEDULED `[date]`

**Activation:** Use one of:
- ❌ NOT STARTED
- 🔄 DEMO STARTED
- 👁 PREVIEW SEEN
- ✅ ACTIVATED
- ⚠️ STUCK `[reason]`

**WTP (Willingness to Pay):**
- YES — said they would pay
- MAYBE — open to it with conditions
- NO — would not pay currently
- UNKNOWN — not yet asked

**Next Action:** What you should do for this user in the next 48h.

---

## User Detail Sheets

Copy this template block for each user and fill in after their interview:

```
## User-A

**Alias:** User-A
**Profile:** [User type]
**Pain:** [What they want to build]
**Recruited from:** [Where you found them — Twitter, referral, LinkedIn, etc.]

**Status:**
- Invited: [date]
- Joined: [date or —]
- Interview: [date or —]
- Activation: [state]

**CRM:** Lead ID [ID] in /admin/customer-success

**Interview summary:**
- What they tried to build:
- Confused at:
- Aha moment:
- Blocked at:
- Would pay: YES / MAYBE / NO
- Quote:

**Feedback submitted:** [count]
**Support tickets:** [count]

**Next action:** [what to do next]
```

---

## Wave 1 Completion Criteria

Wave 1 (5 users) is complete when:

| Metric | Target | Actual |
|--------|--------|--------|
| Invites sent | 5 | — |
| Interviews completed | ≥ 3 | — |
| Reached demo | ≥ 3 | — |
| Reached preview | ≥ 2 | — |
| Feedback submitted | ≥ 5 items | — |
| Said "I'd pay" | ≥ 1 | — |

When completion criteria are met:
1. Fill in `docs/beta/interview-findings.md`
2. Fill in `docs/beta/beta-learning-scorecard.md`
3. Triage feedback with `docs/beta/feedback-triage-template.md`
4. Decide on Wave 2 with `docs/beta/go-no-go-tracker.md`

---

## Related Documents

- `docs/beta/first-cohort-plan.md` — profile definitions and acceptance criteria
- `docs/beta/customer-interview-script.md` — interview questions
- `docs/beta/first-5-outreach-pack.md` — invite messages
- `/admin/customer-success` — live CRM
