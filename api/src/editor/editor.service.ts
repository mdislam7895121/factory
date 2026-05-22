import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EditorMode, EditStatus, EditSession, EditHistoryEntry, BrandingConfig,
  ContentBlock, LayoutBlock, SafeFileView, FileDiff, AIChangePlan,
  EditorAnalytics, ContentTone,
  EDITOR_BLOCKED_CONTENT, DANGEROUS_EDIT_PATTERNS, BLOCKED_META_KEYS,
  CreateEditSessionDto, ApplyBrandingDto, RewriteContentDto,
  UpdateLayoutDto, AIChangePlanDto,
} from './editor.types';

// ── 22: Controlled Visual Editor Service ──────────────────────────────────────

const SAFE_EDITABLE_FILES = new Set([
  'src/app/page.tsx', 'src/app/layout.tsx', 'src/components/Hero.tsx',
  'src/components/Features.tsx', 'src/components/Pricing.tsx',
  'src/components/Footer.tsx', 'src/components/Navbar.tsx',
  'src/styles/globals.css', 'src/styles/theme.ts',
  'public/images', 'content/homepage.md',
]);

const AI_REWRITE_TEMPLATES: Record<ContentTone, (text: string) => string> = {
  PROFESSIONAL: (t) => `${t} — Trusted by thousands of professionals worldwide.`,
  CASUAL:       (t) => `${t} — Join the fun and get started today!`,
  BOLD:         (t) => `${t.toUpperCase()} — No excuses. Just results.`,
  MINIMAL:      (t) => t.replace(/[.!?]+$/, '').trim() + '.',
};

const SEEDED_BRANDING: Record<string, BrandingConfig> = {
  'proj-creator-os': {
    appName: 'CreatorOS', tagline: 'The AI-powered workspace for modern creators.',
    primaryColor: '#6366f1', secondaryColor: '#818cf8',
    backgroundColor: '#030712', textColor: '#f1f5f9',
    fontFamily: 'Geist', ctaText: 'Start Building Free', ctaColor: '#6366f1',
    contrastRatio: 7.2, passesWCAG: true,
  },
  'proj-medibook': {
    appName: 'MediBook', tagline: 'Book appointments with confidence.',
    primaryColor: '#10b981', secondaryColor: '#34d399',
    backgroundColor: '#0a0a0a', textColor: '#f9fafb',
    fontFamily: 'Inter', ctaText: 'Book Now', ctaColor: '#10b981',
    contrastRatio: 8.1, passesWCAG: true,
  },
  'proj-shopforge': {
    appName: 'ShopForge', tagline: 'E-commerce made effortless.',
    primaryColor: '#f59e0b', secondaryColor: '#fbbf24',
    backgroundColor: '#111827', textColor: '#f3f4f6',
    fontFamily: 'Geist', ctaText: 'Open Your Store', ctaColor: '#f59e0b',
    contrastRatio: 6.5, passesWCAG: true,
  },
};

const SEEDED_CONTENT_BLOCKS: Record<string, ContentBlock[]> = {
  'proj-creator-os': [
    { id: 'cb-hero-headline', section: 'Hero', field: 'headline', currentValue: 'Build your AI-powered app', locked: false, aiRewritten: false },
    { id: 'cb-hero-sub', section: 'Hero', field: 'subheadline', currentValue: 'CreatorOS gives founders a complete workspace to launch fast.', locked: false, aiRewritten: false },
    { id: 'cb-cta-primary', section: 'CTA', field: 'primaryText', currentValue: 'Start Building Free', locked: false, aiRewritten: false },
    { id: 'cb-features-title', section: 'Features', field: 'title', currentValue: 'Everything you need to ship', locked: false, aiRewritten: false },
    { id: 'cb-pricing-headline', section: 'Pricing', field: 'headline', currentValue: 'Simple, transparent pricing', locked: false, aiRewritten: false },
    { id: 'cb-footer-tagline', section: 'Footer', field: 'tagline', currentValue: '© 2026 CreatorOS. All rights reserved.', locked: true, aiRewritten: false },
  ],
  'proj-medibook': [
    { id: 'cb-hero-headline', section: 'Hero', field: 'headline', currentValue: 'Healthcare booking made simple', locked: false, aiRewritten: false },
    { id: 'cb-hero-sub', section: 'Hero', field: 'subheadline', currentValue: 'Find doctors, book slots, get care — all in one place.', locked: false, aiRewritten: false },
    { id: 'cb-cta-primary', section: 'CTA', field: 'primaryText', currentValue: 'Book an Appointment', locked: false, aiRewritten: false },
  ],
};

