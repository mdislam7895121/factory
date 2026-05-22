// 20F-01: Generation Quality Pipeline types — no raw secrets permitted

export type QualityTier         = 'EXPERIMENTAL' | 'PREVIEW_READY' | 'BETA_READY' | 'PRODUCTION_READY';
export type ProductionReadiness = 'NOT_READY' | 'PREVIEW' | 'BETA' | 'PRODUCTION';
export type RiskLevel           = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RepairStatus        = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ValidationStatus    = 'PASS' | 'FAIL' | 'WARN' | 'SKIP';
export type CheckCategory       =
  | 'UX' | 'TRUST' | 'ONBOARDING' | 'BRANDING' | 'CTA'
  | 'AUTH' | 'EMPTY_STATES' | 'LOADING_STATES' | 'ERROR_STATES' | 'RESPONSIVE';

export const QUALITY_THRESHOLDS = {
  PRODUCTION_READY: 85,
  BETA_READY:       70,
  PREVIEW_READY:    50,
} as const;

export const DIMENSION_WEIGHTS: Record<string, number> = {
  runtimeStability:      0.20,
  routeValidity:         0.15,
  mobileResponsiveness:  0.15,
  visualCompleteness:    0.10,
  apiHealth:             0.15,
  securityPosture:       0.15,
  performance:           0.05,
  accessibilityBaseline: 0.05,
};

export interface QualityDimension {
  name:     string;
  score:    number;
  weight:   number;
  status:   ValidationStatus;
  details?: string;
}

export interface RiskFlag {
  id:         string;
  category:   string;
  level:      RiskLevel;
  message:    string;
  autoRepair: boolean;
}

export interface RepairSuggestion {
  id:              string;
  priority:        number;
  category:        string;
  description:     string;
  actionable:      boolean;
  estimatedImpact: number;
}

export interface SmokeTestResult {
  url:               string;
  statusCode:        number;
  loadTimeMs:        number;
  hasHtml:           boolean;
  hasJsBundle:       boolean;
  isBlankScreen:     boolean;
  healthCheckPassed: boolean;
  timedOut:          boolean;
  passed:            boolean;
}

export interface RouteValidationResult {
  route:       string;
  status:      ValidationStatus;
  statusCode?: number;
  issue?:      string;
}

export interface MobileValidationResult {
  mobileScore:         number;
  hasOverflow:         boolean;
  hasUnreadableText:   boolean;
  hasBrokenContainers: boolean;
  hasUnsafeSpacing:    boolean;
  hasUnusableButtons:  boolean;
  hasViewportIssues:   boolean;
  warnings:            string[];
}

export interface QAChecklistItem {
  id:       string;
  category: CheckCategory;
  check:    string;
  status:   ValidationStatus;
  note?:    string;
}

export interface QAReport {
  id:          string;
  projectId:   string;
  workspaceId?: string;
  items:       QAChecklistItem[];
  passCount:   number;
  warnCount:   number;
  failCount:   number;
  generatedAt: string;
}

export interface RepairTask {
  id:           string;
  projectId:    string;
  suggestions:  RepairSuggestion[];
  status:       RepairStatus;
  triggeredAt:  string;
  completedAt?: string;
  attempts:     number;
  maxAttempts:  number;
}

export interface ReadinessGateResult {
  passed:      boolean;
  projectId:   string;
  checks: {
    runtimeAlive:      boolean;
    previewResponsive: boolean;
    noCrashLoop:       boolean;
    snapshotAvailable: boolean;
    recoveryHealthy:   boolean;
  };
  blockedReasons: string[];
  evaluatedAt:    string;
}

export interface SecurityValidationResult {
  passed:    boolean;
  projectId: string;
  issues: Array<{
    field: string;
    issue: string;
    level: RiskLevel;
  }>;
}

export interface QualityScore {
  id:                  string;
  projectId:           string;
  workspaceId?:        string;
  overallScore:        number;
  qualityTier:         QualityTier;
  productionReadiness: ProductionReadiness;
  dimensions:          QualityDimension[];
  riskFlags:           RiskFlag[];
  repairSuggestions:   RepairSuggestion[];
  smokeTest?:          SmokeTestResult;
  routeValidation:     RouteValidationResult[];
  mobileValidation:    MobileValidationResult;
  qaReport?:           QAReport;
  securityValidation:  SecurityValidationResult;
  readinessGate:       ReadinessGateResult;
  scoredAt:            string;
}

export interface QualityAnalytics {
  averageScore:       number;
  scoreDistribution:  Record<QualityTier, number>;
  repairFrequency:    number;
  runtimeFailureRate: number;
  topCrashCategories: Array<{ category: string; count: number }>;
  commonUxIssues:     Array<{ issue: string; count: number }>;
  mobileIssueRate:    number;
  totalEvaluated:     number;
}

export interface EvaluateInput {
  projectId:    string;
  workspaceId?: string;
  previewUrl?:  string;
  routes?:      string[];
  content?:     string;
  metadata?:    Record<string, unknown>;
}
