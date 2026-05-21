import { Injectable } from '@nestjs/common';
import { AGENT_REGISTRY, type AgentDefinition, type AgentCategory } from './agent-registry';

// 12-05: A matched domain agent with reason
export interface SelectedAgent {
  id: string;
  name: string;
  category: AgentCategory;
  kind: 'CORE' | 'DOMAIN' | 'REGULATED';
  reason: string;
}

// 12-05: Regulated warning for guarded-mode agents
export interface RegulatedWarning {
  agentId: string;
  agentName: string;
  category: AgentCategory;
  warning: string;
  disclaimer: string;
}

// 12-05: Full preview-selection response
export interface AgentSelectionResult {
  coreAgents: SelectedAgent[];
  domainAgents: SelectedAgent[];
  regulatedWarnings: RegulatedWarning[];
  reasons: Array<{ agentId: string; reason: string }>;
}

// Keyword rules: map domain agent IDs to trigger keywords (lowercase)
type KeywordRule = { keywords: string[]; reason: string };

const DOMAIN_KEYWORD_RULES: Record<string, KeywordRule> = {
  'legal-compliance': {
    keywords: ['legal', 'law', 'lawyer', 'attorney', 'contract', 'gdpr', 'ccpa', 'compliance', 'terms of service', 'privacy policy', 'lawsuit', 'litigation', 'court', 'regulation', 'regulatory'],
    reason: 'Detected legal/compliance domain keywords',
  },
  'finance': {
    keywords: ['finance', 'financial', 'accounting', 'invoice', 'invoicing', 'payroll', 'budget', 'expense', 'revenue', 'profit', 'loss', 'p&l', 'bookkeeping', 'ledger', 'fintech', 'banking', 'bank', 'payment', 'billing'],
    reason: 'Detected finance/accounting domain keywords',
  },
  'medical': {
    keywords: ['medical', 'health', 'healthcare', 'doctor', 'patient', 'hospital', 'clinic', 'diagnosis', 'medicine', 'pharmacy', 'ehr', 'emr', 'hipaa', 'fhir', 'telemedicine', 'appointment', 'symptom', 'treatment', 'prescription'],
    reason: 'Detected medical/healthcare domain keywords',
  },
  'insurance': {
    keywords: ['insurance', 'insure', 'claim', 'policy', 'coverage', 'premium', 'underwriting', 'actuary', 'deductible', 'copay'],
    reason: 'Detected insurance domain keywords',
  },
  'real-estate': {
    keywords: ['real estate', 'property', 'rental', 'rent', 'listing', 'mortgage', 'realtor', 'mls', 'lease', 'tenant', 'landlord', 'apartment', 'house', 'condo', 'airbnb', 'vacation rental', 'short term rental', 'property management'],
    reason: 'Detected real estate domain keywords',
  },
  'education': {
    keywords: ['education', 'learning', 'course', 'student', 'teacher', 'tutor', 'quiz', 'lms', 'curriculum', 'lesson', 'class', 'school', 'university', 'training', 'certification', 'skill', 'online learning', 'e-learning'],
    reason: 'Detected education/learning domain keywords',
  },
  'hr-recruiting': {
    keywords: ['hr', 'human resources', 'recruiting', 'hiring', 'employee', 'job board', 'job listing', 'resume', 'applicant', 'talent', 'onboarding', 'payroll', 'staffing', 'workforce', 'ats'],
    reason: 'Detected HR/recruiting domain keywords',
  },
  'cybersecurity': {
    keywords: ['cybersecurity', 'cyber security', 'siem', 'threat', 'vulnerability', 'penetration', 'pentest', 'firewall', 'soc', 'incident response', 'threat detection', 'security audit'],
    reason: 'Detected cybersecurity domain keywords',
  },
  'ecommerce': {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'product catalog', 'shopping cart', 'checkout', 'inventory', 'shopify', 'woocommerce', 'buy', 'sell', 'order', 'fulfillment', 'retail'],
    reason: 'Detected e-commerce domain keywords',
  },
  'restaurant': {
    keywords: ['restaurant', 'food', 'menu', 'ordering', 'delivery', 'takeout', 'kitchen', 'chef', 'dining', 'reservation', 'table booking', 'pos', 'food ordering', 'cafe', 'bar'],
    reason: 'Detected restaurant/food domain keywords',
  },
  'marketplace': {
    keywords: ['marketplace', 'platform', 'seller', 'buyer', 'listing', 'peer-to-peer', 'p2p', 'multi-vendor', 'auction', 'escrow', 'gig economy', 'freelance'],
    reason: 'Detected marketplace/platform domain keywords',
  },
  'logistics': {
    keywords: ['logistics', 'delivery', 'shipping', 'tracking', 'warehouse', 'supply chain', 'courier', 'fleet', 'dispatch', 'route', 'cargo', 'freight'],
    reason: 'Detected logistics/delivery domain keywords',
  },
  'travel': {
    keywords: ['travel', 'booking', 'hotel', 'flight', 'trip', 'vacation', 'itinerary', 'reservation', 'airbnb', 'trip planning', 'tour', 'tour guide', 'tourism'],
    reason: 'Detected travel/booking domain keywords',
  },
  'fitness': {
    keywords: ['fitness', 'gym', 'workout', 'wellness', 'nutrition', 'trainer', 'exercise', 'calories', 'steps', 'running', 'yoga', 'pilates', 'health tracker', 'wearable'],
    reason: 'Detected fitness/wellness domain keywords',
  },
  'government': {
    keywords: ['government', 'permit', 'license', 'citizen', 'public service', 'e-government', 'form', 'application form', 'municipality', 'civic', 'official'],
    reason: 'Detected government/civic domain keywords',
  },
  'nonprofit': {
    keywords: ['nonprofit', 'non-profit', 'donation', 'charity', 'volunteer', 'fundraising', 'ngo', 'cause', 'philanthropy', 'campaign'],
    reason: 'Detected nonprofit/donation domain keywords',
  },
  'creator-media': {
    keywords: ['creator', 'media', 'content', 'video', 'podcast', 'streaming', 'blog', 'newsletter', 'subscription', 'paywall', 'patreon', 'substack', 'youtube', 'influencer'],
    reason: 'Detected creator/media domain keywords',
  },
  'events': {
    keywords: ['event', 'ticket', 'ticketing', 'concert', 'conference', 'venue', 'show', 'performance', 'attendee', 'rsvp', 'calendar', 'schedule'],
    reason: 'Detected event/ticketing domain keywords',
  },
  'crm-sales': {
    keywords: ['crm', 'sales', 'lead', 'pipeline', 'deal', 'prospect', 'contact management', 'sales force', 'hubspot', 'salesforce', 'customer relationship', 'funnel'],
    reason: 'Detected CRM/sales domain keywords',
  },
  'customer-support': {
    keywords: ['support', 'helpdesk', 'help desk', 'ticket', 'customer service', 'chatbot', 'faq', 'knowledge base', 'live chat', 'sla', 'zendesk'],
    reason: 'Detected customer support domain keywords',
  },
  'data-analytics': {
    keywords: ['analytics', 'dashboard', 'data', 'visualization', 'reporting', 'bi', 'business intelligence', 'metrics', 'kpi', 'insights', 'chart', 'graph'],
    reason: 'Detected data/analytics domain keywords',
  },
  'automation': {
    keywords: ['automation', 'webhook', 'workflow', 'trigger', 'zapier', 'make', 'n8n', 'integration', 'api gateway', 'bot', 'scheduled', 'cron'],
    reason: 'Detected automation/webhook domain keywords',
  },
  'mobile-app': {
    keywords: ['mobile app', 'ios', 'android', 'react native', 'flutter', 'pwa', 'push notification', 'app store', 'native app'],
    reason: 'Detected mobile app domain keywords',
  },
  'gaming': {
    keywords: ['game', 'gaming', 'leaderboard', 'achievement', 'multiplayer', 'level', 'score', 'player', 'quest', 'rpg', 'puzzle', 'arcade'],
    reason: 'Detected gaming domain keywords',
  },
  'localization': {
    keywords: ['localization', 'i18n', 'internationalization', 'translation', 'multi-language', 'multilingual', 'rtl', 'locale', 'language', 'currency conversion', 'region'],
    reason: 'Detected localization/i18n domain keywords',
  },
};

