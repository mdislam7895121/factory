import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EditorService } from './editor.service';

// ── 22: Controlled Visual Editor Tests ───────────────────────────────────────

describe('EditorService', () => {
  let svc: EditorService;

  beforeEach(() => { svc = new EditorService(); });

  // ── 22-01: Edit Sessions ──────────────────────────────────────────────────

  describe('Edit Sessions', () => {
    it('creates a DRAFT session', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'Test edit' });
      expect(s.id).toBeDefined();
      expect(s.status).toBe('DRAFT');
      expect(s.mode).toBe('VISUAL');
    });

    it('retrieves session by id', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'BRANDING', description: 'Test' });
      expect(svc.getSession(s.id)).not.toBeNull();
      expect(svc.getSession(s.id)!.id).toBe(s.id);
    });

    it('returns null for unknown session', () => {
      expect(svc.getSession('nope')).toBeNull();
    });

    it('lists sessions for project', () => {
      svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'Edit 1' });
      svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'CONTENT', description: 'Edit 2' });
      const list = svc.listSessions('proj-1');
      expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty list for unknown project', () => {
      expect(svc.listSessions('unknown')).toHaveLength(0);
    });

    it('session has editedBy default', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'LAYOUT', description: 'x' });
      expect(s.editedBy).toBe('founder');
    });

    it('session records custom editedBy', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'ADVANCED', description: 'x', editedBy: 'alice' });
      expect(s.editedBy).toBe('alice');
    });
  });

  // ── 22-02: Branding Studio ────────────────────────────────────────────────

  describe('Branding Studio', () => {
    it('returns seeded branding for known project', () => {
      const b = svc.getBranding('proj-creator-os');
      expect(b.appName).toBe('CreatorOS');
      expect(b.primaryColor).toBe('#6366f1');
    });

    it('returns default branding for unknown project', () => {
      const b = svc.getBranding('unknown');
      expect(b.appName).toBeDefined();
      expect(b.primaryColor).toBeDefined();
    });

    it('applies branding and returns session + snapshot', () => {
      const result = svc.applyBranding({
        workspaceId: 'ws-1', projectId: 'proj-creator-os',
        appName: 'NewApp', tagline: 'Better tagline',
        primaryColor: '#ff5500', secondaryColor: '#ff8844',
        backgroundColor: '#000000', textColor: '#ffffff',
        fontFamily: 'Geist', ctaText: 'Start Now', ctaColor: '#ff5500',
      });
      expect(result.session.status).toBe('PENDING_DIFF');
      expect(result.snapshotId).toBeDefined();
      expect(result.branding.appName).toBe('NewApp');
    });

    it('branding apply computes WCAG contrast ratio', () => {
      const result = svc.applyBranding({
        workspaceId: 'ws-1', projectId: 'proj-creator-os',
        appName: 'App', tagline: 'Tag',
        primaryColor: '#6366f1', secondaryColor: '#818cf8',
        backgroundColor: '#030712', textColor: '#f1f5f9',
        fontFamily: 'Geist', ctaText: 'Go', ctaColor: '#6366f1',
      });
      expect(result.branding.contrastRatio).toBeDefined();
      expect(typeof result.branding.passesWCAG).toBe('boolean');
    });

    it('blocks dangerous content in branding fields', () => {
      expect(() => svc.applyBranding({
        workspaceId: 'ws-1', projectId: 'p', appName: '<script>alert(1)</script>',
        tagline: 'tag', primaryColor: '#fff', secondaryColor: '#fff',
        backgroundColor: '#000', textColor: '#fff', fontFamily: 'Geist',
        ctaText: 'Go', ctaColor: '#fff',
      })).toThrow(BadRequestException);
    });

    it('branding diff marks affected components', () => {
      const result = svc.applyBranding({
        workspaceId: 'ws-1', projectId: 'proj-creator-os',
        appName: 'X', tagline: 'Y',
        primaryColor: '#abcdef', secondaryColor: '#abcdef',
        backgroundColor: '#000000', textColor: '#ffffff',
        fontFamily: 'Inter', ctaText: 'Go', ctaColor: '#abcdef',
      });
      expect(result.session.diffs[0].affectedComponents.length).toBeGreaterThan(0);
    });
  });

  // ── 22-03: Content Editor ─────────────────────────────────────────────────

  describe('Content Editor', () => {
    it('returns content blocks for known project', () => {
      const blocks = svc.getContentBlocks('proj-creator-os');
      expect(blocks.length).toBeGreaterThan(0);
    });

    it('returns empty for unknown project', () => {
      expect(svc.getContentBlocks('nope')).toHaveLength(0);
    });

    it('rewrites content in PROFESSIONAL tone', () => {
      const block = svc.rewriteContent({
        projectId: 'proj-creator-os',
        contentBlockId: 'cb-hero-headline',
        tone: 'PROFESSIONAL',
        currentValue: 'Build your app',
      });
      expect(block.proposedValue).toBeDefined();
      expect(block.aiRewritten).toBe(true);
      expect(block.tone).toBe('PROFESSIONAL');
    });

    it('rewrites content in BOLD tone (uppercases)', () => {
      const block = svc.rewriteContent({
        projectId: 'proj-creator-os',
        contentBlockId: 'cb-hero-sub',
        tone: 'BOLD',
        currentValue: 'simple description',
      });
      expect(block.proposedValue).toContain('SIMPLE DESCRIPTION');
    });

    it('throws NotFoundException for unknown block', () => {
      expect(() => svc.rewriteContent({
        projectId: 'proj-creator-os', contentBlockId: 'nope', tone: 'CASUAL', currentValue: 'x',
      })).toThrow(NotFoundException);
    });

    it('throws BadRequestException for locked block', () => {
      expect(() => svc.rewriteContent({
        projectId: 'proj-creator-os', contentBlockId: 'cb-footer-tagline', tone: 'CASUAL', currentValue: 'x',
      })).toThrow(BadRequestException);
    });

    it('blocks dangerous content in rewrite', () => {
      expect(() => svc.rewriteContent({
        projectId: 'proj-creator-os', contentBlockId: 'cb-hero-headline',
        tone: 'PROFESSIONAL', currentValue: '<script>eval(bad)</script>',
      })).toThrow(BadRequestException);
    });

    it('applies content block (proposedValue becomes current)', () => {
      svc.rewriteContent({ projectId: 'proj-creator-os', contentBlockId: 'cb-hero-headline', tone: 'CASUAL', currentValue: 'Old text' });
      const applied = svc.applyContentBlock('proj-creator-os', 'cb-hero-headline', 'ws-1');
      expect(applied.currentValue).toContain('Old text');
      expect(applied.proposedValue).toBeUndefined();
    });

    it('throws on apply when no proposed value exists', () => {
      expect(() => svc.applyContentBlock('proj-creator-os', 'cb-features-title', 'ws-1')).toThrow(BadRequestException);
    });
  });

  // ── 22-04: Layout Block Editor ────────────────────────────────────────────

  describe('Layout Block Editor', () => {
    it('returns seeded layout blocks sorted by order', () => {
      const blocks = svc.getLayoutBlocks('proj-creator-os');
      expect(blocks.length).toBeGreaterThan(0);
      for (let i = 1; i < blocks.length; i++) {
        expect(blocks[i].order).toBeGreaterThanOrEqual(blocks[i - 1].order);
      }
    });

    it('returns default layout for unknown project', () => {
      const blocks = svc.getLayoutBlocks('new-project');
      expect(blocks.length).toBeGreaterThan(0);
    });

    it('updates visibility of non-locked blocks', () => {
      const blocks = svc.getLayoutBlocks('proj-creator-os');
      const testimonials = blocks.find(b => b.type === 'TESTIMONIALS');
      expect(testimonials).toBeDefined();
      const updated = svc.updateLayout({
        projectId: 'proj-creator-os', workspaceId: 'ws-1',
        blocks: [{ id: testimonials!.id, visible: true, order: testimonials!.order }],
      });
      expect(updated.find(b => b.id === testimonials!.id)!.visible).toBe(true);
    });

    it('locked blocks cannot be hidden', () => {
      const blocks = svc.getLayoutBlocks('proj-creator-os');
      const navbar = blocks.find(b => b.type === 'NAVBAR');
      expect(navbar!.locked).toBe(true);
      svc.updateLayout({
        projectId: 'proj-creator-os', workspaceId: 'ws-1',
        blocks: [{ id: navbar!.id, visible: false, order: 0 }],
      });
      const after = svc.getLayoutBlocks('proj-creator-os');
      expect(after.find(b => b.id === navbar!.id)!.visible).toBe(true);
    });

    it('layout blocks have required fields', () => {
      const blocks = svc.getLayoutBlocks('proj-creator-os');
      blocks.forEach(b => {
        expect(b.id).toBeDefined();
        expect(b.type).toBeDefined();
        expect(b.label).toBeDefined();
        expect(typeof b.visible).toBe('boolean');
        expect(typeof b.locked).toBe('boolean');
      });
    });
  });

  // ── 22-05: Safe File Explorer ─────────────────────────────────────────────

  describe('Safe File Explorer', () => {
    it('returns safe file view for known path', () => {
      const f = svc.getSafeFile('proj-creator-os', 'src/app/page.tsx');
      expect(f.path).toBe('src/app/page.tsx');
      expect(f.language).toBe('typescript');
    });

    it('marks safe-to-edit files correctly', () => {
      const f = svc.getSafeFile('proj-creator-os', 'src/styles/globals.css');
      expect(f.safeToEdit).toBe(true);
    });

    it('marks unsafe files as not editable', () => {
      const f = svc.getSafeFile('proj-creator-os', 'some/random/util.ts');
      expect(f.safeToEdit).toBe(false);
    });

    it('throws on .env file access', () => {
      expect(() => svc.getSafeFile('proj-creator-os', '.env')).toThrow(BadRequestException);
    });

    it('throws on node_modules access', () => {
      expect(() => svc.getSafeFile('proj-creator-os', 'node_modules/react/index.js')).toThrow(BadRequestException);
    });

    it('file view includes content and line count', () => {
      const f = svc.getSafeFile('proj-creator-os', 'src/app/page.tsx');
      expect(f.content).toBeDefined();
      expect(f.linesCount).toBeGreaterThan(0);
    });
  });

  // ── 22-06: Diff + Approval ────────────────────────────────────────────────

  describe('Diff + Approval System', () => {
    it('generates diffs for a session', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'Test' });
      const diffs = svc.generateDiff(s.id);
      expect(diffs.length).toBeGreaterThan(0);
      expect(diffs[0].filePath).toBeDefined();
    });

    it('diff has before/after/riskLevel', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'BRANDING', description: 'Test' });
      const diffs = svc.generateDiff(s.id);
      expect(diffs[0].before).toBeDefined();
      expect(diffs[0].after).toBeDefined();
      expect(['LOW','MEDIUM','HIGH']).toContain(diffs[0].riskLevel);
    });

    it('throws NotFoundException for unknown session diff', () => {
      expect(() => svc.generateDiff('nope')).toThrow(NotFoundException);
    });

    it('approve changes session status to APPLIED', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-creator-os', mode: 'BRANDING', description: 'x' });
      svc.generateDiff(s.id);
      const applied = svc.approveAndApply(s.id, 'ws-1', 'proj-creator-os');
      expect(applied.status).toBe('APPLIED');
      expect(applied.appliedAt).toBeDefined();
    });

    it('approve creates snapshot and records quality', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-creator-os', mode: 'CONTENT', description: 'x' });
      svc.generateDiff(s.id);
      const applied = svc.approveAndApply(s.id, 'ws-1', 'proj-creator-os');
      expect(applied.snapshotId).toBeDefined();
      expect(applied.qualityBefore).toBeDefined();
      expect(applied.qualityAfter).toBeDefined();
    });

    it('throws on approve when not PENDING_DIFF', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'p', mode: 'VISUAL', description: 'x' });
      expect(() => svc.approveAndApply(s.id, 'ws-1', 'p')).toThrow(BadRequestException);
    });

    it('reject changes session status to REJECTED', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-creator-os', mode: 'LAYOUT', description: 'y' });
      svc.generateDiff(s.id);
      const rejected = svc.rejectDiff(s.id, 'ws-1', 'proj-creator-os');
      expect(rejected.status).toBe('REJECTED');
    });
  });

  // ── 22-07: AI Change Engine ───────────────────────────────────────────────

  describe('AI Change Engine', () => {
    it('generates a change plan for a prompt', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update the hero headline text' });
      expect(plan.id).toBeDefined();
      expect(plan.riskLevel).toBeDefined();
      expect(plan.scopeSummary).toBeDefined();
    });

    it('classifies branding prompt as LOW risk', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Change the primary color and font' });
      expect(plan.riskLevel).toBe('LOW');
      expect(plan.suggestedMode).toBe('BRANDING');
    });

    it('classifies auth changes as HIGH risk requiring confirmation', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Add user authentication flow' });
      expect(plan.riskLevel).toBe('HIGH');
      expect(plan.requiresConfirmation).toBe(true);
    });

    it('classifies API prompt as MEDIUM risk', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Add new API endpoint for reports' });
      expect(['MEDIUM','HIGH']).toContain(plan.riskLevel);
    });

    it('classifies content changes as LOW risk', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update the headline and paragraph text' });
      expect(plan.riskLevel).toBe('LOW');
      expect(plan.suggestedMode).toBe('CONTENT');
    });

    it('blocks dangerous prompts', () => {
      expect(() => svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'eval(process.env.SECRET_KEY)' }))
        .toThrow(BadRequestException);
    });

    it('plan has affectedFiles populated', () => {
      const plan = svc.generateChangePlan({ workspaceId: 'ws-1', projectId: 'proj-1', prompt: 'Update the color scheme' });
      expect(plan.affectedFiles.length).toBeGreaterThan(0);
    });
  });

  // ── 22-08: Snapshot-First Editing ────────────────────────────────────────

  describe('Snapshot-First Editing', () => {
    it('creates snapshot with snapshotId and rollbackPoint', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'x' });
      const snap = svc.createEditSnapshot('ws-1', 'proj-1', s.id);
      expect(snap.snapshotId).toBeDefined();
      expect(snap.rollbackPoint).toBeDefined();
    });

    it('snapshot is linked to the session', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'BRANDING', description: 'x' });
      svc.createEditSnapshot('ws-1', 'proj-1', s.id);
      const updated = svc.getSession(s.id);
      expect(updated!.snapshotId).toBeDefined();
    });

    it('rollback changes status to ROLLED_BACK', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-creator-os', mode: 'LAYOUT', description: 'x' });
      svc.generateDiff(s.id);
      svc.approveAndApply(s.id, 'ws-1', 'proj-creator-os');
      const rolled = svc.rollback(s.id, 'ws-1', 'proj-creator-os');
      expect(rolled.status).toBe('ROLLED_BACK');
      expect(rolled.rolledBackAt).toBeDefined();
    });

    it('rollback throws when no snapshot exists', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'x' });
      expect(() => svc.rollback(s.id, 'ws-1', 'proj-1')).toThrow(BadRequestException);
    });

    it('rollback throws for non-APPLIED session', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-creator-os', mode: 'CONTENT', description: 'x' });
      svc.createEditSnapshot('ws-1', 'proj-creator-os', s.id);
      expect(() => svc.rollback(s.id, 'ws-1', 'proj-creator-os')).toThrow(BadRequestException);
    });
  });

  // ── 22-09: Quality Recheck ────────────────────────────────────────────────

  describe('Quality Recheck', () => {
    it('returns quality score after recheck', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'x' });
      const result = svc.recheckQuality('proj-1', s.id);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(typeof result.delta).toBe('number');
    });

    it('ADVANCED mode causes quality degradation', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'ADVANCED', description: 'x' });
      const result = svc.recheckQuality('proj-1', s.id);
      expect(result.degraded).toBe(true);
      expect(result.delta).toBeLessThan(0);
    });

    it('BRANDING mode has no degradation', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'BRANDING', description: 'x' });
      const result = svc.recheckQuality('proj-1', s.id);
      expect(result.degraded).toBe(false);
      expect(result.delta).toBe(0);
    });

    it('degraded result includes suggestion', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'LAYOUT', description: 'x' });
      const result = svc.recheckQuality('proj-1', s.id);
      expect(result.suggestion).toBeDefined();
    });
  });

  // ── 22-11: Edit History ───────────────────────────────────────────────────

  describe('Edit History', () => {
    it('returns history entries for workspace+project', () => {
      svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'VISUAL', description: 'x' });
      const history = svc.getEditHistory('ws-1', 'proj-1');
      expect(history.length).toBeGreaterThan(0);
    });

    it('history entry has required fields', () => {
      svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-1', mode: 'CONTENT', description: 'x' });
      const history = svc.getEditHistory('ws-1', 'proj-1');
      const entry = history[0];
      expect(entry.id).toBeDefined();
      expect(entry.eventType).toBeDefined();
      expect(entry.mode).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });

    it('returns empty array for unknown workspace+project', () => {
      expect(svc.getEditHistory('no-ws', 'no-proj')).toHaveLength(0);
    });

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-history', mode: 'VISUAL', description: `Edit ${i}` });
      }
      const history = svc.getEditHistory('ws-1', 'proj-history', 3);
      expect(history.length).toBeLessThanOrEqual(3);
    });

    it('snapshot events are recorded in history', () => {
      const s = svc.createSession({ workspaceId: 'ws-1', projectId: 'proj-snap', mode: 'BRANDING', description: 'x' });
      svc.createEditSnapshot('ws-1', 'proj-snap', s.id);
      const history = svc.getEditHistory('ws-1', 'proj-snap');
      expect(history.some(e => e.eventType === 'SNAPSHOT_CREATED')).toBe(true);
    });
  });

  // ── 22-10: Safety Layer ───────────────────────────────────────────────────

  describe('Edit Safety Layer', () => {
    it('validates clean content as safe', () => {
      const result = svc.validateEditSafety('Update the hero headline to be more modern');
      expect(result.safe).toBe(true);
    });

    it('blocks credential keywords', () => {
      const result = svc.validateEditSafety('Add my api_key here');
      expect(result.safe).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('blocks script injection', () => {
      const result = svc.validateEditSafety('<script>document.cookie = "x"</script>');
      expect(result.safe).toBe(false);
    });

    it('blocks eval patterns', () => {
      const result = svc.validateEditSafety('eval(userInput)');
      expect(result.safe).toBe(false);
    });

    it('blocks prototype pollution', () => {
      const result = svc.validateEditSafety('__proto__.constructor = evil');
      expect(result.safe).toBe(false);
    });
  });

  // ── 22-14: Analytics ──────────────────────────────────────────────────────

  describe('Analytics', () => {
    it('returns analytics for workspace', () => {
      const stats = svc.getAnalytics('ws-founder-1');
      expect(stats.workspaceId).toBe('ws-founder-1');
      expect(stats.period).toBeDefined();
    });

    it('tracks session creation in analytics', () => {
      svc.createSession({ workspaceId: 'ws-analytics', projectId: 'p', mode: 'VISUAL', description: 'x' });
      svc.createSession({ workspaceId: 'ws-analytics', projectId: 'p', mode: 'CONTENT', description: 'y' });
      const stats = svc.getAnalytics('ws-analytics');
      expect(stats.totalEditSessions).toBeGreaterThanOrEqual(2);
    });

    it('trackAnalytic increments field', () => {
      svc.trackAnalytic('ws-track', 'snapshotsCreated');
      svc.trackAnalytic('ws-track', 'snapshotsCreated');
      const stats = svc.getAnalytics('ws-track');
      expect(stats.snapshotsCreated).toBeGreaterThanOrEqual(2);
    });

    it('approved edits increment on approve', () => {
      const s = svc.createSession({ workspaceId: 'ws-approve', projectId: 'proj-creator-os', mode: 'BRANDING', description: 'x' });
      svc.generateDiff(s.id);
      svc.approveAndApply(s.id, 'ws-approve', 'proj-creator-os');
      const stats = svc.getAnalytics('ws-approve');
      expect(stats.approvedEdits).toBeGreaterThanOrEqual(1);
    });

    it('editsByMode tracks mode counts', () => {
      svc.createSession({ workspaceId: 'ws-mode', projectId: 'p', mode: 'BRANDING', description: 'x' });
      svc.createSession({ workspaceId: 'ws-mode', projectId: 'p', mode: 'BRANDING', description: 'y' });
      svc.createSession({ workspaceId: 'ws-mode', projectId: 'p', mode: 'CONTENT', description: 'z' });
      const stats = svc.getAnalytics('ws-mode');
      expect(stats.editsByMode.BRANDING).toBeGreaterThanOrEqual(2);
      expect(stats.editsByMode.CONTENT).toBeGreaterThanOrEqual(1);
    });
  });
});
