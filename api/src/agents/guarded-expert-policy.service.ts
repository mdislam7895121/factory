import { Injectable } from '@nestjs/common';

// 14-01: Policy categories for regulated expert agents
export type PolicyCategory = 'LEGAL' | 'MEDICAL' | 'FINANCE' | 'TAX' | 'INSURANCE' | 'REAL_ESTATE';

// 14-03: Public guard result contract — no internal chain-of-thought
export interface GuardResult {
  allowed: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimers: string[];
  blockedScopes: string[];
  allowedScopes: string[];
  safeRewrite: string;
  requiresProfessionalReview: boolean;
}

interface ProhibitedRule {
  pattern: RegExp;
  reason: string;
  category: PolicyCategory;
}

interface PolicyConfig {
  categories: PolicyCategory[];
  agentName: string;
  disclaimer: string;
  allowedScopes: string[];
  blockedScopes: string[];
}

// 14-02: Prohibited intent patterns per policy category
const PROHIBITED_INTENT_RULES: ProhibitedRule[] = [
  // LEGAL
  { pattern: /is this (legal|enforceable|binding|valid)\??/i,          reason: 'legal conclusion',                          category: 'LEGAL' },
  { pattern: /\b(is|are) (this|these) contracts? enforceable\b/i,      reason: 'contract enforceability conclusion',        category: 'LEGAL' },
  { pattern: /\bcan (i|we|they|someone) (sue|be sued|litigate)\b/i,    reason: 'lawsuit strategy',                          category: 'LEGAL' },
  { pattern: /\bgive (me|us) legal advice\b/i,                         reason: 'legal advice request',                      category: 'LEGAL' },
  { pattern: /\b(what are|tell me) my legal (rights|obligations)\b/i,  reason: 'jurisdiction-specific legal advice',        category: 'LEGAL' },
  { pattern: /\blegal conclusion\b/i,                                  reason: 'legal conclusion',                          category: 'LEGAL' },

  // MEDICAL
  { pattern: /\bdiagnos(e|is|tic|ed|es)\b/i,                          reason: 'diagnosis',                                 category: 'MEDICAL' },
  { pattern: /\brecommend (treatment|medication|drugs?)\b/i,           reason: 'treatment recommendation',                  category: 'MEDICAL' },
  { pattern: /\b(dosage|dose|dosing)\b/i,                              reason: 'dosage instruction',                        category: 'MEDICAL' },
  { pattern: /\bemergency triage\b/i,                                  reason: 'emergency triage',                          category: 'MEDICAL' },
  { pattern: /\b(prescribe|prescription decision)\b/i,                 reason: 'prescription decision',                     category: 'MEDICAL' },
  { pattern: /\bwhat (disease|condition|illness) (do|does) (i|they|he|she|the patient) have\b/i, reason: 'diagnosis', category: 'MEDICAL' },

  // FINANCE
  { pattern: /\bwhich (stocks?|shares?|etf|crypto|coins?) should (i|we) (buy|sell|invest)\b/i, reason: 'investment recommendation', category: 'FINANCE' },
  { pattern: /\b(give|provide) investment (advice|recommendation)\b/i, reason: 'investment recommendation',                 category: 'FINANCE' },
  { pattern: /\bshould (i|we) invest\b/i,                              reason: 'investment recommendation',                 category: 'FINANCE' },
  { pattern: /\bfinancial guarantee\b/i,                               reason: 'financial guarantee',                       category: 'FINANCE' },
  { pattern: /\bpersonalized trading advice\b/i,                       reason: 'personalized trading advice',               category: 'FINANCE' },

  // TAX
  { pattern: /\b(exact )?tax (liability|amount)\b/i,                   reason: 'exact tax liability claim',                 category: 'TAX' },
  { pattern: /\b(tax filing|file (my|our|the) taxes)\b/i,              reason: 'tax filing decision',                       category: 'TAX' },
  { pattern: /\btax advice\b/i,                                        reason: 'tax advice',                                category: 'TAX' },

  // INSURANCE
  { pattern: /\bwill my claim be approved\b/i,                         reason: 'claim approval prediction',                 category: 'INSURANCE' },
  { pattern: /\bcoverage determination\b/i,                            reason: 'coverage determination',                    category: 'INSURANCE' },
  { pattern: /\b(which|what) (insurance )?policy should (i|we) (buy|get|choose)\b/i, reason: 'policy recommendation as licensed advice', category: 'INSURANCE' },

  // REAL_ESTATE
  { pattern: /\bcan (i|we) evict\b/i,                                  reason: 'jurisdiction-specific landlord/tenant legal advice', category: 'REAL_ESTATE' },
  { pattern: /\b(legal title|title conclusion)\b/i,                    reason: 'legal title conclusion',                    category: 'REAL_ESTATE' },
  { pattern: /\b(should|can) (i|we) (approve|deny) (the|a) mortgage\b/i, reason: 'mortgage/financing decision',           category: 'REAL_ESTATE' },
];

