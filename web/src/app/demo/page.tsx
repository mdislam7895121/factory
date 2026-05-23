'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';
import { FeedbackWidget } from '@/components/FeedbackWidget';

const API_BASE = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';

const BG = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#6366f1';
const ACCENT_GRN = '#10b981';
const ACCENT_CYAN = '#06b6d4';
const TEXT = '#f1f5f9';
const TEXT_MUTED = '#64748b';
const TEXT_DIM = '#334155';
const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(24px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
};

type DemoStep = 'validating' | 'beta' | 'assembling' | 'blueprint' | 'council' | 'reveal' | 'error';
type PromptCategory = 'healthcare' | 'ecommerce' | 'education' | 'logistics' | 'finance' | 'social' | 'analytics' | 'saas' | 'general';
type BetaMode = 'open' | 'invite' | 'waitlist' | 'closed';

interface AgentCard { icon: string; name: string; role: string; color: string; delay: number; }
interface CouncilEvent { delay: number; icon: string; agent: string; msg: string; status: 'running' | 'success'; }
interface Blueprint {
  targetUsers: string[]; features: string[]; roles: string[];
  pages: string[]; workflows: string[]; safeDefaults: string[];
}

const KEYWORD_MAP: Record<PromptCategory, string[]> = {
  healthcare: ['medical', 'hospital', 'doctor', 'patient', 'clinic', 'appointment', 'health', 'triage', 'ehr'],
  ecommerce: ['shop', 'store', 'buy', 'sell', 'product', 'inventory', 'checkout', 'cart', 'marketplace', 'restaurant', 'food', 'menu'],
  education: ['learn', 'course', 'lesson', 'student', 'teacher', 'quiz', 'curriculum', 'school', 'tutor'],
  logistics: ['delivery', 'shipping', 'tracking', 'fleet', 'route', 'logistics', 'warehouse', 'supply chain'],
  finance: ['payment', 'billing', 'invoice', 'accounting', 'budget', 'finance', 'banking', 'crypto', 'fintech'],
  social: ['social', 'community', 'profile', 'feed', 'follow', 'post', 'message', 'chat', 'creator'],
  analytics: ['analytics', 'dashboard', 'metrics', 'data', 'report', 'chart', 'insights', 'monitoring'],
  saas: ['saas', 'subscription', 'multi-tenant', 'workspace', 'team', 'organization', 'enterprise'],
  general: [],
};

const CATEGORY_DEFAULTS: Record<PromptCategory, { appName: string; emoji: string }> = {
  healthcare: { appName: 'MedFlow', emoji: '🏥' },
  ecommerce: { appName: 'ShopCore', emoji: '🛒' },
  education: { appName: 'LearnHub', emoji: '🎓' },
  logistics: { appName: 'FleetOps', emoji: '🚛' },
  finance: { appName: 'FinStack', emoji: '💳' },
  social: { appName: 'SocialApp', emoji: '💬' },
  analytics: { appName: 'DataViz', emoji: '📊' },
  saas: { appName: 'WorkSpace', emoji: '🏢' },
  general: { appName: 'AppCore', emoji: '🚀' },
};

