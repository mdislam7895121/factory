import { IsString, IsOptional, IsIn, MaxLength, IsArray } from 'class-validator';

// ── 23: Advanced AI Pair Programmer Types ─────────────────────────────────────

// ── Security Constants ────────────────────────────────────────────────────────

export const PAIR_BLOCKED_CONTENT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|shell|bash|sudo|chmod|\/etc\/passwd|api_key|private_key|access_key|jwt_secret|database_url/i;

export const DANGEROUS_PATCH_PATTERNS =
  /<script|javascript:|data:text\/html|eval\(|document\.cookie|window\.location|innerHTML\s*=|__proto__|prototype\.constructor|require\(['"]child_process|process\.env\[/i;

export const BLOCKED_META_KEYS_23 = new Set([
  '.env', '.env.local', '.env.production', '.env.staging',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.git', 'node_modules', 'prisma/migrations',
  'id_rsa', 'id_ed25519', '.pem', '.key', '.cert', '.p12',
  'src/lib/auth', 'src/lib/jwt', 'src/server/auth',
  '__factory__', '__runtime__', 'orchestrator',
]);

export const ALLOWED_TERMINAL_COMMANDS = new Map<string, { command: string; description: string; timeoutMs: number }>([
  ['npm:build',      { command: 'npm run build',    description: 'Build the project',        timeoutMs: 90000 }],
  ['npm:test',       { command: 'npm test',          description: 'Run test suite',           timeoutMs: 120000 }],
  ['npm:lint',       { command: 'npm run lint',      description: 'Run ESLint',               timeoutMs: 30000 }],
  ['preview:restart',{ command: 'npm run dev',       description: 'Restart dev preview',      timeoutMs: 15000 }],
  ['quality:scan',   { command: 'npx next build',    description: 'Quality / build scan',     timeoutMs: 90000 }],
  ['jest:run',       { command: 'npx jest',          description: 'Run Jest tests',           timeoutMs: 120000 }],
  ['eslint:check',   { command: 'npx eslint src/',   description: 'ESLint full check',        timeoutMs: 30000 }],
  ['snapshot:create',{ command: 'echo snapshot',     description: 'Trigger snapshot',         timeoutMs: 5000 }],
]);

// ── Pair Programmer ───────────────────────────────────────────────────────────

export type PairAction =
  | 'EXPLAIN' | 'SUGGEST' | 'PATCH' | 'BUGS' | 'REFACTOR'
  | 'TESTS' | 'OPTIMIZE' | 'REVIEW' | 'GENERAL';

export type MessageRole = 'USER' | 'ASSISTANT';

export interface PairMessage {
  id: string;
  role: MessageRole;
  content: string;
  action?: PairAction;
  filePath?: string;
  timestamp: Date;
  patchPlanId?: string;
}

export interface PairSession {
  id: string;
  workspaceId: string;
  projectId: string;
  messages: PairMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Patch Pipeline ─────────────────────────────────────────────────────────────

export type PatchStatus = 'DRAFT' | 'GENERATED' | 'APPROVED' | 'APPLIED' | 'REJECTED' | 'ROLLED_BACK';
export type PatchRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PatchAction = 'ADD' | 'REMOVE' | 'MODIFY';

export interface FilePatch {
  filePath: string;
  action: PatchAction;
  hunks: PatchHunk[];
  linesAdded: number;
  linesRemoved: number;
  safeToApply: boolean;
  blockedReason?: string;
}

export interface PatchHunk {
  startLine: number;
  context: string;
  removals: string[];
  additions: string[];
}

export interface PatchPlan {
  id: string;
  workspaceId: string;
  projectId: string;
  sessionId?: string;
  prompt: string;
  status: PatchStatus;
  riskLevel: PatchRisk;
  riskReason: string;
  requiresConfirmation: boolean;
  affectedFiles: string[];
  patches: FilePatch[];
  patchSummary: string;
  qualityImpact: number;
  snapshotId?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  appliedAt?: Date;
}

// ── Safe File Mutation ─────────────────────────────────────────────────────────

export type FileMutationStatus = 'ALLOWED' | 'BLOCKED' | 'RESTRICTED';

export interface FileMutationCheck {
  filePath: string;
  status: FileMutationStatus;
  reason: string;
  allowedOperations: string[];
}

// ── Terminal ───────────────────────────────────────────────────────────────────

export type TerminalStatus = 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'BLOCKED';

export interface TerminalAction {
  id: string;
  workspaceId: string;
  projectId: string;
  commandKey: string;
  command: string;
  description: string;
  status: TerminalStatus;
  output?: string;
  exitCode?: number;
  durationMs?: number;
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// ── Build + Error Panel ────────────────────────────────────────────────────────

export type LogSeverity = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
export type LogCategory = 'BUILD' | 'TEST' | 'RUNTIME' | 'LINT' | 'COMPILE' | 'HYDRATION' | 'ROUTE';

export interface BuildLog {
  id: string;
  workspaceId: string;
  projectId: string;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  file?: string;
  line?: number;
  aiExplanation?: string;
  aiSuggestedFix?: string;
  timestamp: Date;
}

// ── Bug Detector ───────────────────────────────────────────────────────────────

export type BugSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BugCategory =
  | 'BROKEN_IMPORT' | 'MISSING_ROUTE' | 'MOBILE_ISSUE' | 'ACCESSIBILITY'
  | 'RUNTIME_BEHAVIOR' | 'DANGEROUS_PATTERN' | 'PERFORMANCE' | 'TYPE_ERROR'
  | 'MISSING_ERROR_BOUNDARY' | 'SECURITY';

export interface BugFinding {
  id: string;
  projectId: string;
  category: BugCategory;
  severity: BugSeverity;
  title: string;
  description: string;
  file?: string;
  line?: number;
  suggestedFix: string;
  autoFixable: boolean;
  detectedAt: Date;
}

// ── Test Generation ────────────────────────────────────────────────────────────

export type TestType = 'COMPONENT' | 'ROUTE' | 'VALIDATION' | 'SMOKE' | 'INTEGRATION';

export interface TestSuggestion {
  id: string;
  projectId: string;
  testType: TestType;
  targetFile: string;
  testFileName: string;
  testCode: string;
  description: string;
  snapshotId?: string;
  generated: boolean;
  generatedAt: Date;
}

// ── Change History (Git-like) ──────────────────────────────────────────────────

export type ChangeEventType =
  | 'EDIT_APPLIED' | 'PATCH_APPLIED' | 'SNAPSHOT_CREATED' | 'ROLLBACK_PERFORMED'
  | 'AI_PATCH_GENERATED' | 'QUALITY_CHANGED' | 'TESTS_GENERATED'
  | 'TERMINAL_COMMAND' | 'BUG_DETECTED' | 'REFACTOR_APPLIED';

export interface ChangeHistoryEntry {
  id: string;
  workspaceId: string;
  projectId: string;
  eventType: ChangeEventType;
  title: string;
  description: string;
  affectedFiles: string[];
  qualityBefore?: number;
  qualityAfter?: number;
  snapshotId?: string;
  canRestore: boolean;
  authorId: string;
  timestamp: Date;
}

// ── Collaboration Preparation ──────────────────────────────────────────────────

export interface CollaborationPrep {
  projectId: string;
  workspaceId: string;
  multiplayerReady: false;
  pendingFeatures: string[];
  architectureNotes: string[];
  estimatedSerial: string;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface PairAnalytics {
  workspaceId: string;
  period: string;
  patchApprovals: number;
  patchRejections: number;
  patchApprovalRate: number;
  rollbackCount: number;
  bugsDetected: number;
  testsGenerated: number;
  terminalActionsRun: number;
  buildFailures: number;
  aiSessionsStarted: number;
  aiMessagesExchanged: number;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export class CreatePairSessionDto {
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
}

export class SendPairMessageDto {
  @IsString() @MaxLength(64) sessionId!: string;
  @IsString() @MaxLength(2000) content!: string;
  @IsIn(['EXPLAIN','SUGGEST','PATCH','BUGS','REFACTOR','TESTS','OPTIMIZE','REVIEW','GENERAL'])
  @IsOptional() action?: PairAction;
  @IsString() @IsOptional() @MaxLength(200) filePath?: string;
}

export class CreatePatchPlanDto {
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(1000) prompt!: string;
  @IsString() @IsOptional() @MaxLength(64) sessionId?: string;
  @IsArray() @IsOptional() targetFiles?: string[];
}

export class ApprovePatchDto {
  @IsString() @MaxLength(64) planId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
}

export class RunTerminalDto {
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(50) commandKey!: string;
}

export class GenerateTestsDto {
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(200) targetFile!: string;
  @IsIn(['COMPONENT','ROUTE','VALIDATION','SMOKE','INTEGRATION']) testType!: TestType;
}
