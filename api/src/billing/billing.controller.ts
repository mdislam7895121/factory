import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LimitsService } from './limits.service';
import { SubscriptionService } from './subscription.service';
import { UsageMeterService } from './usage-meter.service';
import { BILLING_PLANS, toPublicSummary } from './plans.registry';
import type { BillingCycle, UsageEventType } from './billing.types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class CheckoutDto {
  @IsString() workspaceId!:  string;
  @IsString() userId!:       string;
  @IsString() planSlug!:     string;
  @IsOptional() @IsString() billingCycle?: BillingCycle;
  @IsOptional() @IsString() successUrl?:  string;
  @IsOptional() @IsString() cancelUrl?:   string;
}

class PortalDto {
  @IsString() workspaceId!: string;
  @IsOptional() @IsString() returnUrl?:   string;
}

class SignalUsageDto {
  @IsString() workspaceId!:  string;
  @IsString() eventType!:    UsageEventType;
  @IsOptional() @IsString() userId?:     string;
  quantity?:  number;
  metadata?:  Record<string, unknown>;
}

class ActivatePlanDto {
  @IsString() workspaceId!: string;
  @IsString() userId!:      string;
  @IsString() planSlug!:    string;
}

// ── XSS escape ───────────────────────────────────────────────────────────────
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

@Controller()
export class BillingController {
  constructor(
    private readonly limits:        LimitsService,
    private readonly subscriptions: SubscriptionService,
    private readonly usage:         UsageMeterService,
  ) {}

  // ── 19-08: Public pricing page ────────────────────────────────────────────────

  @Get('pricing')
  getPricing() {
    // 19-09: Never expose Stripe price IDs or internal fields
    const plans = BILLING_PLANS
      .filter((p) => p.active)
      .map(toPublicSummary);
    return { ok: true, plans };
  }

  // ── 19-03: Checkout session ───────────────────────────────────────────────────

  @Post('v1/billing/checkout')
  @HttpCode(HttpStatus.OK)
  async createCheckout(@Body() dto: CheckoutDto) {
    const base = process.env.WEB_URL ?? 'http://localhost:3000';
    const result = await this.subscriptions.createCheckoutSession({
      workspaceId:  dto.workspaceId,
      userId:       dto.userId,
      planSlug:     dto.planSlug,
      billingCycle: dto.billingCycle ?? 'MONTHLY',
      successUrl:   dto.successUrl ?? `${base}/dashboard/billing`,
      cancelUrl:    dto.cancelUrl  ?? `${base}/pricing`,
    });
    return { ok: !result.error, ...result };
  }

  // ── 19-03: Billing portal ─────────────────────────────────────────────────────

  @Post('v1/billing/portal')
  @HttpCode(HttpStatus.OK)
  async createPortal(@Body() dto: PortalDto) {
    const base     = process.env.WEB_URL ?? 'http://localhost:3000';
    const returnUrl = dto.returnUrl ?? `${base}/dashboard/billing`;
    const result   = await this.subscriptions.createPortalSession(dto.workspaceId, returnUrl);
    return { ok: !result.error, ...result };
  }

  // ── 19-03 / 19-09: Stripe webhook ────────────────────────────────────────────

  @Post('v1/billing/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req()     req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) return { received: false, error: 'missing_body' };

    // 19-09: Mandatory signature verification
    if (sig && !this.subscriptions.verifyWebhookSignature(rawBody, sig)) {
      return { received: false, error: 'invalid_signature' };
    }

    let event: any;
    try {
      event = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return { received: false, error: 'invalid_json' };
    }

    if (!event?.id || !event?.type) {
      return { received: false, error: 'missing_event_fields' };
    }

    const result = this.subscriptions.processWebhookEvent(event);
    return { received: true, ...result };
  }

  // ── 19-08: Subscription query ─────────────────────────────────────────────────

  @Get('v1/billing/subscription/:workspaceId')
  getSubscription(@Param('workspaceId') workspaceId: string) {
    const sub = this.subscriptions.getSubscription(workspaceId);
    // 19-09: Strip Stripe internal IDs from public response
    const { providerCustomerId: _c, providerSubscriptionId: _s, ...safe } = sub;
    return { ok: true, subscription: safe };
  }

  // ── 19-04: Usage stats ────────────────────────────────────────────────────────

  @Get('v1/billing/usage/:workspaceId')
  getUsage(@Param('workspaceId') workspaceId: string) {
    const summary = this.usage.getSummary(workspaceId);
    const today = new Date().toISOString().slice(0, 10);
    return {
      ok: true,
      workspaceId,
      today,
      totalUsage: summary,
      todayAiGenerations: this.usage.getDailyCount(workspaceId, 'AI_GENERATION'),
      todayRemixes:       this.usage.getDailyCount(workspaceId, 'REMIX'),
    };
  }

  // ── 19-04: Emit usage event ───────────────────────────────────────────────────

