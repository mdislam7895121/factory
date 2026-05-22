import { Injectable } from '@nestjs/common';
import { DomainTemplateService } from './domain-template.service';
import type { DomainTemplate } from './domain-template.types';
import type {
  UserSkillMode,
  SkillModeResult,
  ProjectIdentity,
  CustomerDemandResult,
  DeveloperBlueprint,
  StackRecommendation,
  GuidedSetup,
  BrandingDefaults,
  ChecklistItem,
  ProjectStartupBlueprint,
} from './startup-intelligence.types';

// ── 15-10: Skill mode keyword rules ──────────────────────────────────────────

const SKILL_KEYWORDS: Record<UserSkillMode, string[]> = {
  PROFESSIONAL_DEVELOPER: [
    'api', 'rest', 'graphql', 'typescript', 'python', 'node.js', 'postgresql', 'docker',
    'kubernetes', 'microservice', 'jwt', 'oauth', 'redis', 'kafka', 'architecture',
    'database schema', 'ci/cd', 'orm', 'prisma', 'async', 'caching', 'middleware',
    'devops', 'repository', 'endpoint', 'deployment pipeline', 'backend', 'frontend framework',
  ],
  AGENCY_FREELANCER: [
    'client', 'deliverable', 'scope', 'timeline', 'budget', 'handoff',
    'white-label', 'agency', 'freelance', 'project proposal', 'requirements doc',
  ],
  BUSINESS_OWNER: [
    'revenue', 'profit', 'operations', 'staff', 'employees', 'sales team',
    'business plan', 'growth', 'marketing', 'pricing model', 'customer acquisition',
    'automate my', 'manage my', 'run my',
  ],
  STARTUP_FOUNDER: [
    'mvp', 'launch', 'monetize', 'investors', 'product-market fit', 'traction',
    'startup', 'fundraise', 'scale', 'growth hack', 'seed round', 'series a',
    'go to market', 'user acquisition', 'retention', 'churn',
  ],
  NON_TECHNICAL: [],
};

const EXPLANATION_STYLES: Record<UserSkillMode, string> = {
  NON_TECHNICAL:          'Simple language, guided steps, visual outcomes. No technical jargon.',
  BUSINESS_OWNER:         'Business workflow, roles, pricing model, operations, and revenue impact.',
  PROFESSIONAL_DEVELOPER: 'Architecture, API design, DB schema, env vars, deployment, and test plan.',
  AGENCY_FREELANCER:      'Client-ready scope, delivery milestones, handoff checklist, and tech stack.',
  STARTUP_FOUNDER:        'MVP scope, launch timeline, monetization model, and growth levers.',
};

const NEXT_QUESTIONS: Record<UserSkillMode, string[]> = {
  NON_TECHNICAL: [
    'Who will use your app — customers, employees, or both?',
    'Do you need users to create accounts and log in?',
    'Do you need to accept payments?',
    'What country or language should your app support?',
  ],
  BUSINESS_OWNER: [
    'What is the core revenue model — subscription, commission, or one-time?',
    'How many staff roles need different access levels?',
    'What existing tools should this integrate with?',
    'What is your target launch timeline?',
  ],
  PROFESSIONAL_DEVELOPER: [
    'Which cloud provider and region are you targeting?',
    'Do you need multi-tenancy or a single-tenant deployment?',
    'What CI/CD pipeline and branching strategy will you use?',
    'Do you require SSO or enterprise auth (SAML/OIDC)?',
  ],
  AGENCY_FREELANCER: [
    'What is the client\'s handoff requirement — source code, hosted, or both?',
    'Does the client need a white-label or custom-branded solution?',
    'What is the budget range and delivery timeline?',
    'Will ongoing maintenance be in scope after delivery?',
  ],
  STARTUP_FOUNDER: [
    'What is the one core action your MVP must support on day one?',
    'Who are your three direct competitors and what will you do differently?',
    'What is your primary user acquisition channel at launch?',
    'What metric defines product-market fit for you?',
  ],
};

// ── 15-11: Project identity data ──────────────────────────────────────────────

const DOMAIN_NAME_DEFAULTS: Record<string, string> = {
  'medical':       'MediFlow',     'legal-compliance': 'CompliDesk',
  'finance':       'FinanceFlow',  'insurance':        'ClaimHub',
  'real-estate':   'PropBase',     'ecommerce':        'ShopBase',
  'marketplace':   'TradeHub',     'restaurant':       'TableNow',
  'logistics':     'ShipTrack',    'education':        'LearnPath',
  'hr-recruiting': 'HireDesk',     'crm-sales':        'SalesFlow',
  'automation':    'AutoFlow',     'mobile-app':       'AppKit',
  'gaming':        'PlayArena',    'default':          'AppBase',
};

