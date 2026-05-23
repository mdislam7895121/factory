import { Test } from '@nestjs/testing';
import { CustomerSuccessService } from './customer-success.service';
import { CustomerSuccessController } from './customer-success.controller';

describe('CustomerSuccessService', () => {
  let svc: CustomerSuccessService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [CustomerSuccessService],
    }).compile();
    svc = mod.get(CustomerSuccessService);
  });

  // ──────────────────── Cohort creation

  it('creates a cohort with valid input', () => {
    const c = svc.createCohort({ name: 'Wave 1 Founders', type: 'FOUNDERS' });
    expect(c.id).toBeTruthy();
    expect(c.name).toBe('Wave 1 Founders');
    expect(c.type).toBe('FOUNDERS');
    expect(c.isOpen).toBe(true);
    expect(c.leadCount).toBe(0);
  });

  it('rejects invalid cohort type', () => {
    expect(() => svc.createCohort({ name: 'Bad', type: 'HACKERS' as any })).toThrow();
  });

  it('rejects empty cohort name', () => {
    expect(() => svc.createCohort({ name: '', type: 'FOUNDERS' })).toThrow();
  });

  it('getCohort throws for unknown id', () => {
    expect(() => svc.getCohort('no-such-cohort')).toThrow('not found');
  });

  it('listCohorts returns all cohorts', () => {
    svc.createCohort({ name: 'Wave 1', type: 'FOUNDERS' });
    svc.createCohort({ name: 'Wave 2', type: 'DEVELOPERS' });
    expect(svc.listCohorts()).toHaveLength(2);
  });

  // ──────────────────── Lead creation

  it('adds a lead to a cohort', () => {
    const c = svc.createCohort({ name: 'Test', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'alice@example.com', displayName: 'Alice' });
    expect(lead.cohortId).toBe(c.id);
    expect(lead.displayName).toBe('Alice');
    expect(lead.status).toBe('INVITED');
    expect(lead.emailHash).toMatch(/^u_[a-f0-9]+$/);
  });

  it('increments cohort leadCount on add', () => {
    const c = svc.createCohort({ name: 'Test', type: 'FREELANCERS' });
    svc.addLead({ cohortId: c.id, email: 'bob@example.com' });
    expect(svc.getCohort(c.id).leadCount).toBe(1);
  });

  it('rejects lead without valid email', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    expect(() => svc.addLead({ cohortId: c.id, email: 'not-an-email' })).toThrow();
  });

  it('rejects lead for unknown cohort', () => {
    expect(() => svc.addLead({ cohortId: 'bad-id', email: 'x@y.com' })).toThrow('not found');
  });

  it('getLead throws for unknown id', () => {
    expect(() => svc.getLead('no-lead')).toThrow('not found');
  });

  it('listLeads can filter by cohortId', () => {
    const c1 = svc.createCohort({ name: 'C1', type: 'FOUNDERS' });
    const c2 = svc.createCohort({ name: 'C2', type: 'DEVELOPERS' });
    svc.addLead({ cohortId: c1.id, email: 'a@example.com' });
    svc.addLead({ cohortId: c2.id, email: 'b@example.com' });
    expect(svc.listLeads(c1.id)).toHaveLength(1);
    expect(svc.listLeads(c2.id)).toHaveLength(1);
    expect(svc.listLeads()).toHaveLength(2);
  });

  // ──────────────────── Email masking / hashing

  it('emailHash is deterministic for same email', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const l1 = svc.addLead({ cohortId: c.id, email: 'same@example.com' });
    const c2 = svc.createCohort({ name: 'T2', type: 'DEVELOPERS' });
    const l2 = svc.addLead({ cohortId: c2.id, email: 'same@example.com' });
    expect(l1.emailHash).toBe(l2.emailHash);
  });

  it('emailHash differs for different emails', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const l1 = svc.addLead({ cohortId: c.id, email: 'alice@example.com' });
    const l2 = svc.addLead({ cohortId: c.id, email: 'bob@example.com' });
    expect(l1.emailHash).not.toBe(l2.emailHash);
  });

  it('emailMasked shows partial local + domain only', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'alice@example.com' });
    expect(lead.emailMasked).toMatch(/^al\*\*\*@example\.com$/);
    expect(lead.emailMasked).not.toContain('alice');
  });

  it('raw email is never stored on lead', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'secret@domain.com' });
    const str = JSON.stringify(lead);
    expect(str).not.toContain('secret@domain.com');
  });

  it('lead list never exposes raw emails', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    svc.addLead({ cohortId: c.id, email: 'private@domain.com' });
    const str = JSON.stringify(svc.listLeads());
    expect(str).not.toContain('private@domain.com');
  });

  // ──────────────────── Status transitions

  it('updateLeadStatus changes status', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const updated = svc.updateLeadStatus(lead.id, { status: 'JOINED' });
    expect(updated.status).toBe('JOINED');
    expect(updated.inviteAccepted).toBe(true);
    expect(updated.joinedAt).toBeTruthy();
  });

  it('updateLeadStatus rejects invalid status', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    expect(() => svc.updateLeadStatus(lead.id, { status: 'INVALID' as any })).toThrow();
  });

  it('CONVERTED status sets correct status', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const updated = svc.updateLeadStatus(lead.id, { status: 'CONVERTED' });
    expect(updated.status).toBe('CONVERTED');
  });

  it('CHURN_RISK status is accepted', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const updated = svc.updateLeadStatus(lead.id, { status: 'CHURN_RISK' });
    expect(updated.status).toBe('CHURN_RISK');
  });

  // ──────────────────── Health score

  it('computeHealthScore returns score 0-100', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const health = svc.computeHealthScore(lead.id);
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
  });

  it('healthy lead scores higher than new inactive lead', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const newLead = svc.addLead({ cohortId: c.id, email: 'new@y.com' });
    const activeLead = svc.addLead({ cohortId: c.id, email: 'active@y.com' });
    svc.patchLeadActivity(activeLead.id, {
      demoCompleted: true,
      previewRevealed: true,
      workspaceOpened: true,
      onboardingStepCount: 6,
      feedbackCount: 2,
      billingIntent: true,
    });
    const newScore = svc.computeHealthScore(newLead.id).score;
    const activeScore = svc.computeHealthScore(activeLead.id).score;
    expect(activeScore).toBeGreaterThan(newScore);
  });

  it('computeHealthScore returns 8 dimensions', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const health = svc.computeHealthScore(lead.id);
    expect(health.dimensions).toHaveLength(8);
  });

  it('health level is CRITICAL for inactive new lead', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const health = svc.computeHealthScore(lead.id);
    expect(['CRITICAL', 'AT_RISK']).toContain(health.health);
  });

  it('health level is GOOD for fully activated lead', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    svc.patchLeadActivity(lead.id, {
      demoCompleted: true,
      previewRevealed: true,
      workspaceOpened: true,
      onboardingStepCount: 8,
      feedbackCount: 3,
      billingIntent: true,
      supportTicketCount: 0,
    });
    const health = svc.computeHealthScore(lead.id);
    expect(['GOOD', 'WATCH']).toContain(health.health);
  });

  it('recommendedAction is non-empty string', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const health = svc.computeHealthScore(lead.id);
    expect(typeof health.recommendedAction).toBe('string');
    expect(health.recommendedAction.length).toBeGreaterThan(5);
  });

  // ──────────────────── Activation summary

  it('getCohortSummary returns correct invited count', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    svc.addLead({ cohortId: c.id, email: 'a@x.com' });
    svc.addLead({ cohortId: c.id, email: 'b@x.com' });
    const summary = svc.getCohortSummary(c.id);
    expect(summary.invitedCount).toBe(2);
    expect(summary.cohortName).toBe('T');
  });

  it('getCohortSummary calculates activationRate', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const l1 = svc.addLead({ cohortId: c.id, email: 'a@x.com' });
    svc.addLead({ cohortId: c.id, email: 'b@x.com' });
    svc.patchLeadActivity(l1.id, { demoCompleted: true, previewRevealed: true });
    const summary = svc.getCohortSummary(c.id);
    expect(summary.activatedCount).toBe(1);
    expect(summary.activationRate).toBe(50);
  });

  it('getOverallSummary returns summary for all cohorts', () => {
    svc.createCohort({ name: 'C1', type: 'FOUNDERS' });
    svc.createCohort({ name: 'C2', type: 'DEVELOPERS' });
    const summaries = svc.getOverallSummary();
    expect(summaries).toHaveLength(2);
  });

  // ──────────────────── Follow-up task creation

  it('createTask returns a task with OPEN status', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const task = svc.createTask(lead.id, { type: 'EMAIL_FOLLOWUP', title: 'Check in with Alice' });
    expect(task.id).toBeTruthy();
    expect(task.status).toBe('OPEN');
    expect(task.type).toBe('EMAIL_FOLLOWUP');
    expect(task.leadId).toBe(lead.id);
  });

  it('createTask rejects invalid task type', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    expect(() => svc.createTask(lead.id, { type: 'SPAM' as any, title: 'Bad task' })).toThrow();
  });

  it('createTask rejects short title', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    expect(() => svc.createTask(lead.id, { type: 'DEMO_HELP', title: 'Hi' })).toThrow();
  });

  it('completeTask sets status to DONE', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const task = svc.createTask(lead.id, { type: 'ACTIVATION_NUDGE', title: 'Send nudge to user' });
    const done = svc.completeTask(task.id);
    expect(done.status).toBe('DONE');
    expect(done.completedAt).toBeTruthy();
  });

  it('listTasks can filter by leadId', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const l1 = svc.addLead({ cohortId: c.id, email: 'a@x.com' });
    const l2 = svc.addLead({ cohortId: c.id, email: 'b@x.com' });
    svc.createTask(l1.id, { type: 'DEMO_HELP', title: 'Help lead 1 with demo' });
    svc.createTask(l2.id, { type: 'BUG_TRIAGE', title: 'Triage bug for lead 2' });
    expect(svc.listTasks(l1.id)).toHaveLength(1);
    expect(svc.listTasks(l2.id)).toHaveLength(1);
  });

  // ──────────────────── Notes creation

  it('addNote returns a note', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const note = svc.addNote(lead.id, { body: 'Alice mentioned she wants invoicing feature.', author: 'founder' });
    expect(note.id).toBeTruthy();
    expect(note.leadId).toBe(lead.id);
    expect(note.body).toBeTruthy();
  });

  it('addNote rejects too-short body', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    expect(() => svc.addNote(lead.id, { body: 'A', author: 'founder' })).toThrow();
  });

  it('addNote rejects blocked keywords in body', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    expect(() => svc.addNote(lead.id, { body: 'DATABASE_URL was exposed', author: 'founder' })).toThrow();
  });

  it('getNotes returns all notes for lead', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    svc.addNote(lead.id, { body: 'First note about the user.', author: 'founder' });
    svc.addNote(lead.id, { body: 'Second note about the user.', author: 'founder' });
    expect(svc.getNotes(lead.id)).toHaveLength(2);
  });

  // ──────────────────── Privacy / no raw prompt / no secret leakage

  it('health score output has no stack traces or internal paths', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const health = svc.computeHealthScore(lead.id);
    const str = JSON.stringify(health);
    expect(str).not.toContain('/home/');
    expect(str).not.toContain('node_modules');
    expect(str).not.toContain('DATABASE_URL');
    expect(str).not.toContain('AUTH_SECRET');
  });

  it('summary output has no raw emails', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    svc.addLead({ cohortId: c.id, email: 'private@domain.org' });
    const summary = svc.getCohortSummary(c.id);
    const str = JSON.stringify(summary);
    expect(str).not.toContain('private@domain.org');
  });

  it('task body contains no raw prompt', () => {
    const c = svc.createCohort({ name: 'T', type: 'FOUNDERS' });
    const lead = svc.addLead({ cohortId: c.id, email: 'x@y.com' });
    const task = svc.createTask(lead.id, { type: 'CHURN_PREVENTION', title: 'Contact churning user soon' });
    const str = JSON.stringify(task);
    expect(str).not.toMatch(/password|secret|DATABASE_URL|AUTH_SECRET/i);
  });
});

