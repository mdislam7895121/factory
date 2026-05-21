import {
  Injectable, NotFoundException, BadRequestException,
  OnModuleInit, OnModuleDestroy,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { MemoryService } from '../memory.service';
import { RedisService } from '../../lib/redis/redis.service';

const MODEL = 'claude-haiku-4-5-20251001'; // fast + cheap for monitoring
const MAX_TOKENS = 1024;
const TICK_INTERVAL_MS = 60_000; // check every 60 s which loops are due
const MIN_INTERVAL_SECS = 300;   // 5 minutes minimum
const MAX_INTERVAL_SECS = 86_400; // 24 hours maximum

const MONITOR_PROMPT = `You are the Monitor agent in a Perpetual Software Engine.
Your job: inspect the system state snapshot and identify real problems.

Output ONLY valid JSON matching this shape:
{
  "healthy": true|false,
  "issues": [
    { "severity": "critical|high|medium|low", "title": "...", "detail": "...", "auto_fixable": true|false }
  ],
  "summary": "one-sentence summary"
}

Rules:
- Only report genuine problems — not hypotheticals
- auto_fixable=true only if the fix is safe and reversible
- If healthy, issues array must be empty`;

const HEALER_PROMPT = `You are the Healer agent in a Perpetual Software Engine.
You receive a list of issues detected by the Monitor agent.

Output ONLY valid JSON matching this shape:
{
  "actions": [
    { "issue_title": "...", "action": "describe exactly what was done", "fixed": true|false, "reason": "..." }
  ],
  "summary": "one-sentence summary of what was healed"
}

Rules:
- Only claim fixed=true for issues you can actually resolve given the context
- Be specific about what action was taken
- Never invent fixes — if you cannot fix it, set fixed=false and explain why`;

interface MonitorOutput {
  healthy: boolean;
  issues: { severity: string; title: string; detail: string; auto_fixable: boolean }[];
  summary: string;
}

interface HealerOutput {
  actions: { issue_title: string; action: string; fixed: boolean; reason: string }[];
  summary: string;
}

@Injectable()
export class LoopService implements OnModuleInit, OnModuleDestroy {
  private anthropic!: Anthropic;
  private ticker: ReturnType<typeof setInterval> | null = null;
  private runningLoops = new Set<string>();

  // Lua script: delete key only if its value matches instanceId (atomic check-and-delete)
  private static readonly RELEASE_LOCK_LUA =
    `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly memory: MemoryService,
    private readonly redis: RedisService,
  ) {}

  onModuleInit() {
    const key = (process.env.ANTHROPIC_API_KEY || '').trim();
    this.anthropic = new Anthropic({ apiKey: key || 'not-configured' });

    this.ticker = setInterval(() => { void this.tick(); }, TICK_INTERVAL_MS);
    this.ticker.unref();
  }

  onModuleDestroy() {
    if (this.ticker) clearInterval(this.ticker);
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────

  async create(
    userId: string,
    name: string,
    description: string | undefined,
    intervalSecs: number,
    context: Record<string, unknown> | undefined,
    webhookUrl: string | undefined,
  ) {
    if (intervalSecs < MIN_INTERVAL_SECS || intervalSecs > MAX_INTERVAL_SECS) {
      throw new BadRequestException(
        `interval_secs must be between ${MIN_INTERVAL_SECS} and ${MAX_INTERVAL_SECS}`,
      );
    }
    if (webhookUrl) this.validateWebhookUrl(webhookUrl);

    const nextRunAt = new Date(Date.now() + intervalSecs * 1000);

    const loop = await this.prisma.loopConfig.create({
      data: {
        userId,
        name,
        description,
        intervalSecs,
        context: context ? JSON.stringify(context) : null,
        webhookUrl,
        nextRunAt,
      },
    });

    return this.formatConfig(loop);
  }

  async list(userId: string) {
    const loops = await this.prisma.loopConfig.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return loops.map((l) => this.formatConfig(l));
  }

  async get(loopId: string, userId: string) {
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId } });
    if (!loop) throw new NotFoundException('Loop not found');
    return this.formatConfig(loop);
  }

  async pause(loopId: string, userId: string) {
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId } });
    if (!loop) throw new NotFoundException('Loop not found');
    await this.prisma.loopConfig.update({ where: { id: loopId }, data: { isActive: false } });
    return { loop_id: loopId, status: 'paused' };
  }

  async resume(loopId: string, userId: string) {
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId } });
    if (!loop) throw new NotFoundException('Loop not found');
    const nextRunAt = new Date(Date.now() + loop.intervalSecs * 1000);
    await this.prisma.loopConfig.update({ where: { id: loopId }, data: { isActive: true, nextRunAt } });
    return { loop_id: loopId, status: 'active', next_run_at: nextRunAt };
  }

  async delete(loopId: string, userId: string) {
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId } });
    if (!loop) throw new NotFoundException('Loop not found');
    await this.prisma.loopConfig.delete({ where: { id: loopId } });
    return { deleted: true };
  }

  async triggerNow(loopId: string, userId: string) {
    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      throw new BadRequestException('ANTHROPIC_API_KEY is not configured');
    }
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId } });
    if (!loop) throw new NotFoundException('Loop not found');

    const run = await this.prisma.loopRun.create({
      data: { loopId, status: 'RUNNING' },
    });

    void this.executeRun(loop, run.id).catch(() => {});
    return { run_id: run.id, loop_id: loopId, status: 'running' };
  }

  async getRuns(loopId: string, userId: string, limit = 20) {
    const loop = await this.prisma.loopConfig.findFirst({ where: { id: loopId, userId }, select: { id: true } });
    if (!loop) throw new NotFoundException('Loop not found');

    const runs = await this.prisma.loopRun.findMany({
      where: { loopId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });

    return runs.map((r) => ({
      run_id: r.id,
      loop_id: loopId,
      status: r.status.toLowerCase(),
      issues_found: r.issuesFound,
      issues_fixed: r.issuesFixed,
      monitor_summary: r.monitorOutput
        ? (JSON.parse(r.monitorOutput) as MonitorOutput).summary
        : null,
      healer_summary: r.healerOutput
        ? (JSON.parse(r.healerOutput) as HealerOutput).summary
        : null,
      created_at: r.createdAt,
      completed_at: r.completedAt,
    }));
  }

  // ── Tick — runs every 60 s, dispatches due loops ──────────────────────
  // Redis distributed lock prevents duplicate execution across instances.

  private async tick() {
    const lockKey = 'loop:tick:lock';
    const lockTtl = parseInt(process.env.LOOP_LOCK_TTL_SEC ?? '120', 10);
    const instanceId = `${process.env.INSTANCE_ID ?? process.pid}`;

    const acquired = await this.redis.client
      .set(lockKey, instanceId, 'EX', lockTtl, 'NX')
      .catch(() => null);

    if (!acquired) return; // another instance holds the scheduler lock

    try {
      const now = new Date();
      const dueLops = await this.prisma.loopConfig.findMany({
        where: { isActive: true, nextRunAt: { lte: now } },
        take: 10,
      });

      for (const loop of dueLops) {
        if (this.runningLoops.has(loop.id)) continue;

        const run = await this.prisma.loopRun.create({
          data: { loopId: loop.id, status: 'RUNNING' },
        });

        void this.executeRun(loop, run.id).catch(() => {});
      }
    } finally {
      await this.redis.client
        .eval(LoopService.RELEASE_LOCK_LUA, 1, lockKey, instanceId)
        .catch(() => {});
    }
  }

  // ── Core execution ─────────────────────────────────────────────────────

  private async executeRun(
    loop: { id: string; userId: string; context: string | null; intervalSecs: number; webhookUrl: string | null },
    runId: string,
  ) {
    this.runningLoops.add(loop.id);

    try {
      // Build system snapshot
      const snapshot = await this.buildSnapshot(loop.userId, loop.context);

      // Monitor pass
      const monitorOutput = await this.callMonitor(snapshot);
      const issuesFound = monitorOutput.issues.length;

      let healerOutput: HealerOutput | null = null;
      let issuesFixed = 0;

      const fixableIssues = monitorOutput.issues.filter((i) => i.auto_fixable);

      if (fixableIssues.length > 0) {
        healerOutput = await this.callHealer(fixableIssues, snapshot);
        issuesFixed = healerOutput.actions.filter((a) => a.fixed).length;

        // Store healing result in memory
        await this.memory.set(
          loop.userId, 'monitor',
          `loop/${loop.id}/last-heal`,
          { runId, actions: healerOutput.actions, fixedCount: issuesFixed },
        ).catch(() => {});
      }

      const finalStatus = monitorOutput.healthy
        ? 'HEALTHY'
        : healerOutput && issuesFixed > 0
          ? 'HEALED'
          : 'ISSUES_FOUND';

      const nextRunAt = new Date(Date.now() + loop.intervalSecs * 1000);

      await Promise.all([
        this.prisma.loopRun.update({
          where: { id: runId },
          data: {
            status: finalStatus,
            monitorOutput: JSON.stringify(monitorOutput),
            healerOutput: healerOutput ? JSON.stringify(healerOutput) : null,
            issuesFound,
            issuesFixed,
            completedAt: new Date(),
          },
        }),
        this.prisma.loopConfig.update({
          where: { id: loop.id },
          data: { lastRunAt: new Date(), nextRunAt },
        }),
        this.memory.set(loop.userId, 'monitor', `loop/${loop.id}/last-run`, {
          runId, status: finalStatus, issuesFound, issuesFixed,
          summary: monitorOutput.summary,
        }).catch(() => {}),
      ]);

      // Webhook notification
      if (loop.webhookUrl && !monitorOutput.healthy) {
        void this.sendWebhook(loop.webhookUrl, {
          loop_id: loop.id,
          run_id: runId,
          status: finalStatus,
          issues_found: issuesFound,
          issues_fixed: issuesFixed,
          summary: monitorOutput.summary,
        }).catch(() => {});
      }

    } catch (err) {
      await this.prisma.loopRun.update({
        where: { id: runId },
        data: { status: 'FAILED', completedAt: new Date() },
      }).catch(() => {});

      const nextRunAt = new Date(Date.now() + loop.intervalSecs * 1000);
      await this.prisma.loopConfig.update({
        where: { id: loop.id },
        data: { lastRunAt: new Date(), nextRunAt },
      }).catch(() => {});

      throw err;
    } finally {
      this.runningLoops.delete(loop.id);
    }
  }

  private async buildSnapshot(userId: string, contextJson: string | null) {
    const context = contextJson ? JSON.parse(contextJson) as Record<string, unknown> : {};

    // Gather live system data for the monitor
    const [recentFailedSandboxes, recentFailedCouncils, todayUsage] = await Promise.all([
      this.prisma.sandbox.count({ where: { userId, status: 'FAILED' } }),
      this.prisma.councilSession.count({ where: { userId, status: 'FAILED' } }),
      this.prisma.usageLog.aggregate({
        where: {
          userId,
          createdAt: { gte: new Date(Date.now() - 86_400_000) },
        },
        _sum: { billedAmount: true, durationSecs: true },
        _count: { id: true },
      }),
    ]);

    // Fetch recent monitor memory entries
    const sharedMemory = await this.memory.list(userId, 'shared').catch(() => ({ keys: [] }));
    const monitorMemory = await this.memory.list(userId, 'monitor').catch(() => ({ keys: [] }));

    return {
      timestamp: new Date().toISOString(),
      user_context: context,
      system_state: {
        failed_sandboxes: recentFailedSandboxes,
        failed_council_sessions: recentFailedCouncils,
        today_runs: todayUsage._count.id,
        today_billed_usd: (todayUsage._sum.billedAmount ?? 0).toFixed(4),
        today_secs: todayUsage._sum.durationSecs ?? 0,
        shared_memory_keys: sharedMemory.keys.length,
        monitor_memory_keys: monitorMemory.keys.length,
      },
    };
  }

  private async callMonitor(snapshot: unknown): Promise<MonitorOutput> {
    const resp = await this.anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: MONITOR_PROMPT,
      messages: [{
        role: 'user',
        content: `System snapshot:\n\`\`\`json\n${JSON.stringify(snapshot, null, 2)}\n\`\`\`\n\nAnalyze and respond with JSON only.`,
      }],
    });

    const text = resp.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    return this.parseJson<MonitorOutput>(text, { healthy: true, issues: [], summary: 'Monitor parse failed' });
  }

  private async callHealer(
    issues: { severity: string; title: string; detail: string }[],
    snapshot: unknown,
  ): Promise<HealerOutput> {
    const resp = await this.anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: HEALER_PROMPT,
      messages: [{
        role: 'user',
        content: `Issues to fix:\n\`\`\`json\n${JSON.stringify(issues, null, 2)}\n\`\`\`\n\nSystem context:\n\`\`\`json\n${JSON.stringify(snapshot, null, 2)}\n\`\`\`\n\nRespond with JSON only.`,
      }],
    });

    const text = resp.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    return this.parseJson<HealerOutput>(text, { actions: [], summary: 'Healer parse failed' });
  }

  private async sendWebhook(url: string, payload: unknown) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Perpetual-Loop/1.0' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) console.warn(`[loop] webhook to ${url} failed: ${resp.status}`);
  }

  private parseJson<T>(text: string, fallback: T): T {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]) as T;
    } catch { /* fall through */ }
    return fallback;
  }

  private validateWebhookUrl(url: string) {
    try {
      const parsed = new URL(url);
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        throw new Error();
      }
      // Block private IPs (SSRF guard)
      const host = parsed.hostname;
      if (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.startsWith('10.') ||
        host.startsWith('192.168.') ||
        host.startsWith('172.') ||
        host === '0.0.0.0' ||
        host === '::1'
      ) {
        throw new BadRequestException('webhook_url may not point to a private/local address');
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('webhook_url must be a valid HTTPS URL');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatConfig(loop: any) {
    return {
      loop_id: loop.id as string,
      name: loop.name as string,
      description: loop.description as string | null,
      interval_secs: loop.intervalSecs as number,
      is_active: loop.isActive as boolean,
      last_run_at: loop.lastRunAt as Date | null,
      next_run_at: loop.nextRunAt as Date | null,
      webhook_url: loop.webhookUrl as string | null,
      created_at: loop.createdAt as Date,
    };
  }
}
