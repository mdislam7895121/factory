import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';

const REPORT_MAX_PER_IP_HOUR = parseInt(process.env.REPORT_MAX_PER_IP_HOUR ?? '5', 10);
const MAX_REASON_LEN  = 200;
const MAX_MESSAGE_LEN = 1000;
const ALLOWED_REASONS = new Set([
  'spam', 'malware', 'phishing', 'illegal_content', 'harassment',
  'privacy_violation', 'copyright', 'other',
]);

@Injectable()
export class PreviewAbuseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  // 09-07: Store a rate-limited, sanitized abuse report
  async report(opts: {
    previewId: string;
    reason:    string;
    message?:  string;
    ip:        string;
    userId?:   string;
  }): Promise<void> {
    // Rate limit — 5 reports per IP per hour
    const ipHash  = createHash('sha256').update(opts.ip).digest('hex').slice(0, 32);
    const rlKey   = `${this.redis.prefix}:rl:report:${ipHash}`;
    const count   = await this.redis.client.incr(rlKey).catch(() => 0);
    if (count === 1) this.redis.client.pexpire(rlKey, 3_600_000).catch(() => {});
    if (count > REPORT_MAX_PER_IP_HOUR) {
      throw new HttpException({ ok: false, error: 'RATE_LIMITED' }, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Sanitize — restrict to allowlist, truncate lengths
    const reason = ALLOWED_REASONS.has(opts.reason) ? opts.reason : 'other';
    const message = opts.message
      ? opts.message.slice(0, MAX_MESSAGE_LEN).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
      : null;

    await this.prisma.previewAbuseReport.create({
      data: {
        id:        randomUUID(),
        previewId: opts.previewId.slice(0, MAX_REASON_LEN),
        reason,
        message,
        ipHash,
        userId:    opts.userId ?? null,
      },
    });
  }
}
