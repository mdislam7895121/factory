import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  PairSession, PairMessage, PairAction, PatchPlan, PatchStatus, PatchRisk, FilePatch, FileMutationCheck,
  TerminalAction, TerminalStatus, BuildLog, BugFinding, BugCategory, BugSeverity,
  TestSuggestion, TestType, ChangeHistoryEntry, ChangeEventType, CollaborationPrep, PairAnalytics,
  CreatePairSessionDto, SendPairMessageDto, CreatePatchPlanDto, RunTerminalDto, GenerateTestsDto,
  PAIR_BLOCKED_CONTENT, DANGEROUS_PATCH_PATTERNS, BLOCKED_META_KEYS_23, ALLOWED_TERMINAL_COMMANDS,
} from './pair-programmer.types';

// ── 23: Advanced AI Pair Programmer Service ───────────────────────────────────

const SAFE_MUTABLE_PREFIXES = [
  'src/components/', 'src/app/', 'src/styles/', 'src/hooks/',
  'src/utils/', 'src/lib/helpers/', 'public/', 'content/',
  'src/app/page.tsx', 'src/app/layout.tsx',
];

const BLOCKED_PREFIXES = [
  '.env', '.git', 'node_modules', 'prisma/migrations',
  'src/lib/auth', 'src/lib/jwt', 'src/server/auth', 'src/middleware',
  '__factory__', '__runtime__', 'orchestrator', '.pem', '.key',
];

const REFACTOR_SAFE = [
  'component cleanup', 'prop extraction', 'naming cleanup',
  'responsive fix', 'tailwind organization', 'type annotations',
  'extract hook', 'memoization',
];

const REFACTOR_BLOCKED = [
  'architecture rewrite', 'package replacement', 'auth redesign',
  'infra mutation', 'runtime mutation', 'database migration',
  'remove authentication', 'bypass auth',
];

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function rel(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

const AI_RESPONSES: Record<PairAction, (filePath?: string) => string> = {
  EXPLAIN: (f) => `This ${f ? `file \`${f}\`` : 'component'} is a React client component that renders a section of the UI. It uses inline styles with the dark cinematic palette (BG=#030712, ACCENT=#6366f1). The component accepts props for data and renders a responsive layout using CSS flexbox. Key areas: the main container uses \`display:flex\` with a gap of 16px, and each card uses the \`GLASS\` surface style for depth.`,

  SUGGEST: (f) => `Suggested improvements for ${f ? `\`${f}\`` : 'this component'}:\n1. Extract the color constants into a shared theme file to avoid repetition\n2. Add \`aria-label\` to interactive buttons for accessibility\n3. Use \`React.memo()\` on list-rendered sub-components to prevent unnecessary re-renders\n4. Add a loading skeleton state for async data\n5. Consider extracting the card sub-component into its own file for testability`,

  PATCH: (f) => `Patch plan for ${f ? `\`${f}\`` : 'the selected file'}:\n- Add \`aria-label\` attributes to buttons (+3 lines)\n- Extract color constants to top of file (+8 lines)\n- Add \`React.memo\` wrapper to list items (+2 lines)\nRisk: LOW — UI-only changes, no logic affected\nAffected components: 1 file, ~13 lines changed`,

  BUGS: (f) => `Bug scan for ${f ? `\`${f}\`` : 'the project'}:\n🔴 CRITICAL: Missing error boundary — unhandled async errors will crash the component tree\n🟡 MEDIUM: No \`key\` prop on list items — may cause React reconciliation issues\n🟡 MEDIUM: \`useEffect\` has missing dependency — \`projectId\` not in deps array\n🟢 LOW: Button missing \`type="button"\` — may submit parent form unexpectedly\n🟢 LOW: Image missing \`alt\` attribute — accessibility issue`,

  REFACTOR: (f) => `Safe refactor suggestions for ${f ? `\`${f}\`` : 'this component'}:\n1. Extract \`StatusBadge\`, \`RiskBadge\` into shared component file (prop extraction)\n2. Move color constants to \`src/styles/theme.ts\` (naming cleanup)\n3. Split 400+ line component into sub-components (component cleanup)\n4. Add TypeScript interface for all props (type annotations)\nNote: Architecture and auth logic are untouched.`,

  TESTS: (f) => `Test suggestions for ${f ? `\`${f}\`` : 'this component'}:\n\`\`\`typescript\ndescribe('Component', () => {\n  it('renders without errors', () => {\n    render(<Component />);\n    expect(screen.getByRole('main')).toBeInTheDocument();\n  });\n  it('shows loading state', () => { ... });\n  it('handles empty data', () => { ... });\n  it('renders all required tabs', () => { ... });\n});\n\`\`\``,

  OPTIMIZE: (f) => `Performance optimizations for ${f ? `\`${f}\`` : 'this component'}:\n1. Add \`React.memo()\` to prevent unnecessary re-renders on parent updates\n2. Use \`useCallback\` for event handlers passed to child components\n3. Lazy-load heavy sub-panels with \`React.lazy()\` and \`Suspense\`\n4. Debounce API calls on text input (300ms)\n5. Add \`priority\` prop to above-fold images`,

  REVIEW: (f) => `Code review for ${f ? `\`${f}\`` : 'the selected file'}:\n✅ Good: Consistent use of inline styles, no hardcoded secrets\n✅ Good: useParams() correctly used without Suspense\n⚠ Warn: Some event handlers are defined inline — extract to named functions\n⚠ Warn: No explicit return types on some functions\n❌ Issue: Missing error handling in fetch calls — add try/catch with fallback`,

  GENERAL: () => `I'm your AI pair programmer for this Factory workspace. I can:\n- **Explain** any file or component\n- **Suggest** improvements\n- **Generate patches** safely\n- **Detect bugs** in your code\n- **Propose refactors** (safe operations only)\n- **Generate tests** for components and routes\n- **Optimize** performance\n\nTry asking: "Explain src/components/Hero.tsx" or "Find bugs in this project"`,
};

