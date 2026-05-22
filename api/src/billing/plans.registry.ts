import type { BillingPlanDef, PublicPlanSummary } from './billing.types';

// 19-01 / 19-08: Plan registry — Stripe price IDs kept server-side only
export const BILLING_PLANS: BillingPlanDef[] = [
  {
    id:           'plan_free',
    slug:         'free',
    name:         'Free',
    tier:         'FREE',
    monthlyPrice: 0,
    yearlyPrice:  0,
    currency:     'USD',
    features:     [
      'Up to 3 runtimes',
      '1 active runtime',
      '10 AI generations / day',
      '5 remixes / day',
      'Public previews only',
      'Community & free marketplace packs',
    ],
    limits: {
      runtimes:             3,
      activeRuntimes:       1,
      aiGenerationsPerDay:  10,
      remixPerDay:          5,
      snapshots:            5,
      privatePreview:       false,
      paidMarketplacePacks: false,
      enterprisePacks:      false,
      customBranding:       false,
    },
    active: true,
  },
  {
    id:           'plan_creator',
    slug:         'creator',
    name:         'Creator',
    tier:         'CREATOR',
    monthlyPrice: 1900,
    yearlyPrice:  15900,
    currency:     'USD',
    features:     [
      'Up to 10 runtimes',
      '3 concurrent active runtimes',
      '100 AI generations / day',
      '50 remixes / day',
      'Private previews',
      'Paid marketplace packs',
      'Creator profile badge',
      '25 snapshots per project',
    ],
    limits: {
      runtimes:             10,
      activeRuntimes:       3,
      aiGenerationsPerDay:  100,
      remixPerDay:          50,
      snapshots:            25,
      privatePreview:       true,
      paidMarketplacePacks: true,
      enterprisePacks:      false,
      customBranding:       false,
    },
    active: true,
  },
  {
    id:           'plan_pro',
    slug:         'pro',
    name:         'Pro',
    tier:         'PRO',
    monthlyPrice: 4900,
    yearlyPrice:  39900,
    currency:     'USD',
    features:     [
      'Up to 50 runtimes',
      '10 concurrent active runtimes',
      'Unlimited AI generations',
      'Unlimited remixes',
      'Private previews',
      'All marketplace packs (including enterprise)',
      'Custom branding',
      'Priority build queue',
      '100 snapshots per project',
    ],
    limits: {
      runtimes:             50,
      activeRuntimes:       10,
      aiGenerationsPerDay:  -1,
      remixPerDay:          -1,
      snapshots:            100,
      privatePreview:       true,
      paidMarketplacePacks: true,
      enterprisePacks:      true,
      customBranding:       true,
    },
    active: true,
  },
  {
    id:           'plan_enterprise',
    slug:         'enterprise',
    name:         'Enterprise',
    tier:         'ENTERPRISE',
    monthlyPrice: -1,
    yearlyPrice:  -1,
    currency:     'USD',
    features:     [
      'Unlimited runtimes',
      'Unlimited active runtimes',
      'Unlimited AI generations',
      'Unlimited remixes',
      'All marketplace packs',
      'Custom branding',
      'SLA guarantee',
      'Dedicated support',
      'SSO / SAML',
      'Custom contracts',
    ],
    limits: {
      runtimes:             -1,
      activeRuntimes:       -1,
      aiGenerationsPerDay:  -1,
      remixPerDay:          -1,
      snapshots:            -1,
      privatePreview:       true,
      paidMarketplacePacks: true,
      enterprisePacks:      true,
      customBranding:       true,
    },
    active: true,
  },
];

export function getPlanBySlug(slug: string): BillingPlanDef | undefined {
  return BILLING_PLANS.find((p) => p.slug === slug);
}

export function getPlanByTier(tier: string): BillingPlanDef | undefined {
  return BILLING_PLANS.find((p) => p.tier === tier);
}

// 19-08: Strip internal Stripe fields before sending to clients
export function toPublicSummary(plan: BillingPlanDef): PublicPlanSummary {
  return {
    slug:         plan.slug,
    name:         plan.name,
    tier:         plan.tier,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice:  plan.yearlyPrice,
    currency:     plan.currency,
    features:     plan.features,
    limits:       plan.limits,
  };
}
