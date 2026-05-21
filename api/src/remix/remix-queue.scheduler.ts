import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';
import { RuntimeStatus } from '../generated/prisma';

const ORCHESTRATOR_URL     = (process.env.ORCHESTRATOR_URL     ?? 'http://localhost:4100').trim();
const ORCHESTRATOR_API_KEY = (process.env.ORCHESTRATOR_API_KEY ?? '').trim();
const QUEUE_INTERVAL_MS    = parseInt(process.env.REMIX_QUEUE_INTERVAL_MS ?? '15000', 10);

interface RemixJob {
  forkId:      string;
  sourceId:    string;
  ownerUserId: string;
  runtimeType: string;
  workspaceId: string | null;
  enqueuedAt:  string;
}

@Injectable()
export class RemixQueueScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RemixQueueScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => { void this.tick(); }, QUEUE_INTERVAL_MS);
    this.timer.unref();
    this.logger.log(`Remix queue scheduler started (interval=${QUEUE_INTERVAL_MS}ms)`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  // 06-06: Dequeue and dispatch a pending remix job
  private async tick() {
    const raw = await this.redis.client
      .rpop(`${this.redis.prefix}:remix:queue`)
      .catch(() => null);
    if (!raw) return;

    let job: RemixJob;
    try {
      job = JSON.parse(raw) as RemixJob;
    } catch {
      this.logger.warn('malformed remix queue job — discarding');
      return;
    }

    // Verify the forked runtime still exists and is PROVISIONING
    const fork = await this.prisma.runtimeInstance.findUnique({
      where: { id: job.forkId },
    });
    if (!fork || fork.status !== RuntimeStatus.PROVISIONING) {
      this.logger.log({ forkId: job.forkId }, 'remix job skipped — runtime not PROVISIONING');
      return;
    }

    // Signal orchestrator to provision the container (best-effort)
    await fetch(`${ORCHESTRATOR_URL}/v1/projects`, {
      method:  'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key':    ORCHESTRATOR_API_KEY,
      },
      body: JSON.stringify({
        id:              job.forkId,
        runtimeType:     job.runtimeType,
        sourceRuntimeId: job.sourceId,
        ownerUserId:     job.ownerUserId,
        workspaceId:     job.workspaceId,
        remix:           true,
      }),
    }).catch((err) => {
      this.logger.warn({ err, forkId: job.forkId }, 'orchestrator remix provision call failed');
    });

    this.logger.log(
      { forkId: job.forkId, sourceId: job.sourceId },
      'remix provision dispatched to orchestrator',
    );
  }
}