function analyzePrompt(prompt: string): { category: PromptCategory; appName: string; emoji: string } {
  const lower = prompt.toLowerCase();
  for (const [cat, keywords] of Object.entries(KEYWORD_MAP) as [PromptCategory, string[]][]) {
    if (cat === 'general') continue;
    if (keywords.some(k => lower.includes(k))) {
      const buildMatch = prompt.match(/(?:build|create|make|develop)\s+(?:a\s+|an\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      const appName = buildMatch ? buildMatch[1] : CATEGORY_DEFAULTS[cat].appName;
      return { category: cat, appName, emoji: CATEGORY_DEFAULTS[cat].emoji };
    }
  }
  const buildMatch = prompt.match(/(?:build|create|make|develop)\s+(?:a\s+|an\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return {
    category: 'general',
    appName: buildMatch ? buildMatch[1] : CATEGORY_DEFAULTS.general.appName,
    emoji: CATEGORY_DEFAULTS.general.emoji,
  };
}

const AGENTS_BY_CATEGORY: Record<PromptCategory, AgentCard[]> = {
  healthcare: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🩺', name: 'Medical AI', role: 'Clinical Logic', color: ACCENT_GRN, delay: 200 },
    { icon: '⚖️', name: 'Compliance', role: 'HIPAA / HL7', color: '#f59e0b', delay: 400 },
    { icon: '🔒', name: 'Security', role: 'Auth & Audit', color: '#ef4444', delay: 600 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 800 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 1000 },
  ],
  ecommerce: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🛒', name: 'Commerce AI', role: 'Product Logic', color: ACCENT_GRN, delay: 200 },
    { icon: '💳', name: 'Payments', role: 'Stripe & Billing', color: '#f59e0b', delay: 400 },
    { icon: '📦', name: 'Inventory', role: 'Stock & Fulfil', color: ACCENT_CYAN, delay: 600 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 800 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 1000 },
  ],
  education: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🎓', name: 'Learning AI', role: 'Curriculum', color: ACCENT_GRN, delay: 200 },
    { icon: '📝', name: 'Assessment', role: 'Quiz & Grades', color: '#f59e0b', delay: 400 },
    { icon: '📈', name: 'Analytics', role: 'Progress', color: ACCENT_CYAN, delay: 600 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 800 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 1000 },
  ],
  logistics: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🗺️', name: 'Route AI', role: 'Optimization', color: ACCENT_GRN, delay: 200 },
    { icon: '🚛', name: 'Fleet', role: 'Vehicle Mgmt', color: '#f59e0b', delay: 400 },
    { icon: '📡', name: 'Tracking', role: 'Real-time GPS', color: ACCENT_CYAN, delay: 600 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 800 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 1000 },
  ],
  finance: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🔍', name: 'Fraud AI', role: 'Detection', color: ACCENT_GRN, delay: 200 },
    { icon: '📊', name: 'Risk', role: 'Risk Scoring', color: '#f59e0b', delay: 400 },
    { icon: '⚖️', name: 'Compliance', role: 'Regulations', color: '#ef4444', delay: 600 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 800 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 1000 },
  ],
  social: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🤖', name: 'AI Agent', role: 'Content & Feed', color: ACCENT_GRN, delay: 200 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 400 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 600 },
    { icon: '🔍', name: 'QA', role: 'Testing', color: '#f59e0b', delay: 800 },
    { icon: '🚀', name: 'DevOps', role: 'Deployment', color: ACCENT_CYAN, delay: 1000 },
  ],
  analytics: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🤖', name: 'AI Agent', role: 'Insight Engine', color: ACCENT_GRN, delay: 200 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 400 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 600 },
    { icon: '🔍', name: 'QA', role: 'Testing', color: '#f59e0b', delay: 800 },
    { icon: '🚀', name: 'DevOps', role: 'Deployment', color: ACCENT_CYAN, delay: 1000 },
  ],
  saas: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🤖', name: 'AI Agent', role: 'Core Logic', color: ACCENT_GRN, delay: 200 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 400 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 600 },
    { icon: '🔍', name: 'QA', role: 'Testing', color: '#f59e0b', delay: 800 },
    { icon: '🚀', name: 'DevOps', role: 'Deployment', color: ACCENT_CYAN, delay: 1000 },
  ],
  general: [
    { icon: '🏛️', name: 'Architect', role: 'System Design', color: ACCENT, delay: 0 },
    { icon: '🤖', name: 'AI Agent', role: 'Core Logic', color: ACCENT_GRN, delay: 200 },
    { icon: '⚙️', name: 'Backend', role: 'API & Data', color: ACCENT_CYAN, delay: 400 },
    { icon: '🎨', name: 'UI', role: 'Interface', color: '#a78bfa', delay: 600 },
    { icon: '🔍', name: 'QA', role: 'Testing', color: '#f59e0b', delay: 800 },
    { icon: '🚀', name: 'DevOps', role: 'Deployment', color: ACCENT_CYAN, delay: 1000 },
  ],
};