const SEEDED_LAYOUT: Record<string, LayoutBlock[]> = {
  'proj-creator-os': [
    { id: 'lb-navbar', type: 'NAVBAR', label: 'Navigation Bar', visible: true, order: 0, locked: true, canDuplicate: false, canReplace: false },
    { id: 'lb-hero', type: 'HERO', label: 'Hero Section', visible: true, order: 1, locked: false, canDuplicate: false, canReplace: true },
    { id: 'lb-features', type: 'FEATURES', label: 'Features Grid', visible: true, order: 2, locked: false, canDuplicate: true, canReplace: true },
    { id: 'lb-pricing', type: 'PRICING', label: 'Pricing Table', visible: true, order: 3, locked: false, canDuplicate: false, canReplace: true },
    { id: 'lb-testimonials', type: 'TESTIMONIALS', label: 'Testimonials', visible: false, order: 4, locked: false, canDuplicate: true, canReplace: true },
    { id: 'lb-cta', type: 'CTA', label: 'Call-to-Action', visible: true, order: 5, locked: false, canDuplicate: true, canReplace: true },
    { id: 'lb-footer', type: 'FOOTER', label: 'Footer', visible: true, order: 6, locked: true, canDuplicate: false, canReplace: false },
  ],
  'proj-medibook': [
    { id: 'lb-navbar', type: 'NAVBAR', label: 'Navigation Bar', visible: true, order: 0, locked: true, canDuplicate: false, canReplace: false },
    { id: 'lb-hero', type: 'HERO', label: 'Hero Section', visible: true, order: 1, locked: false, canDuplicate: false, canReplace: true },
    { id: 'lb-features', type: 'FEATURES', label: 'Features Grid', visible: true, order: 2, locked: false, canDuplicate: true, canReplace: true },
    { id: 'lb-footer', type: 'FOOTER', label: 'Footer', visible: true, order: 3, locked: true, canDuplicate: false, canReplace: false },
  ],
};

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function computeContrastRatio(fg: string, bg: string): number {
  const hexToLum = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const sRGB = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b);
  };
  try {
    const l1 = hexToLum(fg), l2 = hexToLum(bg);
    const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
    return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
  } catch {
    return 4.5;
  }
}

@Injectable()
export class EditorService {
  private readonly sessions = new Map<string, EditSession>();
  private readonly history = new Map<string, EditHistoryEntry[]>();
  private readonly branding = new Map<string, BrandingConfig>(Object.entries(SEEDED_BRANDING));
  private readonly contentBlocks = new Map<string, ContentBlock[]>(Object.entries(SEEDED_CONTENT_BLOCKS));
  private readonly layout = new Map<string, LayoutBlock[]>(Object.entries(SEEDED_LAYOUT));
  private readonly analytics = new Map<string, Partial<EditorAnalytics>>();
  private readonly changePlans = new Map<string, AIChangePlan>();

  // ── 22-01: Edit Session Management ──────────────────────────────────────────

