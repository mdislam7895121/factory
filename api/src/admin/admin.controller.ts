import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RuntimeStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';
import { KillSwitchService, type KillSwitchName } from '../kill-switch/kill-switch.service';
import { SecurityAuditService } from '../audit/security-audit.service';
import { BetaService } from '../beta/beta.service';
import { AdminGuard } from './admin.guard';

const VALID_SWITCHES: KillSwitchName[] = ['runtime_create', 'previews', 'remix', 'maintenance', 'readonly'];

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly prisma:      PrismaService,
    private readonly redis:       RedisService,
    private readonly killSwitch:  KillSwitchService,
    private readonly audit:       SecurityAuditService,
    private readonly betaService: BetaService,
  ) {}

  // 10-05: Observability — platform health metrics
  @Get('health')
  async health() {
    const [
      runtimesByStatus,
      recentAudit,
      dbPing,
    ] = await Promise.all([
      this.prisma.runtimeInstance.groupBy({
        by:     ['status'],
        _count: { _all: true },
      }).catch(() => []),
      this.audit.recent(10),
      this.prisma.$queryRaw`SELECT 1 as ok`.then(() => true).catch(() => false),
    ]);

    // Redis health
    const redisOk = await this.redis.client.ping().then(() => true).catch(() => false);

    // Queue depth
    const remixQueueDepth = await this.redis.client
      .llen(`${this.redis.prefix}:remix:queue`)
      .catch(() => -1);

    // Kill switches
    const switches = await this.killSwitch.getAll();

    const statusCounts = Object.fromEntries(
      (runtimesByStatus as Array<{ status: RuntimeStatus; _count: { _all: number } }>)
        .map(({ status, _count }) => [status.toLowerCase(), _count._all]),
    );

    return {
      ok:           dbPing && redisOk,
      timestamp:    new Date().toISOString(),
      db:           { ok: dbPing },
      redis:        { ok: redisOk },
      runtimes:     statusCounts,
      remixQueue:   remixQueueDepth,
      killSwitches: switches,
      betaMode:     this.betaService.getMode(),
      recentAudit:  recentAudit.slice(0, 5).map(e => ({
        action:    e.action,
        createdAt: e.createdAt,
      })),
    };
  }

  // 10-04: Get all kill switch states
  @Get('kill-switches')
  async listKillSwitches() {
    return this.killSwitch.getAll();
  }

  // 10-04: Enable a kill switch
  @Post('kill-switches/:name/enable')
  @HttpCode(HttpStatus.OK)
  async enableSwitch(@Param('name') name: string) {
    if (!VALID_SWITCHES.includes(name as KillSwitchName)) {
      return { ok: false, error: 'unknown switch' };
    }
    await this.killSwitch.enable(name as KillSwitchName);
    await this.audit.log({ action: 'KILL_SWITCH_ENABLE', targetType: 'kill_switch', targetId: name });
    return { ok: true, enabled: name };
  }

  // 10-04: Disable a kill switch
  @Delete('kill-switches/:name')
  @HttpCode(HttpStatus.OK)
  async disableSwitch(@Param('name') name: string) {
    if (!VALID_SWITCHES.includes(name as KillSwitchName)) {
      return { ok: false, error: 'unknown switch' };
    }
    await this.killSwitch.disable(name as KillSwitchName);
    await this.audit.log({ action: 'KILL_SWITCH_DISABLE', targetType: 'kill_switch', targetId: name });
    return { ok: true, disabled: name };
  }

  // 10-06: Recent audit events
  @Get('audit')
  async recentAudit(@Query('limit') limit: string | undefined) {
    return this.audit.recent(limit ? Math.min(parseInt(limit, 10), 500) : 100);
  }

  // 10-03: Quota usage for a user
  @Get('quotas/:userId')
  async quotaUsage(@Param('userId') userId: string) {
    const [runtimes, active] = await Promise.all([
      this.prisma.runtimeInstance.count({ where: { ownerUserId: userId, status: { not: RuntimeStatus.TERMINATED } } }),
      this.prisma.runtimeInstance.count({ where: { ownerUserId: userId, status: RuntimeStatus.RUNNING } }),
    ]);
    const today   = new Date().toISOString().slice(0, 10);
    const remixKey = `${this.redis.prefix}:quota:remix:${userId}:${today}`;
    const remixToday = parseInt((await this.redis.client.get(remixKey).catch(() => '0')) ?? '0', 10);
    return { userId, runtimes, active, remixToday };
  }

  // 10-08: Generate a beta invite code
  @Post('beta/invite')
  @HttpCode(HttpStatus.CREATED)
  async generateInvite() {
    const code = await this.betaService.generateInviteCode();
    // Log admin action but never log the actual code
    await this.audit.log({ action: 'ADMIN_ACTION', targetType: 'beta_invite', targetId: 'generated' });
    return { ok: true, code };
  }

  // 20D-01: Platform stats for admin command center
  @Get('stats')
  async stats() {
    const [total, running, sleeping, crashed] = await Promise.all([
      this.prisma.runtimeInstance.count().catch(() => 0),
      this.prisma.runtimeInstance.count({ where: { status: RuntimeStatus.RUNNING  } }).catch(() => 0),
      this.prisma.runtimeInstance.count({ where: { status: RuntimeStatus.SLEEPING } }).catch(() => 0),
      this.prisma.runtimeInstance.count({ where: { status: RuntimeStatus.CRASHED  } }).catch(() => 0),
    ]);
    const remixQueueDepth = await this.redis.client
      .llen(`${this.redis.prefix}:remix:queue`)
      .catch(() => 0);
    const betaMode = this.betaService.getMode();
    return {
      ok: true,
      runtimes: { total, running, sleeping, crashed },
      remixQueue: remixQueueDepth,
      betaMode,
      timestamp: new Date().toISOString(),
    };
  }
}
