# Public Beta Support Flow — Factory

**Updated:** 2026-05-23  
**Scope:** Beta support intake, triage, escalation, and founder daily routine

---

## Support Channels (Beta)

| Channel | Use Case | Response SLA |
|---------|----------|--------------|
| Email (support@yourcompany.com) | Bug reports, billing issues, general | 24 h |
| Discord #beta-feedback | Community, quick questions | 48 h |
| GitHub Issues (private) | Technical bugs, feature requests | 72 h |
| Direct founder DM | SEV-1 outages only | Immediate |

> Beta users should be directed to email/Discord first. Do not publish direct founder contact publicly.

---

## Bug Report Format

Ask users to provide:

```
**Route / page:** (e.g. /workspace/my-project/editor)
**What happened:** (describe the issue)
**What you expected:** (what should have happened)
**Steps to reproduce:**
1.
2.
3.
**Browser + OS:** (e.g. Chrome 124 / macOS 14)
**Console errors:** (paste from DevTools if any)
**Screenshot:** (attach if visual)
```

---

## Issue Priority

| Priority | Criteria | Response Time |
|----------|----------|---------------|
| P0 — SEV-1 | Full outage, data loss, security incident | Immediate (< 15 min) |
| P1 — SEV-2 | Core feature broken for many users | < 2 h |
| P2 — SEV-3 | Non-critical feature broken | < 24 h |
| P3 — SEV-4 | UX complaint, minor bug | < 72 h |
| P4 — Backlog | Feature request, improvement | Next planning cycle |

---

## Issue Types + Handling

---

### Bug Reports

1. Reproduce locally using the steps provided
2. Check admin health page (`/admin/health`) for any service degradation
3. If confirmed: open GitHub issue, triage severity
4. If P0/P1: follow incident runbook (`docs/incident/runbook.md`)
5. Reply to user with status and ETA
6. Close issue when fixed; notify user

---

### Abuse Reports

**Symptoms:** Harassment, spam, illegal content, prompt injection attempts.

1. Capture the offending content (screenshot / log)
2. Enable `readonly` kill switch if content is ongoing and harmful
3. Identify the account (check audit log at `/admin`)
4. Suspend account (currently: remove via organization module)
5. Preserve audit log entries for legal record
6. Reply to reporter: "We have reviewed and taken appropriate action."
7. If law enforcement contact required: escalate to legal counsel

**Never delete audit log entries or evidence.**

---

### Billing Issues

**Common cases:**

| Issue | Resolution |
|-------|-----------|
| Charged but features not active | Check Stripe webhook delivery; retry webhook |
| Duplicate charge | Issue refund via Stripe dashboard |
| Subscription not cancelled | Cancel in Stripe; confirm via email |
| Wrong tier applied | Update in Stripe + notify user |

1. Check Stripe dashboard for the charge/subscription
2. Verify webhook events delivered (Stripe → Developers → Webhooks)
3. Process refund or correction in Stripe
4. Confirm resolution with user by email
5. If Stripe API is at fault: document + contact Stripe support

**Refund policy (beta):** Full refund within 7 days of charge for any reason.

---

### Runtime Failure / Generated App Quality

**Symptoms:** User's generated app crashes, is broken, or doesn't match expectations.

1. Check `/admin/health` → runtime breakdown panel
2. If runtime crashed: restart via admin (or Railway dashboard)
3. If generated code is broken: user can use Code mode + pair programmer to fix
4. If quality is systematically poor: log as P2 issue, review AI agent prompts
5. Response template:

```
Thanks for your report! We're in beta, so AI-generated apps may occasionally need 
manual tweaking. The Code editor in your workspace gives you full access to fix 
anything the AI got wrong. If this is a recurring pattern, let us know the prompt 
you used and we'll improve it.
```

---

### Escalation Path

```
User Report
    │
    ▼
Support Inbox (24 h review)
    │
    ├─ P0/P1 ──► Founder immediate response + incident runbook
    │
    ├─ P2 ──────► Engineer triage + GitHub issue + 24 h fix
    │
    ├─ P3 ──────► GitHub issue + next sprint
    │
    └─ P4 ──────► Backlog + "thank you" reply
```

---

## Founder Daily Review Routine

Each business day (estimated 30 min):

| Time | Task |
|------|------|
| 09:00 | Check `/admin/health` — all systems green? |
| 09:05 | Check smoke test logs — any failures overnight? |
| 09:10 | Review support inbox — any P0/P1? |
| 09:15 | Check audit log (`/admin`) — suspicious activity? |
| 09:20 | Check Railway dashboard — CPU/memory/cost within budget? |
| 09:25 | Check Stripe — any failed charges or disputes? |
| 09:30 | Reply to P2+ support tickets |

---

## Canned Responses

### General Beta Acknowledgment

```
Thanks for trying Factory Beta! We appreciate your feedback.
[Specific response to their issue]
We're actively improving the platform — your report helps a lot.
```

### Outage Acknowledgment

```
We're aware of an issue affecting [feature]. Our team is investigating and
working on a fix. We'll update you as soon as it's resolved.
Current status: factory.yourcompany.com/status
```

### Feature Request

```
Thanks for the suggestion! We've logged it for our product roadmap.
We can't promise a timeline during beta, but we track all requests.
```

---

## Known Beta FAQ

**Q: Why did my generated app not work?**  
A: AI-generated apps are a starting point — use the Code editor to refine. This is expected during beta.

**Q: Can I export my project?**  
A: Not yet — export is on the roadmap. Your project data is saved in your workspace.

**Q: Is my data secure?**  
A: Yes. All data is encrypted at rest and in transit. See our Privacy Policy.

**Q: Can I get a refund?**  
A: Yes, full refund within 7 days of any charge. Email support@yourcompany.com.

**Q: The mobile app doesn't work.**  
A: Factory is web-only during beta. Native mobile is on the roadmap.

---

## Related

- `docs/incident/runbook.md` — technical incident response
- `docs/launch/risk-register.md` — risk register
- `docs/launch/public-beta-checklist.md` — pre-launch checklist
