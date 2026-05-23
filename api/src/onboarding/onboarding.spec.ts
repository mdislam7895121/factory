import { Test } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';

describe('OnboardingService', () => {
  let svc: OnboardingService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [OnboardingService],
    }).compile();
    svc = mod.get(OnboardingService);
  });

  // Profile creation
  it('creates a new profile for unknown user', () => {
    const p = svc.createOrGet('user-001');
    expect(p.userId).toBe('user-001');
    expect(p.state).toBe('NEW');
    expect(p.completedSteps).toEqual([]);
    expect(p.skipped).toBe(false);
  });

  it('returns same profile on repeated createOrGet', () => {
    const a = svc.createOrGet('user-002');
    const b = svc.createOrGet('user-002');
    expect(a).toBe(b);
  });

  it('throws NotFoundException for getProfile on unknown user', () => {
    expect(() => svc.getProfile('no-such-user')).toThrow('not found');
  });

  it('rejects empty userId', () => {
    expect(() => svc.createOrGet('')).toThrow();
  });

  it('rejects userId longer than MAX', () => {
    expect(() => svc.createOrGet('x'.repeat(200))).toThrow();
  });

  it('rejects userId containing blocked meta key', () => {
    expect(() => svc.createOrGet('user-password-123')).toThrow();
  });

  // Step transitions
  it('records ROLE_SELECTED and advances to PROFILE_STARTED', () => {
    const p = svc.recordEvent('user-003', 'ROLE_SELECTED');
    expect(p.completedSteps).toContain('ROLE_SELECTED');
    expect(p.state).toBe('PROFILE_STARTED');
  });

  it('records IDEA_ENTERED and advances to IDEA_ENTERED', () => {
    const p = svc.recordEvent('user-004', 'IDEA_ENTERED');
    expect(p.state).toBe('IDEA_ENTERED');
  });

  it('records DEMO_STARTED and advances to DEMO_STARTED', () => {
    const p = svc.recordEvent('user-005', 'DEMO_STARTED');
    expect(p.state).toBe('DEMO_STARTED');
  });

  it('records BLUEPRINT_VIEWED and advances to BLUEPRINT_VIEWED', () => {
    const p = svc.recordEvent('user-006', 'BLUEPRINT_VIEWED');
    expect(p.state).toBe('BLUEPRINT_VIEWED');
  });

  it('records PREVIEW_REVEALED and advances to PREVIEW_REVEALED', () => {
    const p = svc.recordEvent('user-007', 'PREVIEW_REVEALED');
    expect(p.state).toBe('PREVIEW_REVEALED');
  });

  it('records WORKSPACE_CREATED and advances to WORKSPACE_OPENED', () => {
    const p = svc.recordEvent('user-008', 'WORKSPACE_CREATED');
    expect(p.state).toBe('WORKSPACE_OPENED');
  });

  it('does not downgrade state if lower step recorded later', () => {
    svc.recordEvent('user-010', 'PREVIEW_REVEALED');
    const p = svc.recordEvent('user-010', 'DEMO_STARTED');
    expect(p.state).toBe('PREVIEW_REVEALED');
  });

  it('does not duplicate completed steps', () => {
    svc.recordEvent('user-011', 'IDEA_ENTERED');
    svc.recordEvent('user-011', 'IDEA_ENTERED');
    const p = svc.getProfile('user-011');
    expect(p.completedSteps.filter(s => s === 'IDEA_ENTERED')).toHaveLength(1);
  });

  // Activation state
  it('activates user when IDEA_ENTERED + DEMO_STARTED + PREVIEW_REVEALED', () => {
    svc.recordEvent('user-012', 'IDEA_ENTERED');
    svc.recordEvent('user-012', 'DEMO_STARTED');
    const p = svc.recordEvent('user-012', 'PREVIEW_REVEALED');
    expect(p.state).toBe('ACTIVATED');
    expect(p.activatedAt).toBeTruthy();
  });

  it('does not activate with only DEMO_STARTED', () => {
    const p = svc.recordEvent('user-013', 'DEMO_STARTED');
    expect(p.state).not.toBe('ACTIVATED');
  });

  it('skipOnboarding marks profile as skipped', () => {
    const p = svc.skipOnboarding('user-014');
    expect(p.skipped).toBe(true);
  });

  it('skipped onboarding profile still works — next action returns non-null', () => {
    svc.skipOnboarding('user-015');
    const action = svc.getNextAction('user-015');
    expect(action).toBeDefined();
    expect(action.route).toBeTruthy();
  });

  // Stuck detection
  it('detectStuck returns null for ACTIVATED user', () => {
    svc.recordEvent('user-020', 'IDEA_ENTERED');
    svc.recordEvent('user-020', 'DEMO_STARTED');
    svc.recordEvent('user-020', 'PREVIEW_REVEALED');
    const result = svc.detectStuck('user-020');
    expect(result).toBeNull();
  });

  it('detectStuck returns null for unknown user', () => {
    const result = svc.detectStuck('unknown-xyz');
    expect(result).toBeNull();
  });

  it('detectStuck detects NO_PROMPT_ENTERED for NEW user', () => {
    svc.createOrGet('user-021');
    const result = svc.detectStuck('user-021');
    expect(result?.reason).toBe('NO_PROMPT_ENTERED');
    expect(result?.suggestedFix).toBeTruthy();
    expect(result?.nextBestAction.route).toBeTruthy();
  });

  it('detectStuck sets profile state to STUCK', () => {
    svc.createOrGet('user-022');
    svc.detectStuck('user-022');
    const profile = svc.getProfile('user-022');
    expect(profile.state).toBe('STUCK');
    expect(profile.stuckAt).toBeTruthy();
    expect(profile.stuckReason).toBe('NO_PROMPT_ENTERED');
  });

  it('recording an event after STUCK clears stuck state', () => {
    svc.createOrGet('user-023');
    svc.detectStuck('user-023');
    const p = svc.recordEvent('user-023', 'IDEA_ENTERED');
    expect(p.state).not.toBe('STUCK');
  });

  // Checklist generation
  it('getChecklist returns 9 items', () => {
    svc.createOrGet('user-030');
    const cl = svc.getChecklist('user-030');
    expect(cl.totalCount).toBe(9);
    expect(cl.completedCount).toBe(0);
    expect(cl.percentComplete).toBe(0);
  });

  it('getChecklist reflects completed steps', () => {
    svc.recordEvent('user-031', 'IDEA_ENTERED');
    svc.recordEvent('user-031', 'DEMO_STARTED');
    const cl = svc.getChecklist('user-031');
    const entered = cl.items.find(i => i.step === 'IDEA_ENTERED');
    const demo = cl.items.find(i => i.step === 'DEMO_STARTED');
    expect(entered?.completed).toBe(true);
    expect(demo?.completed).toBe(true);
    expect(cl.completedCount).toBe(2);
  });

  it('getChecklist works for unknown user (no profile)', () => {
    const cl = svc.getChecklist('user-no-profile');
    expect(cl.totalCount).toBe(9);
    expect(cl.completedCount).toBe(0);
  });

  // Next-best-action engine
  it('returns high priority action when no idea entered', () => {
    svc.createOrGet('user-040');
    const action = svc.getNextAction('user-040');
    expect(action.priority).toBe('HIGH');
    expect(action.route).toContain('/demo');
  });

  it('returns lower priority action for activated user', () => {
    svc.recordEvent('user-041', 'IDEA_ENTERED');
    svc.recordEvent('user-041', 'DEMO_STARTED');
    svc.recordEvent('user-041', 'PREVIEW_REVEALED');
    const action = svc.getNextAction('user-041');
    expect(action.priority).toBe('MEDIUM');
  });

  it('next action for unknown user points to onboarding', () => {
    const action = svc.getNextAction('totally-new-user');
    expect(action.route).toBe('/onboarding');
  });

  it('next action after preview suggests memory or quality', () => {
    svc.recordEvent('user-042', 'IDEA_ENTERED');
    svc.recordEvent('user-042', 'DEMO_STARTED');
    svc.recordEvent('user-042', 'PREVIEW_REVEALED');
    svc.recordEvent('user-042', 'MEMORY_SAVED');
    const action = svc.getNextAction('user-042');
    expect(action.route).toContain('/quality');
  });

  // Analytics
  it('getAnalytics returns zero totals on empty service', () => {
    const analytics = svc.getAnalytics();
    expect(analytics.total).toBe(0);
    expect(analytics.activatedCount).toBe(0);
    expect(analytics.stuckCount).toBe(0);
    expect(analytics.completionRate).toBe(0);
  });

  it('getAnalytics counts correctly', () => {
    svc.recordEvent('user-050', 'IDEA_ENTERED');
    svc.recordEvent('user-050', 'DEMO_STARTED');
    svc.recordEvent('user-050', 'PREVIEW_REVEALED');
    svc.createOrGet('user-051');
    const analytics = svc.getAnalytics();
    expect(analytics.total).toBe(2);
    expect(analytics.activatedCount).toBe(1);
    expect(analytics.byState['ACTIVATED']).toBe(1);
  });

  it('betaReadinessScore is a number 0-100', () => {
    const analytics = svc.getAnalytics();
    expect(analytics.betaReadinessScore).toBeGreaterThanOrEqual(0);
    expect(analytics.betaReadinessScore).toBeLessThanOrEqual(100);
  });

  // Safety: no PII / no raw prompt leakage
  it('meta with blocked key is silently dropped', () => {
    const p = svc.recordEvent('user-060', 'IDEA_ENTERED', { password: 'secret123', step: 'test' });
    expect(JSON.stringify(p)).not.toContain('secret123');
  });

  it('checklist labels do not contain raw prompts', () => {
    const cl = svc.getChecklist('user-061');
    for (const item of cl.items) {
      expect(item.label.length).toBeLessThan(100);
      expect(item.label).not.toMatch(/database_url|auth_secret/i);
    }
  });

  it('analytics output has no stack traces or internal paths', () => {
    const analytics = svc.getAnalytics();
    const str = JSON.stringify(analytics);
    expect(str).not.toContain('/home/');
    expect(str).not.toContain('node_modules');
    expect(str).not.toContain('DATABASE_URL');
    expect(str).not.toContain('AUTH_SECRET');
  });

  it('next action cta contains no raw email or PII', () => {
    const action = svc.getNextAction('user-070');
    const str = JSON.stringify(action);
    expect(str).not.toMatch(/@[a-z]+\.[a-z]+/);
    expect(str).not.toContain('password');
    expect(str).not.toContain('secret');
  });
});

