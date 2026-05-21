import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

const ALLOWED_TOP_UPS = [5, 10, 25, 50, 100] as const;
type TopUpAmount = typeof ALLOWED_TOP_UPS[number];

@Injectable()
export class BillingService {
  // Using any to avoid CJS/ESM interop issues with Stripe types under module:nodenext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly stripe: any | null;
  private readonly webhookSecret: string | null;

  constructor() {
    const key = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (key) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const StripeConstructor = require('stripe');
      const Ctor = StripeConstructor.default ?? StripeConstructor;
      this.stripe = new Ctor(key, { apiVersion: '2026-04-22.dahlia' });
    } else {
      this.stripe = null;
    }
    this.webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim() || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private requireStripe(): any {
    if (!this.stripe) {
      throw new InternalServerErrorException('Billing is not configured');
    }
    return this.stripe;
  }

  async createCheckoutSession(userId: string, topUpUsd: number) {
    const stripe = this.requireStripe();

    if (!ALLOWED_TOP_UPS.includes(topUpUsd as TopUpAmount)) {
      throw new BadRequestException(
        `Invalid top-up amount. Allowed: ${ALLOWED_TOP_UPS.join(', ')} USD`,
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: { userId, topUpUsd: String(topUpUsd) },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: topUpUsd * 100,
            product_data: {
              name: `Perpetual Sandbox Credits — $${topUpUsd}`,
              description: `${Math.round(topUpUsd / 0.001).toLocaleString()} sandbox-seconds at $0.001/s`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL || 'http://localhost:3000'}/dashboard/billing?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL || 'http://localhost:3000'}/dashboard/billing`,
    });

    return { checkout_url: (session as { url: string | null }).url };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const stripe = this.requireStripe();

    if (!this.webhookSecret) {
      throw new InternalServerErrorException('Webhook secret not configured');
    }

    let event: { type: string; data: { object: { metadata?: Record<string, string> } } };
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const meta = event.data.object.metadata ?? {};
      const userId = meta.userId;
      const topUpUsd = parseFloat(meta.topUpUsd ?? '0');
      if (userId && topUpUsd > 0) {
        // Task 26: credit user account — placeholder until CreditLedger model is added
        console.log(`[billing] credited $${topUpUsd} to user ${userId}`);
      }
    }
  }
}
