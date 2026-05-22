'use client';
import React, { useContext, useState } from 'react';
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

const SEEDED_RUNTIMES = [
  { id: 'rt-001', name: 'medibook-pro-preview',  owner: 'sarah_builds', status: 'RUNNING',      cpu: 42, mem: 68, age: '2h 14m', runtimeType: 'nestjs-next' },
  { id: 'rt-002', name: 'shopforge-preview',     owner: 'marc_dev',     status: 'RUNNING',      cpu: 28, mem: 54, age: '45m',    runtimeType: 'nestjs-next' },
  { id: 'rt-003', name: 'agentflow-dev',         owner: 'devbot_42',    status: 'RUNNING',      cpu: 71, mem: 82, age: '1h 03m', runtimeType: 'nestjs-next' },
  { id: 'rt-004', name: 'tutorai-preview',       owner: 'lena_edu',     status: 'SLEEPING',     cpu: 0,  mem: 12, age: '3h 22m', runtimeType: 'nestjs-next' },
  { id: 'rt-005', name: 'routeiq-preview',       owner: 'kai_ops',      status: 'SLEEPING',     cpu: 0,  mem: 8,  age: '6h 11m', runtimeType: 'nestjs-next' },
  { id: 'rt-006', name: 'bad-actor-app',         owner: 'bad_actor',    status: 'CRASHED',      cpu: 0,  mem: 0,  age: '12m',    runtimeType: 'nestjs-next' },
  { id: 'rt-007', name: 'financepulse-staging',  owner: 'jaya_k',       status: 'PROVISIONING', cpu: 0,  mem: 4,  age: '3m',     runtimeType: 'nestjs-next' },
  { id: 'rt-008', name: 'creatoros-preview',     owner: 'riya_creates', status: 'SLEEPING',     cpu: 0,  mem: 15, age: '1h 48m', runtimeType: 'nestjs-next' },
];

type Runtime = typeof SEEDED_RUNTIMES[0];
type FilterKey = 'all' | 'running' | 'sleeping' | 'crashed';

const STATUS_DOT: Record<string, string> = {
  RUNNING:      ACCENT_GN,
  SLEEPING:     TEXT_M,
  CRASHED:      ACCENT_R,
  PROVISIONING: ACCENT_A,
};

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', width: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
    </div>
  );
}