const DOMAIN_TAGLINES: Record<string, string> = {
  'medical':       'Healthcare workflows, built for your clinic.',
  'legal-compliance': 'Compliance made simple — without the legal jargon.',
  'finance':       'Invoice, track, and get paid — all in one place.',
  'insurance':     'Claims management that works as fast as you do.',
  'real-estate':   'Find, lease, and manage properties seamlessly.',
  'ecommerce':     'Your store, your brand, your customers.',
  'marketplace':   'Connect buyers and sellers. Keep things moving.',
  'restaurant':    'Orders in. Food out. Customers happy.',
  'logistics':     'Track every shipment, from pickup to door.',
  'education':     'Learn anything. Teach everything.',
  'hr-recruiting': 'Find the right people, faster.',
  'crm-sales':     'Close more deals. Build better relationships.',
  'automation':    'Automate the repetitive. Focus on what matters.',
  'mobile-app':    'Your idea, now in everyone\'s pocket.',
  'gaming':        'Play hard. Win bigger.',
  'default':       'Built for you. Ready to ship.',
};

const DOMAIN_AUDIENCES: Record<string, string> = {
  'medical':       'Patients and healthcare providers', 'legal-compliance': 'Compliance teams and businesses',
  'finance':       'Business owners and accountants',   'insurance':        'Policyholders and insurance teams',
  'real-estate':   'Landlords, tenants, and managers',  'ecommerce':        'Online shoppers and merchants',
  'marketplace':   'Buyers and sellers',                'restaurant':       'Restaurant customers and staff',
  'logistics':     'Dispatchers, drivers, and customers','education':       'Students and instructors',
  'hr-recruiting': 'Job seekers and recruiters',        'crm-sales':        'Sales reps and managers',
  'automation':    'Operations teams and developers',   'mobile-app':       'Mobile users',
  'gaming':        'Players and game admins',           'default':          'End users',
};

// ── 15-15: Branding defaults per domain ───────────────────────────────────────

interface DomainBrandSpec {
  primaryColor: string; secondaryColor: string; accentColor: string;
  uiStyle: string; brandTone: string; logoIdea: string; buttonStyle: string;
  iconDirection: string; headlineFn: (name: string) => string; ctaCopy: string;
}

