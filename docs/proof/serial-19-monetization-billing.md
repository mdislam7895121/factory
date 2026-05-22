# Serial 19 — Monetization + Billing Activation

## Status: LOCKED ✅

**Branch:** `claude/code-audit-review-bERxc`
**Scope:** Subscription billing, plan limits engine, usage metering, Stripe integration, marketplace economics, upgrade experience, pricing API, webhook security.

---

## Billing Architecture

```
              ┌─────────────────┐
              │  BillingModule  │
              └────────┬────────┘
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   LimitsService  SubscriptionSvc  UsageMeterSvc
   (tier engine)  (Stripe + plans) (event metering)
         │             │             │
         └──────────── BillingController ──────────┐
                       │                           │
              GET /pricing            POST /v1/billing/*
              (public, no secrets)    (authenticated)
```

---

## Proof Items

### 19-01 — Schema (`prisma/schema.prisma`)
Additive models (no breaking changes):

```
enum SubscriptionStatus { ACTIVE PAST_DUE CANCELED TRIALING INCOMPLETE }
enum BillingTier        { FREE CREATOR PRO ENTERPRISE }
enum UsageEventType     { RUNTIME_CREATED AI_GENERATION PREVIEW_VIEW REMIX PREMIUM_PACK_INSTALL SNAPSHOT_CREATED }

model BillingPlan            — slug (unique), tier, monthlyPrice, yearlyPrice, features[], limits (Json)
model WorkspaceSubscription  — workspaceId (unique), planSlug, tier, providerCustomerId?, providerSubscriptionId?, status
model UsageEvent             — workspaceId, eventType, quantity, metadata (Json?)
model CreditBalance          — workspaceId (unique), creditsRemaining
```

### 19-02 — Plan Registry (`plans.registry.ts`)

| Plan | Tier | Price | Runtimes | Active | AI/day | Remix/day | Private | Paid Packs | Enterprise |
|------|------|-------|----------|--------|--------|-----------|---------|------------|------------|
| Free | FREE | $0 | 3 | 1 | 10 | 5 | ❌ | ❌ | ❌ |
| Creator | CREATOR | $19/mo | 10 | 3 | 100 | 50 | ✅ | ✅ | ❌ |
| Pro | PRO | $49/mo | 50 | 10 | ∞ | ∞ | ✅ | ✅ | ✅ |
| Enterprise | ENTERPRISE | custom | ∞ | ∞ | ∞ | ∞ | ✅ | ✅ | ✅ |

Yearly pricing: Creator $159, Pro $399, Enterprise custom.

`toPublicSummary()` strips `stripePriceIdMonthly` / `stripePriceIdYearly` before any client response.

### 19-02 — Limits Service (`limits.service.ts`)
```
LimitsService (Injectable, in-memory tier registry)
├── setWorkspaceTier(workspaceId, tier) → void
├── getWorkspaceTier(workspaceId)       → BillingTier   (default: FREE)
├── getLimits(workspaceId)              → PlanLimits
├── getLimitsByTier(tier)               → PlanLimits
├── checkRuntimeLimit(ws, count)        → QuotaCheckResult
├── checkActiveRuntimeLimit(ws, active) → QuotaCheckResult
├── checkAiGenerationLimit(ws, today)   → QuotaCheckResult
├── checkRemixLimit(ws, today)          → QuotaCheckResult
├── checkPrivatePreview(ws)             → QuotaCheckResult
├── checkMarketplacePackAccess(ws, model) → QuotaCheckResult
├── checkSnapshotLimit(ws, count)       → QuotaCheckResult
├── upgradeHint(ws, feature)            → string  (e.g. "Upgrade to Creator ($19/mo) to unlock X")
└── nextTier(tier)                      → BillingTier | null
```

`QuotaCheckResult`: `{ allowed, reason?, quota?, upgradeHint? }`

