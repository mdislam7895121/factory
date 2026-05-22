import { Injectable } from '@nestjs/common';
import { DomainTemplateService } from './domain-template.service';
import { StartupIntelligenceService } from './startup-intelligence.service';
import type {
  CouncilSession,
  CouncilMessage,
  CouncilDecision,
  CouncilMemory,
  FinalBuildPlan,
  RiskItem,
  CouncilApprovalState,
  CouncilVote,
  MessageRole,
  RiskCategory,
  RiskLevel,
  DecisionOutcome,
} from './council.types';

// ── Agent profiles ─────────────────────────────────────────────────────────────

interface AgentProfile {
  id: string;
  name: string;
  icon: string;
  alwaysActive: boolean;
  triggerDomains: string[];
}

const AGENT_PROFILES: AgentProfile[] = [
  { id: 'planner',     name: 'Planner Agent',     icon: '🗺️',  alwaysActive: true,  triggerDomains: [] },
  { id: 'architect',   name: 'Architect Agent',   icon: '🏗️',  alwaysActive: true,  triggerDomains: [] },
  { id: 'security',    name: 'Security Agent',    icon: '🛡️',  alwaysActive: true,  triggerDomains: [] },
  { id: 'qa',          name: 'QA Agent',          icon: '🧪',  alwaysActive: true,  triggerDomains: [] },
  { id: 'medical',     name: 'Medical Agent',     icon: '🏥',  alwaysActive: false, triggerDomains: ['medical'] },
  { id: 'finance',     name: 'Finance Agent',     icon: '💰',  alwaysActive: false, triggerDomains: ['finance', 'insurance'] },
  { id: 'legal',       name: 'Legal Agent',       icon: '⚖️',  alwaysActive: false, triggerDomains: ['legal-compliance'] },
  { id: 'marketplace', name: 'Marketplace Agent', icon: '🛒',  alwaysActive: false, triggerDomains: ['marketplace', 'ecommerce'] },
  { id: 'logistics',   name: 'Logistics Agent',   icon: '🚚',  alwaysActive: false, triggerDomains: ['logistics', 'restaurant'] },
];

const VALID_ROLES: MessageRole[] = ['PROPOSE', 'OBJECT', 'SUGGEST', 'REQUEST_INPUT', 'APPROVE', 'REJECT', 'DEFER'];

// ── Council context (internal — never exposed) ─────────────────────────────────

interface CouncilContext {
  prompt: string;
  lower: string;
  domainAgentIds: string[];
  isRegulated: boolean;
  hasPayment: boolean;
  hasPrescription: boolean;
  hasUpload: boolean;
  hasMobile: boolean;
  hasMarketplace: boolean;
  hasMedical: boolean;
  hasFinance: boolean;
  hasLogistics: boolean;
  hasDelivery: boolean;
  hasSubscription: boolean;
  hasEnterprise: boolean;
  noAuthMentioned: boolean;
  noCountryMentioned: boolean;
  appName: string;
  primaryDomain: string;
  primaryTemplateName: string;
  features: string[];
  dbModels: string[];
  apiModules: string[];
  userRoles: string[];
  stack: Record<string, string>;
}

// ── 16-05: Risk rules ─────────────────────────────────────────────────────────

interface RiskRule {
  category: RiskCategory;
  level: RiskLevel;
  condition: (ctx: CouncilContext) => boolean;
  description: string;
  mitigation: string;
}