const DOMAIN_BRANDING: Record<string, DomainBrandSpec> = {
  'medical': {
    primaryColor: '#0EA5E9', secondaryColor: '#10B981', accentColor: '#F0F9FF',
    uiStyle: 'Clean, professional, trust-first', brandTone: 'Calm and reassuring',
    logoIdea: 'Simple health cross or heartbeat waveform icon with wordmark',
    buttonStyle: 'Rounded (8px radius), solid primary color',
    iconDirection: 'Outline icons — Lucide Health set',
    headlineFn: (n) => `${n} — Healthcare that works around you.`,
    ctaCopy: 'Book your appointment →',
  },
  'legal-compliance': {
    primaryColor: '#1E3A5F', secondaryColor: '#64748B', accentColor: '#F8FAFC',
    uiStyle: 'Authoritative, minimal, structured', brandTone: 'Trustworthy and precise',
    logoIdea: 'Scales of justice icon or shield with subtle gradient wordmark',
    buttonStyle: 'Slightly rounded (6px), confident dark fill',
    iconDirection: 'Solid icons — Shield and document set',
    headlineFn: (n) => `${n} — Compliance without the complexity.`,
    ctaCopy: 'Start your compliance checklist →',
  },
  'finance': {
    primaryColor: '#1E3A5F', secondaryColor: '#10B981', accentColor: '#F0FDF4',
    uiStyle: 'Clean, data-driven, secure', brandTone: 'Authoritative and reliable',
    logoIdea: 'Rising chart or currency symbol with geometric wordmark',
    buttonStyle: 'Rounded (8px), emerald accent on dark navy',
    iconDirection: 'Clean outline — Finance and chart icons',
    headlineFn: (n) => `${n} — Get paid faster. Stay organized.`,
    ctaCopy: 'Send your first invoice →',
  },
  'insurance': {
    primaryColor: '#1D4ED8', secondaryColor: '#6B7280', accentColor: '#EFF6FF',
    uiStyle: 'Structured, informative, dependable', brandTone: 'Dependable and transparent',
    logoIdea: 'Shield or umbrella icon with clean wordmark',
    buttonStyle: 'Rounded (8px), solid blue',
    iconDirection: 'Solid shield and document icons',
    headlineFn: (n) => `${n} — File a claim in minutes.`,
    ctaCopy: 'Submit your claim →',
  },
  'real-estate': {
    primaryColor: '#92400E', secondaryColor: '#B45309', accentColor: '#FFFBEB',
    uiStyle: 'Warm, trustworthy, property-focused', brandTone: 'Professional and welcoming',
    logoIdea: 'House or key icon with serif-adjacent wordmark',
    buttonStyle: 'Rounded (10px), warm amber accent',
    iconDirection: 'Outline home and location icons',
    headlineFn: (n) => `${n} — Find your next home. Manage your portfolio.`,
    ctaCopy: 'Browse listings →',
  },
  'ecommerce': {
    primaryColor: '#3B82F6', secondaryColor: '#8B5CF6', accentColor: '#EFF6FF',
    uiStyle: 'Modern, conversion-optimized, product-first', brandTone: 'Confident and helpful',
    logoIdea: 'Shopping bag or cart icon with bold wordmark',
    buttonStyle: 'Rounded (8px), vivid blue',
    iconDirection: 'Outline shopping and product icons',
    headlineFn: (n) => `${n} — Your store. Your brand.`,
    ctaCopy: 'Shop now →',
  },
  'marketplace': {
    primaryColor: '#374151', secondaryColor: '#3B82F6', accentColor: '#F9FAFB',
    uiStyle: 'Product-focused, neutral, discovery-optimized', brandTone: 'Neutral and trustworthy',
    logoIdea: 'Two-arrow exchange or grid icon with clean wordmark',
    buttonStyle: 'Rounded (8px), accent blue on neutral',
    iconDirection: 'Outline icons — marketplace and exchange',
    headlineFn: (n) => `${n} — Buy. Sell. Connect.`,
    ctaCopy: 'Browse listings →',
  },
  'restaurant': {
    primaryColor: '#F97316', secondaryColor: '#EF4444', accentColor: '#FFF7ED',
    uiStyle: 'Warm, inviting, appetizing', brandTone: 'Friendly and energetic',
    logoIdea: 'Fork and plate or flame icon with friendly rounded wordmark',
    buttonStyle: 'Fully rounded (pill), warm orange fill',
    iconDirection: 'Friendly solid icons — food and delivery',
    headlineFn: (n) => `${n} — Order fresh. Delivered fast.`,
    ctaCopy: 'Order now →',
  },
  'logistics': {
    primaryColor: '#0EA5E9', secondaryColor: '#F59E0B', accentColor: '#F0F9FF',
    uiStyle: 'Functional, efficient, data-dense', brandTone: 'Reliable and direct',
    logoIdea: 'Arrow in circle or truck icon with bold wordmark',
    buttonStyle: 'Slightly rounded (6px), sky blue',
    iconDirection: 'Solid icons — truck, location, package',
    headlineFn: (n) => `${n} — Track every shipment, every step.`,
    ctaCopy: 'Track your shipment →',
  },
  'education': {
    primaryColor: '#6366F1', secondaryColor: '#8B5CF6', accentColor: '#EEF2FF',
    uiStyle: 'Clear, encouraging, structured', brandTone: 'Inspiring and supportive',
    logoIdea: 'Open book or lightbulb icon with approachable wordmark',
    buttonStyle: 'Rounded (10px), indigo',
    iconDirection: 'Outline icons — education and progress',
    headlineFn: (n) => `${n} — Learn anything. Grow every day.`,
    ctaCopy: 'Start learning →',
  },
  'hr-recruiting': {
    primaryColor: '#0D9488', secondaryColor: '#06B6D4', accentColor: '#F0FDFA',
    uiStyle: 'Professional, clean, results-focused', brandTone: 'Professional and encouraging',
    logoIdea: 'People icon or briefcase with teal wordmark',
    buttonStyle: 'Rounded (8px), teal',
    iconDirection: 'Outline people and document icons',
    headlineFn: (n) => `${n} — Find the right people, faster.`,
    ctaCopy: 'Post a job →',
  },
  'crm-sales': {
    primaryColor: '#2563EB', secondaryColor: '#F97316', accentColor: '#EFF6FF',
    uiStyle: 'Data-rich, pipeline-focused, motivated', brandTone: 'Energetic and goal-oriented',
    logoIdea: 'Pipeline or handshake icon with dynamic wordmark',
    buttonStyle: 'Rounded (8px), vivid blue with orange accent',
    iconDirection: 'Outline icons — chart, pipeline, contact',
    headlineFn: (n) => `${n} — Close more deals. Build real relationships.`,
    ctaCopy: 'Start free trial →',
  },
  'automation': {
    primaryColor: '#7C3AED', secondaryColor: '#10B981', accentColor: '#FAF5FF',
    uiStyle: 'Technical, clean, workflow-visual', brandTone: 'Smart and efficient',
    logoIdea: 'Gear or lightning bolt icon with modern wordmark',
    buttonStyle: 'Rounded (8px), purple',
    iconDirection: 'Outline icons — workflow, code, arrows',
    headlineFn: (n) => `${n} — Automate the repetitive. Focus on what matters.`,
    ctaCopy: 'Build your first workflow →',
  },
  'gaming': {
    primaryColor: '#7C3AED', secondaryColor: '#EC4899', accentColor: '#1E1B4B',
    uiStyle: 'Bold, energetic, immersive (dark mode first)', brandTone: 'Exciting and competitive',
    logoIdea: 'Controller or shield icon with bold angular wordmark',
    buttonStyle: 'Rounded (10px), gradient purple to pink',
    iconDirection: 'Solid neon-style icons — game, trophy, lightning',
    headlineFn: (n) => `${n} — Play hard. Win bigger.`,
    ctaCopy: 'Play now →',
  },
  'default': {
    primaryColor: '#6366F1', secondaryColor: '#8B5CF6', accentColor: '#EEF2FF',
    uiStyle: 'Modern, minimal, clean', brandTone: 'Professional and friendly',
    logoIdea: 'Abstract geometric mark with clean wordmark',
    buttonStyle: 'Rounded (8px), indigo',
    iconDirection: 'Clean outline icons (Lucide)',
    headlineFn: (n) => `${n} — Built for you. Ready to ship.`,
    ctaCopy: 'Get started free →',
  },
};

