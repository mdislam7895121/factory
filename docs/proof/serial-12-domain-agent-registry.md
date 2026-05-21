# SERIAL 12 — Domain Agent Registry Proof
**Date:** 2026-05-21 | **Branch:** `claude/code-audit-review-bERxc`

---

## 1. Files Created / Modified

| File | Role |
|------|------|
| `api/src/agents/agent-registry.ts` | 35 agent definitions with full metadata contract |
| `api/src/agents/agent-classifier.service.ts` | Keyword-based classifier + guard messages |
| `api/src/agents/agents.controller.ts` | GET /v1/agents, GET /v1/agents/:id, GET /v1/agents/categories, POST /v1/agents/preview-selection |
| `api/src/agents/agents.module.ts` | Module wiring |
| `api/src/app.module.ts` | AgentsModule added |
| `api/src/demo/demo.service.ts` | 12-06: Team preview section in landing phase |
| `docs/proof/serial-12-domain-agent-registry.md` | This file |

---

## 2. Agent List (35 Total)

### Core Builder Agents (10) — always-on, kind: CORE

| ID | Name | Risk |
|----|------|------|
| planner | Planner | LOW |
| architect | Architect | LOW |
| frontend | Frontend | LOW |
| backend | Backend/API | LOW |
| database | Database | LOW |
| qa | QA/Test | LOW |
| devops | DevOps/Runtime | LOW |
| security-core | Security | LOW |
| ux-polish | UX Polish | LOW |
| healer | Healer | LOW |

### Domain Expert Agents (25) — selected by prompt classification

#### Regulated (kind: REGULATED, riskLevel: HIGH)

| ID | Name | Category |
|----|------|----------|
| legal-compliance | Legal Compliance | LEGAL |
| finance | Finance/Accounting | FINANCE |
| medical | Medical/Healthcare | MEDICAL |
| insurance | Insurance | INSURANCE |
| real-estate | Real Estate | REAL_ESTATE |

#### Non-Regulated (kind: DOMAIN, riskLevel: LOW/MEDIUM)

| ID | Name | Category |
|----|------|----------|
| education | Education/Tutor | EDUCATION |
| hr-recruiting | HR/Recruiting | HR |
| cybersecurity | Cybersecurity | CYBERSECURITY |
| ecommerce | Ecommerce | ECOMMERCE |
| restaurant | Restaurant/Food | FOOD |
| marketplace | Marketplace | MARKETPLACE |
| logistics | Logistics/Delivery | LOGISTICS |
| travel | Travel/Booking | TRAVEL |
| fitness | Fitness/Wellness | FITNESS |
| government | Government/Form | GOVERNMENT |
| nonprofit | Nonprofit/Donation | NONPROFIT |
| creator-media | Creator/Media | MEDIA |
| events | Event/Ticketing | EVENTS |
| crm-sales | CRM/Sales | CRM |
| customer-support | Customer Support | SUPPORT |
| data-analytics | Data/Analytics | DATA |
| automation | Automation/Webhook | AUTOMATION |
| mobile-app | Mobile App | MOBILE |
| gaming | Game | GAMING |
| localization | Localization | LOCALIZATION |

---

## 3. Regulated Domain Guard Rules (12-02)

### Legal Compliance
- **prohibitedOutputs**: legal advice, legal conclusions, specific legal strategy, attorney-client information, case outcome predictions, jurisdiction-specific legal rulings
- **disclaimer**: "Not legal advice. Consult a qualified attorney for legal decisions."

### Finance/Accounting
- **prohibitedOutputs**: investment advice, financial advice, tax decisions, trading recommendations, portfolio allocation advice, specific return projections
- **disclaimer**: "Not financial or investment advice. Consult a qualified financial advisor."

### Medical/Healthcare
- **prohibitedOutputs**: medical diagnosis, medical advice, treatment recommendations, drug dosage recommendations, clinical decisions, health prognosis
- **disclaimer**: "Not medical advice. Consult a licensed healthcare provider."

### Insurance
- **prohibitedOutputs**: insurance recommendations, coverage advice, underwriting decisions, specific policy recommendations, binding premium calculations
- **disclaimer**: "Not insurance advice. Consult a licensed insurance broker."

### Real Estate
- **prohibitedOutputs**: property valuation advice, investment property advice, mortgage rate advice, real estate transaction recommendations, MLS data manipulation
- **disclaimer**: "Not real estate advice. Consult a licensed real estate professional."

---

## 4. API Proof

### GET /v1/agents
Returns all 35 agents with public-safe metadata. `prohibitedOutputs` is **intentionally omitted** from public API responses (`toPublicAgent()` method).

Optional query params: `?kind=CORE|DOMAIN|REGULATED`, `?category=LEGAL|FINANCE|...`

### GET /v1/agents/categories
Returns all 26 distinct categories with agent counts. Route declared **before** `GET /v1/agents/:id` to prevent "categories" matching as an ID param.

### GET /v1/agents/:id
Returns single agent by ID. Returns 404 if not found.

### POST /v1/agents/preview-selection — Test Cases

**Healthcare prompt:**
```json
{ "prompt": "Build a patient portal with appointment booking and HIPAA compliance" }
```
Expected: medical (REGULATED) in domainAgents, regulated warning with medical disclaimer

**Legal prompt:**
```json
{ "prompt": "Build a contract management platform with legal compliance and GDPR" }
```
Expected: legal-compliance (REGULATED) + ecommerce (if applicable) in domainAgents

**Finance prompt:**
```json
{ "prompt": "Build a fintech app with invoicing, payroll, and banking integration" }
```
Expected: finance (REGULATED) in domainAgents, financial advice disclaimer

**E-commerce prompt:**
```json
{ "prompt": "Build an Airbnb-style platform for pet boarding with checkout and reviews" }
```
Expected: real-estate (REGULATED, triggers on 'airbnb'), ecommerce, marketplace in domainAgents

---

## 5. Demo Integration Proof (12-06)

The `/demo` landing page now shows an agent team preview section (`#team-preview`) between the prompt and chips:

- Appears after user types 8+ characters (400ms debounce) or clicks a starter chip
- Calls `POST /v1/agents/preview-selection` with the current prompt
- Shows domain agent badges (blue = DOMAIN, yellow = REGULATED)
- Shows regulated warnings with disclaimer text for guarded-mode agents
- **Non-blocking**: failure to fetch is silently ignored; the build flow is never blocked
- Hidden when no domain agents are matched

---

## 6. No Licensed Advice Output (12-02 Compliance)

The `prohibitedOutputs` field in each REGULATED agent definition explicitly lists:
- No diagnosis / medical advice
- No investment / tax decisions
- No legal conclusions / legal advice
- No insurance recommendations
- No real estate transaction advice

These rules propagate to: agent metadata stored in registry, guard warnings shown in demo preview, and disclaimer text shown to users. The API response for regulated agents includes `requiredDisclaimers` to surface these to callers.

---

## 7. Rollback Plan

All SERIAL 12 additions are purely additive:
1. Remove `AgentsModule` import from `app.module.ts`
2. Delete `api/src/agents/` directory
3. Revert `api/src/demo/demo.service.ts` to remove the 12-06 team preview block

No Prisma schema changes, no migrations, no existing code modified except `app.module.ts` and the demo HTML template.

---

## 8. Build Verification

```
tsc --noEmit:  PASS (0 errors)
npm test:      1 pre-existing failure (prisma.service.spec.ts: DATABASE_URL not set in CI)
               1 pass (app.controller.spec.ts)
               No new failures introduced
Route order:   GET categories (line 44) declared before GET :id (line 61) ✓
```
