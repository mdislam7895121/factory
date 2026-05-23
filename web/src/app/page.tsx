'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { track, pageView } from '@/lib/analytics';
import { FeedbackWidget } from '@/components/FeedbackWidget';

void pageView;

// ─── Static data ──────────────────────────────────────────────────────────────

const EXAMPLES = [
  'Healthcare appointment booking with AI triage',
  'E-commerce store with dynamic pricing AI',
  'Real-time analytics dashboard',
  'Logistics tracker with route optimization',
  'Personalized learning platform',
];

const COUNCIL_FEED = [
  { icon: '🏛️', bg: 'rgba(99,102,241,0.15)',  agent: 'Architect',     msg: 'Designing domain model — 14 entities, 6 services' },
  { icon: '⚙️', bg: 'rgba(6,182,212,0.15)',   agent: 'Backend Agent',  msg: 'Scaffolding NestJS modules — auth, booking, triage' },
  { icon: '🎨', bg: 'rgba(16,185,129,0.15)',  agent: 'UI Agent',       msg: 'Building appointment calendar component…' },
  { icon: '🔍', bg: 'rgba(139,92,246,0.15)',  agent: 'Review Agent',   msg: 'HIPAA compliance check in progress' },
  { icon: '🚀', bg: 'rgba(245,158,11,0.15)',  agent: 'Deploy Agent',   msg: 'Preview environment warming up…' },
];

const STREAM_ENTRIES = [
  { icon: '🏛️', bg: 'rgba(99,102,241,0.12)', agent: 'Architect Agent', badge: 'Build',  cls: 'lstream-build',  msg: 'Generated domain model for MediBook Pro — 14 entities, 6 services', time: '0:02s' },
  { icon: '🤖', bg: 'rgba(6,182,212,0.12)',   agent: 'AI Triage Agent', badge: 'AI',    cls: 'lstream-ai',     msg: 'Trained symptom classifier for HealthFirst — 94.2% accuracy', time: '0:18s' },
  { icon: '🚀', bg: 'rgba(16,185,129,0.12)',  agent: 'Deploy Agent',    badge: 'Deploy', cls: 'lstream-deploy', msg: "@jaya's logistics dashboard is live at preview-k7x.factory.run", time: '1:04s' },
  { icon: '🔀', bg: 'rgba(139,92,246,0.12)',  agent: 'Remix Agent',     badge: 'Remix',  cls: 'lstream-remix',  msg: '@marc remixed ecommerce-starter → adding subscription billing', time: '1:31s' },
  { icon: '⚙️', bg: 'rgba(99,102,241,0.12)',  agent: 'Backend Agent',   badge: 'Build',  cls: 'lstream-build',  msg: 'Completed 47 passing tests for FinancePulse billing module', time: '2:15s' },
];

const APP_CARDS = [
  { emoji: '🏥', name: 'MediBook Pro',   desc: 'AI appointment booking with triage, insurance verification, EHR integration.',       creator: 'sarah_builds', avi: 'S', aviColor: 'rgba(99,102,241,0.22)', aviText: '#a5b4fc', likes: '284',  remixes: '12',  bg: 'linear-gradient(135deg,#0a1628,#0f2040)', delay: 0 },
  { emoji: '🛒', name: 'ShopForge',      desc: 'Full e-commerce with AI recommendations, dynamic pricing, and inventory AI.',         creator: 'marc_dev',     avi: 'M', aviColor: 'rgba(6,182,212,0.22)',   aviText: '#67e8f9', likes: '1.2k', remixes: '89',  bg: 'linear-gradient(135deg,#0a1a28,#061828)', delay: 0.4 },
  { emoji: '📊', name: 'FinancePulse',   desc: 'Real-time financial analytics with AI forecasting and regulatory reporting.',          creator: 'jaya_k',       avi: 'J', aviColor: 'rgba(16,185,129,0.22)',  aviText: '#6ee7b7', likes: '456',  remixes: '31',  bg: 'linear-gradient(135deg,#0a1520,#081520)', delay: 0 },
  { emoji: '🎓', name: 'TutorAI',        desc: 'Personalized learning with adaptive AI curriculum and student analytics.',             creator: 'lena_edu',     avi: 'L', aviColor: 'rgba(139,92,246,0.22)',  aviText: '#c4b5fd', likes: '732',  remixes: '47',  bg: 'linear-gradient(135deg,#0d0a1e,#120a24)', delay: 0.4 },
  { emoji: '🚚', name: 'RouteIQ',        desc: 'AI logistics optimizer with real-time fleet tracking and ETA prediction.',             creator: 'kai_ops',      avi: 'K', aviColor: 'rgba(245,158,11,0.22)',  aviText: '#fcd34d', likes: '318',  remixes: '22',  bg: 'linear-gradient(135deg,#0a1408,#081408)', delay: 0 },
  { emoji: '🎨', name: 'CreatorOS',      desc: 'Creator monetization — subscriptions, digital products, AI content studio.',           creator: 'riya_creates', avi: 'R', aviColor: 'rgba(236,72,153,0.22)',  aviText: '#f9a8d4', likes: '2.1k', remixes: '104', bg: 'linear-gradient(135deg,#1a0a14,#1a0818)', delay: 0.4 },
];