### 19-03 — Stripe Billing (`subscription.service.ts`)
```
SubscriptionService (Injectable)
├── getSubscription(workspaceId)         → WorkspaceSubscriptionData  (default FREE)
├── activatePlan(ws, userId, slug, ...)  → WorkspaceSubscriptionData
├── cancelAtPeriodEnd(ws)                → void
├── createCheckoutSession(req)           → CheckoutResult  (mock URL when Stripe not configured)
├── createPortalSession(ws, returnUrl)   → { portalUrl, error? }
├── verifyWebhookSignature(body, sig)    → boolean  (HMAC-SHA256, constant-time)
├── processWebhookEvent(event)           → { processed, skipped, reason? }
└── hasProcessedWebhook(eventId)         → boolean
```

Stripe events handled:
- `customer.subscription.created` → `activatePlan`
- `customer.subscription.updated` → `activatePlan`
- `customer.subscription.deleted` → downgrade to `free`

### 19-04 — Usage Metering (`usage-meter.service.ts`)
```
UsageMeterService (Injectable)
├── emit(params)                          → UsageEventRecord
├── getDailyCount(ws, eventType, date?)   → number
├── getTotalByType(ws, eventType)         → number
├── getEvents(ws, limit?)                 → UsageEventRecord[]
└── getSummary(ws)                        → Record<UsageEventType, number>
```

Event types: `RUNTIME_CREATED`, `AI_GENERATION`, `PREVIEW_VIEW`, `REMIX`, `PREMIUM_PACK_INSTALL`, `SNAPSHOT_CREATED`

### 19-05 — Marketplace Pack Access (`GET /v1/billing/pack-access`)
Enforces pack pricing restrictions by tier:
- FREE/FREEMIUM packs: always allowed
- PAID packs: require CREATOR+
- ENTERPRISE packs: require PRO+

### 19-06 — Creator Monetization Metadata
- Upgrade hint in creator profile nudge
- Plan tier badge shown in demo reveal
- `GET /v1/billing/upgrade-prompt?workspaceId=&feature=` returns `{ currentTier, nextTier, hint, nextPlan, ctaUrl }`

### 19-07 — Upgrade Experience
- `GET /v1/billing/upgrade-wall?workspaceId=&feature=` renders aspirational HTML upgrade page
- Shows current tier, next plan price, feature list, "View plans →" CTA
- Demo reveal shows `#upgrade-nudge` with dynamic hint fetched from `/v1/billing/upgrade-prompt`

### 19-08 — Pricing API (`GET /pricing`)
Returns all active plans with public-safe fields only:
```json
{ "ok": true, "plans": [{ "slug", "name", "tier", "monthlyPrice", "yearlyPrice", "currency", "features", "limits" }] }
```
**Never exposes**: `stripePriceIdMonthly`, `stripePriceIdYearly`, or any internal fields.

### 19-09 — Billing Safety Layer
| Control | Implementation |
|---------|---------------|
| No duplicate billing | `processedWebhookIds` set — `already_processed` on replay |
| Webhook signature | HMAC-SHA256 `t=timestamp.body` constant-time comparison (`timingSafeEqual`) |
| Missing signature | Webhook returns `{ error: 'invalid_signature' }` — no processing |
| Missing secret | `verifyWebhookSignature` returns `false` |
| Invalid JSON body | Returns `{ error: 'invalid_json' }` |
| Stripe IDs in API response | Controller strips `providerCustomerId`, `providerSubscriptionId` |
| No Stripe configured | Mock checkout URL returned (no error) |
| Unknown plan slug | `BadRequestException` from `activatePlan` |

### 19-10 — Demo Integration (`demo/demo.service.ts`)
- `#upgrade-nudge` section in reveal phase (`.upgrade-nudge` CSS)
- `showUpgradeNudge()` calls `GET /v1/billing/upgrade-prompt` to fetch dynamic hint
- Plan tier badge CSS classes: `.plan-badge.free`, `.creator`, `.pro`, `.enterprise`
- `showCreatorCard()` now calls `showUpgradeNudge()` after creator card is shown

