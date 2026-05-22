import { Injectable, NotFoundException } from '@nestjs/common';
import { MARKETPLACE_REGISTRY, getPackBySlug } from './marketplace.registry';
import type {
  AgentManifest,
  InstallRequest,
  InstallResult,
  UninstallResult,
  CompatibilityResult,
  MarketplaceSearchParams,
  PackSummary,
} from './agent-manifest.types';

// 17-03: Marketplace service — metadata-only install/uninstall, no code execution

@Injectable()
export class MarketplaceService {
  // 17-08: In-process install state — workspaceId → Set of installed pack slugs
  private readonly installState = new Map<string, Set<string>>();

  // ── 17-08: List / search / discovery ────────────────────────────────────────

  listPacks(params?: MarketplaceSearchParams): PackSummary[] {
    let packs = [...MARKETPLACE_REGISTRY];

    if (params?.query) {
      const q = params.query.toLowerCase();
      packs = packs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.supportedDomains.some((d) => d.includes(q)),
      );
    }

    if (params?.category) {
      packs = packs.filter((p) => p.category === params.category);
    }

    if (params?.tags?.length) {
      packs = packs.filter((p) => params.tags!.some((t) => p.tags.includes(t)));
    }

    if (params?.regulated !== undefined) {
      packs = packs.filter((p) => p.regulated === params.regulated);
    }

    if (params?.pricingModel) {
      packs = packs.filter((p) => p.pricingModel === params.pricingModel);
    }

    switch (params?.sortBy) {
      case 'INSTALL_COUNT': packs.sort((a, b) => b.installCount - a.installCount); break;
      case 'RATING':        packs.sort((a, b) => b.rating - a.rating);            break;
      case 'NAME':          packs.sort((a, b) => a.name.localeCompare(b.name));   break;
      case 'NEWEST':        packs.sort((a, b) => b.id.localeCompare(a.id));       break;
      default:              packs.sort((a, b) => b.installCount - a.installCount); break;
    }

    return packs.map(this.toSummary);
  }

  getPack(slug: string): AgentManifest {
    const pack = getPackBySlug(slug);
    if (!pack) throw new NotFoundException(`Marketplace pack '${slug}' not found`);
    return pack;
  }

  getPacksByDomain(domainAgentIds: string[]): PackSummary[] {
    return MARKETPLACE_REGISTRY
      .filter((p) => p.supportedDomains.some((d) => domainAgentIds.includes(d)))
      .sort((a, b) => b.installCount - a.installCount)
      .map(this.toSummary);
  }

  // ── 17-05: Compatibility validation ─────────────────────────────────────────

  validateCompatibility(packSlug: string, workspaceId: string): CompatibilityResult {
    const pack = getPackBySlug(packSlug);
    if (!pack) return { compatible: false, reasons: [`Pack '${packSlug}' not found in marketplace.`], warnings: [] };

    const installed = this.getInstalledSlugs(workspaceId);
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Check conflicts
    for (const conflict of pack.compatibility.conflictsWith) {
      if (installed.has(conflict)) {
        reasons.push(`Conflicts with already-installed pack: '${conflict}'. Remove it before installing '${packSlug}'.`);
      }
    }

    // Check dependencies
    for (const dep of pack.dependencies) {
      if (!installed.has(dep)) {
        warnings.push(`Dependency '${dep}' is not installed — it is recommended for full functionality.`);
      }
    }

    // Regulated packs require guarded mode
    if (pack.regulated) {
      warnings.push('Regulated pack: Guarded Expert Mode will be enforced for all sessions using this pack.');
    }

    return { compatible: reasons.length === 0, reasons, warnings };
  }

  // ── 17-03: Install ───────────────────────────────────────────────────────────

  install(request: InstallRequest): InstallResult {
    const { packSlug, workspaceId } = request;
    const pack = getPackBySlug(packSlug);
    if (!pack) throw new NotFoundException(`Marketplace pack '${packSlug}' not found`);

    const installed = this.getInstalledSlugs(workspaceId);

    if (installed.has(packSlug)) {
      return {
        installed: false,
        alreadyInstalled: true,
        packSlug,
        packName: pack.name,
        addedCapabilities: [],
        addedTemplateIds: [],
        addedDomainAgentIds: [],
        regulatedWarnings: [],
        compatibilityNotes: [`Pack '${pack.name}' is already installed in this workspace.`],
        guardedModeEnabled: pack.guardedModeRequired,
      };
    }

    const compat = this.validateCompatibility(packSlug, workspaceId);
    const compatibilityNotes = [...compat.warnings];
    if (!compat.compatible) {
      compatibilityNotes.push(...compat.reasons);
    }

    // Record install (additive only — never removes existing capabilities)
    installed.add(packSlug);
    this.installState.set(workspaceId, installed);

    return {
      installed: true,
      alreadyInstalled: false,
      packSlug,
      packName: pack.name,
      addedCapabilities: pack.capabilities,
      addedTemplateIds: pack.includedTemplateIds,
      addedDomainAgentIds: pack.includedDomainAgentIds,
      regulatedWarnings: pack.complianceNotes,
      compatibilityNotes,
      guardedModeEnabled: pack.guardedModeRequired,
    };
  }

  // ── 17-03: Uninstall ─────────────────────────────────────────────────────────

  uninstall(packSlug: string, workspaceId: string): UninstallResult {
    const pack = getPackBySlug(packSlug);
    if (!pack) throw new NotFoundException(`Marketplace pack '${packSlug}' not found`);

    const installed = this.getInstalledSlugs(workspaceId);
    if (!installed.has(packSlug)) {
      return {
        uninstalled: false,
        packSlug,
        packName: pack.name,
        removedCapabilities: [],
        dependentsAffected: [],
      };
    }

    installed.delete(packSlug);
    this.installState.set(workspaceId, installed);

    // Check if any remaining installed packs depend on this one
    const dependentsAffected = [...installed].filter((slug) => {
      const p = getPackBySlug(slug);
      return p?.dependencies.includes(packSlug);
    });

    return {
      uninstalled: true,
      packSlug,
      packName: pack.name,
      removedCapabilities: pack.capabilities.map((c) => c.name),
      dependentsAffected,
    };
  }

  // ── 17-03: Query installed state ─────────────────────────────────────────────

  isInstalled(packSlug: string, workspaceId: string): boolean {
    return this.getInstalledSlugs(workspaceId).has(packSlug);
  }

  getInstalledPacks(workspaceId: string): PackSummary[] {
    const slugs = this.getInstalledSlugs(workspaceId);
    return MARKETPLACE_REGISTRY
      .filter((p) => slugs.has(p.slug))
      .map(this.toSummary);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private getInstalledSlugs(workspaceId: string): Set<string> {
    return this.installState.get(workspaceId) ?? new Set<string>();
  }

  private toSummary(pack: AgentManifest): PackSummary {
    return {
      slug:             pack.slug,
      name:             pack.name,
      icon:             pack.icon,
      category:         pack.category,
      description:      pack.description,
      trustBadges:      pack.trustBadges,
      regulated:        pack.regulated,
      pricingModel:     pack.pricingModel,
      installCount:     pack.installCount,
      rating:           pack.rating,
      supportedDomains: pack.supportedDomains,
      verified:         pack.verified,
    };
  }
}