type PackBadge = { label: string; cls: string };
const PACKS = [
  { emoji: '🏥', name: 'Healthcare Suite',        desc: 'HIPAA-compliant agents for patient intake, clinical triage, EHR integration, and compliance.',        agents: ['🩺 Triage AI','📋 EHR Agent','🔒 Compliance','💊 Pharmacy'],          installs: '4,821',  badges: [{ label:'⚖️ Regulated', cls:'lbadge-regulated' },{ label:'✓ Verified', cls:'lbadge-verified' }] as PackBadge[], accent: 'linear-gradient(90deg,#ef4444,#f97316)' },
  { emoji: '🛒', name: 'E-Commerce Pro',          desc: 'Commerce agents for catalog management, pricing optimization, checkout flows, and post-purchase AI.',   agents: ['💰 Pricing AI','🏷️ Catalog','🔄 Returns','📦 Fulfillment'],          installs: '12,440', badges: [{ label:'⭐ Official', cls:'lbadge-official' }] as PackBadge[],                                                                           accent: 'linear-gradient(90deg,#3b82f6,#06b6d4)' },
  { emoji: '🚚', name: 'Logistics Intelligence',  desc: 'Fleet optimization, route intelligence, last-mile delivery, and supply chain AI.',                      agents: ['🗺️ Route AI','🚛 Fleet','📡 Tracking','⚖️ Compliance'],            installs: '2,103',  badges: [{ label:'✓ Verified', cls:'lbadge-verified' }] as PackBadge[],                                                                           accent: 'linear-gradient(90deg,#f59e0b,#eab308)' },
  { emoji: '🎓', name: 'EdTech Suite',            desc: 'Adaptive learning agents with curriculum design, assessment generation, and LMS integration.',           agents: ['📚 Curriculum','📝 Assessment','🧑‍🏫 Tutor AI','📈 Analytics'],     installs: '6,728',  badges: [{ label:'⭐ Official', cls:'lbadge-official' },{ label:'✓ Verified', cls:'lbadge-verified' }] as PackBadge[],                              accent: 'linear-gradient(90deg,#10b981,#34d399)' },
  { emoji: '💰', name: 'FinTech Core',            desc: 'SOX/PCI-compliant agents for transaction processing, fraud detection, and risk modeling.',               agents: ['🔍 Fraud AI','📊 Risk','⚖️ Compliance','💹 Trading'],              installs: '3,214',  badges: [{ label:'⚖️ Regulated', cls:'lbadge-regulated' },{ label:'🏢 Enterprise', cls:'lbadge-enterprise' }] as PackBadge[],                    accent: 'linear-gradient(90deg,#6366f1,#8b5cf6)' },
  { emoji: '🎨', name: 'Creator Tools',           desc: 'Monetization agents for creators — subscriptions, digital products, fan analytics, and content AI.',    agents: ['💳 Billing','📢 Marketing','📹 Content AI','🌟 Community'],         installs: '8,932',  badges: [{ label:'✓ Verified', cls:'lbadge-verified' }] as PackBadge[],                                                                           accent: 'linear-gradient(90deg,#ec4899,#f43f5e)' },
];