  createSession(dto: CreateEditSessionDto): EditSession {
    const id = generateId('sess');
    const session: EditSession = {
      id, workspaceId: dto.workspaceId, projectId: dto.projectId,
      mode: dto.mode, status: 'DRAFT', description: dto.description,
      diffs: [], editedBy: dto.editedBy ?? 'founder',
      createdAt: new Date(), updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    this.addHistoryEntry(session.workspaceId, session.projectId, {
      sessionId: id, eventType: 'EDIT_STARTED', mode: session.mode,
      description: `Started ${session.mode} edit: ${session.description}`,
      affectedFiles: [], canRollback: false,
    });
    this.incrementAnalytic(dto.workspaceId, 'totalEditSessions');
    return session;
  }

  getSession(sessionId: string): EditSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  listSessions(projectId: string): EditSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ── 22-02: Branding Studio ───────────────────────────────────────────────────

  getBranding(projectId: string): BrandingConfig {
    return this.branding.get(projectId) ?? {
      appName: 'My App', tagline: 'Built with Factory.',
      primaryColor: '#6366f1', secondaryColor: '#818cf8',
      backgroundColor: '#030712', textColor: '#f1f5f9',
      fontFamily: 'Geist', ctaText: 'Get Started', ctaColor: '#6366f1',
      contrastRatio: 7.0, passesWCAG: true,
    };
  }

  applyBranding(dto: ApplyBrandingDto): { session: EditSession; branding: BrandingConfig; snapshotId: string } {
    this.validateContent(dto.appName);
    this.validateContent(dto.tagline);
    this.validateContent(dto.ctaText);

    const contrastRatio = computeContrastRatio(dto.textColor, dto.backgroundColor);
    const passesWCAG = contrastRatio >= 4.5;

    const newBranding: BrandingConfig = { ...dto, contrastRatio, passesWCAG };
    this.branding.set(dto.projectId, newBranding);

    const snapshotId = generateId('snap');
    const session = this.createSession({
      workspaceId: dto.workspaceId, projectId: dto.projectId,
      mode: 'BRANDING', description: `Branding update: ${dto.appName}`,
    });

    const diff: FileDiff = {
      filePath: 'src/styles/theme.ts', action: 'MODIFY',
      before: `primaryColor: '${this.getBranding(dto.projectId).primaryColor}'`,
      after: `primaryColor: '${dto.primaryColor}'`,
      linesChanged: 8, affectedComponents: ['Navbar', 'Hero', 'CTA', 'Footer'],
      riskLevel: 'LOW',
    };
    session.diffs = [diff];
    session.status = 'PENDING_DIFF';
    session.snapshotId = snapshotId;
    session.updatedAt = new Date();
    this.sessions.set(session.id, session);

    this.addHistoryEntry(dto.workspaceId, dto.projectId, {
      sessionId: session.id, eventType: 'SNAPSHOT_CREATED', mode: 'BRANDING',
      description: `Snapshot ${snapshotId} created before branding update`,
      affectedFiles: ['src/styles/theme.ts'], snapshotId, canRollback: true,
    });

    return { session, branding: newBranding, snapshotId };
  }

  // ── 22-03: Content Editor ────────────────────────────────────────────────────

  getContentBlocks(projectId: string): ContentBlock[] {
    return this.contentBlocks.get(projectId) ?? [];
  }

  rewriteContent(dto: RewriteContentDto): ContentBlock {
    this.validateContent(dto.currentValue);
    if (dto.instruction) this.validateContent(dto.instruction);

    const blocks = this.contentBlocks.get(dto.projectId) ?? [];
    const block = blocks.find(b => b.id === dto.contentBlockId);
    if (!block) throw new NotFoundException('Content block not found');
    if (block.locked) throw new BadRequestException('This content block is locked');

    const rewriteFn = AI_REWRITE_TEMPLATES[dto.tone];
    const proposed = rewriteFn(dto.currentValue);

    block.proposedValue = proposed;
    block.tone = dto.tone;
    block.aiRewritten = true;
    this.contentBlocks.set(dto.projectId, blocks);
    return block;
  }

  applyContentBlock(projectId: string, blockId: string, workspaceId: string): ContentBlock {
    const blocks = this.contentBlocks.get(projectId) ?? [];
    const block = blocks.find(b => b.id === blockId);
    if (!block) throw new NotFoundException('Content block not found');
    if (!block.proposedValue) throw new BadRequestException('No proposed value to apply');

    block.currentValue = block.proposedValue;
    block.proposedValue = undefined;
    this.contentBlocks.set(projectId, blocks);

    this.addHistoryEntry(workspaceId, projectId, {
      sessionId: generateId('sess'), eventType: 'APPLIED', mode: 'CONTENT',
      description: `Content updated: ${block.section} → ${block.field}`,
      affectedFiles: [`content/${block.section.toLowerCase()}.md`], canRollback: true,
    });
    return block;
  }

  // ── 22-04: Layout Block Editor ───────────────────────────────────────────────

  getLayoutBlocks(projectId: string): LayoutBlock[] {
    const blocks = this.layout.get(projectId);
    if (!blocks) return this.getDefaultLayout(projectId);
    return [...blocks].sort((a, b) => a.order - b.order);
  }

  updateLayout(dto: UpdateLayoutDto): LayoutBlock[] {
    const current = this.getLayoutBlocks(dto.projectId);
    for (const update of dto.blocks) {
      const block = current.find(b => b.id === update.id);
      if (block && !block.locked) {
        block.visible = update.visible;
        block.order = update.order;
      }
    }
    const sorted = current.sort((a, b) => a.order - b.order);
    this.layout.set(dto.projectId, sorted);
    this.addHistoryEntry(dto.workspaceId, dto.projectId, {
      sessionId: generateId('sess'), eventType: 'APPLIED', mode: 'LAYOUT',
      description: `Layout updated: ${dto.blocks.length} blocks reordered`,
      affectedFiles: ['src/app/page.tsx'], canRollback: true,
    });
    return sorted;
  }

  private getDefaultLayout(projectId: string): LayoutBlock[] {
    const blocks: LayoutBlock[] = [
      { id: 'lb-navbar', type: 'NAVBAR', label: 'Navigation Bar', visible: true, order: 0, locked: true, canDuplicate: false, canReplace: false },
      { id: 'lb-hero', type: 'HERO', label: 'Hero Section', visible: true, order: 1, locked: false, canDuplicate: false, canReplace: true },
      { id: 'lb-features', type: 'FEATURES', label: 'Features Grid', visible: true, order: 2, locked: false, canDuplicate: true, canReplace: true },
      { id: 'lb-cta', type: 'CTA', label: 'Call-to-Action', visible: true, order: 3, locked: false, canDuplicate: true, canReplace: true },
      { id: 'lb-footer', type: 'FOOTER', label: 'Footer', visible: true, order: 4, locked: true, canDuplicate: false, canReplace: false },
    ];
    this.layout.set(projectId, blocks);
    return blocks;
  }

  // ── 22-05: Safe File Explorer ────────────────────────────────────────────────

  getSafeFile(projectId: string, filePath: string): SafeFileView {
    for (const blocked of BLOCKED_META_KEYS) {
      if (filePath.includes(blocked)) {
        throw new BadRequestException(`File path is blocked: ${filePath}`);
      }
    }

    const safeToEdit = SAFE_EDITABLE_FILES.has(filePath) || filePath.startsWith('src/components/') || filePath.startsWith('src/styles/');
    const ext = filePath.split('.').pop() ?? '';
    const languageMap: Record<string, string> = {
      tsx: 'typescript', ts: 'typescript', css: 'css', md: 'markdown', json: 'json', js: 'javascript',
    };
    const language = languageMap[ext] ?? 'text';

    const seededContent: Record<string, string> = {
      'src/app/page.tsx': `export default function HomePage() {\n  return (\n    <main>\n      <Hero />\n      <Features />\n      <Pricing />\n    </main>\n  );\n}`,
      'src/styles/globals.css': `:root {\n  --primary: #6366f1;\n  --bg: #030712;\n  --text: #f1f5f9;\n}\n\nbody { background: var(--bg); color: var(--text); }`,
      'src/components/Hero.tsx': `export function Hero() {\n  return (\n    <section>\n      <h1>Build your AI-powered app</h1>\n      <p>CreatorOS gives founders a complete workspace.</p>\n    </section>\n  );\n}`,
    };

    return {
      path: filePath, name: filePath.split('/').pop() ?? filePath,
      language, content: seededContent[filePath] ?? `// ${filePath}\n// Content preview not available in safe view mode.`,
      linesCount: (seededContent[filePath] ?? '').split('\n').length,
      safeToEdit,
      editReason: safeToEdit ? undefined : 'This file requires Advanced mode to edit.',
    };
  }

  // ── 22-06: Diff + Approval System ───────────────────────────────────────────

  generateDiff(sessionId: string): FileDiff[] {
    const session = this.sessions.get(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.diffs.length > 0) return session.diffs;

    const seededDiffs: FileDiff[] = [
      {
        filePath: 'src/styles/theme.ts', action: 'MODIFY',
        before: "primaryColor: '#3b82f6'", after: `primaryColor: '${session.mode === 'BRANDING' ? '#6366f1' : '#3b82f6'}'`,
        linesChanged: 2, affectedComponents: ['Navbar', 'Hero'], riskLevel: 'LOW',
      },
    ];
    session.diffs = seededDiffs;
    session.status = 'PENDING_DIFF';
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    this.addHistoryEntry(session.workspaceId, session.projectId, {
      sessionId, eventType: 'DIFF_GENERATED', mode: session.mode,
      description: `Diff generated: ${seededDiffs.length} file(s) changed`,
      affectedFiles: seededDiffs.map(d => d.filePath), canRollback: false,
    });
    return seededDiffs;
  }

  approveAndApply(sessionId: string, workspaceId: string, projectId: string): EditSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== 'PENDING_DIFF') throw new BadRequestException('Session is not pending diff approval');