const RISK_RULES: RiskRule[] = [
  {
    category: 'PRIVACY',
    level: 'CRITICAL',
    condition: (ctx) => ctx.hasPrescription,
    description: 'Prescription and health records constitute PHI — HIPAA-eligible infrastructure required.',
    mitigation: 'Sign HIPAA BAA with cloud provider; encrypt PHI at rest (AES-256); enforce tamper-evident audit logs.',
  },
  {
    category: 'COMPLIANCE',
    level: 'CRITICAL',
    condition: (ctx) => ctx.hasMedical && ctx.hasPrescription,
    description: 'Prescription dispensing without licensed pharmacy verification is illegal in most jurisdictions.',
    mitigation: 'Integrate licensed pharmacy verification API; pharmacist approval step required before any dispensing.',
  },
  {
    category: 'COMPLIANCE',
    level: 'HIGH',
    condition: (ctx) => ctx.isRegulated,
    description: 'Regulated domain requires professional compliance review before public launch.',
    mitigation: 'Engage qualified legal, medical, or domain professional; obtain required licenses or certifications.',
  },
  {
    category: 'PAYMENT',
    level: 'HIGH',
    condition: (ctx) => ctx.hasPayment,
    description: 'Payment processing requires PCI-DSS compliance — raw card data must never be stored on application servers.',
    mitigation: 'Use Stripe or Braintree for payment tokenization; enable fraud detection (Stripe Radar); never log card numbers.',
  },
  {
    category: 'PAYMENT',
    level: 'HIGH',
    condition: (ctx) => ctx.hasFinance || ctx.hasSubscription,
    description: 'Financial transactions require idempotency and reconciliation to prevent double charges.',
    mitigation: 'Implement idempotency keys on all payment endpoints; add daily reconciliation cron job.',
  },
  {
    category: 'AUTH',
    level: 'HIGH',
    condition: (ctx) => ctx.noAuthMentioned && !ctx.isRegulated,
    description: 'Authentication layer not specified — unauthenticated access is a critical security risk.',
    mitigation: 'Implement JWT with 15-min access tokens and 7-day refresh rotation; enforce rate limiting on all auth endpoints.',
  },
  {
    category: 'ABUSE',
    level: 'MEDIUM',
    condition: (ctx) => ctx.hasMarketplace,
    description: 'Two-sided marketplace is susceptible to fake listings, review fraud, and sybil attacks.',
    mitigation: 'Implement identity verification at seller onboarding; add listing moderation queue; enforce two-way review system.',
  },
  {
    category: 'SCALING',
    level: 'MEDIUM',
    condition: (ctx) => ctx.hasDelivery,
    description: 'Real-time delivery tracking requires WebSocket scaling and geospatial query optimization.',
    mitigation: 'Use PostGIS for geospatial indexing; Redis pub/sub for WebSocket fan-out to connected clients.',
  },
  {
    category: 'SCALING',
    level: 'MEDIUM',
    condition: (ctx) => ctx.hasEnterprise,
    description: 'Enterprise multi-tenant architecture requires strict data isolation between organizations.',
    mitigation: 'Implement row-level security (RLS) in PostgreSQL; scope all JWT claims to tenant ID.',
  },
  {
    category: 'COMPLIANCE',
    level: 'LOW',
    condition: (ctx) => ctx.noCountryMentioned,
    description: 'Target market not specified — GDPR, CCPA, or local compliance requirements are unknown.',
    mitigation: 'Default to GDPR-compliant data handling; finalize compliance strategy after market selection.',
  },
];

// ── 16-03: Debate topics ──────────────────────────────────────────────────────

interface DebateTopic {
  topic: string;
  condition: (ctx: CouncilContext) => boolean;
  participantVotes: Record<string, () => CouncilVote>;
  resolveOutcome: () => DecisionOutcome;
  rationale: (ctx: CouncilContext) => string;
}