const BLUEPRINTS: Record<PromptCategory, Blueprint> = {
  healthcare: {
    targetUsers: ['Clinicians & Nurses', 'Patients & Caregivers', 'Hospital Admins'],
    features: ['Patient intake & triage', 'Appointment scheduling', 'EHR integration', 'Prescription management', 'Audit logging'],
    roles: ['Patient', 'Clinician', 'Admin'],
    pages: ['Dashboard', 'Patient Records', 'Appointments', 'Prescriptions', 'Reports'],
    workflows: ['Patient check-in flow', 'Appointment booking', 'Record handoff'],
    safeDefaults: ['HIPAA-compliant storage', 'Role-based access', 'Audit trail'],
  },
  ecommerce: {
    targetUsers: ['Online shoppers', 'Store owners', 'Fulfillment staff'],
    features: ['Product catalog', 'Cart & checkout', 'Payment processing', 'Order tracking', 'Inventory sync'],
    roles: ['Customer', 'Merchant', 'Fulfillment Agent'],
    pages: ['Storefront', 'Product Detail', 'Cart', 'Checkout', 'Order History'],
    workflows: ['Browse to purchase', 'Return & refund', 'Stock replenishment'],
    safeDefaults: ['PCI-DSS payments', 'SSL everywhere', 'Fraud detection'],
  },
  education: {
    targetUsers: ['Students', 'Instructors', 'Administrators'],
    features: ['Course builder', 'Video lessons', 'Quizzes & grading', 'Progress tracking', 'Certificates'],
    roles: ['Student', 'Instructor', 'Admin'],
    pages: ['Course Catalog', 'Lesson Player', 'Assessments', 'Progress', 'Certificates'],
    workflows: ['Course enrollment', 'Lesson completion', 'Certificate issuance'],
    safeDefaults: ['COPPA compliance', 'Secure content delivery', 'Grade privacy'],
  },
  logistics: {
    targetUsers: ['Drivers & Couriers', 'Dispatchers', 'Operations Managers'],
    features: ['Route optimization', 'Real-time tracking', 'Fleet management', 'Delivery confirmation', 'Analytics'],
    roles: ['Driver', 'Dispatcher', 'Manager'],
    pages: ['Map View', 'Orders', 'Fleet', 'Analytics', 'Settings'],
    workflows: ['Dispatch to delivery', 'Route recalculation', 'Incident reporting'],
    safeDefaults: ['GPS data encryption', 'Driver privacy', 'Offline capability'],
  },
  finance: {
    targetUsers: ['Individual users', 'Business owners', 'Finance teams'],
    features: ['Transaction tracking', 'Invoice generation', 'Budget planning', 'Fraud alerts', 'Reporting'],
    roles: ['User', 'Accountant', 'Admin'],
    pages: ['Dashboard', 'Transactions', 'Invoices', 'Reports', 'Settings'],
    workflows: ['Invoice creation', 'Payment reconciliation', 'Budget review'],
    safeDefaults: ['Bank-grade encryption', 'SOC 2 compliance', 'MFA required'],
  },
  social: {
    targetUsers: ['Content creators', 'Community members', 'Moderators'],
    features: ['User profiles', 'Content feed', 'Messaging', 'Follow system', 'Notifications'],
    roles: ['Member', 'Creator', 'Moderator'],
    pages: ['Feed', 'Profile', 'Messages', 'Explore', 'Notifications'],
    workflows: ['Post creation', 'Comment thread', 'Report & moderation'],
    safeDefaults: ['Content moderation', 'Privacy controls', 'Rate limiting'],
  },
  analytics: {
    targetUsers: ['Data analysts', 'Product managers', 'Executives'],
    features: ['Custom dashboards', 'Real-time metrics', 'Funnel analysis', 'Data export', 'Alerts'],
    roles: ['Analyst', 'Viewer', 'Admin'],
    pages: ['Dashboard', 'Explorer', 'Funnels', 'Reports', 'Alerts'],
    workflows: ['Dashboard creation', 'Alert setup', 'Data export'],
    safeDefaults: ['Data anonymization', 'GDPR compliance', 'Access controls'],
  },
  saas: {
    targetUsers: ['Teams & organizations', 'Power users', 'Enterprise admins'],
    features: ['Multi-tenant workspaces', 'Team management', 'Subscription billing', 'SSO', 'Admin console'],
    roles: ['Member', 'Admin', 'Super Admin'],
    pages: ['Workspace', 'Team', 'Billing', 'Integrations', 'Admin'],
    workflows: ['Team onboarding', 'Subscription upgrade', 'SSO configuration'],
    safeDefaults: ['Tenant isolation', 'SAML SSO', 'Audit logs'],
  },
  general: {
    targetUsers: ['End users', 'Administrators', 'Power users'],
    features: ['User authentication', 'Core functionality', 'Notifications', 'Settings', 'Analytics'],
    roles: ['User', 'Admin', 'Viewer'],
    pages: ['Dashboard', 'Main View', 'Settings', 'Profile', 'Help'],
    workflows: ['User onboarding', 'Core action flow', 'Settings update'],
    safeDefaults: ['Secure auth', 'Role-based access', 'Data backups'],
  },
};

