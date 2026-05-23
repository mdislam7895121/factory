# Launch Risk Register — Factory Public Beta

**Updated:** 2026-05-23  
**Status:** PRE-LAUNCH review required

---

## Risk Matrix

| Risk ID | Area | Severity | Likelihood | Mitigation | Owner | Beta Accept? |
|---------|------|----------|------------|------------|-------|--------------|
| RISK-01 | Frontend deploy | Medium | Low | Netlify instant rollback | Frontend | ✅ Yes |
| RISK-02 | Railway API outage | High | Low | Railway auto-restart; runbook INC-02 | Backend | ✅ Yes |
| RISK-03 | Preview gateway | Medium | Medium | Non-critical; feature degrades gracefully | Backend | ✅ Yes |
| RISK-04 | Runtime cost spike | High | Medium | Tier limits; kill switches | Finance | ⚠️ Conditional |
| RISK-05 | Abuse (prompt injection) | High | Medium | BLOCKED_CONTENT patterns; rate limits | Security | ✅ Yes |
| RISK-06 | Billing misconfiguration | High | Low | Stripe test-mode verification step | Finance | ⚠️ Conditional |
| RISK-07 | Generated quality | Medium | High | Review gate; quality module; beta label | Product | ✅ Yes |
| RISK-08 | Moderation failure | High | Low | Content patterns; kill switch `readonly` | Security | ✅ Yes |
| RISK-09 | Legal / regulatory | Medium | Low | Terms of Service; privacy policy | Legal | ⚠️ Conditional |
| RISK-10 | Support load | Medium | High | Runbook; founder-on-call; async queue | Operations | ✅ Yes |
| RISK-11 | Token / AI cost | High | Medium | Per-tier limits; ANTHROPIC_API_KEY absent = feature off | Finance | ✅ Yes |

---

## Risk Details

---

### RISK-01 — Frontend Deploy Failure

**Description:** A Netlify deploy breaks the frontend — users see a blank page or 500.

**Severity:** Medium — frontend is fully static; rollback is instant.

**Mitigation:**
1. Netlify instant rollback (< 30 seconds) via dashboard
2. All builds verified locally with `npm run build` before push
3. Smoke test runs post-deploy via `scripts/smoke-production.ps1`

**Owner:** Frontend engineer / founder  
**Beta Accept:** ✅ Yes — rollback eliminates blast radius

---

### RISK-02 — Railway API Outage

**Description:** Railway API service crashes, OOMs, or fails to deploy.

**Severity:** High — all data-dependent features break.

**Mitigation:**
1. Railway health check auto-restarts service within 30s
2. Runbook INC-02 covers step-by-step recovery
3. Frontend degrades gracefully — static content still loads
4. `readonly` kill switch prevents data mutation during partial outage

**Owner:** Backend engineer / founder  
**Beta Accept:** ✅ Yes — Railway reliability acceptable for beta; upgrade plan if SLA needed

---

### RISK-03 — Preview Gateway Unreachable

**Description:** Orchestrator / preview gateway service fails — preview links broken.

**Severity:** Medium — core workspace/project features unaffected.

**Mitigation:**
1. Preview is non-critical for beta
2. Users can still build in Code + Team modes
3. Mobile service already deferred — gateway is the only preview path
4. Runbook INC-06

**Owner:** Backend engineer  
**Beta Accept:** ✅ Yes — explicitly non-critical for beta

---

### RISK-04 — Runtime Cost Spike

**Description:** AI generation, runtime provisioning, or preview costs exceed budget.

**Severity:** High — unexpected costs could be significant.

**Mitigation:**
1. Free tier: 10 AI generations/day, 3 runtimes
2. Kill switch `runtime_create` disables new provisioning immediately
3. Kill switch `remix` disables remix flows
4. Railway spend limits can be set per project
5. Monitor: `/admin/health` runtime count panel

**Owner:** Finance / founder  
**Beta Accept:** ⚠️ Conditional — set Railway spend alert before launch; confirm tier limits enforced

---

### RISK-05 — Abuse (Prompt Injection, Malicious Content)

**Description:** Users submit malicious prompts or attempt to extract secrets via generated output.

**Severity:** High — could expose internal config or produce harmful content.

**Mitigation:**
1. `PAIR_BLOCKED_CONTENT` regex in pair-programmer module
2. `WORKSPACE_BLOCKED_PROMPT` in collaboration module
3. `ORG_BLOCKED_CONTENT` in organization module
4. Public status API and all public endpoints contain no internal data
5. Audit log (`/admin`) tracks all suspicious patterns
6. `readonly` kill switch for emergency response

**Owner:** Security / founder  
**Beta Accept:** ✅ Yes — multi-layer content filtering in place

---

### RISK-06 — Billing Misconfiguration

**Description:** Stripe configured in test mode enters production, or webhooks misconfigured.

**Severity:** High — real money transactions could fail or be mis-charged.