// App-building context signals — presence means user is building a product, not seeking personal advice
const APP_CONTEXT_SIGNALS = [
  'build', 'create', 'develop', 'make', 'design', 'app', 'platform',
  'system', 'tool', 'software', 'service', 'website', 'portal',
  'saas', 'dashboard', 'generator', 'tracker', 'manager', 'workflow',
  'application', 'product', 'solution', 'feature', 'module',
];

// 14-02: Allowed + blocked scope definitions per regulated agent
const AGENT_POLICY: Record<string, PolicyConfig> = {
  'legal-compliance': {
    categories: ['LEGAL'],
    agentName: 'Legal Compliance',
    disclaimer: 'Not legal advice. Consult a qualified attorney for legal decisions.',
    allowedScopes: [
      'App workflow design for compliance processes',
      'Intake form and consent flow design',
      'Compliance checklist generation',
      'General educational information on regulations',
      'Legal page templates (terms of service, privacy policy)',
      'Recommending professional legal review',
    ],
    blockedScopes: [
      'Legal conclusions or opinions',
      'Contract enforceability determinations',
      'Lawsuit strategy or litigation advice',
      'Jurisdiction-specific legal advice',
      'Licensed legal advice of any kind',
    ],
  },
  'finance': {
    categories: ['FINANCE', 'TAX'],
    agentName: 'Finance',
    disclaimer: 'Not financial or investment advice. Consult a qualified financial advisor for financial decisions.',
    allowedScopes: [
      'Invoicing and billing UI design',
      'Expense tracking workflow design',
      'Financial dashboard and reporting scaffolding',
      'Payment integration patterns (Stripe, PayPal)',
      'General educational information on accounting concepts',
    ],
    blockedScopes: [
      'Investment recommendations',
      'Personalized trading advice',
      'Tax filing decisions',
      'Exact tax liability calculations',
      'Financial guarantees',
      'Licensed financial or investment advice',
    ],
  },
  'medical': {
    categories: ['MEDICAL'],
    agentName: 'Medical/Healthcare',
    disclaimer: 'Not medical advice. Consult a licensed healthcare provider for medical decisions.',
    allowedScopes: [
      'Patient portal and appointment booking UI',
      'HIPAA compliance scaffolding and checklists',
      'Healthcare workflow design (intake, scheduling, records)',
      'General educational information on healthcare regulations',
      'EHR/EMR integration patterns',
    ],
    blockedScopes: [
      'Medical diagnosis',
      'Treatment recommendations',
      'Dosage or prescription guidance',
      'Emergency triage guidance',
      'Prescription decisions',
      'Licensed medical advice of any kind',
    ],
  },
  'insurance': {
    categories: ['INSURANCE'],
    agentName: 'Insurance',
    disclaimer: 'Not insurance advice. Consult a licensed insurance broker for coverage decisions.',
    allowedScopes: [
      'Insurance claim workflow and intake form design',
      'Policy management UI scaffolding',
      'Claims tracking dashboard design',
      'General educational information on insurance processes',
    ],
    blockedScopes: [
      'Coverage determination or approval predictions',
      'Claim approval likelihood assessments',
      'Policy recommendations as licensed advice',
      'Underwriting decisions',
    ],
  },
  'real-estate': {
    categories: ['REAL_ESTATE'],
    agentName: 'Real Estate',
    disclaimer: 'Not real estate advice. Consult a licensed real estate professional for property decisions.',
    allowedScopes: [
      'Property listing and search UI design',
      'Rental management workflow design',
      'Tenant/landlord portal scaffolding',
      'Property data API integration patterns',
      'General educational information on real estate processes',
    ],
    blockedScopes: [
      'Legal title conclusions',
      'Eviction legal advice',
      'Mortgage/financing decisions',
      'Property valuation advice',
      'Jurisdiction-specific landlord/tenant legal advice',
    ],
  },
};

