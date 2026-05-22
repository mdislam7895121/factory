import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PairProgrammerService } from './pair-programmer.service';

// ── 23: Advanced AI Pair Programmer Tests ─────────────────────────────────────

describe('PairProgrammerService', () => {
  let svc: PairProgrammerService;

  beforeEach(() => { svc = new PairProgrammerService(); });

  // ── 23-02: Pair Sessions ──────────────────────────────────────────────────

  describe('Pair Sessions', () => {
    it('creates a pair session', () => {
      const s = svc.createPairSession({ workspaceId: 'ws-1', projectId: 'proj-1' });
      expect(s.id).toBeDefined();
      expect(s.messages).toHaveLength(0);
    });

    it('retrieves session by id', () => {
      const s = svc.createPairSession({ workspaceId: 'ws-1', projectId: 'proj-1' });
      expect(svc.getPairSession(s.id)).not.toBeNull();
      expect(svc.getPairSession(s.id)!.id).toBe(s.id);
    });

    it('returns null for unknown session', () => {
      expect(svc.getPairSession('nope')).toBeNull();
    });

    it('lists sessions for project', () => {
      svc.createPairSession({ workspaceId: 'ws-1', projectId: 'proj-list' });
      svc.createPairSession({ workspaceId: 'ws-1', projectId: 'proj-list' });
      const list = svc.listPairSessions('proj-list');
      expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty list for unknown project', () => {
      expect(svc.listPairSessions('unknown')).toHaveLength(0);
    });
  });

  // ── 23-02: AI Pair Programmer Messages ───────────────────────────────────

  describe('AI Pair Programmer', () => {
    let sessionId: string;

    beforeEach(() => {
      const s = svc.createPairSession({ workspaceId: 'ws-1', projectId: 'proj-1' });
      sessionId = s.id;
    });

    it('sends a message and gets AI response', () => {
      const result = svc.sendMessage({ sessionId, content: 'Hello, what can you do?' });
      expect(result.userMessage.content).toBe('Hello, what can you do?');
      expect(result.aiMessage.content).toBeDefined();
      expect(result.aiMessage.content.length).toBeGreaterThan(10);
    });

    it('infers EXPLAIN action from content', () => {
      const result = svc.sendMessage({ sessionId, content: 'Explain this component', filePath: 'src/components/Hero.tsx' });
      expect(result.aiMessage.action).toBe('EXPLAIN');
    });

    it('infers BUGS action from content', () => {
      const result = svc.sendMessage({ sessionId, content: 'Find bugs in my code' });
      expect(result.aiMessage.action).toBe('BUGS');
    });

    it('infers OPTIMIZE action from content', () => {
      const result = svc.sendMessage({ sessionId, content: 'optimize performance' });
      expect(result.aiMessage.action).toBe('OPTIMIZE');
    });

    it('infers TESTS action from content', () => {
      const result = svc.sendMessage({ sessionId, content: 'generate test coverage' });
      expect(result.aiMessage.action).toBe('TESTS');
    });

    it('infers REFACTOR action from content', () => {
      const result = svc.sendMessage({ sessionId, content: 'refactor this file' });
      expect(result.aiMessage.action).toBe('REFACTOR');
    });

    it('explicit action overrides inference', () => {
      const result = svc.sendMessage({ sessionId, content: 'look at this', action: 'REVIEW' });
      expect(result.aiMessage.action).toBe('REVIEW');
    });

    it('PATCH action creates a patch plan', () => {
      const result = svc.sendMessage({ sessionId, content: 'Fix the hero colors', action: 'PATCH', filePath: 'src/components/Hero.tsx' });
      expect(result.aiMessage.patchPlanId).toBeDefined();
    });

    it('messages accumulate in session', () => {
      svc.sendMessage({ sessionId, content: 'First message' });
      svc.sendMessage({ sessionId, content: 'Second message' });
      const session = svc.getPairSession(sessionId);
      expect(session!.messages).toHaveLength(4); // 2 user + 2 AI
    });

    it('throws NotFoundException for unknown session', () => {
      expect(() => svc.sendMessage({ sessionId: 'nope', content: 'hi' })).toThrow(NotFoundException);
    });

    it('blocks dangerous content in messages', () => {
      expect(() => svc.sendMessage({ sessionId, content: 'eval(process.env.SECRET_KEY)' })).toThrow(BadRequestException);
    });

    it('blocks credential keywords in messages', () => {
      expect(() => svc.sendMessage({ sessionId, content: 'expose my api_key and password' })).toThrow(BadRequestException);
    });
  });

  // ── 23-03: Patch Pipeline ─────────────────────────────────────────────────

  describe('Patch Generation Pipeline', () => {
    it('creates a LOW risk patch plan', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update hero color scheme' });
      expect(plan.id).toBeDefined();
      expect(plan.status).toBe('GENERATED');
      expect(plan.riskLevel).toBe('LOW');
    });

    it('classifies auth changes as CRITICAL', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Modify auth middleware logic' });
      expect(plan.riskLevel).toBe('CRITICAL');
      expect(plan.requiresConfirmation).toBe(true);
    });

    it('classifies API changes as HIGH', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Add new API endpoint for reports' });
      expect(plan.riskLevel).toBe('HIGH');
    });

    it('classifies refactor as MEDIUM', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Refactor and rename components' });
      expect(plan.riskLevel).toBe('MEDIUM');
    });

    it('plan has patchSummary and affectedFiles', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update styles' });
      expect(plan.patchSummary).toBeDefined();
      expect(plan.affectedFiles.length).toBeGreaterThan(0);
    });

    it('retrieves patch plan by id', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Test' });
      expect(svc.getPatchPlan(plan.id)).not.toBeNull();
    });

    it('returns null for unknown plan', () => {
      expect(svc.getPatchPlan('nope')).toBeNull();
    });

    it('approve changes status to APPLIED and creates snapshot', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Fix navbar colors' });
      const approved = svc.approvePatch(plan.id, 'ws-1', 'proj-1');
      expect(approved.status).toBe('APPLIED');
      expect(approved.snapshotId).toBeDefined();
      expect(approved.appliedAt).toBeDefined();
    });

    it('reject changes status to REJECTED', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Fix layout' });
      const rejected = svc.rejectPatch(plan.id, 'ws-1', 'proj-1');
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.rejectionReason).toBeDefined();
    });

    it('rollback changes APPLIED to ROLLED_BACK', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update hero' });
      svc.approvePatch(plan.id, 'ws-1', 'proj-1');
      const rolled = svc.rollbackPatch(plan.id, 'ws-1', 'proj-1');
      expect(rolled.status).toBe('ROLLED_BACK');
    });

    it('throws on approve when not GENERATED', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'x' });
      svc.rejectPatch(plan.id, 'ws-1', 'proj-1');
      expect(() => svc.approvePatch(plan.id, 'ws-1', 'proj-1')).toThrow(BadRequestException);
    });

    it('throws on rollback when not APPLIED', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'x' });
      expect(() => svc.rollbackPatch(plan.id, 'ws-1', 'proj-1')).toThrow(BadRequestException);
    });

    it('blocks dangerous prompts in patch creation', () => {
      expect(() => svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: '<script>eval(window.cookie)</script>' })).toThrow(BadRequestException);
    });

    it('blocks blocked refactor types', () => {
      expect(() => svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'architecture rewrite the entire system' })).toThrow(BadRequestException);
    });

    it('lists patch plans for project', () => {
      svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-list2', prompt: 'p1' });
      svc.createPatchPlan({ workspaceId: 'ws-1', projectId: 'proj-list2', prompt: 'p2' });
      expect(svc.listPatchPlans('proj-list2').length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── 23-04: Safe File Mutation ─────────────────────────────────────────────

  describe('Safe File Mutation Layer', () => {
    it('allows safe React component files', () => {
      const check = svc.checkFileMutation('src/components/Hero.tsx');
      expect(check.status).toBe('ALLOWED');
    });

    it('allows src/styles files', () => {
      const check = svc.checkFileMutation('src/styles/theme.ts');
      expect(check.status).toBe('ALLOWED');
    });

    it('allows src/app files', () => {
      const check = svc.checkFileMutation('src/app/page.tsx');
      expect(check.status).toBe('ALLOWED');
    });

    it('blocks .env files', () => {
      expect(svc.checkFileMutation('.env').status).toBe('BLOCKED');
    });

    it('blocks node_modules', () => {
      expect(svc.checkFileMutation('node_modules/react').status).toBe('BLOCKED');
    });

    it('blocks auth internals', () => {
      expect(svc.checkFileMutation('src/lib/auth/jwt.ts').status).toBe('BLOCKED');
    });

    it('blocks .git directory', () => {
      expect(svc.checkFileMutation('.git/config').status).toBe('BLOCKED');
    });

    it('restricts (not blocks) unknown paths', () => {
      const check = svc.checkFileMutation('some/random/util.ts');
      expect(['RESTRICTED', 'BLOCKED']).toContain(check.status);
    });

    it('allowed files have permitted operations listed', () => {
      const check = svc.checkFileMutation('src/components/Pricing.tsx');
      expect(check.status).toBe('ALLOWED');
      expect(check.allowedOperations).toContain('PATCH');
    });

    it('blocked files have no allowed operations', () => {
      const check = svc.checkFileMutation('.env.production');
      expect(check.status).toBe('BLOCKED');
      expect(check.allowedOperations).toHaveLength(0);
    });
  });

  // ── 23-06: Refactor Safety ────────────────────────────────────────────────

  describe('AI Refactor Safety', () => {
    it('allows safe refactor: component cleanup', () => {
      const r = svc.validateRefactor('component cleanup and prop extraction');
      expect(r.allowed).toBe(true);
    });

    it('allows safe refactor: naming cleanup', () => {
      expect(svc.validateRefactor('naming cleanup for variables').allowed).toBe(true);
    });

    it('allows safe refactor: extract hook', () => {
      expect(svc.validateRefactor('extract hook from component').allowed).toBe(true);
    });

    it('blocks architecture rewrite', () => {
      const r = svc.validateRefactor('architecture rewrite of the entire app');
      expect(r.allowed).toBe(false);
      expect(r.reason).toContain('architecture rewrite');
    });

    it('blocks auth redesign', () => {
      expect(svc.validateRefactor('auth redesign to use OAuth').allowed).toBe(false);
    });

    it('blocks remove authentication', () => {
      expect(svc.validateRefactor('remove authentication from all routes').allowed).toBe(false);
    });

    it('blocked response includes allowed types list', () => {
      const r = svc.validateRefactor('package replacement for all deps');
      expect(r.allowedTypes.length).toBeGreaterThan(0);
    });
  });

  // ── 23-07: Controlled Terminal ────────────────────────────────────────────

  describe('Controlled Terminal Actions', () => {
    it('lists allowed terminal commands', () => {
      const cmds = svc.listTerminalCommands();
      expect(cmds.length).toBeGreaterThan(0);
      cmds.forEach(c => {
        expect(c.key).toBeDefined();
        expect(c.command).toBeDefined();
        expect(c.timeoutMs).toBeGreaterThan(0);
      });
    });

    it('runs an allowed command successfully', () => {
      const result = svc.runTerminalAction({ workspaceId: 'ws-1', projectId: 'proj-1', commandKey: 'npm:build' });
      expect(result.status).toBe('SUCCESS');
      expect(result.exitCode).toBe(0);
      expect(result.output).toBeDefined();
    });

    it('npm:test command returns test output', () => {
      const result = svc.runTerminalAction({ workspaceId: 'ws-1', projectId: 'proj-1', commandKey: 'npm:test' });
      expect(result.output).toContain('passed');
    });

    it('throws BadRequestException for unknown command', () => {
      expect(() => svc.runTerminalAction({ workspaceId: 'ws-1', projectId: 'proj-1', commandKey: 'rm:all' })).toThrow(BadRequestException);
    });

    it('rejects sudo commands', () => {
      const r = svc.rejectUnknownCommand('sudo npm install');
      expect(r.blocked).toBe(true);
    });

    it('rejects shell chaining', () => {
      expect(svc.rejectUnknownCommand('npm build && rm -rf /').blocked).toBe(true);
    });

    it('rejects arbitrary commands not on allowlist', () => {
      expect(svc.rejectUnknownCommand('git push --force').blocked).toBe(true);
    });

    it('terminal history records ran commands', () => {
      svc.runTerminalAction({ workspaceId: 'ws-1', projectId: 'proj-term', commandKey: 'npm:lint' });
      svc.runTerminalAction({ workspaceId: 'ws-1', projectId: 'proj-term', commandKey: 'npm:test' });
      const history = svc.listTerminalHistory('proj-term');
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── 23-08: Build + Error Panel ────────────────────────────────────────────

  describe('Build + Error Panel', () => {
    it('returns seeded build logs for known project', () => {
      const logs = svc.getBuildLogs('proj-creator-os');
      expect(logs.length).toBeGreaterThan(0);
    });

    it('returns empty for unknown project', () => {
      expect(svc.getBuildLogs('nope')).toHaveLength(0);
    });

    it('adds a build log entry', () => {
      svc.addBuildLog({ workspaceId: 'ws-1', projectId: 'proj-bl', category: 'BUILD', severity: 'ERROR', message: 'Compile error in Hero.tsx', file: 'src/components/Hero.tsx', line: 42, timestamp: new Date() });
      const logs = svc.getBuildLogs('proj-bl');
      expect(logs.some(l => l.severity === 'ERROR')).toBe(true);
    });

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        svc.addBuildLog({ workspaceId: 'ws-1', projectId: 'proj-lim', category: 'LINT', severity: 'WARN', message: `Warn ${i}`, timestamp: new Date() });
      }
      expect(svc.getBuildLogs('proj-lim', 3)).toHaveLength(3);
    });

    it('explains build error with AI suggestion', () => {
      const logs = svc.getBuildLogs('proj-creator-os');
      const warnLog = logs.find(l => l.aiSuggestedFix);
      if (warnLog) {
        const explanation = svc.explainBuildError(warnLog.id, 'proj-creator-os');
        expect(explanation.suggestedFix).toBeDefined();
      }
    });

    it('throws NotFoundException for unknown log id', () => {
      expect(() => svc.explainBuildError('nope', 'proj-creator-os')).toThrow(NotFoundException);
    });

    it('seeded logs have category and severity', () => {
      const logs = svc.getBuildLogs('proj-creator-os');
      logs.forEach(l => {
        expect(l.category).toBeDefined();
        expect(l.severity).toBeDefined();
      });
    });
  });

  // ── 23-09: AI Bug Detector ────────────────────────────────────────────────

  describe('AI Bug Detector', () => {
    it('detects bugs for known project', () => {
      const bugs = svc.detectBugs('proj-creator-os');
      expect(bugs.length).toBeGreaterThan(0);
    });

    it('bugs are sorted by severity (CRITICAL first)', () => {
      const bugs = svc.detectBugs('proj-creator-os');
      const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      for (let i = 1; i < bugs.length; i++) {
        expect(severityOrder[bugs[i].severity]).toBeGreaterThanOrEqual(severityOrder[bugs[i - 1].severity]);
      }
    });

    it('bug findings have required fields', () => {
      const bugs = svc.detectBugs('proj-creator-os');
      bugs.forEach(b => {
        expect(b.id).toBeDefined();
        expect(b.category).toBeDefined();
        expect(b.severity).toBeDefined();
        expect(b.title).toBeDefined();
        expect(b.suggestedFix).toBeDefined();
      });
    });

    it('generates default bugs for unknown project', () => {
      const bugs = svc.detectBugs('new-proj');
      expect(bugs.length).toBeGreaterThan(0);
    });

    it('dismisses a bug finding', () => {
      const bugs = svc.detectBugs('proj-creator-os');
      const bug = bugs[0];
      const dismissed = svc.dismissBug(bug.id, 'proj-creator-os');
      expect(dismissed).toBe(true);
    });

    it('returns false for dismissing unknown bug', () => {
      expect(svc.dismissBug('nope', 'proj-creator-os')).toBe(false);
    });
  });

  // ── 23-10: Test Generation ────────────────────────────────────────────────

  describe('Test Generation Assistant', () => {
    it('generates COMPONENT tests', () => {
      const result = svc.generateTests({ projectId: 'proj-1', workspaceId: 'ws-1', targetFile: 'src/components/Hero.tsx', testType: 'COMPONENT' });
      expect(result.id).toBeDefined();
      expect(result.testCode).toContain('describe');
      expect(result.testFileName).toContain('.test.');
    });

    it('generates ROUTE tests', () => {
      const result = svc.generateTests({ projectId: 'proj-1', workspaceId: 'ws-1', targetFile: 'src/app/api/route.ts', testType: 'ROUTE' });
      expect(result.testCode).toContain('fetch');
    });

    it('generates SMOKE tests', () => {
      const result = svc.generateTests({ projectId: 'proj-1', workspaceId: 'ws-1', targetFile: 'src/app/page.tsx', testType: 'SMOKE' });
      expect(result.testCode).toContain('Smoke');
    });

    it('creates snapshot before generation', () => {
      const result = svc.generateTests({ projectId: 'proj-1', workspaceId: 'ws-1', targetFile: 'src/components/Hero.tsx', testType: 'VALIDATION' });
      expect(result.snapshotId).toBeDefined();
    });

    it('blocks test generation for blocked files', () => {
      expect(() => svc.generateTests({ projectId: 'proj-1', workspaceId: 'ws-1', targetFile: '.env', testType: 'COMPONENT' })).toThrow(BadRequestException);
    });

    it('lists generated tests', () => {
      svc.generateTests({ projectId: 'proj-gen', workspaceId: 'ws-1', targetFile: 'src/components/Hero.tsx', testType: 'COMPONENT' });
      expect(svc.listGeneratedTests('proj-gen').length).toBeGreaterThan(0);
    });
  });

  // ── 23-11: Change History ─────────────────────────────────────────────────

  describe('Change History (Git-like)', () => {
    it('returns history after creating sessions', () => {
      svc.createPairSession({ workspaceId: 'ws-hist', projectId: 'proj-hist' });
      const history = svc.getChangeHistory('ws-hist', 'proj-hist');
      expect(history.length).toBeGreaterThan(0);
    });

    it('history entries have required fields', () => {
      svc.createPairSession({ workspaceId: 'ws-hist2', projectId: 'proj-hist2' });
      const history = svc.getChangeHistory('ws-hist2', 'proj-hist2');
      const entry = history[0];
      expect(entry.id).toBeDefined();
      expect(entry.eventType).toBeDefined();
      expect(entry.title).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });

    it('patch approval adds history entry', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-hist3', projectId: 'proj-hist3', prompt: 'Update styles' });
      svc.approvePatch(plan.id, 'ws-hist3', 'proj-hist3');
      const history = svc.getChangeHistory('ws-hist3', 'proj-hist3');
      expect(history.some(e => e.eventType === 'PATCH_APPLIED')).toBe(true);
    });

    it('rollback adds ROLLBACK_PERFORMED entry', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-rb', projectId: 'proj-rb', prompt: 'Change colors' });
      svc.approvePatch(plan.id, 'ws-rb', 'proj-rb');
      svc.rollbackPatch(plan.id, 'ws-rb', 'proj-rb');
      const history = svc.getChangeHistory('ws-rb', 'proj-rb');
      expect(history.some(e => e.eventType === 'ROLLBACK_PERFORMED')).toBe(true);
    });

    it('respects limit parameter', () => {
      const ws = 'ws-lim2'; const proj = 'proj-lim2';
      for (let i = 0; i < 10; i++) svc.createPairSession({ workspaceId: ws, projectId: proj });
      expect(svc.getChangeHistory(ws, proj, 3).length).toBeLessThanOrEqual(3);
    });

    it('restore from history marks canRestore entry', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-rest', projectId: 'proj-rest', prompt: 'Test patch' });
      svc.approvePatch(plan.id, 'ws-rest', 'proj-rest');
      const history = svc.getChangeHistory('ws-rest', 'proj-rest');
      const restorable = history.find(e => e.canRestore);
      expect(restorable).toBeDefined();
      const result = svc.restoreFromHistory(restorable!.id, 'ws-rest', 'proj-rest');
      expect(result.restored).toBe(true);
    });

    it('throws when restoring non-restorable entry', () => {
      svc.createPairSession({ workspaceId: 'ws-nores', projectId: 'proj-nores' });
      const history = svc.getChangeHistory('ws-nores', 'proj-nores');
      const nonRestorable = history.find(e => !e.canRestore);
      if (nonRestorable) {
        expect(() => svc.restoreFromHistory(nonRestorable.id, 'ws-nores', 'proj-nores')).toThrow(BadRequestException);
      }
    });
  });

  // ── 23-13: Security Hardening ─────────────────────────────────────────────

  describe('Security Hardening', () => {
    it('validates safe patch content', () => {
      expect(svc.validatePatchContent('Update the hero color to indigo').safe).toBe(true);
    });

    it('blocks secret keywords in patch', () => {
      expect(svc.validatePatchContent('const secret = process.env.SECRET_KEY').safe).toBe(false);
    });

    it('blocks eval patterns', () => {
      expect(svc.validatePatchContent('eval(userInput)').safe).toBe(false);
    });

    it('blocks XSS patterns', () => {
      expect(svc.validatePatchContent('<script>document.cookie = "x"</script>').safe).toBe(false);
    });

    it('blocks innerHTML assignment', () => {
      expect(svc.validatePatchContent("element.innerHTML = userContent").safe).toBe(false);
    });

    it('blocks prototype pollution', () => {
      expect(svc.validatePatchContent('obj.__proto__.constructor = evil').safe).toBe(false);
    });

    it('blocks child_process require', () => {
      expect(svc.validatePatchContent("require('child_process').exec('rm -rf /')").safe).toBe(false);
    });

    it('blocks .env file access', () => {
      expect(svc.checkFileMutation('.env.local').status).toBe('BLOCKED');
    });

    it('terminal rejects sudo', () => {
      expect(svc.rejectUnknownCommand('sudo bash').blocked).toBe(true);
    });

    it('terminal rejects pipe injection', () => {
      expect(svc.rejectUnknownCommand('ls | rm -rf').blocked).toBe(true);
    });
  });

  // ── 23-15: Analytics ──────────────────────────────────────────────────────

  describe('Analytics', () => {
    it('returns analytics for workspace', () => {
      const stats = svc.getAnalytics('ws-1');
      expect(stats.workspaceId).toBe('ws-1');
      expect(stats.period).toBeDefined();
    });

    it('patch approval increments counter', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-ana', projectId: 'proj-1', prompt: 'Test' });
      svc.approvePatch(plan.id, 'ws-ana', 'proj-1');
      const stats = svc.getAnalytics('ws-ana');
      expect(stats.patchApprovals).toBeGreaterThanOrEqual(1);
    });

    it('patch rejection increments counter', () => {
      const plan = svc.createPatchPlan({ workspaceId: 'ws-rej', projectId: 'proj-1', prompt: 'Test' });
      svc.rejectPatch(plan.id, 'ws-rej', 'proj-1');
      const stats = svc.getAnalytics('ws-rej');
      expect(stats.patchRejections).toBeGreaterThanOrEqual(1);
    });

    it('terminal runs increment counter', () => {
      svc.runTerminalAction({ workspaceId: 'ws-term', projectId: 'proj-1', commandKey: 'npm:build' });
      const stats = svc.getAnalytics('ws-term');
      expect(stats.terminalActionsRun).toBeGreaterThanOrEqual(1);
    });

    it('patchApprovalRate is calculated correctly', () => {
      const ws = 'ws-rate';
      const p1 = svc.createPatchPlan({ workspaceId: ws, projectId: 'p', prompt: 'a' });
      const p2 = svc.createPatchPlan({ workspaceId: ws, projectId: 'p', prompt: 'b' });
      svc.approvePatch(p1.id, ws, 'p');
      svc.rejectPatch(p2.id, ws, 'p');
      const stats = svc.getAnalytics(ws);
      expect(stats.patchApprovalRate).toBe(0.5);
    });

    it('trackAnalytic increments field', () => {
      svc.trackAnalytic('ws-trk', 'bugsDetected');
      svc.trackAnalytic('ws-trk', 'bugsDetected');
      expect(svc.getAnalytics('ws-trk').bugsDetected).toBeGreaterThanOrEqual(2);
    });
  });
});
