import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  MEMORY_BLOCKED_KEYS,
  type CompressionLevel,
  type ContextPackRecord,
  type Decision,
  type DecisionLockState,
  type FounderProfile,
  type InstructionSet,
  type MemoryAuditRecord,
  type MemoryEntry,
  type MemoryPriority,
  type MemorySnapshotRecord,
  type MemoryVisibility,
  type ReplayPack,
  type SnapshotPayload,
} from './memory.types';

// 20E-10: Redact blocked keys from any string value
function redactContent(content: string): string {
  const MAX_CONTENT = 8000;
  const trimmed = content.slice(0, MAX_CONTENT);
  if (MEMORY_BLOCKED_KEYS.test(trimmed)) {
    throw new BadRequestException('Memory content contains blocked sensitive keys');
  }
  return trimmed;
}

function redactTags(tags: string[]): string[] {
  return tags.filter(t => !MEMORY_BLOCKED_KEYS.test(t)).slice(0, 20);
}

// 20E-06: Rough token estimation (chars / 4)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// 20E-06: Compress memory entries to a context string
function compressEntries(entries: MemoryEntry[], level: CompressionLevel): string {
  const pinned   = entries.filter(e => !e.archived && e.pinned);
  const normal   = entries.filter(e => !e.archived && !e.pinned);

  switch (level) {
    case 'FULL':
      return entries.filter(e => !e.archived).map(e =>
        `[${e.priority}] ${e.key}: ${e.content}`
      ).join('\n');

    case 'BALANCED':
      return [...pinned, ...normal.slice(0, 10)].map(e =>
        `${e.pinned ? '📌 ' : ''}${e.key}: ${e.content.slice(0, 200)}`
      ).join('\n');

    case 'MINIMAL':
      return pinned.slice(0, 5).map(e =>
        `${e.key}: ${e.content.slice(0, 80)}`
      ).join('\n');

    case 'EMERGENCY':
      return pinned.slice(0, 3).map(e => e.key).join(', ');
  }
}

@Injectable()
export class MemoryService {
  // userId  → FounderProfile
  private readonly profiles = new Map<string, FounderProfile>();
  // entryId → MemoryEntry
  private readonly entries  = new Map<string, MemoryEntry>();
  // decisionId → Decision
  private readonly decisions = new Map<string, Decision>();
  // workspaceId → InstructionSet
  private readonly instructions = new Map<string, InstructionSet>();
  // snapshotId → MemorySnapshotRecord
  private readonly snapshots = new Map<string, MemorySnapshotRecord>();
  // packId → ContextPackRecord
  private readonly packs = new Map<string, ContextPackRecord>();
  // audit events (append-only)
  private readonly auditLog: MemoryAuditRecord[] = [];

  // ── 20E-02: Founder Profile ───────────────────────────────────────────────

  saveProfile(userId: string, data: Partial<Omit<FounderProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): FounderProfile {
    const existing = this.profiles.get(userId);
    const now = new Date();
    const profile: FounderProfile = {
      id:            existing?.id ?? randomUUID(),
      userId,
      workspaceId:   data.workspaceId  ?? existing?.workspaceId,
      founderName:   data.founderName  ?? existing?.founderName,
      company:       data.company      ?? existing?.company,
      role:          data.role         ?? existing?.role,
      country:       data.country      ?? existing?.country,
      timezone:      data.timezone     ?? existing?.timezone,
      preferredLang: data.preferredLang ?? existing?.preferredLang ?? 'en',
      techLevel:     data.techLevel    ?? existing?.techLevel ?? 'intermediate',
      commStyle:     data.commStyle    ?? existing?.commStyle ?? 'balanced',
      preferredStack: data.preferredStack ?? existing?.preferredStack ?? [],
      goals:         data.goals        ?? existing?.goals ?? [],
      visibility:    data.visibility   ?? existing?.visibility ?? 'PRIVATE',
      createdAt:     existing?.createdAt ?? now,
      updatedAt:     now,
    };
    this.profiles.set(userId, profile);
    this.audit({ action: 'PROFILE_SAVE', targetType: 'profile', targetId: userId });
    return profile;
  }

