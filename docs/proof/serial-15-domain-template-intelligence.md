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

### 15-08 Test results
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

## Safety Constraints

- No licensed advice in any template field
- `prohibitedClaims` on all 5 regulated templates explicitly block diagnosis, legal conclusions, tax/investment advice, coverage decisions
- `requiredDisclaimers` present on all regulated templates
- `sanitizePublicOutput()` from SERIAL 14 available for build-time output guard
- `guardedMode` in router still applies when regulated templates are recommended

---

## Files Changed

| File | Change |
|------|--------|
| `api/src/agents/domain-template.types.ts` | NEW — type contract |
| `api/src/agents/domain-template.registry.ts` | NEW — 15 templates |
| `api/src/agents/domain-template.service.ts` | NEW — recommendation service |
| `api/src/agents/domain-template.spec.ts` | NEW — 26 tests |
| `api/src/agents/prompt-router.service.ts` | Add DomainTemplateService + blueprint fields |
| `api/src/agents/agents.controller.ts` | Add 3 domain-template endpoints |
| `api/src/agents/agents.module.ts` | Add DomainTemplateService |
| `api/src/agents/agent-router.spec.ts` | Update constructor |
| `api/src/demo/demo.service.ts` | CSS + HTML + JS for blueprint card |
| `docs/proof/serial-15-domain-template-intelligence.md` | This file |

---

## Rollback Plan

1. `git revert HEAD` — removes all SERIAL 15 changes cleanly
2. `RoutingResult` additions are additive — removing them does not break 13/14 consumers
3. `DomainTemplateService` has zero dependencies on other project services — safe to remove from providers
4. The three new controller endpoints can be removed independently without touching existing routes