const DEBATE_TOPICS: DebateTopic[] = [
  {
    topic: 'Escrow payment protection for marketplace transactions',
    condition: (ctx) => ctx.hasMarketplace && ctx.hasPayment,
    participantVotes: { security: () => 'APPROVE', finance: () => 'APPROVE', marketplace: () => 'APPROVE', planner: () => 'APPROVE' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Unanimous: escrow is mandatory for buyer/seller trust in a two-sided marketplace.',
  },
  {
    topic: 'AI-generated medical advice, diagnosis, or dosage features',
    condition: (ctx) => ctx.hasMedical,
    participantVotes: { medical: () => 'OBJECT', security: () => 'OBJECT', qa: () => 'OBJECT', planner: () => 'OBJECT' },
    resolveOutcome: () => 'REJECTED',
    rationale: () => 'Council vetoes: platform cannot provide diagnosis, dosage guidance, or prescription advice — legally prohibited.',
  },
  {
    topic: 'Licensed pharmacy verification for prescription fulfilment',
    condition: (ctx) => ctx.hasMedical && ctx.hasPrescription,
    participantVotes: { medical: () => 'APPROVE', security: () => 'APPROVE', planner: () => 'APPROVE_WITH_CONDITION', qa: () => 'APPROVE_WITH_CONDITION' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Medical Agent mandates: prescriptions require licensed pharmacy verification before any dispensing.',
  },
  {
    topic: 'Professional compliance review gate before public launch',
    condition: (ctx) => ctx.isRegulated,
    participantVotes: { security: () => 'APPROVE', planner: () => 'APPROVE', qa: () => 'APPROVE' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Non-negotiable for regulated domains: qualified professional review required before public launch.',
  },
  {
    topic: 'Commission reconciliation and automated payout engine',
    condition: (ctx) => (ctx.hasMarketplace || ctx.hasFinance) && ctx.hasPayment,
    participantVotes: { finance: () => 'APPROVE', security: () => 'APPROVE_WITH_CONDITION', architect: () => 'APPROVE' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Finance Agent: daily settlement cron and idempotency keys required on all payout endpoints.',
  },
  {
    topic: 'Real-time rider tracking with geofenced delivery zones',
    condition: (ctx) => ctx.hasDelivery,
    participantVotes: { logistics: () => 'APPROVE', architect: () => 'APPROVE_WITH_CONDITION', qa: () => 'APPROVE_WITH_CONDITION' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Accepted with condition: WebSocket scaling must be load-tested at 500 concurrent riders before production.',
  },
  {
    topic: 'GDPR cookie consent banner pre-loading non-essential cookies',
    condition: (ctx) => ctx.domainAgentIds.includes('legal-compliance'),
    participantVotes: { legal: () => 'APPROVE', security: () => 'APPROVE', planner: () => 'APPROVE' },
    resolveOutcome: () => 'ACCEPTED',
    rationale: () => 'Legal Agent: GDPR mandates consent before non-essential cookies are loaded — this is a legal requirement, not optional UX.',
  },
  {
    topic: 'Native mobile app scope in current MVP',
    condition: (ctx) => ctx.hasMobile,
    participantVotes: { architect: () => 'APPROVE_WITH_CONDITION', planner: () => 'APPROVE_WITH_CONDITION', qa: () => 'APPROVE' },
    resolveOutcome: () => 'DEFERRED',
    rationale: () => 'Deferred: ship responsive web MVP first; native mobile app planned for phase 2 to reduce time-to-market.',
  },
];

// ── Session ID ─────────────────────────────────────────────────────────────────

function genSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Service ────────────────────────────────────────────────────────────────────

@Injectable()
export class CouncilService {
  // 16-08: In-process memory layer — persists for the lifetime of the NestJS process
  private readonly sessionMemory = new Map<string, CouncilMemory>();

  constructor(
    private readonly templateService: DomainTemplateService,
    private readonly intelligenceService: StartupIntelligenceService,
  ) {}

  // 16-01: Run a full multi-agent council session
  runSession(prompt: string, domainAgentIds: string[], suggestedTemplateId?: string): CouncilSession {
    const blueprint = this.intelligenceService.buildStartupBlueprint(prompt, domainAgentIds, suggestedTemplateId);
    const ctx = this.buildContext(prompt, domainAgentIds, blueprint);
    const participants = this.selectParticipants(ctx);
    const messages = this.generateMessages(ctx, participants);
    const riskMatrix = this.buildRiskMatrix(ctx);
    const decisions = this.resolveDecisions(ctx, participants);
    const approvalState = this.determineApproval(riskMatrix, decisions);
    const finalBuildPlan = this.synthesizeBuildPlan(ctx, blueprint, riskMatrix, decisions, approvalState);
    const sessionId = genSessionId();
    const memory = this.buildMemory(sessionId, ctx, decisions, blueprint);
    this.sessionMemory.set(sessionId, memory);

    return {
      sessionId,
      prompt,
      participants,
      messages,
      decisions,
      riskMatrix,
      memory,
      finalBuildPlan,
      approvalState,
      createdAt: Date.now(),
    };
  }

  // 16-08: Retrieve persisted memory for a previous session
  getMemory(sessionId: string): CouncilMemory | undefined {
    return this.sessionMemory.get(sessionId);
  }

  // ── Private pipeline ─────────────────────────────────────────────────────────

  private buildContext(prompt: string, domainAgentIds: string[], blueprint: any): CouncilContext {
    const lower = prompt.toLowerCase();
    const regulated = this.templateService.getAll()
      .filter((t) => domainAgentIds.includes(t.domainAgentId) && t.regulated);
    const primaryTemplate = this.templateService.recommend(domainAgentIds)[0];

    return {
      prompt,
      lower,
      domainAgentIds,
      isRegulated:       regulated.length > 0,
      hasPayment:        /payment|checkout|billing|stripe|paypal|commission|payout/.test(lower),
      hasPrescription:   /prescription|medicine|drug|pharmacy|pharma|dispensing/.test(lower),
      hasUpload:         /upload|document|file|photo|image|attachment/.test(lower),
      hasMobile:         /mobile|ios|android|react native|flutter/.test(lower),
      hasMarketplace:    domainAgentIds.includes('marketplace') || /marketplace|two.sided|vendor|seller/.test(lower),
      hasMedical:        domainAgentIds.includes('medical'),
      hasFinance:        domainAgentIds.includes('finance') || domainAgentIds.includes('insurance'),
      hasLogistics:      domainAgentIds.includes('logistics') || domainAgentIds.includes('restaurant'),
      hasDelivery:       /delivery|rider|driver|dispatch|logistics|tracking/.test(lower),
      hasSubscription:   /subscription|saas|monthly plan|recurring/.test(lower),
      hasEnterprise:     /enterprise|b2b|multi.tenant|organization/.test(lower),
      noAuthMentioned:   !/\b(login|auth|jwt|oauth|account|sign.?in|sign.?up)\b/.test(lower),
      noCountryMentioned:!/\b(usa|us|uk|india|bangladesh|canada|australia|europe|global|worldwide)\b/.test(lower),
      appName:           blueprint.projectIdentity?.appName ?? 'AppBase',
      primaryDomain:     domainAgentIds[0] ?? 'default',
      primaryTemplateName: blueprint.domainTemplates?.[0]?.name ?? 'General Application',
      features:          blueprint.features ?? [],
      dbModels:          (blueprint.dataModels ?? []).map((m: any) => m.name ?? m),
      apiModules:        (blueprint.apiModules ?? []).map((m: any) => m.name ?? m),
      userRoles:         primaryTemplate?.recommendedUserRoles?.slice(0, 4) ?? ['user', 'admin'],
      stack:             blueprint.technicalPlan?.stackRecommendation ?? {
        frontend: 'Next.js (React)', backend: 'NestJS (TypeScript)',
        database: 'PostgreSQL', cache: 'Redis', auth: 'JWT', hosting: 'Railway',
      },
    };
  }

  private selectParticipants(ctx: CouncilContext): string[] {
    return AGENT_PROFILES
      .filter((a) => a.alwaysActive || a.triggerDomains.some((d) => ctx.domainAgentIds.includes(d)))
      .map((a) => a.id);
  }

  // 16-02: Generate structured agent messages — safe public summaries only
  private generateMessages(ctx: CouncilContext, participants: string[]): CouncilMessage[] {
    const messages: CouncilMessage[] = [];
    let ts = Date.now();

    const add = (agentId: string, role: MessageRole, summary: string) => {
      const profile = AGENT_PROFILES.find((a) => a.id === agentId);
      if (!profile || !participants.includes(agentId)) return;
      messages.push({ agentId, agentName: profile.name, agentIcon: profile.icon, role, summary, timestamp: ts++ });
    };

    // ── Planner opens session ────────────────────────────────────────────────
    const featurePreview = ctx.features.slice(0, 3).join(', ') || 'core workflow';
    add('planner', 'PROPOSE',
      `Scope defined: ${ctx.primaryTemplateName} — ${ctx.domainAgentIds.length} domain(s) active. MVP feature set: ${featurePreview}.`);
    if (ctx.noCountryMentioned)
      add('planner', 'REQUEST_INPUT',
        'Target market not specified. Defaulting to GDPR-compliant data handling; localize after market selection.');

    // ── Architect proposes stack ─────────────────────────────────────────────
    const fe = ctx.stack['frontend'] ?? 'Next.js';
    const be = ctx.stack['backend'] ?? 'NestJS';
    const style = ctx.domainAgentIds.length > 1 ? 'Modular monolith' : 'Single-domain monolith';
    add('architect', 'PROPOSE',
      `Stack: ${fe} + ${be} + PostgreSQL + Redis. ${style} architecture — scalable to microservices post-launch.`);
    if (ctx.hasDelivery)
      add('architect', 'SUGGEST',
        'Real-time delivery requires a WebSocket layer. Recommend Redis pub/sub for fan-out to connected rider clients.');
    if (ctx.hasEnterprise)
      add('architect', 'OBJECT',
        'Enterprise multi-tenancy requires row-level security (RLS) in PostgreSQL and tenant-scoped JWT claims.');

    // ── Security reviews risks ───────────────────────────────────────────────
    const authScheme = ctx.stack['auth'] ?? 'JWT';
    add('security', 'PROPOSE',
      `Security baseline: ${authScheme} auth with refresh rotation, HTTPS enforced, rate limiting, input validation, CORS policy.`);
    if (ctx.hasPayment)
      add('security', 'OBJECT',
        'Payment flows require PCI-compliant integration. Raw card data must never touch application servers — use Stripe tokenization.');
    if (ctx.hasPrescription)
      add('security', 'OBJECT',
        'Health record uploads require HIPAA BAA with cloud provider, AES-256 encryption at rest, and tamper-evident audit logs.');
    if (ctx.hasMarketplace)
      add('security', 'SUGGEST',
        'Marketplace fraud vectors: fake sellers, review manipulation, account takeovers. Identity verification required at seller onboarding.');

    // ── Domain: Medical ──────────────────────────────────────────────────────
    if (participants.includes('medical')) {
      add('medical', 'PROPOSE',
        'Medical workflows scoped: appointment booking, patient records, provider verification. Telehealth video available if specified.');
      add('medical', 'OBJECT',
        'Platform cannot provide diagnosis, dosage guidance, or prescription advice — these are legally prohibited features.');
      if (ctx.hasPrescription)
        add('medical', 'APPROVE',
          'Prescription workflow acceptable ONLY with a licensed pharmacy verification step and explicit pharmacist approval.');
    }

    // ── Domain: Finance/Insurance ────────────────────────────────────────────
    if (participants.includes('finance')) {
      const model = ctx.hasMarketplace ? 'transaction-based commission' : ctx.hasSubscription ? 'recurring subscription billing' : 'usage-based billing';
      add('finance', 'PROPOSE',
        `Revenue model: ${model} with daily settlement. Payout scheduling and invoice generation required.`);
      add('finance', 'OBJECT',
        'All payment endpoints require idempotency keys. Without them, network retries cause double charges — a critical billing defect.');
      if (ctx.hasSubscription)
        add('finance', 'SUGGEST',
          'Subscription proration logic needed: mid-cycle plan upgrades and downgrades must recalculate billing fairly.');
    }

    // ── Domain: Legal/Compliance ─────────────────────────────────────────────
    if (participants.includes('legal')) {
      add('legal', 'PROPOSE',
        'Compliance checklist: GDPR/CCPA consent banner, Data Subject Request (DSR) workflow, policy versioning, data retention limits.');
      add('legal', 'OBJECT',
        'Cookie consent must precede non-essential cookie loading — this is a regulatory requirement, not optional UX design.');
      add('legal', 'APPROVE',
        'Compliance architecture approved. Legal counsel review required before public launch in any regulated market.');
    }

    // ── Domain: Marketplace/Ecommerce ───────────────────────────────────────
    if (participants.includes('marketplace')) {
      add('marketplace', 'PROPOSE',
        'Two-sided flow: buyer discovery + search/filter → seller onboarding → escrow checkout → delivery/fulfilment → two-way review.');
      add('marketplace', 'SUGGEST',
        'Identity verification and two-way review system are the trust foundations. Both buyers and sellers need accountability.');
      add('marketplace', 'OBJECT',
        'Listing moderation queue required — unmoderated listings risk prohibited items, fraud, and platform liability.');
    }

    // ── Domain: Logistics/Restaurant ────────────────────────────────────────
    if (participants.includes('logistics')) {
      add('logistics', 'PROPOSE',
        'Delivery flow: order placement → nearest-rider matching → real-time GPS tracking → delivery confirmation + proof of delivery.');
      add('logistics', 'SUGGEST',
        'Rider batching algorithm can combine multi-stop deliveries — improves unit economics and reduces average delivery time.');
      if (ctx.hasDelivery)
        add('logistics', 'OBJECT',
          'Geofencing required for delivery zone enforcement — orders outside zones must be rejected at placement, not at dispatch.');
    }

    // ── QA closes with edge cases ────────────────────────────────────────────
    if (participants.includes('qa')) {
      const cases = [
        'payment failure mid-checkout recovery',
        'session expiry during multi-step forms',
        'concurrent order conflicts during peak demand',
        ctx.hasMarketplace ? 'duplicate listing detection and deduplication' : null,
        ctx.hasDelivery    ? 'rider GPS signal loss during an active delivery' : null,
      ].filter(Boolean).slice(0, 3).join(', ');
      add('qa', 'SUGGEST', `Critical edge cases to test: ${cases}.`);
      add('qa', 'REQUEST_INPUT', 'Load targets and SLA requirements not specified. Define performance budget before infrastructure sizing.');
    }

    return messages;
  }

  // 16-05: Build risk matrix from context
  private buildRiskMatrix(ctx: CouncilContext): RiskItem[] {
    return RISK_RULES
      .filter((rule) => rule.condition(ctx))
      .map(({ category, level, description, mitigation }) => ({ category, level, description, mitigation }));
  }

  // 16-03: Resolve debate topics into decisions
  private resolveDecisions(ctx: CouncilContext, participants: string[]): CouncilDecision[] {
    return DEBATE_TOPICS
      .filter((topic) => topic.condition(ctx))
      .map((topic) => {
        const votes: Record<string, CouncilVote> = {};
        for (const [agentId, voteFn] of Object.entries(topic.participantVotes)) {
          if (participants.includes(agentId)) votes[agentId] = voteFn();
        }
        return {
          topic: topic.topic,
          outcome: topic.resolveOutcome(),
          rationale: topic.rationale(ctx),
          votes,
        };
      });
  }

  // 16-09: Determine build approval state
  private determineApproval(riskMatrix: RiskItem[], decisions: CouncilDecision[]): CouncilApprovalState {
    if (riskMatrix.some((r) => r.level === 'CRITICAL')) return 'BLOCKED';
    if (riskMatrix.some((r) => r.level === 'HIGH'))     return 'APPROVED_WITH_WARNINGS';
    if (decisions.some((d) => d.outcome === 'DEFERRED')) return 'NEEDS_INPUT';
    return 'APPROVED';
  }

  // 16-04: Synthesize FinalBuildPlan from all council outputs
  private synthesizeBuildPlan(
    ctx: CouncilContext,
    blueprint: any,
    riskMatrix: RiskItem[],
    decisions: CouncilDecision[],
    approvalState: CouncilApprovalState,
  ): FinalBuildPlan {
    const approvalNotes: string[] = [];
    if (riskMatrix.some((r) => r.level === 'CRITICAL'))    approvalNotes.push('CRITICAL risks identified — resolve before build proceeds.');
    if (ctx.isRegulated)                                    approvalNotes.push('Professional review required before public launch.');
    if (decisions.some((d) => d.outcome === 'DEFERRED'))   approvalNotes.push('Some features deferred to phase 2 — confirm scope with stakeholders.');
    if (decisions.some((d) => d.outcome === 'REJECTED'))   approvalNotes.push('Council has rejected prohibited features — these are excluded from build scope.');

    const scope = ctx.domainAgentIds.length > 2 ? 'Multi-domain' : ctx.domainAgentIds.length === 2 ? 'Dual-domain' : 'Single-domain';
    const host = ctx.stack['hosting'] ?? 'Railway';

    return {
      architecture: `${scope} NestJS monolith — ${ctx.stack['frontend'] ?? 'Next.js'} frontend, PostgreSQL + Redis, ${host} hosting.`,
      dbModels:   ctx.dbModels,
      apiModules: ctx.apiModules,
      userRoles:  ctx.userRoles,
      workflows:  (blueprint.uiFlows ?? []).map((f: any) => f.name ?? String(f)),
      security: [
        ...(blueprint.security ?? []),
        ...riskMatrix.map((r) => r.mitigation),
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8),
      compliance: blueprint.compliance ?? [],
      branding: {
        appName:      blueprint.branding?.appName       ?? ctx.appName,
        primaryColor: blueprint.branding?.primaryColor  ?? '#6366F1',
        headline:     blueprint.branding?.landingHeadline ?? `${ctx.appName} — Built for you.`,
        ctaCopy:      blueprint.branding?.ctaCopy       ?? 'Get started →',
      },
      rolloutPriority: [
        'Phase 1 (MVP): ' + (ctx.features.slice(0, 3).join(', ') || 'core features'),
        'Phase 2: ' + ((blueprint.customerDemand?.futureFeatures ?? []).slice(0, 2).join(', ') || 'analytics, reporting'),
        'Phase 3: Internationalization, enterprise features, public API',
      ],
      riskMatrix,
      approvalState,
      approvalNotes,
    };
  }

  // 16-08: Build and persist session memory
  private buildMemory(sessionId: string, ctx: CouncilContext, decisions: CouncilDecision[], blueprint: any): CouncilMemory {
    return {
      sessionId,
      acceptedConstraints: decisions.filter((d) => d.outcome === 'ACCEPTED').map((d) => d.topic),
      rejectedFeatures:    decisions.filter((d) => d.outcome === 'REJECTED').map((d) => d.topic),
      brandingDirection:   blueprint.branding?.logoIdea ?? 'Domain-matched brand direction',
      userPreferences: {
        appName:    ctx.appName,
        domain:     ctx.primaryDomain,
        hasPayment: ctx.hasPayment  ? 'yes' : 'no',
        hasMobile:  ctx.hasMobile   ? 'yes' : 'no',
        regulated:  ctx.isRegulated ? 'yes' : 'no',
      },
      previousDecisions: decisions,
    };
  }
}

export { VALID_ROLES };