describe('OnboardingController', () => {
  let ctrl: OnboardingController;
  let svc: OnboardingService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [OnboardingService],
    }).compile();
    ctrl = mod.get(OnboardingController);
    svc = mod.get(OnboardingService);
  });

  it('GET /v1/onboarding/:userId creates and returns profile', () => {
    const result = ctrl.getProfile('ctrl-user-001');
    expect(result.userId).toBe('ctrl-user-001');
    expect(result.state).toBe('NEW');
  });

  it('POST /v1/onboarding/:userId/event records valid step', () => {
    const result = ctrl.recordEvent('ctrl-user-002', { step: 'IDEA_ENTERED' });
    expect((result as any).completedSteps).toContain('IDEA_ENTERED');
  });

  it('POST /v1/onboarding/:userId/event rejects invalid step', () => {
    const result = ctrl.recordEvent('ctrl-user-003', { step: 'INVALID_STEP' });
    expect((result as any).error).toBeTruthy();
    expect((result as any).validSteps).toBeDefined();
  });

  it('GET /v1/onboarding/:userId/checklist returns checklist', () => {
    const result = ctrl.getChecklist('ctrl-user-004');
    expect((result as any).totalCount).toBe(9);
  });

  it('GET /v1/onboarding/:userId/next-action returns action', () => {
    const result = ctrl.getNextAction('ctrl-user-005');
    expect((result as any).route).toBeTruthy();
    expect((result as any).cta).toBeTruthy();
  });
});