const TRUST_ITEMS = [
  { icon: '📸', name: 'Atomic Snapshots',      desc: 'Full runtime state captured before every AI operation. Roll back any change in seconds, not minutes.', metric: '⚡ Restore <30s' },
  { icon: '🔌', name: 'Detached Runtimes',     desc: 'Each runtime runs in full isolation. One build never affects another. Kill switches per workspace.',    metric: '🛡️ Full isolation' },
  { icon: '🔒', name: 'Security Audit Layer',  desc: 'Immutable audit trail for every agent action, API call, and code change. SOC 2 ready.',                metric: '📋 Full audit log' },
  { icon: '⚡', name: '99.9% Uptime SLA',      desc: 'Multi-region redundancy, automatic failover, and zero-downtime deployments included on Pro+.',         metric: '✅ 99.9% SLA' },
  { icon: '🌐', name: 'Global Preview CDN',    desc: 'Every runtime preview served from edge nodes worldwide. Sub-100ms load for any collaborator.',          metric: '🌍 <100ms global' },
  { icon: '🔑', name: 'Secrets Management',    desc: 'Env vars, API keys, and credentials encrypted at rest. Never exposed in logs or agent output.',         metric: '🔐 AES-256 encrypted' },
];

type PlanFeature = { text: string; yes: boolean };
type Plan = { name: string; price: string; period: string; desc: string; featured?: boolean; features: PlanFeature[]; cta: string; ctaStyle: 'outline' | 'solid' | 'ghost' };

const PLANS: Plan[] = [
  { name: 'Free',       price: '$0',     period: '/month', desc: 'Everything to start building.',              ctaStyle: 'outline', cta: 'Get started free',   features: [{ text: '3 runtimes', yes: true },{ text: '1 active at a time', yes: true },{ text: '10 AI generations/day', yes: true },{ text: '5 remixes/day', yes: true },{ text: 'Private previews', yes: false },{ text: 'Paid marketplace packs', yes: false }] },
  { name: 'Creator',    price: '$19',    period: '/month', desc: 'For builders shipping real products.',        ctaStyle: 'solid',   cta: 'Start Creator',       featured: true, features: [{ text: '10 runtimes', yes: true },{ text: '3 active at a time', yes: true },{ text: '100 AI generations/day', yes: true },{ text: '50 remixes/day', yes: true },{ text: 'Private previews', yes: true },{ text: 'Paid marketplace packs', yes: true }] },
  { name: 'Pro',        price: '$49',    period: '/month', desc: 'Unlimited power for serious teams.',          ctaStyle: 'outline', cta: 'Start Pro',           features: [{ text: '50 runtimes', yes: true },{ text: '10 active at a time', yes: true },{ text: 'Unlimited AI generations', yes: true },{ text: 'Unlimited remixes', yes: true },{ text: 'Custom branding', yes: true },{ text: 'Enterprise packs', yes: true }] },
  { name: 'Enterprise', price: 'Custom', period: '',       desc: 'Dedicated infra, SLAs, and compliance.',     ctaStyle: 'ghost',   cta: 'Talk to sales →',    features: [{ text: 'Unlimited runtimes', yes: true },{ text: 'Unlimited everything', yes: true },{ text: 'SSO + SAML', yes: true },{ text: 'Dedicated infrastructure', yes: true },{ text: '99.9% SLA guarantee', yes: true },{ text: 'SOC 2 / HIPAA', yes: true }] },
];

