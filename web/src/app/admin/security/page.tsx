'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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

const ABUSE_REPORTS = [
  { id: 'ab-001', type: 'SPAM',           target: 'bad_actor',    severity: 'HIGH',   ts: '2h ago', resolved: false },
  { id: 'ab-002', type: 'PROMPT_ABUSE',   target: 'anon_user_42', severity: 'MEDIUM', ts: '4h ago', resolved: false },
  { id: 'ab-003', type: 'RATE_LIMIT_BAN', target: '192.168.x.x',  severity: 'LOW',    ts: '6h ago', resolved: true  },
  { id: 'ab-004', type: 'REGULATED_FLAG', target: 'medibook-pro',  severity: 'INFO',   ts: '1d ago', resolved: true  },
];

const SEVERITY_COLORS: Record<string, string> = {
  HIGH:   '#ef4444',
  MEDIUM: '#f59e0b',
  LOW:    '#64748b',
  INFO:   '#6366f1',
};

const MOCK_AUDIT = [
  { action: 'RUNTIME_TERMINATE', targetType: 'runtime',  targetId: 'rt-006',    createdAt: '2h ago' },
  { action: 'USER_WARN',         targetType: 'user',     targetId: 'anon_u_42', createdAt: '4h ago' },
  { action: 'RATE_LIMIT_RESET',  targetType: 'ip',       targetId: '[hashed]',  createdAt: '6h ago' },
  { action: 'FLAG_REVIEWED',     targetType: 'app',      targetId: 'medibook',  createdAt: '1d ago' },
  { action: 'KILL_SWITCH',       targetType: 'runtime',  targetId: 'rt-bad-1',  createdAt: '2d ago' },
];

type SeverityFilter = 'all' | 'HIGH' | 'MEDIUM' | 'LOW';

function auditActionColor(action: string): string {
  if (action.includes('KILL_SWITCH') || action.includes('TERMINATE') || action.includes('BAN')) return ACCENT_R;
  if (action.includes('WARN') || action.includes('SUSPEND') || action.includes('LIMIT'))        return ACCENT_A;
  return TEXT_M;
}

function Spinner() {
  return (
    <div style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: `2px solid ${BORDER}`, borderTopColor: ACCENT, animation: 'spin 0.7s linear infinite' }} />
  );
}

