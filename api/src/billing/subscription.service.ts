import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { LimitsService } from './limits.service';
import { getPlanBySlug } from './plans.registry';
import type {
  BillingTier,
  CheckoutRequest,
  CheckoutResult,
  SubscriptionStatus,
  WorkspaceSubscriptionData,
} from './billing.types';

// 19-09: Idempotent webhook event processing

@Injectable()
export class SubscriptionService {
  // workspaceId -> subscription (production: reads/writes WorkspaceSubscription via Prisma)
  private readonly subscriptions = new Map<string, WorkspaceSubscriptionData>();
  // 19-09: Per-instance replay protection (production: Redis key `billing:webhook:{id}`)
  private readonly processedWebhookIds = new Set<string>();

  private readonly stripe: any | null;
  private readonly webhookSecret: string | null;

  constructor(private readonly limits: LimitsService) {
    this.webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? '').trim() || null;
    const key = (process.env.STRIPE_SECRET_KEY ?? '').trim();
    if (key) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const StripeConstructor = require('stripe');
        const Ctor = StripeConstructor.default ?? StripeConstructor;
        this.stripe = new Ctor(key, { apiVersion: '2026-04-22.dahlia' });
      } catch { this.stripe = null; }
    } else {
      this.stripe = null;
    }
  }

  // ── Subscription management ───────────────────────────────────────────────────

  getSubscription(workspaceId: string): WorkspaceSubscriptionData {
    return this.subscriptions.get(workspaceId) ?? this.defaultFreePlan(workspaceId);
  }

  activatePlan(
    workspaceId: string,
    userId: string,
    planSlug: string,
    providerData?: {
      customerId?:     string;
      subscriptionId?: string;
      status?:         SubscriptionStatus;
      periodStart?:    Date;
      periodEnd?:      Date;
    },
  ): WorkspaceSubscriptionData {
    const plan = getPlanBySlug(planSlug);
    if (!plan) throw new BadRequestException(`Unknown billing plan: '${planSlug}'`);

    const sub: WorkspaceSubscriptionData = {
      workspaceId,
      userId,
      planSlug,
      tier:                    plan.tier,
      status:                  providerData?.status ?? 'ACTIVE',
      providerCustomerId:      providerData?.customerId,
      providerSubscriptionId:  providerData?.subscriptionId,
      currentPeriodStart:      providerData?.periodStart,
      currentPeriodEnd:        providerData?.periodEnd,
      cancelAtPeriodEnd:       false,
    };

    this.subscriptions.set(workspaceId, sub);
    this.limits.setWorkspaceTier(workspaceId, plan.tier);
    return sub;
  }

  cancelAtPeriodEnd(workspaceId: string): void {
    const sub = this.subscriptions.get(workspaceId);
    if (sub) {
      sub.cancelAtPeriodEnd = true;
      this.subscriptions.set(workspaceId, sub);
    }
  }

  // ── 19-03: Stripe checkout ────────────────────────────────────────────────────

  async createCheckoutSession(req: CheckoutRequest): Promise<CheckoutResult> {
    const plan = getPlanBySlug(req.planSlug);
    if (!plan) return { checkoutUrl: null, error: `Unknown plan: '${req.planSlug}'` };
    if (plan.monthlyPrice === 0) {
      return { checkoutUrl: null, error: 'Cannot checkout free plan' };
    }
    if (plan.monthlyPrice === -1) {
      return {
        checkoutUrl: null,
        error: 'Enterprise plan requires direct contact — see /pricing#enterprise',
      };
    }

    if (!this.stripe) {
      // Dev/test mode — return mock checkout URL, no real Stripe call
      const mockId = `cs_test_mock_${randomUUID().slice(0, 8)}`;
      return {
        checkoutUrl: `${req.successUrl}?session=${mockId}&plan=${plan.slug}`,
        sessionId:   mockId,
      };
    }

    const priceId = req.billingCycle === 'YEARLY'
      ? plan.stripePriceIdYearly
      : plan.stripePriceIdMonthly;

    try {
      const lineItem = priceId
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency:  'usd',
              unit_amount: req.billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice,
              recurring: { interval: req.billingCycle === 'YEARLY' ? 'year' : 'month' },
              product_data: { name: `Factory ${plan.name}` },
            },
            quantity: 1,
          };

      const session = await this.stripe.checkout.sessions.create({
        mode:                  'subscription',
        metadata:              { workspaceId: req.workspaceId, userId: req.userId, planSlug: plan.slug },
        line_items:            [lineItem],
        success_url:           `${req.successUrl}?session={CHECKOUT_SESSION_ID}`,
        cancel_url:            req.cancelUrl,
        allow_promotion_codes: true,
      });
      return { checkoutUrl: (session as any).url, sessionId: (session as any).id };
    } catch (err: any) {
      return { checkoutUrl: null, error: err?.message ?? 'Stripe checkout error' };
    }
  }

  // ── 19-03: Stripe billing portal ─────────────────────────────────────────────

  async createPortalSession(
    workspaceId: string,
    returnUrl: string,
  ): Promise<{ portalUrl: string | null; error?: string }> {
    if (!this.stripe) {
      return { portalUrl: `${returnUrl}?mock_portal=1` };
    }
    const sub = this.subscriptions.get(workspaceId);
    if (!sub?.providerCustomerId) {
      return { portalUrl: null, error: 'No billing customer found for this workspace' };
    }
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer:   sub.providerCustomerId,
        return_url: returnUrl,
      });
      return { portalUrl: (session as any).url };
    } catch (err: any) {
      return { portalUrl: null, error: err?.message ?? 'Stripe portal error' };
    }
  }

  // ── 19-09: Webhook signature verification ─────────────────────────────────────

  verifyWebhookSignature(rawBody: Buffer | string, signature: string, secretOverride?: string): boolean {
    const secret = secretOverride ?? this.webhookSecret;
    if (!secret) return false;

    // Stripe signature format: `t=<timestamp>,v1=<hmac>[,v0=<legacy>]`
    const parts  = signature.split(',');
    const tPart  = parts.find((p) => p.startsWith('t='));
    const v1Part = parts.find((p) => p.startsWith('v1='));
    if (!tPart || !v1Part) return false;

    const timestamp   = tPart.slice(2);
    const receivedSig = v1Part.slice(3);
    const body        = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const payload     = `${timestamp}.${body}`;
    const expected    = createHmac('sha256', secret).update(payload).digest('hex');

    // 19-09: Constant-time comparison — prevents timing-based signature oracle attacks
    try {
      return timingSafeEqual(
        Buffer.from(expected,    'hex'),
        Buffer.from(receivedSig, 'hex'),
      );
    } catch {
      return false;
    }
  }

  // ── 19-09: Idempotent webhook processing ──────────────────────────────────────

  processWebhookEvent(event: {
    id:   string;
    type: string;
    data: { object: any };
  }): { processed: boolean; skipped: boolean; reason?: string } {
    // 19-09: Replay protection
    if (this.processedWebhookIds.has(event.id)) {
      return { processed: false, skipped: true, reason: 'already_processed' };
    }
    this.processedWebhookIds.add(event.id);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub  = event.data.object;
        const meta = sub.metadata ?? {};
        if (meta.workspaceId) {
          this.activatePlan(meta.workspaceId, meta.userId ?? '', meta.planSlug ?? 'free', {
            customerId:     sub.customer,
            subscriptionId: sub.id,
            status:         this.mapStripeStatus(sub.status),
            periodStart:    sub.current_period_start ? new Date(sub.current_period_start * 1000) : undefined,
            periodEnd:      sub.current_period_end   ? new Date(sub.current_period_end   * 1000) : undefined,
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        if (sub.metadata?.workspaceId) {
          this.activatePlan(sub.metadata.workspaceId, sub.metadata?.userId ?? '', 'free', {
            status: 'CANCELED',
          });
        }
        break;
      }
      default:
        // Unhandled events are acknowledged but not acted on
        break;
    }

    return { processed: true, skipped: false };
  }

  hasProcessedWebhook(eventId: string): boolean {
    return this.processedWebhookIds.has(eventId);
  }

  // ── Private helpers ───────────────────────────────────────────────────────────

  private mapStripeStatus(s: string): SubscriptionStatus {
    const map: Record<string, SubscriptionStatus> = {
      active:     'ACTIVE',
      past_due:   'PAST_DUE',
      canceled:   'CANCELED',
      trialing:   'TRIALING',
      incomplete: 'INCOMPLETE',
    };
    return map[s] ?? 'ACTIVE';
  }

  private defaultFreePlan(workspaceId: string): WorkspaceSubscriptionData {
    return {
      workspaceId,
      userId:            '',
      planSlug:          'free',
      tier:              'FREE',
      status:            'ACTIVE',
      cancelAtPeriodEnd: false,
    };
  }
}