// ─── Shared style constants ───────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background: 'rgba(10,22,40,0.82)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
};
const BORDER_DIM = 'rgba(255,255,255,0.07)';
const TEXT_MUTED  = '#64748b';
const TEXT_DIM    = '#334155';
const ACCENT      = '#6366f1';
const ACCENT_CYAN = '#06b6d4';
const ACCENT_GRN  = '#10b981';

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [counts, setCounts] = useState({ agents: 2847, runtimes: 1204, previews: 8391, remixes: 342 });

  const handleBuild = useCallback(() => {
    const p = prompt.trim();
    if (!p) return;
    track('build_cta_click', { prompt_length: p.length });
    router.push('/demo?prompt=' + encodeURIComponent(p));
  }, [prompt, router]);

  useEffect(() => {
    track('home_opened');
    const t = setInterval(() => {
      setCounts(c => ({
        agents:   Math.max(2800, c.agents   + Math.floor(Math.random() * 3 - 1)),
        runtimes: Math.max(1100, c.runtimes + Math.floor(Math.random() * 2 - 1)),
        previews: c.previews + Math.floor(Math.random() * 5 + 1),
        remixes:  c.remixes  + (Math.random() > 0.6 ? 1 : 0),
      }));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{ background: '#030712', color: '#f1f5f9', minHeight: '100vh', overflowX: 'hidden', fontFamily: "-apple-system,'Inter','Segoe UI',system-ui,sans-serif" }}
      id="main-content"
    >

      {/* ── NAV ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(3,7,18,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER_DIM}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${ACCENT},${ACCENT_CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'white', boxShadow: `0 0 14px rgba(99,102,241,0.45)` }}>F</div>
          Factory
        </div>
        <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
          {[['#how','How it works'],['/discover','Ecosystem'],['#marketplace','Marketplace'],['#pricing','Pricing'],['/memory','Memory']].map(([href,label]) => (
            <li key={href}><a href={href} style={{ padding: '6px 13px', borderRadius: 8, fontSize: 13, color: TEXT_MUTED, textDecoration: 'none', display: 'block', transition: 'color 0.15s' }} onMouseEnter={e=>(e.currentTarget.style.color='#f1f5f9')} onMouseLeave={e=>(e.currentTarget.style.color=TEXT_MUTED)}>{label}</a></li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/dashboard" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, color: TEXT_MUTED, border: `1px solid ${BORDER_DIM}`, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.color='#f1f5f9';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}}
            onMouseLeave={e=>{e.currentTarget.style.color=TEXT_MUTED;e.currentTarget.style.borderColor=BORDER_DIM}}
          >Sign in</Link>
          <Link href="/dashboard" style={{ padding: '7px 17px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, textDecoration: 'none', boxShadow: '0 0 18px rgba(99,102,241,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 0 28px rgba(99,102,241,0.5)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 0 18px rgba(99,102,241,0.3)'}}
          >Start building →</Link>
        </div>
      </nav>

      {/* ── SECTION 1 — HERO ── */}
      <section
        aria-labelledby="hero-heading"
        style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background layers */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.14) 0%,transparent 60%), radial-gradient(ellipse 55% 40% at 82% 60%, rgba(6,182,212,0.07) 0%,transparent 50%), radial-gradient(ellipse 55% 40% at 18% 70%, rgba(139,92,246,0.07) 0%,transparent 50%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%,black 20%,transparent 80%)' }} />

        {/* Particles */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[
            { l:'10%',t:'18%',c:ACCENT,      d:'8s', del:'-2s', o:0.45 },
            { l:'80%',t:'14%',c:ACCENT_CYAN, d:'11s',del:'-4s', o:0.38 },
            { l:'62%',t:'72%',c:'#8b5cf6',   d:'9s', del:'-1s', o:0.28 },
            { l:'24%',t:'65%',c:ACCENT,      d:'13s',del:'-6s', o:0.25 },
            { l:'88%',t:'50%',c:ACCENT_CYAN, d:'7s', del:'-3s', o:0.35 },
            { l:'42%',t:'83%',c:ACCENT,      d:'10s',del:'-5s', o:0.20 },
            { l:'5%', t:'55%',c:'#8b5cf6',   d:'12s',del:'-7s', o:0.30 },
            { l:'72%',t:'32%',c:ACCENT,      d:'6s', del:'-1.5s',o:0.38 },
          ].map((p, i) => (
            <div key={i} className="l-particle" style={{ left: p.l, top: p.t, background: p.c, animationDuration: p.d, animationDelay: p.del, opacity: p.o }} />
          ))}
        </div>

        <div className="l-fade-up" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 860, gap: 26 }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 11, fontWeight: 600, color: ACCENT_GRN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span className="l-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT_GRN, display: 'inline-block' }} />
              Live · 2,847 agents running
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Operating System</span>
          </div>

          {/* Headline */}
          <h1 id="hero-heading" style={{ textAlign: 'center', fontSize: 'clamp(42px,7vw,78px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', margin: 0 }}>
            Type an idea.<br />
            <span className="l-grad-txt">Wake an AI company.</span>
          </h1>

          {/* Sub */}
          <p style={{ textAlign: 'center', fontSize: 'clamp(15px,2vw,18px)', color: TEXT_MUTED, maxWidth: 540, lineHeight: 1.65, margin: 0 }}>
            Factory spins up an entire AI-powered organization — architects, engineers, reviewers, deployers — the moment you describe what you want to build.
          </p>

          {/* PROMPT COMMAND CENTER */}
          <div style={{ width: '100%', maxWidth: 750, position: 'relative' }}>
            <div className="l-breathe l-glow-bdr" style={{ ...GLASS, overflow: 'hidden' }}>

              {/* Header indicators */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {[
                    { dot: 'rgba(6,182,212,1)', label: 'Council active' },
                    { dot: '#10b981', label: '3 agents ready' },
                  ].map(({ dot, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: TEXT_MUTED }}>
                      <span className="l-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />
                      {label}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_DIM}`, fontSize: 11, color: TEXT_MUTED }}>
                  ✦ Factory AI
                </div>
              </div>

              {/* Textarea area */}
              <div style={{ padding: '14px 16px', position: 'relative' }}>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onFocus={() => track('landing_prompt_focus')}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleBuild(); } }}
                  rows={3}
                  aria-label="Describe what you want to build"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#f1f5f9', fontSize: 16, fontFamily: 'inherit', lineHeight: 1.6, caretColor: ACCENT, zIndex: 1, position: 'relative' }}
                />
                {!prompt && (
                  <div aria-hidden="true" style={{ position: 'absolute', top: 14, left: 16, right: 16, display: 'flex', alignItems: 'flex-start', gap: 2, pointerEvents: 'none', color: TEXT_DIM, fontSize: 16, lineHeight: 1.6 }}>
                    <span>Build me a healthcare appointment platform with AI triage</span>
                    <span className="l-cursor" />
                  </div>
                )}
              </div>

              {/* Example chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 16px 12px' }}>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    onClick={() => { setPrompt(ex); track('starter_prompt_click', { prompt_length: ex.length }); }}
                    style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_DIM}`, fontSize: 12, color: TEXT_MUTED, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.borderColor = BORDER_DIM; }}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px 13px', borderTop: `1px solid ${BORDER_DIM}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {[['🎤','Voice input'],['📎','Attach file'],['📦','Choose domain pack']].map(([icon, label]) => (
                    <button key={label} aria-label={label} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER_DIM}`, background: 'rgba(255,255,255,0.04)', color: TEXT_MUTED, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = TEXT_MUTED; }}
                    >{icon}</button>
                  ))}
                </div>
                <button
                  onClick={handleBuild}
                  disabled={!prompt.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 10, background: prompt.trim() ? `linear-gradient(135deg,${ACCENT},#4f46e5)` : 'rgba(99,102,241,0.3)', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: prompt.trim() ? 'pointer' : 'not-allowed', boxShadow: prompt.trim() ? '0 0 22px rgba(99,102,241,0.38)' : 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (prompt.trim()) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(99,102,241,0.58)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = prompt.trim() ? '0 0 22px rgba(99,102,241,0.38)' : 'none'; }}
                >
                  <span>⚡</span> {prompt.trim() ? 'Generate live app' : 'Build with AI'}
                </button>
              </div>

              {/* Runtime strip */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '9px 16px', background: 'rgba(6,182,212,0.04)', borderTop: '1px solid rgba(6,182,212,0.1)' }}>
                {[['🏃','12','active runtimes'],['👁️','48','previews live'],['🔀','7','remixes today'],['📸','3','snapshots ready']].map(([icon,val,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: TEXT_MUTED }}>
                    {icon} <span style={{ fontWeight: 700, color: ACCENT_CYAN }}>{val}</span> {label}
                  </div>
                ))}
              </div>

            </div>

            {/* Council feed — desktop only */}
            <div aria-hidden="true" style={{ position: 'absolute', right: -276, top: 0, width: 256, ...GLASS, overflow: 'hidden', display: 'none' } as React.CSSProperties}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${BORDER_DIM}` }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED }}>Council Stream</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', fontSize: 10, fontWeight: 600, color: ACCENT_GRN }}>
                  <span className="l-pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT_GRN, display: 'inline-block' }} />Live
                </span>
              </div>
              <div style={{ padding: '6px 0', display: 'flex', flexDirection: 'column' }}>
                {COUNCIL_FEED.map((item, i) => (
                  <div key={i} className="l-stream" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 14px', animationDelay: `${i * 0.18}s` }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9', display: 'block' }}>{item.agent}</span>
                      <span style={{ fontSize: 11, color: TEXT_MUTED }}>{item.msg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live status bar */}
          <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20, padding: '11px 26px', background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${BORDER_DIM}`, borderRadius: 999, justifyContent: 'center' }}>
            {([['⚡',counts.agents,'agents running'],['🖥️',counts.runtimes,'live runtimes'],['👁️',counts.previews,'previews today'],['🔀',counts.remixes,'remixes']] as [string,number,string][]).map(([icon,val,label], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: TEXT_MUTED }}>
                {i > 0 && <span style={{ width: 1, height: 14, background: BORDER_DIM, display: 'inline-block', marginRight: 6 }} />}
                {icon} <span className="l-tick" style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{val.toLocaleString()}</span> {label}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 2 — HOW IT WORKS ── */}
      <div id="how" style={{ background: '#060d1a', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel>How Factory works</SectionLabel>
          <SectionTitle>From idea to company in minutes</SectionTitle>
          <SectionSub>An autonomous council of AI agents handles every layer — architecture, code, review, deployment, and iteration.</SectionSub>
          <div role="list" style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            {[
              { n:'01', icon:'💡', name:'Idea',    desc:'Describe what you want to build in plain language. No specs required.' },
              { n:'02', icon:'🏛️', name:'Council', desc:'AI agents debate, plan architecture, and assign work across specialist roles.' },
              { n:'03', icon:'⚙️', name:'Build',   desc:'Full-stack code written, tested, and reviewed by agents working in parallel.' },
              { n:'04', icon:'👁️', name:'Preview', desc:'Isolated live runtime spins up instantly. Share before you commit anything.' },
              { n:'05', icon:'🔀', name:'Remix',   desc:'Anyone can fork, iterate, and publish back to the community discovery feed.' },
            ].map((step, i, arr) => (
              <div key={step.n} role="listitem" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 22px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER_DIM}`, borderRight: i < arr.length - 1 ? 'none' : `1px solid ${BORDER_DIM}`, borderRadius: i === 0 ? '12px 0 0 12px' : i === arr.length - 1 ? '0 12px 12px 0' : 0, position: 'relative', transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', marginBottom: 14 }}>{step.n}</div>
                <div className="l-float" style={{ fontSize: 26, marginBottom: 10, animationDelay: `${i * -0.6}s` }}>{step.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{step.name}</div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.55 }}>{step.desc}</div>
                {i < arr.length - 1 && (
                  <div aria-hidden="true" style={{ position: 'absolute', right: -13, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 26, height: 26, borderRadius: '50%', background: '#030712', border: `1px solid ${BORDER_DIM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: ACCENT }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3 — LIVE STREAM ── */}
      <div style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(99,102,241,0.06) 0%,transparent 70%), #030712', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel>Real-time activity</SectionLabel>
          <SectionTitle>Watch the factory floor</SectionTitle>
          <SectionSub>Every build, deploy, and agent action streams live. Thousands of AI teams working right now.</SectionSub>
          <div role="log" aria-label="Live activity stream" aria-live="polite" style={{ ...GLASS, overflow: 'hidden' }}>
            {/* Terminal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: `1px solid ${BORDER_DIM}`, background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
                  {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>factory-activity-stream.live</span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', fontSize: 10, fontWeight: 600, color: ACCENT_GRN }}>
                <span className="l-pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT_GRN, display: 'inline-block' }} />Live
              </span>
            </div>
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 300 }}>
              {STREAM_ENTRIES.map((entry, i) => (
                <div key={i} className={`l-stream ${entry.cls}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER_DIM}`, background: 'rgba(255,255,255,0.025)', animationDelay: `${i * 0.14}s` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: entry.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{entry.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>
                      {entry.agent}
                      <span className={entry.cls} style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, marginLeft: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{entry.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{entry.msg}</div>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_DIM, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{entry.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4 — APP DISCOVERY ── */}
      <div id="discovery" style={{ background: '#060d1a', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel>Public discovery</SectionLabel>
          <SectionTitle>Apps built by the community</SectionTitle>
          <SectionSub>Browse, fork, and remix thousands of live apps. Every build is a starting point.</SectionSub>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {APP_CARDS.map(card => (
              <div key={card.name} tabIndex={0} role="article"
                style={{ ...GLASS, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = BORDER_DIM; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ height: 130, background: card.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, overflow: 'hidden' }}>
                  {card.emoji}
                  <div className="l-scan-line" style={{ animationDelay: card.delay + 's' }} />
                  <span style={{ position: 'absolute', top: 8, left: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontSize: 10, fontWeight: 700, color: ACCENT_GRN, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Live</span>
                </div>
                <div style={{ padding: '13px 15px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{card.name}</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 10 }}>{card.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_MUTED }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: card.aviColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: card.aviText }}>{card.avi}</div>
                      @{card.creator}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                      <span style={{ color: TEXT_DIM }}>❤️ {card.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.09)', border: '1px solid rgba(139,92,246,0.18)', fontSize: 11, color: '#c4b5fd' }}>🔀 {card.remixes} remixes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/discover" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 10, border: `1px solid ${BORDER_DIM}`, color: '#f1f5f9', textDecoration: 'none', fontSize: 15, fontWeight: 600, background: 'rgba(99,102,241,0.08)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)'; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = BORDER_DIM; }}
            >Browse the full ecosystem →</Link>
          </div>
        </div>
      </div>

      {/* ── SECTION 5 — MARKETPLACE ── */}
      <div id="marketplace" style={{ background: '#030712', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel>AI Marketplace</SectionLabel>
          <SectionTitle>Domain packs. Instant power.</SectionTitle>
          <SectionSub>Install pre-built AI agent collections. One click adds a full team of domain specialists to your runtime.</SectionSub>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
            {PACKS.map(pack => (
              <div key={pack.name} tabIndex={0}
                style={{ ...GLASS, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = BORDER_DIM; }}
              >
                {/* Accent top bar */}
                <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: pack.accent }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 4 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER_DIM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{pack.emoji}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {pack.badges.map(b => (
                      <span key={b.label} className={b.cls} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{b.label}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{pack.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>{pack.desc}</div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {pack.agents.map(a => (
                    <span key={a} style={{ padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_DIM}`, fontSize: 11, color: TEXT_MUTED }}>{a}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${BORDER_DIM}` }}>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>Installed by <strong style={{ color: '#f1f5f9' }}>{pack.installs}</strong> teams</span>
                  <button style={{ padding: '6px 14px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER_DIM}`, color: '#f1f5f9', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#a5b4fc'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER_DIM; e.currentTarget.style.color = '#f1f5f9'; }}
                  >Install pack</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 6 — TRUST ── */}
      <div style={{ background: '#060d1a', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel>Trust infrastructure</SectionLabel>
          <SectionTitle>Built for production, not demos.</SectionTitle>
          <SectionSub>Every runtime, snapshot, and deploy is backed by enterprise-grade reliability infrastructure.</SectionSub>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {TRUST_ITEMS.map(item => (
              <div key={item.name} style={{ ...GLASS, padding: 28, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.28)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER_DIM)}
              >
                <div style={{ fontSize: 26, lineHeight: 1 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{item.name}</div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.55 }}>{item.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', fontSize: 12, fontWeight: 700, color: ACCENT_GRN, alignSelf: 'flex-start' }}>{item.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 7 — PRICING ── */}
      <div id="pricing" style={{ background: '#030712', padding: '100px 24px' }} onMouseEnter={() => track('pricing_viewed')}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel>Simple pricing</SectionLabel>
          <SectionTitle>Start free. Scale without limits.</SectionTitle>
          <SectionSub>One plan for every stage — from solo experiment to funded company.</SectionSub>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {PLANS.map(plan => (
              <div key={plan.name}
                style={{ ...GLASS, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', transition: 'all 0.2s', ...(plan.featured ? { borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)', boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 20px 60px rgba(99,102,241,0.1)' } : {}) }}
                onMouseEnter={e => !plan.featured && (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.28)')}
                onMouseLeave={e => !plan.featured && (e.currentTarget.style.borderColor = BORDER_DIM)}
              >
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', padding: '3px 14px', borderRadius: 999, background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, fontSize: 11, fontWeight: 700, color: 'white', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>Most popular</div>
                )}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT_MUTED, marginBottom: 10 }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: plan.price === 'Custom' ? 28 : 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1 }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 14, color: TEXT_MUTED }}>{plan.period}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>{plan.desc}</div>
                </div>
                <div style={{ width: '100%', height: 1, background: BORDER_DIM }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: TEXT_MUTED }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, background: f.yes ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)', color: f.yes ? ACCENT_GRN : TEXT_DIM }}>
                        {f.yes ? '✓' : '✗'}
                      </div>
                      {f.text}
                    </div>
                  ))}
                </div>
                <button
                  style={{ marginTop: 'auto', padding: '10px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s', ...(
                    plan.ctaStyle === 'solid'   ? { background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.3)' } :
                    plan.ctaStyle === 'ghost'   ? { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER_DIM}`, color: '#f1f5f9' } :
                                                  { background: 'transparent', border: `1px solid ${BORDER_DIM}`, color: TEXT_MUTED }
                  ) }}
                  onMouseEnter={e => {
                    if (plan.ctaStyle === 'solid')   { e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }
                    if (plan.ctaStyle === 'outline')  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#f1f5f9'; }
                    if (plan.ctaStyle === 'ghost')    { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }
                  }}
                  onMouseLeave={e => {
                    if (plan.ctaStyle === 'solid')   { e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'; e.currentTarget.style.transform = ''; }
                    if (plan.ctaStyle === 'outline')  { e.currentTarget.style.borderColor = BORDER_DIM; e.currentTarget.style.color = TEXT_MUTED; }
                    if (plan.ctaStyle === 'ghost')    { e.currentTarget.style.borderColor = BORDER_DIM; }
                  }}
                >{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 8 — FINAL CTA ── */}
      <div style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(99,102,241,0.1) 0%,transparent 70%), #030712', padding: '140px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative rings */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
          {[600, 900, 1200].map(s => (
            <div key={s} style={{ width: s, height: s, borderRadius: '50%', border: `1px solid rgba(99,102,241,${0.08 - s/10000 * 4})`, position: 'absolute' }} />
          ))}
        </div>
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 11, fontWeight: 600, color: ACCENT_GRN, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28 }}>
            <span className="l-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT_GRN, display: 'inline-block' }} />
            2,847 companies building right now
          </div>
          <h2 style={{ fontSize: 'clamp(44px,7vw,78px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#f1f5f9', marginBottom: 24 }}>
            Build your<br /><span className="l-grad-txt">company.</span>
          </h2>
          <p style={{ fontSize: 18, color: TEXT_MUTED, marginBottom: 40, lineHeight: 1.6 }}>Type one sentence. An AI company wakes up and starts building.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/demo"
              style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: 'white', background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.38)', transition: 'all 0.15s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(99,102,241,0.58)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.38)'; }}
            >Start building free →</Link>
            <button style={{ padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: TEXT_MUTED, background: 'transparent', border: `1px solid ${BORDER_DIM}`, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.borderColor = BORDER_DIM; }}
            >Watch a build live</button>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: TEXT_DIM }}>No credit card. No setup. First runtime in &lt;60 seconds.</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${BORDER_DIM}`, padding: '36px 24px', background: '#030712' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: TEXT_MUTED }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg,${ACCENT},${ACCENT_CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: 'white' }}>F</div>
            Factory
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }} aria-label="Footer navigation">
            {['Product','Docs','Marketplace','Pricing','Blog','Status','Privacy','Terms'].map(label => (
              <a key={label} href="#" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT_MUTED)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_DIM)}
              >{label}</a>
            ))}
          </nav>
          <span style={{ fontSize: 12, color: TEXT_DIM }}>© 2025 Factory. All rights reserved.</span>
        </div>
      </footer>

      <FeedbackWidget route="/" />
    </div>
  );
}

// ─── Section layout helpers ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
      <span style={{ display: 'block', width: 20, height: 1, background: ACCENT }} />
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 'clamp(26px,3.8vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1.1, marginBottom: 14, marginTop: 0 }}>{children}</h2>;
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 17, color: TEXT_MUTED, maxWidth: 520, lineHeight: 1.65, marginBottom: 52, marginTop: 0 }}>{children}</p>;
}
