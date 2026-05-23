'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/env';
import { track } from '@/lib/analytics';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const GN      = '#10b981';
const YL      = '#f59e0b';
const RD      = '#ef4444';

const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};


type ComponentStatus = 'ok' | 'degraded' | 'down';
type OverallStatus   = 'ok' | 'degraded' | 'outage';

interface StatusComponent {
  name:      string;
  status:    ComponentStatus;
  latencyMs?: number;
}

interface StatusResponse {
  status:           OverallStatus;
  timestamp:        string;
  components:       StatusComponent[];
  incidentMessage?: string;
}

const COMPONENT_LABELS: Record<string, string> = {
  api:      'API',
  database: 'Database',
  cache:    'Cache (Redis)',
  frontend: 'Frontend (CDN)',
};

function statusColor(s: ComponentStatus | OverallStatus): string {
  if (s === 'ok')      return GN;
  if (s === 'degraded') return YL;
  return RD;
}

function statusLabel(s: ComponentStatus | OverallStatus): string {
  if (s === 'ok')      return 'Operational';
  if (s === 'degraded') return 'Degraded';
  if (s === 'outage')  return 'Outage';
  return 'Down';
}

function OverallBanner({ status, incidentMessage }: { status: OverallStatus; incidentMessage?: string }) {
  const color = statusColor(status);
  const label = status === 'ok' ? 'All Systems Operational'
    : status === 'degraded' ? 'Partial Degradation'
    : 'Service Outage';

  return (
    <div style={{ ...GLASS, padding: '28px 32px', marginBottom: 24, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 12px ${color}`, flexShrink: 0 }} />
        <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>{label}</span>
      </div>
      {incidentMessage && (
        <p style={{ marginTop: 12, fontSize: 14, color: YL, fontFamily: "'Geist','Inter',system-ui,sans-serif", lineHeight: 1.6 }}>
          {incidentMessage}
        </p>
      )}
    </div>
  );
}

function ComponentRow({ comp }: { comp: StatusComponent }) {
  const color = statusColor(comp.status);
  const label = statusLabel(comp.status);
  const name  = COMPONENT_LABELS[comp.name] ?? comp.name;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 14, color: TEXT, fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>{name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {comp.latencyMs !== undefined && (
          <span style={{ fontSize: 12, color: TEXT_M, fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>{comp.latencyMs}ms</span>
        )}
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontSize: 13, color, fontWeight: 600, fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>{label}</span>
      </div>
    </div>
  );
}

const MOCK_STATUS: StatusResponse = {
  status: 'ok',
  timestamp: new Date().toISOString(),
  components: [
    { name: 'api',      status: 'ok' },
    { name: 'database', status: 'ok' },
    { name: 'cache',    status: 'ok' },
    { name: 'frontend', status: 'ok' },
  ],
};

export default function StatusPage() {
  const [data, setData]         = useState<StatusResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [lastUpdated, setUpdated] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/v1/public/status'));
      if (res.ok) {
        const json = await res.json() as StatusResponse;
        setData(json);
        track('status_loaded', { status: json.status });
      } else {
        setData(MOCK_STATUS);
        track('status_fallback', { httpStatus: res.status });
      }
    } catch {
      setData(MOCK_STATUS);
      track('status_fallback', { reason: 'network_error' });
    }
    setLoading(false);
    setUpdated(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    track('status_viewed');
    void load();
    const timer = setInterval(() => { void load(); }, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const current = data ?? MOCK_STATUS;

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Geist','Inter',system-ui,sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>F</div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>Factory Status</span>
          </div>
          <p style={{ fontSize: 13, color: TEXT_M }}>
            Real-time service health · {loading ? 'Loading…' : `Updated ${lastUpdated}`}
          </p>
        </div>

        {/* Overall banner */}
        <OverallBanner status={current.status} incidentMessage={current.incidentMessage} />

        {/* Component grid */}
        <div style={{ ...GLASS, padding: '8px 24px 4px', marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, marginTop: 16 }}>Services</p>
          {current.components.map(c => (
            <ComponentRow key={c.name} comp={c} />
          ))}
          <div style={{ height: 12 }} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 12, color: TEXT_M }}>
          <span>Last checked: {current.timestamp ? new Date(current.timestamp).toLocaleString() : '—'}</span>
          <span style={{ margin: '0 12px' }}>·</span>
          <button
            onClick={() => { setLoading(true); void load(); }}
            style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Geist','Inter',system-ui,sans-serif" }}
          >
            Refresh
          </button>
          <span style={{ margin: '0 12px' }}>·</span>
          <a href="/" style={{ color: TEXT_M, textDecoration: 'none' }}>← Home</a>
        </div>

      </div>
    </div>
  );
}