const SEEDED_BUILD_LOGS: Record<string, BuildLog[]> = {
  'proj-creator-os': [
    { id: 'bl-1', workspaceId: 'ws-founder-1', projectId: 'proj-creator-os', category: 'BUILD', severity: 'SUCCESS', message: '✓ 23 pages compiled successfully in 4.2s', timestamp: new Date(Date.now() - 120000) },
    { id: 'bl-2', workspaceId: 'ws-founder-1', projectId: 'proj-creator-os', category: 'RUNTIME', severity: 'WARN', message: 'useEffect dependency array incomplete in WorkspacePanel', file: 'src/components/WorkspacePanel.tsx', line: 84, aiExplanation: 'The effect depends on `projectId` but it is not listed in the dependency array, causing stale closure.', aiSuggestedFix: 'Add `projectId` to the useEffect dependency array: `[workspaceId, projectId]`', timestamp: new Date(Date.now() - 300000) },
    { id: 'bl-3', workspaceId: 'ws-founder-1', projectId: 'proj-creator-os', category: 'LINT', severity: 'WARN', message: 'Unused import: React (no longer needed with Next.js 16)', file: 'src/app/page.tsx', line: 1, aiSuggestedFix: 'Remove the `import React from "react"` line — Next.js 16 auto-imports React.', timestamp: new Date(Date.now() - 600000) },
    { id: 'bl-4', workspaceId: 'ws-founder-1', projectId: 'proj-creator-os', category: 'BUILD', severity: 'SUCCESS', message: '✓ Compiled 51/51 tests in 2.1s', timestamp: new Date(Date.now() - 900000) },
  ],
};

const SEEDED_BUGS: Record<string, BugFinding[]> = {
  'proj-creator-os': [
    { id: 'bug-1', projectId: 'proj-creator-os', category: 'MISSING_ERROR_BOUNDARY', severity: 'HIGH', title: 'No error boundary on workspace panel', description: 'If the workspace panel throws during render, the entire page will crash.', file: 'src/components/WorkspacePanel.tsx', suggestedFix: 'Wrap WorkspacePanel with a React ErrorBoundary component', autoFixable: false, detectedAt: new Date() },
    { id: 'bug-2', projectId: 'proj-creator-os', category: 'ACCESSIBILITY', severity: 'MEDIUM', title: 'Buttons missing aria-label', description: '7 icon buttons have no accessible label.', file: 'src/components/ActionBar.tsx', line: 44, suggestedFix: 'Add aria-label="Close panel" etc. to each icon button', autoFixable: true, detectedAt: new Date() },
    { id: 'bug-3', projectId: 'proj-creator-os', category: 'MOBILE_ISSUE', severity: 'MEDIUM', title: 'Fixed-width panel breaks on narrow viewports', description: 'The 270px right panel overflows on viewports < 480px.', file: 'src/app/workspace/[workspaceId]/project/[projectId]/page.tsx', suggestedFix: 'Add media query or use `min(270px, 100%)` for the right panel width', autoFixable: false, detectedAt: new Date() },
    { id: 'bug-4', projectId: 'proj-creator-os', category: 'PERFORMANCE', severity: 'LOW', title: 'Large inline event handlers prevent memo optimization', description: 'Inline arrow functions recreate on every render, preventing child memo.', file: 'src/components/ActivityStream.tsx', suggestedFix: 'Extract handlers to useCallback hooks', autoFixable: true, detectedAt: new Date() },
    { id: 'bug-5', projectId: 'proj-creator-os', category: 'RUNTIME_BEHAVIOR', severity: 'LOW', title: 'Unhandled fetch rejection', description: 'API fetch in useEffect has no catch block — network errors will be silently ignored.', file: 'src/app/workspace/page.tsx', line: 67, suggestedFix: 'Add .catch(err => setError(err.message)) to the fetch chain', autoFixable: true, detectedAt: new Date() },
  ],
};