**Mitigation:**
1. Explicitly verify Stripe mode (test vs live) before launch
2. Stripe dashboard shows mode clearly
3. `STRIPE_SECRET_KEY` prefix: `sk_test_` = test, `sk_live_` = production
4. Test a full billing flow in staging before go-live

**Owner:** Finance / founder  
**Beta Accept:** ⚠️ Conditional — verify Stripe live mode before enabling paid tiers

---

### RISK-07 — Generated App Quality Complaints

**Description:** AI-generated apps are low quality, broken, or don't match user expectations.

**Severity:** Medium — damages perception but not data integrity.

**Mitigation:**
1. "Beta" label clearly visible on all AI outputs
2. Quality module (`/quality`) provides review workflow
3. Review gate in pair-programmer blocks unsafe patches
4. Pricing page sets expectations (AI-assisted, not magic)
5. Support flow documents complaint handling

**Owner:** Product / founder  
**Beta Accept:** ✅ Yes — beta label manages expectations

---

### RISK-08 — Moderation Failure

**Description:** Harmful, offensive, or illegal content generated or stored on platform.

**Severity:** High — legal and reputational risk.

**Mitigation:**
1. Blocked content patterns on all AI input paths
2. Kill switch `readonly` stops all mutations immediately
3. Audit log preserves full action history
4. Terms of Service prohibit misuse; enforcement via account suspension
5. Escalation path in `docs/launch/support-flow.md`

**Owner:** Security / founder  
**Beta Accept:** ✅ Yes — patterns in place; founder on-call for escalation

---

### RISK-09 — Legal / Regulatory Risk

**Description:** GDPR, CCPA, HIPAA, COPPA, or other compliance requirements not met.

**Severity:** Medium — varies by jurisdiction and user type.

**Mitigation:**
1. Privacy Policy must be published before launch
2. Terms of Service must be published before launch
3. No PII in analytics events (analytics adapter enforces this)
4. HIPAA compliance: "Healthcare Suite" agents labeled — operators must sign BAA
5. COPPA: add age gate if targeting under-13 audience
6. Consult legal counsel before US/EU commercial launch

**Owner:** Legal / founder  
**Beta Accept:** ⚠️ Conditional — publish ToS + Privacy Policy; flag HIPAA/GDPR for legal review

---

### RISK-10 — Support Load Spike

**Description:** Beta launch drives high support volume that overwhelms the team.

**Severity:** Medium — causes burnout, slow response, reputation damage.

**Mitigation:**
1. Support flow documented (`docs/launch/support-flow.md`)
2. Bug report template reduces triage time
3. FAQ pre-written for top 5 expected questions
4. Async-first: email/Discord over real-time support
5. Founder daily review routine keeps backlog manageable

**Owner:** Operations / founder  
**Beta Accept:** ✅ Yes — structured flow in place

---

### RISK-11 — Token / AI Cost Overrun

**Description:** Anthropic API costs spike due to high-volume or expensive prompts.

**Severity:** High — direct financial impact.

**Mitigation:**
1. `ANTHROPIC_API_KEY` not set = AI features disabled (fail-safe)
2. Per-tier daily limits enforced (10 gen/day free)
3. Anthropic dashboard spend alerts configured
4. Kill switch `runtime_create` and `remix` limit AI-intensive operations
5. Cost per generation estimated and priced into tier pricing

**Owner:** Finance / founder  
**Beta Accept:** ✅ Yes — tier limits and kill switches protect against runaway spend

---

## Pre-Launch Risk Review Signoff

```
Date: ________________
Reviewer: ________________

RISK-01 Frontend deploy:     [ ] ACCEPTED  [ ] HOLD
RISK-02 Railway API:         [ ] ACCEPTED  [ ] HOLD
RISK-03 Preview gateway:     [ ] ACCEPTED  [ ] HOLD
RISK-04 Runtime cost:        [ ] ACCEPTED  [ ] HOLD  — Railway spend alert set? [ ]
RISK-05 Abuse:               [ ] ACCEPTED  [ ] HOLD
RISK-06 Billing:             [ ] ACCEPTED  [ ] HOLD  — Stripe live mode verified? [ ]
RISK-07 Quality:             [ ] ACCEPTED  [ ] HOLD
RISK-08 Moderation:          [ ] ACCEPTED  [ ] HOLD
RISK-09 Legal:               [ ] ACCEPTED  [ ] HOLD  — ToS + Privacy published? [ ]
RISK-10 Support load:        [ ] ACCEPTED  [ ] HOLD
RISK-11 Token cost:          [ ] ACCEPTED  [ ] HOLD  — Anthropic spend alert set? [ ]

LAUNCH CLEARED: [ ] YES  [ ] NO — blockers: _______________
```

---

## Related

- `docs/incident/runbook.md` — per-scenario recovery steps
- `docs/launch/support-flow.md` — support handling
- `docs/launch/public-beta-checklist.md` — full launch checklist
- `docs/monitoring/synthetic-checks.md` — alerting setup
