import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RuntimeStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';

// 10-03: Per-user free-tier quota defaults
const MAX_RUNTIMES_PER_USER   = parseInt(process.env.QUOTA_MAX_RUNTIMES_PER_USER   ?? '5',  10);
const MAX_ACTIVE_PER_USER     = parseInt(process.env.QUOTA_MAX_ACTIVE_RUNTIMES     ?? '2',  10);
const MAX_REMIX_PER_DAY       = parseInt(process.env.QUOTA_MAX_REMIX_PER_DAY       ?? '20', 10);
const MAX_SNAPSHOTS_PER_PROJ  = parseInt(process.env.SNAPSHOT_MAX_PER_PROJECT      ?? '25', 10);

@Injectable()
export class QuotaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  // 10-03: Check before creating a new runtime
  async checkRuntimeQuota(ownerUserId: string): Promise<void> {
    const total = await this.prisma.runtimeInstance.count({
      where: { ownerUserId, status: { not: RuntimeStatus.TERMINATED } },
    });
    if (total >= MAX_RUNTIMES_PER_USER) {
      throw new HttpException(
        { ok: false, error: 'QUOTA_EXCEEDED', message: `runtime limit is ${MAX_RUNTIMES_PER_USER} per user`, quota: 'runtimes' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const active = await this.prisma.runtimeInstance.count({
      where: { ownerUserId, status: RuntimeStatus.RUNNING },
    });
    if (active >= MAX_ACTIVE_PER_USER) {
      throw new HttpException(
        { ok: false, error: 'QUOTA_EXCEEDED', message: `concurrent active runtime limit is ${MAX_ACTIVE_PER_USER}`, quota: 'active_runtimes' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // 10-03: Check before a remix operation (daily Redis counter)
  async checkRemixQuota(ownerUserId: string): Promise<void> {
    const today   = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const key     = `${this.redis.prefix}:quota:remix:${ownerUserId}:${today}`;
    const count   = await this.redis.client.incr(key).catch(() => 0);
    if (count === 1) this.redis.client.expire(key, 86_400).catch(() => {}); // expire at end of day

    if (count > MAX_REMIX_PER_DAY) {
      throw new HttpException(
        { ok: false, error: 'QUOTA_EXCEEDED', message: `remix limit is ${MAX_REMIX_PER_DAY} per day`, quota: 'remix_daily' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // 10-03: Check before creating a snapshot
  async checkSnapshotQuota(projectId: string): Promise<void> {
    const count = await this.prisma.projectSnapshot.count({
      where: { projectId, status: 'READY' },
    });
    if (count >= MAX_SNAPSHOTS_PER_PROJ) {
      throw new HttpException(
        { ok: false, error: 'QUOTA_EXCEEDED', message: `snapshot limit is ${MAX_SNAPSHOTS_PER_PROJ} per project`, quota: 'snapshots' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // Get current quota usage summary for a user
  async getUsage(ownerUserId: string): Promise<Record<string, number | string>> {
    const [total, active] = await Promise.all([
      this.prisma.runtimeInstance.count({ where: { ownerUserId, status: { not: RuntimeStatus.TERMINATED } } }),
      this.prisma.runtimeInstance.count({ where: { ownerUserId, status: RuntimeStatus.RUNNING } }),
    ]);
    const today   = new Date().toISOString().slice(0, 10);
    const remixKey = `${this.redis.prefix}:quota:remix:${ownerUserId}:${today}`;
    const remixToday = parseInt((await this.redis.client.get(remixKey).catch(() => '0')) ?? '0', 10);

    return {
      runtimes:          `${total}/${MAX_RUNTIMES_PER_USER}`,
      active_runtimes:   `${active}/${MAX_ACTIVE_PER_USER}`,
      remix_today:       `${remixToday}/${MAX_REMIX_PER_DAY}`,
    };
  }
}
