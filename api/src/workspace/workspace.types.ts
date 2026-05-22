// 21-01: Workspace Foundation types — no raw secrets permitted

export type RuntimeStatus       = 'RUNNING' | 'SLEEPING' | 'WAKING' | 'CRASHED' | 'RECOVERING';
export type DeployStatus        = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
export type ChangeRequestRisk   = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EditingCategory     = 'BRANDING' | 'CONTENT' | 'LAYOUT' | 'FEATURE' | 'INTEGRATION' | 'SECURITY';
export type DeployPlatform      = 'RAILWAY' | 'NETLIFY' | 'VERCEL';
export type ActivitySeverity    = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export const WORKSPACE_BLOCKED_PROMPT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|shell|bash|sudo|chmod|\/etc\/passwd/i;

export interface WorkspaceInfo {
  id:           string;
  ownerId:      string;
  name:         string;
  description?: string;
  projectCount: number;
  createdAt:    string;
  updatedAt:    string;
}

export interface ProjectInfo {
  id:             string;
  workspaceId:    string;
  name:           string;
  description?:   string;
  stack:          string[];
  category:       string;
  runtimeStatus:  RuntimeStatus;
  previewUrl?:    string;
  deployedUrl?:   string;
  qualityScore?:  number;
  qualityTier?:   string;
  createdAt:      string;
  updatedAt:      string;
}

export interface FileNode {
  name:           string;
  path:           string;
  type:           'file' | 'directory';
  children?:      FileNode[];
  language?:      string;
  summary?:       string;
  linesEstimate?: number;
  safeToView:     boolean;
}

export interface RouteMapEntry {
  route:       string;
  method:      string;
  description: string;
  isPublic:    boolean;
  component?:  string;
}

export interface ComponentMapEntry {
  name:    string;
  path:    string;
  type:    'page' | 'component' | 'layout' | 'hook' | 'util';
  usedBy:  string[];
}

export interface APIMapEntry {
  endpoint:      string;
  method:        string;
  description:   string;
  authenticated: boolean;
  module:        string;
}

export interface ChangeRequest {
  id:                  string;
  projectId:           string;
  workspaceId:         string;
  prompt:              string;
  scopeSummary:        string;
  affectedSystems:     string[];
  qualityRiskEstimate: ChangeRequestRisk;
  status:              ChangeRequestStatus;
  requiresConfirmation: boolean;
  createdAt:           string;
  updatedAt:           string;
}

export interface DeployRecord {
  id:          string;
  workspaceId: string;
  projectId?:  string;
  platform:    DeployPlatform;
  status:      DeployStatus;
  branch:      string;
  commitSha?:  string;
  url?:        string;
  durationMs?: number;
  createdAt:   string;
}

export interface ActivityEvent {
  id:          string;
  workspaceId: string;
  type:        string;
  severity:    ActivitySeverity;
  message:     string;
  meta?:       Record<string, unknown>;
  timestamp:   string;
}

export interface EditingCard {
  id:          string;
  category:    EditingCategory;
  title:       string;
  description: string;
  prompt:      string;
  riskLevel:   ChangeRequestRisk;
  icon:        string;
}

export interface WorkspaceAnalytics {
  workspaceId:          string;
  changeRequests:       number;
  previewOpens:         number;
  runtimeWakes:         number;
  snapshotRestores:     number;
  deployFrequency:      number;
  qualityImprovements:  number;
  memoryOperations:     number;
  period:               string;
}

export interface CreateWorkspaceInput {
  name:         string;
  ownerId:      string;
  description?: string;
}

export interface CreateChangeRequestInput {
  workspaceId: string;
  projectId:   string;
  prompt:      string;
}
