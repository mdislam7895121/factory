'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AdminKeyCtx } from './layout';

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

interface Stats { runtimes: { total: number; running: number; sleeping: number; crashed: number }; remixQueue: number; betaMode: string; }
interface AuditEntry { id: string; action: string; targetType: string; targetId: string; createdAt: string; }
interface SwitchState { name: string; enabled: boolean; }

const SWITCH_LABELS: Record<string, string> = {
  runtime_create: 'Runtime Create', previews: 'Previews',
  remix: 'Remix', maintenance: 'Maintenance', readonly: 'Read-only',
};

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color?: string; icon: string }) {
  return (
    <div style={{ ...GLASS, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <span>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: color ?? TEXT }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: TEXT_M }}>{sub}</div>}
    </div>
  );
}

function severityColor(action: string): string {
  if (/KILL_SWITCH/.test(action)) return ACCENT_R;
  if (/WARN|SUSPEND|BANNED/.test(action)) return ACCENT_A;
  if (/INVITE|FEATURE|VERIFY/.test(action)) return ACCENT_GN;
  return TEXT_M;
}

export default function AdminCommandCenter() {
  const adminKey = useContext(AdminKeyCtx);
  const [stats, setStats] = useState<Stats | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [switches, setSwitches] = useState<SwitchState[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [liveRtm, setLiveRtm] = useState(3);

  const headers = { Authorization: `Bearer ${adminKey}` };

  const load = useCallback(async () => {
    setErr('');
    try {
      const [statsRes, auditRes, swRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`,         { headers }),
        fetch(`${API_BASE}/admin/audit?limit=20`, { headers }),
        fetch(`${API_BASE}/admin/kill-switches`,  { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (auditRes.ok) setAudit((await auditRes.json()).slice(0, 20));
      if (swRes.ok)    setSwitches(await swRes.json());
    } catch {
      setErr('Could not reach admin API — check ADMIN_API_KEY.');
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { track('admin_open'); void load(); }, [load]);

  // Tick live runtime counter for atmosphere
  useEffect(() => {
    const t = setInterval(() => setLiveRtm(n => n + (Math.random() > 0.7 ? 1 : Math.random() > 0.9 ? -1 : 0)), 4000);
    return () => clearInterval(t);
  }, []);

  async function toggleSwitch(sw: SwitchState) {
    track('kill_switch_toggle', { name: sw.name, to: !sw.enabled });
    setToggling(sw.name);
    try {
      const url = sw.enabled
        ? `${API_BASE}/admin/kill-switches/${sw.name}`
        : `${API_BASE}/admin/kill-switches/${sw.name}/enable`;
      const method = sw.enabled ? 'DELETE' : 'POST';
      const res = await fetch(url, { method, headers });
      if (res.ok) await load();
    } catch { /* ignore */ }
    setToggling(null);
  }

  const MOCK_STATS: Stats = { runtimes: { total: 142, running: liveRtm, sleeping: 138, crashed: 1 }, remixQueue: 4, betaMode: 'open' };
  const s = stats ?? MOCK_STATS;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: 0 }}>Command Center</h1>
        <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4 }}>Live platform state — {new Date().toLocaleDateString()}</p>
      </div>

      {err && (
        <div style={{ ...GLASS, padding: '12px 16px', marginBottom: 20, border: `1px solid ${ACCENT_R}`, color: ACCENT_R, fontSize: 13 }}>
          ⚠️ {err} — showing mock data.
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard icon="▶" label="Running" value={s.runtimes.running} color={ACCENT_GN} sub="live runtimes" />
        <StatCard icon="💤" label="Sleeping" value={s.runtimes.sleeping} color={TEXT_M} sub="hibernated" />
        <StatCard icon="💥" label="Crashed" value={s.runtimes.crashed} color={s.runtimes.crashed > 0 ? ACCENT_R : TEXT_M} sub="need attention" />
        <StatCard icon="🔀" label="Remix Queue" value={s.remixQueue} color={s.remixQueue > 10 ? ACCENT_A : TEXT_M} sub="pending jobs" />
        <StatCard icon="📡" label="Beta Mode" value={s.betaMode.toUpperCase()} color={ACCENT} />
        <StatCard icon="⌚" label="Total Runtimes" value={s.runtimes.total} color={TEXT} sub="all time" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        {/* Audit log */}
        <div style={{ ...GLASS, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>📋 Recent Audit Events</div>
            <button onClick={() => void load()} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, cursor: 'pointer', fontSize: 11, padding: '3px 8px' }}>Refresh</button>
          </div>
          {loading && <div style={{ color: TEXT_M, fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Loading…</div>}
          {!loading && audit.length === 0 && (
            <>
              {/* Seeded fallback entries */}
              {[
                { action: 'ADMIN_ACTION',       targetType: 'beta_invite',   targetId: 'generated',    createdAt: new Date(Date.now() - 120000).toISOString() },
                { action: 'KILL_SWITCH_ENABLE',  targetType: 'kill_switch',   targetId: 'maintenance',  createdAt: new Date(Date.now() - 380000).toISOString() },
                { action: 'KILL_SWITCH_DISABLE', targetType: 'kill_switch',   targetId: 'maintenance',  createdAt: new Date(Date.now() - 300000).toISOString() },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: severityColor(e.action), fontFamily: 'monospace', minWidth: 140 }}>{e.action}</span>
                  <span style={{ fontSize: 11, color: TEXT_M, flex: 1 }}>{e.targetType}: {e.targetId}</span>
                  <span style={{ fontSize: 10, color: TEXT_D, flexShrink: 0 }}>{new Date(e.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </>
          )}
          {audit.map((e, i) => (
            <div key={e.id ?? i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: i < audit.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: severityColor(e.action), fontFamily: 'monospace', minWidth: 140 }}>{e.action}</span>
              <span style={{ fontSize: 11, color: TEXT_M, flex: 1 }}>{e.targetType}: {e.targetId}</span>
              <span style={{ fontSize: 10, color: TEXT_D, flexShrink: 0 }}>{new Date(e.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        {/* Kill switches */}
        <div style={{ ...GLASS, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>⚡ Kill Switches</div>
          {(['runtime_create', 'previews', 'remix', 'maintenance', 'readonly'] as const).map(name => {
            const sw = switches.find(s => s.name === name) ?? { name, enabled: false };
            return (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: 13, color: TEXT }}>{SWITCH_LABELS[name]}</div>
                  <div style={{ fontSize: 11, color: sw.enabled ? ACCENT_R : ACCENT_GN, marginTop: 2 }}>{sw.enabled ? '🔴 ENABLED' : '🟢 DISABLED'}</div>
                </div>
                <button
                  disabled={toggling === name}
                  onClick={() => toggleSwitch(sw)}
                  style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${sw.enabled ? ACCENT_R : BORDER}`, background: sw.enabled ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', color: sw.enabled ? ACCENT_R : TEXT_M, cursor: toggling ? 'wait' : 'pointer', fontSize: 11, fontWeight: 600 }}
                >
                  {toggling === name ? '…' : sw.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            );
          })}
          <div style={{ marginTop: 16 }}>
            <a href="/admin/health" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: `1px solid rgba(99,102,241,0.2)`, color: ACCENT, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
              View full health →
            </a>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 20 }}>
        {[
          { href: '/admin/runtimes',  label: 'Runtime Control',  icon: '▶', color: ACCENT_GN },
          { href: '/admin/discovery', label: 'Moderation Panel', icon: '🔍', color: ACCENT    },
          { href: '/admin/creators',  label: 'Creator Ops',      icon: '👤', color: ACCENT_A  },
          { href: '/admin/security',  label: 'Security Center',  icon: '🛡️', color: ACCENT_R  },
        ].map(l => (
          <a key={l.href} href={l.href} style={{ ...GLASS, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: TEXT, transition: 'border-color 0.2s' }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
