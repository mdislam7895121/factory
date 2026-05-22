import { Injectable } from '@nestjs/common';
import { BILLING_PLANS } from './plans.registry';
import type { BillingTier, PlanLimits, QuotaCheckResult } from './billing.types';

// 19-02: Free-vs-paid limits engine — pure in-memory, no external deps

const TIER_ORDER: BillingTier[] = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];

@Injectable()
export class LimitsService {
  // workspaceId -> tier (production: read from WorkspaceSubscription via Prisma)
  private readonly workspaceTiers = new Map<string, BillingTier>();

  // ── Tier management ───────────────────────────────────────────────────────────

  setWorkspaceTier(workspaceId: string, tier: BillingTier): void {
    this.workspaceTiers.set(workspaceId, tier);
  }

  getWorkspaceTier(workspaceId: string): BillingTier {
    return this.workspaceTiers.get(workspaceId) ?? 'FREE';
  }

  getLimits(workspaceId: string): PlanLimits {
    return this.getLimitsByTier(this.getWorkspaceTier(workspaceId));
  }

  getLimitsByTier(tier: BillingTier): PlanLimits {
    const plan = BILLING_PLANS.find((p) => p.tier === tier);
    return plan?.limits ?? BILLING_PLANS[0].limits; // fallback to FREE
  }

  // ── Quota checks ──────────────────────────────────────────────────────────────

  checkRuntimeLimit(workspaceId: string, currentCount: number): QuotaCheckResult {
    const { runtimes } = this.getLimits(workspaceId);
    if (runtimes === -1) return { allowed: true };
    if (currentCount >= runtimes) {
      return {
        allowed:      false,
        quota:        'runtimes',
        reason:       `Runtime limit reached (${currentCount}/${runtimes})`,
        upgradeHint:  this.upgradeHint(workspaceId, 'more runtimes'),
      };
    }
    return { allowed: true };
  }

  checkActiveRuntimeLimit(workspaceId: string, currentActive: number): QuotaCheckResult {
    const { activeRuntimes } = this.getLimits(workspaceId);
    if (activeRuntimes === -1) return { allowed: true };
    if (currentActive >= activeRuntimes) {
      return {
        allowed:     false,
        quota:       'active_runtimes',
        reason:      `Active runtime limit reached (${currentActive}/${activeRuntimes})`,
        upgradeHint: this.upgradeHint(workspaceId, 'more concurrent runtimes'),
      };
    }
    return { allowed: true };
  }

  checkAiGenerationLimit(workspaceId: string, usedToday: number): QuotaCheckResult {
    const { aiGenerationsPerDay } = this.getLimits(workspaceId);
    if (aiGenerationsPerDay === -1) return { allowed: true };
    if (usedToday >= aiGenerationsPerDay) {
      return {
        allowed:     false,
        quota:       'ai_generations',
        reason:      `Daily AI generation limit reached (${usedToday}/${aiGenerationsPerDay})`,
        upgradeHint: this.upgradeHint(workspaceId, 'unlimited AI builds'),
      };
    }
    return { allowed: true };
  }

  checkRemixLimit(workspaceId: string, usedToday: number): QuotaCheckResult {
    const { remixPerDay } = this.getLimits(workspaceId);
    if (remixPerDay === -1) return { allowed: true };
    if (usedToday >= remixPerDay) {
      return {
        allowed:     false,
        quota:       'remix',
        reason:      `Daily remix limit reached (${usedToday}/${remixPerDay})`,
        upgradeHint: this.upgradeHint(workspaceId, 'unlimited remixes'),
      };
    }
    return { allowed: true };
  }

  checkPrivatePreview(workspaceId: string): QuotaCheckResult {
    const { privatePreview } = this.getLimits(workspaceId);
    if (privatePreview) return { allowed: true };
    return {
      allowed:     false,
      quota:       'private_preview',
      reason:      'Private previews require a Creator plan or above',
      upgradeHint: this.upgradeHint(workspaceId, 'private previews'),
    };
  }

  checkMarketplacePackAccess(workspaceId: string, packPricingModel: string): QuotaCheckResult {
    const limits = this.getLimits(workspaceId);
    if (packPricingModel === 'FREE' || packPricingModel === 'FREEMIUM') return { allowed: true };
    if (packPricingModel === 'PAID') {
      if (limits.paidMarketplacePacks) return { allowed: true };
      return {
        allowed:     false,
        quota:       'marketplace_paid_packs',
        reason:      'Paid marketplace packs require a Creator plan or above',
        upgradeHint: this.upgradeHint(workspaceId, 'paid marketplace packs'),
      };
    }
    if (packPricingModel === 'ENTERPRISE') {
      if (limits.enterprisePacks) return { allowed: true };
      return {
        allowed:     false,
        quota:       'marketplace_enterprise_packs',
        reason:      'Enterprise packs require a Pro plan or above',
        upgradeHint: this.upgradeHint(workspaceId, 'enterprise marketplace packs'),
      };
    }
    return { allowed: true };
  }

  checkSnapshotLimit(workspaceId: string, currentCount: number): QuotaCheckResult {
    const { snapshots } = this.getLimits(workspaceId);
    if (snapshots === -1) return { allowed: true };
    if (currentCount >= snapshots) {
      return {
        allowed:     false,
        quota:       'snapshots',
        reason:      `Snapshot limit reached (${currentCount}/${snapshots})`,
        upgradeHint: this.upgradeHint(workspaceId, 'more snapshots'),
      };
    }
    return { allowed: true };
  }

  // ── 19-07: Upgrade hint text ──────────────────────────────────────────────────

  upgradeHint(workspaceId: string, feature: string): string {
    const tier = this.getWorkspaceTier(workspaceId);
    const next = this.nextTier(tier);
    if (!next) return `Contact us to upgrade — ${feature}`;
    const plan = BILLING_PLANS.find((p) => p.tier === next);
    if (!plan) return `Upgrade to unlock ${feature}`;
    const priceStr = plan.monthlyPrice > 0 ? ` ($${(plan.monthlyPrice / 100).toFixed(0)}/mo)` : '';
    return `Upgrade to ${plan.name}${priceStr} to unlock ${feature}`;
  }

  nextTier(current: BillingTier): BillingTier | null {
    const idx = TIER_ORDER.indexOf(current);
    return idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
  }
}
