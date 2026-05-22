import { Injectable } from '@nestjs/common';
import { DOMAIN_TEMPLATE_REGISTRY, getTemplateByAgentId, getTemplateById } from './domain-template.registry';
import type { DomainTemplate, MergedBlueprint, BlueprintSummaryItem } from './domain-template.types';

@Injectable()
export class DomainTemplateService {
  private readonly templates = DOMAIN_TEMPLATE_REGISTRY;

  // 15-03: All templates (public-safe, no licensed advice)
  getAll(): DomainTemplate[] {
    return this.templates;
  }

  // 15-03: Single template by ID
  getById(id: string): DomainTemplate | undefined {
    return getTemplateById(id);
  }

  // 15-03: Recommend templates from a list of domain agent IDs + optional primary template ID
  // Priority: suggestedTemplateId first, then remaining domain agents in order
  recommend(domainAgentIds: string[], suggestedTemplateId?: string): DomainTemplate[] {
    const found: DomainTemplate[] = [];
    const seen = new Set<string>();

    if (suggestedTemplateId) {
      const primary = getTemplateById(suggestedTemplateId);
      if (primary && !seen.has(primary.id)) {
        found.push(primary);
        seen.add(primary.id);
      }
    }

    for (const agentId of domainAgentIds) {
      const t = getTemplateByAgentId(agentId);
      if (t && !seen.has(t.id)) {
        found.push(t);
        seen.add(t.id);
      }
    }

    return found;
  }

  // 15-03: Merge multiple templates into a single deduped blueprint
  mergeBlueprint(templates: DomainTemplate[]): MergedBlueprint {
    const dedupeStrings = (arr: string[]): string[] => [...new Set(arr)];
    const dedupeByName = <T extends { name: string }>(arr: T[]): T[] => {
      const seen = new Set<string>();
      return arr.filter((item) => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    };

    return {
      recommendedRoles:    dedupeStrings(templates.flatMap((t) => t.recommendedUserRoles)),
      coreFeatures:        dedupeStrings(templates.flatMap((t) => t.coreFeatures)),
      dataModels:          dedupeByName(templates.flatMap((t) => t.dataModels)),
      apiModules:          dedupeByName(templates.flatMap((t) => t.apiModules)),
      uiFlows:             dedupeByName(templates.flatMap((t) => t.uiFlows)),
      complianceChecklist: dedupeStrings(templates.flatMap((t) => t.complianceChecklist)),
      riskWarnings:        dedupeStrings(templates.flatMap((t) => t.riskWarnings)),
      securityRequirements:dedupeStrings(templates.flatMap((t) => t.securityRequirements)),
      starterPrompts:      dedupeStrings(templates.flatMap((t) => t.starterPrompts)),
    };
  }

  // 15-03: Full recommendation response for the /recommend endpoint
  recommendFull(domainAgentIds: string[], suggestedTemplateId?: string): {
    templates: DomainTemplate[];
    mergedBlueprint: MergedBlueprint;
    regulatedWarnings: string[];
    requiresProfessionalReview: boolean;
  } {
    const templates = this.recommend(domainAgentIds, suggestedTemplateId);
    const mergedBlueprint = this.mergeBlueprint(templates);

    const regulatedTemplates = templates.filter((t) => t.regulated);
    const regulatedWarnings = [
      ...new Set(regulatedTemplates.flatMap((t) => t.requiredDisclaimers)),
    ];
    const requiresProfessionalReview = regulatedTemplates.length > 0;

    return { templates, mergedBlueprint, regulatedWarnings, requiresProfessionalReview };
  }

  // 15-05: Slim summary list for router response (no heavy arrays)
  toSummaryItems(templates: DomainTemplate[]): BlueprintSummaryItem[] {
    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      regulated: t.regulated,
      summary: t.summary,
    }));
  }
}
