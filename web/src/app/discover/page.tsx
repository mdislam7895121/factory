'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';

const BG = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#6366f1';
const ACCENT_GRN = '#10b981';
const ACCENT_CYAN = '#06b6d4';
const TEXT = '#f1f5f9';
const TEXT_MUTED = '#64748b';
const TEXT_DIM = '#334155';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(24px)', border: `1px solid ${BORDER}`, borderRadius: 16 };


const SEEDED_APPS = [
  { id:'1',  emoji:'🏥', name:'MediBook Pro',   desc:'AI appointment booking with triage and EHR integration.',            creator:'sarah_builds', category:'healthcare', likes:284,  remixes:12,  views:4821,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#0a1628,#0f2040)' },
  { id:'2',  emoji:'🛒', name:'ShopForge',      desc:'Full e-commerce with AI recommendations and dynamic pricing.',       creator:'marc_dev',     category:'ecommerce',  likes:1240, remixes:89,  views:18400, guarded:false, live:true,  bg:'linear-gradient(135deg,#0a1a28,#061828)' },
  { id:'3',  emoji:'📊', name:'FinancePulse',   desc:'Real-time financial analytics with AI forecasting.',                 creator:'jaya_k',       category:'finance',    likes:456,  remixes:31,  views:7200,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#0a1520,#081520)' },
  { id:'4',  emoji:'🎓', name:'TutorAI',        desc:'Personalized learning with adaptive AI curriculum.',                 creator:'lena_edu',     category:'education',  likes:732,  remixes:47,  views:11200, guarded:false, live:false, bg:'linear-gradient(135deg,#0d0a1e,#120a24)' },
  { id:'5',  emoji:'🚚', name:'RouteIQ',        desc:'AI logistics optimizer with real-time fleet tracking.',              creator:'kai_ops',      category:'logistics',  likes:318,  remixes:22,  views:5100,  guarded:false, live:true,  bg:'linear-gradient(135deg,#0a1408,#081408)' },
  { id:'6',  emoji:'🎨', name:'CreatorOS',      desc:'Creator monetization — subscriptions, digital products, AI studio.',creator:'riya_creates', category:'saas',       likes:2100, remixes:104, views:31000, guarded:false, live:true,  bg:'linear-gradient(135deg,#1a0a14,#1a0818)' },
  { id:'7',  emoji:'🤖', name:'AgentFlow',      desc:'Multi-agent workflow builder with visual canvas and API triggers.',  creator:'devbot_42',    category:'saas',       likes:892,  remixes:67,  views:14200, guarded:false, live:true,  bg:'linear-gradient(135deg,#0f0a20,#1a0f30)' },
  { id:'8',  emoji:'🏠', name:'PropTrack',      desc:'AI property management with tenant screening and rent prediction.',  creator:'realty_ai',    category:'saas',       likes:421,  remixes:18,  views:6800,  guarded:false, live:false, bg:'linear-gradient(135deg,#0a120a,#0f1a0f)' },
  { id:'9',  emoji:'💬', name:'CommunityHub',   desc:'Social platform for niche communities with AI moderation.',          creator:'social_maker', category:'social',     likes:1580, remixes:93,  views:24100, guarded:false, live:true,  bg:'linear-gradient(135deg,#1a0a18,#200a20)' },
  { id:'10', emoji:'🔬', name:'LabFlow',        desc:'Lab management system with AI protocol generation and compliance.',  creator:'science_dev',  category:'healthcare', likes:234,  remixes:9,   views:3200,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#0a1628,#0a2040)' },
  { id:'11', emoji:'📈', name:'TradePilot',     desc:'Algorithmic trading platform with risk scoring and backtesting.',    creator:'quant_hq',     category:'finance',    likes:678,  remixes:41,  views:9800,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#060a20,#0a0f28)' },
  { id:'12', emoji:'🚀', name:'LaunchOS',       desc:'Startup operating system — OKRs, hiring, cap table, runway.',        creator:'founderhq',    category:'saas',       likes:943,  remixes:72,  views:15600, guarded:false, live:true,  bg:'linear-gradient(135deg,#1a0a08,#200f08)' },
  { id:'13', emoji:'🎵', name:'SoundForge',     desc:'AI music production with collaboration and licensing marketplace.',   creator:'beatlab',      category:'social',     likes:1320, remixes:88,  views:20400, guarded:false, live:true,  bg:'linear-gradient(135deg,#0f0a20,#180a30)' },
  { id:'14', emoji:'🌍', name:'ImpactTracker',  desc:'ESG reporting and impact measurement for enterprise compliance.',     creator:'green_build',  category:'analytics',  likes:287,  remixes:14,  views:4100,  guarded:true,  live:false, bg:'linear-gradient(135deg,#0a1a0a,#081808)' },
  { id:'15', emoji:'🤝', name:'DealRoom',       desc:'M&A deal management with AI due diligence and document analysis.',   creator:'corp_dev',     category:'finance',    likes:512,  remixes:27,  views:7400,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#0a0a20,#100a28)' },
  { id:'16', emoji:'🧬', name:'GenomicsLab',    desc:'Genomic data platform with AI variant interpretation and FHIR.',      creator:'biotech_ai',   category:'healthcare', likes:198,  remixes:7,   views:2800,  guarded:true,  live:true,  bg:'linear-gradient(135deg,#080a20,#0a0f2a)' },
  { id:'17', emoji:'📦', name:'InventoryAI',    desc:'Smart inventory management with demand forecasting and auto-reorder.',creator:'supply_ops',   category:'logistics',  likes:445,  remixes:33,  views:6900,  guarded:false, live:true,  bg:'linear-gradient(135deg,#0a1208,#0f1a08)' },
  { id:'18', emoji:'🎯', name:'TargetCRM',      desc:'AI-powered CRM with predictive lead scoring and pipeline analytics.',creator:'salesai',      category:'saas',       likes:876,  remixes:58,  views:13400, guarded:false, live:true,  bg:'linear-gradient(135deg,#1a0808,#20080a)' },
  { id:'19', emoji:'🧑‍💻', name:'DevMetrics', desc:'Engineering productivity analytics with PR insights and DORA.',        creator:'engops',       category:'analytics',  likes:634,  remixes:44,  views:9200,  guarded:false, live:true,  bg:'linear-gradient(135deg,#0a0f1a,#08101e)' },
  { id:'20', emoji:'🌐', name:'LocalizeAI',     desc:'AI translation and localization platform for global SaaS.',           creator:'global_dev',   category:'saas',       likes:389,  remixes:24,  views:5600,  guarded:false, live:false, bg:'linear-gradient(135deg,#0a1018,#081014)' },
];

const CREATORS = [
  { handle:'sarah_builds', display:'Sarah M.',  apps:8,  followers:'2.1k', specialty:'Healthcare AI', verified:true,  avi:'S', color:'rgba(99,102,241,0.25)' },
  { handle:'marc_dev',     display:'Marc T.',   apps:14, followers:'4.8k', specialty:'E-Commerce',    verified:true,  avi:'M', color:'rgba(6,182,212,0.25)'  },
  { handle:'riya_creates', display:'Riya K.',   apps:11, followers:'6.2k', specialty:'Creator Tools',  verified:true,  avi:'R', color:'rgba(236,72,153,0.25)' },
  { handle:'kai_ops',      display:'Kai L.',    apps:6,  followers:'1.4k', specialty:'Logistics',     verified:false, avi:'K', color:'rgba(245,158,11,0.25)' },
  { handle:'founderhq',    display:'FounderHQ', apps:3,  followers:'3.7k', specialty:'Startup OS',    verified:true,  avi:'F', color:'rgba(16,185,129,0.25)' },
];

const REMIX_CHAINS = [
  {
    root: { name:'ShopForge', emoji:'🛒', creator:'marc_dev' },
    children: [
      { name:'ShopForge + Subscriptions', emoji:'🔄', creator:'riya_creates', depth:1 },
      { name:'Restaurant Edition',         emoji:'🍕', creator:'kai_ops',      depth:1 },
      { name:'B2B Wholesale Fork',         emoji:'🏭', creator:'supply_ops',   depth:2, parentIdx:0 },
    ],
  },
  {
    root: { name:'MediBook Pro', emoji:'🏥', creator:'sarah_builds' },
    children: [
      { name:'Dental Edition',     emoji:'🦷', creator:'lena_edu',  depth:1 },
      { name:'Vet Clinic Edition', emoji:'🐾', creator:'devbot_42', depth:1 },
    ],
  },
  {
    root: { name:'TutorAI', emoji:'🎓', creator:'lena_edu' },
    children: [
      { name:'Corporate L&D',  emoji:'🏢', creator:'founderhq',   depth:1 },
      { name:'Kids Edition',   emoji:'👶', creator:'social_maker', depth:1 },
      { name:'Language Focus', emoji:'🌐', creator:'global_dev',   depth:2, parentIdx:1 },
    ],
  },
];

const TABS = ['Trending', 'New', 'Most Remixed', 'Most Viewed', 'Staff Picks', 'AI Companies'] as const;
type Tab = typeof TABS[number];

const CATEGORIES = ['All', 'Healthcare', 'E-commerce', 'Finance', 'Education', 'Logistics', 'Social', 'Analytics', 'SaaS'];

const STAFF_PICK_IDS = new Set(['1', '2', '3', '6', '12', '13']);
const AI_COMPANY_IDS = new Set(['7', '12', '18', '19', '6', '3']);

const CAT_MAP: Record<string, string> = {
  'Healthcare': 'healthcare', 'E-commerce': 'ecommerce', 'Finance': 'finance',
  'Education': 'education', 'Logistics': 'logistics', 'Social': 'social',
  'Analytics': 'analytics', 'SaaS': 'saas',
};

function applySort(tab: Tab, apps: typeof SEEDED_APPS): typeof SEEDED_APPS {
  switch (tab) {
    case 'New':           return [...apps].filter(a => !a.guarded).reverse();
    case 'Most Remixed':  return [...apps].sort((a, b) => b.remixes - a.remixes);
    case 'Most Viewed':   return [...apps].sort((a, b) => b.views - a.views);
    case 'Staff Picks':   return apps.filter(a => STAFF_PICK_IDS.has(a.id));
    case 'AI Companies':  return apps.filter(a => AI_COMPANY_IDS.has(a.id));
    default:              return apps;
  }
}

function useCountUp(target: number, duration = 1200): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

function AppCard({ app, onRemix }: { app: typeof SEEDED_APPS[0]; onRemix: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const statusColor = app.live ? ACCENT_GRN : '#f59e0b';
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: app.bg,
        border: `1px solid ${hovered ? ACCENT : BORDER}`,
        borderRadius: 16, padding: 20,
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'border-color 0.2s',
        boxShadow: hovered ? `0 0 20px rgba(99,102,241,0.15)` : 'none',
        minHeight: 220,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 32 }}>{app.emoji}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginTop: 4 }}>{app.name}</div>
        </div>
        <span style={{
          width: 10, height: 10, borderRadius: '50%', background: statusColor,
          boxShadow: app.live ? `0 0 6px ${ACCENT_GRN}` : undefined,
          display: 'inline-block', flexShrink: 0, marginTop: 6,
        }} />
      </div>

      <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
        {app.desc}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {app.creator[0].toUpperCase()}
        </div>
        <span style={{ fontSize: 12, color: TEXT_MUTED }}>@{app.creator}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: ACCENT, border: `1px solid rgba(99,102,241,0.25)` }}>
          {app.category}
        </span>
        {app.guarded && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
            ⚖️ Regulated
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED, display: 'flex', gap: 10 }}>
          <span>❤️ {app.likes.toLocaleString()}</span>
          <span>🔀 {app.remixes}</span>
          <span>👁 {app.views.toLocaleString()}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRemix(app.id); }}
          style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: ACCENT, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          Remix →
        </button>
      </div>
    </div>
  );
}

