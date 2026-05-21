// 12-03: Agent metadata contract

export type AgentCategory =
  | 'BUILDER'
  | 'LEGAL'
  | 'FINANCE'
  | 'MEDICAL'
  | 'INSURANCE'
  | 'REAL_ESTATE'
  | 'EDUCATION'
  | 'HR'
  | 'CYBERSECURITY'
  | 'ECOMMERCE'
  | 'FOOD'
  | 'MARKETPLACE'
  | 'LOGISTICS'
  | 'TRAVEL'
  | 'FITNESS'
  | 'GOVERNMENT'
  | 'NONPROFIT'
  | 'MEDIA'
  | 'EVENTS'
  | 'CRM'
  | 'SUPPORT'
  | 'DATA'
  | 'AUTOMATION'
  | 'MOBILE'
  | 'GAMING'
  | 'LOCALIZATION';

// 'CORE': always-on builder agents; 'DOMAIN': opt-in domain specialists; 'REGULATED': domain + compliance guard
export type AgentKind = 'CORE' | 'DOMAIN' | 'REGULATED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// 12-03: Full agent metadata contract
export interface AgentDefinition {
  id: string;
  name: string;
  category: AgentCategory;
  kind: AgentKind;
  description: string;
  capabilities: string[];
  prohibitedOutputs: string[];
  requiredDisclaimers: string[];
  defaultEnabled: boolean;
  riskLevel: RiskLevel;
}

// ── 12-01: Core Builder Agents (10) ──────────────────────────────────────────