  @Post('v1/billing/usage/signal')
  @HttpCode(HttpStatus.OK)
  signalUsage(@Body() dto: SignalUsageDto) {
    const record = this.usage.emit({
      workspaceId: dto.workspaceId,
      userId:      dto.userId,
      eventType:   dto.eventType,
      quantity:    dto.quantity,
      metadata:    dto.metadata,
    });
    return { ok: true, id: record.id };
  }

  // ── 19-05: Marketplace pack access check ─────────────────────────────────────

  @Get('v1/billing/pack-access')
  checkPackAccess(
    @Query('workspaceId')    workspaceId:    string,
    @Query('pricingModel')   pricingModel:   string,
  ) {
    const result = this.limits.checkMarketplacePackAccess(workspaceId, pricingModel);
    return { ok: true, ...result };
  }

  // ── 19-04: Activate plan (internal / webhook-driven) ─────────────────────────

  @Post('v1/billing/activate')
  @HttpCode(HttpStatus.OK)
  activatePlan(@Body() dto: ActivatePlanDto) {
    const sub = this.subscriptions.activatePlan(dto.workspaceId, dto.userId, dto.planSlug);
    return { ok: true, tier: sub.tier, planSlug: sub.planSlug };
  }

  // ── 19-07: Upgrade prompt API ─────────────────────────────────────────────────

  @Get('v1/billing/upgrade-prompt')
  getUpgradePrompt(
    @Query('workspaceId') workspaceId: string,
    @Query('feature')     feature:     string,
  ) {
    const tier       = this.limits.getWorkspaceTier(workspaceId);
    const nextTier   = this.limits.nextTier(tier);
    const hint       = this.limits.upgradeHint(workspaceId, feature ?? 'more features');
    const plans      = BILLING_PLANS.filter((p) => p.active).map(toPublicSummary);
    const nextPlan   = plans.find((p) => p.tier === nextTier);
    return {
      ok: true,
      currentTier: tier,
      nextTier,
      hint,
      nextPlan: nextPlan ?? null,
      ctaUrl:   '/pricing',
    };
  }

  // ── 19-07: Upgrade prompt HTML (19-10 demo integration) ──────────────────────

  @Get('v1/billing/upgrade-wall')
  upgradeWall(
    @Query('workspaceId') workspaceId: string,
    @Query('feature')     feature:     string,
    @Res() res: Response,
  ) {
    const tier     = this.limits.getWorkspaceTier(workspaceId);
    const nextTier = this.limits.nextTier(tier);
    const hint     = this.limits.upgradeHint(workspaceId, feature ?? 'this feature');
    const nextPlan = BILLING_PLANS.find((p) => p.tier === nextTier);
    const priceStr = nextPlan && nextPlan.monthlyPrice > 0
      ? `$${(nextPlan.monthlyPrice / 100).toFixed(0)}/mo`
      : 'custom pricing';

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Upgrade — Factory</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  background:#0d0d0d;color:#f5f5f5;min-height:100vh;
  display:flex;align-items:center;justify-content:center;padding:20px}
.card{background:#161616;border:1px solid rgba(128,128,128,.15);border-radius:16px;
  padding:32px 28px;max-width:440px;width:100%;text-align:center}
.icon{font-size:40px;margin-bottom:16px}
h1{font-size:22px;font-weight:800;margin-bottom:8px}
p{color:#888;font-size:14px;line-height:1.6;margin-bottom:20px}
.hint{background:rgba(108,108,255,.08);border:1px solid rgba(108,108,255,.2);
  border-radius:10px;padding:12px 16px;font-size:13px;color:#6c6cff;margin-bottom:20px}
.price{font-size:28px;font-weight:800;color:#f5f5f5;margin-bottom:4px}
.price span{font-size:14px;font-weight:400;color:#888}
.features{list-style:none;text-align:left;margin:14px 0 20px;display:flex;flex-direction:column;gap:6px}
.features li{font-size:13px;color:#888;display:flex;align-items:center;gap:8px}
.features li::before{content:'✓';color:#4caf50;font-weight:700;flex-shrink:0}
.btn-upgrade{display:block;padding:14px 24px;background:#6c6cff;color:#fff;
  border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;
  text-decoration:none;margin-bottom:10px}
.btn-later{font-size:12px;color:#888;background:none;border:none;cursor:pointer;
  text-decoration:underline}
</style></head><body>
<div class="card">
  <div class="icon">🚀</div>
  <h1>Unlock ${esc(feature || 'this feature')}</h1>
  <p>You're on the <strong>${esc(tier)}</strong> plan. ${esc(hint)}</p>
  ${nextPlan ? `
  <div class="hint">${esc(hint)}</div>
  <div class="price">${esc(priceStr)}<span> / month</span></div>
  <ul class="features">
    ${nextPlan.features.slice(0, 5).map((f) => `<li>${esc(f)}</li>`).join('')}
  </ul>
  ` : '<div class="hint">Contact us for Enterprise pricing.</div>'}
  <a href="/pricing" class="btn-upgrade">View plans →</a>
  <button class="btn-later" onclick="history.back()">Maybe later</button>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
}
