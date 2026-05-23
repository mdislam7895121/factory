import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, SupportTicket } from './feedback.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function validDto(overrides: Partial<CreateFeedbackDto> = {}): CreateFeedbackDto {
  return {
    category: 'BUG',
    title:    'App crashes on load',
    body:     'When I open the workspace the page goes blank.',
    route:    '/workspace',
    ...overrides,
  };
}

// ── FeedbackService ───────────────────────────────────────────────────────────

describe('FeedbackService', () => {
  let svc: FeedbackService;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService],
    }).compile();
    svc = mod.get(FeedbackService);
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('creates a ticket with valid input', () => {
    const t = svc.create(validDto());
    expect(t.id).toMatch(/^fb_/);
    expect(t.status).toBe('OPEN');
    expect(t.category).toBe('BUG');
    expect(t.title).toBe('App crashes on load');
  });

  it('assigns MEDIUM severity by default', () => {
    const t = svc.create(validDto());
    expect(t.severity).toBe('MEDIUM');
  });

  it('respects explicit severity', () => {
    const t = svc.create(validDto({ severity: 'CRITICAL' }));
    expect(t.severity).toBe('CRITICAL');
  });

  it('truncates title to 120 chars', () => {
    const long = 'A'.repeat(200);
    const t = svc.create(validDto({ title: long }));
    expect(t.title.length).toBeLessThanOrEqual(120);
  });

  it('truncates body to 2000 chars', () => {
    const long = 'B'.repeat(3000);
    const t = svc.create(validDto({ body: long }));
    expect(t.body.length).toBeLessThanOrEqual(2000);
  });

  it('sanitizes < and > in title', () => {
    const t = svc.create(validDto({ title: '<b>bold</b> title test' }));
    expect(t.title).not.toContain('<');
    expect(t.title).not.toContain('>');
  });

  it('sets createdAt and updatedAt as ISO strings', () => {
    const t = svc.create(validDto());
    expect(new Date(t.createdAt).getFullYear()).toBeGreaterThan(2020);
    expect(new Date(t.updatedAt).getFullYear()).toBeGreaterThan(2020);
  });

  it('initializes replies and auditLog as empty arrays', () => {
    const t = svc.create(validDto());
    expect(Array.isArray(t.replies)).toBe(true);
    expect(Array.isArray(t.auditLog)).toBe(true);
    expect(t.replies.length).toBe(0);
  });

  it('stores route safely', () => {
    const t = svc.create(validDto({ route: '/workspace/my-proj' }));
    expect(t.route).toBe('/workspace/my-proj');
  });

  // ── Blocked content ───────────────────────────────────────────────────────

  it('blocks <script> in title', () => {
    expect(() => svc.create(validDto({ title: '<script>alert(1)</script>' }))).toThrow(BadRequestException);
  });

  it('blocks javascript: in body', () => {
    expect(() => svc.create(validDto({ body: 'click javascript:void(0)' }))).toThrow(BadRequestException);
  });

  it('blocks eval( in body', () => {
    expect(() => svc.create(validDto({ body: 'eval(malicious)' }))).toThrow(BadRequestException);
  });

  it('blocks document.cookie in body', () => {
    expect(() => svc.create(validDto({ body: 'document.cookie leak' }))).toThrow(BadRequestException);
  });

  it('blocks __proto__ in body', () => {
    expect(() => svc.create(validDto({ body: '__proto__ pollution' }))).toThrow(BadRequestException);
  });

  it('blocks onerror= in title', () => {
    expect(() => svc.create(validDto({ title: 'img onerror=alert(1)' }))).toThrow(BadRequestException);
  });

  it('blocks DATABASE_URL key reference', () => {
    expect(() => svc.create(validDto({ body: 'my DATABASE_URL is exposed' }))).toThrow(BadRequestException);
  });

  it('blocks AUTH_SECRET reference', () => {
    expect(() => svc.create(validDto({ body: 'AUTH_SECRET leaked' }))).toThrow(BadRequestException);
  });

  it('rejects title shorter than 3 chars', () => {
    expect(() => svc.create(validDto({ title: 'ab' }))).toThrow(BadRequestException);
  });

  // ── Email hashing ─────────────────────────────────────────────────────────

  it('hashEmail returns a hex hash for valid email', () => {
    const h = svc.hashEmail('user@example.com');
    expect(h).toMatch(/^u_[a-f0-9]+$/);
  });

  it('hashEmail is deterministic', () => {
    expect(svc.hashEmail('test@example.com')).toBe(svc.hashEmail('test@example.com'));
  });

  it('hashEmail differs for different emails', () => {
    expect(svc.hashEmail('a@b.com')).not.toBe(svc.hashEmail('c@d.com'));
  });

  it('hashEmail handles no-at-sign gracefully', () => {
    const h = svc.hashEmail('notanemail');
    expect(h).toMatch(/^anon_/);
  });

  it('hashEmail handles empty string', () => {
    const h = svc.hashEmail('');
    expect(h).toMatch(/^anon_/);
  });

  // ── Lookup ────────────────────────────────────────────────────────────────

  it('findById returns ticket', () => {
    const t = svc.create(validDto());
    expect(svc.findById(t.id).id).toBe(t.id);
  });

  it('findById throws NotFoundException for unknown id', () => {
    expect(() => svc.findById('fb_unknown')).toThrow(NotFoundException);
  });

  it('findBySubmitter returns tickets for hash', () => {
    const hash = 'u_abc123';
    svc.create({ ...validDto(), emailHash: hash });
    svc.create({ ...validDto(), emailHash: hash, title: 'Second ticket here' });
    const list = svc.findBySubmitter(hash);
    expect(list.length).toBe(2);
  });

  it('findBySubmitter returns empty array for unknown hash', () => {
    expect(svc.findBySubmitter('u_unknown')).toEqual([]);
  });

  // ── Status lifecycle ──────────────────────────────────────────────────────

  it('updateStatus changes status', () => {
    const t = svc.create(validDto());
    const updated = svc.updateStatus(t.id, { status: 'TRIAGED' }, 'admin');
    expect(updated.status).toBe('TRIAGED');
  });

  it('updateStatus sets resolvedAt when RESOLVED', () => {
    const t = svc.create(validDto());
    const updated = svc.updateStatus(t.id, { status: 'RESOLVED' }, 'admin');
    expect(updated.resolvedAt).toBeDefined();
  });

  it('updateStatus appends to auditLog', () => {
    const t = svc.create(validDto());
    svc.updateStatus(t.id, { status: 'IN_PROGRESS' }, 'admin');
    const updated = svc.findById(t.id);
    expect(updated.auditLog.length).toBeGreaterThan(0);
    expect(updated.auditLog[0].action).toBe('status_changed');
  });

  // ── Assignment ────────────────────────────────────────────────────────────

  it('assign sets assignedTo', () => {
    const t = svc.create(validDto());
    const updated = svc.assign(t.id, { assignedTo: 'founder' }, 'admin');
    expect(updated.assignedTo).toBe('founder');
  });

  // ── Replies ───────────────────────────────────────────────────────────────

  it('admin reply appended to ticket', () => {
    const t = svc.create(validDto());
    svc.reply(t.id, { body: 'We are looking into this.' }, 'admin', true);
    const updated = svc.findById(t.id);
    expect(updated.replies.length).toBe(1);
    expect(updated.replies[0].isAdmin).toBe(true);
  });

  it('admin reply auto-triages OPEN ticket', () => {
    const t = svc.create(validDto());
    expect(t.status).toBe('OPEN');
    svc.reply(t.id, { body: 'Thanks for reporting.' }, 'admin', true);
    expect(svc.findById(t.id).status).toBe('TRIAGED');
  });

  it('reply rejects blocked content', () => {
    const t = svc.create(validDto());
    expect(() => svc.reply(t.id, { body: '<script>xss</script>' }, 'admin', true)).toThrow(BadRequestException);
  });

  it('reply rejects too-short body', () => {
    const t = svc.create(validDto());
    expect(() => svc.reply(t.id, { body: 'x' }, 'admin', true)).toThrow(BadRequestException);
  });

  // ── publicView ────────────────────────────────────────────────────────────

  it('publicView strips adminNotes', () => {
    const t = svc.create(validDto());
    (t as SupportTicket & { adminNotes: string }).adminNotes = 'internal note';
    const pub = svc.publicView(t);
    expect(pub.adminNotes).toBeUndefined();
  });

  it('publicView strips auditLog', () => {
    const t = svc.create(validDto());
    svc.updateStatus(t.id, { status: 'TRIAGED' }, 'admin');
    const pub = svc.publicView(svc.findById(t.id));
    expect(pub.auditLog.length).toBe(0);
  });

  // ── listAll ───────────────────────────────────────────────────────────────

  it('listAll returns all tickets', () => {
    svc.create(validDto());
    svc.create(validDto({ category: 'BILLING', title: 'Payment failed today' }));
    expect(svc.listAll().length).toBe(2);
  });

  it('listAll filters by status', () => {
    svc.create(validDto());
    const t2 = svc.create(validDto({ title: 'Second ticket issue' }));
    svc.updateStatus(t2.id, { status: 'RESOLVED' }, 'admin');
    expect(svc.listAll('OPEN').length).toBe(1);
    expect(svc.listAll('RESOLVED').length).toBe(1);
  });

  it('listAll filters by category', () => {
    svc.create(validDto({ category: 'BUG', title: 'Bug report one' }));
    svc.create(validDto({ category: 'BILLING', title: 'Payment not working' }));
    expect(svc.listAll(undefined, 'BILLING').length).toBe(1);
  });

  // ── Analytics ─────────────────────────────────────────────────────────────

  it('getAnalyticsSummary returns total count', () => {
    svc.create(validDto());
    svc.create(validDto({ title: 'Another bug found' }));
    const s = svc.getAnalyticsSummary();
    expect(s['total']).toBe(2);
  });

  it('getAnalyticsSummary byCategory populated', () => {
    svc.create(validDto({ category: 'RUNTIME', title: 'Runtime crash issue' }));
    const s = svc.getAnalyticsSummary();
    expect((s['byCategory'] as Record<string, number>)['RUNTIME']).toBe(1);
  });

  it('getSignals returns events recorded', () => {
    svc.create(validDto());
    const signals = svc.getSignals();
    expect(signals.some(s => s.event === 'feedback.bug')).toBe(true);
  });

  it('recordSignal increments count', () => {
    svc.recordSignal('demo_started');
    svc.recordSignal('demo_started');
    const s = svc.getSignals().find(s => s.event === 'demo_started');
    expect(s?.count).toBe(2);
  });

  // ── Pain ranking ──────────────────────────────────────────────────────────

  it('rankPains returns array', () => {
    svc.create(validDto({ category: 'RUNTIME', title: 'Runtime crash one' }));
    svc.create(validDto({ category: 'RUNTIME', title: 'Runtime crash two' }));
    const pains = svc.rankPains();
    expect(Array.isArray(pains)).toBe(true);
    expect(pains.length).toBeGreaterThan(0);
  });

  it('rankPains scores BILLING higher than GENERAL', () => {
    for (let i = 0; i < 3; i++) svc.create(validDto({ category: 'BILLING', title: `Billing issue ${i}` }));
    for (let i = 0; i < 3; i++) svc.create(validDto({ category: 'GENERAL', title: `General issue ${i}` }));
    const pains = svc.rankPains();
    const billing = pains.find(p => p.category === 'BILLING');
    const general  = pains.find(p => p.category === 'GENERAL');
    expect(billing!.score).toBeGreaterThan(general!.score);
  });

  it('rankPains excludes CLOSED tickets', () => {
    const t = svc.create(validDto({ category: 'ABUSE', title: 'Abuse ticket test' }));
    svc.updateStatus(t.id, { status: 'CLOSED' }, 'admin');
    const pains = svc.rankPains();
    expect(pains.find(p => p.category === 'ABUSE')).toBeUndefined();
  });

  // ── Roadmap suggestions ───────────────────────────────────────────────────

  it('toRoadmapSuggestions returns suggestions', () => {
    svc.create(validDto({ category: 'RUNTIME', title: 'Runtime crash three' }));
    const pains       = svc.rankPains();
    const suggestions = svc.toRoadmapSuggestions(pains);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].urgency).toBeDefined();
    expect(suggestions[0].affectedModule).toBeDefined();
    expect(suggestions[0].customerValue).toBeDefined();
  });

  it('roadmap CRITICAL pain gets IMMEDIATE urgency', () => {
    for (let i = 0; i < 10; i++) {
      svc.create(validDto({ category: 'BILLING', severity: 'CRITICAL', title: `Critical billing ${i}` }));
    }
    const pains = svc.rankPains();
    const sugg  = svc.toRoadmapSuggestions(pains);
    const billing = sugg.find(s => s.pain.category === 'BILLING');
    expect(billing?.urgency).toBe('IMMEDIATE');
  });

  // ── No PII / no secret leakage ─────────────────────────────────────────────

  it('publicView never exposes raw email', () => {
    const t = svc.create({ ...validDto(), emailHash: svc.hashEmail('real@email.com') });
    const pub = svc.publicView(t);
    const str = JSON.stringify(pub);
    expect(str).not.toContain('real@email.com');
    expect(str).not.toContain('@email.com');
  });

  it('analytics summary has no stack traces or internal paths', () => {
    svc.create(validDto());
    const s = JSON.stringify(svc.getAnalyticsSummary());
    expect(s).not.toContain('Error');
    expect(s).not.toContain('stack');
    expect(s).not.toContain('DATABASE_URL');
  });

  it('pain ranking output has no secrets', () => {
    svc.create(validDto());
    const s = JSON.stringify(svc.rankPains());
    expect(s).not.toContain('AUTH_SECRET');
    expect(s).not.toContain('railway.internal');
  });
});