// ── 15-12: Customer demand data ───────────────────────────────────────────────

const DOMAIN_TARGET_CUSTOMERS: Record<string, string> = {
  'medical': 'Patients and caregivers', 'legal-compliance': 'Compliance officers and legal teams',
  'finance': 'Business owners and accountants', 'insurance': 'Policyholders filing or managing claims',
  'real-estate': 'Tenants, landlords, and property managers', 'ecommerce': 'Online shoppers and product buyers',
  'marketplace': 'Buyers looking for services and sellers listing them', 'restaurant': 'Hungry customers wanting quick delivery or dining',
  'logistics': 'Businesses shipping goods and their end customers', 'education': 'Students, professionals, and lifelong learners',
  'hr-recruiting': 'Job seekers and hiring teams', 'crm-sales': 'Sales reps and account managers',
  'automation': 'Operations teams drowning in repetitive manual tasks', 'gaming': 'Competitive players and gaming communities',
  'default': 'End users with a specific workflow need',
};

const DOMAIN_PAIN_POINTS: Record<string, string> = {
  'medical': 'book appointments without phone calls and long waits',
  'legal-compliance': 'manage consent, policies, and regulatory filings without manual tracking',
  'finance': 'send invoices and track payments without spreadsheet chaos',
  'insurance': 'submit and track insurance claims without calling agents',
  'real-estate': 'find, rent, and manage properties without paperwork bottlenecks',
  'ecommerce': 'discover and buy products with a smooth, trustworthy checkout',
  'marketplace': 'connect buyers and sellers with secure payments and no trust gap',
  'restaurant': 'order food online without calling or waiting on hold',
  'logistics': 'track their shipment in real time and know exactly when it arrives',
  'education': 'learn a new skill at their own pace with measurable progress',
  'hr-recruiting': 'find qualified candidates faster and without missing great applicants',
  'crm-sales': 'track deals and follow up before leads go cold',
  'automation': 'automate repetitive workflows so they can focus on higher-value work',
  'gaming': 'compete, earn achievements, and see their rank improve over time',
  'default': 'accomplish their core workflow faster and with less friction',
};

const DOMAIN_COMPETITOR_STYLES: Record<string, string> = {
  'medical': 'Zocdoc, Headway — clean, reassuring, mobile-first',
  'finance': 'FreshBooks, Wave — simple, friendly, dashboard-centric',
  'ecommerce': 'Shopify, WooCommerce — product-first, conversion-optimized',
  'marketplace': 'Airbnb, Etsy — discovery-first, trust-building, review-heavy',
  'restaurant': 'DoorDash, Uber Eats — fast, visual, location-aware',
  'education': 'Udemy, Coursera — course-browsing, progress-tracking',
  'hr-recruiting': 'Greenhouse, Lever — pipeline-first, structured',
  'crm-sales': 'HubSpot, Pipedrive — pipeline-visual, data-rich',
  'default': 'Modern SaaS — clean, dashboard-focused, freemium funnel',
};

const DOMAIN_LAUNCH_CHANNELS: Record<string, string> = {
  'medical': 'Partnerships with clinics, healthcare directories, SEO',
  'finance': 'Freelancer communities, accountant referrals, SEO/content',
  'ecommerce': 'Social ads, influencer marketing, SEO',
  'marketplace': 'Both-sides acquisition — SEO for buyers, direct outreach for sellers',
  'restaurant': 'Local partnerships, Google Maps, food influencers',
  'education': 'Content marketing, YouTube, niche communities, SEO',
  'gaming': 'Discord communities, game influencers, app stores',
  'default': 'SEO, direct outreach, product-led growth',
};

