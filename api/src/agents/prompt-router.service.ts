import { Injectable } from '@nestjs/common';
import {
  AgentClassifierService,
  REGULATED_GUARD_MESSAGES,
  type RegulatedWarning,
  type SelectedAgent,
} from './agent-classifier.service';
import { getAgent, type AgentCategory } from './agent-registry';

// 13-03: Full routing result contract
export interface RoutingResult {
  coreAgents: SelectedAgent[];
  domainAgents: SelectedAgent[];
  regulatedWarnings: RegulatedWarning[];
  reasonSummaries: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedTemplate: string;
  nextActions: string[];
}

// 13-02: Co-routing rules — when agent X is matched, automatically include agents Y[]
// Only adds non-duplicate agents; regulated co-routes trigger their own guard warnings.
const CO_ROUTING: Record<string, string[]> = {
  'medical':       ['legal-compliance'],             // healthcare → legal compliance required
  'finance':       ['legal-compliance'],             // fintech → legal compliance required
  'insurance':     ['legal-compliance', 'finance'],  // insurance → legal + finance
  'real-estate':   ['legal-compliance', 'finance'],  // property → legal + finance
  'marketplace':   ['finance', 'legal-compliance'],  // multi-vendor → finance + legal
  'restaurant':    ['logistics'],                    // food ordering → logistics
  'government':    ['legal-compliance'],             // civic apps → legal compliance
  'ecommerce':     ['customer-support'],             // shop → support (not regulated finance)
  'hr-recruiting': [],
  'cybersecurity': [],
  'travel':        ['ecommerce'],                    // booking → ecommerce patterns
  'logistics':     [],
  'fitness':       [],
  'education':     [],
  'nonprofit':     [],
  'events':        ['ecommerce'],                    // ticketing → ecommerce patterns
  'crm-sales':     ['customer-support'],             // CRM → support workflows
  'creator-media': [],
  'data-analytics': [],
  'automation':    [],
  'mobile-app':    [],
  'gaming':        [],
  'localization':  [],
};

// 13-01: Template suggestions by primary domain
const TEMPLATE_MAP: Record<string, string> = {
  'medical':           'healthcare-portal',
  'finance':           'fintech-saas',
  'insurance':         'insurance-portal',
  'real-estate':       'property-listing-platform',
  'ecommerce':         'ecommerce-store',
  'marketplace':       'two-sided-marketplace',
  'restaurant':        'food-ordering-app',
  'education':         'learning-management-system',
  'hr-recruiting':     'job-board',
  'crm-sales':         'crm-platform',
  'data-analytics':    'analytics-dashboard',
  'travel':            'travel-booking-platform',
  'logistics':         'logistics-tracker',
  'events':            'event-ticketing-platform',
  'fitness':           'fitness-wellness-app',
  'gaming':            'game-platform',
  'nonprofit':         'donation-platform',
  'government':        'citizen-portal',
  'creator-media':     'creator-platform',
  'customer-support':  'helpdesk-platform',
  'cybersecurity':     'security-dashboard',
  'automation':        'workflow-automation',
  'mobile-app':        'mobile-app-starter',
  'localization':      'multilingual-app',
  'legal-compliance':  'compliance-toolkit',
};

// 13-01 / 13-05: Domain-specific next actions
const DOMAIN_NEXT_ACTIONS: Partial<Record<string, string>> = {
  'medical':          'Verify HIPAA compliance checklist before launch',
  'finance':          'Configure payment processor (Stripe/Plaid) and billing flows',
  'insurance':        'Review regulatory filing requirements for your jurisdiction',
  'real-estate':      'Integrate property data APIs and verify MLS data usage terms',
  'legal-compliance': 'Add required legal pages (terms, privacy policy, cookie consent)',
  'ecommerce':        'Set up inventory management, order tracking, and fulfillment',
  'marketplace':      'Configure escrow, commission splits, and seller verification',
  'restaurant':       'Configure delivery zones, kitchen display, and POS integration',
  'education':        'Set up course content management and student progress tracking',
  'hr-recruiting':    'Configure applicant tracking workflow and offer letter templates',
  'cybersecurity':    'Enable SIEM integration and incident response runbook',
  'data-analytics':   'Define KPI schema and connect data sources before launch',
  'logistics':        'Integrate shipping APIs (FedEx/UPS/DHL) and tracking webhooks',
  'travel':           'Connect travel inventory APIs and calendar availability logic',
  'events':           'Set up ticket tier pricing, capacity limits, and QR check-in',
  'gaming':           'Configure leaderboard persistence and anti-cheat measures',
  'nonprofit':        'Set up donation processor (Stripe/PayPal) and tax receipt flows',
  'government':       'Verify accessibility (WCAG 2.1 AA) and e-signature requirements',
};

@Injectable()
export class PromptRouterService {
  constructor(private readonly classifier: AgentClassifierService) {}