// 12-02: Regulated guard messages per domain
const REGULATED_GUARD_MESSAGES: Partial<Record<string, { warning: string; disclaimer: string }>> = {
  'legal-compliance': {
    warning: 'This app touches legal compliance domains. The Legal Compliance agent builds app workflows, consent flows, and compliance checklists only. It will NOT provide legal advice or legal conclusions.',
    disclaimer: 'Not legal advice. Consult a qualified attorney for legal decisions.',
  },
  'finance': {
    warning: 'This app touches finance/accounting domains. The Finance agent builds invoicing, expense, and dashboard UIs only. It will NOT provide investment, tax, or financial advice.',
    disclaimer: 'Not financial or investment advice. Consult a qualified financial advisor for financial decisions.',
  },
  'medical': {
    warning: 'This app touches healthcare domains. The Medical agent builds patient portals, booking UIs, and HIPAA scaffolding only. It will NOT provide diagnosis, medical advice, or treatment recommendations.',
    disclaimer: 'Not medical advice. Consult a licensed healthcare provider for medical decisions.',
  },
  'insurance': {
    warning: 'This app touches insurance domains. The Insurance agent builds policy UIs and claims workflows only. It will NOT provide coverage recommendations or underwriting decisions.',
    disclaimer: 'Not insurance advice. Consult a licensed insurance broker for coverage decisions.',
  },
  'real-estate': {
    warning: 'This app touches real estate domains. The Real Estate agent builds listing UIs and property portals only. It will NOT provide property valuation advice or investment recommendations.',
    disclaimer: 'Not real estate advice. Consult a licensed real estate professional for property decisions.',
  },
};