function CreatorCard({ creator, followed, onFollow }: { creator: typeof CREATORS[0]; followed: boolean; onFollow: (h: string) => void }) {
  return (
    <div style={{ ...GLASS, padding: 20, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: creator.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: TEXT }}>
        {creator.avi}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, display: 'flex', alignItems: 'center', gap: 6 }}>
          {creator.display}
          {creator.verified && <span style={{ fontSize: 12, color: ACCENT_CYAN }}>✓</span>}
        </div>
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>@{creator.handle}</div>
      </div>
      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.12)', color: ACCENT, alignSelf: 'flex-start' }}>
        {creator.specialty}
      </span>
      <div style={{ fontSize: 12, color: TEXT_MUTED, display: 'flex', gap: 12 }}>
        <span>{creator.apps} apps</span>
        <span>{creator.followers} followers</span>
      </div>
      <button
        onClick={() => onFollow(creator.handle)}
        style={{
          fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
          background: followed ? 'transparent' : ACCENT,
          color: followed ? TEXT_MUTED : '#fff',
          border: followed ? `1px solid ${BORDER}` : 'none',
          transition: 'all 0.2s',
        }}
      >
        {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

function RemixChain({ chain }: { chain: typeof REMIX_CHAINS[0] }) {
  return (
    <div style={{ ...GLASS, padding: 20, flex: '1 1 280px', minWidth: 260 }}>
      <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Chain origin</div>
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: `1px solid rgba(99,102,241,0.25)`, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{chain.root.emoji}</span>{' '}
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{chain.root.name}</span>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>@{chain.root.creator}</div>
      </div>
      {chain.children.map((child, i) => (
        <div key={i}>
          <div style={{ color: TEXT_DIM, fontSize: 14, paddingLeft: child.depth * 20, marginBottom: 2 }}>↓</div>
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, marginLeft: child.depth * 20, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>{child.emoji}</span>{' '}
            <span style={{ fontSize: 13, color: TEXT }}>{child.name}</span>
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 1 }}>@{child.creator}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Trending');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [shown, setShown] = useState(8);
  const [followed, setFollowed] = useState<string[]>([]);
  const [liveCount, setLiveCount] = useState(3);
  const scrollDepthRef = useRef<Set<number>>(new Set());
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appsBuilt = useCountUp(12847);
  const creatorsCount = useCountUp(4291);
  const remixesTotal = useCountUp(89342);

  useEffect(() => {
    track('discover_opened');
    const t = setInterval(() => setLiveCount(c => c >= 5 ? 2 : c + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      [25, 50, 75, 100].forEach(d => {
        if (pct >= d && !scrollDepthRef.current.has(d)) {
          scrollDepthRef.current.add(d);
          track('feed_scroll_depth', { depth: d });
        }
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setShown(8);
    track('discover_tab_change', { tab });
  }, []);

  const handleCategoryFilter = useCallback((cat: string) => {
    setActiveCategory(cat);
    setShown(8);
    track('discover_category_filter', { category: cat });
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setShown(8);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      track('discover_search', { queryLength: q.trim().length });
    }, 600);
  }, []);

  const handleRemix = useCallback((id: string) => {
    track('discover_app_remix_click', { appId: id });
    router.push('/demo');
  }, [router]);

  const handleLoadMore = useCallback(() => {
    setShown(s => {
      const next = s + 4;
      track('discover_feed_load_more', { page: Math.ceil(next / 4) });
      return next;
    });
  }, []);

  const handleFollow = useCallback((handle: string) => {
    setFollowed(f => f.includes(handle) ? f.filter(h => h !== handle) : [...f, handle]);
    track('creator_follow', { handle });
  }, []);

  const sorted = applySort(activeTab, SEEDED_APPS);
  const filtered = sorted.filter(a => {
    const catKey = CAT_MAP[activeCategory];
    if (catKey && a.category !== catKey) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.creator.toLowerCase().includes(q);
    }
    return true;
  });
  const visible = filtered.slice(0, shown);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(20px)', background: 'rgba(3,7,18,0.85)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="/" style={{ fontSize: 18, fontWeight: 800, color: TEXT, textDecoration: 'none', letterSpacing: -0.5 }}>Factory</a>
            <a href="/" style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: 'none' }}>← Back</a>
          </div>
          <button onClick={() => router.push('/demo')} style={{ fontSize: 13, padding: '8px 18px', borderRadius: 8, background: ACCENT, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Start building →
          </button>
        </div>
      </nav>

      {/* Hero stats strip */}
      <div style={{ paddingTop: 60, borderBottom: `1px solid ${BORDER}`, display: 'flex', overflowX: 'auto' }}>
        {[
          { label: 'apps built',      value: appsBuilt.toLocaleString(),      color: ACCENT,      pulse: false },
          { label: 'creators',        value: creatorsCount.toLocaleString(),   color: ACCENT_CYAN, pulse: false },
          { label: 'remixes',         value: remixesTotal.toLocaleString(),    color: '#ec4899',   pulse: false },
          { label: 'apps live right now', value: String(liveCount),            color: ACCENT_GRN,  pulse: true  },
        ].map((stat, i) => (
          <div key={i} style={{ flex: '1 0 160px', padding: '22px 28px', borderRight: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
                {stat.value}
              </span>
              {stat.pulse && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT_GRN, boxShadow: `0 0 8px ${ACCENT_GRN}`, display: 'inline-block' }} />
              )}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 60px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: -1 }}>Discover</h1>
          <p style={{ fontSize: 15, color: TEXT_MUTED, marginTop: 6, marginBottom: 0 }}>Explore apps built by the Factory community. Remix anything.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                flexShrink: 0, fontSize: 13, padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                background: activeTab === tab ? ACCENT : 'rgba(255,255,255,0.05)',
                color: activeTab === tab ? '#fff' : TEXT_MUTED,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search apps or creators..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 400, boxSizing: 'border-box', padding: '10px 16px', borderRadius: 10,
            border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', color: TEXT,
            fontSize: 14, outline: 'none', marginBottom: 14, display: 'block',
          }}
        />

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 32, scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              style={{
                flexShrink: 0, fontSize: 12, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                background: activeCategory === cat ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? ACCENT : TEXT_MUTED,
                border: `1px solid ${activeCategory === cat ? 'rgba(99,102,241,0.4)' : BORDER}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* First 8 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 20, marginBottom: 32 }}>
          {visible.slice(0, 8).map(app => (
            <AppCard key={app.id} app={app} onRemix={handleRemix} />
          ))}
        </div>

        {/* Creator spotlight */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Creator Spotlight</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
            {CREATORS.map(c => (
              <CreatorCard key={c.handle} creator={c} followed={followed.includes(c.handle)} onFollow={handleFollow} />
            ))}
          </div>
        </div>

        {/* Remaining cards beyond first 8 */}
        {visible.length > 8 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 20, marginBottom: 32 }}>
            {visible.slice(8).map(app => (
              <AppCard key={app.id} app={app} onRemix={handleRemix} />
            ))}
          </div>
        )}

        {/* Load more */}
        {shown < filtered.length && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <button
              onClick={handleLoadMore}
              style={{ fontSize: 14, padding: '10px 28px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', color: ACCENT, border: `1px solid rgba(99,102,241,0.3)`, cursor: 'pointer', fontWeight: 600 }}
            >
              Load more ({filtered.length - shown} remaining)
            </button>
          </div>
        )}

        {/* Remix chains */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Live remix chains</h2>
          <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>See how the community forks and extends each other's work.</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {REMIX_CHAINS.map((chain, i) => (
              <RemixChain key={i} chain={chain} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
