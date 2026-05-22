import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MemoryService } from './memory.service';

// ── 20E: Memory Engine Tests ──────────────────────────────────────────────────

describe('MemoryService', () => {
  let svc: MemoryService;

  beforeEach(() => { svc = new MemoryService(); });

  // ── Founder Profile ──────────────────────────────────────────────────────

  describe('Founder Profile', () => {
    it('saves and retrieves a profile', () => {
      const p = svc.saveProfile('u1', { founderName: 'Alice', company: 'Acme' });
      expect(p.userId).toBe('u1');
      expect(p.founderName).toBe('Alice');
      const retrieved = svc.getProfile('u1');
      expect(retrieved?.company).toBe('Acme');
    });

    it('returns null for unknown userId', () => {
      expect(svc.getProfile('unknown')).toBeNull();
    });

    it('merges updates on re-save', () => {
      svc.saveProfile('u2', { founderName: 'Bob', techLevel: 'expert' });
      svc.saveProfile('u2', { company: 'NewCo' });
      const p = svc.getProfile('u2');
      expect(p?.founderName).toBe('Bob');
      expect(p?.company).toBe('NewCo');
      expect(p?.techLevel).toBe('expert');
    });

    it('deletes a profile', () => {
      svc.saveProfile('u3', { founderName: 'Carol' });
      svc.deleteProfile('u3');
      expect(svc.getProfile('u3')).toBeNull();
    });

    it('uses default values when not specified', () => {
      const p = svc.saveProfile('u4', {});
      expect(p.preferredLang).toBe('en');
      expect(p.techLevel).toBe('intermediate');
      expect(p.visibility).toBe('PRIVATE');
    });
  });

  // ── Memory Entries ────────────────────────────────────────────────────────

  describe('Memory Entries', () => {
    it('adds and lists entries', () => {
      svc.addEntry({ projectId: 'p1', key: 'stack', content: 'NestJS + Next.js' });
      svc.addEntry({ projectId: 'p1', key: 'db', content: 'PostgreSQL' });
      const entries = svc.listEntries('p1');
      expect(entries).toHaveLength(2);
    });

    it('pins entries appear first in listing', () => {
      svc.addEntry({ projectId: 'p2', key: 'b', content: 'second', priority: 'NORMAL' });
      const e = svc.addEntry({ projectId: 'p2', key: 'a', content: 'first', priority: 'NORMAL' });
      svc.updateEntry(e.id, { pinned: true });
      const entries = svc.listEntries('p2');
      expect(entries[0].pinned).toBe(true);
    });

    it('does not return archived entries by default', () => {
      const e = svc.addEntry({ projectId: 'p3', key: 'old', content: 'archived content' });
      svc.updateEntry(e.id, { archived: true });
      expect(svc.listEntries('p3')).toHaveLength(0);
      expect(svc.listEntries('p3', { includeArchived: true })).toHaveLength(1);
    });

    it('filters by tag', () => {
      svc.addEntry({ projectId: 'p4', key: 'a', content: 'alpha', tags: ['infra'] });
      svc.addEntry({ projectId: 'p4', key: 'b', content: 'beta',  tags: ['ui'] });
      expect(svc.listEntries('p4', { tag: 'infra' })).toHaveLength(1);
    });

    it('updates content and key', () => {
      const e = svc.addEntry({ projectId: 'p5', key: 'old-key', content: 'old' });
      const updated = svc.updateEntry(e.id, { key: 'new-key', content: 'new' });
      expect(updated.key).toBe('new-key');
      expect(updated.content).toBe('new');
    });

    it('throws NotFoundException on update of unknown entry', () => {
      expect(() => svc.updateEntry('bad-id', { content: 'x' })).toThrow(NotFoundException);
    });

    it('deletes an entry', () => {
      const e = svc.addEntry({ projectId: 'p6', key: 'k', content: 'v' });
      svc.deleteEntry(e.id);
      expect(svc.listEntries('p6')).toHaveLength(0);
    });

    it('throws on delete of unknown entry', () => {
      expect(() => svc.deleteEntry('nope')).toThrow(NotFoundException);
    });

    it('rejects content with blocked keys', () => {
      expect(() => svc.addEntry({ projectId: 'p7', key: 'k', content: 'my_secret=abc' }))
        .toThrow(BadRequestException);
    });

    it('rejects content with api_key', () => {
      expect(() => svc.addEntry({ projectId: 'p7', key: 'k', content: 'api_key: sk-123' }))
        .toThrow(BadRequestException);
    });
  });

  // ── Decisions ─────────────────────────────────────────────────────────────

  describe('Decisions', () => {
    it('adds and lists decisions', () => {
      svc.addDecision({ projectId: 'p1', title: 'Use PostgreSQL' });
      svc.addDecision({ projectId: 'p1', title: 'TypeScript strict mode' });
      expect(svc.listDecisions('p1')).toHaveLength(2);
    });

    it('new decisions start as UNLOCKED', () => {
      const d = svc.addDecision({ projectId: 'p1', title: 'Keep Tailwind' });
      expect(d.lockState).toBe('UNLOCKED');
    });

    it('locks a decision as SOFT_LOCKED', () => {
      const d = svc.addDecision({ projectId: 'p2', title: 'Postgres only' });
      const locked = svc.lockDecision(d.id, 'founder', 'SOFT_LOCKED');
      expect(locked.lockState).toBe('SOFT_LOCKED');
      expect(locked.lockedBy).toBe('founder');
      expect(locked.lockedAt).toBeDefined();
    });

    it('locks a decision as HARD_LOCKED', () => {
      const d = svc.addDecision({ projectId: 'p2', title: 'Never refactor core' });
      const locked = svc.lockDecision(d.id, 'admin', 'HARD_LOCKED');
      expect(locked.lockState).toBe('HARD_LOCKED');
    });

    it('unlocks a locked decision', () => {
      const d = svc.addDecision({ projectId: 'p3', title: 'Something' });
      svc.lockDecision(d.id, 'user');
      const unlocked = svc.unlockDecision(d.id);
      expect(unlocked.lockState).toBe('UNLOCKED');
      expect(unlocked.lockedBy).toBeUndefined();
    });

    it('throws NotFoundException on lock of unknown decision', () => {
      expect(() => svc.lockDecision('bad', 'user')).toThrow(NotFoundException);
    });

    it('locked decisions sort before unlocked', () => {
      const d1 = svc.addDecision({ projectId: 'p4', title: 'Unlocked' });
      const d2 = svc.addDecision({ projectId: 'p4', title: 'Locked' });
      svc.lockDecision(d2.id, 'user');
      const list = svc.listDecisions('p4');
      expect(list[0].id).toBe(d2.id);
    });
  });

  // ── Agent Instructions ────────────────────────────────────────────────────

  describe('Agent Instructions', () => {
    it('saves and retrieves instruction set', () => {
      svc.saveInstructions('ws1', { name: 'Founder Mode', rules: ['be concise', 'explain simply'] });
      const set = svc.getInstructions('ws1');
      expect(set?.name).toBe('Founder Mode');
      expect(set?.rules).toContain('be concise');
    });

    it('returns null for unknown workspace', () => {
      expect(svc.getInstructions('unknown-ws')).toBeNull();
    });

    it('upserts on re-save', () => {
      svc.saveInstructions('ws2', { name: 'v1', rules: ['rule1'] });
      svc.saveInstructions('ws2', { name: 'v2', rules: ['rule1', 'rule2'] });
      const set = svc.getInstructions('ws2');
      expect(set?.name).toBe('v2');
      expect(set?.rules).toHaveLength(2);
    });

    it('filters blocked keys from rules', () => {
      svc.saveInstructions('ws3', { name: 'Test', rules: ['ok rule', 'secret=bad'] });
      const set = svc.getInstructions('ws3');
      expect(set?.rules).toHaveLength(1);
      expect(set?.rules[0]).toBe('ok rule');
    });
  });

  // ── Snapshots ─────────────────────────────────────────────────────────────

  describe('Memory Snapshots', () => {
    it('creates and lists snapshots', () => {
      svc.addEntry({ projectId: 'p1', key: 'stack', content: 'NestJS' });
      const snap = svc.createSnapshot('ws1', 'p1', 'Before refactor');
      expect(snap.label).toBe('Before refactor');
      expect(snap.payload.entries).toHaveLength(1);
      const list = svc.listSnapshots('ws1');
      expect(list).toHaveLength(1);
    });

    it('restores snapshot memory', () => {
      const e = svc.addEntry({ projectId: 'proj', key: 'k', content: 'original' });
      const snap = svc.createSnapshot('ws-snap', 'proj', 'Checkpoint');
      svc.deleteEntry(e.id);
      expect(svc.listEntries('proj')).toHaveLength(0);
      svc.restoreSnapshot(snap.id);
      expect(svc.listEntries('proj')).toHaveLength(1);
    });

    it('throws on restore of unknown snapshot', () => {
      expect(() => svc.restoreSnapshot('bad-id')).toThrow(NotFoundException);
    });
  });

  // ── Context Packs ─────────────────────────────────────────────────────────

  describe('Context Packs', () => {
    it('generates a context pack', () => {
      svc.addEntry({ projectId: 'p1', key: 'arch', content: 'NestJS monolith' });
      const pack = svc.generateContextPack('ws1', 'p1', 'Test pack', 'BALANCED');
      expect(pack.compressionLevel).toBe('BALANCED');
      expect(pack.tokenEstimate).toBeGreaterThan(0);
      expect(pack.content.length).toBeGreaterThan(0);
    });

    it('EMERGENCY level produces shortest output', () => {
      svc.addEntry({ projectId: 'p1', key: 'k1', content: 'a'.repeat(500), pinned: true });
      const balanced  = svc.generateContextPack('ws1', 'p1', 'b', 'BALANCED');
      const emergency = svc.generateContextPack('ws1', 'p1', 'e', 'EMERGENCY');
      expect(emergency.content.length).toBeLessThanOrEqual(balanced.content.length);
    });

    it('lists context packs for workspace', () => {
      svc.generateContextPack('ws-list', 'p1', 'Pack 1', 'FULL');
      svc.generateContextPack('ws-list', 'p1', 'Pack 2', 'MINIMAL');
      expect(svc.listContextPacks('ws-list')).toHaveLength(2);
    });

    it('throws on replay of unknown pack', () => {
      expect(() => svc.buildReplayPack('bad')).toThrow(NotFoundException);
    });

    it('increments usageCount on replay', () => {
      const pack = svc.generateContextPack('ws-replay', 'p1', 'Pack', 'BALANCED');
      svc.buildReplayPack(pack.id);
      const updated = svc.listContextPacks('ws-replay')[0];
      expect(updated.usageCount).toBe(1);
    });
  });

  // ── Memory Security ───────────────────────────────────────────────────────

  describe('Memory Security (20E-10)', () => {
    it('never stores raw secrets in memory entries', () => {
      expect(() => svc.addEntry({ projectId: 'p1', key: 'k', content: 'token: abc123' }))
        .toThrow(BadRequestException);
    });

    it('strips blocked tags silently', () => {
      const e = svc.addEntry({ projectId: 'p1', key: 'k', content: 'safe content', tags: ['infra', 'secret-stuff'] });
      expect(e.tags).not.toContain('secret-stuff');
      expect(e.tags).toContain('infra');
    });

    it('audit log records memory operations', () => {
      svc.addEntry({ projectId: 'audit-proj', key: 'k', content: 'audit test', tags: [] });
      const log = svc.getAuditLog();
      expect(log.length).toBeGreaterThan(0);
      expect(log.some(e => e.action === 'MEMORY_ADD')).toBe(true);
    });

    it('context pack does not contain blocked keys in content', () => {
      svc.addEntry({ projectId: 'safe-proj', key: 'arch', content: 'NestJS + PostgreSQL' });
      const pack = svc.generateContextPack('ws-safe', 'safe-proj', 'Pack', 'FULL');
      expect(/secret|token|password/i.test(pack.content)).toBe(false);
    });
  });

  // ── Audit Log ─────────────────────────────────────────────────────────────

  describe('Audit Log', () => {
    it('records all mutating operations', () => {
      svc.saveProfile('u1', { founderName: 'Test' });
      svc.addEntry({ projectId: 'p1', key: 'k', content: 'v' });
      svc.addDecision({ projectId: 'p1', title: 'Decision' });
      const log = svc.getAuditLog();
      const actions = log.map(e => e.action);
      expect(actions).toContain('PROFILE_SAVE');
      expect(actions).toContain('MEMORY_ADD');
      expect(actions).toContain('DECISION_ADD');
    });

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        svc.addEntry({ projectId: 'p1', key: `k${i}`, content: 'v' });
      }
      const log = svc.getAuditLog(undefined, 3);
      expect(log).toHaveLength(3);
    });
  });
});