export default function RuntimesPage() {
  const adminKey = useContext(AdminKeyCtx);
  const [runtimes, setRuntimes] = useState<Runtime[]>(SEEDED_RUNTIMES);
  const [filter, setFilter]     = useState<FilterKey>('all');
  const [confirm, setConfirm]   = useState<{ id: string; action: string } | null>(null);
  const [acting, setActing]     = useState<string | null>(null);

  const counts = {
    running:      runtimes.filter(r => r.status === 'RUNNING').length,
    sleeping:     runtimes.filter(r => r.status === 'SLEEPING').length,
    crashed:      runtimes.filter(r => r.status === 'CRASHED').length,
    provisioning: runtimes.filter(r => r.status === 'PROVISIONING').length,
  };

  const filtered = runtimes.filter(r => {
    if (filter === 'all')     return true;
    if (filter === 'running') return r.status === 'RUNNING';
    if (filter === 'sleeping') return r.status === 'SLEEPING';
    if (filter === 'crashed') return r.status === 'CRASHED';
    return true;
  });

  function applyAction(id: string, action: string) {
    setActing(id);
    track('runtime_action', { id, action });

    setRuntimes(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (action === 'sleep')     return { ...r, status: 'SLEEPING', cpu: 0 };
      if (action === 'wake')      return { ...r, status: 'RUNNING' };
      if (action === 'terminate') return { ...r, status: 'CRASHED', cpu: 0, mem: 0 };
      if (action === 'restore')   return { ...r, status: 'PROVISIONING', mem: 4 };
      if (action === 'cancel')    return { ...r, status: 'CRASHED', cpu: 0, mem: 0 };
      return r;
    }));

    setConfirm(null);
    setTimeout(() => setActing(null), 600);
  }

  function handleAction(id: string, action: string, destructive: boolean) {
    if (destructive) {
      setConfirm({ id, action });
    } else {
      applyAction(id, action);
    }
  }

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'running', label: 'Running' },
    { key: 'sleeping', label: 'Sleeping' },
    { key: 'crashed', label: 'Crashed' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: 0 }}>Runtime Control Center</h1>
        <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Manage all active, sleeping, and crashed runtimes.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Running',      n: counts.running,      color: ACCENT_GN },
          { label: 'Sleeping',     n: counts.sleeping,     color: TEXT_M },
          { label: 'Crashed',      n: counts.crashed,      color: ACCENT_R },
          { label: 'Provisioning', n: counts.provisioning, color: ACCENT_A },
        ].map(({ label, n, color }) => (
          <div key={label} style={{ ...GLASS, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{n}</span>
            <span style={{ color: TEXT_M, fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: filter === key ? 600 : 400, cursor: 'pointer',
              background: filter === key ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: filter === key ? `1px solid rgba(99,102,241,0.35)` : `1px solid ${BORDER}`,
              color: filter === key ? ACCENT : TEXT_M,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Runtime cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(rt => {
          const isConfirming = confirm?.id === rt.id;
          const isActing     = acting === rt.id;
          const cpuColor = rt.cpu > 70 ? ACCENT_R : rt.cpu > 40 ? ACCENT_A : ACCENT_GN;

          return (
            <div
              key={rt.id}
              style={{
                ...GLASS,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity: isActing ? 0.6 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Status + name */}
              <div style={{ flex: '0 0 220px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: STATUS_DOT[rt.status] ?? TEXT_M,
                    boxShadow: rt.status === 'RUNNING' ? `0 0 6px ${ACCENT_GN}` : undefined,
                  }} />
                  <span style={{ color: TEXT, fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rt.name}</span>
                </div>
                <div style={{ color: TEXT_M, fontSize: 12, paddingLeft: 16 }}>@{rt.owner}</div>
              </div>

              {/* Metrics */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: TEXT_M, fontSize: 11 }}>CPU</span>
                      <span style={{ color: cpuColor, fontSize: 11, fontWeight: 600 }}>{rt.cpu}%</span>
                    </div>
                    <MiniBar pct={rt.cpu} color={cpuColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: TEXT_M, fontSize: 11 }}>MEM</span>
                      <span style={{ color: rt.mem > 75 ? ACCENT_R : TEXT, fontSize: 11, fontWeight: 600 }}>{rt.mem}%</span>
                    </div>
                    <MiniBar pct={rt.mem} color={rt.mem > 75 ? ACCENT_R : ACCENT} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(99,102,241,0.12)', border: `1px solid rgba(99,102,241,0.2)`, fontSize: 10, color: ACCENT, fontWeight: 600 }}>{rt.runtimeType}</span>
                  <span style={{ color: TEXT_D, fontSize: 11 }}>up {rt.age}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ flex: '0 0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {isConfirming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: ACCENT_A, fontSize: 12 }}>Are you sure?</span>
                    <button
                      onClick={() => applyAction(rt.id, confirm.action)}
                      style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', border: `1px solid ${ACCENT_R}`, color: ACCENT_R }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirm(null)}
                      style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'transparent', border: `1px solid ${BORDER}`, color: TEXT_M }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {rt.status === 'RUNNING' && (
                      <>
                        <button onClick={() => handleAction(rt.id, 'sleep', false)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'transparent', border: `1px solid ${ACCENT_A}`, color: ACCENT_A, fontWeight: 500 }}>Sleep</button>
                        <button onClick={() => handleAction(rt.id, 'terminate', true)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', border: `1px solid ${ACCENT_R}`, color: ACCENT_R, fontWeight: 500 }}>Terminate</button>
                      </>
                    )}
                    {rt.status === 'SLEEPING' && (
                      <button onClick={() => handleAction(rt.id, 'wake', false)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: `1px solid ${ACCENT_GN}`, color: ACCENT_GN, fontWeight: 500 }}>Wake</button>
                    )}
                    {rt.status === 'CRASHED' && (
                      <>
                        <button onClick={() => handleAction(rt.id, 'restore', false)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'rgba(99,102,241,0.12)', border: `1px solid ${ACCENT}`, color: ACCENT, fontWeight: 500 }}>Restore Snapshot</button>
                        <button onClick={() => handleAction(rt.id, 'terminate', true)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', border: `1px solid ${ACCENT_R}`, color: ACCENT_R, fontWeight: 500 }}>Terminate</button>
                      </>
                    )}
                    {rt.status === 'PROVISIONING' && (
                      <button onClick={() => handleAction(rt.id, 'cancel', true)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: `1px solid ${ACCENT_A}`, color: ACCENT_A, fontWeight: 500 }}>Cancel</button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...GLASS, padding: 32, textAlign: 'center', color: TEXT_M }}>No runtimes match this filter.</div>
        )}
      </div>
    </div>
  );
}
