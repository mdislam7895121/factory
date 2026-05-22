'use client';
import React, { useContext } from 'react';
import { AdminKeyCtx } from '../layout';

const API_BASE  = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
const ACCENT    = '#6366f1';
const ACCENT_R  = '#ef4444';
const ACCENT_A  = '#f59e0b';
const ACCENT_GN = '#10b981';
const BORDER    = 'rgba(255,255,255,0.07)';
const SURFACE   = 'rgba(10,22,40,0.82)';
const TEXT      = '#f1f5f9';
const TEXT_M    = '#64748b';
const TEXT_D    = '#334155';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: 12 };

function track(event: string, meta?: Record<string, unknown>) {
  console.debug('[factory:admin]', { event, ts: Date.now(), ...meta });
}

const PLAN_DIST = [
  { plan: 'Free',       count: 8421, pct: 72, color: '#64748b' },
  { plan: 'Pro',        count: 2847, pct: 24, color: '#6366f1' },
  { plan: 'Enterprise', count: 421,  pct: 4,  color: '#10b981' },
];

const UPGRADE_FUNNEL = [
  { stage: 'Free users',       n: 8421 },
  { stage: 'Viewed Pro page',  n: 2100 },
  { stage: 'Started checkout', n: 847  },
  { stage: 'Upgraded to Pro',  n: 312  },
];

const QUOTA_VIOLATIONS = [
  { handle: 'heavy_user_1', plan: 'Free', violation: 'Runtime quota (5/5)',       ts: '2h ago' },
  { handle: 'heavy_user_2', plan: 'Free', violation: 'Remix quota (20/20 today)', ts: '4h ago' },
  { handle: 'heavy_user_3', plan: 'Free', violation: 'Runtime quota (5/5)',       ts: '6h ago' },
];

const RECENT_UPGRADES = [
  { handle: 'new_pro_1',   from: 'Free', to: 'Pro',        ts: '1h ago' },
  { handle: 'new_pro_2',   from: 'Free', to: 'Pro',        ts: '3h ago' },
  { handle: 'ent_upgrade', from: 'Pro',  to: 'Enterprise', ts: '12h ago' },
];

const PLAN_COLORS: Record<string, string> = { Free: TEXT_M, Pro: ACCENT, Enterprise: ACCENT_GN };

export default function BillingPage() {
  const adminKey = useContext(AdminKeyCtx);
  const totalUsers = PLAN_DIST.reduce((s, p) => s + p.count, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: 0 }}>Billing Operations</h1>
          <span style={{ color: TEXT_M, fontSize: 12, padding: '2px 10px', borderRadius: 20, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>No payment details — summary only</span>
        </div>
        <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Aggregate plan distribution, upgrade funnel and quota metrics.</p>
      </div>

      {/* MRR / ARR cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Monthly Recurring Revenue', value: '$28,470', sub: 'MRR', color: ACCENT_GN },
          { label: 'Annual Run Rate',            value: '$341,640', sub: 'ARR', color: ACCENT },
          { label: 'Total Users',                value: totalUsers.toLocaleString(), sub: 'across all plans', color: TEXT_M },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ ...GLASS, padding: '18px 20px' }}>
            <div style={{ color: TEXT_M, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
            <div style={{ color, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
            <div style={{ color: TEXT_D, fontSize: 11, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Plan distribution */}
        <div style={{ ...GLASS, padding: '20px 22px' }}>
          <div style={{ color: TEXT, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Plan Distribution</div>
          {/* Stacked bar */}
          <div style={{ height: 12, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
            {PLAN_DIST.map(p => (
              <div key={p.plan} style={{ width: `${p.pct}%`, background: p.color, transition: 'width 0.4s' }} />
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLAN_DIST.map(p => (
              <div key={p.plan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ color: TEXT_M, fontSize: 13 }}>{p.plan}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{p.count.toLocaleString()}</span>
                  <span style={{ color: TEXT_D, fontSize: 12, width: 32, textAlign: 'right' }}>{p.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade funnel */}
        <div style={{ ...GLASS, padding: '20px 22px' }}>
          <div style={{ color: TEXT, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Upgrade Funnel</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {UPGRADE_FUNNEL.map((step, i) => {
              const topN   = UPGRADE_FUNNEL[0].n;
              const prevN  = i > 0 ? UPGRADE_FUNNEL[i - 1].n : step.n;
              const barPct = Math.round((step.n / topN) * 100);
              const convPct = i > 0 ? Math.round((step.n / prevN) * 100) : 100;
              return (
                <div key={step.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: TEXT_M, fontSize: 12 }}>{step.stage}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>{step.n.toLocaleString()}</span>
                      {i > 0 && <span style={{ color: ACCENT_A, fontSize: 11 }}>{convPct}%</span>}
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barPct}%`, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_GN})`, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Quota violations */}
        <div style={{ ...GLASS, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Quota Violations</span>
            <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: `1px solid rgba(239,68,68,0.25)`, color: ACCENT_R, fontSize: 11, fontWeight: 700 }}>{QUOTA_VIOLATIONS.length}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Handle', 'Plan', 'Violation', 'When'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: TEXT_D, fontSize: 11, fontWeight: 500, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUOTA_VIOLATIONS.map((v, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '9px 0', color: TEXT, fontSize: 12, fontFamily: 'monospace' }}>@{v.handle}</td>
                  <td style={{ padding: '9px 0', color: PLAN_COLORS[v.plan] ?? TEXT_M, fontSize: 12, fontWeight: 600 }}>{v.plan}</td>
                  <td style={{ padding: '9px 0', color: ACCENT_A, fontSize: 11 }}>{v.violation}</td>
                  <td style={{ padding: '9px 0', color: TEXT_D, fontSize: 11 }}>{v.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent upgrades */}
        <div style={{ ...GLASS, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Recent Upgrades</span>
            <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: `1px solid rgba(16,185,129,0.25)`, color: ACCENT_GN, fontSize: 11, fontWeight: 700 }}>{RECENT_UPGRADES.length}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Handle', 'Upgrade', 'When'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: TEXT_D, fontSize: 11, fontWeight: 500, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_UPGRADES.map((u, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '9px 0', color: TEXT, fontSize: 12, fontFamily: 'monospace' }}>@{u.handle}</td>
                  <td style={{ padding: '9px 0', fontSize: 12 }}>
                    <span style={{ color: PLAN_COLORS[u.from] ?? TEXT_M }}>{u.from}</span>
                    <span style={{ color: TEXT_D, margin: '0 6px' }}>→</span>
                    <span style={{ color: PLAN_COLORS[u.to] ?? TEXT_M, fontWeight: 600 }}>{u.to}</span>
                  </td>
                  <td style={{ padding: '9px 0', color: TEXT_D, fontSize: 11 }}>{u.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety note */}
      <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.15)`, color: TEXT_M, fontSize: 12 }}>
        No Stripe credentials stored here. Admin view is aggregate-only. Payment details are handled exclusively by Stripe-side webhooks.
      </div>
    </div>
  );
}
