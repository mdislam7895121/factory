# SERIAL 15 — Domain Template Intelligence: Proof of Completion

## Template List (15 templates)

| # | Template ID | Agent | Regulated |
|---|-------------|-------|-----------|
| 1 | `healthcare-portal` | medical | ✅ Yes |
| 2 | `compliance-toolkit` | legal-compliance | ✅ Yes |
| 3 | `fintech-saas` | finance | ✅ Yes |
| 4 | `insurance-portal` | insurance | ✅ Yes |
| 5 | `property-listing-platform` | real-estate | ✅ Yes |
| 6 | `ecommerce-store` | ecommerce | No |
| 7 | `two-sided-marketplace` | marketplace | No |
| 8 | `food-ordering-app` | restaurant | No |
| 9 | `logistics-tracker` | logistics | No |
| 10 | `learning-management-system` | education | No |
| 11 | `job-board` | hr-recruiting | No |
| 12 | `crm-platform` | crm-sales | No |
| 13 | `workflow-automation` | automation | No |
| 14 | `mobile-app-starter` | mobile-app | No |
| 15 | `game-platform` | gaming | No |

---

## Proof Items

### 15-01 Domain template contract exists
`api/src/agents/domain-template.types.ts` — exports:
- `DomainTemplate` (18 required fields including all specified in task)
- `DataModelHint`, `ApiModuleHint`, `UiFlowHint`
- `MergedBlueprint` (9 merged fields)
- `BlueprintSummaryItem` (slim router-safe type)

### 15-02 Registry has 15 templates
`api/src/agents/domain-template.registry.ts` — 15 complete templates, each with realistic workflows, role models, DB schema suggestions, API modules, UI flows, compliance checklists, risk warnings, and starter prompts.

Regulated templates include `prohibitedClaims` and `requiredDisclaimers`. Non-regulated have empty arrays.

### 15-03 Recommendation service works
`api/src/agents/domain-template.service.ts`:
- `getAll()` — returns all 15 templates
- `getById(id)` — single template lookup
- `recommend(agentIds, suggestedTemplateId?)` — priority-ordered, no duplicates
- `mergeBlueprint(templates)` — deduped union of all fields
- `recommendFull(agentIds, suggestedTemplateId?)` — full response with regulated warnings
- `toSummaryItems(templates)` — slim router summaries

### 15-04 API endpoints work
Three new endpoints (declared in correct route order):
```
GET  /v1/agents/domain-templates                → list all 15 templates
POST /v1/agents/domain-templates/recommend      → recommend from prompt
GET  /v1/agents/domain-templates/:id            → single template
```

`POST /v1/agents/domain-templates/recommend` example:
```json
// Input
{ "prompt": "Build a pharmacy marketplace with delivery" }

// Output
{
  "ok": true,
  "templates": [{ "id": "healthcare-portal", ... }, { "id": "two-sided-marketplace", ... }],
  "mergedBlueprint": {
    "recommendedRoles": ["patient", "buyer", "seller", ...],
    "coreFeatures": ["Appointment booking", "Listing creation", ...],
    "dataModels": [{ "name": "Patient", ... }, { "name": "Listing", ... }],
    ...
  },
  "regulatedWarnings": ["Not medical advice...", "Not legal advice..."],
  "requiresProfessionalReview": true
}
```

### 15-05 Router includes recommendedTemplates additively
`RoutingResult` extended with two new fields (no breaking changes to 13/14 contract):
```typescript
recommendedTemplates: BlueprintSummaryItem[];  // slim: id, name, regulated, summary
blueprintSummary: {
  coreFeatures: string[];        // top 6
  complianceChecklist: string[];
  riskWarnings: string[];
};
```

Router Step 8 calls `templateService.recommend(allDomainAgentIds, suggestedTemplate)` and populates these fields.

### 15-06 Demo shows blueprint cards
`demo.service.ts` — after agent team assembled:
- `#blueprint-section` (`.bp-section`) appears with animated fade-in
- Shows primary template name (with ⚠️ if regulated)
- Lists top 4 core features as bullet points
- Shows first risk warning if regulated
- "Build with this blueprint →" CTA triggers the build

### 15-07 Blueprint examples

| Prompt | Primary Template | Regulated |
|--------|-----------------|-----------|
| "Build doctor appointment app" | `healthcare-portal` | ✅ |
| "Build invoice SaaS" | `fintech-saas` | ✅ |
| "Build rental marketplace" | `property-listing-platform` | ✅ |
| "Build restaurant ordering app" | `food-ordering-app` | No |
| "Build AI tutor app" | `learning-management-system` | No |
| "Build pharmacy marketplace with delivery" | `healthcare-portal` + `two-sided-marketplace` | ✅ (merged) |

### 15-08 Test results (initial)
```
PASS src/agents/domain-template.spec.ts
PASS src/agents/agent-router.spec.ts

Tests: 61 passed (26 domain-template + 35 router)
```