  getProfile(userId: string): FounderProfile | null {
    return this.profiles.get(userId) ?? null;
  }

  deleteProfile(userId: string): void {
    this.profiles.delete(userId);
    this.audit({ action: 'PROFILE_DELETE', targetType: 'profile', targetId: userId });
  }

  // ── 20E-04: Project Memory ────────────────────────────────────────────────

  addEntry(params: {
    projectId:   string;
    workspaceId?: string;
    userId?:     string;
    key:         string;
    content:     string;
    priority?:   MemoryPriority;
    tags?:       string[];
  }): MemoryEntry {
    const content = redactContent(params.content);
    const tags    = redactTags(params.tags ?? []);
    const now     = new Date();
    const entry: MemoryEntry = {
      id:          randomUUID(),
      projectId:   params.projectId,
      workspaceId: params.workspaceId,
      userId:      params.userId,
      key:         params.key.slice(0, 120),
      content,
      priority:    params.priority ?? 'NORMAL',
      pinned:      false,
      archived:    false,
      tags,
      createdAt:   now,
      updatedAt:   now,
    };
    this.entries.set(entry.id, entry);
    this.audit({ action: 'MEMORY_ADD', targetType: 'entry', targetId: entry.id, workspaceId: params.workspaceId });
    return entry;
  }

