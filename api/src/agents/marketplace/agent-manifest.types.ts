// 17-01: Agent manifest type contract

export type PricingModel = 'FREE' | 'FREEMIUM' | 'PAID' | 'ENTERPRISE';
export type PackVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type TrustBadge = 'VERIFIED' | 'COMMUNITY' | 'OFFICIAL' | 'REGULATED' | 'ENTERPRISE_READY';
export type InstallStatus = 'INSTALLED' | 'NOT_INSTALLED' | 'INCOMPATIBLE';

export interface PackCapability {
  id: string;
  name: string;
  description: string;
}

export interface PackCompatibility {
  minSerialVersion: number;
  requiredSerials: number[];
  conflictsWith: string[];
}

// 17-01: Full agent pack manifest — metadata-only, no executable code
export interface AgentManifest {
  id: string;
  slug: string;
  name: string;
  version: string;
  author: string;
  verified: boolean;
  trustBadges: TrustBadge[];
  category: string;
  tags: string[];
  description: string;
  icon: string;
  supportedDomains: string[];
  supportedUserModes: string[];
  capabilities: PackCapability[];
  requiredPermissions: string[];
  regulated: boolean;
  guardedModeRequired: boolean;
  pricingModel: PricingModel;
  installCount: number;
  rating: number;
  visibility: PackVisibility;
  compatibility: PackCompatibility;
  dependencies: string[];
  starterPrompts: string[];
  screenshots: string[];
  changelog: string[];
  includedDomainAgentIds: string[];
  includedTemplateIds: string[];
  complianceNotes: string[];
  supportedCountries: string[];
}

// 17-03: Install / uninstall request + result types
export interface InstallRequest {
  packSlug: string;
  workspaceId: string;
  userId: string;
}

export interface InstallResult {
  installed: boolean;
  alreadyInstalled: boolean;
  packSlug: string;
  packName: string;
  addedCapabilities: PackCapability[];
  addedTemplateIds: string[];
  addedDomainAgentIds: string[];
  regulatedWarnings: string[];
  compatibilityNotes: string[];
  guardedModeEnabled: boolean;
}

export interface UninstallResult {
  uninstalled: boolean;
  packSlug: string;
  packName: string;
  removedCapabilities: string[];
  dependentsAffected: string[];
}

// 17-05: Compatibility validation result
export interface CompatibilityResult {
  compatible: boolean;
  reasons: string[];
  warnings: string[];
}

// 17-08: Search params
export interface MarketplaceSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  regulated?: boolean;
  pricingModel?: PricingModel;
  sortBy?: 'INSTALL_COUNT' | 'RATING' | 'NEWEST' | 'NAME';
}

// Slim pack summary for list responses
export interface PackSummary {
  slug: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  trustBadges: TrustBadge[];
  regulated: boolean;
  pricingModel: PricingModel;
  installCount: number;
  rating: number;
  supportedDomains: string[];
  verified: boolean;
}
