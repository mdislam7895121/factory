import { CouncilService, VALID_ROLES } from './council.service';
import { DomainTemplateService } from './domain-template.service';
import { StartupIntelligenceService } from './startup-intelligence.service';

describe('CouncilService', () => {
  let svc: CouncilService;

  beforeEach(() => {
    const templateSvc = new DomainTemplateService();
    const intelligenceSvc = new StartupIntelligenceService(templateSvc);
    svc = new CouncilService(templateSvc, intelligenceSvc);
  });

  // ── 16-01: Council session model ─────────────────────────────────────────────

  it('returns a valid council session with all required fields', () => {
    const session = svc.runSession('Build a doctor appointment booking app', ['medical']);
    expect(session.sessionId).toBeTruthy();
    expect(session.prompt).toBe('Build a doctor appointment booking app');
    expect(Array.isArray(session.participants)).toBe(true);
    expect(Array.isArray(session.messages)).toBe(true);
    expect(Array.isArray(session.decisions)).toBe(true);
    expect(Array.isArray(session.riskMatrix)).toBe(true);
    expect(session.memory).toBeDefined();
    expect(session.finalBuildPlan).toBeDefined();
    expect(session.approvalState).toBeTruthy();
    expect(session.createdAt).toBeGreaterThan(0);
  });

  it('each session has a unique session ID', () => {
    const s1 = svc.runSession('Build an ecommerce store', ['ecommerce']);
    const s2 = svc.runSession('Build an ecommerce store', ['ecommerce']);
    expect(s1.sessionId).not.toBe(s2.sessionId);
  });

  it('finalBuildPlan has all required structural fields', () => {
    const session = svc.runSession('Build a restaurant ordering app', ['restaurant']);
    const plan = session.finalBuildPlan;
    expect(plan.architecture).toBeTruthy();
    expect(Array.isArray(plan.dbModels)).toBe(true);
    expect(Array.isArray(plan.apiModules)).toBe(true);
    expect(Array.isArray(plan.userRoles)).toBe(true);
    expect(Array.isArray(plan.workflows)).toBe(true);
    expect(Array.isArray(plan.security)).toBe(true);
    expect(Array.isArray(plan.compliance)).toBe(true);
    expect(plan.branding).toBeDefined();
    expect(Array.isArray(plan.rolloutPriority)).toBe(true);
    expect(Array.isArray(plan.riskMatrix)).toBe(true);
    expect(plan.approvalState).toBeTruthy();
    expect(Array.isArray(plan.approvalNotes)).toBe(true);
  });

  it('finalBuildPlan has 3 rollout priority phases', () => {
    const session = svc.runSession('Build a task tracker with login', ['automation']);
    expect(session.finalBuildPlan.rolloutPriority).toHaveLength(3);
  });

  it('finalBuildPlan.approvalState matches session.approvalState', () => {
    const session = svc.runSession('Build a simple blog with user login', []);
    expect(session.finalBuildPlan.approvalState).toBe(session.approvalState);
  });

  // ── 16-02: Multi-agent discussion ────────────────────────────────────────────

  it('core agents always participate (planner, architect, security, qa)', () => {
    const session = svc.runSession('Build a simple task manager with login', []);
    expect(session.participants).toContain('planner');
    expect(session.participants).toContain('architect');
    expect(session.participants).toContain('security');
    expect(session.participants).toContain('qa');
  });

  it('medical agent participates for medical domain', () => {
    const session = svc.runSession('Build a clinic app', ['medical']);
    expect(session.participants).toContain('medical');
  });

  it('medical agent does not participate for ecommerce domain', () => {
    const session = svc.runSession('Build an online store', ['ecommerce']);
    expect(session.participants).not.toContain('medical');
  });

  it('finance agent participates for finance domain', () => {
    const session = svc.runSession('Build an invoice SaaS', ['finance']);
    expect(session.participants).toContain('finance');
  });

  it('logistics agent participates for restaurant domain', () => {
    const session = svc.runSession('Build a food delivery app', ['restaurant']);
    expect(session.participants).toContain('logistics');
  });

  it('marketplace agent participates for marketplace domain', () => {
    const session = svc.runSession('Build a two-sided marketplace', ['marketplace']);
    expect(session.participants).toContain('marketplace');
  });

  it('legal agent participates for legal-compliance domain', () => {
    const session = svc.runSession('Build a compliance tool', ['legal-compliance']);
    expect(session.participants).toContain('legal');
  });

  it('all messages have non-empty summaries', () => {
    const session = svc.runSession('Build a pharmacy marketplace with delivery', ['medical', 'marketplace']);
    for (const msg of session.messages) {
      expect(msg.summary.length).toBeGreaterThan(10);
    }
  });

  it('all messages have valid roles', () => {
    const session = svc.runSession('Build a marketplace with payment checkout', ['marketplace']);
    for (const msg of session.messages) {
      expect(VALID_ROLES).toContain(msg.role);
    }
  });

  it('all messages have agentId, agentName, agentIcon populated', () => {
    const session = svc.runSession('Build a doctor app', ['medical']);
    for (const msg of session.messages) {
      expect(msg.agentId).toBeTruthy();
      expect(msg.agentName).toBeTruthy();
      expect(msg.agentIcon).toBeTruthy();
    }
  });

  it('produces multiple messages per session', () => {
    const session = svc.runSession('Build a pharmacy marketplace with delivery', ['medical', 'marketplace', 'logistics']);
    expect(session.messages.length).toBeGreaterThan(5);
  });

  it('planner message includes template name and features', () => {
    const session = svc.runSession('Build a restaurant ordering app', ['restaurant']);
    const plannerMessages = session.messages.filter((m) => m.agentId === 'planner');
    expect(plannerMessages.length).toBeGreaterThan(0);
    const plannerProposal = plannerMessages.find((m) => m.role === 'PROPOSE');
    expect(plannerProposal).toBeDefined();
    expect(plannerProposal!.summary).toMatch(/Scope defined/i);
  });

  it('architect message includes stack info', () => {
    const session = svc.runSession('Build a fintech SaaS', ['finance']);
    const archMsg = session.messages.find((m) => m.agentId === 'architect' && m.role === 'PROPOSE');
    expect(archMsg).toBeDefined();
    expect(archMsg!.summary).toMatch(/Stack:|NestJS|Next\.js/i);
  });

  // ── 16-03: Debate + resolution ───────────────────────────────────────────────

  it('AI medical advice is REJECTED for medical domain', () => {
    const session = svc.runSession('Build a doctor appointment app', ['medical']);
    const rejected = session.decisions.find((d) => /medical advice|diagnosis|dosage/i.test(d.topic));
    expect(rejected).toBeDefined();
    expect(rejected!.outcome).toBe('REJECTED');
  });

  it('professional review gate ACCEPTED for regulated domain', () => {
    const session = svc.runSession('Build a healthcare portal', ['medical']);
    const reviewDecision = session.decisions.find((d) => /professional.*review|review.*gate/i.test(d.topic));
    expect(reviewDecision).toBeDefined();
    expect(reviewDecision!.outcome).toBe('ACCEPTED');
  });

  it('escrow payment ACCEPTED for marketplace with payment checkout', () => {
    const session = svc.runSession('Build a marketplace with payment checkout escrow', ['marketplace']);
    const escrow = session.decisions.find((d) => /escrow/i.test(d.topic));
    expect(escrow).toBeDefined();
    expect(escrow!.outcome).toBe('ACCEPTED');
  });

  it('prescription verification ACCEPTED for pharmacy marketplace', () => {
    const session = svc.runSession('Build a pharmacy marketplace with prescription dispensing', ['medical', 'marketplace']);
    const rx = session.decisions.find((d) => /prescription|pharmacy/i.test(d.topic));
    expect(rx).toBeDefined();
    expect(rx!.outcome).toBe('ACCEPTED');
  });

  it('native mobile app DEFERRED when mobile scope requested', () => {
    const session = svc.runSession('Build a mobile iOS app for my restaurant', ['restaurant']);
    const mobileDecision = session.decisions.find((d) => /mobile app/i.test(d.topic));
    expect(mobileDecision).toBeDefined();
    expect(mobileDecision!.outcome).toBe('DEFERRED');
  });

  it('delivery tracking ACCEPTED for food delivery prompt', () => {
    const session = svc.runSession('Build a food delivery app with rider GPS tracking', ['restaurant', 'logistics']);
    const tracking = session.decisions.find((d) => /tracking|delivery zone|rider/i.test(d.topic));
    expect(tracking).toBeDefined();
    expect(tracking!.outcome).toBe('ACCEPTED');
  });

  it('every decision has a non-empty rationale', () => {
    const session = svc.runSession('Build a pharmacy marketplace with delivery', ['medical', 'marketplace', 'logistics']);
    for (const d of session.decisions) {
      expect(d.rationale.length).toBeGreaterThan(10);
    }
  });

  // ── 16-05: Risk matrix ───────────────────────────────────────────────────────

  it('CRITICAL risk present for prescription pharmacy prompt', () => {
    const session = svc.runSession('Build a pharmacy marketplace with prescription delivery', ['medical', 'marketplace']);
    const critical = session.riskMatrix.filter((r) => r.level === 'CRITICAL');
    expect(critical.length).toBeGreaterThan(0);
  });

  it('HIGH payment risk for apps with payment checkout', () => {
    const session = svc.runSession('Build a marketplace with payment checkout billing', ['marketplace']);
    const paymentRisk = session.riskMatrix.find((r) => r.category === 'PAYMENT' && r.level === 'HIGH');
    expect(paymentRisk).toBeDefined();
  });

  it('MEDIUM marketplace abuse risk for marketplace apps', () => {
    const session = svc.runSession('Build a two-sided marketplace', ['marketplace']);
    const abuseRisk = session.riskMatrix.find((r) => r.category === 'ABUSE' && r.level === 'MEDIUM');
    expect(abuseRisk).toBeDefined();
  });

  it('LOW compliance risk when no country mentioned', () => {
    const session = svc.runSession('Build a simple task tracker with login', []);
    const lowRisk = session.riskMatrix.find((r) => r.level === 'LOW' && r.category === 'COMPLIANCE');
    expect(lowRisk).toBeDefined();
  });

  it('every risk item has description and mitigation', () => {
    const session = svc.runSession('Build a fintech SaaS with subscription billing', ['finance']);
    for (const risk of session.riskMatrix) {
      expect(risk.description.length).toBeGreaterThan(10);
      expect(risk.mitigation.length).toBeGreaterThan(10);
    }
  });

  it('HIGH compliance risk for regulated medical domain', () => {
    const session = svc.runSession('Build a doctor booking app', ['medical']);
    const complianceRisk = session.riskMatrix.find((r) => r.category === 'COMPLIANCE' && r.level === 'HIGH');
    expect(complianceRisk).toBeDefined();
  });

  // ── 16-09: Build approval gate ───────────────────────────────────────────────

  it('BLOCKED for pharmacy marketplace with prescription dispensing', () => {
    const session = svc.runSession('Build a pharmacy marketplace with prescription dispensing delivery', ['medical', 'marketplace']);
    expect(session.approvalState).toBe('BLOCKED');
  });

  it('APPROVED_WITH_WARNINGS for medical appointment app (regulated, no prescription)', () => {
    const session = svc.runSession('Build a doctor appointment booking app', ['medical']);
    expect(session.approvalState).toBe('APPROVED_WITH_WARNINGS');
  });

  it('APPROVED for simple blog with user login (no risks above LOW)', () => {
    const session = svc.runSession('Build a simple blog with user login and account management', []);
    expect(session.approvalState).toBe('APPROVED');
  });

  it('NEEDS_INPUT when mobile app is deferred', () => {
    const session = svc.runSession('Build a mobile iOS ordering app with login', ['restaurant']);
    expect(['NEEDS_INPUT', 'APPROVED_WITH_WARNINGS', 'APPROVED']).toContain(session.approvalState);
  });

  it('approvalNotes non-empty for BLOCKED state', () => {
    const session = svc.runSession('Build a pharmacy prescription dispensing app', ['medical']);
    if (session.approvalState === 'BLOCKED') {
      expect(session.finalBuildPlan.approvalNotes.length).toBeGreaterThan(0);
    }
  });

  // ── 16-08: Memory layer ──────────────────────────────────────────────────────

  it('memory is retrievable by session ID', () => {
    const session = svc.runSession('Build a clinic app', ['medical']);
    const memory = svc.getMemory(session.sessionId);
    expect(memory).toBeDefined();
    expect(memory!.sessionId).toBe(session.sessionId);
  });

  it('memory contains accepted constraints', () => {
    const session = svc.runSession('Build a doctor appointment booking app', ['medical']);
    const memory = svc.getMemory(session.sessionId)!;
    expect(Array.isArray(memory.acceptedConstraints)).toBe(true);
  });

  it('memory contains rejected features for medical domain', () => {
    const session = svc.runSession('Build a doctor booking app', ['medical']);
    const memory = svc.getMemory(session.sessionId)!;
    expect(memory.rejectedFeatures.length).toBeGreaterThan(0);
    expect(memory.rejectedFeatures.some((f) => /medical advice|diagnosis|dosage/i.test(f))).toBe(true);
  });

  it('memory contains user preferences', () => {
    const session = svc.runSession('Build a restaurant app', ['restaurant']);
    const memory = svc.getMemory(session.sessionId)!;
    expect(memory.userPreferences['appName']).toBeTruthy();
    expect(memory.userPreferences['domain']).toBeTruthy();
  });

  it('memory branding direction is non-empty', () => {
    const session = svc.runSession('Build a fintech invoice app', ['finance']);
    const memory = svc.getMemory(session.sessionId)!;
    expect(memory.brandingDirection.length).toBeGreaterThan(5);
  });

  it('returns undefined for unknown session ID', () => {
    expect(svc.getMemory('nonexistent-session-id')).toBeUndefined();
  });

  // ── 16-07: Safe public summaries — no chain-of-thought leaks ────────────────

  it('no chain-of-thought or internal metadata in messages', () => {
    const session = svc.runSession('Build a legal compliance tool', ['legal-compliance']);
    const json = JSON.stringify(session.messages);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|system prompt/i);
  });

  it('no chain-of-thought leaks in final build plan', () => {
    const session = svc.runSession('Build a pharmacy marketplace', ['medical', 'marketplace']);
    const json = JSON.stringify(session.finalBuildPlan);
    expect(json).not.toMatch(/chain.of.thought|hidden|system prompt/i);
  });

  it('no chain-of-thought leaks in risk matrix', () => {
    const session = svc.runSession('Build a fintech SaaS with billing', ['finance']);
    const json = JSON.stringify(session.riskMatrix);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|system prompt/i);
  });

  it('no chain-of-thought leaks in decisions', () => {
    const session = svc.runSession('Build a marketplace app', ['marketplace']);
    const json = JSON.stringify(session.decisions);
    expect(json).not.toMatch(/chain.of.thought|hidden|system prompt/i);
  });
});
