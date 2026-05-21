import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { createHash, randomUUID } from 'node:crypto';
import { RuntimeStatus, RuntimeVisibility, SleepState, SnapshotType } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';
import type { SnapshotService } from '../snapshot/snapshot.service';
import type { QuotaService } from '../quota/quota.service';
import type { KillSwitchService } from '../kill-switch/kill-switch.service';

const ORCHESTRATOR_URL     = (process.env.ORCHESTRATOR_URL     ?? 'http://localhost:4100').trim();
const ORCHESTRATOR_API_KEY = (process.env.ORCHESTRATOR_API_KEY ?? '').trim();
const MAX_PER_USER_HOUR    = parseInt(process.env.REMIX_MAX_PER_HOUR    ?? '10', 10);
const MAX_PER_IP_HOUR      = parseInt(process.env.REMIX_MAX_IP_PER_HOUR ?? '20', 10);

// 06-04: Keys that must never be cloned
const SECRET_KEY_RE = /secret|token|key|password|credential|auth|private|api_?key/i;

@Injectable()
export class RemixService {
  private readonly logger = new Logger(RemixService.name);

  constructor(
    private readonly prisma:      PrismaService,
    private readonly redis:       RedisService,
    @Optional() private readonly snapshots?:  SnapshotService,
    @Optional() private readonly quota?:      QuotaService,
    @Optional() private readonly killSwitch?: KillSwitchService,
  ) {}

  // ── 06-02: Core remix operation ───────────────────────────────────────────

  async remix(opts: {
    sourceId:    string;
    ownerUserId: string;
    remixPrompt?: string;
    ip:          string;
    visibility?: RuntimeVisibility;
    password?:   string;
  }) {
    const source = await this.prisma.runtimeInstance.findUnique({
      where: { id: opts.sourceId },
    });
    if (!source || source.status === RuntimeStatus.TERMINATED) {
      throw new NotFoundException('source runtime not found');
    }

    // 10-04: Kill switch check
    await this.killSwitch?.assertNotBlocked('remix', 'Remix is temporarily disabled.');
    // 10-03: Quota check
    await this.quota?.checkRemixQuota(opts.ownerUserId);

    // 06-07: Validate remix is allowed
    await this.assertRemixAllowed(source, opts.ownerUserId, opts.password);

    // 06-08: Rate limit check
    await this.checkRateLimits(opts.ownerUserId, opts.ip);

    // 08-05: PRE_REMIX snapshot — capture source state before fork; blocks if it fails
    if (this.snapshots) {
      await this.snapshots.createSnapshot({
        runtimeId:    source.id,
        projectId:    source.projectId ?? undefined,
        ownerUserId:  source.ownerUserId,
        reason:       `pre-remix by ${opts.ownerUserId}`,
        snapshotType: SnapshotType.PRE_REMIX,
      });
    }

    // 06-04: Clone metadata (secrets stripped)
    const safeMeta = this.cloneSafeMetadata(source.metadata);
    const meta = safeMeta ? (JSON.parse(safeMeta) as Record<string, unknown>) : {};
    meta['remixOf'] = source.id;
    meta['remixAt'] = new Date().toISOString();
    if (opts.remixPrompt) meta['remixPrompt'] = opts.remixPrompt;

    // 06-05: Create forked RuntimeInstance
    const forkId    = randomUUID();
    const previewUrl = this.buildPreviewUrl(forkId);

    const fork = await this.prisma.runtimeInstance.create({
      data: {
        id:          forkId,
        ownerUserId: opts.ownerUserId,
        projectId:   null,             // assigned after orchestrator provisions
        workspaceId: source.workspaceId,
        runtimeType: source.runtimeType,
        visibility:  opts.visibility ?? RuntimeVisibility.PRIVATE,
        previewUrl,
        status:     RuntimeStatus.PROVISIONING,
        sleepState: SleepState.AWAKE,
        allowRemix: false,             // forks default to non-remixable
        sourceId:   source.id,
        remixNote:  opts.remixPrompt ?? null,
        metadata:   JSON.stringify(meta),
      },
    });

    // 06-05: Create new PreviewRoute with unique slug
    const slug  = `remix-${forkId.split('-')[0]}`;
    const route = await this.prisma.previewRoute.create({
      data: { runtimeId: forkId, slug, visibility: fork.visibility },
    }).catch(() => null);

    // 06-01: Record fork ancestry
    const ancestry = await this.prisma.projectFork.create({
      data: {
        id:                 randomUUID(),
        sourceRuntimeId:    source.id,
        forkRuntimeId:      forkId,
        sourceProjectId:    source.projectId,
        forkPreviewRouteId: route?.id ?? null,
        ownerUserId:        opts.ownerUserId,
        remixPrompt:        opts.remixPrompt ?? null,
        visibility:         fork.visibility,
      },
    });

    // 06-06: Enqueue async runtime provision
    const job = JSON.stringify({
      forkId,
      sourceId:    source.id,
      ownerUserId: opts.ownerUserId,
      runtimeType: source.runtimeType,
      workspaceId: source.workspaceId,
      enqueuedAt:  new Date().toISOString(),
    });
    await this.redis.client
      .lpush(`${this.redis.prefix}:remix:queue`, job)
      .catch(() => {});

    // 06-09: Log remix activity in ancestry table (already persisted above)
    this.logger.log(
      { forkId, sourceId: source.id, ownerUserId: opts.ownerUserId },
      'remix enqueued',
    );

    return {
      forkId,
      previewUrl:    fork.previewUrl,
      status:        fork.status,
      slug,
      ancestryId:    ancestry.id,
      sourceRuntimeId: source.id,
    };
  }

