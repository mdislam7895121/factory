# SERIAL 14 — Guarded Expert Mode: Proof of Completion

## Overview
Converted regulated/domain expert agents into safe general-information + workflow + compliance-checklist assistants. Prohibited professional advice (diagnosis, legal conclusions, investment recommendations, coverage determinations) is now detected, blocked, and reframed with safe rewrites and clear disclaimers.

---

## Policy Categories

| Category     | Agent ID          | Prohibited Outputs                                                  |
|--------------|-------------------|---------------------------------------------------------------------|
| LEGAL        | legal-compliance  | Legal conclusions, contract enforceability, lawsuit strategy        |
| MEDICAL      | medical           | Diagnosis, treatment recommendations, dosage, emergency triage      |
| FINANCE      | finance           | Investment advice, personalized trading, financial guarantees       |
| TAX          | finance           | Tax filing decisions, exact tax liability claims                    |
| INSURANCE    | insurance         | Claim approval predictions, coverage determinations                 |
| REAL_ESTATE  | real-estate       | Eviction legal advice, title conclusions, mortgage decisions        |

---

## Proof Items

### 14-01 Guarded Expert Policy Engine exists
`api/src/agents/guarded-expert-policy.service.ts` — `GuardedExpertPolicyService` with:
- `guard(agentIds, prompt, context?)` → `GuardResult`
- `sanitizePublicOutput(text)` → string (14-06)
- 25 `PROHIBITED_INTENT_RULES` across 6 policy categories
- Per-agent `AGENT_POLICY` with `allowedScopes`, `blockedScopes`, `disclaimer`
- `APP_CONTEXT_SIGNALS` detection for app-building vs personal-advice requests

### 14-02 Prohibited output rules enforced
Rules match: "is this contract enforceable", "diagnose patient", "which stocks should I buy", "will my claim be approved", "can I evict", etc. Safe app-building prompts pass through without triggering rewrites.

### 14-03 POST /v1/agents/guard endpoint
```
POST /v1/agents/guard
{
  "agentIds": ["medical"],
  "prompt": "Build a doctor appointment app that diagnoses patients",
  "context": "demo"
}

→ {
  "ok": true,
  "allowed": true,
  "riskLevel": "HIGH",
  "disclaimers": ["Not medical advice. Consult a licensed healthcare provider..."],
  "blockedScopes": ["Medical diagnosis", "Treatment recommendations", ...],
  "allowedScopes": ["Patient portal and appointment booking UI", "HIPAA compliance..."],
  "safeRewrite": "Build a patient appointment booking and healthcare intake portal...",
  "requiresProfessionalReview": true
}
```
No chain-of-thought, no internal policy dump. Public-safe output only.

### 14-04 Router integration — guarded fields added additively
`RoutingResult` extended with 5 new fields (no breaking changes):
```typescript
guardedMode: boolean;
disclaimers: string[];
blockedScopes: string[];
safeRewrite: string;
requiresProfessionalReview: boolean;
```
When regulated agents are present, router calls `policyService.guard(regulatedIds, prompt)` and populates these fields.

### 14-05 Demo integration
`demo.service.ts` — `updateTeamPreview` now handles:
- `⚙️ Guarded expert mode` badge (`.tp-guarded`) when `guardedMode: true`
- `👨‍⚕️ Professional review recommended before launch` (`.tp-prof-review`) when `requiresProfessionalReview: true`
- `💡 Tip: [safe rewrite]` (`.tp-safe-rewrite`) when `safeRewrite` is non-empty

Language is informative, not alarming. Does not block normal app-building prompts.

### 14-06 Build-time output guard
`sanitizePublicOutput(text)` redacts medical diagnosis conclusions, treatment recommendations, investment advice, tax claims, and coverage determinations from public activity streams and build summaries.

### 14-07 Test results
```
PASS src/agents/guarded-expert-policy.spec.ts
PASS src/agents/agent-router.spec.ts

Test Suites: 2 passed
Tests: 63 passed (28 policy guard + 35 router)
```

Scenarios verified:
| Prompt | Agent | Outcome |
|--------|-------|---------|
| "diagnose patient" | medical | blocked/reframed — safeRewrite provided |
| "recommend dosage" | medical | blocked/reframed |
| "Build a doctor appointment app" | medical | allowed, safeRewrite='' |
| "is this contract enforceable?" | legal-compliance | blocked/reframed |
| "Build terms and privacy policy generator" | legal-compliance | allowed |
| "which stocks should I buy" | finance | blocked/reframed |
| "Build an invoice SaaS" | finance | allowed |
| "will my claim be approved?" | insurance | blocked/reframed |
| "Build an insurance claim workflow app" | insurance | allowed |
| "can I evict my tenant?" | real-estate | blocked/reframed |
| "Build a property rental platform" | real-estate | allowed |
| Non-regulated agent (ecommerce) | — | no guard, requiresProfessionalReview=false |

### Chain-of-thought / internal policy leak check
`JSON.stringify(result)` does not match `/internal|hidden|chain.of.thought|private|instruction|system prompt/i` — verified by test.

---

## Files Changed

| File | Change |
|------|--------|
| `api/src/agents/guarded-expert-policy.service.ts` | NEW — policy engine |
| `api/src/agents/guarded-expert-policy.spec.ts` | NEW — 28 tests |
| `api/src/agents/prompt-router.service.ts` | Inject policy service; add guarded fields to RoutingResult + route() |
| `api/src/agents/agents.controller.ts` | Inject policy service; add POST /v1/agents/guard |
| `api/src/agents/agents.module.ts` | Add GuardedExpertPolicyService to providers/exports |
| `api/src/agents/agent-router.spec.ts` | Update beforeEach to pass GuardedExpertPolicyService |
| `api/src/demo/demo.service.ts` | CSS + HTML + JS for guarded mode badge, prof-review, safe rewrite |
| `docs/proof/serial-14-guarded-expert-mode.md` | This file |

---

## Rollback Plan
If a regression is detected:
1. `git revert HEAD` to restore the previous SERIAL 13 state
2. The `RoutingResult` additive fields (`guardedMode`, etc.) have no impact on SERIAL 13 consumers since they only added new keys
3. The `POST /v1/agents/guard` endpoint can be removed from `agents.controller.ts` independently
4. `GuardedExpertPolicyService` has zero external dependencies — safe to remove from providers list

---

## API Examples

**Unsafe request blocked:**
```json
POST /v1/agents/guard
{ "agentIds": ["medical"], "prompt": "diagnose patient with fever" }

→ { "allowed": false, "safeRewrite": "Build a patient appointment booking...", "requiresProfessionalReview": true }
```

**Safe app-building allowed:**
```json
POST /v1/agents/guard
{ "agentIds": ["medical"], "prompt": "Build a patient booking portal" }

→ { "allowed": true, "safeRewrite": "", "requiresProfessionalReview": true }
```

**App with incidental unsafe intent:**
```json
POST /v1/agents/guard
{ "agentIds": ["medical"], "prompt": "Build a doctor app that diagnoses patients" }

→ { "allowed": true, "safeRewrite": "Build a patient appointment booking...", "requiresProfessionalReview": true }
```