const CORE_AGENTS: AgentDefinition[] = [
  {
    id: 'planner',
    name: 'Planner',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Analyzes requirements, decomposes the build into tasks, and produces the architecture plan.',
    capabilities: ['requirement analysis', 'task decomposition', 'milestone planning', 'dependency graph'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'architect',
    name: 'Architect',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Designs system structure, chooses tech stack, defines service boundaries and data flow.',
    capabilities: ['system design', 'tech stack selection', 'API contracts', 'service decomposition'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Builds the user interface: React components, routing, state management, and responsive layouts.',
    capabilities: ['React/Next.js', 'responsive design', 'component library', 'state management', 'accessibility'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'backend',
    name: 'Backend/API',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Scaffolds REST/GraphQL API, business logic, authentication, and third-party integrations.',
    capabilities: ['REST API', 'GraphQL', 'authentication', 'middleware', 'webhooks', 'integrations'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'database',
    name: 'Database',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Designs schema, writes migrations, optimizes queries, and configures caching layers.',
    capabilities: ['schema design', 'migrations', 'indexing', 'query optimization', 'Redis caching'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'qa',
    name: 'QA/Test',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Writes unit, integration, and e2e tests. Runs test suite and reports coverage.',
    capabilities: ['unit tests', 'integration tests', 'e2e tests', 'coverage reporting', 'test fixtures'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'devops',
    name: 'DevOps/Runtime',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Configures Docker containers, CI/CD pipelines, environment variables, and cloud deployment.',
    capabilities: ['Docker', 'CI/CD', 'environment config', 'cloud deployment', 'monitoring'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'security-core',
    name: 'Security',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Runs OWASP checks, scans for vulnerabilities, enforces HTTPS, input validation, and CSP headers.',
    capabilities: ['OWASP top-10', 'dependency audit', 'HTTPS enforcement', 'input validation', 'CSP/CORS'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'ux-polish',
    name: 'UX Polish',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Improves loading states, error messages, empty states, animations, and overall UX quality.',
    capabilities: ['loading states', 'error UX', 'empty states', 'micro-animations', 'mobile UX'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
  {
    id: 'healer',
    name: 'Healer',
    category: 'BUILDER',
    kind: 'CORE',
    description: 'Monitors runtime health, auto-recovers crashed processes, and applies hot-patches.',
    capabilities: ['crash recovery', 'health checks', 'auto-restart', 'hot-patch', 'alert routing'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: true,
    riskLevel: 'LOW',
  },
];

// ── 12-01 + 12-02: Domain Expert Agents (25, including 5 regulated) ───────────

const DOMAIN_AGENTS: AgentDefinition[] = [
  // ── REGULATED (12-02) ──────────────────────────────────────────────────────

  {
    id: 'legal-compliance',
    name: 'Legal Compliance',
    category: 'LEGAL',
    kind: 'REGULATED',
    description: 'Adds legal page scaffolding, consent flows, GDPR/CCPA checklists, and terms/privacy templates.',
    capabilities: ['terms of service template', 'privacy policy template', 'GDPR consent flows', 'CCPA disclosure', 'compliance checklist'],
    // 12-02: Regulated guard rules
    prohibitedOutputs: [
      'legal advice',
      'legal conclusions',
      'specific legal strategy',
      'attorney-client privileged information',
      'case outcome predictions',
      'jurisdiction-specific legal rulings',
    ],
    requiredDisclaimers: [
      'Not legal advice. This output is informational only and does not constitute legal advice. Consult a qualified attorney for legal decisions.',
    ],
    defaultEnabled: false,
    riskLevel: 'HIGH',
  },
  {
    id: 'finance',
    name: 'Finance/Accounting',
    category: 'FINANCE',
    kind: 'REGULATED',
    description: 'Builds invoicing, budgeting, P&L dashboards, expense tracking, and payment integration scaffolding.',
    capabilities: ['invoicing UI', 'expense tracking', 'P&L dashboard', 'payment integration scaffolding', 'accounting reports'],
    // 12-02: Regulated guard rules
    prohibitedOutputs: [
      'investment advice',
      'financial advice',
      'tax decisions',
      'trading recommendations',
      'portfolio allocation advice',
      'specific return projections',
    ],
    requiredDisclaimers: [
      'Not financial or investment advice. This output is for app workflow purposes only. Consult a qualified financial advisor or accountant for financial decisions.',
    ],
    defaultEnabled: false,
    riskLevel: 'HIGH',
  },
  {
    id: 'medical',
    name: 'Medical/Healthcare',
    category: 'MEDICAL',
    kind: 'REGULATED',
    description: 'Scaffolds patient portals, appointment booking, EHR integrations, and HIPAA-compliant data handling.',
    capabilities: ['patient portal UI', 'appointment booking', 'HIPAA data handling', 'EHR/FHIR integration scaffolding', 'consent forms'],
    // 12-02: Regulated guard rules
    prohibitedOutputs: [
      'medical diagnosis',
      'medical advice',
      'treatment recommendations',
      'drug dosage recommendations',
      'clinical decisions',
      'health prognosis',
    ],
    requiredDisclaimers: [
      'Not medical advice. This output is for app workflow and UI scaffolding only. Consult a licensed healthcare provider for medical decisions.',
    ],
    defaultEnabled: false,
    riskLevel: 'HIGH',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    category: 'INSURANCE',
    kind: 'REGULATED',
    description: 'Builds policy comparison UIs, claims workflow, premium calculators (UI only), and quote forms.',
    capabilities: ['policy comparison UI', 'claims workflow', 'quote form', 'premium UI (display only)', 'underwriting checklist'],
    // 12-02: Regulated guard rules
    prohibitedOutputs: [
      'insurance recommendations',
      'coverage advice',
      'underwriting decisions',
      'specific policy recommendations',
      'premium calculations as binding quotes',
    ],
    requiredDisclaimers: [
      'Not insurance advice. This output is for UI and workflow scaffolding only. Consult a licensed insurance broker for coverage decisions.',
    ],
    defaultEnabled: false,
    riskLevel: 'HIGH',
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    category: 'REAL_ESTATE',
    kind: 'REGULATED',
    description: 'Builds property listing platforms, search/filter UIs, agent portals, and mortgage calculators (UI only).',
    capabilities: ['property listings', 'map search', 'agent portal', 'mortgage UI (display only)', 'virtual tour integration'],
    // 12-02: Regulated guard rules
    prohibitedOutputs: [
      'property valuation advice',
      'investment property advice',
      'mortgage rate advice',
      'real estate transaction recommendations',
      'MLS data manipulation',
    ],
    requiredDisclaimers: [
      'Not real estate or financial advice. This output is for app workflow and UI scaffolding only. Consult a licensed real estate professional for property decisions.',
    ],
    defaultEnabled: false,
    riskLevel: 'HIGH',
  },

  // ── NON-REGULATED DOMAIN AGENTS (20) ──────────────────────────────────────

  {
    id: 'education',
    name: 'Education/Tutor',
    category: 'EDUCATION',
    kind: 'DOMAIN',
    description: 'Builds course management, quiz engines, progress tracking, LMS integrations, and student portals.',
    capabilities: ['course management', 'quiz engine', 'progress tracking', 'LMS integration', 'certificates', 'video lessons'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'hr-recruiting',
    name: 'HR/Recruiting',
    category: 'HR',
    kind: 'DOMAIN',
    description: 'Builds job boards, applicant tracking, onboarding flows, payroll UIs, and employee portals.',
    capabilities: ['job board', 'ATS (applicant tracking)', 'onboarding flow', 'payroll UI', 'employee directory', 'offer letters'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'CYBERSECURITY',
    kind: 'DOMAIN',
    description: 'Builds threat dashboards, security audit trails, vulnerability reporting, and SIEM integrations.',
    capabilities: ['threat dashboard', 'audit trail', 'vulnerability reporting', 'SIEM integration', 'incident response UI'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'MEDIUM',
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce',
    category: 'ECOMMERCE',
    kind: 'DOMAIN',
    description: 'Builds product catalogs, shopping carts, checkout flows, inventory management, and order tracking.',
    capabilities: ['product catalog', 'shopping cart', 'checkout', 'Stripe/PayPal integration', 'inventory', 'order tracking', 'reviews'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'restaurant',
    name: 'Restaurant/Food',
    category: 'FOOD',
    kind: 'DOMAIN',
    description: 'Builds menus, online ordering, table reservations, kitchen display systems, and delivery tracking.',
    capabilities: ['menu management', 'online ordering', 'table reservation', 'kitchen display', 'delivery tracking', 'QR codes'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    category: 'MARKETPLACE',
    kind: 'DOMAIN',
    description: 'Builds multi-vendor platforms with seller onboarding, listing management, escrow flows, and ratings.',
    capabilities: ['seller onboarding', 'listing management', 'escrow workflow', 'ratings/reviews', 'commission splits', 'dispute flow'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'logistics',
    name: 'Logistics/Delivery',
    category: 'LOGISTICS',
    kind: 'DOMAIN',
    description: 'Builds shipment tracking, route optimization UI, warehouse management, and courier dispatch.',
    capabilities: ['shipment tracking', 'route UI', 'warehouse management', 'courier dispatch', 'manifest generation', 'barcode scanning'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'travel',
    name: 'Travel/Booking',
    category: 'TRAVEL',
    kind: 'DOMAIN',
    description: 'Builds flight/hotel search, booking flows, itinerary managers, and travel agency portals.',
    capabilities: ['search/filter', 'booking flow', 'calendar availability', 'itinerary builder', 'travel API integration'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'fitness',
    name: 'Fitness/Wellness',
    category: 'FITNESS',
    kind: 'DOMAIN',
    description: 'Builds workout trackers, nutrition logs, trainer portals, class booking, and wellness dashboards.',
    capabilities: ['workout tracker', 'nutrition log', 'trainer portal', 'class booking', 'progress charts', 'wearable sync'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'government',
    name: 'Government/Form',
    category: 'GOVERNMENT',
    kind: 'DOMAIN',
    description: 'Builds permit applications, citizen portals, public form workflows, and e-signature flows.',
    capabilities: ['permit application', 'citizen portal', 'form workflow', 'e-signature', 'document upload', 'status tracking'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'MEDIUM',
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit/Donation',
    category: 'NONPROFIT',
    kind: 'DOMAIN',
    description: 'Builds donation flows, fundraising pages, volunteer management, and impact reporting.',
    capabilities: ['donation flow', 'fundraising page', 'volunteer management', 'impact reporting', 'campaign tracker'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'creator-media',
    name: 'Creator/Media',
    category: 'MEDIA',
    kind: 'DOMAIN',
    description: 'Builds content management, video/podcast players, subscription paywalls, and creator dashboards.',
    capabilities: ['content CMS', 'video/audio player', 'subscription paywall', 'creator dashboard', 'audience analytics'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'events',
    name: 'Event/Ticketing',
    category: 'EVENTS',
    kind: 'DOMAIN',
    description: 'Builds event listing, ticket purchasing, QR check-in, seat mapping, and organizer dashboards.',
    capabilities: ['event listing', 'ticket purchase', 'QR check-in', 'seat mapping', 'organizer dashboard', 'waitlist'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'crm-sales',
    name: 'CRM/Sales',
    category: 'CRM',
    kind: 'DOMAIN',
    description: 'Builds lead pipelines, contact management, deal tracking, email sequences, and sales dashboards.',
    capabilities: ['lead pipeline', 'contact management', 'deal tracking', 'email sequences', 'sales dashboard', 'forecasting UI'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    category: 'SUPPORT',
    kind: 'DOMAIN',
    description: 'Builds helpdesk ticketing, live chat integration, FAQ knowledge bases, and chatbot flows.',
    capabilities: ['helpdesk ticketing', 'live chat', 'FAQ/knowledge base', 'chatbot flow', 'SLA tracking'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'data-analytics',
    name: 'Data/Analytics',
    category: 'DATA',
    kind: 'DOMAIN',
    description: 'Builds BI dashboards, chart libraries, data pipelines, export tools, and reporting automation.',
    capabilities: ['BI dashboard', 'chart library', 'data pipeline', 'export (CSV/PDF)', 'reporting automation', 'KPI tracking'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'automation',
    name: 'Automation/Webhook',
    category: 'AUTOMATION',
    kind: 'DOMAIN',
    description: 'Builds workflow automation, webhook handlers, Zapier-style triggers, and API integration layers.',
    capabilities: ['workflow automation', 'webhook handlers', 'trigger/action engine', 'API integration layer', 'cron scheduler'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    category: 'MOBILE',
    kind: 'DOMAIN',
    description: 'Adds React Native / PWA scaffolding, push notifications, offline support, and app store metadata.',
    capabilities: ['React Native scaffolding', 'PWA manifest', 'push notifications', 'offline mode', 'app store assets'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'gaming',
    name: 'Game',
    category: 'GAMING',
    kind: 'DOMAIN',
    description: 'Builds game loops, leaderboards, achievement systems, multiplayer scaffolding, and game UI components.',
    capabilities: ['game loop', 'leaderboard', 'achievements', 'multiplayer scaffolding', 'game UI', 'save state'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
  {
    id: 'localization',
    name: 'Localization',
    category: 'LOCALIZATION',
    kind: 'DOMAIN',
    description: 'Adds i18n framework, locale detection, RTL support, currency/date formatting, and translation scaffolding.',
    capabilities: ['i18n framework', 'locale detection', 'RTL support', 'currency formatting', 'date/time localization', 'translation keys'],
    prohibitedOutputs: [],
    requiredDisclaimers: [],
    defaultEnabled: false,
    riskLevel: 'LOW',
  },
];

// ── Exports ────────────────────────────────────────────────────────────────────

export const AGENT_REGISTRY: AgentDefinition[] = [...CORE_AGENTS, ...DOMAIN_AGENTS];

export const CORE_AGENT_IDS = new Set(CORE_AGENTS.map((a) => a.id));

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find((a) => a.id === id);
}

export function getAgentsByCategory(category: AgentCategory): AgentDefinition[] {
  return AGENT_REGISTRY.filter((a) => a.category === category);
}

export function getCategories(): AgentCategory[] {
  return [...new Set(AGENT_REGISTRY.map((a) => a.category))];
}