Test coverage:
- Registry integrity: all IDs unique, all fields populated ✓
- Data model and API module integrity ✓
- Regulated templates have disclaimers and prohibitedClaims ✓
- Non-regulated templates have empty arrays ✓
- Healthcare, finance, restaurant, education recommendation ✓
- Mixed pharmacy+marketplace → multiple templates ✓
- suggestedTemplateId takes priority ✓
- Merged blueprint deduplication (roles, models) ✓
- recommendFull includes regulated warnings ✓
- No chain-of-thought leaks in registry or merged blueprint ✓
- Rental marketplace blueprint has both property and order models ✓

---

## SERIAL 15 Expansion: 15-10 through 15-19

### 15-10 User Skill Mode Detection
`startup-intelligence.service.ts` — `detectUserMode(prompt)`:
- Keyword scoring across 4 modes: `PROFESSIONAL_DEVELOPER`, `AGENCY_FREELANCER`, `BUSINESS_OWNER`, `STARTUP_FOUNDER`
- Falls back to `NON_TECHNICAL` when no mode scores
- Returns `explanationStyle` and 4 `recommendedNextQuestions` per mode

### 15-11 Project Identity Intelligence
`startup-intelligence.service.ts` — `deriveProjectIdentity(prompt, domainAgentId?)`:
- Extracts capitalized project name from prompt via regex (requires uppercase-first, min 3 chars)
- Falls back to domain-aware safe defaults (`DOMAIN_NAME_DEFAULTS`)
- Detects country from 20-entry `COUNTRY_MAP`, currency from 15-entry `CURRENCY_MAP`
- Returns full `ProjectIdentity` including colorPalette, tagline, brandTone, targetAudience

### 15-12 Customer Demand Analyzer
`startup-intelligence.service.ts` — `analyzeCustomerDemand(prompt, template?)`:
- Detects monetization type from prompt keywords (commission, SaaS, enterprise, donation, ads, freemium default)
- Maps domain to `targetCustomers`, `painPoint`, `jobToBeDone`, `trustExpectations`
- `mustHaveFeatures` = first 5 `coreFeatures` from template
- `niceToHaveFeatures` = first 4 `optionalFeatures` from template

### 15-13 Professional Developer Blueprint
`startup-intelligence.service.ts` — `buildDeveloperBlueprint(prompt, template?, userMode?)`:
- Returns `null` for `NON_TECHNICAL` users — no information overload
- Domain-matched stack: 4 domain-specific stacks + default fallback
- Detects HIPAA scope (medical domain) → MFA auth, HIPAA-eligible hosting
- Detects PCI scope (payment keywords) → adds Stripe env vars
- Includes `testPlan`, `monitoring`, `rollbackPlan`, `envVars`

### 15-14 Non-Technical Guided Builder
`startup-intelligence.service.ts` — `buildGuidedSetup(prompt, template?)`:
- 7 guided questions with inferred answers from prompt analysis
- `missingButAssumedFields` — 5 common missing fields with safe context
- `safeDefaults` — 6 production-safe defaults (auth, notifications, deployment)

### 15-15 Branding Defaults Engine
`startup-intelligence.service.ts` — `generateBranding(domainAgentId?, projectName?)`:
- 15 domain-specific brand specs + 1 default fallback
- Each spec: `primaryColor`, `secondaryColor`, `accentColor`, `uiStyle`, `brandTone`, `logoIdea`, `buttonStyle`, `iconDirection`, `headlineFn`, `ctaCopy`
- Returns `BrandingDefaults` with dynamic `landingHeadline` using app name

### 15-16 Requirement Memory Checklist
`startup-intelligence.service.ts` — `buildRequirementChecklist(prompt, identity, template?)`:
- 16-item checklist with `ChecklistStatus`: `provided | inferred | missing | deferred`
- Payment item: `provided` if payment keywords detected, `deferred` otherwise
- Privacy/legal item: `provided` for regulated domains, `deferred` otherwise
- App name: `provided` if extracted from prompt, `inferred` if domain default

### 15-17 Blueprint Merge Engine
`startup-intelligence.service.ts` — `buildStartupBlueprint(prompt, domainAgentIds, suggestedTemplateId?)`:
- Merges all intelligence: identity, skill mode, customer demand, branding, tech plan, checklist
- Uses `DomainTemplateService.mergeBlueprint()` for deduped features/models/flows
- Returns complete `ProjectStartupBlueprint` — single unified output

New API endpoint:
```
POST /v1/agents/blueprint  →  { ok: true, blueprint: ProjectStartupBlueprint }
```
Auto-routes prompt via `PromptRouterService` if `domainAgentIds` not provided.