    const snapshotId = session.snapshotId ?? generateId('snap');
    if (!session.snapshotId) {
      this.addHistoryEntry(workspaceId, projectId, {
        sessionId, eventType: 'SNAPSHOT_CREATED', mode: session.mode,
        description: `Auto-snapshot ${snapshotId} before apply`,
        affectedFiles: [], snapshotId, canRollback: true,
      });
    }

    const qualityBefore = 80;
    const delta = session.mode === 'LAYOUT' ? -2 : session.mode === 'ADVANCED' ? -5 : 0;
    session.status = 'APPLIED';
    session.snapshotId = snapshotId;
    session.qualityBefore = qualityBefore;
    session.qualityAfter = qualityBefore + delta;
    session.qualityDelta = delta;
    session.appliedAt = new Date();
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    this.addHistoryEntry(workspaceId, projectId, {
      sessionId, eventType: 'APPLIED', mode: session.mode,
      description: `Edit applied: ${session.description}`,
      affectedFiles: session.diffs.map(d => d.filePath),
      qualityBefore, qualityAfter: session.qualityAfter, snapshotId, canRollback: true,
    });

    this.incrementAnalytic(workspaceId, 'approvedEdits');
    this.incrementAnalytic(workspaceId, 'snapshotsCreated');
    return session;
  }

  rejectDiff(sessionId: string, workspaceId: string, projectId: string): EditSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    session.status = 'REJECTED';
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    this.addHistoryEntry(workspaceId, projectId, {
      sessionId, eventType: 'REJECTED', mode: session.mode,
      description: `Edit rejected: ${session.description}`,
      affectedFiles: session.diffs.map(d => d.filePath), canRollback: false,
    });
    this.incrementAnalytic(workspaceId, 'rejectedEdits');
    return session;
  }

  // ── 22-07: AI Change Engine ──────────────────────────────────────────────────

  generateChangePlan(dto: AIChangePlanDto): AIChangePlan {
    this.validateContent(dto.prompt);

    const lower = dto.prompt.toLowerCase();
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let riskReason = 'Visual-only change with no logic impact';
    let suggestedMode: EditorMode = 'VISUAL';
    const affectedFiles: string[] = [];

    if (/auth|payment|stripe|checkout|billing|database|schema|migration/.test(lower)) {
      riskLevel = 'HIGH'; riskReason = 'Touches authentication, payments, or data schema';
      suggestedMode = 'ADVANCED'; affectedFiles.push('src/lib/auth.ts', 'src/api/payments.ts');
    } else if (/api|route|endpoint|server|backend/.test(lower)) {
      riskLevel = 'MEDIUM'; riskReason = 'API or routing changes may break existing integrations';
      suggestedMode = 'ADVANCED'; affectedFiles.push('src/app/api');
    } else if (/layout|block|section|page structure/.test(lower)) {
      riskLevel = 'MEDIUM'; riskReason = 'Layout changes affect multiple page sections';
      suggestedMode = 'LAYOUT'; affectedFiles.push('src/app/page.tsx');
    } else if (/color|font|brand|logo|style|theme/.test(lower)) {
      riskLevel = 'LOW'; riskReason = 'Styling change only';
      suggestedMode = 'BRANDING'; affectedFiles.push('src/styles/theme.ts');
    } else if (/text|headline|copy|content|paragraph/.test(lower)) {
      riskLevel = 'LOW'; riskReason = 'Content-only change';
      suggestedMode = 'CONTENT'; affectedFiles.push('content/homepage.md');
    }

    const id = generateId('plan');
    const plan: AIChangePlan = {
      id, projectId: dto.projectId, prompt: dto.prompt,
      affectedFiles, estimatedDiffs: affectedFiles.length || 1,
      riskLevel, riskReason, requiresConfirmation: riskLevel === 'HIGH',
      suggestedMode,
      scopeSummary: `${riskLevel} risk — ${riskReason}. Suggested mode: ${suggestedMode}. Affects ${affectedFiles.length || 1} file(s).`,
    };
    this.changePlans.set(id, plan);
    return plan;
  }

  // ── 22-08: Snapshot-First Editing ────────────────────────────────────────────

  createEditSnapshot(workspaceId: string, projectId: string, sessionId: string): { snapshotId: string; rollbackPoint: string } {
    const snapshotId = generateId('snap');
    const rollbackPoint = generateId('rb');

    const session = this.sessions.get(sessionId);
    if (session) {
      session.snapshotId = snapshotId;
      this.sessions.set(sessionId, session);
    }

    this.addHistoryEntry(workspaceId, projectId, {
      sessionId, eventType: 'SNAPSHOT_CREATED', mode: session?.mode ?? 'VISUAL',
      description: `Manual snapshot ${snapshotId} — rollback point ${rollbackPoint}`,
      affectedFiles: [], snapshotId, canRollback: true,
    });
    this.incrementAnalytic(workspaceId, 'snapshotsCreated');
    return { snapshotId, rollbackPoint };
  }

  rollback(sessionId: string, workspaceId: string, projectId: string): EditSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (!session.snapshotId) throw new BadRequestException('No snapshot available to rollback to');
    if (session.status !== 'APPLIED') throw new BadRequestException('Can only rollback applied sessions');

    session.status = 'ROLLED_BACK';
    session.rolledBackAt = new Date();
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    this.addHistoryEntry(workspaceId, projectId, {
      sessionId, eventType: 'ROLLED_BACK', mode: session.mode,
      description: `Rolled back to snapshot ${session.snapshotId}`,
      affectedFiles: session.diffs.map(d => d.filePath),
      snapshotId: session.snapshotId, canRollback: false,
    });
    this.incrementAnalytic(workspaceId, 'rolledBackEdits');
    return session;
  }

  // ── 22-09: Quality Recheck ────────────────────────────────────────────────────

  recheckQuality(projectId: string, sessionId: string): { score: number; delta: number; degraded: boolean; suggestion?: string } {
    const session = this.sessions.get(sessionId);
    const qualityBefore = session?.qualityBefore ?? 80;
    const modePenalty: Record<EditorMode, number> = { VISUAL: 0, CONTENT: 0, BRANDING: 0, LAYOUT: -2, ADVANCED: -5 };
    const delta = session ? modePenalty[session.mode] : 0;
    const score = Math.max(0, Math.min(100, qualityBefore + delta));
    const degraded = delta < 0;

    if (session) {
      session.qualityAfter = score;
      session.qualityDelta = delta;
      this.sessions.set(sessionId, session);
    }

    this.addHistoryEntry(session?.workspaceId ?? 'unknown', projectId, {
      sessionId, eventType: 'QUALITY_RECHECK', mode: session?.mode ?? 'VISUAL',
      description: `Quality recheck: ${score}/100 (${delta >= 0 ? '+' : ''}${delta})`,
      affectedFiles: [], qualityBefore, qualityAfter: score, canRollback: false,
    });

    return {
      score, delta, degraded,
      suggestion: degraded ? `Quality degraded by ${Math.abs(delta)} points. Consider rolling back or reviewing the changes.` : undefined,
    };
  }

  // ── 22-11: Edit History ───────────────────────────────────────────────────────

  getEditHistory(workspaceId: string, projectId: string, limit = 50): EditHistoryEntry[] {
    const key = `${workspaceId}:${projectId}`;
    return (this.history.get(key) ?? []).slice(0, limit);
  }

  private addHistoryEntry(
    workspaceId: string, projectId: string,
    entry: Omit<EditHistoryEntry, 'id' | 'workspaceId' | 'projectId' | 'timestamp'>,
  ): void {
    const key = `${workspaceId}:${projectId}`;
    const entries = this.history.get(key) ?? [];
    entries.unshift({
      id: generateId('evt'), workspaceId, projectId, timestamp: new Date(), ...entry,
    });
    if (entries.length > 200) entries.splice(200);
    this.history.set(key, entries);
  }

  // ── 22-14: Analytics ──────────────────────────────────────────────────────────

  getAnalytics(workspaceId: string): EditorAnalytics {
    const data = this.analytics.get(workspaceId) ?? {};
    const sessions = Array.from(this.sessions.values()).filter(s => s.workspaceId === workspaceId);

    const editsByMode = { VISUAL: 0, CONTENT: 0, BRANDING: 0, LAYOUT: 0, ADVANCED: 0 } as Record<EditorMode, number>;
    let totalDelta = 0, deltaCount = 0;
    for (const s of sessions) {
      editsByMode[s.mode] = (editsByMode[s.mode] ?? 0) + 1;
      if (s.qualityDelta !== undefined) { totalDelta += s.qualityDelta; deltaCount++; }
    }

    const approved = data.approvedEdits ?? 0;
    const total = data.totalEditSessions ?? sessions.length;

    return {
      workspaceId, period: '30d',
      totalEditSessions: total,
      approvedEdits: approved,
      rejectedEdits: data.rejectedEdits ?? 0,
      rolledBackEdits: data.rolledBackEdits ?? 0,
      editsByMode,
      avgQualityDelta: deltaCount > 0 ? Math.round((totalDelta / deltaCount) * 100) / 100 : 0,
      snapshotsCreated: data.snapshotsCreated ?? 0,
      diffApprovalsRate: total > 0 ? Math.round((approved / total) * 100) / 100 : 0,
    };
  }

  trackAnalytic(workspaceId: string, field: keyof EditorAnalytics): void {
    const data = this.analytics.get(workspaceId) ?? {};
    const current = (data[field] as number | undefined) ?? 0;
    if (typeof current === 'number') {
      (data[field] as number) = current + 1;
    }
    this.analytics.set(workspaceId, data);
  }

  private incrementAnalytic(workspaceId: string, field: keyof EditorAnalytics): void {
    this.trackAnalytic(workspaceId, field);
  }

  // ── 22-10: Edit Safety Validation ────────────────────────────────────────────

  private validateContent(value: string): void {
    if (EDITOR_BLOCKED_CONTENT.test(value)) {
      throw new BadRequestException('Content contains blocked or sensitive keywords');
    }
    if (DANGEROUS_EDIT_PATTERNS.test(value)) {
      throw new BadRequestException('Content contains dangerous patterns');
    }
  }

  validateEditSafety(content: string): { safe: boolean; reason?: string } {
    if (EDITOR_BLOCKED_CONTENT.test(content)) return { safe: false, reason: 'Contains blocked keywords' };
    if (DANGEROUS_EDIT_PATTERNS.test(content)) return { safe: false, reason: 'Contains dangerous patterns' };
    return { safe: true };
  }
}