const COUNCIL_SCRIPT: CouncilEvent[] = [
  { delay: 0,    icon: '🏛️', agent: 'Planner',   msg: 'Analyzing requirements…',        status: 'running' },
  { delay: 1100, icon: '🏛️', agent: 'Planner',   msg: 'Architecture plan ready ✓',      status: 'success' },
  { delay: 1400, icon: '🔷', agent: 'Architect', msg: 'Designing system structure…',    status: 'running' },
  { delay: 2600, icon: '🔷', agent: 'Architect', msg: 'System blueprint complete ✓',    status: 'success' },
  { delay: 2800, icon: '🗄️', agent: 'Database',  msg: 'Creating database schema…',      status: 'running' },
  { delay: 2900, icon: '⚙️', agent: 'Backend',   msg: 'Scaffolding REST API…',          status: 'running' },
  { delay: 3000, icon: '🎨', agent: 'Frontend',  msg: 'Building React frontend…',       status: 'running' },
  { delay: 4200, icon: '🗄️', agent: 'Database',  msg: 'PostgreSQL schema ready ✓',      status: 'success' },
  { delay: 5000, icon: '⚙️', agent: 'Backend',   msg: 'API endpoints live ✓',           status: 'success' },
  { delay: 5800, icon: '🎨', agent: 'Frontend',  msg: 'UI components complete ✓',       status: 'success' },
  { delay: 6000, icon: '🔍', agent: 'QA',        msg: 'Running test suite…',            status: 'running' },
  { delay: 6100, icon: '🛡️', agent: 'Security',  msg: 'Scanning for vulnerabilities…', status: 'running' },
  { delay: 7200, icon: '🔍', agent: 'QA',        msg: '42 tests passing ✓',             status: 'success' },
  { delay: 7400, icon: '🛡️', agent: 'Security',  msg: 'No vulnerabilities found ✓',    status: 'success' },
  { delay: 7600, icon: '🚀', agent: 'DevOps',    msg: 'Building container image…',     status: 'running' },
  { delay: 9200, icon: '🚀', agent: 'DevOps',    msg: 'Container deployed ✓',          status: 'success' },
  { delay: 9500, icon: '✨', agent: 'Observer',  msg: 'Your app is ready! 🎉',         status: 'success' },
];

const STEP_LABELS = ['Validating', 'Access', 'AI Team', 'Blueprint', 'Council', 'Preview'];
const STEP_PROGRESS: Record<DemoStep, number> = {
  validating: 1, beta: 2, assembling: 3, blueprint: 4, council: 5, reveal: 6, error: 1,
};

