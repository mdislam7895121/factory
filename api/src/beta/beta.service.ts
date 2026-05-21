import { ForbiddenException, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { RedisService } from '../lib/redis/redis.service';

export type BetaMode = 'open' | 'invite' | 'waitlist' | 'closed';

@Injectable()
export class BetaService {
  constructor(private readonly redis: RedisService) {}

  getMode(): BetaMode {
    if ((process.env.INVITE_ONLY ?? '').toLowerCase() === 'true') return 'invite';
    const mode = (process.env.BETA_MODE ?? 'open').toLowerCase() as BetaMode;
    return ['open', 'invite', 'waitlist', 'closed'].includes(mode) ? mode : 'open';
  }

  isPublicSignupEnabled(): boolean {
    const explicit = process.env.PUBLIC_SIGNUP_ENABLED;
    if (explicit !== undefined) return explicit.toLowerCase() !== 'false';
    return this.getMode() === 'open';
  }

  // 10-08: Validate access — throws ForbiddenException if blocked
  async validateAccess(inviteCode?: string): Promise<void> {
    const mode = this.getMode();

    if (mode === 'closed') {
      throw new ForbiddenException({ ok: false, error: 'BETA_CLOSED', message: 'This platform is not currently accepting new users.' });
    }
    if (mode === 'waitlist') {
      throw new ForbiddenException({ ok: false, error: 'WAITLIST', message: 'You are on the waitlist. Access is granted in batches.' });
    }
    if (mode === 'invite') {
      if (!inviteCode) {
        throw new ForbiddenException({ ok: false, error: 'INVITE_REQUIRED', message: 'An invite code is required to access the beta.' });
      }
      const valid = await this.validateInviteCode(inviteCode);
      if (!valid) {
        throw new ForbiddenException({ ok: false, error: 'INVALID_INVITE', message: 'This invite code is invalid or already used.' });
      }
    }
    // mode === 'open' → allow
  }

  async addInviteCode(code: string): Promise<void> {
    const hash = createHash('sha256').update(code.trim()).digest('hex');
    await this.redis.client.sadd(`${this.redis.prefix}:beta:invites`, hash);
  }

  async revokeInviteCode(code: string): Promise<void> {
    const hash = createHash('sha256').update(code.trim()).digest('hex');
    await this.redis.client.srem(`${this.redis.prefix}:beta:invites`, hash);
  }

  async validateInviteCode(code: string): Promise<boolean> {
    const hash = createHash('sha256').update(code.trim()).digest('hex');
    const exists = await this.redis.client.sismember(`${this.redis.prefix}:beta:invites`, hash);
    return exists === 1;
  }

  // Generate a new invite code, store it, and return it (plain text — show once)
  async generateInviteCode(): Promise<string> {
    const code = randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
    await this.addInviteCode(code);
    return code;
  }

  getStatus() {
    return {
      mode:                this.getMode(),
      publicSignupEnabled: this.isPublicSignupEnabled(),
    };
  }
}
