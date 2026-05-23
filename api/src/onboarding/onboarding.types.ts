export type ActivationState =
  | 'NEW'
  | 'INVITED'
  | 'PROFILE_STARTED'
  | 'IDEA_ENTERED'
  | 'DEMO_STARTED'
  | 'BLUEPRINT_VIEWED'
  | 'PREVIEW_REVEALED'
  | 'WORKSPACE_OPENED'
  | 'ACTIVATED'
  | 'STUCK';

export type UserRole =
  | 'FOUNDER'
  | 'DEVELOPER'
  | 'DESIGNER'
  | 'PRODUCT_MANAGER'
  | 'MARKETER'
  | 'STUDENT'
  | 'OTHER';

export type TechLevel = 'NON_TECHNICAL' | 'SOME_CODE' | 'TECHNICAL';

export type BusinessGoal =
  | 'VALIDATE_IDEA'
  | 'BUILD_MVP'
  | 'DEMO_INVESTORS'
  | 'LAUNCH_PRODUCT'
  | 'LEARN_AI'
  | 'OTHER';

export type StartingPath =
  | 'BUILD_FROM_PROMPT'
  | 'EXPLORE_EXAMPLES'
  | 'OPEN_WORKSPACE'
  | 'INVITE_TEAM';

export type StuckReason =
  | 'NO_PROMPT_ENTERED'
  | 'DEMO_ABANDONED'
  | 'PREVIEW_FAILED'
  | 'QUALITY_SCORE_LOW'
  | 'WORKSPACE_IDLE'
  | 'BILLING_WALL_HIT'
  | 'INVITE_PENDING'
  | 'UNKNOWN';

export type OnboardingStep =
  | 'ROLE_SELECTED'
  | 'TECH_LEVEL_SET'
  | 'GOAL_SET'
  | 'PATH_CHOSEN'
  | 'IDEA_ENTERED'
  | 'DEMO_STARTED'
  | 'BLUEPRINT_VIEWED'
  | 'COUNCIL_WATCHED'
  | 'PREVIEW_REVEALED'
  | 'PREVIEW_SHARED'
  | 'MEMORY_SAVED'
  | 'WORKSPACE_CREATED'
  | 'TEAMMATE_INVITED';

export interface OnboardingProfile {
  userId: string;
  state: ActivationState;
  role: UserRole | null;
  techLevel: TechLevel | null;
  businessGoal: BusinessGoal | null;
  startingPath: StartingPath | null;
  completedSteps: OnboardingStep[];
  skipped: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
  stuckAt: string | null;
  stuckReason: StuckReason | null;
  lastEventAt: string | null;
}

export interface ActivationEvent {
  userId: string;
  step: OnboardingStep;
  timestamp: string;
  meta?: Record<string, string | number | boolean>;
}

export interface OnboardingChecklist {
  userId: string;
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
}

export interface ChecklistItem {
  step: OnboardingStep;
  label: string;
  completed: boolean;
  route?: string;
}

export interface NextAction {
  label: string;
  description: string;
  route: string;
  cta: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StuckDiagnosis {
  reason: StuckReason;
  suggestedFix: string;
  nextBestAction: NextAction;
}

export interface ActivationAnalytics {
  total: number;
  byState: Record<ActivationState, number>;
  stuckCount: number;
  activatedCount: number;
  completionRate: number;
  avgStepsToPreview: number;
  topStuckReasons: { reason: StuckReason; count: number }[];
  betaReadinessScore: number;
}

export const CHECKLIST_LABELS: Record<OnboardingStep, string> = {
  ROLE_SELECTED:       'Tell us about yourself',
  TECH_LEVEL_SET:      'Set your technical level',
  GOAL_SET:            'Set your business goal',
  PATH_CHOSEN:         'Choose your starting path',
  IDEA_ENTERED:        'Enter your idea',
  DEMO_STARTED:        'Start the AI build demo',
  BLUEPRINT_VIEWED:    'View your app blueprint',
  COUNCIL_WATCHED:     'Watch the AI council review',
  PREVIEW_REVEALED:    'Open your live preview',
  PREVIEW_SHARED:      'Share preview with others',
  MEMORY_SAVED:        'Save your project memory',
  WORKSPACE_CREATED:   'Create a workspace',
  TEAMMATE_INVITED:    'Invite a teammate',
};

export const ACTIVATION_STATE_ORDER: ActivationState[] = [
  'NEW',
  'INVITED',
  'PROFILE_STARTED',
  'IDEA_ENTERED',
  'DEMO_STARTED',
  'BLUEPRINT_VIEWED',
  'PREVIEW_REVEALED',
  'WORKSPACE_OPENED',
  'ACTIVATED',
];

export const STEP_TO_STATE: Partial<Record<OnboardingStep, ActivationState>> = {
  ROLE_SELECTED:    'PROFILE_STARTED',
  IDEA_ENTERED:     'IDEA_ENTERED',
  DEMO_STARTED:     'DEMO_STARTED',
  BLUEPRINT_VIEWED: 'BLUEPRINT_VIEWED',
  PREVIEW_REVEALED: 'PREVIEW_REVEALED',
  WORKSPACE_CREATED:'WORKSPACE_OPENED',
};

export const ONBOARDING_BLOCKED_META_KEYS = new Set([
  'password', 'token', 'secret', 'key', 'auth', 'credential',
  'DATABASE_URL', 'AUTH_SECRET', 'API_KEY', 'PRIVATE_KEY', 'ACCESS_TOKEN',
]);

export const MAX_USER_ID_LEN = 128;