// 14-02: Safe rewrite suggestions per category when prohibited content is detected
const SAFE_REWRITE_TEMPLATES: Record<PolicyCategory, string> = {
  LEGAL:       'Build a contract management and legal compliance workflow app with document intake forms and compliance checklists.',
  MEDICAL:     'Build a patient appointment booking and healthcare intake portal with HIPAA-compliant workflows.',
  FINANCE:     'Build a financial dashboard and invoice management app with expense tracking and reporting.',
  TAX:         'Build a tax document collection and workflow management app.',
  INSURANCE:   'Build an insurance claim submission and tracking portal with workflow automation.',
  REAL_ESTATE: 'Build a property listing and rental management platform with tenant intake forms.',
};

// 14-06: Patterns to redact from build-time summaries and public activity
const OUTPUT_REDACTION_RULES: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bdiagnos(e|is|tic|ed)\s+[^.!?]*[.!?]/gi,                             replacement: '[diagnosis omitted — not medical advice]' },
  { pattern: /\btreatment recommendation[^.!?]*[.!?]/gi,                             replacement: '[treatment recommendation omitted]' },
  { pattern: /\b(dosage|dose)\s+[^.!?]*[.!?]/gi,                                    replacement: '[dosage information omitted]' },
  { pattern: /\b(this contract|this agreement) is (enforceable|binding|valid)[^.!?]*[.!?]/gi, replacement: '[legal conclusion omitted]' },
  { pattern: /\byou should (buy|sell|invest in)\s+[^.!?]*[.!?]/gi,                  replacement: '[investment advice omitted]' },
  { pattern: /\byour (tax liability|taxes owed) (is|are)\s+[^.!?]*[.!?]/gi,         replacement: '[tax advice omitted]' },
  { pattern: /\byour claim will (be approved|not be approved)[^.!?]*[.!?]/gi,       replacement: '[coverage determination omitted]' },
];

@Injectable()
export class GuardedExpertPolicyService {
  // 14-01 / 14-03: Evaluate a prompt against regulated agent policy rules
  guard(agentIds: string[], prompt: string, _context?: string): GuardResult {
    const policies = agentIds.map((id) => AGENT_POLICY[id]).filter(Boolean);

    if (policies.length === 0) {
      return {
        allowed: true,
        riskLevel: 'LOW',
        disclaimers: [],
        blockedScopes: [],
        allowedScopes: [],
        safeRewrite: '',
        requiresProfessionalReview: false,
      };
    }

    const activeCategories = new Set<PolicyCategory>(policies.flatMap((p) => p.categories));

    // Detect prohibited intent in the prompt
    const matchedReasons: string[] = [];
    const matchedCategories = new Set<PolicyCategory>();
    for (const rule of PROHIBITED_INTENT_RULES) {
      if (activeCategories.has(rule.category) && rule.pattern.test(prompt)) {
        if (!matchedReasons.includes(rule.reason)) matchedReasons.push(rule.reason);
        matchedCategories.add(rule.category);
      }
    }

    const hasProhibitedContent = matchedReasons.length > 0;
    const hasAppContext = APP_CONTEXT_SIGNALS.some((s) => prompt.toLowerCase().includes(s));

    // Allowed if no prohibited content, or if building an app (even if prompt also has unsafe intent)
    const allowed = !hasProhibitedContent || hasAppContext;

    // Safe rewrite suggestion when prohibited content detected
    let safeRewrite = '';
    if (hasProhibitedContent) {
      const firstCategory = [...matchedCategories][0];
      safeRewrite = SAFE_REWRITE_TEMPLATES[firstCategory] ?? '';
    }

    return {
      allowed,
      riskLevel: 'HIGH',
      disclaimers:   policies.map((p) => p.disclaimer),
      blockedScopes: [...new Set(policies.flatMap((p) => p.blockedScopes))],
      allowedScopes: [...new Set(policies.flatMap((p) => p.allowedScopes))],
      safeRewrite,
      requiresProfessionalReview: true,
    };
  }

  // 14-06: Strip professional-advice conclusions from build summaries / public activity
  sanitizePublicOutput(text: string): string {
    let safe = text;
    for (const rule of OUTPUT_REDACTION_RULES) {
      safe = safe.replace(rule.pattern, rule.replacement);
    }
    return safe.trim();
  }
}
