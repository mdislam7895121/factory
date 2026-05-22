import { IsString, IsOptional, IsIn, MaxLength, IsArray } from 'class-validator';

// ── 22: Controlled Visual Editor Types ────────────────────────────────────────

export type EditorMode = 'VISUAL' | 'CONTENT' | 'BRANDING' | 'LAYOUT' | 'ADVANCED';
export type EditStatus = 'DRAFT' | 'PENDING_DIFF' | 'APPROVED' | 'APPLIED' | 'REJECTED' | 'ROLLED_BACK';
export type DiffAction = 'ADD' | 'REMOVE' | 'MODIFY';
export type BlockType = 'HERO' | 'FEATURES' | 'PRICING' | 'TESTIMONIALS' | 'FOOTER' | 'CTA' | 'NAVBAR' | 'FAQ' | 'CONTACT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type EditEventType = 'EDIT_STARTED' | 'DIFF_GENERATED' | 'APPROVED' | 'APPLIED' | 'REJECTED' | 'SNAPSHOT_CREATED' | 'ROLLED_BACK' | 'QUALITY_RECHECK';

export const EDITOR_BLOCKED_CONTENT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|shell|bash|sudo|chmod|\/etc\/passwd|api_key|private_key|access_key/i;

export const DANGEROUS_EDIT_PATTERNS =
  /<script|javascript:|data:text\/html|eval\(|document\.cookie|window\.location|innerHTML\s*=|__proto__|prototype\.constructor/i;

export const BLOCKED_META_KEYS = new Set([
  '.env', '.env.local', '.env.production',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'prisma/migrations', '.git', 'node_modules',
  'id_rsa', 'id_ed25519', '.pem', '.key', '.cert',
]);

// ── Branding ──────────────────────────────────────────────────────────────────

export interface BrandingConfig {
  appName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl?: string;
  ctaText: string;
  ctaColor: string;
  contrastRatio?: number;
  passesWCAG?: boolean;
}

// ── Content ───────────────────────────────────────────────────────────────────

export type ContentTone = 'PROFESSIONAL' | 'CASUAL' | 'BOLD' | 'MINIMAL';

export interface ContentBlock {
  id: string;
  section: string;
  field: string;
  currentValue: string;
  proposedValue?: string;
  tone?: ContentTone;
  aiRewritten?: boolean;
  locked: boolean;
}

// ── Layout Block ──────────────────────────────────────────────────────────────

export interface LayoutBlock {
  id: string;
  type: BlockType;
  label: string;
  visible: boolean;
  order: number;
  locked: boolean;
  canDuplicate: boolean;
  canReplace: boolean;
}

// ── File Node (safe view) ─────────────────────────────────────────────────────

export interface SafeFileView {
  path: string;
  name: string;
  language: string;
  content: string;
  linesCount: number;
  safeToEdit: boolean;
  editReason?: string;
}

// ── Diff ──────────────────────────────────────────────────────────────────────

export interface FileDiff {
  filePath: string;
  action: DiffAction;
  before: string;
  after: string;
  linesChanged: number;
  affectedComponents: string[];
  riskLevel: RiskLevel;
}

// ── Edit Session ──────────────────────────────────────────────────────────────

export interface EditSession {
  id: string;
  workspaceId: string;
  projectId: string;
  mode: EditorMode;
  status: EditStatus;
  description: string;
  diffs: FileDiff[];
  snapshotId?: string;
  qualityBefore?: number;
  qualityAfter?: number;
  qualityDelta?: number;
  createdAt: Date;
  updatedAt: Date;
  appliedAt?: Date;
  rolledBackAt?: Date;
  editedBy: string;
}

// ── Edit History Entry ────────────────────────────────────────────────────────

export interface EditHistoryEntry {
  id: string;
  sessionId: string;
  workspaceId: string;
  projectId: string;
  eventType: EditEventType;
  mode: EditorMode;
  description: string;
  affectedFiles: string[];
  qualityBefore?: number;
  qualityAfter?: number;
  snapshotId?: string;
  canRollback: boolean;
  timestamp: Date;
}

// ── AI Change Plan ────────────────────────────────────────────────────────────

export interface AIChangePlan {
  id: string;
  projectId: string;
  prompt: string;
  affectedFiles: string[];
  estimatedDiffs: number;
  riskLevel: RiskLevel;
  riskReason: string;
  requiresConfirmation: boolean;
  suggestedMode: EditorMode;
  scopeSummary: string;
  blockedReason?: string;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface EditorAnalytics {
  workspaceId: string;
  totalEditSessions: number;
  approvedEdits: number;
  rejectedEdits: number;
  rolledBackEdits: number;
  editsByMode: Record<EditorMode, number>;
  avgQualityDelta: number;
  snapshotsCreated: number;
  diffApprovalsRate: number;
  period: string;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export class CreateEditSessionDto {
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
  @IsIn(['VISUAL','CONTENT','BRANDING','LAYOUT','ADVANCED']) mode!: EditorMode;
  @IsString() @MaxLength(500) description!: string;
  @IsString() @IsOptional() @MaxLength(64) editedBy?: string;
}

export class ApplyBrandingDto {
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(100) appName!: string;
  @IsString() @MaxLength(200) tagline!: string;
  @IsString() @MaxLength(7) primaryColor!: string;
  @IsString() @MaxLength(7) secondaryColor!: string;
  @IsString() @MaxLength(7) backgroundColor!: string;
  @IsString() @MaxLength(7) textColor!: string;
  @IsString() @MaxLength(100) fontFamily!: string;
  @IsString() @MaxLength(200) ctaText!: string;
  @IsString() @MaxLength(7) ctaColor!: string;
}

export class RewriteContentDto {
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(64) contentBlockId!: string;
  @IsIn(['PROFESSIONAL','CASUAL','BOLD','MINIMAL']) tone!: ContentTone;
  @IsString() @MaxLength(2000) currentValue!: string;
  @IsOptional() @IsString() @MaxLength(500) instruction?: string;
}

export class UpdateLayoutDto {
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsArray() blocks!: { id: string; visible: boolean; order: number }[];
}

export class AIChangePlanDto {
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
  @IsString() @MaxLength(1000) prompt!: string;
}

export class ApproveDiffDto {
  @IsString() @MaxLength(64) sessionId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
}

export class RollbackDto {
  @IsString() @MaxLength(64) sessionId!: string;
  @IsString() @MaxLength(64) workspaceId!: string;
  @IsString() @MaxLength(64) projectId!: string;
}
