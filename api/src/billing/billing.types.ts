// 19-01: Billing domain types — no executable code, no secrets

export type BillingTier        = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING' | 'INCOMPLETE';
export type UsageEventType     =
  | 'RUNTIME_CREATED'
  | 'AI_GENERATION'
  | 'PREVIEW_VIEW'
  | 'REMIX'
  | 'PREMIUM_PACK_INSTALL'
  | 'SNAPSHOT_CREATED';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface PlanLimits {
  runtimes:            number;   // -1 = unlimited
  activeRuntimes:      number;
  aiGenerationsPerDay: number;
  remixPerDay:         number;
  snapshots:           number;
  privatePreview:      boolean;
  paidMarketplacePacks:boolean;
  enterprisePacks:     boolean;
  customBranding:      boolean;
}

export interface BillingPlanDef {
  id:           string;
  slug:         string;
  name:         string;
  tier:         BillingTier;
  monthlyPrice: number;  // USD cents; -1 = custom pricing
  yearlyPrice:  number;
  currency:     string;
  features:     string[];
  limits:       PlanLimits;
  // Stripe price IDs — NEVER exposed to clients
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?:  string;
  active:       boolean;
}

export interface QuotaCheckResult {
  allowed:      boolean;
  reason?:      string;
  quota?:       string;
  upgradeHint?: string;
}

export interface UsageEventRecord {
  id:          string;
  workspaceId: string;
  userId?:     string;
  eventType:   UsageEventType;
  quantity:    number;
  metadata?:   Record<string, unknown>;
  createdAt:   Date;
}

export interface WorkspaceSubscriptionData {
  workspaceId:             string;
  userId:                  string;
  planSlug:                string;
  tier:                    BillingTier;
  status:                  SubscriptionStatus;
  providerCustomerId?:     string;
  providerSubscriptionId?: string;
  currentPeriodStart?:     Date;
  currentPeriodEnd?:       Date;
  cancelAtPeriodEnd:       boolean;
}

export interface CheckoutRequest {
  workspaceId:  string;
  userId:       string;
  planSlug:     string;
  billingCycle: BillingCycle;
  successUrl:   string;
  cancelUrl:    string;
}

export interface CheckoutResult {
  checkoutUrl: string | null;
  sessionId?:  string;
  error?:      string;
}

// 19-08: Public-safe plan summary (no Stripe IDs)
export interface PublicPlanSummary {
  slug:         string;
  name:         string;
  tier:         BillingTier;
  monthlyPrice: number;
  yearlyPrice:  number;
  currency:     string;
  features:     string[];
  limits:       PlanLimits;
}
