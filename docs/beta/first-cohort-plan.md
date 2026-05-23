# First Beta Cohort Plan — Factory

**Version:** 1.0  
**Updated:** 2026-05-23  
**Owner:** Founder

---

## Goal

Get 5 real people to try Factory, watch what happens, and learn what to fix.
Not to impress anyone. Not to close deals. To learn.

---

## Who We're Targeting

### Target User Profiles

**Profile 1 — Non-technical founder**
- Has an app idea but has never shipped software
- Currently using Notion, spreadsheets, or a freelancer to manage it
- Needs to validate the idea before spending on development
- Trigger: "I keep explaining this idea to developers and nothing ships"

**Profile 2 — Small agency owner**
- Runs a 1–5 person creative or marketing agency
- Gets occasional requests for simple web apps or internal tools
- Doesn't want to hire a developer full-time
- Trigger: "My clients keep asking for things I can't build fast enough"

**Profile 3 — Freelancer**
- Builds things for clients across design, content, or operations
- Wants to offer more but has no coding skills
- Trigger: "I want to say yes to more projects"

**Profile 4 — Startup builder**
- Technical enough to understand what Factory is doing under the hood
- Wants to ship an MVP fast to test with real users
- Trigger: "I have 2 weeks and no budget"

**Profile 5 — Creator with an app idea**
- Educator, content creator, or community builder
- Has a specific, bounded problem they keep wishing a tool solved
- Trigger: "I wish there was an app that did X for my audience"

---

## Cohort Sizing

| Phase | Size | Gate |
|-------|------|------|
| Wave 0 (internal) | 3–5 people (team + trusted friends) | Always open |
| Wave 1 (first beta) | 5 users | Netlify live + smoke pass |
| Wave 2 | 20 users | Wave 1 activation rate ≥ 30% |
| Wave 3 | 50 users | Wave 2 activation rate ≥ 40% + 1 paid user |
| Public beta | Unlimited | Wave 3 + no critical open bugs |

**Do not skip to 20 before Wave 1 results are in.**  
The goal of 5 is to learn, not to scale.

---

## Acceptance Criteria for Beta Users

Before inviting anyone to Wave 1, each candidate must:

- [ ] Fit one of the 5 target profiles above
- [ ] Be willing to give 30 minutes of feedback
- [ ] Not be a developer evaluating for a client (too biased)
- [ ] Have an actual idea or use case — not just curious about AI

---

## Acceptance Criteria for a Beta User to Be "Activated"

After using Factory, an activated user has:

- [ ] Understood what Factory is from the homepage copy
- [ ] Started the demo flow with their own idea (not a placeholder)
- [ ] Seen a blueprint generated
- [ ] Reached a preview OR understood why they were blocked
- [ ] Given at least one piece of actionable feedback

An activated user who has NOT reached preview is still valuable — understanding the block is a learning.

---

## Cohort Assignment

Users go into the Customer Success CRM (`/admin/customer-success`) under cohort type:

| Profile | Cohort type |
|---------|-------------|
| Non-technical founder | FOUNDERS |
| Agency owner | AGENCIES |
| Freelancer | FREELANCERS |
| Startup builder | DEVELOPERS |
| Creator | CREATORS |

---

## Selection Checklist (per candidate)

Before sending an invite:

- [ ] Confirmed they have a real idea, not a generic curiosity
- [ ] Confirmed they can spend 30 minutes in the next 7 days
- [ ] Added to CRM with status INVITED
- [ ] Note added: where they came from, what their idea is
- [ ] Interview scheduled or offered within 48h of joining

---

## Wave 1 Success Metrics

Wave 1 is successful if:

- 3/5 users complete the demo
- 2/5 users see a preview
- 5/5 users give at least 1 feedback item
- 1/5 users says "I'd pay for this"
- 0 critical bugs found that weren't already known

If these are not met: fix and repeat before opening Wave 2.

---

## No-Launch Rules

Do not invite Wave 1 until:

1. Netlify live URL exists and smoke passes
2. At least the home page, /demo, and /status load correctly
3. The feedback widget is working
4. The founder has 30 minutes per day available for the beta week

---

## Related Documents

- `docs/beta/invite-message-pack.md` — invite copy
- `docs/beta/customer-interview-script.md` — interview questions
- `docs/beta/go-no-go-tracker.md` — launch readiness checklist
- `docs/launch/beta-customer-success-playbook.md` — CS operations