### 19-11 — Tests (`billing/billing.spec.ts`)
```
59 tests / 59 passed — 0 failures

BILLING_PLANS registry (12 tests):
 ├── 4 plans with correct structure and pricing
 ├── getPlanBySlug/getPlanByTier lookups
 ├── toPublicSummary strips Stripe price IDs
 └── FREE/PRO limit assertions

LimitsService (20 tests):
 ├── Default FREE tier for unknown workspace
 ├── Tier setter/getter
 ├── Runtime / active runtime / AI generation / remix limits (FREE blocks correctly)
 ├── Private preview check (FREE blocked, PRO allowed)
 ├── Marketplace pack access (FREE→PAID blocked, CREATOR→PAID allowed, PRO→ENTERPRISE allowed)
 ├── PRO unlimited AI+remix; runtime limit 50; ENTERPRISE all unlimited
 └── Upgrade hint text + nextTier progression

UsageMeterService (8 tests):
 ├── emit returns record with id
 ├── getDailyCount / getTotalByType / getSummary
 ├── quantity > 1 supported
 └── No secrets in emitted records

SubscriptionService (19 tests):
 ├── activatePlan + LimitsService sync
 ├── activatePlan throws for unknown plan
 ├── getSubscription FREE default
 ├── cancelAtPeriodEnd flag
 ├── Checkout: mock URL, free plan error, enterprise error, unknown plan error
 ├── Webhook sig verification: valid, tampered body, wrong secret, malformed, no secret
 ├── Replay protection: duplicate event rejected
 ├── hasProcessedWebhook
 ├── subscription.created webhook activates plan
 └── subscription.deleted webhook downgrades to FREE
```
Run: `npx jest src/billing/billing.spec.ts --no-coverage`

### 19-12 — API Routes Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/pricing` | Public | All active plans (no secrets) |
| POST | `/v1/billing/checkout` | Body | Create Stripe checkout session |
| POST | `/v1/billing/portal` | Body | Create Stripe billing portal |
| POST | `/v1/billing/webhook` | Stripe-Signature header | Stripe webhook (signature verified) |
| GET | `/v1/billing/subscription/:workspaceId` | — | Current plan (provider IDs stripped) |
| GET | `/v1/billing/usage/:workspaceId` | — | Usage stats |
| POST | `/v1/billing/usage/signal` | Body | Emit usage event |
| GET | `/v1/billing/pack-access` | Query | Check marketplace pack access |
| POST | `/v1/billing/activate` | Body | Activate plan (webhook-driven) |
| GET | `/v1/billing/upgrade-prompt` | Query | Upgrade hint JSON |
| GET | `/v1/billing/upgrade-wall` | Query | Upgrade HTML page |

---

## Files Changed

| File | Status |
|------|--------|
| `api/prisma/schema.prisma` | MODIFIED — +4 models, +3 enums |
| `api/src/billing/billing.types.ts` | NEW |
| `api/src/billing/plans.registry.ts` | NEW |
| `api/src/billing/limits.service.ts` | NEW |
| `api/src/billing/usage-meter.service.ts` | NEW |
| `api/src/billing/subscription.service.ts` | NEW |
| `api/src/billing/billing.controller.ts` | NEW |
| `api/src/billing/billing.module.ts` | NEW |
| `api/src/billing/billing.spec.ts` | NEW |
| `api/src/app.module.ts` | MODIFIED — added BillingModule |
| `api/src/demo/demo.service.ts` | MODIFIED — upgrade nudge + plan badge CSS |
| `docs/proof/serial-19-monetization-billing.md` | NEW |

---

## Rollback Plan

All changes are additive:
- Prisma models can be dropped without affecting existing models
- `BillingModule` can be removed from `AppModule.imports` without breakage
- Existing `BillingService` (sandbox credits) and `QuotaService` are untouched
- `#upgrade-nudge` is `display:none` until `showCreatorCard()` is called
- Stripe not configured → mock URLs returned, no real charges possible
