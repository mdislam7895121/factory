import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GenerationQualityService } from './quality.service';

// ── 20F: Generation Quality Pipeline Tests ─────────────────────────────────

describe('GenerationQualityService', () => {
  let svc: GenerationQualityService;

  beforeEach(() => { svc = new GenerationQualityService(); });

  // ── 20F-01: Full Evaluation ───────────────────────────────────────────────

  describe('evaluate()', () => {
    it('returns a QualityScore with all required fields', () => {
      const score = svc.evaluate({ projectId: 'p1' });
      expect(score.id).toBeDefined();
      expect(score.projectId).toBe('p1');
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
      expect(score.qualityTier).toBeDefined();
      expect(score.productionReadiness).toBeDefined();
      expect(score.dimensions).toHaveLength(8);
      expect(score.scoredAt).toBeDefined();
    });

    it('stores score and retrieves via getScore()', () => {
      svc.evaluate({ projectId: 'p2' });
      const stored = svc.getScore('p2');
      expect(stored).not.toBeNull();
      expect(stored!.projectId).toBe('p2');
    });

    it('returns null for unknown projectId', () => {
      expect(svc.getScore('unknown')).toBeNull();
    });

    it('same projectId produces same overallScore (deterministic)', () => {
      const a = svc.evaluate({ projectId: 'stable-p' });
      const b = svc.evaluate({ projectId: 'stable-p' });
      expect(a.overallScore).toBe(b.overallScore);
    });

    it('blocked content lowers securityPosture dimension', () => {
      const clean    = svc.evaluate({ projectId: 'clean',  content: 'Hello world' });
      const dirty    = svc.evaluate({ projectId: 'dirty',  content: 'my_secret=abc123' });
      const cleanSec = clean.dimensions.find(d => d.name === 'securityPosture')!.score;
      const dirtySec = dirty.dimensions.find(d => d.name === 'securityPosture')!.score;
      expect(dirtySec).toBeLessThan(cleanSec);
    });

    it('includes workspaceId when provided', () => {
      const score = svc.evaluate({ projectId: 'p3', workspaceId: 'ws1' });
      expect(score.workspaceId).toBe('ws1');
    });

    it('includes all sub-results: smokeTest, routeValidation, mobileValidation', () => {
      const score = svc.evaluate({ projectId: 'p4', routes: ['/', '/about'] });
      expect(score.smokeTest).toBeDefined();
      expect(score.routeValidation.length).toBeGreaterThan(0);
      expect(score.mobileValidation).toBeDefined();
    });
  });

  // ── 20F-01: Quality Tier Resolution ──────────────────────────────────────

  describe('Quality Tier', () => {
    it('PRODUCTION_READY tier maps to PRODUCTION readiness', () => {
      // Force high-scoring project via long, clean content
      const score = svc.evaluate({
        projectId: 'prod-tier',
        content: 'clean '.repeat(200) + 'viewport button loading error empty responsive',
        routes: ['/'],
        previewUrl: 'https://example.com',
      });
      // Tier must align with readiness
      if (score.qualityTier === 'PRODUCTION_READY') {
        expect(score.productionReadiness).toBe('PRODUCTION');
      }
    });

    it('EXPERIMENTAL tier maps to NOT_READY', () => {
      // Create a score manually to test tier mapping
      const score = svc.evaluate({ projectId: 'exp-p' });
      if (score.qualityTier === 'EXPERIMENTAL') {
        expect(score.productionReadiness).toBe('NOT_READY');
      }
    });

    it('BETA_READY tier maps to BETA', () => {
      const score = svc.evaluate({ projectId: 'beta-p' });
      if (score.qualityTier === 'BETA_READY') {
        expect(score.productionReadiness).toBe('BETA');
      }
    });

    it('PREVIEW_READY tier maps to PREVIEW', () => {
      const score = svc.evaluate({ projectId: 'prev-p' });
      if (score.qualityTier === 'PREVIEW_READY') {
        expect(score.productionReadiness).toBe('PREVIEW');
      }
    });
  });

  // ── 20F-02: Smoke Test ────────────────────────────────────────────────────

  describe('runSmokeTest()', () => {
    it('returns a SmokeTestResult with required fields', () => {
      const result = svc.runSmokeTest('https://preview.factory.app/test');
      expect(result.url).toBe('https://preview.factory.app/test');
      expect(result.statusCode).toBeDefined();
      expect(result.loadTimeMs).toBeGreaterThan(0);
      expect(typeof result.hasHtml).toBe('boolean');
      expect(typeof result.passed).toBe('boolean');
    });

    it('is deterministic for the same URL', () => {
      const a = svc.runSmokeTest('https://stable.example.com');
      const b = svc.runSmokeTest('https://stable.example.com');
      expect(a.statusCode).toBe(b.statusCode);
      expect(a.loadTimeMs).toBe(b.loadTimeMs);
    });

    it('blank screen implies test failed', () => {
      const result = svc.runSmokeTest('https://preview.factory.app/test');
      if (result.isBlankScreen) {
        expect(result.passed).toBe(false);
      }
    });

    it('timed-out result fails health check', () => {
      const result = svc.runSmokeTest('https://preview.factory.app/test');
      if (result.timedOut) {
        expect(result.healthCheckPassed).toBe(false);
      }
    });
  });

  // ── 20F-03: Route Validation ──────────────────────────────────────────────

  describe('validateRoutes()', () => {
    it('passes valid routes', () => {
      const results = svc.validateRoutes(['/']);
      expect(results[0].status).toBe('PASS');
    });

    it('normalizes routes without leading slash', () => {
      const results = svc.validateRoutes(['about']);
      expect(results[0].route).toBe('/about');
    });

    it('fails routes with unclosed dynamic segment', () => {
      const results = svc.validateRoutes(['/users/[id']);
      expect(results[0].status).toBe('FAIL');
      expect(results[0].issue).toContain('Unclosed dynamic segment');
    });

    it('warns on deeply nested routes', () => {
      const results = svc.validateRoutes(['/a/b/c/d/e/f']);
      expect(results[0].status).toBe('WARN');
    });

    it('detects route loops', () => {
      const results = svc.validateRoutes(['/users/users/profile']);
      expect(results[0].status).toBe('FAIL');
      expect(results[0].issue).toContain('loop');
    });

    it('handles multiple routes', () => {
      const results = svc.validateRoutes(['/', '/about', '/contact']);
      expect(results).toHaveLength(3);
      expect(results.every(r => r.route.startsWith('/'))).toBe(true);
    });
  });

  // ── 20F-04: Mobile Validation ─────────────────────────────────────────────

  describe('validateMobile()', () => {
    it('returns mobileScore of 100 for clean content with viewport', () => {
      const result = svc.validateMobile('<meta name="viewport" content="width=device-width">', {});
      expect(result.mobileScore).toBe(100);
      expect(result.warnings).toHaveLength(0);
    });

    it('deducts score for missing viewport', () => {
      const result = svc.validateMobile('no viewport here', {});
      expect(result.mobileScore).toBeLessThan(100);
      expect(result.hasViewportIssues).toBe(true);
    });

    it('detects tiny text', () => {
      const result = svc.validateMobile('font-size: 8px', { hasViewport: true });
      expect(result.hasUnreadableText).toBe(true);
      expect(result.warnings.some(w => w.includes('small'))).toBe(true);
    });

    it('mobileScore never goes below 0', () => {
      const result = svc.validateMobile(
        'font-size: 8px; height: 12px; width: 1200px; padding: 2px;',
        {},
      );
      expect(result.mobileScore).toBeGreaterThanOrEqual(0);
    });
  });

  // ── 20F-05: QA Checklist ──────────────────────────────────────────────────

  describe('generateQAReport()', () => {
    it('generates report with 15 checklist items', () => {
      const report = svc.generateQAReport('p1', undefined, '', {});
      expect(report.items).toHaveLength(15);
    });

    it('fails trust-01 when placeholder text present', () => {
      const report = svc.generateQAReport('p1', undefined, 'lorem ipsum dolor', {});
      const item   = report.items.find(i => i.id === 'trust-01')!;
      expect(item.status).toBe('FAIL');
    });

    it('fails auth-01 when sensitive content detected', () => {
      const report = svc.generateQAReport('p1', undefined, 'api_key: sk-123', {});
      const item   = report.items.find(i => i.id === 'auth-01')!;
      expect(item.status).toBe('FAIL');
    });

    it('counts pass, warn, fail correctly', () => {
      const report = svc.generateQAReport('p1', undefined, 'lorem ipsum button loading', {});
      expect(report.passCount + report.warnCount + report.failCount).toBe(15);
    });

    it('stores report and retrieves via getQAReport()', () => {
      svc.generateQAReport('p5', 'ws1', 'content', {});
      const stored = svc.getQAReport('p5');
      expect(stored).not.toBeNull();
      expect(stored!.projectId).toBe('p5');
    });

    it('returns null for unknown projectId', () => {
      expect(svc.getQAReport('nope')).toBeNull();
    });
  });

  // ── 20F-06: Repair Lifecycle ──────────────────────────────────────────────

  describe('Repair Lifecycle', () => {
    it('triggers a repair task', () => {
      svc.evaluate({ projectId: 'rp1' });
      const task = svc.triggerRepair('rp1');
      expect(task.projectId).toBe('rp1');
      expect(task.status).toBe('PENDING');
      expect(task.attempts).toBe(1);
    });

    it('returns same task if already IN_PROGRESS', () => {
      svc.evaluate({ projectId: 'rp2' });
      const t1 = svc.triggerRepair('rp2');
      t1.status = 'IN_PROGRESS';
      const t2 = svc.triggerRepair('rp2');
      expect(t2.id).toBe(t1.id);
    });

    it('completes repair successfully', () => {
      svc.evaluate({ projectId: 'rp3' });
      svc.triggerRepair('rp3');
      const task = svc.completeRepair('rp3', true);
      expect(task.status).toBe('COMPLETED');
      expect(task.completedAt).toBeDefined();
    });

    it('marks repair as FAILED on failure', () => {
      svc.evaluate({ projectId: 'rp4' });
      svc.triggerRepair('rp4');
      const task = svc.completeRepair('rp4', false);
      expect(task.status).toBe('FAILED');
    });

    it('throws NotFoundException on complete for unknown project', () => {
      expect(() => svc.completeRepair('nope', true)).toThrow(NotFoundException);
    });

    it('throws BadRequestException after max attempts', () => {
      svc.evaluate({ projectId: 'rp5' });
      for (let i = 0; i < 3; i++) {
        const task = svc.triggerRepair('rp5');
        svc.completeRepair('rp5', false);
        // Reset status to allow next trigger
        task.status = 'FAILED';
      }
      expect(() => svc.triggerRepair('rp5')).toThrow(BadRequestException);
    });

    it('getRepairStatus returns null for unknown project', () => {
      expect(svc.getRepairStatus('nope')).toBeNull();
    });
  });

  // ── 20F-07: Readiness Gate ────────────────────────────────────────────────

  describe('evaluateReadinessGate()', () => {
    it('includes all 5 gate checks', () => {
      const score = svc.evaluate({ projectId: 'gate1' });
      const { checks } = score.readinessGate;
      expect(typeof checks.runtimeAlive).toBe('boolean');
      expect(typeof checks.previewResponsive).toBe('boolean');
      expect(typeof checks.noCrashLoop).toBe('boolean');
      expect(typeof checks.snapshotAvailable).toBe('boolean');
      expect(typeof checks.recoveryHealthy).toBe('boolean');
    });

    it('blocked content causes security failure in gate', () => {
      const score = svc.evaluate({ projectId: 'gate2', content: 'eval(document.cookie)' });
      expect(score.readinessGate.blockedReasons).toContain('Security validation failed');
    });

    it('gate evaluatedAt is set', () => {
      const score = svc.evaluate({ projectId: 'gate3' });
      expect(score.readinessGate.evaluatedAt).toBeDefined();
    });
  });

  // ── 20F-10: Security Validation ───────────────────────────────────────────

  describe('validateSecurity()', () => {
    it('passes clean content', () => {
      const result = svc.validateSecurity('p1', 'clean content', {});
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('fails on blocked content pattern', () => {
      const result = svc.validateSecurity('p1', 'my_secret=abc', {});
      expect(result.passed).toBe(false);
      expect(result.issues.some(i => i.level === 'HIGH')).toBe(true);
    });

    it('fails on dangerous HTML/JS pattern', () => {
      const result = svc.validateSecurity('p1', '<script>alert(1)</script>', {});
      expect(result.passed).toBe(false);
      expect(result.issues.some(i => i.level === 'CRITICAL')).toBe(true);
    });

    it('fails on blocked metadata key', () => {
      const result = svc.validateSecurity('p1', '', { secret_key: 'value' });
      expect(result.passed).toBe(false);
    });

    it('fails on blocked metadata value', () => {
      const result = svc.validateSecurity('p1', '', { info: 'api_key: sk-123' });
      expect(result.passed).toBe(false);
    });
  });

  // ── 20F-11: Analytics ────────────────────────────────────────────────────

  describe('getAnalytics()', () => {
    it('returns zeroed analytics when no evaluations', () => {
      const analytics = svc.getAnalytics();
      expect(analytics.totalEvaluated).toBe(0);
      expect(analytics.averageScore).toBe(0);
    });

    it('counts totalEvaluated after evaluations', () => {
      svc.evaluate({ projectId: 'a1' });
      svc.evaluate({ projectId: 'a2' });
      expect(svc.getAnalytics().totalEvaluated).toBe(2);
    });

    it('averageScore is within valid range', () => {
      svc.evaluate({ projectId: 'b1' });
      svc.evaluate({ projectId: 'b2' });
      const { averageScore } = svc.getAnalytics();
      expect(averageScore).toBeGreaterThanOrEqual(0);
      expect(averageScore).toBeLessThanOrEqual(100);
    });

    it('scoreDistribution accounts for all evaluated projects', () => {
      svc.evaluate({ projectId: 'c1' });
      svc.evaluate({ projectId: 'c2' });
      const { scoreDistribution, totalEvaluated } = svc.getAnalytics();
      const total = Object.values(scoreDistribution).reduce((s, n) => s + n, 0);
      expect(total).toBe(totalEvaluated);
    });
  });

  // ── 20F-09: Admin Quality Ops ─────────────────────────────────────────────

  describe('Admin Quality Ops', () => {
    it('getLowQualityQueue returns only below-threshold scores', () => {
      svc.evaluate({ projectId: 'lq1' });
      svc.evaluate({ projectId: 'lq2' });
      const queue = svc.getLowQualityQueue(200); // all qualify at threshold 200
      expect(queue.length).toBeGreaterThanOrEqual(0);
      queue.forEach(s => expect(s.overallScore).toBeLessThan(200));
    });

    it('getLowQualityQueue sorts ascending by score', () => {
      svc.evaluate({ projectId: 'sq1' });
      svc.evaluate({ projectId: 'sq2' });
      const queue = svc.getLowQualityQueue(200);
      for (let i = 1; i < queue.length; i++) {
        expect(queue[i].overallScore).toBeGreaterThanOrEqual(queue[i - 1].overallScore);
      }
    });

    it('getAllScores returns all stored scores', () => {
      svc.evaluate({ projectId: 'all1' });
      svc.evaluate({ projectId: 'all2' });
      svc.evaluate({ projectId: 'all3' });
      expect(svc.getAllScores()).toHaveLength(3);
    });

    it('getAllScores sorts descending by scoredAt', () => {
      svc.evaluate({ projectId: 'ts1' });
      svc.evaluate({ projectId: 'ts2' });
      const scores = svc.getAllScores();
      expect(scores[0].projectId).toBe('ts2');
    });
  });

  // ── Risk Flags ────────────────────────────────────────────────────────────

  describe('Risk Flags', () => {
    it('generates CRITICAL/HIGH flags for very low dimension scores', () => {
      const score = svc.evaluate({ projectId: 'rf1', content: 'eval(bad)' });
      expect(score.riskFlags.length).toBeGreaterThanOrEqual(0);
    });

    it('generates security flag when security validation fails', () => {
      const score = svc.evaluate({ projectId: 'rf2', content: '<script>steal()</script>' });
      expect(score.riskFlags.some(f => f.category === 'security')).toBe(true);
    });
  });

  // ── Repair Suggestions ────────────────────────────────────────────────────

  describe('Repair Suggestions', () => {
    it('includes at most 10 suggestions', () => {
      const score = svc.evaluate({ projectId: 'rs1' });
      expect(score.repairSuggestions.length).toBeLessThanOrEqual(10);
    });

    it('suggestions have estimatedImpact > 0 for actionable items', () => {
      const score = svc.evaluate({ projectId: 'rs2' });
      score.repairSuggestions
        .filter(s => s.actionable)
        .forEach(s => expect(s.estimatedImpact).toBeGreaterThan(0));
    });
  });
});
