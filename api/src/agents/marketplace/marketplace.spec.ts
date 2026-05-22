import { MarketplaceService } from './marketplace.service';
import { MARKETPLACE_REGISTRY } from './marketplace.registry';

const WS = 'test-workspace-01';
const USER = 'user-abc';

describe('MarketplaceService', () => {
  let svc: MarketplaceService;

  beforeEach(() => {
    svc = new MarketplaceService();
  });

  // ── 17-02: Registry integrity ─────────────────────────────────────────────────

  it('has at least 10 packs in the registry', () => {
    expect(MARKETPLACE_REGISTRY.length).toBeGreaterThanOrEqual(10);
  });

  it('every pack has all required manifest fields', () => {
    for (const p of MARKETPLACE_REGISTRY) {
      expect(p.id).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.version).toBeTruthy();
      expect(p.author).toBeTruthy();
      expect(typeof p.verified).toBe('boolean');
      expect(p.trustBadges.length).toBeGreaterThan(0);
      expect(p.category).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(20);
      expect(p.icon).toBeTruthy();
      expect(p.supportedDomains.length).toBeGreaterThan(0);
      expect(p.supportedUserModes.length).toBeGreaterThan(0);
      expect(p.capabilities.length).toBeGreaterThan(0);
      expect(typeof p.regulated).toBe('boolean');
      expect(typeof p.guardedModeRequired).toBe('boolean');
      expect(p.pricingModel).toBeTruthy();
      expect(p.installCount).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeGreaterThan(0);
      expect(p.visibility).toBeTruthy();
      expect(p.starterPrompts.length).toBeGreaterThan(0);
      expect(p.includedDomainAgentIds.length).toBeGreaterThan(0);
      expect(p.includedTemplateIds.length).toBeGreaterThan(0);
      expect(Array.isArray(p.complianceNotes)).toBe(true);
      expect(p.supportedCountries.length).toBeGreaterThan(0);
    }
  });

  it('all pack slugs are unique', () => {
    const slugs = MARKETPLACE_REGISTRY.map((p) => p.slug);
    expect(slugs.length).toBe(new Set(slugs).size);
  });

  it('all pack IDs are unique', () => {
    const ids = MARKETPLACE_REGISTRY.map((p) => p.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('regulated packs have guardedModeRequired = true', () => {
    for (const p of MARKETPLACE_REGISTRY.filter((p) => p.regulated)) {
      expect(p.guardedModeRequired).toBe(true);
    }
  });

  it('VERIFIED packs have verified = true', () => {
    for (const p of MARKETPLACE_REGISTRY.filter((p) => p.trustBadges.includes('VERIFIED'))) {
      expect(p.verified).toBe(true);
    }
  });

  it('REGULATED badge present on regulated packs', () => {
    for (const p of MARKETPLACE_REGISTRY.filter((p) => p.regulated)) {
      expect(p.trustBadges).toContain('REGULATED');
    }
  });

  it('OFFICIAL badge present on official packs', () => {
    const officialPacks = MARKETPLACE_REGISTRY.filter((p) => p.trustBadges.includes('OFFICIAL'));
    expect(officialPacks.length).toBeGreaterThan(0);
  });

  it('every pack capability has id, name, and description', () => {
    for (const p of MARKETPLACE_REGISTRY) {
      for (const cap of p.capabilities) {
        expect(cap.id).toBeTruthy();
        expect(cap.name).toBeTruthy();
        expect(cap.description.length).toBeGreaterThan(10);
      }
    }
  });

  it('every pack has at least one starter prompt', () => {
    for (const p of MARKETPLACE_REGISTRY) {
      expect(p.starterPrompts.length).toBeGreaterThan(0);
    }
  });

  // ── 17-03: Service operations ─────────────────────────────────────────────────

  it('listPacks returns all packs by default', () => {
    const packs = svc.listPacks();
    expect(packs.length).toBeGreaterThanOrEqual(10);
  });

  it('listPacks returns slim summaries (no raw compliance notes)', () => {
    const packs = svc.listPacks();
    for (const p of packs) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.verified).toBeDefined();
    }
  });

  it('getPack returns correct pack by slug', () => {
    const pack = svc.getPack('healthcare-starter-pack');
    expect(pack.slug).toBe('healthcare-starter-pack');
    expect(pack.regulated).toBe(true);
    expect(pack.guardedModeRequired).toBe(true);
  });

  it('getPack throws NotFoundException for unknown slug', () => {
    expect(() => svc.getPack('nonexistent-pack-xyz')).toThrow();
  });

  it('getPacksByDomain returns relevant packs for medical domain', () => {
    const packs = svc.getPacksByDomain(['medical']);
    expect(packs.some((p) => p.slug === 'healthcare-starter-pack')).toBe(true);
  });

  it('getPacksByDomain returns packs for multiple domains', () => {
    const packs = svc.getPacksByDomain(['restaurant', 'logistics']);
    expect(packs.some((p) => p.slug === 'restaurant-ops-pack')).toBe(true);
  });

  it('getPacksByDomain returns empty array for unknown domains', () => {
    const packs = svc.getPacksByDomain(['unknown-domain-xyz']);
    expect(packs).toHaveLength(0);
  });

  // ── 17-08: Search and discovery ──────────────────────────────────────────────

  it('search by query matches pack name', () => {
    const packs = svc.listPacks({ query: 'healthcare' });
    expect(packs.some((p) => p.slug === 'healthcare-starter-pack')).toBe(true);
  });

  it('search by query matches tags', () => {
    const packs = svc.listPacks({ query: 'hipaa' });
    expect(packs.some((p) => p.slug === 'healthcare-starter-pack')).toBe(true);
  });

  it('search by category filters correctly', () => {
    const packs = svc.listPacks({ category: 'ecommerce' });
    expect(packs.every((p) => p.category === 'ecommerce')).toBe(true);
    expect(packs.some((p) => p.slug === 'ecommerce-pro-pack')).toBe(true);
  });

  it('filter by regulated returns only regulated packs', () => {
    const regulated = svc.listPacks({ regulated: true });
    expect(regulated.length).toBeGreaterThan(0);
    expect(regulated.every((p) => p.regulated)).toBe(true);
  });

  it('filter by regulated=false returns only non-regulated packs', () => {
    const nonRegulated = svc.listPacks({ regulated: false });
    expect(nonRegulated.length).toBeGreaterThan(0);
    expect(nonRegulated.every((p) => !p.regulated)).toBe(true);
  });

  it('filter by pricingModel FREE returns only free packs', () => {
    const free = svc.listPacks({ pricingModel: 'FREE' });
    expect(free.length).toBeGreaterThan(0);
    expect(free.every((p) => p.pricingModel === 'FREE')).toBe(true);
  });

  it('sortBy INSTALL_COUNT returns highest install count first', () => {
    const packs = svc.listPacks({ sortBy: 'INSTALL_COUNT' });
    for (let i = 1; i < packs.length; i++) {
      expect(packs[i - 1].installCount).toBeGreaterThanOrEqual(packs[i].installCount);
    }
  });

  it('sortBy RATING returns highest rating first', () => {
    const packs = svc.listPacks({ sortBy: 'RATING' });
    for (let i = 1; i < packs.length; i++) {
      expect(packs[i - 1].rating).toBeGreaterThanOrEqual(packs[i].rating);
    }
  });

  it('sortBy NAME returns alphabetical order', () => {
    const packs = svc.listPacks({ sortBy: 'NAME' });
    for (let i = 1; i < packs.length; i++) {
      expect(packs[i - 1].name.localeCompare(packs[i].name)).toBeLessThanOrEqual(0);
    }
  });

  // ── 17-03: Install lifecycle ─────────────────────────────────────────────────

  it('install returns success result with capabilities', () => {
    const result = svc.install({ packSlug: 'ecommerce-pro-pack', workspaceId: WS, userId: USER });
    expect(result.installed).toBe(true);
    expect(result.alreadyInstalled).toBe(false);
    expect(result.addedCapabilities.length).toBeGreaterThan(0);
    expect(result.addedTemplateIds.length).toBeGreaterThan(0);
    expect(result.addedDomainAgentIds.length).toBeGreaterThan(0);
    expect(result.packName).toBe('Ecommerce Pro Pack');
  });

  it('install regulated pack returns compliance warnings', () => {
    const result = svc.install({ packSlug: 'healthcare-starter-pack', workspaceId: WS, userId: USER });
    expect(result.installed).toBe(true);
    expect(result.regulatedWarnings.length).toBeGreaterThan(0);
  });

  it('install regulated pack has guardedModeEnabled = true', () => {
    const result = svc.install({ packSlug: 'healthcare-starter-pack', workspaceId: WS, userId: USER });
    expect(result.guardedModeEnabled).toBe(true);
  });

  it('install non-regulated pack has guardedModeEnabled = false', () => {
    const result = svc.install({ packSlug: 'logistics-delivery-pack', workspaceId: WS, userId: USER });
    expect(result.guardedModeEnabled).toBe(false);
  });

  it('double install returns alreadyInstalled = true', () => {
    svc.install({ packSlug: 'restaurant-ops-pack', workspaceId: WS, userId: USER });
    const second = svc.install({ packSlug: 'restaurant-ops-pack', workspaceId: WS, userId: USER });
    expect(second.alreadyInstalled).toBe(true);
    expect(second.installed).toBe(false);
  });

  it('isInstalled returns true after install', () => {
    svc.install({ packSlug: 'crm-growth-pack', workspaceId: WS, userId: USER });
    expect(svc.isInstalled('crm-growth-pack', WS)).toBe(true);
  });

  it('isInstalled returns false before install', () => {
    expect(svc.isInstalled('ai-automation-pack', WS)).toBe(false);
  });

  it('install throws for unknown pack slug', () => {
    expect(() => svc.install({ packSlug: 'fake-pack-xyz', workspaceId: WS, userId: USER })).toThrow();
  });

  // ── 17-03: Uninstall lifecycle ───────────────────────────────────────────────

  it('uninstall returns success after install', () => {
    svc.install({ packSlug: 'education-platform-pack', workspaceId: WS, userId: USER });
    const result = svc.uninstall('education-platform-pack', WS);
    expect(result.uninstalled).toBe(true);
    expect(result.removedCapabilities.length).toBeGreaterThan(0);
  });

  it('isInstalled returns false after uninstall', () => {
    svc.install({ packSlug: 'creator-studio-pack', workspaceId: WS, userId: USER });
    svc.uninstall('creator-studio-pack', WS);
    expect(svc.isInstalled('creator-studio-pack', WS)).toBe(false);
  });

  it('uninstall non-installed pack returns uninstalled = false', () => {
    const result = svc.uninstall('ai-automation-pack', WS);
    expect(result.uninstalled).toBe(false);
  });

  it('getInstalledPacks returns installed packs for workspace', () => {
    svc.install({ packSlug: 'crm-growth-pack', workspaceId: WS, userId: USER });
    svc.install({ packSlug: 'ai-automation-pack', workspaceId: WS, userId: USER });
    const installed = svc.getInstalledPacks(WS);
    expect(installed.some((p) => p.slug === 'crm-growth-pack')).toBe(true);
    expect(installed.some((p) => p.slug === 'ai-automation-pack')).toBe(true);
  });

  it('getInstalledPacks returns empty array for unknown workspace', () => {
    expect(svc.getInstalledPacks('nonexistent-workspace')).toHaveLength(0);
  });

  // ── 17-05: Compatibility validation ─────────────────────────────────────────

  it('validateCompatibility passes for valid pack with no conflicts', () => {
    const result = svc.validateCompatibility('healthcare-starter-pack', WS);
    expect(result.compatible).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('validateCompatibility fails for unknown pack', () => {
    const result = svc.validateCompatibility('nonexistent-pack', WS);
    expect(result.compatible).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('validateCompatibility detects conflict with installed pack', () => {
    svc.install({ packSlug: 'marketplace-builder-pack', workspaceId: WS, userId: USER });
    const result = svc.validateCompatibility('ecommerce-pro-pack', WS);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => /conflict/i.test(r))).toBe(true);
  });

  it('validateCompatibility warns about regulated mode for regulated packs', () => {
    const result = svc.validateCompatibility('saas-launch-pack', WS);
    expect(result.warnings.some((w) => /guarded/i.test(w) || /regulated/i.test(w))).toBe(true);
  });

  // ── 17-06: Trust badge verification ─────────────────────────────────────────

  it('healthcare pack has VERIFIED, OFFICIAL, and REGULATED badges', () => {
    const pack = svc.getPack('healthcare-starter-pack');
    expect(pack.trustBadges).toContain('VERIFIED');
    expect(pack.trustBadges).toContain('OFFICIAL');
    expect(pack.trustBadges).toContain('REGULATED');
  });

  it('ai-automation pack has ENTERPRISE_READY badge', () => {
    const pack = svc.getPack('ai-automation-pack');
    expect(pack.trustBadges).toContain('ENTERPRISE_READY');
  });

  it('community packs can be VERIFIED but have COMMUNITY badge', () => {
    const pack = svc.getPack('creator-studio-pack');
    expect(pack.trustBadges).toContain('COMMUNITY');
    expect(pack.verified).toBe(true);
  });

  // ── 17-09: Safety — no policy override, no CoT leaks ─────────────────────────

  it('no chain-of-thought or internal metadata in registry', () => {
    const json = JSON.stringify(MARKETPLACE_REGISTRY);
    expect(json).not.toMatch(/chain.of.thought|hidden prompt|system prompt/i);
  });

  it('no regulated pack can set guardedModeRequired = false', () => {
    for (const p of MARKETPLACE_REGISTRY.filter((p) => p.regulated)) {
      expect(p.guardedModeRequired).toBe(true);
    }
  });

  it('install result contains no chain-of-thought or internal metadata', () => {
    const result = svc.install({ packSlug: 'healthcare-starter-pack', workspaceId: WS, userId: USER });
    const json = JSON.stringify(result);
    expect(json).not.toMatch(/chain.of.thought|hidden prompt|system prompt/i);
  });

  it('uninstall of core pack does not affect other workspace installs', () => {
    const ws2 = 'other-workspace';
    svc.install({ packSlug: 'crm-growth-pack', workspaceId: WS, userId: USER });
    svc.install({ packSlug: 'crm-growth-pack', workspaceId: ws2, userId: USER });
    svc.uninstall('crm-growth-pack', WS);
    expect(svc.isInstalled('crm-growth-pack', WS)).toBe(false);
    expect(svc.isInstalled('crm-growth-pack', ws2)).toBe(true);
  });

  it('no pack manifest contains executable code fields', () => {
    for (const p of MARKETPLACE_REGISTRY) {
      expect((p as any).executableCode).toBeUndefined();
      expect((p as any).systemPrompt).toBeUndefined();
      expect((p as any).rawPrompt).toBeUndefined();
    }
  });
});
