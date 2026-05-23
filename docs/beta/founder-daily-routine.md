# Founder Daily Operating Routine — Factory Beta

**Time required:** 30 minutes per day  
**When:** Same time every day (morning recommended)  
**Purpose:** Stay close to users, protect focus, make fast decisions.

---

## The Core Principle

> You are not running a company yet. You are running an experiment.
> Your only job during beta is to learn fast and fix the right things.

Resist the urge to build new features before understanding current problems.

---

## Daily Routine (30 min)

### 1. Infrastructure Check (5 min)

Open these three URLs in order:

**a. Netlify deploy status**  
→ https://app.netlify.com/projects/[your-site]  
Check: Is the latest deploy green? Any failed builds overnight?

**b. Railway services**  
→ https://railway.app/dashboard  
Check: Are all services running? Any OOM / restart loops?

**c. Factory status page**  
→ https://[your-site].netlify.app/status  
Check: All components showing OK? Any degraded state?

If anything is red → fix it before doing anything else.

---

### 2. Feedback Inbox (7 min)

Open: `/admin/support`

**Scan for:**
- Any CRITICAL severity tickets (fix today)
- New BUG reports (triage within 24h)
- BILLING inquiries (respond today — these users are ready to pay)
- GENERAL or FEATURE_REQUEST (note, do not act yet)

**Action rule:**
- 1 critical bug = fix today, nothing else gets built
- 3+ users hit the same bug = fix before inviting more users
- A billing question = respond within 4 hours

---

### 3. Support Tickets (3 min)

Look at the Pain Ranking view in `/admin/support`:

- Which category has the most tickets?
- Is any category growing (2 new tickets in 2 days)?
- Is the #1 pain something you can fix this week?

Don't action everything. Just stay aware.

---

### 4. Stuck Users (5 min)

Open: `/admin/customer-success` → Leads tab

**Filter for:** STUCK or CHURN_RISK status

For each stuck user:
1. Look at their activity (did they complete demo? did they see preview?)
2. Read any notes on their profile
3. Decide: email them now? Or create a follow-up task?

**Rule:** No user should be stuck for more than 48h without a human touch.

---

### 5. Talk to 1 User (variable — 20 min)

This is the most important part of the day.

**Who:** Rotate through beta users who have been active in the last 48h.

**How:**
- DM them a simple check-in: "How's Factory going for you?"
- If they reply with anything → follow the interview script
- If they don't reply → note it and try once more in 48h

**Do not skip this.** Reading metrics is not the same as talking to users.

---

### 6. Update Top 3 Blockers (3 min)

Keep a running list of the top 3 things blocking activation.

Ask yourself:
1. What is the most common reason users don't complete the demo?
2. What is the most common reason users don't see a preview?
3. What would 1 fix unlock the most value?

Write this somewhere visible (Notion, Obsidian, paper — doesn't matter).

---

### 7. Decide Next Fix (2 min)

Based on what you learned today:

- **Fix** something that blocks 2+ users → schedule it for today or tomorrow
- **Defer** a feature request unless 3+ users asked for it → note it
- **Escalate** an infra issue → handle it now

**The filter:** Would fixing this cause 1 more user to reach preview?
If yes → it's worth doing. If no → it can wait.

---

## Weekly Rhythm

| Day | Focus |
|-----|-------|
| Monday | Review all feedback from prior week. Set top 3 priorities. |
| Tuesday–Thursday | Build + fix cycle. 1 interview per day if possible. |
| Friday | Update Go/No-Go tracker. Decide if Wave 2 can open. |

---

## Anti-Patterns to Avoid

**Building without talking to users**  
→ Every new feature you build without user evidence might be wasted.

**Talking to too many users at once**  
→ 5 at a time is enough. More creates noise before signal is clear.

**Treating all feedback equally**  
→ One CRITICAL pain from a paying user > ten FEATURE_REQUESTs from free users.

**Fixing things users complain about without watching them use it**  
→ What users say they want is often different from what they actually need.

**Going dark for 3+ days**  
→ Users who get no response in 72h assume the product is abandoned.

---

## Protecting Focus

During beta, protect the first 2 hours of every day for product work (not email, not admin).

**Check feedback inbox at:** 9am and 4pm only. Not constantly.

**Batch user conversations:** Schedule 2–3 interviews per week, not ad hoc throughout the day.

**Kill meetings:** No 1-hour calls about strategy during Wave 1. That's what Week 4 is for.

---

## When to Escalate

If any of these happen — pause the beta and fix:

- 2+ users report the same crash or blank screen
- The status page shows outage for > 15 minutes
- A user reports a security concern (contact exposure, unexpected data)
- You haven't talked to a user in 5 days

---

## Related Documents

- `docs/beta/customer-interview-script.md` — interview questions
- `docs/launch/beta-customer-success-playbook.md` — CS operations
- `docs/beta/go-no-go-tracker.md` — infrastructure readiness
- Admin interfaces: `/admin/support`, `/admin/customer-success`, `/admin/analytics`