@Injectable()
export class PairProgrammerService {
  private readonly sessions  = new Map<string, PairSession>();
  private readonly patches   = new Map<string, PatchPlan>();
  private readonly terminal  = new Map<string, TerminalAction[]>();
  private readonly buildLogs = new Map<string, BuildLog[]>(
    Object.entries(SEEDED_BUILD_LOGS).map(([k, v]) => [k, [...v]])
  );
  private readonly bugs      = new Map<string, BugFinding[]>(
    Object.entries(SEEDED_BUGS).map(([k, v]) => [k, [...v]])
  );
  private readonly tests     = new Map<string, TestSuggestion[]>();
  private readonly history   = new Map<string, ChangeHistoryEntry[]>();
  private readonly analytics = new Map<string, Partial<PairAnalytics>>();

  // ── 23-02: AI Pair Programmer ──────────────────────────────────────────────

  createPairSession(dto: CreatePairSessionDto): PairSession {
    const id = genId('pair');
    const session: PairSession = {
      id, workspaceId: dto.workspaceId, projectId: dto.projectId,
      messages: [], createdAt: new Date(), updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    this.incrementAnalytic(dto.workspaceId, 'aiSessionsStarted');
    this.addHistory(dto.workspaceId, dto.projectId, {
      eventType: 'AI_PATCH_GENERATED', title: 'AI session started',
      description: 'New pair programming session opened',
      affectedFiles: [], canRestore: false, authorId: 'founder',
    });
    return session;
  }

  getPairSession(sessionId: string): PairSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  listPairSessions(projectId: string): PairSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  sendMessage(dto: SendPairMessageDto): { userMessage: PairMessage; aiMessage: PairMessage } {
    this.validateContent(dto.content);

    const session = this.sessions.get(dto.sessionId);
    if (!session) throw new NotFoundException('Pair session not found');

    const action: PairAction = dto.action ?? this.inferAction(dto.content);

    const userMsg: PairMessage = {
      id: genId('msg'), role: 'USER', content: dto.content,
      action, filePath: dto.filePath, timestamp: new Date(),
    };

    const responseFn = AI_RESPONSES[action];
    const aiContent = responseFn(dto.filePath);
    let patchPlanId: string | undefined;

    if (action === 'PATCH') {
      const plan = this.createPatchPlan({
        workspaceId: session.workspaceId, projectId: session.projectId,
        prompt: dto.content, sessionId: dto.sessionId,
        targetFiles: dto.filePath ? [dto.filePath] : undefined,
      });
      patchPlanId = plan.id;
    }

    const aiMsg: PairMessage = {
      id: genId('msg'), role: 'ASSISTANT', content: aiContent,
      action, filePath: dto.filePath, timestamp: new Date(), patchPlanId,
    };

    session.messages.push(userMsg, aiMsg);
    session.updatedAt = new Date();
    this.sessions.set(dto.sessionId, session);
    this.incrementAnalytic(session.workspaceId, 'aiMessagesExchanged');
    return { userMessage: userMsg, aiMessage: aiMsg };
  }

  private inferAction(content: string): PairAction {
    const lower = content.toLowerCase();
    if (/explain|what is|how does|describe/.test(lower)) return 'EXPLAIN';
    if (/suggest|improve|better|enhance/.test(lower)) return 'SUGGEST';
    if (/patch|change|modify|update|fix/.test(lower)) return 'PATCH';
    if (/bug|issue|error|problem|broken/.test(lower)) return 'BUGS';
    if (/refactor|clean|rename|extract|reorganize/.test(lower)) return 'REFACTOR';
    if (/test|spec|jest|coverage/.test(lower)) return 'TESTS';
    if (/optim|performance|speed|faster|memo/.test(lower)) return 'OPTIMIZE';
    if (/review|audit|check|inspect/.test(lower)) return 'REVIEW';
    return 'GENERAL';
  }

  // ── 23-03: Patch Generation Engine ────────────────────────────────────────

  createPatchPlan(dto: CreatePatchPlanDto): PatchPlan {
    this.validateContent(dto.prompt);

    const lower = dto.prompt.toLowerCase();
    let riskLevel: PatchRisk = 'LOW';
    let riskReason = 'UI/style change only';

    if (/auth|payment|stripe|billing|database|migration|seed|production/.test(lower)) {
      riskLevel = 'CRITICAL'; riskReason = 'Touches auth, payments, or production data';
    } else if (/api|route|endpoint|server|backend|middleware|prisma/.test(lower)) {
      riskLevel = 'HIGH'; riskReason = 'API/server-side changes may break integrations';
    } else if (/layout|restructure|refactor|rename|extract/.test(lower)) {
      riskLevel = 'MEDIUM'; riskReason = 'Structural change affects multiple components';
    }

    const refactorBlocked = REFACTOR_BLOCKED.some(b => lower.includes(b));
    if (refactorBlocked) throw new BadRequestException('This refactor type is not permitted in controlled code mode');

    const affectedFiles = dto.targetFiles ?? this.inferAffectedFiles(lower);
    const patches: FilePatch[] = affectedFiles.map(f => this.generateFilePatch(f, dto.prompt));
    const allSafe = patches.every(p => p.safeToApply);

    if (!allSafe) {
      const blocked = patches.find(p => !p.safeToApply);
      throw new BadRequestException(`File mutation blocked: ${blocked?.blockedReason}`);
    }

    const qualityImpact = riskLevel === 'CRITICAL' ? -8 : riskLevel === 'HIGH' ? -4 : riskLevel === 'MEDIUM' ? -1 : 0;
    const id = genId('patch');
    const plan: PatchPlan = {
      id, workspaceId: dto.workspaceId, projectId: dto.projectId,
      sessionId: dto.sessionId, prompt: dto.prompt,
      status: 'GENERATED', riskLevel, riskReason,
      requiresConfirmation: riskLevel === 'HIGH' || riskLevel === 'CRITICAL',
      affectedFiles, patches, qualityImpact,
      patchSummary: `${riskLevel} risk — ${patches.length} file(s), ${patches.reduce((s, p) => s + p.linesAdded, 0)} additions, ${patches.reduce((s, p) => s + p.linesRemoved, 0)} removals`,
      createdAt: new Date(), updatedAt: new Date(),
    };
    this.patches.set(id, plan);

    this.addHistory(dto.workspaceId, dto.projectId, {
      eventType: 'AI_PATCH_GENERATED', title: `Patch generated: ${dto.prompt.slice(0, 60)}`,
      description: plan.patchSummary, affectedFiles, canRestore: false, authorId: 'ai',
    });
    return plan;
  }

  getPatchPlan(planId: string): PatchPlan | null {
    return this.patches.get(planId) ?? null;
  }

  listPatchPlans(projectId: string): PatchPlan[] {
    return Array.from(this.patches.values())
      .filter(p => p.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  approvePatch(planId: string, workspaceId: string, projectId: string): PatchPlan {
    const plan = this.patches.get(planId);
    if (!plan) throw new NotFoundException('Patch plan not found');
    if (plan.status !== 'GENERATED') throw new BadRequestException('Patch is not in GENERATED state');

    const snapshotId = genId('snap');
    plan.status = 'APPLIED';
    plan.snapshotId = snapshotId;
    plan.appliedAt = new Date();
    plan.updatedAt = new Date();
    this.patches.set(planId, plan);

    this.addHistory(workspaceId, projectId, {
      eventType: 'PATCH_APPLIED', title: `Patch applied`,
      description: plan.patchSummary,
      affectedFiles: plan.affectedFiles, snapshotId, canRestore: true, authorId: 'founder',
      qualityBefore: 80, qualityAfter: Math.max(0, 80 + plan.qualityImpact),
    });
    this.incrementAnalytic(workspaceId, 'patchApprovals');
    return plan;
  }

  rejectPatch(planId: string, workspaceId: string, projectId: string): PatchPlan {
    const plan = this.patches.get(planId);
    if (!plan) throw new NotFoundException('Patch plan not found');
    if (plan.status !== 'GENERATED') throw new BadRequestException('Patch is not in GENERATED state');

    plan.status = 'REJECTED';
    plan.rejectionReason = 'Rejected by user';
    plan.updatedAt = new Date();
    this.patches.set(planId, plan);

    this.addHistory(workspaceId, projectId, {
      eventType: 'AI_PATCH_GENERATED', title: `Patch rejected`,
      description: `User rejected: ${plan.prompt.slice(0, 60)}`,
      affectedFiles: plan.affectedFiles, canRestore: false, authorId: 'founder',
    });
    this.incrementAnalytic(workspaceId, 'patchRejections');
    return plan;
  }

  rollbackPatch(planId: string, workspaceId: string, projectId: string): PatchPlan {
    const plan = this.patches.get(planId);
    if (!plan) throw new NotFoundException('Patch plan not found');
    if (plan.status !== 'APPLIED') throw new BadRequestException('Can only rollback applied patches');
    if (!plan.snapshotId) throw new BadRequestException('No snapshot available for rollback');

    plan.status = 'ROLLED_BACK';
    plan.updatedAt = new Date();
    this.patches.set(planId, plan);

    this.addHistory(workspaceId, projectId, {
      eventType: 'ROLLBACK_PERFORMED', title: 'Patch rolled back',
      description: `Restored snapshot ${plan.snapshotId}`,
      affectedFiles: plan.affectedFiles, snapshotId: plan.snapshotId, canRestore: false, authorId: 'founder',
    });
    this.incrementAnalytic(workspaceId, 'rollbackCount');
    return plan;
  }

  // ── 23-04: Safe File Mutation Layer ──────────────────────────────────────

  checkFileMutation(filePath: string): FileMutationCheck {
    for (const blocked of BLOCKED_PREFIXES) {
      if (filePath.startsWith(blocked) || filePath.includes(blocked)) {
        return { filePath, status: 'BLOCKED', reason: `File path matches blocked pattern: ${blocked}`, allowedOperations: [] };
      }
    }
    for (const key of BLOCKED_META_KEYS_23) {
      if (filePath.includes(key)) {
        return { filePath, status: 'BLOCKED', reason: `Contains blocked meta key: ${key}`, allowedOperations: [] };
      }
    }
    const isSafe = SAFE_MUTABLE_PREFIXES.some(p => filePath.startsWith(p));
    if (isSafe) {
      return { filePath, status: 'ALLOWED', reason: 'File is in the safe mutation zone', allowedOperations: ['READ', 'PATCH', 'AI_SUGGEST', 'DIFF'] };
    }
    return { filePath, status: 'RESTRICTED', reason: 'File requires Advanced mode review', allowedOperations: ['READ'] };
  }

  private generateFilePatch(filePath: string, prompt: string): FilePatch {
    const check = this.checkFileMutation(filePath);
    if (check.status === 'BLOCKED') {
      return { filePath, action: 'MODIFY', hunks: [], linesAdded: 0, linesRemoved: 0, safeToApply: false, blockedReason: check.reason };
    }

    const hunkTemplates: Record<string, { removal: string; addition: string }> = {
      'aria': { removal: '<button>', addition: '<button aria-label="Action">' },
      'color': { removal: "color: 'blue'", addition: "color: ACCENT" },
      'memo': { removal: 'export function', addition: 'export const Component = React.memo(function' },
      'type': { removal: 'const handler = (e) =>', addition: 'const handler = (e: React.MouseEvent<HTMLButtonElement>) =>' },
    };

    const lower = prompt.toLowerCase();
    const key = Object.keys(hunkTemplates).find(k => lower.includes(k)) ?? 'color';
    const tmpl = hunkTemplates[key];

    return {
      filePath, action: 'MODIFY',
      hunks: [{ startLine: 42, context: '// Generated patch hunk', removals: [tmpl.removal], additions: [tmpl.addition] }],
      linesAdded: 1, linesRemoved: 1, safeToApply: check.status !== 'BLOCKED',
    };
  }

  private inferAffectedFiles(prompt: string): string[] {
    if (/hero/.test(prompt)) return ['src/components/Hero.tsx'];
    if (/pricing/.test(prompt)) return ['src/components/Pricing.tsx'];
    if (/nav|navbar/.test(prompt)) return ['src/components/Navbar.tsx'];
    if (/page|layout/.test(prompt)) return ['src/app/page.tsx'];
    if (/style|theme|color/.test(prompt)) return ['src/styles/theme.ts'];
    return ['src/components/Hero.tsx', 'src/styles/theme.ts'];
  }

  // ── 23-06: AI Refactor Safety ──────────────────────────────────────────────

  validateRefactor(description: string): { allowed: boolean; reason: string; allowedTypes: string[] } {
    const lower = description.toLowerCase();
    const blocked = REFACTOR_BLOCKED.find(b => lower.includes(b));
    if (blocked) return { allowed: false, reason: `Blocked refactor type: "${blocked}"`, allowedTypes: REFACTOR_SAFE };
    return { allowed: true, reason: 'Refactor is within safe operation bounds', allowedTypes: REFACTOR_SAFE };
  }

  // ── 23-07: Controlled Terminal Actions ────────────────────────────────────

  listTerminalCommands(): { key: string; command: string; description: string; timeoutMs: number }[] {
    return Array.from(ALLOWED_TERMINAL_COMMANDS.entries()).map(([key, v]) => ({ key, ...v }));
  }

  runTerminalAction(dto: RunTerminalDto): TerminalAction {
    const allowed = ALLOWED_TERMINAL_COMMANDS.get(dto.commandKey);
    if (!allowed) throw new BadRequestException(`Command '${dto.commandKey}' is not in the allowlist`);

    const id = genId('term');
    const action: TerminalAction = {
      id, workspaceId: dto.workspaceId, projectId: dto.projectId,
      commandKey: dto.commandKey, command: allowed.command,
      description: allowed.description, status: 'SUCCESS',
      output: this.getSeededOutput(dto.commandKey),
      exitCode: 0, durationMs: Math.floor(Math.random() * 3000) + 500,
      queuedAt: new Date(), startedAt: new Date(), completedAt: new Date(),
    };

    const existing = this.terminal.get(dto.projectId) ?? [];
    existing.unshift(action);
    if (existing.length > 50) existing.splice(50);
    this.terminal.set(dto.projectId, existing);

    this.addHistory(dto.workspaceId, dto.projectId, {
      eventType: 'TERMINAL_COMMAND', title: `Terminal: ${allowed.description}`,
      description: `Ran ${allowed.command} — exited 0`, affectedFiles: [], canRestore: false, authorId: 'founder',
    });
    this.incrementAnalytic(dto.workspaceId, 'terminalActionsRun');
    return action;
  }

  rejectUnknownCommand(rawCommand: string): { blocked: boolean; reason: string } {
    if (/sudo|bash|sh\s|eval|exec|&&|\|\||;|>|<|\$\(|`|curl|wget|rm\s/.test(rawCommand)) {
      return { blocked: true, reason: 'Command contains blocked shell patterns' };
    }
    return { blocked: true, reason: 'Command not in the terminal allowlist. Use predefined safe commands.' };
  }

  listTerminalHistory(projectId: string): TerminalAction[] {
    return this.terminal.get(projectId) ?? [];
  }

  private getSeededOutput(key: string): string {
    const outputs: Record<string, string> = {
      'npm:build':       '> factory-web@0.1.0 build\n✓ Compiled successfully\n✓ 23/23 pages generated\nDone in 4.2s',
      'npm:test':        'PASS src/workspace/workspace.spec.ts\nPASS src/quality/quality.spec.ts\nTests: 556 passed, 557 total\nTime: 3.4s',
      'npm:lint':        '\n> eslint src/\n3 warnings found (unused imports)\n✓ No errors\n',
      'preview:restart': 'Restarting dev server...\n✓ Dev server started on http://localhost:3000\n',
      'quality:scan':    '✓ 23/23 pages compiled\nQuality score: 92/100\nNo critical issues found.',
      'jest:run':        'PASS src/editor/editor.spec.ts\n71 tests passed\nTime: 2.1s',
      'eslint:check':    '3 warnings (unused-vars, missing-deps, no-console)\n0 errors',
      'snapshot:create': 'Snapshot snap-abc123 created\nFiles: 23\nTimestamp: ' + new Date().toISOString(),
    };
    return outputs[key] ?? '✓ Done';
  }

  // ── 23-08: Live Build + Error Panel ───────────────────────────────────────

  getBuildLogs(projectId: string, limit = 20): BuildLog[] {
    return (this.buildLogs.get(projectId) ?? []).slice(0, limit);
  }

  addBuildLog(log: Omit<BuildLog, 'id'>): BuildLog {
    const full: BuildLog = { id: genId('log'), ...log };
    const existing = this.buildLogs.get(log.projectId) ?? [];
    existing.unshift(full);
    if (existing.length > 100) existing.splice(100);
    this.buildLogs.set(log.projectId, existing);
    if (log.severity === 'ERROR') this.incrementAnalytic(log.workspaceId, 'buildFailures');
    return full;
  }

  explainBuildError(logId: string, projectId: string): { explanation: string; suggestedFix: string } {
    const logs = this.buildLogs.get(projectId) ?? [];
    const log = logs.find(l => l.id === logId);
    if (!log) throw new NotFoundException('Build log not found');
    return {
      explanation: log.aiExplanation ?? `This ${log.severity} in ${log.category} indicates a ${log.severity === 'ERROR' ? 'blocking' : 'non-blocking'} issue that should be addressed.`,
      suggestedFix: log.aiSuggestedFix ?? 'Review the indicated file and line number for the root cause.',
    };
  }

  // ── 23-09: AI Bug Detector ────────────────────────────────────────────────

  detectBugs(projectId: string): BugFinding[] {
    const seeded = this.bugs.get(projectId) ?? [];
    if (seeded.length > 0) {
      this.incrementAnalytic(this.getWorkspaceForProject(projectId), 'bugsDetected');
      return seeded.sort((a, b) => {
        const order: Record<BugSeverity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.severity] - order[b.severity];
      });
    }
    return this.generateDefaultBugs(projectId);
  }

  getBugFinding(bugId: string, projectId: string): BugFinding | null {
    return (this.bugs.get(projectId) ?? []).find(b => b.id === bugId) ?? null;
  }

  dismissBug(bugId: string, projectId: string): boolean {
    const bugs = this.bugs.get(projectId) ?? [];
    const idx = bugs.findIndex(b => b.id === bugId);
    if (idx === -1) return false;
    bugs.splice(idx, 1);
    this.bugs.set(projectId, bugs);
    return true;
  }

  private generateDefaultBugs(projectId: string): BugFinding[] {
    const findings: BugFinding[] = [
      { id: genId('bug'), projectId, category: 'ACCESSIBILITY', severity: 'MEDIUM', title: 'Interactive elements missing labels', description: 'Icon buttons have no accessible text.', suggestedFix: 'Add aria-label to all icon buttons', autoFixable: true, detectedAt: new Date() },
      { id: genId('bug'), projectId, category: 'RUNTIME_BEHAVIOR', severity: 'LOW', title: 'Unhandled fetch error', description: 'API fetch lacks error handling.', suggestedFix: 'Add .catch() handlers to all fetch calls', autoFixable: true, detectedAt: new Date() },
    ];
    this.bugs.set(projectId, findings);
    return findings;
  }

  private getWorkspaceForProject(projectId: string): string {
    return projectId.startsWith('proj-') ? 'ws-founder-1' : 'ws-unknown';
  }

  // ── 23-10: Test Generation Assistant ──────────────────────────────────────

  generateTests(dto: GenerateTestsDto): TestSuggestion {
    const check = this.checkFileMutation(dto.targetFile);
    if (check.status === 'BLOCKED') throw new BadRequestException(`Cannot generate tests for blocked file: ${dto.targetFile}`);

    const componentName = dto.targetFile.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') ?? 'Component';
    const testFileName = dto.targetFile.replace(/\.(tsx?|jsx?)$/, '.test.tsx');

    const testCode = this.generateTestCode(componentName, dto.testType);
    const snapshotId = genId('snap');
    const suggestion: TestSuggestion = {
      id: genId('test'), projectId: dto.projectId, testType: dto.testType,
      targetFile: dto.targetFile, testFileName, testCode,
      description: `Generated ${dto.testType} tests for ${componentName}`,
      snapshotId, generated: true, generatedAt: new Date(),
    };

    const existing = this.tests.get(dto.projectId) ?? [];
    existing.unshift(suggestion);
    this.tests.set(dto.projectId, existing);

    this.addHistory(dto.workspaceId, dto.projectId, {
      eventType: 'TESTS_GENERATED', title: `Tests generated: ${componentName}`,
      description: `${dto.testType} tests for ${dto.targetFile}`,
      affectedFiles: [testFileName], snapshotId, canRestore: true, authorId: 'ai',
    });
    this.incrementAnalytic(dto.workspaceId, 'testsGenerated');
    return suggestion;
  }

  listGeneratedTests(projectId: string): TestSuggestion[] {
    return this.tests.get(projectId) ?? [];
  }

  private generateTestCode(name: string, type: TestType): string {
    const templates: Record<TestType, string> = {
      COMPONENT: `import { render, screen } from '@testing-library/react';\nimport { ${name} } from './${name}';\n\ndescribe('${name}', () => {\n  it('renders without errors', () => {\n    render(<${name} />);\n    expect(document.querySelector('[data-testid="${name.toLowerCase()}"]')).toBeTruthy();\n  });\n\n  it('shows correct content', () => {\n    render(<${name} />);\n    // TODO: add content assertions\n  });\n\n  it('handles empty state', () => {\n    render(<${name} items={[]} />);\n    expect(screen.getByText(/no items/i)).toBeInTheDocument();\n  });\n});`,
      ROUTE: `describe('Route: ${name}', () => {\n  it('returns 200 for valid request', async () => {\n    const res = await fetch('/api/${name.toLowerCase()}');\n    expect(res.status).toBe(200);\n  });\n\n  it('returns 404 for unknown id', async () => {\n    const res = await fetch('/api/${name.toLowerCase()}/unknown-id');\n    expect(res.status).toBe(404);\n  });\n\n  it('validates required fields', async () => {\n    const res = await fetch('/api/${name.toLowerCase()}', { method: 'POST', body: '{}' });\n    expect(res.status).toBe(400);\n  });\n});`,
      VALIDATION: `describe('${name} Validation', () => {\n  it('rejects empty input', () => {\n    expect(() => validate({})).toThrow();\n  });\n\n  it('accepts valid input', () => {\n    expect(() => validate({ name: 'Test', value: 42 })).not.toThrow();\n  });\n\n  it('rejects oversized strings', () => {\n    expect(() => validate({ name: 'x'.repeat(1001) })).toThrow();\n  });\n});`,
      SMOKE: `describe('${name} Smoke Tests', () => {\n  it('page loads without error', async () => {\n    const res = await fetch('/');\n    expect(res.status).toBe(200);\n  });\n\n  it('API health check passes', async () => {\n    const res = await fetch('/v1/health');\n    expect(res.status).toBe(200);\n  });\n\n  it('critical assets available', async () => {\n    const res = await fetch('/favicon.ico');\n    expect(res.status).toBe(200);\n  });\n});`,
      INTEGRATION: `describe('${name} Integration', () => {\n  it('creates and retrieves entity', async () => {\n    const created = await service.create({ name: 'Test' });\n    expect(created.id).toBeDefined();\n    const found = await service.findById(created.id);\n    expect(found.name).toBe('Test');\n  });\n\n  it('update is reflected in list', async () => {\n    const item = await service.create({ name: 'A' });\n    await service.update(item.id, { name: 'B' });\n    const list = await service.list();\n    expect(list.some(i => i.name === 'B')).toBe(true);\n  });\n});`,
    };
    return templates[type];
  }

  // ── 23-11: Git-like Change History ─────────────────────────────────────────

  getChangeHistory(workspaceId: string, projectId: string, limit = 50): ChangeHistoryEntry[] {
    const key = `${workspaceId}:${projectId}`;
    return (this.history.get(key) ?? []).slice(0, limit);
  }

  compareHistoryEntries(id1: string, id2: string, workspaceId: string, projectId: string): {
    entry1: ChangeHistoryEntry | null; entry2: ChangeHistoryEntry | null; filesChanged: string[];
  } {
    const entries = this.getChangeHistory(workspaceId, projectId, 200);
    const e1 = entries.find(e => e.id === id1) ?? null;
    const e2 = entries.find(e => e.id === id2) ?? null;
    const filesChanged = [...new Set([...(e1?.affectedFiles ?? []), ...(e2?.affectedFiles ?? [])])];
    return { entry1: e1, entry2: e2, filesChanged };
  }

  restoreFromHistory(entryId: string, workspaceId: string, projectId: string): { restored: boolean; snapshotId?: string } {
    const entries = this.getChangeHistory(workspaceId, projectId, 200);
    const entry = entries.find(e => e.id === entryId);
    if (!entry) throw new NotFoundException('History entry not found');
    if (!entry.canRestore) throw new BadRequestException('This history entry does not have a restore point');

    this.addHistory(workspaceId, projectId, {
      eventType: 'ROLLBACK_PERFORMED', title: 'Restored from history',
      description: `Restored to: ${entry.title}`,
      affectedFiles: entry.affectedFiles, snapshotId: entry.snapshotId, canRestore: false, authorId: 'founder',
    });
    this.incrementAnalytic(workspaceId, 'rollbackCount');
    return { restored: true, snapshotId: entry.snapshotId };
  }

  private addHistory(
    workspaceId: string, projectId: string,
    entry: Omit<ChangeHistoryEntry, 'id' | 'workspaceId' | 'projectId' | 'timestamp'>,
  ): void {
    const key = `${workspaceId}:${projectId}`;
    const entries = this.history.get(key) ?? [];
    entries.unshift({ id: genId('hist'), workspaceId, projectId, timestamp: new Date(), ...entry });
    if (entries.length > 300) entries.splice(300);
    this.history.set(key, entries);
  }

  // ── 23-12: Collaboration Preparation ──────────────────────────────────────

  getCollaborationPrep(workspaceId: string, projectId: string): CollaborationPrep {
    return {
      projectId, workspaceId, multiplayerReady: false,
      pendingFeatures: ['Real-time cursor sync', 'Comment threads', 'Shared memory', 'Review requests', 'Approval workflows'],
      architectureNotes: [
        'Sessions are in-memory Maps — migrate to Redis pub/sub for multiplayer',
        'PairSession.messages will become a shared CRDT document',
        'ChangeHistory will drive the shared timeline panel',
        'PatchPlan approval will support multi-reviewer sign-off',
      ],
      estimatedSerial: 'SERIAL 24',
    };
  }

  // ── 23-13: Security Validation ─────────────────────────────────────────────

  validatePatchContent(content: string): { safe: boolean; reason?: string } {
    if (PAIR_BLOCKED_CONTENT.test(content)) return { safe: false, reason: 'Contains blocked keywords (secrets, credentials)' };
    if (DANGEROUS_PATCH_PATTERNS.test(content)) return { safe: false, reason: 'Contains dangerous code patterns' };
    return { safe: true };
  }

  private validateContent(value: string): void {
    if (PAIR_BLOCKED_CONTENT.test(value)) throw new BadRequestException('Content contains blocked or sensitive keywords');
    if (DANGEROUS_PATCH_PATTERNS.test(value)) throw new BadRequestException('Content contains dangerous patterns');
  }

  // ── 23-15: Analytics ───────────────────────────────────────────────────────

  getAnalytics(workspaceId: string): PairAnalytics {
    const data = this.analytics.get(workspaceId) ?? {};
    const approvals = data.patchApprovals ?? 0;
    const rejections = data.patchRejections ?? 0;
    const total = approvals + rejections;
    return {
      workspaceId, period: '30d',
      patchApprovals: approvals,
      patchRejections: rejections,
      patchApprovalRate: total > 0 ? Math.round((approvals / total) * 100) / 100 : 0,
      rollbackCount: data.rollbackCount ?? 0,
      bugsDetected: data.bugsDetected ?? 0,
      testsGenerated: data.testsGenerated ?? 0,
      terminalActionsRun: data.terminalActionsRun ?? 0,
      buildFailures: data.buildFailures ?? 0,
      aiSessionsStarted: data.aiSessionsStarted ?? 0,
      aiMessagesExchanged: data.aiMessagesExchanged ?? 0,
    };
  }

  trackAnalytic(workspaceId: string, field: keyof PairAnalytics): void {
    const data = this.analytics.get(workspaceId) ?? {};
    const current = (data[field] as number | undefined) ?? 0;
    if (typeof current === 'number') (data[field] as number) = current + 1;
    this.analytics.set(workspaceId, data);
  }

  private incrementAnalytic(workspaceId: string, field: keyof PairAnalytics): void {
    this.trackAnalytic(workspaceId, field);
  }
}