  listEntries(projectId: string, opts: { includeArchived?: boolean; pinnedOnly?: boolean; tag?: string } = {}): MemoryEntry[] {
    return [...this.entries.values()]
      .filter(e => e.projectId === projectId)
      .filter(e => opts.includeArchived ? true : !e.archived)
      .filter(e => opts.pinnedOnly ? e.pinned : true)
      .filter(e => opts.tag ? e.tags.includes(opts.tag) : true)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        const priorityOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  updateEntry(id: string, updates: Partial<Pick<MemoryEntry, 'key' | 'content' | 'priority' | 'pinned' | 'archived' | 'tags'>>): MemoryEntry {
    const entry = this.entries.get(id);
    if (!entry) throw new NotFoundException('Memory entry not found');
    if (updates.content !== undefined) updates.content = redactContent(updates.content);
    if (updates.tags !== undefined)    updates.tags    = redactTags(updates.tags);
    const updated = { ...entry, ...updates, updatedAt: new Date() };
    this.entries.set(id, updated);
    this.audit({ action: 'MEMORY_UPDATE', targetType: 'entry', targetId: id });
    return updated;
  }

  deleteEntry(id: string): void {
    if (!this.entries.has(id)) throw new NotFoundException('Memory entry not found');
    this.entries.delete(id);
    this.audit({ action: 'MEMORY_DELETE', targetType: 'entry', targetId: id });
  }

  // ── 20E-05: Locked Decisions ──────────────────────────────────────────────

  addDecision(params: { projectId: string; workspaceId?: string; title: string; description?: string }): Decision {
    const now = new Date();
    const dec: Decision = {
      id:          randomUUID(),
      projectId:   params.projectId,
      workspaceId: params.workspaceId,
      title:       params.title.slice(0, 200),
      description: params.description?.slice(0, 1000),
      lockState:   'UNLOCKED',
      createdAt:   now,
      updatedAt:   now,
    };
    this.decisions.set(dec.id, dec);
    this.audit({ action: 'DECISION_ADD', targetType: 'decision', targetId: dec.id });
    return dec;
  }

  lockDecision(id: string, lockedBy: string, state: DecisionLockState = 'SOFT_LOCKED'): Decision {
    const dec = this.decisions.get(id);
    if (!dec) throw new NotFoundException('Decision not found');
    const updated: Decision = { ...dec, lockState: state, lockedAt: new Date(), lockedBy, updatedAt: new Date() };
    this.decisions.set(id, updated);
    this.audit({ action: 'DECISION_LOCK', targetType: 'decision', targetId: id });
    return updated;
  }

  unlockDecision(id: string): Decision {
    const dec = this.decisions.get(id);
    if (!dec) throw new NotFoundException('Decision not found');
    const updated: Decision = { ...dec, lockState: 'UNLOCKED', lockedAt: undefined, lockedBy: undefined, updatedAt: new Date() };
    this.decisions.set(id, updated);
    this.audit({ action: 'DECISION_UNLOCK', targetType: 'decision', targetId: id });
    return updated;
  }

  listDecisions(projectId: string): Decision[] {
    return [...this.decisions.values()]
      .filter(d => d.projectId === projectId)
      .sort((a, b) => {
        const order = { HARD_LOCKED: 0, SOFT_LOCKED: 1, UNLOCKED: 2 };
        return order[a.lockState] - order[b.lockState];
      });
  }

  // ── 20E-03: Agent Instructions ────────────────────────────────────────────

  saveInstructions(workspaceId: string, params: { userId?: string; name: string; rules: string[]; priority?: MemoryPriority }): InstructionSet {
    const existing = this.instructions.get(workspaceId);
    const safeRules = params.rules
      .filter(r => !MEMORY_BLOCKED_KEYS.test(r))
      .slice(0, 50)
      .map(r => r.slice(0, 300));
    const now = new Date();
    const set: InstructionSet = {
      id:          existing?.id ?? randomUUID(),
      workspaceId,
      userId:      params.userId ?? existing?.userId,
      name:        params.name.slice(0, 100),
      rules:       safeRules,
      active:      true,
      priority:    params.priority ?? existing?.priority ?? 'NORMAL',
      createdAt:   existing?.createdAt ?? now,
      updatedAt:   now,
    };
    this.instructions.set(workspaceId, set);
    this.audit({ action: 'INSTRUCTIONS_SAVE', targetType: 'instructions', targetId: workspaceId, workspaceId });
    return set;
  }

  getInstructions(workspaceId: string): InstructionSet | null {
    return this.instructions.get(workspaceId) ?? null;
  }

  // ── 20E-07: Memory Snapshots ──────────────────────────────────────────────

  createSnapshot(workspaceId: string, projectId: string | undefined, label: string): MemorySnapshotRecord {
    const entries   = projectId ? this.listEntries(projectId) : [];
    const decisions = projectId ? this.listDecisions(projectId) : [];
    const payload: SnapshotPayload = {
      entries,
      decisions,
      instructions: this.instructions.get(workspaceId) ?? null,
      profile: [...this.profiles.values()].find(p => p.workspaceId === workspaceId) ?? null,
    };
    const snap: MemorySnapshotRecord = {
      id:          randomUUID(),
      workspaceId,
      projectId,
      label:       label.slice(0, 200),
      payload,
      createdAt:   new Date(),
    };
    this.snapshots.set(snap.id, snap);
    this.audit({ action: 'SNAPSHOT_CREATE', targetType: 'snapshot', targetId: snap.id, workspaceId });
    return snap;
  }

  listSnapshots(workspaceId: string): MemorySnapshotRecord[] {
    return [...this.snapshots.values()]
      .filter(s => s.workspaceId === workspaceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  restoreSnapshot(id: string): { restored: number } {
    const snap = this.snapshots.get(id);
    if (!snap) throw new NotFoundException('Snapshot not found');
    const { entries, decisions, instructions } = snap.payload;
    let count = 0;
    entries.forEach(e => { this.entries.set(e.id, e); count++; });
    decisions.forEach(d => { this.decisions.set(d.id, d); count++; });
    if (instructions) { this.instructions.set(snap.workspaceId, instructions); count++; }
    this.audit({ action: 'SNAPSHOT_RESTORE', targetType: 'snapshot', targetId: id, workspaceId: snap.workspaceId });
    return { restored: count };
  }

  // ── 20E-06: Context Compression ──────────────────────────────────────────

  generateContextPack(workspaceId: string, projectId: string | undefined, label: string, level: CompressionLevel): ContextPackRecord {
    const entries   = projectId ? this.listEntries(projectId) : [];
    const decisions = projectId ? this.listDecisions(projectId) : [];
    const profile   = [...this.profiles.values()].find(p => p.workspaceId === workspaceId);
    const instructions = this.instructions.get(workspaceId);

    let content = '';
    if (profile?.founderName) content += `Founder: ${profile.founderName} @ ${profile.company ?? 'N/A'}\n`;
    if (instructions?.rules.length) content += `Rules: ${instructions.rules.slice(0, level === 'EMERGENCY' ? 3 : 10).join('; ')}\n`;
    const locked = decisions.filter(d => d.lockState !== 'UNLOCKED');
    if (locked.length) content += `Locked: ${locked.map(d => d.title).join('; ')}\n`;
    content += compressEntries(entries, level);

    const tokenEstimate = estimateTokens(content);
    const now = new Date();
    const pack: ContextPackRecord = {
      id:               randomUUID(),
      workspaceId,
      projectId,
      label:            label.slice(0, 200),
      content,
      compressionLevel: level,
      tokenEstimate,
      usageCount:       0,
      createdAt:        now,
      updatedAt:        now,
    };
    this.packs.set(pack.id, pack);
    this.audit({ action: 'CONTEXT_PACK_CREATE', targetType: 'context_pack', targetId: pack.id, workspaceId });
    return pack;
  }

  listContextPacks(workspaceId: string): ContextPackRecord[] {
    return [...this.packs.values()]
      .filter(p => p.workspaceId === workspaceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ── 20E-09: Context Replay ────────────────────────────────────────────────

  buildReplayPack(packId: string): ReplayPack {
    const pack = this.packs.get(packId);
    if (!pack) throw new NotFoundException('Context pack not found');

    // Increment usage count
    this.packs.set(packId, { ...pack, usageCount: pack.usageCount + 1, updatedAt: new Date() });

    const pinnedMemory   = pack.projectId ? this.listEntries(pack.projectId, { pinnedOnly: true }) : [];
    const lockedDecisions = pack.projectId ? this.listDecisions(pack.projectId).filter(d => d.lockState !== 'UNLOCKED') : [];
    const profile        = [...this.profiles.values()].find(p => p.workspaceId === pack.workspaceId);
    const instructions   = this.instructions.get(pack.workspaceId) ?? undefined;

    const safeProfile = profile ? {
      founderName: profile.founderName,
      company:     profile.company,
      role:        profile.role,
      techLevel:   profile.techLevel,
      commStyle:   profile.commStyle,
      goals:       profile.goals,
    } : undefined;

    this.audit({ action: 'CONTEXT_REPLAY', targetType: 'context_pack', targetId: packId, workspaceId: pack.workspaceId });

    return {
      packId,
      workspaceId:       pack.workspaceId,
      projectId:         pack.projectId,
      founderProfile:    safeProfile,
      pinnedMemory,
      lockedDecisions,
      activeInstructions: instructions,
      compressedContext:  pack.content,
      tokenEstimate:      pack.tokenEstimate,
      generatedAt:        new Date(),
    };
  }

  // ── 20E-11: Memory Audit ──────────────────────────────────────────────────

  getAuditLog(workspaceId?: string, limit = 50): MemoryAuditRecord[] {
    const events = workspaceId
      ? this.auditLog.filter(e => e.workspaceId === workspaceId)
      : [...this.auditLog];
    return events.slice(-limit).reverse();
  }

  private audit(params: { action: string; targetType: string; targetId: string; workspaceId?: string; projectId?: string; userId?: string }): void {
    this.auditLog.push({
      id:          randomUUID(),
      workspaceId: params.workspaceId,
      projectId:   params.projectId,
      userId:      params.userId,
      action:      params.action,
      targetType:  params.targetType,
      targetId:    params.targetId,
      createdAt:   new Date(),
    });
    // Keep audit log bounded in-memory
    if (this.auditLog.length > 2000) this.auditLog.splice(0, 500);
  }
}