function FullScreenLoader({ text }: { text: string }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${TEXT_DIM}`, borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: TEXT_MUTED, fontSize: 18 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function TopBar({ step, onBack }: { step: DemoStep; onBack?: () => void }) {
  const progress = STEP_PROGRESS[step] ?? 1;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: TEXT, textDecoration: 'none', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>
            <span style={{ color: ACCENT }}>Factory</span>
          </a>
          {step !== 'validating' && (
            <a href="/" style={{ color: TEXT_MUTED, textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }} onClick={onBack}>
              ← Back
            </a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i < progress ? ACCENT : TEXT_DIM, transition: 'background 0.3s' }} />
              <span style={{ fontSize: 11, color: i < progress ? TEXT_MUTED : TEXT_DIM, display: 'none' }} className="step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 2, background: TEXT_DIM }}>
        <div style={{ height: '100%', background: ACCENT, width: `${(progress / 6) * 100}%`, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

function DemoFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prompt = searchParams.get('prompt') ?? '';

  const [step, setStep] = useState<DemoStep>('validating');
  const [betaMode, setBetaMode] = useState<BetaMode>('open');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visibleAgents, setVisibleAgents] = useState<number>(0);
  const [councilEvents, setCouncilEvents] = useState<CouncilEvent[]>([]);
  const [councilDone, setCouncilDone] = useState(false);
  const [blueprintExpanded, setBlueprintExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const analysis = analyzePrompt(prompt);
  const agents = AGENTS_BY_CATEGORY[analysis.category];
  const blueprint = BLUEPRINTS[analysis.category];
  const mockPreviewUrl = `preview.factory.run/demo-${Math.random().toString(36).slice(2, 8)}`;
  const mockUrlRef = useRef(mockPreviewUrl);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function addTimer(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }

  useEffect(() => {
    track('demo_started', { prompt_length: prompt.trim().length });
    if (prompt.trim().length < 5) {
      const msg = prompt.trim().length === 0
        ? 'No prompt provided. Tell us what you want to build.'
        : 'Your idea is too short. Tell us more.';
      setErrorMsg(msg);
      setStep('error');
      return;
    }
    if (prompt.trim().length > 500) {
      setErrorMsg('Your idea is too long. Please keep it under 500 characters.');
      setStep('error');
      return;
    }

    let mode: BetaMode = 'open';
    const betaFetch = fetch(`${API_BASE}/beta/status`)
      .then(r => r.ok ? r.json() : { mode: 'open', publicSignupEnabled: true })
      .then(d => { mode = d.mode ?? 'open'; })
      .catch(() => { mode = 'open'; });

    addTimer(async () => {
      await betaFetch;
      setBetaMode(mode);
      if (mode !== 'open') {
        track('beta_gate_seen', { mode });
        setStep('beta');
      } else {
        setStep('assembling');
      }
    }, 800);

    return () => clearTimers();
  }, [prompt]);

  useEffect(() => {
    if (step !== 'beta') return;
    if (betaMode === 'open') {
      addTimer(() => setStep('assembling'), 300);
    }
  }, [step, betaMode]);

  useEffect(() => {
    if (step !== 'assembling') return;
    track('ai_team_assembled', { agent_count: agents.length, prompt_category: analysis.category });
    setVisibleAgents(0);
    agents.forEach((_, i) => {
      addTimer(() => setVisibleAgents(i + 1), i * 200 + 100);
    });
    const totalDelay = agents.length * 200 + 100 + 400;
    addTimer(() => setStep('blueprint'), totalDelay);
    return () => clearTimers();
  }, [step]);

  useEffect(() => {
    if (step !== 'blueprint') return;
    track('blueprint_viewed', { prompt_category: analysis.category });
  }, [step]);

  useEffect(() => {
    if (step !== 'council') return;
    track('council_viewed', { prompt_category: analysis.category });
    setCouncilEvents([]);
    setCouncilDone(false);
    COUNCIL_SCRIPT.forEach(event => {
      addTimer(() => setCouncilEvents(prev => [...prev, event]), event.delay);
    });
    addTimer(() => setCouncilDone(true), 9600);
    return () => clearTimers();
  }, [step]);

  useEffect(() => {
    if (step !== 'reveal') return;
    track('preview_revealed', { prompt_category: analysis.category });
  }, [step]);

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviteError('');
    setInviteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/beta/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });
      if (res.ok) {
        setStep('assembling');
      } else {
        setInviteError('Invalid or expired invite code.');
      }
    } catch {
      setInviteError('Could not verify invite code. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: BG,
    color: TEXT,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    paddingTop: 80,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
    padding: '40px 16px',
  };

  if (step === 'validating') {
    return (
      <div style={{ minHeight: '100vh', background: BG }}>
        <TopBar step="validating" />
        <FullScreenLoader text="Reading your idea…" />
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div style={pageStyle}>
        <TopBar step="error" />
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', gap: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT }}>{errorMsg}</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/" style={{ padding: '10px 24px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, textDecoration: 'none', fontSize: 14 }}>
              ← Back to homepage
            </a>
            <button onClick={() => router.refresh()} style={{ padding: '10px 24px', background: ACCENT, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 14 }}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'beta') {
    return (
      <div style={pageStyle}>
        <TopBar step="beta" />
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', gap: 32, textAlign: 'center' }}>
          {betaMode === 'invite' && (
            <div style={{ ...GLASS, padding: 40, width: '100%', maxWidth: 440 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Enter your invite code</h2>
              <p style={{ color: TEXT_MUTED, marginBottom: 24 }}>Factory is in private beta. You need an invite to continue.</p>
              <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${inviteError ? '#ef4444' : BORDER}`, borderRadius: 8, color: TEXT, fontSize: 16, outline: 'none' }}
                />
                {inviteError && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{inviteError}</p>}
                <button type="submit" disabled={inviteLoading || !inviteCode.trim()} style={{ padding: '12px 24px', background: ACCENT, border: 'none', borderRadius: 8, color: '#fff', cursor: inviteLoading ? 'wait' : 'pointer', fontSize: 16, fontWeight: 600, opacity: inviteLoading || !inviteCode.trim() ? 0.6 : 1 }}>
                  {inviteLoading ? 'Verifying…' : 'Continue'}
                </button>
              </form>
            </div>
          )}
          {betaMode === 'waitlist' && (
            <div style={{ ...GLASS, padding: 40, width: '100%', maxWidth: 440 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>You're on the waitlist</h2>
              <p style={{ color: TEXT_MUTED, marginBottom: 24 }}>We'll notify you at your email when a spot opens up.</p>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT_MUTED, fontSize: 14 }}>
                We'll reach out soon — stay tuned!
              </div>
              <a href="/" style={{ display: 'block', marginTop: 20, color: TEXT_MUTED, textDecoration: 'none', fontSize: 14 }}>← Back to homepage</a>
            </div>
          )}
          {betaMode === 'closed' && (
            <div style={{ ...GLASS, padding: 40, width: '100%', maxWidth: 440 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Platform not accepting new users</h2>
              <p style={{ color: TEXT_MUTED, marginBottom: 24 }}>Factory is currently closed to new signups. Check back soon.</p>
              <a href="/" style={{ display: 'inline-block', padding: '10px 24px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, textDecoration: 'none', fontSize: 14 }}>
                ← Back to homepage
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'assembling') {
    return (
      <div style={pageStyle}>
        <TopBar step="assembling" />
        <div style={containerStyle}>
          <h1 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Assembling your AI team</h1>
          <p style={{ color: TEXT_MUTED, textAlign: 'center', marginBottom: 40 }}>Selecting specialized agents for your {analysis.category} project</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {agents.map((agent, i) => (
              <div key={agent.name} style={{ ...GLASS, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', opacity: visibleAgents > i ? 1 : 0, transform: visibleAgents > i ? 'none' : 'translateY(16px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
                <div style={{ fontSize: 32 }}>{agent.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: agent.color }}>{agent.name}</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>{agent.role}</div>
                {visibleAgents > i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT_GRN, animation: 'pulse 1.5s ease infinite' }} />}
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (step === 'blueprint') {
    return (
      <div style={pageStyle}>
        <TopBar step="blueprint" />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{analysis.emoji}</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Your startup blueprint</h1>
            <p style={{ color: TEXT_MUTED }}>{analysis.appName} — {analysis.category}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { title: 'App Name', items: [analysis.appName] },
              { title: 'Target Users', items: blueprint.targetUsers },
              { title: 'Core Features', items: blueprint.features },
              { title: 'User Roles', items: blueprint.roles },
              { title: 'Required Pages', items: blueprint.pages },
              { title: 'Core Workflows', items: blueprint.workflows },
            ].map(card => (
              <div key={card.title} style={{ ...GLASS, padding: 20 }}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{card.title}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {card.items.map(item => (
                    <li key={item} style={{ fontSize: 14, color: TEXT, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: ACCENT_GRN, fontSize: 10 }}>▸</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ ...GLASS, padding: 20, marginBottom: 32 }}>
            <button onClick={() => setBlueprintExpanded(v => !v)} style={{ width: '100%', background: 'none', border: 'none', color: TEXT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, padding: 0 }}>
              <span>View technical blueprint</span>
              <span style={{ color: TEXT_MUTED }}>{blueprintExpanded ? '▲' : '▼'}</span>
            </button>
            {blueprintExpanded && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Backend', value: 'NestJS + TypeScript' },
                  { label: 'Frontend', value: 'Next.js 16 + React' },
                  { label: 'Database', value: 'PostgreSQL 16' },
                  { label: 'Cache', value: 'Redis 7' },
                  { label: 'Safe Defaults', value: blueprint.safeDefaults.join(', ') },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: TEXT_MUTED }}>{row.label}</span>
                    <span style={{ color: ACCENT_CYAN }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setStep('council')} style={{ padding: '14px 40px', background: ACCENT, border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 17, fontWeight: 700 }}>
              Build this →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'council') {
    const successCount = councilEvents.filter(e => e.status === 'success').length;
    const hasWarnings = false;
    return (
      <div style={pageStyle}>
        <TopBar step="council" />
        <div style={containerStyle}>
          <h1 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>AI Council reviewing your build</h1>
          <p style={{ color: TEXT_MUTED, textAlign: 'center', marginBottom: 40 }}>Multi-agent review in progress…</p>
          <div style={{ ...GLASS, padding: 24, marginBottom: 24 }}>
            {councilEvents.map((event, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < councilEvents.length - 1 ? `1px solid ${BORDER}` : 'none', animation: 'fadeIn 0.3s ease' }}>
                <span style={{ fontSize: 18, minWidth: 24 }}>{event.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginRight: 8 }}>{event.agent}</span>
                  <span style={{ fontSize: 14, color: TEXT }}>{event.msg}</span>
                </div>
                <span style={{ fontSize: 12, color: event.status === 'success' ? ACCENT_GRN : '#f59e0b', fontWeight: 600 }}>
                  {event.status === 'success' ? '✓' : '…'}
                </span>
              </div>
            ))}
            {councilEvents.length === 0 && (
              <div style={{ color: TEXT_MUTED, textAlign: 'center', padding: '20px 0' }}>Starting council…</div>
            )}
          </div>
          {councilDone && (
            <div style={{ ...GLASS, padding: 32, textAlign: 'center', border: `1px solid ${ACCENT_GRN}`, animation: 'fadeIn 0.5s ease', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{hasWarnings ? '⚠️' : '✅'}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: hasWarnings ? '#f59e0b' : ACCENT_GRN, marginBottom: 8 }}>
                VERDICT: {hasWarnings ? 'APPROVED WITH WARNINGS' : 'APPROVED'}
              </div>
              <div style={{ color: TEXT_MUTED, fontSize: 14 }}>{successCount} checks passed · 0 critical issues</div>
              <button onClick={() => setStep('reveal')} style={{ marginTop: 24, padding: '14px 40px', background: ACCENT_GRN, border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
                Open preview →
              </button>
            </div>
          )}
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      </div>
    );
  }

  if (step === 'reveal') {
    return (
      <div style={pageStyle}>
        <TopBar step="reveal" />
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Your app is ready</h1>
          <p style={{ color: TEXT_MUTED, marginBottom: 40 }}>Factory built {analysis.appName} in under 10 seconds</p>
          <div style={{ ...GLASS, padding: 48, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 72 }}>{analysis.emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{analysis.appName}</div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: 6, border: `1px solid ${BORDER}` }}>
              {mockUrlRef.current}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button onClick={() => { navigator.clipboard?.writeText(mockUrlRef.current); setCopied(true); track('share_clicked'); setTimeout(() => setCopied(false), 2000); }} style={{ padding: '12px 24px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
              {copied ? '✓ Copied!' : 'Copy link'}
            </button>
            <button onClick={() => { if (navigator.share) { navigator.share({ title: analysis.appName, url: `https://${mockUrlRef.current}` }); } track('share_clicked'); }} style={{ padding: '12px 24px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
              Share
            </button>
            <button onClick={() => { track('remix_clicked'); router.push('/'); }} style={{ padding: '12px 24px', background: ACCENT, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
              Remix this app
            </button>
          </div>
          <a href="/" style={{ color: TEXT_MUTED, textDecoration: 'none', fontSize: 14 }}>← Build something else</a>
        </div>
      </div>
    );
  }

  return null;
}

export default function DemoPage() {
  return (
    <>
      <Suspense fallback={<FullScreenLoader text="Loading…" />}>
        <DemoFlow />
      </Suspense>
      <FeedbackWidget route="/demo" />
    </>
  );
}
