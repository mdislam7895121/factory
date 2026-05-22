import { StartupIntelligenceService } from './startup-intelligence.service';
import { DomainTemplateService } from './domain-template.service';

describe('StartupIntelligenceService', () => {
  let svc: StartupIntelligenceService;

  beforeEach(() => {
    svc = new StartupIntelligenceService(new DomainTemplateService());
  });

  // ── 15-10: User skill mode detection ─────────────────────────────────────────

  it('detects NON_TECHNICAL for a plain language healthcare prompt', () => {
    const result = svc.detectUserMode('I want to build a doctor booking app for my clinic');
    expect(result.userMode).toBe('NON_TECHNICAL');
    expect(result.explanationStyle).toMatch(/simple|guided|jargon/i);
    expect(result.recommendedNextQuestions.length).toBeGreaterThan(0);
  });

  it('detects PROFESSIONAL_DEVELOPER for a technical SaaS prompt', () => {
    const result = svc.detectUserMode(
      'Build a GraphQL API with JWT auth, PostgreSQL, Redis caching, and Docker deployment',
    );
    expect(result.userMode).toBe('PROFESSIONAL_DEVELOPER');
    expect(result.explanationStyle).toMatch(/architecture|API|schema/i);
  });

  it('detects STARTUP_FOUNDER for a startup prompt', () => {
    const result = svc.detectUserMode(
      'I want to build an MVP, monetize it and get traction for seed round fundraise',
    );
    expect(result.userMode).toBe('STARTUP_FOUNDER');
  });

  it('detects BUSINESS_OWNER for an operations prompt', () => {
    const result = svc.detectUserMode(
      'I need to manage my restaurant staff and automate my invoicing for revenue growth',
    );
    expect(result.userMode).toBe('BUSINESS_OWNER');
  });

  it('detects AGENCY_FREELANCER for a client scope prompt', () => {
    const result = svc.detectUserMode(
      'Building a white-label solution for a client with a budget and handoff deliverables',
    );
    expect(result.userMode).toBe('AGENCY_FREELANCER');
  });

  it('returns 4 recommended next questions for any mode', () => {
    const modes = [
      'simple app for booking',
      'microservice backend postgresql docker',
      'mvp launch investors startup',
      'manage my business operations staff',
    ];
    for (const prompt of modes) {
      const result = svc.detectUserMode(prompt);
      expect(result.recommendedNextQuestions).toHaveLength(4);
    }
  });

  // ── 15-11: Project identity ───────────────────────────────────────────────────

  it('derives a project identity with all required fields', () => {
    const identity = svc.deriveProjectIdentity('Build a healthcare portal for Bangladesh', 'medical');
    expect(identity.projectName).toBeTruthy();
    expect(identity.appName).toBeTruthy();
    expect(identity.tagline).toBeTruthy();
    expect(identity.colorPalette.primary).toMatch(/^#/);
    expect(identity.colorPalette.secondary).toMatch(/^#/);
    expect(identity.country).toBe('Bangladesh');
    expect(identity.currency).toBeTruthy();
  });

  it('falls back to safe domain defaults when no name is in prompt', () => {
    const identity = svc.deriveProjectIdentity('Build an app for my restaurant', 'restaurant');
    expect(identity.appName).toBe('TableNow');
    expect(identity.colorPalette.primary).toBeTruthy();
  });

  it('detects country from prompt text', () => {
    const identity = svc.deriveProjectIdentity('Build a food delivery app for the UK market', 'restaurant');
    expect(identity.country).toBe('United Kingdom');
  });

  it('detects currency from prompt text', () => {
    const identity = svc.deriveProjectIdentity('Build an ecommerce store, pricing in rupee', 'ecommerce');
    expect(identity.currency).toBe('INR');
  });

  // ── 15-12: Customer demand analysis ──────────────────────────────────────────

  it('analyzes customer demand for a restaurant prompt', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('food-ordering-app');
    const result = svc.analyzeCustomerDemand('Build a restaurant ordering app with delivery', template);
    expect(result.targetCustomers).toBeTruthy();
    expect(result.painPoint).toBeTruthy();
    expect(result.jobToBeDone).toMatch(/restaurant|food|order|deliver/i);
    expect(result.mustHaveFeatures.length).toBeGreaterThan(0);
    expect(result.monetizationOption).toBeTruthy();
    expect(result.launchMVPFeatures.length).toBeGreaterThan(0);
  });

  it('detects commission monetization for marketplace prompt', () => {
    const result = svc.analyzeCustomerDemand('Build a marketplace with commission on transactions');
    expect(result.monetizationOption).toMatch(/commission/i);
  });

  it('detects SaaS subscription monetization', () => {
    const result = svc.analyzeCustomerDemand('Build a SaaS platform with monthly plan subscription');
    expect(result.monetizationOption).toMatch(/subscription|saas/i);
  });

  it('defaults to freemium monetization when not specified', () => {
    const result = svc.analyzeCustomerDemand('Build a simple task tracker app');
    expect(result.monetizationOption).toMatch(/freemium/i);
  });

  it('returns non-empty trust expectations', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('healthcare-portal');
    const result = svc.analyzeCustomerDemand('Build a doctor booking app', template);
    expect(result.trustExpectations.length).toBeGreaterThan(0);
  });

  // ── 15-15: Branding defaults ──────────────────────────────────────────────────

  it('generates branding for medical domain', () => {
    const branding = svc.generateBranding('medical', 'MediFlow');
    expect(branding.appName).toBe('MediFlow');
    expect(branding.primaryColor).toMatch(/^#/);
    expect(branding.logoIdea).toBeTruthy();
    expect(branding.landingHeadline).toMatch(/MediFlow/);
    expect(branding.ctaCopy).toBeTruthy();
  });

  it('generates branding for restaurant domain', () => {
    const branding = svc.generateBranding('restaurant', 'TableNow');
    expect(branding.primaryColor).toBeTruthy();
    expect(branding.uiStyle).toMatch(/warm|inviting|food/i);
    expect(branding.ctaCopy).toMatch(/order/i);
  });

  it('generates safe default branding when no domain given', () => {
    const branding = svc.generateBranding();
    expect(branding.primaryColor).toBeTruthy();
    expect(branding.logoIdea).toBeTruthy();
    expect(branding.landingHeadline).toBeTruthy();
  });

  it('generates branding for all 15 supported domains without error', () => {
    const domains = [
      'medical', 'legal-compliance', 'finance', 'insurance', 'real-estate',
      'ecommerce', 'marketplace', 'restaurant', 'logistics', 'education',
      'hr-recruiting', 'crm-sales', 'automation', 'mobile-app', 'gaming',
    ];
    for (const domain of domains) {
      const branding = svc.generateBranding(domain, 'TestApp');
      expect(branding.primaryColor).toMatch(/^#/);
      expect(branding.landingHeadline).toMatch(/TestApp/);
    }
  });

  // ── 15-14: Guided builder setup ───────────────────────────────────────────────

  it('produces guided setup with 7 fields', () => {
    const setup = svc.buildGuidedSetup('Build a clinic booking app');
    expect(Object.keys(setup.guidedSetup).length).toBe(7);
  });

  it('marks payment intent when mentioned in prompt', () => {
    const setup = svc.buildGuidedSetup('Build a food ordering app with Stripe payment checkout');
    expect(setup.guidedSetup['Do you want payments?']).toMatch(/yes/i);
  });

  it('always provides non-empty missingButAssumedFields and safeDefaults', () => {
    const setup = svc.buildGuidedSetup('Build a simple app');
    expect(setup.missingButAssumedFields.length).toBeGreaterThan(0);
    expect(Object.keys(setup.safeDefaults).length).toBeGreaterThan(0);
  });

  // ── 15-13: Developer blueprint ────────────────────────────────────────────────

  it('returns null developer blueprint for NON_TECHNICAL user', () => {
    const blueprint = svc.buildDeveloperBlueprint('Build an app', undefined, 'NON_TECHNICAL');
    expect(blueprint).toBeNull();
  });

  it('returns developer blueprint for PROFESSIONAL_DEVELOPER user', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('fintech-saas');
    const blueprint = svc.buildDeveloperBlueprint('Build a fintech SaaS with PostgreSQL', template, 'PROFESSIONAL_DEVELOPER');
    expect(blueprint).not.toBeNull();
    expect(blueprint!.stackRecommendation).toBeDefined();
    expect(blueprint!.stackRecommendation.backend).toBeTruthy();
    expect(blueprint!.envVars.length).toBeGreaterThan(0);
    expect(blueprint!.testPlan.length).toBeGreaterThan(0);
    expect(blueprint!.rollbackPlan).toBeTruthy();
  });

  it('includes HIPAA auth model for medical domain', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('healthcare-portal');
    const blueprint = svc.buildDeveloperBlueprint('Build a HIPAA clinic app', template, 'PROFESSIONAL_DEVELOPER');
    expect(blueprint!.authModel).toMatch(/HIPAA/i);
    expect(blueprint!.deploymentTarget).toMatch(/HIPAA/i);
  });

  it('includes Stripe env vars for payment-related prompts', () => {
    const blueprint = svc.buildDeveloperBlueprint('Build an ecommerce store with payment checkout', undefined, 'STARTUP_FOUNDER');
    expect(blueprint!.envVars.some((v) => v.includes('STRIPE'))).toBe(true);
  });

  // ── 15-16: Requirement checklist ──────────────────────────────────────────────

  it('builds a checklist with 16 items', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('food-ordering-app');
    const identity = svc.deriveProjectIdentity('Build a food ordering app', 'restaurant');
    const checklist = svc.buildRequirementChecklist('Build a food ordering app', identity, template);
    expect(checklist).toHaveLength(16);
  });

  it('marks payments as provided when mentioned in prompt', () => {
    const identity = svc.deriveProjectIdentity('Build app with payment checkout', 'ecommerce');
    const checklist = svc.buildRequirementChecklist('Build app with payment checkout', identity);
    const paymentItem = checklist.find((c) => c.item === 'Payments');
    expect(paymentItem?.status).toBe('provided');
    expect(paymentItem?.value).toMatch(/stripe/i);
  });

  it('marks payments as deferred when not mentioned', () => {
    const identity = svc.deriveProjectIdentity('Build a task tracker', 'default');
    const checklist = svc.buildRequirementChecklist('Build a task tracker', identity);
    const paymentItem = checklist.find((c) => c.item === 'Payments');
    expect(paymentItem?.status).toBe('deferred');
  });

  it('marks privacy/legal as provided for regulated templates', () => {
    const templateSvc = new DomainTemplateService();
    const template = templateSvc.getById('healthcare-portal');
    const identity = svc.deriveProjectIdentity('Build a healthcare app', 'medical');
    const checklist = svc.buildRequirementChecklist('Build a healthcare app', identity, template);
    const legalItem = checklist.find((c) => c.item === 'Privacy/legal');
    expect(legalItem?.status).toBe('provided');
  });

  it('marks app name as provided when prompt contains custom name', () => {
    const identity = svc.deriveProjectIdentity('Build a HealthPlus app for doctors', 'medical');
    const checklist = svc.buildRequirementChecklist('Build a HealthPlus app for doctors', identity);
    const nameItem = checklist.find((c) => c.item === 'App name');
    expect(['provided', 'inferred']).toContain(nameItem?.status);
  });

  // ── 15-17: Full startup blueprint ────────────────────────────────────────────

  it('builds a full startup blueprint for a non-technical healthcare prompt', () => {
    const blueprint = svc.buildStartupBlueprint(
      'I want to build a doctor booking app for my small clinic',
      ['medical'],
      'healthcare-portal',
    );
    expect(blueprint.projectIdentity).toBeDefined();
    expect(blueprint.userMode).toBe('NON_TECHNICAL');
    expect(blueprint.customerDemand).toBeDefined();
    expect(blueprint.domainTemplates.length).toBeGreaterThan(0);
    expect(blueprint.features.length).toBeGreaterThan(0);
    expect(blueprint.dataModels.length).toBeGreaterThan(0);
    expect(blueprint.branding.primaryColor).toBeTruthy();
    expect(blueprint.checklist).toHaveLength(16);
    expect(blueprint.technicalPlan).toBeNull(); // NON_TECHNICAL gets no tech plan
  });

  it('includes developer blueprint for technical SaaS prompt', () => {
    const blueprint = svc.buildStartupBlueprint(
      'Build a GraphQL API with JWT auth, PostgreSQL, Redis caching, Docker deployment',
      ['finance'],
    );
    expect(blueprint.userMode).toBe('PROFESSIONAL_DEVELOPER');
    expect(blueprint.technicalPlan).not.toBeNull();
    expect(blueprint.technicalPlan!.stackRecommendation).toBeDefined();
  });

  it('builds blueprint for a business owner restaurant prompt', () => {
    const blueprint = svc.buildStartupBlueprint(
      'I need to manage my restaurant staff and grow revenue through online ordering',
      ['restaurant'],
      'food-ordering-app',
    );
    expect(blueprint.userMode).toBe('BUSINESS_OWNER');
    expect(blueprint.branding.ctaCopy).toMatch(/order/i);
    expect(blueprint.compliance).toBeDefined();
  });

  it('returns safe defaults when no domain agent IDs provided', () => {
    const blueprint = svc.buildStartupBlueprint('Build an app', []);
    expect(blueprint.projectIdentity.appName).toBeTruthy();
    expect(blueprint.branding.primaryColor).toBeTruthy();
    expect(blueprint.checklist).toHaveLength(16);
  });

  it('builds a mixed-domain marketplace blueprint', () => {
    const blueprint = svc.buildStartupBlueprint(
      'Build a pharmacy marketplace with delivery — I need to launch an MVP with commission model',
      ['medical', 'marketplace'],
    );
    expect(blueprint.domainTemplates.length).toBeGreaterThan(1);
    expect(blueprint.features.length).toBeGreaterThan(0);
    expect(blueprint.customerDemand.monetizationOption).toMatch(/commission/i);
  });

  // ── 15-17: Blueprint safety / no chain-of-thought ─────────────────────────────

  it('blueprint output contains no chain-of-thought or internal metadata', () => {
    const blueprint = svc.buildStartupBlueprint('Build a legal compliance tool', ['legal-compliance']);
    const json = JSON.stringify(blueprint);
    expect(json).not.toMatch(/internal|hidden|chain.of.thought|private|system prompt/i);
  });

  it('regulated disclaimers remain active in full blueprint', () => {
    const blueprint = svc.buildStartupBlueprint(
      'Build a HIPAA clinic appointment system',
      ['medical'],
      'healthcare-portal',
    );
    expect(blueprint.compliance.length).toBeGreaterThan(0);
  });
});
