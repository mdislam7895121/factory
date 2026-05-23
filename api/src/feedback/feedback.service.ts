import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  AssignTicketDto,
  CreateFeedbackDto,
  CustomerPain,
  FEEDBACK_BLOCKED_CONTENT,
  FEEDBACK_BLOCKED_META_KEYS,
  FeedbackCategory,
  FeedbackItem,
  FeedbackSeverity,
  FeedbackStatus,
  MAX_BODY_LEN,
  MAX_TICKETS,
  MAX_TITLE_LEN,
  ProductSignal,
  REVENUE_SCORE,
  ReplyTicketDto,
  RoadmapSuggestion,
  SEVERITY_SCORE,
  SupportTicket,
  TicketAuditEntry,
  TicketReply,
  UpdateTicketStatusDto,
} from './feedback.types';

function newId(): string {
  return `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

function sanitizeText(s: string, maxLen: number): string {
  return s
    .slice(0, maxLen)
    .replace(/[<>]/g, '')
    .trim();
}

function fnv32(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

@Injectable()
export class FeedbackService {
  private readonly tickets = new Map<string, SupportTicket>();
  private readonly signals = new Map<string, ProductSignal>();
  private readonly auditRing: TicketAuditEntry[] = [];
  private readonly MAX_AUDIT = 500;

  // ── Input validation ──────────────────────────────────────────────────────

  validateInput(title: string, body: string): void {
    if (!title || title.trim().length < 3) throw new BadRequestException('title too short');
    if (FEEDBACK_BLOCKED_CONTENT.test(title) || FEEDBACK_BLOCKED_CONTENT.test(body)) {
      throw new BadRequestException('content contains blocked patterns');
    }
    for (const key of FEEDBACK_BLOCKED_META_KEYS) {
      if (title.toLowerCase().includes(key.toLowerCase()) ||
          body.toLowerCase().includes(key.toLowerCase())) {
        throw new BadRequestException('content references blocked keys');
      }
    }
  }

  hashEmail(email: string): string {
    if (!email || !email.includes('@')) return 'anon_' + fnv32('anon');
    return 'u_' + fnv32(email.toLowerCase().trim());
  }

  // ── Public feedback API ───────────────────────────────────────────────────

  create(dto: CreateFeedbackDto): SupportTicket {
    if (this.tickets.size >= MAX_TICKETS) {
      throw new BadRequestException('feedback inbox full — contact support directly');
    }

    this.validateInput(dto.title, dto.body ?? '');

    const id  = newId();
    const ts  = now();
    const ticket: SupportTicket = {
      id,
      category:    dto.category,
      severity:    dto.severity ?? 'MEDIUM',
      status:      'OPEN',
      title:       sanitizeText(dto.title, MAX_TITLE_LEN),
      body:        sanitizeText(dto.body ?? '', MAX_BODY_LEN),
      route:       (dto.route ?? '').slice(0, 200).replace(/[<>]/g, ''),
      submitterHash: dto.emailHash ?? 'anon_' + fnv32('anon'),
      createdAt:   ts,
      updatedAt:   ts,
      replies:     [],
      auditLog:    [],
    };

    this.tickets.set(id, ticket);
    this.recordSignal(`feedback.${dto.category.toLowerCase()}`);
    return ticket;
  }

  findById(id: string): SupportTicket {
    const t = this.tickets.get(id);
    if (!t) throw new NotFoundException('ticket not found');
    return t;
  }

  findBySubmitter(submitterHash: string): SupportTicket[] {
    return [...this.tickets.values()]
      .filter(t => t.submitterHash === submitterHash)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50)
      .map(t => this.publicView(t));
  }

  publicView(ticket: SupportTicket): SupportTicket {
    return {
      ...ticket,
      adminNotes: undefined,
      auditLog:   [],
      replies:    ticket.replies.filter(r => r.isAdmin === false || r.author === 'support'),
    };
  }

  // ── Admin support inbox ───────────────────────────────────────────────────

  listAll(status?: FeedbackStatus, category?: FeedbackCategory): SupportTicket[] {
    let list = [...this.tickets.values()];
    if (status)   list = list.filter(t => t.status === status);
    if (category) list = list.filter(t => t.category === category);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateStatus(id: string, dto: UpdateTicketStatusDto, actor: string): SupportTicket {
    const ticket = this.findById(id);
    const prev   = ticket.status;
    ticket.status    = dto.status;
    ticket.updatedAt = now();
    if (dto.status === 'RESOLVED') ticket.resolvedAt = ticket.updatedAt;

    this.appendAudit(ticket, `status_changed`, actor, `${prev} → ${dto.status}`);
    this.recordSignal(`ticket.status.${dto.status.toLowerCase()}`);
    return ticket;
  }

  assign(id: string, dto: AssignTicketDto, actor: string): SupportTicket {
    const ticket = this.findById(id);
    ticket.assignedTo = dto.assignedTo.slice(0, 80);
    ticket.updatedAt  = now();
    this.appendAudit(ticket, 'assigned', actor, `assigned to ${ticket.assignedTo}`);
    return ticket;
  }

  reply(id: string, dto: ReplyTicketDto, actor: string, isAdmin: boolean): SupportTicket {
    const ticket = this.findById(id);
    if (!dto.body || dto.body.trim().length < 2) throw new BadRequestException('reply body too short');
    if (FEEDBACK_BLOCKED_CONTENT.test(dto.body)) throw new BadRequestException('reply contains blocked content');

    const rep: TicketReply = {
      id:        newId(),
      body:      sanitizeText(dto.body, 2000),
      author:    isAdmin ? 'support' : ticket.submitterHash,
      isAdmin,
      createdAt: now(),
    };
    ticket.replies.push(rep);
    ticket.updatedAt = now();
    if (isAdmin && ticket.status === 'OPEN') {
      ticket.status = 'TRIAGED';
      this.appendAudit(ticket, 'auto_triaged', actor, 'first admin reply');
    }
    this.appendAudit(ticket, 'reply_added', actor, `${isAdmin ? 'admin' : 'user'} replied`);
    return ticket;
  }

  // ── Product signals ────────────────────────────────────────────────────────

  recordSignal(event: string): void {
    const sig = this.signals.get(event) ?? { event, count: 0, lastSeen: '' };
    sig.count++;
    sig.lastSeen = now();
    this.signals.set(event, sig);
  }

  getSignals(): ProductSignal[] {
    return [...this.signals.values()].sort((a, b) => b.count - a.count);
  }

  getAnalyticsSummary(): Record<string, unknown> {
    const tickets = [...this.tickets.values()];
    const byCat   = {} as Record<string, number>;
    const byStatus = {} as Record<string, number>;

    for (const t of tickets) {
      byCat[t.category]    = (byCat[t.category] ?? 0) + 1;
      byStatus[t.status]   = (byStatus[t.status] ?? 0) + 1;
    }

    const openCritical = tickets.filter(t => t.status === 'OPEN' && t.severity === 'CRITICAL').length;
    const avgResolveSec = this.computeAvgResolveMs(tickets) / 1000;
    const signals = this.getSignals().slice(0, 20);

    return {
      total:         tickets.length,
      open:          (byStatus['OPEN'] ?? 0),
      triaged:       (byStatus['TRIAGED'] ?? 0),
      inProgress:    (byStatus['IN_PROGRESS'] ?? 0),
      resolved:      (byStatus['RESOLVED'] ?? 0),
      closed:        (byStatus['CLOSED'] ?? 0),
      openCritical,
      byCategory:    byCat,
      avgResolveSec: Math.round(avgResolveSec),
      signals,
    };
  }

  private computeAvgResolveMs(tickets: SupportTicket[]): number {
    const resolved = tickets.filter(t => t.resolvedAt);
    if (!resolved.length) return 0;
    const total = resolved.reduce((acc, t) => {
      return acc + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime());
    }, 0);
    return total / resolved.length;
  }

  // ── Customer pain ranking ─────────────────────────────────────────────────

  rankPains(): CustomerPain[] {
    const tickets = [...this.tickets.values()].filter(t => t.status !== 'CLOSED');
    const grouped = new Map<string, SupportTicket[]>();

    for (const t of tickets) {
      const key = t.category;
      const g   = grouped.get(key) ?? [];
      g.push(t);
      grouped.set(key, g);
    }

    const pains: CustomerPain[] = [];
    for (const [cat, group] of grouped) {
      const topSev    = this.topSeverity(group);
      const frequency = group.length;
      const repeats   = group.filter(t => t.replies.length > 0).length;
      const revImpact = cat === 'BILLING' || cat === 'RUNTIME' ? 'HIGH' : cat === 'PREVIEW' ? 'MEDIUM' : 'LOW';
      const hasPaid   = cat === 'BILLING';
      const score     = this.computeScore(frequency, topSev, revImpact, repeats);

      pains.push({
        id:            `pain_${cat.toLowerCase()}`,
        category:      cat as FeedbackCategory,
        title:         this.painTitle(cat as FeedbackCategory),
        frequency,
        severity:      topSev,
        revenueImpact: revImpact,
        affectedType:  hasPaid ? 'PAID' : 'ALL',
        repeatCount:   repeats,
        score,
      });
    }

    return pains.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  toRoadmapSuggestions(pains: CustomerPain[]): RoadmapSuggestion[] {
    return pains.map(pain => ({
      pain,
      suggestedSerial: this.suggestSerial(pain),
      affectedModule:  this.suggestModule(pain),
      urgency:         pain.score >= 20 ? 'IMMEDIATE' : pain.score >= 10 ? 'NEXT_SPRINT' : 'BACKLOG',
      customerValue:   this.customerValue(pain),
      founderImpact:   this.founderImpact(pain),
    }));
  }

  private topSeverity(tickets: SupportTicket[]): FeedbackSeverity {
    const order: FeedbackSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    for (const sev of order) {
      if (tickets.some(t => t.severity === sev)) return sev;
    }
    return 'LOW';
  }

  private computeScore(
    freq: number,
    sev: FeedbackSeverity,
    rev: 'HIGH' | 'MEDIUM' | 'LOW',
    repeats: number,
  ): number {
    return freq * 2 + SEVERITY_SCORE[sev] * 3 + REVENUE_SCORE[rev] * 2 + repeats;
  }

  private painTitle(cat: FeedbackCategory): string {
    const titles: Record<FeedbackCategory, string> = {
      BUG:             'Functional bugs reported by users',
      FEATURE_REQUEST: 'Missing features blocking users',
      QUALITY_ISSUE:   'AI-generated output quality complaints',
      BILLING:         'Billing and payment issues',
      RUNTIME:         'Runtime failures and crashes',
      PREVIEW:         'Preview gateway failures',
      ACCOUNT:         'Account access and auth issues',
      ABUSE:           'Abuse and policy violations',
      GENERAL:         'General support requests',
    };
    return titles[cat] ?? cat;
  }

  private suggestSerial(pain: CustomerPain): string {
    const map: Partial<Record<FeedbackCategory, string>> = {
      BILLING:         'SERIAL 30+',
      RUNTIME:         'SERIAL 31',
      QUALITY_ISSUE:   'SERIAL 30',
      BUG:             'SERIAL 30 (hotfix)',
      FEATURE_REQUEST: 'SERIAL 31+',
    };
    return map[pain.category] ?? 'BACKLOG';
  }

  private suggestModule(pain: CustomerPain): string {
    const map: Partial<Record<FeedbackCategory, string>> = {
      BILLING:         'billing',
      RUNTIME:         'orchestrator/runtime',
      QUALITY_ISSUE:   'pair-programmer/review-gate',
      BUG:             'varies',
      FEATURE_REQUEST: 'varies',
      PREVIEW:         'preview',
      ACCOUNT:         'auth/organization',
    };
    return map[pain.category] ?? 'unknown';
  }

  private customerValue(pain: CustomerPain): string {
    if (pain.severity === 'CRITICAL') return 'Unblocking users who cannot use the product at all';
    if (pain.revenueImpact === 'HIGH') return 'Directly affects conversion or retention';
    if (pain.frequency > 5)           return 'Affects many users — high surface area fix';
    return 'Improves experience for a segment of users';
  }

  private founderImpact(pain: CustomerPain): string {
    if (pain.severity === 'CRITICAL' || pain.revenueImpact === 'HIGH') {
      return 'Fix immediately — blocking revenue or core retention';
    }
    if (pain.frequency > 3) return 'Schedule in next sprint — patterns emerging';
    return 'Log and monitor — not yet systemic';
  }

  // ── Audit helpers ─────────────────────────────────────────────────────────

  private appendAudit(ticket: SupportTicket, action: string, actor: string, detail: string): void {
    const entry: TicketAuditEntry = { action, actor, detail, ts: now() };
    ticket.auditLog.push(entry);
    this.auditRing.push(entry);
    if (this.auditRing.length > this.MAX_AUDIT) this.auditRing.shift();
  }

  getAuditRing(): TicketAuditEntry[] {
    return [...this.auditRing].reverse().slice(0, 100);
  }
}