// ── FeedbackController ────────────────────────────────────────────────────────

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let svc: FeedbackService;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers:   [FeedbackService],
    }).compile();
    controller = mod.get(FeedbackController);
    svc        = mod.get(FeedbackService);
  });

  it('POST /v1/feedback creates ticket', () => {
    const t = controller.create(validDto());
    expect(t.id).toMatch(/^fb_/);
  });

  it('POST /v1/feedback rejects invalid category', () => {
    expect(() => controller.create({ ...validDto(), category: 'INVALID' as never })).toThrow(BadRequestException);
  });

  it('POST /v1/feedback rejects short title', () => {
    expect(() => controller.create({ ...validDto(), title: 'ab' })).toThrow(BadRequestException);
  });

  it('POST /v1/feedback rejects invalid severity', () => {
    expect(() => controller.create({ ...validDto(), severity: 'EXTREME' as never })).toThrow(BadRequestException);
  });

  it('GET /v1/feedback/:id returns public view', () => {
    const t = svc.create(validDto());
    const r = controller.getOne(t.id);
    expect(r.id).toBe(t.id);
    expect(r.auditLog.length).toBe(0);
  });

  it('GET /v1/feedback/:id throws for unknown id', () => {
    expect(() => controller.getOne('fb_unknown')).toThrow(NotFoundException);
  });

  it('GET /v1/feedback/my returns empty for unknown hash', () => {
    expect(controller.myTickets('u_unknown')).toEqual([]);
  });

  it('PATCH /admin/support/tickets/:id/status updates status', () => {
    const t = svc.create(validDto());
    const r = controller.updateStatus(t.id, { status: 'TRIAGED' });
    expect(r.status).toBe('TRIAGED');
  });

  it('PATCH /admin/support/tickets/:id/status rejects invalid', () => {
    const t = svc.create(validDto());
    expect(() => controller.updateStatus(t.id, { status: 'INVALID' as never })).toThrow(BadRequestException);
  });

  it('PATCH /admin/support/tickets/:id/assign sets assignee', () => {
    const t = svc.create(validDto());
    const r = controller.assign(t.id, { assignedTo: 'founder' });
    expect(r.assignedTo).toBe('founder');
  });

  it('POST /admin/support/tickets/:id/reply adds reply', () => {
    const t = svc.create(validDto());
    controller.reply(t.id, { body: 'Thanks for reporting this issue.' });
    const updated = controller.getTicket(t.id);
    expect(updated.replies.length).toBe(1);
  });

  it('GET /admin/support/analytics returns summary', () => {
    svc.create(validDto());
    const a = controller.analytics();
    expect(a['total']).toBe(1);
  });

  it('GET /admin/support/pains returns array', () => {
    svc.create(validDto());
    expect(Array.isArray(controller.pains())).toBe(true);
  });

  it('GET /admin/support/roadmap returns suggestions', () => {
    svc.create(validDto());
    expect(Array.isArray(controller.roadmap())).toBe(true);
  });

  it('GET /admin/support/audit returns array', () => {
    const t = svc.create(validDto());
    controller.updateStatus(t.id, { status: 'TRIAGED' });
    expect(Array.isArray(controller.audit())).toBe(true);
  });

  it('GET /admin/support/tickets filters by category', () => {
    svc.create(validDto({ category: 'BUG', title: 'Bug one' }));
    svc.create(validDto({ category: 'BILLING', title: 'Billing issue' }));
    const list = controller.listTickets('', 'BILLING');
    expect(list.length).toBe(1);
    expect(list[0].category).toBe('BILLING');
  });
});