export default function SecurityPage() {
  const adminKey = useContext(AdminKeyCtx);

  const [reports, setReports]         = useState(ABUSE_REPORTS);
  const [audit, setAudit]             = useState<Array<{ action: string; targetType: string; targetId: string; createdAt: string }>>([]);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    setLoadingAudit(true);
    fetch(`${API_BASE}/admin/audit?limit=30`, {
      headers: { Authorization: `Bearer ${adminKey}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(d => setAudit(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingAudit(false));
  }, [adminKey]);

  const resolveReport = useCallback((id: string) => {
    track('moderation_action', { id, action: 'resolve' });
    setReports(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
  }, []);

  const openCount = reports.filter(r => !r.resolved).length;
  const highCount = reports.filter(r => r.severity === 'HIGH' && !r.resolved).length;

  const filtered = reports.filter(r => {
    if (severityFilter === 'all') return true;
    return r.severity === severityFilter;
  });

  const auditEntries = audit.length > 0 ? audit : MOCK_AUDIT;

  const SFILTERS: { key: SeverityFilter; label: string }[] = [
    { key: 'all',    label: 'All' },
    { key: 'HIGH',   label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW',    label: 'Low' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Inject spin keyframe once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: 0 }}>Security & Abuse Center</h1>
        <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Monitor abuse reports, rate-limit bans, and the security audit trail.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ ...GLASS, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 18 }}>{openCount}</span>
          <span style={{ color: TEXT_M, fontSize: 12 }}>open reports</span>
        </div>
        <div style={{ ...GLASS, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT_R, display: 'inline-block', boxShadow: `0 0 6px ${ACCENT_R}` }} />
          <span style={{ color: ACCENT_R, fontWeight: 700, fontSize: 18 }}>{highCount}</span>
          <span style={{ color: TEXT_M, fontSize: 12 }}>high severity</span>
        </div>
      </div>

      {/* Severity filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {SFILTERS.map(({ key, label }) => {
          const active = severityFilter === key;
          const dotColor = key === 'all' ? ACCENT : SEVERITY_COLORS[key];
          return (
            <button
              key={key}
              onClick={() => setSeverityFilter(key)}
              style={{
                padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: active ? `1px solid rgba(99,102,241,0.35)` : `1px solid ${BORDER}`,
                color: active ? ACCENT : TEXT_M,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {key !== 'all' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, display: 'inline-block', flexShrink: 0 }} />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Abuse report cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {filtered.map(report => {
          const sevColor = SEVERITY_COLORS[report.severity] ?? TEXT_M;
          return (
            <div
              key={report.id}
              style={{
                ...GLASS,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: report.resolved ? 0.5 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Severity badge */}
              <div style={{ flex: '0 0 auto' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                  background: `${sevColor}1a`, border: `1px solid ${sevColor}44`, color: sevColor,
                  letterSpacing: '0.05em',
                }}>
                  {report.severity}
                </span>
              </div>

              {/* Type + target */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: TEXT, fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{report.type.replace(/_/g, ' ')}</div>
                <div style={{ color: TEXT_M, fontSize: 12, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  target: {report.target.length > 24 ? report.target.slice(0, 21) + '…' : report.target}
                </div>
              </div>

              {/* Status */}
              <div style={{ flex: '0 0 auto' }}>
                {report.resolved ? (
                  <span style={{ padding: '3px 10px', borderRadius: 5, background: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.25)`, color: ACCENT_GN, fontSize: 11, fontWeight: 600 }}>Resolved</span>
                ) : (
                  <span style={{ padding: '3px 10px', borderRadius: 5, background: 'rgba(245,158,11,0.1)', border: `1px solid rgba(245,158,11,0.25)`, color: ACCENT_A, fontSize: 11, fontWeight: 600 }}>Open</span>
                )}
              </div>

              {/* Timestamp */}
              <div style={{ flex: '0 0 60px', color: TEXT_D, fontSize: 11, textAlign: 'right' }}>{report.ts}</div>

              {/* Resolve button */}
              <div style={{ flex: '0 0 auto' }}>
                {!report.resolved && (
                  <button
                    onClick={() => resolveReport(report.id)}
                    style={{ padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(16,185,129,0.1)', border: `1px solid ${ACCENT_GN}`, color: ACCENT_GN }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...GLASS, padding: 32, textAlign: 'center', color: TEXT_M }}>No reports match this filter.</div>
        )}
      </div>

      {/* Audit log */}
      <div style={{ ...GLASS, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Security Audit Log</span>
          {loadingAudit && <Spinner />}
          {!loadingAudit && audit.length === 0 && (
            <span style={{ color: TEXT_D, fontSize: 11 }}>Showing seeded demo entries</span>
          )}
        </div>

        {loadingAudit ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: TEXT_M, fontSize: 13 }}>
            <Spinner /> Loading audit entries…
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Action', 'Target', 'When'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: TEXT_D, fontSize: 11, fontWeight: 500, paddingBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry, i) => {
                const actionColor = auditActionColor(entry.action);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '10px 0', fontFamily: 'monospace', fontSize: 12, color: actionColor, fontWeight: 600 }}>
                      {entry.action}
                    </td>
                    <td style={{ padding: '10px 0', fontSize: 12 }}>
                      <span style={{ color: TEXT_D }}>{entry.targetType}</span>
                      <span style={{ color: TEXT_D, margin: '0 4px' }}>:</span>
                      <span style={{ color: TEXT_M, fontFamily: 'monospace' }}>{entry.targetId}</span>
                    </td>
                    <td style={{ padding: '10px 0', color: TEXT_D, fontSize: 11 }}>{entry.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Safety note */}
      <div style={{ marginTop: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(99,102,241,0.05)', border: `1px solid rgba(99,102,241,0.12)`, color: TEXT_D, fontSize: 11 }}>
        PII is never stored. IP addresses are hashed before storage.
      </div>
    </div>
  );
}