const DOMAIN_TRUST_EXPECTATIONS: Record<string, string[]> = {
  'medical': ['HIPAA compliance badge', 'Provider license display', 'Privacy policy', 'Secure messaging'],
  'finance': ['SSL lock icon', 'PCI DSS badge', 'Clear refund policy', 'Two-factor auth'],
  'insurance': ['Regulator license number displayed', 'Secure document storage', 'Privacy policy'],
  'ecommerce': ['Money-back guarantee', 'Verified reviews', 'Secure checkout badge', 'Clear return policy'],
  'marketplace': ['Identity verification', 'Escrow payments', 'Dispute resolution policy', 'Two-way reviews'],
  'default': ['HTTPS / SSL', 'Privacy policy', 'Clear pricing', 'Visible contact info'],
};

// ── 15-13: Stack recommendations per domain ───────────────────────────────────

const DOMAIN_STACKS: Record<string, StackRecommendation> = {
  'medical': {
    frontend: 'Next.js (React)', backend: 'NestJS (TypeScript)', database: 'PostgreSQL',
    cache: 'Redis', queue: 'Bull (Redis-backed)', auth: 'JWT + MFA (HIPAA)',
    hosting: 'AWS ECS (HIPAA-eligible) or Azure Healthcare',
  },
  'gaming': {
    frontend: 'React + WebSocket client', backend: 'Node.js + Socket.io', database: 'PostgreSQL',
    cache: 'Redis (leaderboards + matchmaking)', queue: 'Bull', auth: 'JWT',
    hosting: 'AWS ECS with Auto Scaling + CloudFront',
  },
  'ecommerce': {
    frontend: 'Next.js (React)', backend: 'NestJS (TypeScript)', database: 'PostgreSQL',
    cache: 'Redis', queue: 'Bull (order processing)', auth: 'JWT + OAuth (Google/Apple)',
    hosting: 'Vercel (frontend) + Railway (API)',
  },
  'mobile-app': {
    frontend: 'React Native (Expo)', backend: 'NestJS (TypeScript)', database: 'PostgreSQL',
    cache: 'Redis', queue: 'Bull', auth: 'JWT + Biometric (device-local)',
    hosting: 'Railway or AWS ECS',
  },
  'default': {
    frontend: 'Next.js (React)', backend: 'NestJS (TypeScript)', database: 'PostgreSQL',
    cache: 'Redis', queue: 'Bull (Redis-backed)', auth: 'JWT with refresh tokens',
    hosting: 'Railway or AWS ECS + CloudFront',
  },
};

const DOMAIN_ENV_VARS: Record<string, string[]> = {
  'medical':    ['HIPAA_AUDIT_LOG_ENABLED=true', 'TWILIO_AUTH_TOKEN', 'TWILIO_ACCOUNT_SID', 'VIDEO_PROVIDER_API_KEY'],
  'finance':    ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'PLAID_CLIENT_ID', 'PLAID_SECRET'],
  'ecommerce':  ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SHIPSTATION_API_KEY', 'CLOUDINARY_URL'],
  'marketplace':['STRIPE_SECRET_KEY', 'STRIPE_CONNECT_CLIENT_ID', 'IDENTITY_VERIFY_API_KEY'],
};
const BASE_ENV_VARS = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'NODE_ENV', 'SENDGRID_API_KEY', 'ADMIN_API_KEY'];

// ── 15-11: Country / language / currency detection ────────────────────────────

const COUNTRY_MAP: Record<string, string> = {
  'usa': 'United States', 'united states': 'United States', 'america': 'United States',
  'uk': 'United Kingdom', 'britain': 'United Kingdom', 'england': 'United Kingdom',
  'india': 'India', 'bangladesh': 'Bangladesh', 'pakistan': 'Pakistan',
  'canada': 'Canada', 'australia': 'Australia', 'germany': 'Germany',
  'france': 'France', 'japan': 'Japan', 'brazil': 'Brazil', 'nigeria': 'Nigeria',
  'uae': 'UAE', 'saudi': 'Saudi Arabia', 'singapore': 'Singapore',
};

const CURRENCY_MAP: Record<string, string> = {
  'usd': 'USD', 'dollar': 'USD', 'dollars': 'USD',
  'eur': 'EUR', 'euro': 'EUR', 'gbp': 'GBP', 'pound': 'GBP',
  'inr': 'INR', 'rupee': 'INR', 'bdt': 'BDT', 'taka': 'BDT',
  'jpy': 'JPY', 'yen': 'JPY', 'aud': 'AUD', 'cad': 'CAD',
};

