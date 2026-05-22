# SERIAL 16 — Multi-Agent Council: Proof of Completion

---

## 16-01 Council Session Model

`api/src/agents/council.types.ts` — exports:
- `CouncilSession` — full session: sessionId, prompt, participants, messages, decisions, riskMatrix, memory, finalBuildPlan, approvalState, createdAt
- `CouncilMessage` — safe public agent message: agentId, agentName, agentIcon, role, summary, timestamp
- `CouncilDecision` — debate result: topic, outcome, rationale, votes
- `CouncilMemory` — memory layer: sessionId, acceptedConstraints, rejectedFeatures, brandingDirection, userPreferences, previousDecisions
- `FinalBuildPlan` — merged build plan: architecture, dbModels, apiModules, userRoles, workflows, security, compliance, branding, rolloutPriority, riskMatrix, approvalState, approvalNotes
- `RiskItem` — category, level, description, mitigation
- `CouncilApprovalState`: `APPROVED | APPROVED_WITH_WARNINGS | NEEDS_INPUT | BLOCKED`
- `CouncilVote`: `APPROVE | APPROVE_WITH_CONDITION | OBJECT | ABSTAIN`
- `RiskLevel`: `LOW | MEDIUM | HIGH | CRITICAL`
- `RiskCategory`: `AUTH | COMPLIANCE | SCALING | PRIVACY | PAYMENT | ABUSE`

---

## 16-02 Multi-Agent Discussion Engine

`api/src/agents/council.service.ts` — `generateMessages(ctx, participants)`:

9 virtual agent profiles:

| Agent | ID | Icon | Always Active | Trigger Domains |
|---|---|---|---|---|
| Planner | `planner` | 🗺️ | ✅ | — |
| Architect | `architect` | 🏗️ | ✅ | — |
| Security | `security` | 🛡️ | ✅ | — |
| QA | `qa` | 🧪 | ✅ | — |
| Medical | `medical` | 🏥 | ❌ | medical |
| Finance | `finance` | 💰 | ❌ | finance, insurance |
| Legal | `legal` | ⚖️ | ❌ | legal-compliance |
| Marketplace | `marketplace` | 🛒 | ❌ | marketplace, ecommerce |
| Logistics | `logistics` | 🚚 | ❌ | logistics, restaurant |

Each agent produces structured messages:
- **Planner**: scope definition + market gap request
- **Architect**: stack proposal + delivery/enterprise concerns
- **Security**: auth baseline + PCI/HIPAA objections + marketplace fraud warnings
- **Medical**: workflow scope + prohibited advice objection + prescription gate
- **Finance**: revenue model + idempotency requirement + subscription proration
- **Legal**: GDPR checklist + cookie consent objection + launch approval
- **Marketplace**: two-sided flow + identity trust + moderation requirement
- **Logistics**: delivery flow + rider batching + geofencing gate
- **QA**: edge cases + performance budget request

---

## 16-03 Debate + Resolution Logic

8 structured debate topics with condition, agent votes, and forced outcome:

| Topic | Condition | Outcome |
|---|---|---|
| Escrow payment protection | marketplace + payment | ACCEPTED |
| AI medical advice/diagnosis | medical domain | REJECTED |
| Licensed pharmacy verification | medical + prescription | ACCEPTED |
| Professional compliance review gate | regulated domain | ACCEPTED |
| Commission reconciliation engine | (marketplace\|finance) + payment | ACCEPTED |
| Real-time rider tracking + geofencing | delivery | ACCEPTED |
| GDPR cookie consent banner | legal-compliance domain | ACCEPTED |
| Native mobile app in current MVP | mobile detected | DEFERRED |

Example — pharmacy marketplace:
```
Security Agent:    "Payment flows require PCI-compliant integration..."        [OBJECT]
Medical Agent:     "Platform cannot provide diagnosis, dosage guidance..."     [OBJECT → REJECTED]
Medical Agent:     "Prescription workflow acceptable ONLY with licensed pharmacy..." [APPROVE]
Security Agent:    "PHI uploads require HIPAA BAA, AES-256 encryption..."     [OBJECT]
Finance Agent:     "All payment endpoints require idempotency keys..."          [OBJECT]
```

---

## 16-04 Build Plan Synthesizer

`FinalBuildPlan` synthesized from:
- `ProjectStartupBlueprint` (via StartupIntelligenceService)
- Council risk mitigations appended to security array
- Accepted constraints reflected in rollout priority
- Rejected features noted in approvalNotes
- Deferred features noted in approvalNotes

3-phase rollout priority always included:
1. Phase 1 (MVP): top 3 core features
2. Phase 2: future features
3. Phase 3: Internationalization, enterprise, public API

---

## 16-05 Risk Matrix Engine

10 risk rules across 6 categories and 4 levels:

| Category | Level | Trigger |
|---|---|---|
| PRIVACY | CRITICAL | prescription detected |
| COMPLIANCE | CRITICAL | medical + prescription |
| COMPLIANCE | HIGH | regulated domain |
| PAYMENT | HIGH | payment keywords detected |
| PAYMENT | HIGH | finance/insurance domain or subscription |
| AUTH | HIGH | no auth keywords + not regulated |
| ABUSE | MEDIUM | marketplace domain |
| SCALING | MEDIUM | delivery/rider keywords |
| SCALING | MEDIUM | enterprise/B2B keywords |
| COMPLIANCE | LOW | no country/market mentioned |

---

## 16-06 Council Theater (Demo)

`api/src/demo/demo.service.ts`:
- CSS: `.council-section`, `.council-feed`, `.council-msg` + variants (`.obj`, `.ok`, `.tip`), `.council-verdict` + state variants
- HTML: `#council-section` → `#council-feed` + `#council-verdict`
- JS: `showCouncilTheater(prompt)` — calls `POST /v1/agents/council`, streams messages one-by-one at 200ms intervals, then shows verdict banner
- Triggered automatically when blueprint templates appear in the team preview
- Message color coding: objections (red tint), approvals (green tint), suggestions (amber tint)

---

## 16-07 Safe Public Summaries

All `CouncilMessage.summary` fields are:
- Pre-written safe strings — no system internals exposed
- No chain-of-thought, no hidden policies, no internal metadata
- Verified by 4 dedicated leak tests: messages, finalBuildPlan, riskMatrix, decisions

Leak test pattern: `/internal|hidden|chain.of.thought|system prompt/i` — all pass.

---

## 16-08 Council Memory Layer

`CouncilService.sessionMemory` — `Map<string, CouncilMemory>`:
- Persists for NestJS process lifetime (in-process, no DB dependency)
- Keyed by unique session ID (`Date.now().toString(36) + random`)
- Stores: acceptedConstraints, rejectedFeatures, brandingDirection, userPreferences, previousDecisions
- Retrieved via `getMemory(sessionId)` — returns `undefined` for unknown IDs

---

## 16-09 Build Approval Gate

Approval state decision tree:
1. Any `CRITICAL` risk → `BLOCKED`
2. Any `HIGH` risk → `APPROVED_WITH_WARNINGS`
3. Any `DEFERRED` decision → `NEEDS_INPUT`
4. Otherwise → `APPROVED`

Examples:
| Prompt | State |
|---|---|
| Pharmacy marketplace with prescription dispensing | `BLOCKED` |
| Doctor appointment booking app | `APPROVED_WITH_WARNINGS` |
| Simple blog with user login | `APPROVED` |
| Mobile restaurant app (iOS) | `NEEDS_INPUT` (mobile deferred) |

---

## 16-10 Test Results

```
PASS src/agents/council.spec.ts             46 tests
PASS src/agents/startup-intelligence.spec.ts 38 tests
PASS src/agents/domain-template.spec.ts     26 tests
PASS src/agents/agent-router.spec.ts        35 tests
PASS src/agents/guarded-expert-policy.spec.ts 28 tests
PASS src/app.controller.spec.ts              1 test

Tests: 174 passing / 1 pre-existing fail (prisma.service.spec.ts — no DATABASE_URL)
```

Test coverage:
- Session model: all required fields present ✓
- Unique session IDs ✓
- Core agents always active ✓
- Domain agents triggered correctly ✓
- Messages have valid roles and non-empty summaries ✓
- Medical advice rejected for medical domain ✓
- Prescription verification accepted ✓
- Escrow accepted for marketplace + payment ✓
- Mobile app deferred ✓
- Delivery tracking accepted ✓
- CRITICAL risk for prescription prompt ✓
- HIGH payment risk for payment apps ✓
- MEDIUM abuse risk for marketplace ✓
- LOW compliance risk for no country ✓
- BLOCKED for pharmacy + prescription ✓
- APPROVED_WITH_WARNINGS for medical appointment ✓
- APPROVED for simple blog with login ✓
- Memory stored and retrievable by session ID ✓
- Memory contains rejected features ✓
- No chain-of-thought leaks (4 tests) ✓

---

## Files Changed

| File | Change |
|------|--------|
| `api/src/agents/council.types.ts` | NEW — session model types |
| `api/src/agents/council.service.ts` | NEW — multi-agent council engine |
| `api/src/agents/council.spec.ts` | NEW — 46 tests |
| `api/src/agents/agents.controller.ts` | Add POST /v1/agents/council endpoint |
| `api/src/agents/agents.module.ts` | Add CouncilService provider + export |
| `api/src/demo/demo.service.ts` | CSS + HTML + JS for council theater (16-06) |
| `docs/proof/serial-16-multi-agent-council.md` | This file |

---

## Rollback Plan

1. `git revert HEAD` — removes all SERIAL 16 changes cleanly
2. `CouncilService` has no DB dependency — pure in-process, zero migration risk
3. `POST /v1/agents/council` is a new endpoint — removing it has no impact on existing routes
4. Demo theater is additive — removing `showCouncilTheater()` call leaves existing demo intact
