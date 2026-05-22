// 20E-01: Memory engine types — no raw secrets permitted

export type MemoryVisibility     = 'PUBLIC' | 'WORKSPACE' | 'PRIVATE';
export type MemoryPriority       = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type DecisionLockState    = 'UNLOCKED' | 'SOFT_LOCKED' | 'HARD_LOCKED';
export type CompressionLevel     = 'FULL' | 'BALANCED' | 'MINIMAL' | 'EMERGENCY';

// 20E-10: Keys that must never appear in any memory payload
export const MEMORY_BLOCKED_KEYS = /secret|token|key|password|credential|auth|private|prompt|instruction|system|chain_of_thought|hidden|internal|api_key/i;

export interface FounderProfile {
  id:            string;
  userId:        string;
  workspaceId?:  string;
  founderName?:  string;
  company?:      string;
  role?:         string;
  country?:      string;
  timezone?:     string;
  preferredLang: string;
  techLevel:     string;
  commStyle:     string;
  preferredStack: string[];
  goals:         string[];
  visibility:    MemoryVisibility;
  createdAt:     Date;
  updatedAt:     Date;
}

export interface MemoryEntry {
  id:          string;
  projectId:   string;
  workspaceId?: string;
  userId?:     string;
  key:         string;
  content:     string;
  priority:    MemoryPriority;
  pinned:      boolean;
  archived:    boolean;
  tags:        string[];
  createdAt:   Date;
  updatedAt:   Date;
}

export interface Decision {
  id:          string;
  projectId:   string;
  workspaceId?: string;
  title:       string;
  description?: string;
  lockState:   DecisionLockState;
  lockedAt?:   Date;
  lockedBy?:   string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface InstructionSet {
  id:          string;
  workspaceId: string;
  userId?:     string;
  name:        string;
  rules:       string[];
  active:      boolean;
  priority:    MemoryPriority;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface MemorySnapshotRecord {
  id:          string;
  workspaceId: string;
  projectId?:  string;
  label:       string;
  payload:     SnapshotPayload;
  createdAt:   Date;
}

export interface SnapshotPayload {
  entries:      MemoryEntry[];
  decisions:    Decision[];
  instructions: InstructionSet | null;
  profile:      FounderProfile | null;
}

export interface ContextPackRecord {
  id:               string;
  workspaceId:      string;
  projectId?:       string;
  label:            string;
  content:          string;
  compressionLevel: CompressionLevel;
  tokenEstimate:    number;
  usageCount:       number;
  createdAt:        Date;
  updatedAt:        Date;
}

export interface MemoryAuditRecord {
  id:          string;
  workspaceId?: string;
  projectId?:  string;
  userId?:     string;
  action:      string;
  targetType:  string;
  targetId:    string;
  createdAt:   Date;
}

// 20E-09: Context replay output
export interface ReplayPack {
  packId:       string;
  workspaceId:  string;
  projectId?:   string;
  founderProfile?: Partial<FounderProfile>;
  pinnedMemory: MemoryEntry[];
  lockedDecisions: Decision[];
  activeInstructions?: InstructionSet;
  compressedContext: string;
  tokenEstimate: number;
  generatedAt:  Date;
}