function detectFromMap<T>(lower: string, map: Record<string, T>): T | undefined {
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return undefined;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class StartupIntelligenceService {
  constructor(private readonly templateService: DomainTemplateService) {}

  // 15-10: Detect user skill mode from prompt keywords
  detectUserMode(prompt: string): SkillModeResult {
    const lower = prompt.toLowerCase();
    const scores = { PROFESSIONAL_DEVELOPER: 0, AGENCY_FREELANCER: 0, BUSINESS_OWNER: 0, STARTUP_FOUNDER: 0 };

    for (const [mode, keywords] of Object.entries(SKILL_KEYWORDS)) {
      if (mode === 'NON_TECHNICAL') continue;
      for (const kw of keywords) {
        if (lower.includes(kw)) scores[mode as keyof typeof scores]++;
      }
    }

    let topMode: UserSkillMode = 'NON_TECHNICAL';
    let topScore = 0;
    for (const [mode, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score;
        topMode = mode as UserSkillMode;
      }
    }

    return {
      userMode: topMode,
      explanationStyle: EXPLANATION_STYLES[topMode],
      recommendedNextQuestions: NEXT_QUESTIONS[topMode],
    };
  }

  // 15-11: Derive project identity from prompt + domain context
  deriveProjectIdentity(prompt: string, domainAgentId?: string): ProjectIdentity {
    const lower = prompt.toLowerCase();
    const domain = domainAgentId ?? 'default';
    const spec = DOMAIN_BRANDING[domain] ?? DOMAIN_BRANDING['default'];

    // Extract a proper-cased name (capitalised words only — avoids capturing lowercase domain words)
    const nameMatch =
      prompt.match(/[Bb]uild\s+(?:[Aa]n?\s+)?([A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:[Aa]pp|[Pp]latform|[Ss]ystem|[Tt]ool|[Ss]aa[Ss])/) ??
      prompt.match(/(?:called|named)\s+["']?([A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]+)?)["']?/);
    const appName = nameMatch?.[1] ?? (DOMAIN_NAME_DEFAULTS[domain] ?? 'AppBase');

    return {
      projectName: appName,
      appName,
      tagline: DOMAIN_TAGLINES[domain] ?? DOMAIN_TAGLINES['default'],
      logoDirection: spec.logoIdea,
      colorPalette: {
        primary:   spec.primaryColor,
        secondary: spec.secondaryColor,
        accent:    spec.accentColor,
      },
      fontStyle: 'Inter (primary) + system sans-serif fallback',
      brandTone: spec.brandTone,
      targetAudience: DOMAIN_AUDIENCES[domain] ?? 'End users',
      country:   detectFromMap(lower, COUNTRY_MAP)   ?? 'Global',
      language:  lower.includes('arabic') ? 'Arabic' : lower.includes('french') ? 'French' : lower.includes('spanish') ? 'Spanish' : 'English',
      currency:  detectFromMap(lower, CURRENCY_MAP)  ?? 'USD',
      timezone: 'UTC',
    };
  }

  // 15-12: Analyze customer demand from prompt + domain template
  analyzeCustomerDemand(prompt: string, template?: DomainTemplate): CustomerDemandResult {
    const lower = prompt.toLowerCase();
    const domain = template?.domainAgentId ?? 'default';

    // Detect monetization from prompt keywords
    let monetization = 'Freemium with paid subscription upgrades';
    if (lower.includes('commission') || lower.includes('marketplace')) monetization = 'Commission on completed transactions';
    if (lower.includes('subscription') || lower.includes('saas') || lower.includes('monthly plan')) monetization = 'Monthly SaaS subscription';
    if (lower.includes('enterprise') || lower.includes('b2b')) monetization = 'Enterprise licensing / per-seat pricing';
    if (lower.includes('donation') || lower.includes('nonprofit')) monetization = 'Donation / voluntary contribution';
    if (lower.includes('ad') || lower.includes('advertising')) monetization = 'Advertising revenue';

    const mustHave  = (template?.coreFeatures    ?? ['User accounts', 'Core workflow', 'Notifications', 'Admin panel']).slice(0, 5);
    const niceToHave = (template?.optionalFeatures ?? ['Analytics dashboard', 'Mobile app', 'API access']).slice(0, 4);
    const targetCustomers = DOMAIN_TARGET_CUSTOMERS[domain] ?? 'End users';
    const painPoint       = DOMAIN_PAIN_POINTS[domain]       ?? 'accomplish their core workflow';

    return {
      targetCustomers,
      painPoint,
      jobToBeDone:         `${targetCustomers} need to ${painPoint}`,
      mustHaveFeatures:    mustHave,
      niceToHaveFeatures:  niceToHave,
      monetizationOption:  monetization,
      competitorStyle:     DOMAIN_COMPETITOR_STYLES[domain] ?? 'Modern SaaS — clean, minimal, dashboard-focused',
      launchChannel:       DOMAIN_LAUNCH_CHANNELS[domain]   ?? 'SEO, direct outreach, product-led growth',
      trustExpectations:   DOMAIN_TRUST_EXPECTATIONS[domain] ?? ['HTTPS/SSL', 'Privacy policy', 'Clear pricing'],
      customerDemandSummary: `${targetCustomers} need to ${painPoint}. MVP should ship ${mustHave[0]?.toLowerCase() ?? 'core functionality'} first.`,
      launchMVPFeatures:   mustHave,
      futureFeatures:      niceToHave,
    };
  }

  // 15-15: Generate domain-aware branding defaults
  generateBranding(domainAgentId?: string, projectName?: string): BrandingDefaults {
    const domain = domainAgentId ?? 'default';
    const spec = DOMAIN_BRANDING[domain] ?? DOMAIN_BRANDING['default'];
    const name = projectName ?? DOMAIN_NAME_DEFAULTS[domain] ?? 'AppBase';

    return {
      appName:        name,
      logoIdea:       spec.logoIdea,
      primaryColor:   spec.primaryColor,
      secondaryColor: spec.secondaryColor,
      uiStyle:        spec.uiStyle,
      buttonStyle:    spec.buttonStyle,
      iconDirection:  spec.iconDirection,
      landingHeadline: spec.headlineFn(name),
      ctaCopy:        spec.ctaCopy,
    };
  }

  // 15-14: Non-technical guided builder output
  buildGuidedSetup(prompt: string, template?: DomainTemplate): GuidedSetup {
    const lower = prompt.toLowerCase();
    const hasPayments = /payment|checkout|billing|stripe|paypal|paid/.test(lower);
    const hasLogin    = !/\bno (login|auth|account)\b/.test(lower);
    const hasAdmin    = !/\bno admin\b/.test(lower);

    const roles = template?.recommendedUserRoles.slice(0, 2).join(' and ') ?? 'end users';
    const firstStep = template?.uiFlows[0]?.steps[0] ?? 'Sign up and complete their profile';

    return {
      guidedSetup: {
        'What are you building?':     prompt.slice(0, 120),
        'Who will use it?':           roles,
        'What should users do first?':firstStep,
        'Do you want payments?':      hasPayments ? 'Yes — payment processing included' : 'Not specified — can be added later',
        'Do you want login?':         hasLogin    ? 'Yes — email/password + social login' : 'No login required',
        'Do you want admin panel?':   hasAdmin    ? 'Yes — role-based admin dashboard'  : 'Not specified',
        'Country/language?':          'Global, English (can be localized after build)',
      },
      missingButAssumedFields: [
        'Logo design (branding direction auto-generated)',
        'Exact brand colors (domain-matched defaults applied)',
        'Domain name (configure after build)',
        'Production hosting credentials',
        'Third-party API keys (listed in env vars)',
      ],
      safeDefaults: {
        language:      'English',
        currency:      'USD',
        timezone:      'UTC',
        auth:          'Email/password + Google OAuth',
        notifications: 'Email (SendGrid)',
        deployment:    'Cloud (Railway or Vercel)',
      },
    };
  }

  // 15-13: Developer blueprint — only for technical users
  buildDeveloperBlueprint(prompt: string, template?: DomainTemplate, userMode?: UserSkillMode): DeveloperBlueprint | null {
    if (userMode === 'NON_TECHNICAL') return null;
    const lower = prompt.toLowerCase();
    const domain = template?.domainAgentId ?? 'default';
    const stack = DOMAIN_STACKS[domain] ?? DOMAIN_STACKS['default'];
    const isHipaa = domain === 'medical';
    const isPci   = /payment|stripe|billing|checkout/.test(lower) || domain === 'finance' || domain === 'ecommerce';

    return {
      stackRecommendation:  stack,
      architectureSummary:  `Modular NestJS monolith with domain services, PostgreSQL for persistence, Redis for caching and job queues. ${isHipaa ? 'HIPAA-eligible infrastructure required.' : ''}`,
      dbModels:             template?.dataModels.map((m) => m.name) ?? [],
      apiModules:           template?.apiModules.map((m) => m.name) ?? [],
      authModel:            isHipaa ? 'JWT + MFA (HIPAA requirement for providers)' : 'JWT with 15-min access token + 7-day refresh token rotation',
      envVars:              [...BASE_ENV_VARS, ...(DOMAIN_ENV_VARS[domain] ?? []), ...(isPci ? ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] : [])],
      deploymentTarget:     isHipaa ? 'AWS ECS (HIPAA-eligible) with encrypted EBS volumes' : 'Railway (staging) → AWS ECS Fargate (production)',
      monitoring:           ['Sentry (error tracking + source maps)', 'Datadog or Grafana + Prometheus (metrics)', 'PagerDuty (on-call alerts)', 'Uptime robot (synthetic monitoring)'],
      testPlan:             ['Unit tests: all service methods (Jest, target 80% coverage)', 'Integration tests: API endpoints with supertest', 'E2E tests: critical user flows (Playwright)'],
      rollbackPlan:         'Blue-green container deployment — revert by pointing load balancer to previous task revision in ECS or Railway.',
    };
  }

  // 15-16: Requirement memory checklist
  buildRequirementChecklist(prompt: string, identity: ProjectIdentity, template?: DomainTemplate): ChecklistItem[] {
    const lower = prompt.toLowerCase();
    const hasPayments = /payment|checkout|billing|stripe|paid/.test(lower);
    const hasMobile   = /mobile|ios|android|react native|flutter/.test(lower);
    const defaultName = DOMAIN_NAME_DEFAULTS[template?.domainAgentId ?? 'default'] ?? 'AppBase';
    const nameProvided = identity.appName !== defaultName;

    return [
      { item: 'App name',          status: nameProvided ? 'provided' : 'inferred',  value: identity.appName },
      { item: 'Logo',              status: 'inferred',                               value: identity.logoDirection },
      { item: 'Color palette',     status: 'inferred',                               value: `${identity.colorPalette.primary} / ${identity.colorPalette.secondary}` },
      { item: 'Language',          status: lower.includes('english') || lower.includes('french') || lower.includes('arabic') || lower.includes('spanish') ? 'provided' : 'inferred', value: identity.language },
      { item: 'Country/market',    status: identity.country !== 'Global' ? 'provided' : 'inferred', value: identity.country },
      { item: 'User roles',        status: 'inferred', value: (template?.recommendedUserRoles ?? ['user', 'admin']).slice(0, 3).join(', ') },
      { item: 'Authentication',    status: 'inferred', value: 'Email/password + Google OAuth' },
      { item: 'Payments',          status: hasPayments ? 'provided' : 'deferred',   value: hasPayments ? 'Stripe integration' : undefined },
      { item: 'Admin panel',       status: 'inferred', value: 'Role-based admin dashboard' },
      { item: 'Notifications',     status: 'inferred', value: 'Email (SendGrid) + in-app' },
      { item: 'Email/SMS',         status: 'inferred', value: 'SendGrid (email) + Twilio (SMS opt-in)' },
      { item: 'Privacy/legal',     status: template?.regulated ? 'provided' : 'deferred', value: template?.regulated ? `Required — ${template.name} is a regulated domain` : undefined },
      { item: 'Mobile support',    status: hasMobile ? 'provided' : 'inferred',     value: hasMobile ? 'Native mobile app' : 'Responsive web app' },
      { item: 'Analytics',         status: 'inferred', value: 'Google Analytics + admin dashboard' },
      { item: 'Deployment',        status: 'inferred', value: 'Docker container on Railway or AWS' },
      { item: 'Monitoring',        status: 'deferred', value: undefined },
    ];
  }

  // 15-17: Merge all intelligence into a single ProjectStartupBlueprint
  buildStartupBlueprint(prompt: string, domainAgentIds: string[], suggestedTemplateId?: string): ProjectStartupBlueprint {
    const templates = this.templateService.recommend(domainAgentIds, suggestedTemplateId);
    const primaryTemplate = templates[0];
    const primaryDomainId = primaryTemplate?.domainAgentId;

    const skillMode      = this.detectUserMode(prompt);
    const identity       = this.deriveProjectIdentity(prompt, primaryDomainId);
    const branding       = this.generateBranding(primaryDomainId, identity.appName);
    const customerDemand = this.analyzeCustomerDemand(prompt, primaryTemplate);
    const guidedSetup    = this.buildGuidedSetup(prompt, primaryTemplate);   // available but not in final blueprint shape
    const techPlan       = this.buildDeveloperBlueprint(prompt, primaryTemplate, skillMode.userMode);
    const checklist      = this.buildRequirementChecklist(prompt, identity, primaryTemplate);
    const merged         = this.templateService.mergeBlueprint(templates);
    const summaryItems   = this.templateService.toSummaryItems(templates);

    return {
      projectIdentity:  identity,
      userMode:         skillMode.userMode,
      customerDemand,
      domainTemplates:  summaryItems,
      features:         merged.coreFeatures,
      dataModels:       merged.dataModels,
      apiModules:       merged.apiModules,
      uiFlows:          merged.uiFlows,
      branding,
      security:         merged.securityRequirements,
      compliance:       merged.complianceChecklist,
      technicalPlan:    techPlan,
      checklist,
    };
  }
}