  // 13-01 / 13-03: Full agent routing from a prompt
  route(prompt: string): RoutingResult {
    // Step 1: Base keyword classification (SERIAL 12)
    const base = this.classifier.classify(prompt);

    // Step 2: Apply co-routing rules (13-02)
    const existingIds = new Set(base.domainAgents.map((a) => a.id));
    const coRoutedAgents: SelectedAgent[] = [];
    const coRoutedWarnings: RegulatedWarning[] = [];

    for (const da of base.domainAgents) {
      const coIds = CO_ROUTING[da.id] ?? [];
      for (const coId of coIds) {
        if (existingIds.has(coId)) continue;
        existingIds.add(coId);

        const agent = getAgent(coId);
        if (!agent) continue;

        coRoutedAgents.push({
          id: agent.id,
          name: agent.name,
          category: agent.category as AgentCategory,
          kind: agent.kind,
          reason: `Auto-included: ${da.name} domain requires ${agent.name}`,
        });

        // 13-05: Guarded routing — add regulated warning for co-routed regulated agents
        if (agent.kind === 'REGULATED') {
          const alreadyWarned = base.regulatedWarnings.some((w) => w.agentId === agent.id);
          if (!alreadyWarned) {
            const guard = REGULATED_GUARD_MESSAGES[agent.id];
            if (guard) {
              coRoutedWarnings.push({
                agentId: agent.id,
                agentName: agent.name,
                category: agent.category as AgentCategory,
                warning: guard.warning,
                disclaimer: guard.disclaimer,
              });
            }
          }
        }
      }
    }

    const allDomainAgents = [...base.domainAgents, ...coRoutedAgents];
    const allWarnings = [...base.regulatedWarnings, ...coRoutedWarnings];

    // Step 3: Aggregate risk level (13-01)
    const hasRegulated = allDomainAgents.some((a) => a.kind === 'REGULATED');
    const hasMediumRisk =
      !hasRegulated &&
      (allDomainAgents.some((a) => ['cybersecurity', 'government'].includes(a.id)) ||
        allDomainAgents.length >= 3);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = hasRegulated ? 'HIGH' : hasMediumRisk ? 'MEDIUM' : 'LOW';

    // Step 4: Suggested template — regulated agents define the core domain (13-01)
    // Priority: (1) directly-matched regulated agent, (2) directly-matched domain agent,
    //           (3) any agent, (4) fallback to generic
    const directIds = new Set(base.domainAgents.map((a) => a.id));
    const primaryRegulated = base.domainAgents.find((a) => a.kind === 'REGULATED');
    const primaryDirect = base.domainAgents.find((a) => a.kind !== 'REGULATED' && directIds.has(a.id));
    const primaryId = (primaryRegulated ?? primaryDirect ?? allDomainAgents[0])?.id ?? '';
    const suggestedTemplate = TEMPLATE_MAP[primaryId] ?? 'full-stack-saas';

    // Step 5: Next actions (13-01 / 13-05)
    const nextActions = this.buildNextActions(riskLevel, allDomainAgents, allWarnings);

    // Step 6: Human-readable reason summaries (13-03 — no chain-of-thought)
    const reasonSummaries = [
      ...base.reasons.map((r) => r.reason),
      ...coRoutedAgents.map((a) => a.reason),
    ];

    return {
      coreAgents: base.coreAgents,
      domainAgents: allDomainAgents,
      regulatedWarnings: allWarnings,
      reasonSummaries,
      riskLevel,
      suggestedTemplate,
      nextActions,
    };
  }

  // 13-01: Build actionable next-step list — public-safe, no licensed advice
  private buildNextActions(
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    domainAgents: SelectedAgent[],
    warnings: RegulatedWarning[],
  ): string[] {
    const actions: string[] = [];
    const domainIds = new Set(domainAgents.map((a) => a.id));

    if (riskLevel === 'HIGH') {
      actions.push('Review regulated domain compliance requirements before public launch');
      actions.push('Add required legal pages: terms of service, privacy policy, cookie consent');
      actions.push('Enable security audit logging (SERIAL 10 SecurityAuditService)');
    } else if (riskLevel === 'MEDIUM') {
      actions.push('Review security configuration for sensitive data flows');
      actions.push('Enable rate limiting on all public API endpoints');
    }

    // Domain-specific actions
    for (const id of domainIds) {
      const action = DOMAIN_NEXT_ACTIONS[id];
      if (action) actions.push(action);
    }

    // Warn about regulated agent scope limits (13-05)
    if (warnings.length > 0) {
      actions.push('Regulated agents operate in workflow/scaffolding mode only — see disclaimers');
    }

    // Always-present
    actions.push('Configure environment variables (DATABASE_URL, REDIS_URL, ADMIN_API_KEY)');
    actions.push('Enable monitoring and error tracking before launch');

    return actions;
  }
}
