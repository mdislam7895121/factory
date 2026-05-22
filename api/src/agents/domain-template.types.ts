import type { AgentCategory } from './agent-registry';

// 15-01: Data model hint — name + suggested field list (not a strict schema)
export interface DataModelHint {
  name: string;
  fields: string[];
}

// 15-01: API module hint — module name + key endpoint patterns
export interface ApiModuleHint {
  name: string;
  endpoints: string[];
}

// 15-01: UI flow hint — named user journey with ordered steps
export interface UiFlowHint {
  name: string;
  steps: string[];
}

// 15-01: Full domain template contract
// Rules: no secrets, no licensed advice, no diagnosis/legal/tax/investment conclusions, public-safe only
export interface DomainTemplate {
  id: string;
  domainAgentId: string;
  name: string;
  category: AgentCategory;
  regulated: boolean;
  summary: string;
  recommendedUserRoles: string[];
  coreFeatures: string[];
  optionalFeatures: string[];
  dataModels: DataModelHint[];
  apiModules: ApiModuleHint[];
  uiFlows: UiFlowHint[];
  complianceChecklist: string[];
  riskWarnings: string[];
  securityRequirements: string[];
  suggestedIntegrations: string[];
  starterPrompts: string[];
  prohibitedClaims: string[];
  requiredDisclaimers: string[];
}

// 15-03: Merged blueprint from one or more templates (deduped union)
export interface MergedBlueprint {
  recommendedRoles: string[];
  coreFeatures: string[];
  dataModels: DataModelHint[];
  apiModules: ApiModuleHint[];
  uiFlows: UiFlowHint[];
  complianceChecklist: string[];
  riskWarnings: string[];
  securityRequirements: string[];
  starterPrompts: string[];
}

// 15-05: Slim summary for router response (no heavy arrays)
export interface BlueprintSummaryItem {
  id: string;
  name: string;
  regulated: boolean;
  summary: string;
}