  // ── 06-07: Toggle remix permission ───────────────────────────────────────

  async setAllowRemix(runtimeId: string, requesterId: string, allow: boolean) {
    const runtime = await this.prisma.runtimeInstance.findUnique({
      where: { id: runtimeId },
    });
    if (!runtime) throw new NotFoundException('runtime not found');
    if (runtime.ownerUserId !== requesterId) throw new ForbiddenException('access denied');
    return this.prisma.runtimeInstance.update({
      where: { id: runtimeId },
      data:  { allowRemix: allow },
      select: { id: true, allowRemix: true, visibility: true },
    });
  }

  // ── 06-03: Lineage queries ────────────────────────────────────────────────

  async getLineage(runtimeId: string) {
    return this.prisma.projectFork.findMany({
      where: {
        OR: [{ sourceRuntimeId: runtimeId }, { forkRuntimeId: runtimeId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 06-09: Activity feed — recent remixes by user
  async getActivity(ownerUserId: string, limit = 20) {
    return this.prisma.projectFork.findMany({
      where:   { ownerUserId },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  // 06-07: Enforce remix visibility rules
  private async assertRemixAllowed(
    source:       { ownerUserId: string; allowRemix: boolean; visibility: RuntimeVisibility; passwordHash: string | null },
    requesterId:  string,
    password?:    string,
  ): Promise<void> {
    // Owner can always remix their own runtime
    if (source.ownerUserId === requesterId) return;

    if (!source.allowRemix) {
      throw new ForbiddenException('remix is not enabled for this runtime');
    }

    switch (source.visibility) {
      case RuntimeVisibility.PRIVATE:
      case RuntimeVisibility.TEAM:
        // allowRemix=true doesn't override PRIVATE/TEAM for non-owners
        throw new ForbiddenException('runtime is private');

      case RuntimeVisibility.PASSWORD:
        if (!password || !source.passwordHash) {
          throw new ForbiddenException('password required to remix');
        }
        if (!(await compare(password, source.passwordHash))) {
          throw new ForbiddenException('invalid password');
        }
        break;

      case RuntimeVisibility.PUBLIC:
        // PUBLIC + allowRemix = open remix
        break;
    }
  }

  // 06-08: Redis-backed rate limiting
  private async checkRateLimits(userId: string, ip: string): Promise<void> {
    const prefix    = this.redis.prefix;
    const windowMs  = 60 * 60 * 1000;
    const ipHash    = createHash('sha256').update(ip).digest('hex').slice(0, 16);
    const userKey   = `${prefix}:rl:remix:user:${userId}`;
    const ipKey     = `${prefix}:rl:remix:ip:${ipHash}`;

    const results = await this.redis.client.pipeline()
      .incr(userKey)
      .incr(ipKey)
      .exec()
      .catch(() => null);

    const userCount = (results?.[0]?.[1] as number) ?? 0;
    const ipCount   = (results?.[1]?.[1] as number) ?? 0;

    if (userCount === 1) this.redis.client.pexpire(userKey, windowMs).catch(() => {});
    if (ipCount   === 1) this.redis.client.pexpire(ipKey,   windowMs).catch(() => {});

    if (userCount > MAX_PER_USER_HOUR || ipCount > MAX_PER_IP_HOUR) {
      throw new HttpException(
        { ok: false, error: 'RATE_LIMITED', message: 'remix rate limit exceeded' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  // 06-04: Strip secret-looking keys from metadata JSON
  private cloneSafeMetadata(metadata: string | null): string | null {
    if (!metadata) return null;
    try {
      const parsed = JSON.parse(metadata) as Record<string, unknown>;
      const safe: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (!SECRET_KEY_RE.test(k)) safe[k] = v;
      }
      return JSON.stringify(safe);
    } catch {
      return null;
    }
  }

  private buildPreviewUrl(runtimeId: string): string {
    const base = (process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    return `${base}/p/${runtimeId}`;
  }

  // Expose IP extraction for controller
  extractIp(req: { headers: Record<string, string | string[] | undefined>; ip?: string; socket?: { remoteAddress?: string } }): string {
    const forwarded = req.headers['x-forwarded-for'];
    return (
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown'
    ).trim();
  }
}
