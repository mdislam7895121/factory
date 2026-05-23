import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import {
  AssignTicketDto,
  CreateFeedbackDto,
  FeedbackCategory,
  FeedbackStatus,
  ReplyTicketDto,
  SupportTicket,
  UpdateTicketStatusDto,
} from './feedback.types';

const VALID_CATEGORIES = new Set([
  'BUG','FEATURE_REQUEST','QUALITY_ISSUE','BILLING','RUNTIME',
  'PREVIEW','ACCOUNT','ABUSE','GENERAL',
]);
const VALID_STATUSES = new Set(['OPEN','TRIAGED','IN_PROGRESS','RESOLVED','CLOSED']);
const VALID_SEVERITIES = new Set(['CRITICAL','HIGH','MEDIUM','LOW']);

function safeParam(s: string | undefined, max = 80): string {
  if (!s) return '';
  return s.replace(/[<>"']/g, '').slice(0, max);
}

@Controller()
export class FeedbackController {
  constructor(private readonly svc: FeedbackService) {}

  // ── Public feedback endpoints ─────────────────────────────────────────────

  @Post('v1/feedback')
  create(@Body() dto: CreateFeedbackDto): SupportTicket {
    if (!dto.category || !VALID_CATEGORIES.has(dto.category)) {
      throw new BadRequestException('invalid category');
    }
    if (dto.severity && !VALID_SEVERITIES.has(dto.severity)) {
      throw new BadRequestException('invalid severity');
    }
    if (!dto.title || dto.title.trim().length < 3) {
      throw new BadRequestException('title too short');
    }
    return this.svc.publicView(this.svc.create(dto));
  }

  @Get('v1/feedback/my')
  myTickets(@Query('submitterHash') hash: string): SupportTicket[] {
    const safe = safeParam(hash, 40);
    if (!safe || safe.length < 4) return [];
    return this.svc.findBySubmitter(safe);
  }

  @Get('v1/feedback/:id')
  getOne(@Param('id') id: string): SupportTicket {
    const safe = safeParam(id, 40);
    return this.svc.publicView(this.svc.findById(safe));
  }

  // ── Admin support inbox ───────────────────────────────────────────────────

  @Get('admin/support/tickets')
  listTickets(
    @Query('status')   status:   string,
    @Query('category') category: string,
  ): SupportTicket[] {
    const s = VALID_STATUSES.has(status)   ? (status as FeedbackStatus)     : undefined;
    const c = VALID_CATEGORIES.has(category) ? (category as FeedbackCategory) : undefined;
    return this.svc.listAll(s, c);
  }

  @Get('admin/support/tickets/:id')
  getTicket(@Param('id') id: string): SupportTicket {
    return this.svc.findById(safeParam(id, 40));
  }

  @Patch('admin/support/tickets/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body()      dto: UpdateTicketStatusDto,
  ): SupportTicket {
    if (!VALID_STATUSES.has(dto.status)) throw new BadRequestException('invalid status');
    return this.svc.updateStatus(safeParam(id, 40), dto, 'admin');
  }

  @Patch('admin/support/tickets/:id/assign')
  assign(
    @Param('id') id: string,
    @Body()      dto: AssignTicketDto,
  ): SupportTicket {
    if (!dto.assignedTo || dto.assignedTo.trim().length < 1) {
      throw new BadRequestException('assignedTo required');
    }
    return this.svc.assign(safeParam(id, 40), dto, 'admin');
  }

  @Post('admin/support/tickets/:id/reply')
  reply(
    @Param('id') id: string,
    @Body()      dto: ReplyTicketDto,
  ): SupportTicket {
    return this.svc.reply(safeParam(id, 40), dto, 'admin', true);
  }

  // ── Analytics ─────────────────────────────────────────────────────────────

  @Get('admin/support/analytics')
  analytics(): Record<string, unknown> {
    return this.svc.getAnalyticsSummary();
  }

  @Get('admin/support/pains')
  pains(): unknown[] {
    return this.svc.rankPains();
  }

  @Get('admin/support/roadmap')
  roadmap(): unknown[] {
    return this.svc.toRoadmapSuggestions(this.svc.rankPains());
  }

  @Get('admin/support/audit')
  audit(): unknown[] {
    return this.svc.getAuditRing();
  }
}