@Injectable()
export class AgentClassifierService {
  // 12-05: Classify a prompt and return agent selection
  classify(prompt: string): AgentSelectionResult {
    const lower = prompt.toLowerCase();

    // Core agents are always selected
    const coreAgents: SelectedAgent[] = AGENT_REGISTRY
      .filter((a) => a.kind === 'CORE')
      .map((a) => ({ id: a.id, name: a.name, category: a.category, kind: a.kind, reason: 'Always included' }));

    const domainAgents: SelectedAgent[] = [];
    const regulatedWarnings: RegulatedWarning[] = [];
    const reasons: Array<{ agentId: string; reason: string }> = [];

    // Match domain agents by keywords
    for (const agent of AGENT_REGISTRY.filter((a) => a.kind !== 'CORE')) {
      const rule = DOMAIN_KEYWORD_RULES[agent.id];
      if (!rule) continue;

      const matched = rule.keywords.some((kw) => lower.includes(kw));
      if (!matched) continue;

      domainAgents.push({
        id: agent.id,
        name: agent.name,
        category: agent.category,
        kind: agent.kind,
        reason: rule.reason,
      });
      reasons.push({ agentId: agent.id, reason: rule.reason });

      if (agent.kind === 'REGULATED') {
        const guard = REGULATED_GUARD_MESSAGES[agent.id];
        if (guard) {
          regulatedWarnings.push({
            agentId: agent.id,
            agentName: agent.name,
            category: agent.category,
            warning: guard.warning,
            disclaimer: guard.disclaimer,
          });
        }
      }
    }

    return { coreAgents, domainAgents, regulatedWarnings, reasons };
  }

  // Public-safe agent object — strips prohibitedOutputs from external responses
  toPublicAgent(agent: AgentDefinition): Record<string, unknown> {
    return {
      id: agent.id,
      name: agent.name,
      category: agent.category,
      kind: agent.kind,
      description: agent.description,
      capabilities: agent.capabilities,
      requiredDisclaimers: agent.requiredDisclaimers,
      defaultEnabled: agent.defaultEnabled,
      riskLevel: agent.riskLevel,
      // prohibitedOutputs intentionally omitted from public API
    };
  }
}