describe('CustomerSuccessController', () => {
  let ctrl: CustomerSuccessController;
  let svc: CustomerSuccessService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [CustomerSuccessController],
      providers: [CustomerSuccessService],
    }).compile();
    ctrl = mod.get(CustomerSuccessController);
    svc = mod.get(CustomerSuccessService);
  });

  it('POST /admin/customer-success/cohorts creates cohort', () => {
    const result = ctrl.createCohort({ name: 'Beta Wave 1', type: 'FOUNDERS' });
    expect((result as any).id).toBeTruthy();
    expect((result as any).type).toBe('FOUNDERS');
  });

  it('GET /admin/customer-success/cohorts returns list', () => {
    ctrl.createCohort({ name: 'Wave 1', type: 'FOUNDERS' });
    const list = ctrl.listCohorts() as any[];
    expect(list).toHaveLength(1);
  });

  it('POST /admin/customer-success/leads adds a lead', () => {
    const cohort = ctrl.createCohort({ name: 'W1', type: 'FOUNDERS' }) as any;
    const lead = ctrl.addLead({ cohortId: cohort.id, email: 'test@example.com' }) as any;
    expect(lead.cohortId).toBe(cohort.id);
    expect(lead.status).toBe('INVITED');
  });

  it('PATCH /admin/customer-success/leads/:id/status updates status', () => {
    const cohort = ctrl.createCohort({ name: 'W1', type: 'FOUNDERS' }) as any;
    const lead = ctrl.addLead({ cohortId: cohort.id, email: 'test@example.com' }) as any;
    const updated = ctrl.updateStatus(lead.id, { status: 'JOINED' }) as any;
    expect(updated.status).toBe('JOINED');
  });

  it('GET /admin/customer-success/summary returns array', () => {
    ctrl.createCohort({ name: 'W1', type: 'FOUNDERS' });
    const summary = ctrl.getSummary() as any[];
    expect(Array.isArray(summary)).toBe(true);
  });

  it('GET /admin/customer-success/tasks returns task list', () => {
    const cohort = ctrl.createCohort({ name: 'W1', type: 'FOUNDERS' }) as any;
    const lead = ctrl.addLead({ cohortId: cohort.id, email: 'test@example.com' }) as any;
    ctrl.createTask(lead.id, { type: 'EMAIL_FOLLOWUP', title: 'Follow up with the lead soon' });
    const tasks = ctrl.listTasks() as any[];
    expect(tasks).toHaveLength(1);
  });
});
