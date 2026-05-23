'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';
import { FeedbackWidget } from '@/components/FeedbackWidget';

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


interface AppData {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  creator: string;
  creatorDisplay: string;
  category: string;
  likes: number;
  remixes: number;
  views: number;
  guarded: boolean;
  live: boolean;
  councilApproved: boolean;
  techStack: string[];
  features: string[];
  marketplacePacks: string[];
  bg: string;
}

const APPS_BY_SLUG: Record<string, AppData> = {
  'medibook-pro':   { id:'1',  emoji:'🏥', name:'MediBook Pro',   desc:'AI appointment booking with triage, insurance verification, and EHR integration.',   creator:'sarah_builds', creatorDisplay:'Sarah M.',   category:'Healthcare', likes:284,  remixes:12,  views:4821, guarded:true,  live:true,  councilApproved:true,  techStack:['NestJS','Next.js','PostgreSQL','Redis'],  features:['Patient intake & triage','Appointment scheduling','EHR integration','Prescription management'], marketplacePacks:['Healthcare Suite'], bg:'linear-gradient(135deg,#0a1628,#0f2040)' },
  'shopforge':      { id:'2',  emoji:'🛒', name:'ShopForge',      desc:'Full e-commerce with AI recommendations, dynamic pricing, and inventory AI.',         creator:'marc_dev',     creatorDisplay:'Marc T.',     category:'E-Commerce', likes:1240, remixes:89,  views:18400,guarded:false, live:true,  councilApproved:true,  techStack:['NestJS','Next.js','Stripe','Redis'],       features:['Product catalog','Cart & checkout','Payment processing','AI recommendations'], marketplacePacks:['E-Commerce Pro'], bg:'linear-gradient(135deg,#0a1a28,#061828)' },
  'financepulse':   { id:'3',  emoji:'📊', name:'FinancePulse',   desc:'Real-time financial analytics with AI forecasting and regulatory reporting.',         creator:'jaya_k',       creatorDisplay:'Jaya K.',     category:'Finance',    likes:456,  remixes:31,  views:7200, guarded:true,  live:true,  councilApproved:true,  techStack:['NestJS','Next.js','TimescaleDB'],          features:['Transaction tracking','AI forecasting','Regulatory reports','Budget planning'], marketplacePacks:['FinTech Core'], bg:'linear-gradient(135deg,#0a1520,#081520)' },
  'tutorai':        { id:'4',  emoji:'🎓', name:'TutorAI',        desc:'Personalized learning with adaptive AI curriculum and student analytics.',             creator:'lena_edu',     creatorDisplay:'Lena E.',     category:'Education',  likes:732,  remixes:47,  views:11200,guarded:false, live:false, councilApproved:true,  techStack:['NestJS','Next.js','PostgreSQL'],           features:['Course builder','Adaptive curriculum','Progress tracking','Certificates'], marketplacePacks:['EdTech Suite'], bg:'linear-gradient(135deg,#0d0a1e,#120a24)' },
  'routeiq':        { id:'5',  emoji:'🚚', name:'RouteIQ',        desc:'AI logistics optimizer with real-time fleet tracking and ETA prediction.',            creator:'kai_ops',      creatorDisplay:'Kai L.',      category:'Logistics',  likes:318,  remixes:22,  views:5100, guarded:false, live:true,  councilApproved:true,  techStack:['NestJS','Next.js','Redis','PostgreSQL'],   features:['Route optimization','Real-time tracking','Fleet management','ETA prediction'], marketplacePacks:['Logistics Intelligence'], bg:'linear-gradient(135deg,#0a1408,#081408)' },
  'creatoros':      { id:'6',  emoji:'🎨', name:'CreatorOS',      desc:'Creator monetization — subscriptions, digital products, AI content studio.',          creator:'riya_creates', creatorDisplay:'Riya K.',     category:'SaaS',       likes:2100, remixes:104, views:31000,guarded:false, live:true,  councilApproved:true,  techStack:['NestJS','Next.js','Stripe','PostgreSQL'],  features:['Subscription billing','Digital products','AI content studio','Fan analytics'], marketplacePacks:['Creator Tools'], bg:'linear-gradient(135deg,#1a0a14,#1a0818)' },
};

