'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/env';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const ACCENT_GRN = '#10b981';
const ACCENT_AMB = '#f59e0b';
const ACCENT_RED = '#ef4444';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const FONT    = "'Geist','Inter',system-ui,sans-serif";

const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};

type ActivationState =
  | 'NEW' | 'INVITED' | 'PROFILE_STARTED' | 'IDEA_ENTERED' | 'DEMO_STARTED'
  | 'BLUEPRINT_VIEWED' | 'PREVIEW_REVEALED' | 'WORKSPACE_OPENED' | 'ACTIVATED' | 'STUCK';

interface AnalyticsData {
  total: number;
  byState: Record<ActivationState, number>;
  stuckCount: number;
  activatedCount: number;
  completionRate: number;
  avgStepsToPreview: number;
  topStuckReasons: { reason: string; count: number }[];
  betaReadinessScore: number;
}

const FUNNEL_STEPS: { state: ActivationState; label: string }[] = [
  { state: 'NEW',              label: 'Signed up' },
  { state: 'PROFILE_STARTED', label: 'Started profile' },
  { state: 'IDEA_ENTERED',    label: 'Entered idea' },
  { state: 'DEMO_STARTED',    label: 'Started demo' },
  { state: 'BLUEPRINT_VIEWED',label: 'Viewed blueprint' },
  { state: 'PREVIEW_REVEALED',label: 'Revealed preview' },
  { state: 'WORKSPACE_OPENED',label: 'Opened workspace' },
  { state: 'ACTIVATED',       label: 'Activated' },
];

const STUCK_REASON_LABELS: Record<string, string> = {
  NO_PROMPT_ENTERED: 'No idea entered',
  DEMO_ABANDONED:    'Demo abandoned',
  PREVIEW_FAILED:    'Preview failed',
  QUALITY_SCORE_LOW: 'Quality score low',
  WORKSPACE_IDLE:    'Workspace idle',
  BILLING_WALL_HIT:  'Hit billing wall',
  INVITE_PENDING:    'Invite pending',
  UNKNOWN:           'Unknown reason',
};

