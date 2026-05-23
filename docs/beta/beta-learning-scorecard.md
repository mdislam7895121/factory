# Beta Learning Scorecard — Factory Wave 1

**Status:** Template — populate after Wave 1 interviews complete  
**Last updated:** 2026-05-23  
**Fill in after:** 3+ interviews completed + `docs/beta/interview-findings.md` populated

---

## Purpose

This scorecard measures whether Wave 1 taught us what we needed to learn.  
It gates the decision to run Wave 2 (20 users).

Do not fill this in optimistically. Fill it in honestly.

---

## Signal 1 — Homepage Clarity

*Did users understand what Factory does before they started?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who described Factory correctly unprompted | ≥ 3/5 | — |
| Users who were confused about the value prop | ≤ 1/5 | — |
| Average clarity score (1–5, self-reported) | ≥ 3.5 | — |

**What "correctly" means:**  
"It builds a working app preview from a text description."  
Not: "It's an AI chatbot", "It's a code generator", "It's a prototype tool."

**Evidence (quotes):**

```
[Paste verbatim user descriptions here after interviews]
```

**Verdict:** ✅ CLEAR / ⚠️ MIXED / ❌ UNCLEAR

**Action if unclear:**  
Rewrite hero copy. Retest with Wave 2.

---

## Signal 2 — Demo Start Rate

*Did users attempt the demo without prompting?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who clicked "Start demo" unprompted | ≥ 3/5 | — |
| Users who needed verbal instruction to start | ≤ 2/5 | — |
| Median time to demo start (from page load) | ≤ 90 seconds | — |

**Evidence:**

```
[Paste observation notes here]
```

**Verdict:** ✅ SELF-SERVE / ⚠️ NEEDS GUIDANCE / ❌ BLOCKED

**Action if blocked:**  
Increase CTA prominence on home page. Add a "What happens when you click Start" micro-explanation.

---

## Signal 3 — Preview Understanding

*Did users understand the preview was a real working app?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who understood the preview was real | ≥ 3/5 | — |
| Users who thought it was a mockup/screenshot | — | — |
| Users who tried to interact with the preview | — | — |

**Evidence:**

```
[Paste quotes from "What did you think just happened?" question]
```

**Verdict:** ✅ UNDERSTOOD / ⚠️ MIXED / ❌ MISUNDERSTOOD

**Action if misunderstood:**  
Add label: "Live working app — try it." Add a click-to-interact affordance.

---

## Signal 4 — Share / Remix Understanding

*Did users understand they could share the preview link?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who found the share button without prompting | — | — |
| Users who said they'd send the link to someone | ≥ 2/5 | — |
| Users who understood "remix" as a concept | — | — |

**Evidence:**

```
[Paste relevant quotes]
```

**Verdict:** ✅ CLEAR / ⚠️ MIXED / ❌ MISSED

**Action if missed:**  
Move share button above the fold on preview reveal. Add "Send this to anyone" copy.

---

## Signal 5 — Workspace Understanding

*Did users understand what the workspace is for?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who clicked "Go to workspace" after preview | — | — |
| Users who asked "what is the workspace?" | — | — |
| Users who understood workspace = their saved project | ≥ 2/5 | — |

**Evidence:**

```
[Paste relevant quotes]
```

**Verdict:** ✅ CLEAR / ⚠️ MIXED / ❌ MISSED

**Action if missed:**  
Rename "workspace" to "your project" throughout the UI. Add explanation tooltip.

---

## Signal 6 — Willingness to Pay (WTP)

*Did at least 1 user express intent to pay?*

| Metric | Target | Actual |
|--------|--------|--------|
| Users who said "yes" to paying | ≥ 1/5 | — |
| Users who said "maybe" with conditions | — | — |
| Price range mentioned | — | — |
| Feature required before paying | — | — |

**WTP detail:**

| User | WTP | Price anchored | Feature required |
|------|-----|----------------|-----------------|
| User-A | — | — | — |
| User-B | — | — | — |
| User-C | — | — | — |
| User-D | — | — | — |
| User-E | — | — | — |

**Verdict:** ✅ REVENUE SIGNAL / ⚠️ CONDITIONAL / ❌ NO SIGNAL

**Action if no signal:**  
Do not build billing. Find out what would unlock WTP before Wave 2.

---

## Signal 7 — Biggest Blocker

*What most prevented users from completing the core flow?*

| Rank | Blocker | Frequency | Severity |
|------|---------|-----------|----------|
| 1 | — | —/5 | — |
| 2 | — | —/5 | — |
| 3 | — | —/5 | — |

**If 2+ users hit the same blocker:**  
→ This is a P0. Fix before Wave 2. Do not invite 20 users until this is resolved.

**Evidence:**

```
[Paste observation / quote]
```

---

## Signal 8 — Core Aha Moment

*What triggered the most positive reaction?*

| Rank | Moment | Frequency | Marketing use? |
|------|--------|-----------|----------------|
| 1 | — | —/5 | — |
| 2 | — | —/5 | — |

**If blueprint generation was the aha moment:**  
→ Lead with it on the homepage. Show a GIF or animation.

**If preview reveal was the aha moment:**  
→ Get users to preview faster. Remove friction before preview.

**Evidence:**

```
[Paste quotes from "When did you light up?" question]
```

---

## Wave 1 Learning Summary

*Fill in after Signal 1–8 are complete.*

| Signal | Verdict | Action required? |
|--------|---------|-----------------|
| Homepage clarity | — | — |
| Demo start rate | — | — |
| Preview understanding | — | — |
| Share / remix understanding | — | — |
| Workspace understanding | — | — |
| WTP | — | — |
| Biggest blocker | — | — |
| Core aha moment | — | — |

---

## Wave 2 Recommendation

*Based on this scorecard, should we run Wave 2 (20 users)?*

**Decision criteria:**

| Condition | Met? |
|-----------|------|
| ≥ 3 users reached preview | — |
| ≥ 1 user expressed WTP | — |
| Biggest P0 blocker identified AND fixed | — |
| Homepage clarity verdict is CLEAR or MIXED | — |
| No unresolved security or data concern | — |

**Recommendation:**  
`GO_WAVE_2` / `HOLD — fix [blocker] first` / `PIVOT — fundamental value prop problem`

**Written by:** [Founder name]  
**Date:** [Date]

---

## Next Steps After Completing This Scorecard

1. Update `docs/beta/go-no-go-tracker.md` → move verdict to `GO_PRIVATE_ALPHA` if criteria met
2. Triage Wave 1 feedback with `docs/beta/feedback-triage-template.md`
3. Fix P0 and P1 blockers before Wave 2
4. Select Wave 2 cohort (20 users) from `docs/beta/first-cohort-plan.md`
5. Update `docs/beta/first-5-users.md` with actuals