const MOCK_CHILDREN = [
  { emoji: '🔀', name: 'Variant Alpha', creator: '@dev_remix_1', color: ACCENT },
  { emoji: '✨', name: 'Enhanced Fork', creator: '@builder_42',  color: ACCENT_CYAN },
  { emoji: '🛠️', name: 'Custom Build',  creator: '@maker_99',    color: ACCENT_GRN },
];

const PACK_EMOJIS: Record<string, string> = {
  'Healthcare Suite':       '🏥',
  'E-Commerce Pro':         '🛒',
  'FinTech Core':           '💳',
  'EdTech Suite':           '🎓',
  'Logistics Intelligence': '🗺️',
  'Creator Tools':          '🎨',
};

function relativeTime(offsetMs: number): string {
  const m = Math.round(offsetMs / 60000);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const app = APPS_BY_SLUG[slug] ?? null;

  const [likes, setLikes] = useState(app?.likes ?? 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (app) {
      track('app_page_opened', { appId: app.id, category: app.category });
    }
  }, [app]);

  if (!app) {
    return (
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: TEXT, fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>App not found</h1>
        <p style={{ color: TEXT_MUTED, marginBottom: 32 }}>No app matched the slug <code style={{ background: SURFACE, padding: '2px 8px', borderRadius: 6 }}>{slug}</code></p>
        <button
          onClick={() => router.push('/discover')}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          ← Back to Discover
        </button>
      </div>
    );
  }

  const handleLike = () => {
    if (!liked) {
      setLikes(l => l + 1);
      setLiked(true);
      track('preview_open', { appId: app.id });
    }
  };

  const handleRemix = () => {
    track('remix_open', { appId: app.id });
    router.push(`/demo?prompt=Remix+${encodeURIComponent(app.name)}`);
  };

  const handleShare = () => {
    track('share_click', { appId: app.id });
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const now = Date.now();
  const activity = [
    { icon: '🔀', text: `@${app.creator} remixed this app → "Variant Alpha"`, time: relativeTime(now - 7200000) },
    { icon: '❤️', text: '14 new likes in the last hour', time: relativeTime(now - 3600000) },
    { icon: '👁',  text: '@new_user opened a preview', time: relativeTime(now - 2700000) },
    { icon: '⚙️', text: 'Factory Council re-reviewed: APPROVED ✓', time: relativeTime(now - 1800000) },
    { icon: '🚀', text: `Preview deployed to preview-${app.id}x7.factory.run`, time: relativeTime(now - 900000) },
  ];

  const statusDot = app.live
    ? { color: ACCENT_GRN, label: 'Live' }
    : { color: '#f59e0b', label: 'Building' };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT, fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, ...GLASS, borderRadius: 0, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 56 }}>
        <button
          onClick={() => router.push('/discover')}
          style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Factory
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</span>
        <button
          onClick={handleRemix}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Remix →
        </button>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 20px 60px' }}>

        {/* HERO */}
        <div style={{ ...GLASS, padding: 32, marginBottom: 20, background: app.bg, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{app.emoji}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ background: 'rgba(99,102,241,0.18)', color: ACCENT, border: `1px solid rgba(99,102,241,0.35)`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{app.category}</span>
                {app.guarded && (
                  <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>⚖️ Regulated</span>
                )}
                {app.councilApproved && (
                  <span style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>🛡️ Council Approved</span>
                )}
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 10px', color: TEXT, lineHeight: 1.1 }}>{app.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusDot.color, display: 'inline-block', boxShadow: `0 0 6px ${statusDot.color}` }} />
                  <span style={{ color: statusDot.color, fontWeight: 600 }}>{statusDot.label}</span>
                </span>
                <span style={{ color: TEXT_MUTED, fontSize: 12 }}>Generated with Factory ✦</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div style={{ ...GLASS, padding: '16px 24px', marginBottom: 20, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12 }}>
          {[
            { icon: '❤️', value: likes,      label: 'likes',   onClick: handleLike, active: liked, color: '#f43f5e' },
            { icon: '🔀', value: app.remixes, label: 'remixes', onClick: undefined,  active: false, color: ACCENT_CYAN },
            { icon: '👁', value: app.views,   label: 'views',   onClick: undefined,  active: false, color: ACCENT },
            { icon: '🕐', value: '9s',        label: 'build',   onClick: undefined,  active: false, color: ACCENT_GRN },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={stat.onClick ?? undefined}
              style={{ background: 'none', border: 'none', cursor: stat.onClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 8, transition: 'background 0.15s' }}
            >
              <span style={{ fontSize: 22 }}>{stat.icon}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: stat.active ? stat.color : TEXT }}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</span>
              <span style={{ fontSize: 11, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </button>
          ))}
        </div>

        {/* DESCRIPTION + TECH STACK */}
        <div style={{ ...GLASS, padding: 28, marginBottom: 20 }}>
          <p style={{ color: TEXT, fontSize: 16, lineHeight: 1.7, margin: '0 0 20px' }}>{app.desc}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},${ACCENT_CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 }}>
              {app.creatorDisplay.charAt(0)}
            </div>
            <div>
              <span style={{ color: TEXT_MUTED, fontSize: 13 }}>Created by </span>
              <span style={{ color: ACCENT, fontSize: 13, fontWeight: 600 }}>@{app.creator}</span>
              <div style={{ color: TEXT_MUTED, fontSize: 12 }}>{app.creatorDisplay}</div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Features</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {app.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: TEXT }}>
                  <span style={{ color: ACCENT_GRN, fontWeight: 700, fontSize: 13 }}>▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Tech Stack</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {app.techStack.map((t, i) => (
                <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: ACCENT, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* MARKETPLACE PACKS */}
        <div style={{ ...GLASS, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Marketplace packs used</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {app.marketplacePacks.map((pack, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.15)`, borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ fontSize: 24 }}>{PACK_EMOJIS[pack] ?? '📦'}</span>
                <span style={{ color: TEXT, fontWeight: 600, fontSize: 15 }}>{pack}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REMIX TREE */}
        <div style={{ ...GLASS, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Remix lineage</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Root node */}
            <div style={{ background: `rgba(99,102,241,0.12)`, border: `1px solid rgba(99,102,241,0.35)`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{app.emoji}</span>
              <div>
                <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{app.name}</div>
                <div style={{ color: ACCENT, fontSize: 12 }}>@{app.creator} · original</div>
              </div>
              <span style={{ marginLeft: 'auto', background: ACCENT, color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>ROOT</span>
            </div>

            {/* Children */}
            {MOCK_CHILDREN.map((child, i) => (
              <React.Fragment key={i}>
                <div style={{ paddingLeft: 28, color: TEXT_DIM, fontSize: 18, lineHeight: '28px', userSelect: 'none' }}>↓</div>
                <div style={{ marginLeft: 28, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{child.emoji}</span>
                  <div>
                    <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{child.name}</div>
                    <div style={{ color: child.color, fontSize: 11 }}>{child.creator}</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ACTIVITY STREAM */}
        <div style={{ ...GLASS, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Recent activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activity.map((item, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < activity.length - 1 ? `1px solid ${BORDER}` : 'none', animation: 'fadeIn 0.4s ease both', animationDelay: `${i * 80}ms` }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: TEXT, fontSize: 14, flex: 1, lineHeight: 1.5 }}>{item.text}</span>
                <span style={{ color: TEXT_MUTED, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button
            onClick={handleRemix}
            style={{ flex: 1, minWidth: 180, background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, padding: '16px 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Remix this app →
          </button>
          <button
            onClick={handleShare}
            style={{ flex: 1, minWidth: 140, background: SURFACE, color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(16px)', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
          >
            Share
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
      `}</style>
      <FeedbackWidget route={`/apps/${slug}`} />
    </div>
  );
}
