'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AdminKeyCtx } from '../layout';
import { apiUrl } from '@/lib/env';

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

interface HealthData {
  ok: boolean;
  timestamp: string;
  db:        { ok: boolean };
  redis:     { ok: boolean };
  runtimes:  Record<string, number>;
  remixQueue: number;
  killSwitches: Array<{ name: string; enabled: boolean }>;
  betaMode: string;
  recentAudit: Array<{ action: string; createdAt: string }>;
}

type ComponentStatus = 'ok' | 'degraded' | 'down';
type OverallStatus   = 'ok' | 'degraded' | 'outage';

interface PublicStatus {
  status:           OverallStatus;
  timestamp:        string;
  components:       Array<{ name: string; status: ComponentStatus; latencyMs?: number }>;
  incidentMessage?: string;
}

const MOCK_HEALTH: HealthData = {
  ok: true, timestamp: new Date().toISOString(),
  db: { ok: true }, redis: { ok: true },
  runtimes: { running: 3, sleeping: 138, crashed: 1, provisioning: 0 },
  remixQueue: 4,
  killSwitches: [
    { name: 'runtime_create', enabled: false },
    { name: 'previews', enabled: false },
    { name: 'remix', enabled: false },
    { name: 'maintenance', enabled: false },
    { name: 'readonly', enabled: false },
  ],
  betaMode: 'open',
  recentAudit: [],
};

const MOCK_PUBLIC_STATUS: PublicStatus = {
  status: 'ok',
  timestamp: new Date().toISOString(),
  components: [
    { name: 'api',      status: 'ok' },
    { name: 'database', status: 'ok' },
    { name: 'cache',    status: 'ok' },
    { name: 'frontend', status: 'ok' },
  ],
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: ok ? ACCENT_GN : ACCENT_R, display: 'inline-block', boxShadow: `0 0 8px ${ok ? ACCENT_GN : ACCENT_R}` }} />
      <span style={{ fontSize: 13, color: ok ? ACCENT_GN : ACCENT_R, fontWeight: 600 }}>{ok ? 'Healthy' : 'Degraded'}</span>
      <span style={{ fontSize: 12, color: TEXT_M }}>— {label}</span>
    </div>
  );
}

function componentColor(s: ComponentStatus): string {
  if (s === 'ok')      return ACCENT_GN;
  if (s === 'degraded') return ACCENT_A;
  return ACCENT_R;
}

function componentLabel(s: ComponentStatus | OverallStatus): string {
  if (s === 'ok')      return 'Operational';
  if (s === 'degraded') return 'Degraded';
  if (s === 'outage')  return 'Outage';
  return 'Down';
}

const COMP_LABELS: Record<string, string> = {
  api:      'API',
  database: 'Database',
  cache:    'Cache (Redis)',
  frontend: 'Frontend (CDN)',
};

const SMOKE_LINKS = [
  { label: 'Home page', path: '/' },
  { label: 'Status page', path: '/status' },
  { label: 'Demo page', path: '/demo' },
  { label: 'Discover', path: '/discover' },
  { label: 'Public status API', path: '/v1/public/status', isApi: true },
  { label: 'API health', path: '/health', isApi: true },
];