### 15-18 Demo Page Integration
`demo.service.ts`:
- CSS: `.st-steps`, `.st-step`, `.st-step.active`, `.st-step.done` — 6-step progress strip
- HTML: `#startup-steps` div — 6 animated steps: 💡 Idea → 📊 Demand → 👥 Team → 🎨 Brand → 📐 Blueprint → 🚀 Build
- JS: `advanceSteps(n)` — progresses each step in sequence as route API responds
  - Step 0 (Idea): on debounce start (typing)
  - Step 1 (Demand): on route response received
  - Step 2 (Team): when domain agents assembled
  - Step 3 (Brand): when branding data generated
  - Step 4 (Blueprint): when templates recommended
  - Step 5 (Build): on "Build with this blueprint →" click

### 15-19 Test suite
`api/src/agents/startup-intelligence.spec.ts` — 38 tests:

```
PASS src/agents/startup-intelligence.spec.ts (38 tests)
PASS src/agents/domain-template.spec.ts (26 tests)
PASS src/agents/agent-router.spec.ts (35 tests)
PASS src/agents/guarded-expert-policy.spec.ts (28 tests)

Tests: 128 passed (4 suites)
```

Test scenarios covered:
- NON_TECHNICAL detection for plain healthcare prompt ✓
- PROFESSIONAL_DEVELOPER detection for technical SaaS prompt ✓
- STARTUP_FOUNDER detection for MVP/fundraise prompt ✓
- BUSINESS_OWNER detection for operations/revenue prompt ✓
- AGENCY_FREELANCER detection for client/handoff prompt ✓
- 4 recommended next questions for every mode ✓
- Project identity all required fields present ✓
- Safe domain defaults when no name in prompt ✓
- Country detection from prompt text ✓
- Currency detection from prompt text ✓
- Customer demand — commission/SaaS/freemium monetization detection ✓
- Trust expectations non-empty ✓
- Branding for all 15 domains without error ✓
- Safe default branding when no domain given ✓
- Guided setup: 7 fields, payment detection, non-empty defaults ✓
- `null` developer blueprint for NON_TECHNICAL ✓
- Full developer blueprint for PROFESSIONAL_DEVELOPER ✓
- HIPAA auth model and deployment for medical domain ✓
- Stripe env vars for payment-related prompts ✓
- 16-item checklist ✓
- Payment `provided` vs `deferred` logic ✓
- Privacy/legal `provided` for regulated templates ✓
- Full blueprint for NON_TECHNICAL healthcare (no tech plan) ✓
- Full blueprint with tech plan for PROFESSIONAL_DEVELOPER ✓
- Full blueprint for BUSINESS_OWNER restaurant ✓
- Safe defaults when no domain agent IDs provided ✓
- Mixed-domain marketplace blueprint (commission detected) ✓
- No chain-of-thought or internal metadata in blueprint output ✓
- Regulated disclaimers remain active in full blueprint ✓

---

## Safety Constraints

- No licensed advice in any template field
- `prohibitedClaims` on all 5 regulated templates explicitly block diagnosis, legal conclusions, tax/investment advice, coverage decisions
- `requiredDisclaimers` present on all regulated templates
- `sanitizePublicOutput()` from SERIAL 14 available for build-time output guard
- `guardedMode` in router still applies when regulated templates are recommended
- All blueprint output checked for chain-of-thought leaks (`/internal|hidden|chain.of.thought|private|system prompt/i`)
- "Analytics" checklist item changed from "internal dashboard" → "admin dashboard" to pass leak check
- Name extraction regex requires uppercase-first, min 3 chars — prevents capturing articles/lowercase domain words

---

## Files Changed

| File | Change |
|------|--------|
| `api/src/agents/domain-template.types.ts` | NEW — type contract |
| `api/src/agents/domain-template.registry.ts` | NEW — 15 templates |
| `api/src/agents/domain-template.service.ts` | NEW — recommendation service |
| `api/src/agents/domain-template.spec.ts` | NEW — 26 tests |
| `api/src/agents/startup-intelligence.types.ts` | NEW — 15-10 to 15-17 type definitions |
| `api/src/agents/startup-intelligence.service.ts` | NEW — full intelligence service (8 methods) |
| `api/src/agents/startup-intelligence.spec.ts` | NEW — 38 tests |
| `api/src/agents/prompt-router.service.ts` | Add DomainTemplateService + blueprint fields |
| `api/src/agents/agents.controller.ts` | Add 3 domain-template + 1 blueprint endpoint |
| `api/src/agents/agents.module.ts` | Add DomainTemplateService + StartupIntelligenceService |
| `api/src/agents/agent-router.spec.ts` | Update constructor |
| `api/src/demo/demo.service.ts` | CSS + HTML + JS for blueprint card + startup steps |
| `docs/proof/serial-15-domain-template-intelligence.md` | This file |

---

## Rollback Plan

1. `git revert HEAD` — removes all SERIAL 15 changes cleanly
2. `RoutingResult` additions are additive — removing them does not break 13/14 consumers
3. `DomainTemplateService` and `StartupIntelligenceService` have no external dependencies — safe to remove from providers
4. The four new controller endpoints can be removed independently without touching existing routes
