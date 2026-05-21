import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import type { Request, Response } from 'express';
import { AgentType, ActivitySeverity, EventStatus } from '../generated/prisma';
import { ApiKeyGuard } from '../sandbox/api-key.guard';
import { ActivityStreamService, type CreateEventInput } from './activity-stream.service';
import { ActivityStreamGateway } from './activity-stream.gateway';

const REDIS_PREFIX = (process.env.REDIS_PREFIX ?? 'factory').trim();

class AppendEventDto implements Omit<CreateEventInput, 'projectId' | 'runtimeId' | 'workspaceId'> {
  @IsEnum(AgentType)
  agentType!: AgentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  message?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(ActivitySeverity)
  severity?: ActivitySeverity;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

@Controller('v1/activity')
export class ActivityStreamController {
  constructor(
    private readonly activityService: ActivityStreamService,
    private readonly gateway:         ActivityStreamGateway,
  ) {}

  // 07-03: SSE live stream — reconnect-safe with cursor replay
  @UseGuards(ApiKeyGuard)
  @Get(':projectId/stream')
  async streamByProject(
    @Param('projectId') projectId: string,
    @Query('cursor')    cursor:    string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.openSseStream({
      channel:   `${REDIS_PREFIX}:activity:${projectId}`,
      queryOpts: { projectId, after: cursor },
      req,
      res,
    });
  }

  // 07-06: SSE stream for runtime-level events (recovery, crash, heal)
  @UseGuards(ApiKeyGuard)
  @Get('runtime/:runtimeId/stream')
  async streamByRuntime(
    @Param('runtimeId') runtimeId: string,
    @Query('cursor')    cursor:     string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.openSseStream({
      channel:   `${REDIS_PREFIX}:activity:runtime:${runtimeId}`,
      queryOpts: { runtimeId, after: cursor },
      req,
      res,
    });
  }

  // 07-07: History + replay with filters
  @UseGuards(ApiKeyGuard)
  @Get(':projectId')
  getHistory(
    @Param('projectId') projectId: string,
    @Query('cursor')    cursor:    string | undefined,
    @Query('limit')     limit:     string | undefined,
    @Query('agent')     agent:     AgentType | undefined,
    @Query('severity')  severity:  ActivitySeverity | undefined,
    @Query('status')    status:    EventStatus | undefined,
  ) {
    return this.activityService.query({
      projectId,
      after:     cursor,
      limit:     limit ? Math.min(parseInt(limit, 10), 200) : 50,
      agentType: agent,
      severity,
      status,
    });
  }

  // 07-07: Replay timeline between two timestamps
  @UseGuards(ApiKeyGuard)
  @Get(':projectId/replay')
  replay(
    @Param('projectId') projectId: string,
    @Query('from')  from:  string | undefined,
    @Query('to')    to:    string | undefined,
    @Query('limit') limit: string | undefined,
  ) {
    return this.activityService.query({
      projectId,
      after:  from,
      before: to,
      limit:  limit ? Math.min(parseInt(limit, 10), 200) : 200,
    });
  }

  // 07-08: Public-safe feed — sanitized INFO events for "Watch AI Build This"
  @Get(':projectId/public')
  async publicFeed(
    @Param('projectId') projectId: string,
    @Query('limit')     limit:     string | undefined,
  ) {
    const events = await this.activityService.query({
      projectId,
      severity: ActivitySeverity.INFO,
      status:   EventStatus.SUCCESS,
      limit:    limit ? Math.min(parseInt(limit, 10), 50) : 20,
    });
    return events.map((e) => this.activityService.redactEvent(e));
  }

  // 07-02: Append an event (services call this directly; also exposed via API)
  @UseGuards(ApiKeyGuard)
  @Post(':projectId')
  @HttpCode(HttpStatus.CREATED)
  appendEvent(
    @Param('projectId') projectId: string,
    @Body() dto: AppendEventDto,
    @Req() req: Request,
  ) {
    return this.activityService.append({
      ...dto,
      projectId,
    });
  }

  // ── Private SSE helper ────────────────────────────────────────────────────

  private async openSseStream(opts: {
    channel:   string;
    queryOpts: Parameters<ActivityStreamService['query']>[0];
    req:       Request;
    res:       Response;
  }): Promise<void> {
    const { channel, queryOpts, req, res } = opts;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();
    res.write(': connected\n\n');

    // 07-03: Cursor-based replay of past events on reconnect
    if (queryOpts.after) {
      const past = await this.activityService.query({ ...queryOpts, limit: 100 });
      for (const event of past) {
        const safe = this.activityService.redactEvent(event);
        res.write(`id: ${event.id}\ndata: ${JSON.stringify(safe)}\n\n`);
      }
    }

    // Register for live updates via Redis pub/sub
    const unsubscribe = this.gateway.addListener(channel, res);

    // 07-09: 25s heartbeat keeps connection alive through proxies/mobile
    const heartbeat = setInterval(() => {
      try { res.write(': ping\n\n'); }
      catch { clearInterval(heartbeat); unsubscribe(); }
    }, 25_000);

    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  }
}
