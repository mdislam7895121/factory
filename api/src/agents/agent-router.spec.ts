import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';

describe('PromptRouterService', () => {
  let router: PromptRouterService;

  beforeEach(() => {
    router = new PromptRouterService(new AgentClassifierService());
  });

  // ── 13-06: Always includes 10 core agents ──────────────────────────────────

  it('always includes all 10 core agents', () => {
    const r = router.route('Build a todo app');
    expect(r.coreAgents.length).toBe(10);
    expect(r.coreAgents.every((a) => a.kind === 'CORE')).toBe(true);
  });

  // ── Healthcare prompt (13-06) ──────────────────────────────────────────────

  describe('healthcare prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build a doctor appointment booking app for hospital patients');
    });

    it('selects medical/healthcare agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'medical')).toBe(true);
    });

    it('co-routes legal-compliance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'legal-compliance')).toBe(true);
    });

    it('risk level is HIGH', () => {
      expect(result.riskLevel).toBe('HIGH');
    });

    it('includes regulated warning for medical', () => {
      const w = result.regulatedWarnings.find((w) => w.agentId === 'medical');
      expect(w).toBeDefined();
      expect(w!.warning).toContain('will NOT provide diagnosis');
    });

    it('includes regulated warning disclaimer', () => {
      const w = result.regulatedWarnings.find((w) => w.agentId === 'medical');
      expect(w!.disclaimer).toContain('Not medical advice');
    });

    // 13-05: No licensed advice in output
    it('prohibits diagnosis in agent prohibitedOutputs', () => {
      const { AGENT_REGISTRY } = require('./agent-registry');
      const medAgent = AGENT_REGISTRY.find((a: { id: string }) => a.id === 'medical');
      expect(medAgent.prohibitedOutputs).toContain('medical diagnosis');
    });

    it('suggests healthcare template', () => {
      expect(result.suggestedTemplate).toBe('healthcare-portal');
    });

    it('returns non-empty nextActions', () => {
      expect(result.nextActions.length).toBeGreaterThan(0);
      expect(result.nextActions.some((a) => a.includes('HIPAA'))).toBe(true);
    });
  });

  // ── Finance prompt (13-06) ─────────────────────────────────────────────────

  describe('finance / invoice SaaS prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build an invoice and payroll SaaS for small businesses');
    });

    it('selects finance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'finance')).toBe(true);
    });

    it('co-routes legal-compliance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'legal-compliance')).toBe(true);
    });

    it('risk level is HIGH', () => {
      expect(result.riskLevel).toBe('HIGH');
    });

    it('no investment advice in finance regulated warnings', () => {
      const w = result.regulatedWarnings.find((w) => w.agentId === 'finance');
      expect(w).toBeDefined();
      expect(w!.warning).toContain('will NOT provide investment');
    });

    it('suggests fintech template', () => {
      expect(result.suggestedTemplate).toBe('fintech-saas');
    });
  });

  // ── Legal prompt (13-06) ───────────────────────────────────────────────────

  describe('legal / contract prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build a contract management platform with legal compliance');
    });

    it('selects legal-compliance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'legal-compliance')).toBe(true);
    });

    it('risk level is HIGH', () => {
      expect(result.riskLevel).toBe('HIGH');
    });

    it('disclaimer does not contain legal advice', () => {
      const w = result.regulatedWarnings.find((w) => w.agentId === 'legal-compliance');
      expect(w).toBeDefined();
      expect(w!.disclaimer).toContain('Not legal advice');
      expect(w!.warning).toContain('will NOT provide legal advice');
    });
  });

  // ── Marketplace prompt (13-06) ─────────────────────────────────────────────

  describe('marketplace prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build a peer-to-peer marketplace with vendor listings, commission splits, and multi-vendor support');
    });

    it('selects marketplace agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'marketplace')).toBe(true);
    });

    it('co-routes finance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'finance')).toBe(true);
    });

    it('co-routes legal-compliance agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'legal-compliance')).toBe(true);
    });

    it('risk level is HIGH', () => {
      expect(result.riskLevel).toBe('HIGH');
    });

    it('suggests marketplace template', () => {
      expect(result.suggestedTemplate).toBe('two-sided-marketplace');
    });
  });

  // ── Ecommerce prompt (13-06) ───────────────────────────────────────────────

  describe('ecommerce prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build an ecommerce shop with product catalog, cart, checkout, and orders');
    });

    it('selects ecommerce agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'ecommerce')).toBe(true);
    });

    it('co-routes customer-support agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'customer-support')).toBe(true);
    });

    it('suggests ecommerce template', () => {
      expect(result.suggestedTemplate).toBe('ecommerce-store');
    });
  });

  // ── Generic SaaS prompt (13-06) ────────────────────────────────────────────

  describe('generic SaaS prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      result = router.route('Build a full-stack SaaS application with user accounts and dashboard');
    });

    it('returns no domain agents or very few', () => {
      // Generic SaaS has no specific domain keywords
      expect(result.domainAgents.length).toBeLessThan(3);
    });

    it('risk level is LOW or MEDIUM', () => {
      expect(['LOW', 'MEDIUM']).toContain(result.riskLevel);
    });

    it('has no regulated warnings', () => {
      expect(result.regulatedWarnings.length).toBe(0);
    });
  });

  // ── Mixed-domain prompt (13-06) ────────────────────────────────────────────

  describe('mixed-domain prompt', () => {
    let result: ReturnType<PromptRouterService['route']>;

    beforeEach(() => {
      // Contains both healthcare + ecommerce keywords
      result = router.route(
        'Build a medical pharmacy ecommerce shop with patient ordering and prescription checkout',
      );
    });

    it('selects multiple domain agents', () => {
      expect(result.domainAgents.length).toBeGreaterThan(1);
    });

    it('includes medical domain agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'medical')).toBe(true);
    });

    it('includes ecommerce domain agent', () => {
      expect(result.domainAgents.some((a) => a.id === 'ecommerce')).toBe(true);
    });

    it('risk level is HIGH (medical is regulated)', () => {
      expect(result.riskLevel).toBe('HIGH');
    });

    it('has at least one regulated warning', () => {
      expect(result.regulatedWarnings.length).toBeGreaterThan(0);
    });
  });

  // ── reason summaries are public-safe (no chain-of-thought) ────────────────

  it('reason summaries contain no internal chain-of-thought', () => {
    const r = router.route('Build a hospital patient management system');
    for (const reason of r.reasonSummaries) {
      expect(reason).not.toMatch(/internal|hidden|chain.of.thought|private/i);
    }
  });

  // ── No duplicate agents ───────────────────────────────────────────────────

  it('does not include duplicate domain agents', () => {
    const r = router.route(
      'Build a marketplace with insurance claims, legal contracts, and real estate property listings',
    );
    const ids = r.domainAgents.map((a) => a.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });
});
