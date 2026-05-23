'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/env';
import { track } from '@/lib/analytics';

const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const ACCENT_R = '#ef4444';
const ACCENT_A = '#f59e0b';
const ACCENT_G = '#10b981';
const ACCENT_C = '#06b6d4';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const TEXT_D  = '#334155';
const BORDER  = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: 12 };
const FONT    = "'Geist','Inter',system-ui,sans-serif";

interface ProductSignal { event: string; count: number; lastSeen: string; }

interface SupportSummary {
  total: number; open: number; triaged: number; inProgress: number; resolved: number; closed: number;
  openCritical: number; byCategory: Record<string, number>; avgResolveSec: number;
  signals: ProductSignal[];
}

const MOCK_SUPPORT: SupportSummary = {
  total:9, open:4, triaged:2, inProgress:1, resolved:1, closed:1,
  openCritical:1, byCategory:{ BUG:4, QUALITY_ISSUE:2, BILLING:1, RUNTIME:1, GENERAL:1 },
  avgResolveSec:7200,
  signals:[
    { event:'feedback.bug', count:4, lastSeen: new Date().toISOString() },
    { event:'feedback.quality_issue', count:2, lastSeen: new Date().toISOString() },
    { event:'feedback.billing', count:1, lastSeen: new Date().toISOString() },
    { event:'ticket.status.resolved', count:1, lastSeen: new Date().toISOString() },
  ],
};

const FUNNEL_STEPS = [
  { label: 'Home Visited',      icon: '🏠', event: 'home_opened',      mock: 1240 },
  { label: 'Prompt Focused',    icon: '✍️', event: 'landing_prompt_focus', mock: 720 },
  { label: 'Demo Started',      icon: '▶️', event: 'demo_started',     mock: 441 },
  { label: 'Blueprint Viewed',  icon: '📋', event: 'blueprint_viewed', mock: 312 },
  { label: 'Council Viewed',    icon: '🏛️', event: 'council_viewed',   mock: 248 },
  { label: 'Preview Revealed',  icon: '🚀', event: 'preview_revealed', mock: 189 },
  { label: 'Workspace Opened',  icon: '🗂️', event: 'workspace_opened', mock: 97 },
];

const QUALITY_TRENDS = [
  { label: 'Generated apps with broken hooks',  count: 12, trend: '↑', color: ACCENT_R },
  { label: 'Missing test coverage reported',    count: 8,  trend: '→', color: ACCENT_A },
  { label: 'Positive quality reviews',          count: 34, trend: '↑', color: ACCENT_G },
  { label: 'AI output rejected by review gate', count: 5,  trend: '↓', color: ACCENT },
];

const TOP_BLOCKERS = [
  { label: 'Workspace loads blank after auth',    votes: 8,  category: 'BUG' },
  { label: 'Generated React has broken hooks',    votes: 6,  category: 'QUALITY_ISSUE' },
  { label: 'Preview cold start > 30s',            votes: 5,  category: 'RUNTIME' },
  { label: 'Stripe charges firing in test mode',  votes: 3,  category: 'BILLING' },
  { label: 'No export / download for projects',   votes: 11, category: 'FEATURE_REQUEST' },
];

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s' }} />
    </div>
  );
}