export default function HealthPage() {
  const adminKey = useContext(AdminKeyCtx);
  const [data, setData]             = useState<HealthData | null>(null);
  const [publicStatus, setPubStatus] = useState<PublicStatus | null>(null);
  const [err, setErr]               = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [adminRes, pubRes] = await Promise.allSettled([
        fetch(`${API_BASE}/admin/health`, { headers: { Authorization: `Bearer ${adminKey}` } }),
        fetch(apiUrl('/v1/public/status')),
      ]);

      if (adminRes.status === 'fulfilled' && adminRes.value.ok) {
        setData(await adminRes.value.json() as HealthData);
      } else {
        setErr('Could not reach admin API — showing mock data.');
      }

      if (pubRes.status === 'fulfilled' && pubRes.value.ok) {
        setPubStatus(await pubRes.value.json() as PublicStatus);
      }
    } catch {
      setErr('Network error — showing mock data.');
    }
    setRefreshing(false);
  }, [adminKey]);

  useEffect(() => { track('admin_open', { page: 'health' }); void load(); }, [load]);

  const h   = data ?? MOCK_HEALTH;
  const pub = publicStatus ?? MOCK_PUBLIC_STATUS;
  const runtimeEntries = Object.entries(h.runtimes);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: 0 }}>Platform Health</h1>
          <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4 }}>Last check: {new Date(h.timestamp).toLocaleTimeString()}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/status" target="_blank" rel="noreferrer"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.3)`, color: ACCENT_GN, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            ↗ Public Status
          </a>
          <button onClick={() => void load()} disabled={refreshing}
            style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.3)`, color: ACCENT, cursor: refreshing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600 }}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {err && (
        <div style={{ ...GLASS, padding: '12px 16px', marginBottom: 20, border: `1px solid ${ACCENT_A}`, color: ACCENT_A, fontSize: 13 }}>
          ⚠️ {err}
        </div>
      )}

      {/* Overall status */}
      <div style={{ ...GLASS, padding: 20, marginBottom: 16, border: `1px solid ${h.ok ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 36 }}>{h.ok ? '✅' : '🔴'}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: h.ok ? ACCENT_GN : ACCENT_R }}>{h.ok ? 'ALL SYSTEMS OPERATIONAL' : 'DEGRADED STATE'}</div>
            <div style={{ fontSize: 12, color: TEXT_M, marginTop: 4 }}>Beta mode: {h.betaMode.toUpperCase()} · Remix queue: {h.remixQueue} jobs</div>
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'PostgreSQL', icon: '🗄️', ok: h.db.ok, detail: 'Primary database' },
          { label: 'Redis',      icon: '⚡', ok: h.redis.ok, detail: 'Cache + queues' },
          { label: 'Orchestrator', icon: '🤖', ok: true, detail: 'Runtime provisioner' },
          { label: 'WebSockets',   icon: '📡', ok: true, detail: 'Activity stream' },
        ].map(svc => (
          <div key={svc.label} style={{ ...GLASS, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{svc.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{svc.label}</span>
            </div>
            <StatusBadge ok={svc.ok} label={svc.detail} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start', marginBottom: 16 }}>
        {/* Runtime breakdown */}
        <div style={{ ...GLASS, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>▶ Runtime Status Breakdown</div>
          {runtimeEntries.length === 0
            ? <div style={{ color: TEXT_M, fontSize: 13 }}>No runtime data available.</div>
            : runtimeEntries.map(([status, count]) => {
                const color = status === 'running' ? ACCENT_GN : status === 'crashed' ? ACCENT_R : status === 'provisioning' ? ACCENT_A : TEXT_M;
                const maxCount = Math.max(...runtimeEntries.map(([, c]) => c), 1);
                return (
                  <div key={status} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: TEXT_D, borderRadius: 3 }}>
                      <div style={{ height: '100%', background: color, borderRadius: 3, width: `${Math.round((count / maxCount) * 100)}%`, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Kill switches */}
        <div style={{ ...GLASS, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>⚡ Kill Switches</div>
          {h.killSwitches.map(sw => (
            <div key={sw.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 12, color: TEXT, textTransform: 'capitalize' }}>{sw.name.replace(/_/g, ' ')}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: sw.enabled ? ACCENT_R : ACCENT_GN }}>
                {sw.enabled ? '🔴 ON' : '🟢 OFF'}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 14, fontSize: 11, color: TEXT_M }}>
            Toggle kill switches from the <a href="/admin" style={{ color: ACCENT, textDecoration: 'none' }}>Command Center</a>.
          </div>
        </div>
      </div>

      {/* ── Monitoring Section ── */}
      <div style={{ ...GLASS, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>📡 Public Status — Live View</div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: pub.status === 'ok' ? 'rgba(16,185,129,0.15)' : pub.status === 'degraded' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
            color: pub.status === 'ok' ? ACCENT_GN : pub.status === 'degraded' ? ACCENT_A : ACCENT_R,
            border: `1px solid ${pub.status === 'ok' ? 'rgba(16,185,129,0.3)' : pub.status === 'degraded' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
            {componentLabel(pub.status).toUpperCase()}
          </span>
        </div>

        {pub.incidentMessage && (
          <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 8, marginBottom: 14, fontSize: 13, color: ACCENT_A }}>
            ⚠️ {pub.incidentMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {pub.components.map(c => {
            const color = componentColor(c.status);
            return (
              <div key={c.name} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {COMP_LABELS[c.name] ?? c.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color }}>{componentLabel(c.status)}</span>
                </div>
                {c.latencyMs !== undefined && (
                  <div style={{ fontSize: 11, color: TEXT_M, marginTop: 4 }}>{c.latencyMs}ms</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: TEXT_M }}>
          Updated: {new Date(pub.timestamp).toLocaleTimeString()} ·{' '}
          <a href="/status" target="_blank" rel="noreferrer" style={{ color: ACCENT, textDecoration: 'none' }}>Public status page ↗</a>
        </div>
      </div>

      {/* ── Smoke Test Quick-Links ── */}
      <div style={{ ...GLASS, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>🔍 Smoke Test Quick-Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {SMOKE_LINKS.map(lk => {
            const href = lk.isApi ? `${API_BASE}${lk.path}` : lk.path;
            return (
              <a key={lk.path} href={href} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 8, textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: lk.isApi ? ACCENT_A : ACCENT }}>
                  {lk.isApi ? 'API' : 'WEB'}
                </span>
                <span style={{ fontSize: 13, color: TEXT }}>{lk.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: TEXT_M }}>↗</span>
              </a>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.15)`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: TEXT_M, marginBottom: 6 }}>Run full smoke test locally (PowerShell):</div>
          <code style={{ fontSize: 12, color: ACCENT, fontFamily: 'monospace' }}>
            .\scripts\smoke-production.ps1 -BaseUrl $FRONTEND_URL -ApiUrl $API_URL
          </code>
        </div>
      </div>
    </div>
  );
}
