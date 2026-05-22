import type { DataModelHint, ApiModuleHint, UiFlowHint, BlueprintSummaryItem } from './domain-template.types';

// 15-10: User skill mode — determines explanation style and next-step guidance
export type UserSkillMode =
  | 'NON_TECHNICAL'
  | 'BUSINESS_OWNER'
  | 'PROFESSIONAL_DEVELOPER'
  | 'AGENCY_FREELANCER'
  | 'STARTUP_FOUNDER';

export interface SkillModeResult {
  userMode: UserSkillMode;
  explanationStyle: string;
  recommendedNextQuestions: string[];
}

// 15-11: Project identity — brand and locale metadata
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ProjectIdentity {
  projectName: string;
  appName: string;
  tagline: string;
  logoDirection: string;
  colorPalette: ColorPalette;
  fontStyle: string;
  brandTone: string;
  targetAudience: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
}

// 15-12: Customer demand analysis
export interface CustomerDemandResult {
  targetCustomers: string;
  painPoint: string;
  jobToBeDone: string;
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  monetizationOption: string;
  competitorStyle: string;
  launchChannel: string;
  trustExpectations: string[];
  customerDemandSummary: string;
  launchMVPFeatures: string[];
  futureFeatures: string[];
}

// 15-13: Professional developer blueprint
export interface StackRecommendation {
  frontend: string;
  backend: string;
  database: string;
  cache: string;
  queue: string;
  auth: string;
  hosting: string;
}

export interface DeveloperBlueprint {
  stackRecommendation: StackRecommendation;
  architectureSummary: string;
  dbModels: string[];
  apiModules: string[];
  authModel: string;
  envVars: string[];
  deploymentTarget: string;
  monitoring: string[];
  testPlan: string[];
  rollbackPlan: string;
}

// 15-14: Non-technical guided setup output
export interface GuidedSetup {
  guidedSetup: Record<string, string>;
  missingButAssumedFields: string[];
  safeDefaults: Record<string, string>;
}

// 15-15: Branding defaults
export interface BrandingDefaults {
  appName: string;
  logoIdea: string;
  primaryColor: string;
  secondaryColor: string;
  uiStyle: string;
  buttonStyle: string;
  iconDirection: string;
  landingHeadline: string;
  ctaCopy: string;
}

// 15-16: Requirement checklist
export type ChecklistStatus = 'provided' | 'inferred' | 'missing' | 'deferred';

export interface ChecklistItem {
  item: string;
  status: ChecklistStatus;
  value?: string;
}

// 15-17: Full merged project startup blueprint
export interface ProjectStartupBlueprint {
  projectIdentity: ProjectIdentity;
  userMode: UserSkillMode;
  customerDemand: CustomerDemandResult;
  domainTemplates: BlueprintSummaryItem[];
  features: string[];
  dataModels: DataModelHint[];
  apiModules: ApiModuleHint[];
  uiFlows: UiFlowHint[];
  branding: BrandingDefaults;
  security: string[];
  compliance: string[];
  technicalPlan: DeveloperBlueprint | null;
  checklist: ChecklistItem[];
}
