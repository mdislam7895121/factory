export type CohortType =
  | 'FOUNDERS'
  | 'AGENCIES'
  | 'FREELANCERS'
  | 'DEVELOPERS'
  | 'SMALL_BUSINESS'
  | 'CREATORS'
  | 'INTERNAL_TESTERS';

export type LeadStatus =
  | 'INVITED'
  | 'JOINED'
  | 'ACTIVE'
  | 'STUCK'
  | 'CONVERTED'
  | 'CHURN_RISK'
  | 'CLOSED';

export type HealthLevel = 'GOOD' | 'WATCH' | 'AT_RISK' | 'CRITICAL';

export type TaskType =
  | 'EMAIL_FOLLOWUP'
  | 'DEMO_HELP'
  | 'BUG_TRIAGE'
  | 'BILLING_HELP'
  | 'FEATURE_DISCOVERY'
  | 'ACTIVATION_NUDGE'
  | 'CHURN_PREVENTION';

export type TaskStatus = 'OPEN' | 'DONE' | 'SNOOZED' | 'CANCELLED';

export interface BetaCohort {
  id: string;
  name: string;
  type: CohortType;
  description: string;
  createdAt: string;
  updatedAt: string;
  leadCount: number;
  maxSize: number;
  isOpen: boolean;
}

export interface BetaInviteLead {
  id: string;
  cohortId: string;
  emailHash: string;
  emailMasked: string;
  displayName: string;
  status: LeadStatus;
  role?: string;
  techLevel?: string;
  businessGoal?: string;
  onboardingState?: string;
  onboardingStepCount: number;
  demoCompleted: boolean;
  previewRevealed: boolean;
  workspaceOpened: boolean;
  feedbackCount: number;
  supportTicketCount: number;
  billingIntent: boolean;
  inviteAccepted: boolean;
  lastActivityAt: string | null;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSuccessNote {
  id: string;
  leadId: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface CustomerSuccessTask {
  id: string;
  leadId: string;
  cohortId: string;
  type: TaskType;
  title: string;
  body: string;
  status: TaskStatus;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CustomerHealthScore {
  leadId: string;
  score: number;
  health: HealthLevel;
  dimensions: HealthDimension[];
  recommendedAction: string;
  computedAt: string;
}

export interface HealthDimension {
  name: string;
  score: number;
  weight: number;
  signal: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  reason: string;
}

export interface CohortActivationSummary {
  cohortId: string;
  cohortName: string;
  invitedCount: number;
  joinedCount: number;
  activeCount: number;
  activatedCount: number;
  stuckCount: number;
  convertedCount: number;
  churnRiskCount: number;
  closedCount: number;
  avgStepsToPreview: number;
  supportVolume: number;
  upgradeIntentCount: number;
  topStuckReasons: string[];
  activationRate: number;
}

export interface CreateCohortDto {
  name: string;
  type: CohortType;
  description?: string;
  maxSize?: number;
}

export interface CreateLeadDto {
  cohortId: string;
  email: string;
  displayName?: string;
  role?: string;
  techLevel?: string;
  businessGoal?: string;
}

export interface UpdateLeadStatusDto {
  status: LeadStatus;
  reason?: string;
}

export interface CreateNoteDto {
  body: string;
  author: string;
}

export interface CreateTaskDto {
  type: TaskType;
  title: string;
  body?: string;
  dueAt?: string;
}

export const VALID_COHORT_TYPES: CohortType[] = [
  'FOUNDERS', 'AGENCIES', 'FREELANCERS', 'DEVELOPERS',
  'SMALL_BUSINESS', 'CREATORS', 'INTERNAL_TESTERS',
];

export const VALID_LEAD_STATUSES: LeadStatus[] = [
  'INVITED', 'JOINED', 'ACTIVE', 'STUCK', 'CONVERTED', 'CHURN_RISK', 'CLOSED',
];

export const VALID_TASK_TYPES: TaskType[] = [
  'EMAIL_FOLLOWUP', 'DEMO_HELP', 'BUG_TRIAGE', 'BILLING_HELP',
  'FEATURE_DISCOVERY', 'ACTIVATION_NUDGE', 'CHURN_PREVENTION',
];

export const CS_BLOCKED_META_KEYS = new Set([
  'password', 'token', 'secret', 'key', 'auth', 'credential',
  'DATABASE_URL', 'AUTH_SECRET', 'API_KEY', 'PRIVATE_KEY', 'ACCESS_TOKEN',
]);

export const MAX_NOTE_LEN = 2000;
export const MAX_TASK_TITLE_LEN = 120;
export const MAX_DISPLAY_NAME_LEN = 80;
export const MAX_COHORTS = 50;
export const MAX_LEADS_PER_COHORT = 500;