function MetricCard({ label, value, color = TEXT, sub = '' }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <div style={{ ...GLASS, padding: '18px 20px' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT_M, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: TEXT_D, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [support, setSupport] = useState<SupportSummary>(MOCK_SUPPORT);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(apiUrl('/admin/support/analytics'));
      if (res.ok) setSupport(await res.json() as SupportSummary);
    } catch { /* use mock */ }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    track('admin_analytics_opened');
    void load();
  }, [load]);

  const maxFunnel = FUNNEL_STEPS[0].mock;
  const catEntries = Object.entries(support.byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] ?? 1;
  const topSignals = (support.signals ?? []).slice(0, 8);

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: 0 }}>Product Analytics</h1>
          <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4 }}>Activation funnel · blockers · quality · support volume</p>
        </div>
        <button onClick={() => void load()} disabled={refreshing}
          style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.3)`, color: ACCENT, cursor: refreshing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600 }}>
          {refreshing ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {/* ── Activation Funnel ── */}
      <div style={{ ...GLASS, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>📈 Activation Funnel (7-day)</div>
        {FUNNEL_STEPS.map((step, i) => {
          const pct = Math.round((step.mock / maxFunnel) * 100);
          const conv = i > 0 ? Math.round((step.mock / FUNNEL_STEPS[i - 1].mock) * 100) : 100;
          return (
            <div key={step.event} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: TEXT }}>{step.icon} {step.label}</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: TEXT_M }}>{step.mock.toLocaleString()} users</span>
                  {i > 0 && <span style={{ fontSize: 12, color: conv > 60 ? ACCENT_G : conv > 30 ? ACCENT_A : ACCENT_R, fontWeight: 600 }}>{conv}% conv.</span>}
                </div>
              </div>
              <Bar pct={pct} color={i === 0 ? ACCENT : i === FUNNEL_STEPS.length - 1 ? ACCENT_G : ACCENT_C} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Support volume */}
        <div style={{ ...GLASS, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>🎫 Support Volume by Category</div>
          {catEntries.length === 0 ? (
            <div style={{ color: TEXT_M, fontSize: 13 }}>No tickets yet.</div>
          ) : catEntries.map(([cat, count]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: TEXT_M }}>{cat.replace('_', ' ')}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{count}</span>
              </div>
              <Bar pct={Math.round((count / maxCat) * 100)} color={cat === 'BILLING' ? ACCENT_R : cat === 'BUG' ? ACCENT_A : ACCENT} />
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_M }}>Avg resolve time</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: support.avgResolveSec < 3600 ? ACCENT_G : ACCENT_A }}>
              {support.avgResolveSec < 60 ? `${support.avgResolveSec}s` : support.avgResolveSec < 3600 ? `${Math.round(support.avgResolveSec / 60)}m` : `${(support.avgResolveSec / 3600).toFixed(1)}h`}
            </div>
          </div>
        </div>

        {/* Quality issue trends */}
        <div style={{ ...GLASS, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>🧪 Quality Issue Trends</div>
          {QUALITY_TRENDS.map(q => (
            <div key={q.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, color: TEXT, flex: 1 }}>{q.label}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: q.color }}>{q.trend}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: q.color }}>{q.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top blockers */}
      <div style={{ ...GLASS, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>🚧 Top Customer Blockers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {TOP_BLOCKERS.sort((a, b) => b.votes - a.votes).map((b, i) => (
            <div key={b.label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: i < 2 ? ACCENT_R : ACCENT_A, minWidth: 28 }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{b.label}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: TEXT_M }}>{b.category.replace('_', ' ')}</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(239,68,68,0.12)', color: ACCENT_R }}>🔥 {b.votes} votes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Remix Rate" value="18%" color={ACCENT_G} sub="remixes / demo starts" />
        <MetricCard label="Discovery Engagement" value="61%" color={ACCENT} sub="discover → app open" />
        <MetricCard label="Upgrade Intent" value="12%" color={ACCENT_A} sub="pricing_viewed users" />
        <MetricCard label="Preview Reveal Rate" value="43%" color={ACCENT_C} sub="demo → reveal" />
        <MetricCard label="Open Critical" value={support.openCritical} color={ACCENT_R} sub="tickets needing action" />
        <MetricCard label="Total Feedback" value={support.total} color={TEXT} sub="all time" />
      </div>

      {/* Product signals */}
      {topSignals.length > 0 && (
        <div style={{ ...GLASS, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>📡 Product Signals (top events)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {topSignals.map(sig => (
              <div key={sig.event} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 4, fontFamily: 'monospace' }}>{sig.event}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{sig.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
