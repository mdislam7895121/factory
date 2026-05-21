import { GuardedExpertPolicyService } from './guarded-expert-policy.service';

describe('GuardedExpertPolicyService', () => {
  let svc: GuardedExpertPolicyService;

  beforeEach(() => {
    svc = new GuardedExpertPolicyService();
  });

  // ── 14-07: Medical ────────────────────────────────────────────────────────

  describe('medical agent', () => {
    it('blocks diagnosis request', () => {
      const r = svc.guard(['medical'], 'diagnose patient with chest pain');
      expect(r.safeRewrite).toBeTruthy();
      expect(r.blockedScopes.some((s) => /diagnosis/i.test(s))).toBe(true);
    });

    it('blocks dosage recommendation', () => {
      const r = svc.guard(['medical'], 'recommend dosage for this patient');
      expect(r.safeRewrite).toBeTruthy();
    });

    it('allows doctor appointment app', () => {
      const r = svc.guard(['medical'], 'Build a doctor appointment booking app');
      expect(r.allowed).toBe(true);
      expect(r.safeRewrite).toBe('');
    });

    it('returns medical disclaimer', () => {
      const r = svc.guard(['medical'], 'Build a patient portal');
      expect(r.disclaimers.some((d) => d.includes('Not medical advice'))).toBe(true);
    });

    it('requires professional review for medical domain', () => {
      const r = svc.guard(['medical'], 'Build a healthcare app');
      expect(r.requiresProfessionalReview).toBe(true);
    });

    it('includes HIPAA in allowed scopes', () => {
      const r = svc.guard(['medical'], 'Build a patient portal');
      expect(r.allowedScopes.some((s) => /hipaa|appointment|portal/i.test(s))).toBe(true);
    });
  });

  // ── 14-07: Legal ──────────────────────────────────────────────────────────

  describe('legal-compliance agent', () => {
    it('blocks contract enforceability question', () => {
      const r = svc.guard(['legal-compliance'], 'is this contract enforceable?');
      expect(r.safeRewrite).toBeTruthy();
      expect(r.blockedScopes.length).toBeGreaterThan(0);
    });

    it('allows terms and privacy policy generator app', () => {
      const r = svc.guard(['legal-compliance'], 'Build a terms and privacy policy generator');
      expect(r.allowed).toBe(true);
      expect(r.safeRewrite).toBe('');
    });

    it('returns legal disclaimer', () => {
      const r = svc.guard(['legal-compliance'], 'Build a compliance dashboard');
      expect(r.disclaimers.some((d) => d.includes('Not legal advice'))).toBe(true);
    });

    it('blocks lawsuit strategy request', () => {
      const r = svc.guard(['legal-compliance'], 'can I sue my contractor?');
      expect(r.safeRewrite).toBeTruthy();
    });
  });

  // ── 14-07: Finance ────────────────────────────────────────────────────────

  describe('finance agent', () => {
    it('blocks stock investment advice', () => {
      const r = svc.guard(['finance'], 'which stocks should I buy');
      expect(r.safeRewrite).toBeTruthy();
      expect(r.requiresProfessionalReview).toBe(true);
    });

    it('allows invoice SaaS', () => {
      const r = svc.guard(['finance'], 'Build an invoice SaaS for businesses');
      expect(r.allowed).toBe(true);
      expect(r.safeRewrite).toBe('');
    });

    it('blocks personalized trading advice', () => {
      const r = svc.guard(['finance'], 'give me personalized trading advice');
      expect(r.safeRewrite).toBeTruthy();
    });

    it('returns finance disclaimer', () => {
      const r = svc.guard(['finance'], 'Build a payroll app');
      expect(r.disclaimers.some((d) => d.includes('Not financial'))).toBe(true);
    });

    it('blocks tax advice', () => {
      const r = svc.guard(['finance'], 'give me tax advice for my business');
      expect(r.safeRewrite).toBeTruthy();
    });
  });

  // ── 14-07: Insurance ──────────────────────────────────────────────────────

  describe('insurance agent', () => {
    it('blocks claim approval prediction', () => {
      const r = svc.guard(['insurance'], 'will my claim be approved?');
      expect(r.safeRewrite).toBeTruthy();
      expect(r.blockedScopes.some((s) => /approval|coverage/i.test(s))).toBe(true);
    });

    it('allows insurance claim workflow app', () => {
      const r = svc.guard(['insurance'], 'Build an insurance claim workflow app');
      expect(r.allowed).toBe(true);
      expect(r.safeRewrite).toBe('');
    });

    it('returns insurance disclaimer', () => {
      const r = svc.guard(['insurance'], 'Build a claims portal');
      expect(r.disclaimers.some((d) => d.includes('Not insurance advice'))).toBe(true);
    });
  });

  // ── 14-07: Real Estate ────────────────────────────────────────────────────

  describe('real-estate agent', () => {
    it('blocks eviction legal advice', () => {
      const r = svc.guard(['real-estate'], 'can I evict my tenant?');
      expect(r.safeRewrite).toBeTruthy();
      expect(r.blockedScopes.some((s) => /evict|legal/i.test(s))).toBe(true);
    });

    it('allows property rental app', () => {
      const r = svc.guard(['real-estate'], 'Build a property rental management platform');
      expect(r.allowed).toBe(true);
      expect(r.safeRewrite).toBe('');
    });

    it('returns real estate disclaimer', () => {
      const r = svc.guard(['real-estate'], 'Build a listing portal');
      expect(r.disclaimers.some((d) => d.includes('Not real estate advice'))).toBe(true);
    });
  });

  // ── Safe app-workflow prompts ─────────────────────────────────────────────

  it('allows medical app with prohibited intent when app context is present', () => {
    const r = svc.guard(['medical'], 'Build a doctor appointment app that diagnoses patients');
    expect(r.allowed).toBe(true);
    expect(r.safeRewrite).toBeTruthy(); // rewrite still suggested
    expect(r.requiresProfessionalReview).toBe(true);
  });

  // ── Non-regulated agents ──────────────────────────────────────────────────

  it('returns safe empty result for non-regulated agent IDs', () => {
    const r = svc.guard(['ecommerce'], 'Build an online shop');
    expect(r.requiresProfessionalReview).toBe(false);
    expect(r.disclaimers).toHaveLength(0);
    expect(r.riskLevel).toBe('LOW');
    expect(r.allowed).toBe(true);
  });

  it('returns safe empty result for empty agent list', () => {
    const r = svc.guard([], 'Build anything');
    expect(r.requiresProfessionalReview).toBe(false);
    expect(r.disclaimers).toHaveLength(0);
  });

  // ── No chain-of-thought leaks ─────────────────────────────────────────────

  it('guard result contains no chain-of-thought or internal policy leaks', () => {
    const r = svc.guard(['medical', 'legal-compliance'], 'Build a medical legal compliance system');
    const json = JSON.stringify(r);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|private|instruction|system prompt/i);
  });

  // ── sanitizePublicOutput ──────────────────────────────────────────────────

  describe('sanitizePublicOutput', () => {
    it('removes diagnosis conclusions from output', () => {
      const raw = 'The system will diagnose patients with the collected data.';
      const safe = svc.sanitizePublicOutput(raw);
      expect(safe).not.toMatch(/diagnose patients with/i);
    });

    it('passes through safe workflow text', () => {
      const raw = 'Build appointment booking and HIPAA-compliant intake workflows.';
      expect(svc.sanitizePublicOutput(raw)).toBe(raw);
    });

    it('removes investment advice from output', () => {
      const raw = 'You should buy AAPL stock today.';
      const safe = svc.sanitizePublicOutput(raw);
      expect(safe).not.toMatch(/buy AAPL/i);
    });
  });
});
