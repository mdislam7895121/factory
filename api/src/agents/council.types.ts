// 16-01: Council session model

export type CouncilApprovalState = 'APPROVED' | 'APPROVED_WITH_WARNINGS' | 'NEEDS_INPUT' | 'BLOCKED';
export type CouncilVote = 'APPROVE' | 'APPROVE_WITH_CONDITION' | 'OBJECT' | 'ABSTAIN';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskCategory = 'AUTH' | 'COMPLIANCE' | 'SCALING' | 'PRIVACY' | 'PAYMENT' | 'ABUSE';
export type MessageRole = 'PROPOSE' | 'OBJECT' | 'SUGGEST' | 'REQUEST_INPUT' | 'APPROVE' | 'REJECT' | 'DEFER';
export type DecisionOutcome = 'ACCEPTED' | 'REJECTED' | 'DEFERRED';

// 16-01: Safe public message from an agent in the council — no chain-of-thought
export interface CouncilMessage {
  agentId: string;
  agentName: string;
  agentIcon: string;
  role: MessageRole;
  summary: string;
  timestamp: number;
}

// 16-05: Risk matrix item
export interface RiskItem {
  category: RiskCategory;
  level: RiskLevel;
  description: string;
  mitigation: string;
}

// 16-03: Single debate resolution record
export interface CouncilDecision {
  topic: string;
  outcome: DecisionOutcome;
  rationale: string;
  votes: Record<string, CouncilVote>;
}

// 16-08: Persistent council memory layer
export interface CouncilMemory {
  sessionId: string;
  acceptedConstraints: string[];
  rejectedFeatures: string[];
  brandingDirection: string;
  userPreferences: Record<string, string>;
  previousDecisions: CouncilDecision[];
}

// 16-04: Synthesized build plan output from council merge
export interface FinalBuildPlan {
  architecture: string;
  dbModels: string[];
  apiModules: string[];
  userRoles: string[];
  workflows: string[];
  security: string[];
  compliance: string[];
  branding: Record<string, string>;
  rolloutPriority: string[];
  riskMatrix: RiskItem[];
  approvalState: CouncilApprovalState;
  approvalNotes: string[];
}

// 16-01: Full council session
export interface CouncilSession {
  sessionId: string;
  prompt: string;
  participants: string[];
  messages: CouncilMessage[];
  decisions: CouncilDecision[];
  riskMatrix: RiskItem[];
  memory: CouncilMemory;
  finalBuildPlan: FinalBuildPlan;
  approvalState: CouncilApprovalState;
  createdAt: number;
}
