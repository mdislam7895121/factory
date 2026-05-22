import { DomainTemplateService } from './domain-template.service';
import { DOMAIN_TEMPLATE_REGISTRY } from './domain-template.registry';

describe('DomainTemplateService', () => {
  let svc: DomainTemplateService;

  beforeEach(() => {
    svc = new DomainTemplateService();
  });

  // ── 15-08: Registry integrity ─────────────────────────────────────────────

  it('has at least 15 templates in the registry', () => {
    expect(svc.getAll().length).toBeGreaterThanOrEqual(15);
  });

  it('every template has all required fields populated', () => {
    for (const t of svc.getAll()) {
      expect(t.id).toBeTruthy();
      expect(t.domainAgentId).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(typeof t.regulated).toBe('boolean');
      expect(t.summary.length).toBeGreaterThan(10);
      expect(t.recommendedUserRoles.length).toBeGreaterThan(0);
      expect(t.coreFeatures.length).toBeGreaterThan(0);
      expect(t.dataModels.length).toBeGreaterThan(0);
      expect(t.apiModules.length).toBeGreaterThan(0);
      expect(t.uiFlows.length).toBeGreaterThan(0);
      expect(t.starterPrompts.length).toBeGreaterThan(0);
    }
  });

  it('every data model has a name and at least one field', () => {
    for (const t of svc.getAll()) {
      for (const dm of t.dataModels) {
        expect(dm.name).toBeTruthy();
        expect(dm.fields.length).toBeGreaterThan(0);
      }
    }
  });

  it('every API module has a name and at least one endpoint', () => {
    for (const t of svc.getAll()) {
      for (const mod of t.apiModules) {
        expect(mod.name).toBeTruthy();
        expect(mod.endpoints.length).toBeGreaterThan(0);
      }
    }
  });

  it('all template IDs are unique', () => {
    const ids = svc.getAll().map((t) => t.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  // ── 15-08: Regulated templates have disclaimers and prohibited claims ─────

  it('regulated templates have requiredDisclaimers', () => {
    const regulated = svc.getAll().filter((t) => t.regulated);
    expect(regulated.length).toBeGreaterThan(0);
    for (const t of regulated) {
      expect(t.requiredDisclaimers.length).toBeGreaterThan(0);
    }
  });

  it('regulated templates have prohibitedClaims', () => {
    for (const t of svc.getAll().filter((t) => t.regulated)) {
      expect(t.prohibitedClaims.length).toBeGreaterThan(0);
    }
  });

  it('non-regulated templates have empty prohibitedClaims and requiredDisclaimers', () => {
    for (const t of svc.getAll().filter((t) => !t.regulated)) {
      expect(t.prohibitedClaims).toHaveLength(0);
      expect(t.requiredDisclaimers).toHaveLength(0);
    }
  });

  // ── 15-07 / 15-08: Recommendation tests ───────────────────────────────────

  it('recommends healthcare-portal for medical agent', () => {
    const result = svc.recommend(['medical']);
    expect(result.some((t) => t.id === 'healthcare-portal')).toBe(true);
  });

  it('recommends fintech-saas for finance agent', () => {
    const result = svc.recommend(['finance']);
    expect(result.some((t) => t.id === 'fintech-saas')).toBe(true);
  });

  it('recommends food-ordering-app for restaurant agent', () => {
    const result = svc.recommend(['restaurant']);
    expect(result.some((t) => t.id === 'food-ordering-app')).toBe(true);
  });

  it('recommends learning-management-system for education agent', () => {
    const result = svc.recommend(['education']);
    expect(result.some((t) => t.id === 'learning-management-system')).toBe(true);
  });

  it('mixed pharmacy+marketplace returns multiple templates', () => {
    const result = svc.recommend(['medical', 'marketplace']);
    expect(result.length).toBeGreaterThan(1);
    expect(result.some((t) => t.id === 'healthcare-portal')).toBe(true);
    expect(result.some((t) => t.id === 'two-sided-marketplace')).toBe(true);
  });

  it('suggestedTemplateId takes priority in recommendation order', () => {
    const result = svc.recommend(['ecommerce', 'medical'], 'healthcare-portal');
    expect(result[0].id).toBe('healthcare-portal');
  });

  it('no duplicate templates in recommendation result', () => {
    const result = svc.recommend(['medical', 'medical', 'finance']);
    const ids = result.map((t) => t.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('returns empty array for unknown agent IDs', () => {
    expect(svc.recommend(['unknown-agent-id'])).toHaveLength(0);
  });

  // ── 15-08: Merged blueprint ───────────────────────────────────────────────

  it('merged blueprint deduplicates roles from multiple templates', () => {
    const templates = svc.recommend(['medical', 'ecommerce']);
    const merged = svc.mergeBlueprint(templates);
    const roles = merged.recommendedRoles;
    expect(roles.length).toBe(new Set(roles).size);
  });

  it('merged blueprint deduplicates data model names', () => {
    const templates = svc.recommend(['medical', 'ecommerce']);
    const merged = svc.mergeBlueprint(templates);
    const names = merged.dataModels.map((m) => m.name);
    expect(names.length).toBe(new Set(names).size);
  });

  it('merged blueprint combines compliance checklists', () => {
    const medical = svc.recommend(['medical']);
    const ecommerce = svc.recommend(['ecommerce']);
    const both = svc.recommend(['medical', 'ecommerce']);
    const mergedBoth = svc.mergeBlueprint(both);
    expect(mergedBoth.complianceChecklist.length).toBeGreaterThanOrEqual(
      svc.mergeBlueprint(medical).complianceChecklist.length,
    );
  });

  // ── 15-08: recommendFull includes regulated warnings ──────────────────────

  it('recommendFull includes disclaimers for regulated agents', () => {
    const result = svc.recommendFull(['medical', 'legal-compliance'], 'healthcare-portal');
    expect(result.requiresProfessionalReview).toBe(true);
    expect(result.regulatedWarnings.length).toBeGreaterThan(0);
    expect(result.regulatedWarnings.some((w) => /medical/i.test(w))).toBe(true);
  });

  it('recommendFull has no professional review required for non-regulated', () => {
    const result = svc.recommendFull(['ecommerce', 'restaurant'], 'ecommerce-store');
    expect(result.requiresProfessionalReview).toBe(false);
    expect(result.regulatedWarnings).toHaveLength(0);
  });

  // ── 15-08: No chain-of-thought / internal leaks ───────────────────────────

  it('registry contains no chain-of-thought or internal metadata', () => {
    const json = JSON.stringify(DOMAIN_TEMPLATE_REGISTRY);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|private|system prompt/i);
  });

  it('merged blueprint result contains no chain-of-thought leaks', () => {
    const templates = svc.recommend(['medical', 'finance', 'marketplace']);
    const merged = svc.mergeBlueprint(templates);
    const json = JSON.stringify(merged);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|private|system prompt/i);
  });

  // ── getById ───────────────────────────────────────────────────────────────

  it('getById returns the correct template', () => {
    const t = svc.getById('healthcare-portal');
    expect(t).toBeDefined();
    expect(t!.domainAgentId).toBe('medical');
  });

  it('getById returns undefined for unknown id', () => {
    expect(svc.getById('nonexistent-template')).toBeUndefined();
  });

  // ── 15-07: Rental marketplace blueprint has combined models ──────────────

  it('rental marketplace blueprint includes both property and order models', () => {
    const templates = svc.recommend(['real-estate', 'marketplace']);
    const merged = svc.mergeBlueprint(templates);
    const modelNames = merged.dataModels.map((m) => m.name);
    expect(modelNames.some((n) => /property|listing/i.test(n))).toBe(true);
    expect(modelNames.some((n) => /order|escrow|transaction/i.test(n))).toBe(true);
  });
});