function MetricCard({ label, value, sub, color = TEXT }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ ...GLASS, padding: '20px 24px' }}>
      <div style={{ fontSize: 12, color: TEXT_M, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: TEXT_M, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function ReadinessGauge({ score }: { score: number }) {
  const color = score >= 70 ? ACCENT_GRN : score >= 40 ? ACCENT_AMB : ACCENT_RED;
  return (
    <div style={{ ...GLASS, padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: TEXT_M, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Beta Readiness Score
      </div>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        <div style={{
          width: 74, height: 74, borderRadius: '50%',
          background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color }}>{score}</span>
          <span style={{ fontSize: 10, color: TEXT_M }}>/ 100</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: score >= 70 ? ACCENT_GRN : score >= 40 ? ACCENT_AMB : ACCENT_RED, fontWeight: 700 }}>
        {score >= 70 ? 'Good' : score >= 40 ? 'Needs work' : 'Critical'}
      </div>
    </div>
  );
}

const MOCK_ANALYTICS: AnalyticsData = {
  total: 142,
  byState: {
    NEW:              18,
    INVITED:          12,
    PROFILE_STARTED:  21,
    IDEA_ENTERED:     28,
    DEMO_STARTED:     24,
    BLUEPRINT_VIEWED: 15,
    PREVIEW_REVEALED: 11,
    WORKSPACE_OPENED: 6,
    ACTIVATED:        5,
    STUCK:            2,
  },
  stuckCount: 2,
  activatedCount: 5,
  completionRate: 4,
  avgStepsToPreview: 4.8,
  topStuckReasons: [
    { reason: 'NO_PROMPT_ENTERED', count: 8 },
    { reason: 'DEMO_ABANDONED',    count: 5 },
    { reason: 'WORKSPACE_IDLE',    count: 3 },
    { reason: 'PREVIEW_FAILED',    count: 2 },
  ],
  betaReadinessScore: 62,
};

export default function AdminOnboardingPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(MOCK_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/admin/onboarding/analytics'))
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAnalytics(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const funnelMax = analytics.byState['NEW'] || analytics.total || 1;

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, color: TEXT, padding: '0 0 80px' }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT_M }}>
            <span style={{ color: TEXT_M, fontWeight: 600 }}>Admin</span>
            <span style={{ color: BORDER }}>/</span>
            <span style={{ color: TEXT, fontWeight: 600 }}>Activation Analytics</span>
          </div>
          {loading && <span style={{ fontSize: 12, color: TEXT_M }}>Loading…</span>}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 0' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Beta User Activation
        </h1>
        <p style={{ margin: '0 0 36px', fontSize: 14, color: TEXT_M }}>
          Funnel, stuck users, and readiness for public beta.
        </p>

        {/* Metric cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}>
          <MetricCard label="Total Users"       value={analytics.total} />
          <MetricCard label="Activated"         value={analytics.activatedCount} color={ACCENT_GRN}
                      sub={`${analytics.completionRate}% completion`} />
          <MetricCard label="Stuck Users"       value={analytics.stuckCount} color={ACCENT_AMB} />
          <MetricCard label="Avg Steps to Preview" value={analytics.avgStepsToPreview} sub="steps" />
          <ReadinessGauge score={analytics.betaReadinessScore} />
        </div>

        {/* Activation funnel */}
        <div style={{ ...GLASS, padding: 28, marginBottom: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Activation Funnel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FUNNEL_STEPS.map((fs, i) => {
              const count = analytics.byState[fs.state] ?? 0;
              const pct = Math.round((count / funnelMax) * 100);
              const convPct = i > 0
                ? Math.round((count / (analytics.byState[FUNNEL_STEPS[i - 1].state] || 1)) * 100)
                : 100;
              return (
                <div key={fs.state} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 160, fontSize: 13, color: TEXT_M, flexShrink: 0 }}>{fs.label}</div>
                  <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: fs.state === 'ACTIVATED' ? ACCENT_GRN : ACCENT,
                      borderRadius: 5, transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ width: 36, fontSize: 13, fontWeight: 700, textAlign: 'right', flexShrink: 0 }}>{count}</div>
                  {i > 0 && (
                    <div style={{
                      width: 52, fontSize: 11, textAlign: 'right', flexShrink: 0,
                      color: convPct >= 50 ? ACCENT_GRN : convPct >= 25 ? ACCENT_AMB : ACCENT_RED,
                    }}>
                      {convPct}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Top stuck reasons */}
          <div style={{ ...GLASS, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Top Stuck Reasons</h2>
            {analytics.topStuckReasons.length === 0 ? (
              <div style={{ fontSize: 13, color: TEXT_M }}>No stuck users — great sign!</div>
            ) : (
              analytics.topStuckReasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < analytics.topStuckReasons.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{STUCK_REASON_LABELS[r.reason] ?? r.reason}</div>
                    <div style={{ fontSize: 12, color: TEXT_M, marginTop: 2 }}>
                      {r.reason === 'NO_PROMPT_ENTERED' && 'Improve onboarding CTA or add example prompts'}
                      {r.reason === 'DEMO_ABANDONED' && 'Reduce demo friction or show progress indicators'}
                      {r.reason === 'WORKSPACE_IDLE' && 'Send re-engagement nudge after preview'}
                      {r.reason === 'PREVIEW_FAILED' && 'Check quality pipeline health'}
                      {r.reason === 'BILLING_WALL_HIT' && 'Review free tier limits'}
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT_AMB, marginLeft: 12 }}>{r.count}</div>
                </div>
              ))
            )}
          </div>

          {/* State distribution */}
          <div style={{ ...GLASS, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Users by State</h2>
            {FUNNEL_STEPS.map(fs => {
              const count = analytics.byState[fs.state] ?? 0;
              if (count === 0) return null;
              return (
                <div key={fs.state} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 13, color: TEXT_M }}>{fs.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{count}</span>
                </div>
              );
            })}
            {analytics.byState['STUCK'] > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, color: ACCENT_AMB }}>Stuck</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_AMB }}>{analytics.byState['STUCK']}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
