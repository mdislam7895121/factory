'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE   = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
const BG         = '#030712';
const SURFACE    = 'rgba(10,22,40,0.82)';
const ACCENT     = '#6366f1';
const ACCENT_G   = '#10b981';
const ACCENT_A   = '#f59e0b';
const ACCENT_R   = '#ef4444';
const TEXT       = '#f1f5f9';
const TEXT_M     = '#64748b';
const BORDER     = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: 12 };
const FONT       = "'Geist', 'Inter', system-ui, sans-serif";

function track(event: string, meta?: Record<string, unknown>) {
  console.debug('[factory:quality]', { event, ts: Date.now(), ...meta });
}

const TIER_COLORS: Record<string, string> = {
  PRODUCTION_READY: ACCENT_G,
  BETA_READY:       ACCENT,
  PREVIEW_READY:    ACCENT_A,
  EXPERIMENTAL:     ACCENT_R,
};

const SEED_PROJECTS = [
  { projectId: 'medibook-pro',  name: 'MediBook Pro',  score: 87, tier: 'PRODUCTION_READY', readiness: 'PRODUCTION' },
  { projectId: 'shopforge',     name: 'ShopForge',      score: 73, tier: 'BETA_READY',        readiness: 'BETA' },
  { projectId: 'finance-pulse', name: 'FinancePulse',   score: 56, tier: 'PREVIEW_READY',     readiness: 'PREVIEW' },
  { projectId: 'tutor-ai',      name: 'TutorAI',        score: 38, tier: 'EXPERIMENTAL',      readiness: 'NOT_READY' },
  { projectId: 'route-iq',      name: 'RouteIQ',        score: 71, tier: 'BETA_READY',        readiness: 'BETA' },
  { projectId: 'creator-os',    name: 'CreatorOS',      score: 92, tier: 'PRODUCTION_READY',  readiness: 'PRODUCTION' },
];

type Project = typeof SEED_PROJECTS[number] & { loading?: boolean };

// ---------- tiny helpers ----------

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: `${color}22`, color, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 99 }}>
      {label}
    </span>
  );
}

function Btn({ children, onClick, disabled, variant = 'primary', small }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'primary' | 'ghost' | 'danger'; small?: boolean;
}) {
  const bg = variant === 'primary' ? ACCENT : variant === 'danger' ? ACCENT_R : 'rgba(255,255,255,0.06)';
  const col = variant === 'ghost' ? TEXT_M : '#fff';
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? 'rgba(255,255,255,0.04)' : bg, color: disabled ? TEXT_M : col, border: `1px solid ${disabled ? BORDER : variant === 'ghost' ? BORDER : 'transparent'}`, borderRadius: 8, padding: small ? '5px 12px' : '8px 18px', fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  );
}

function ScoreArc({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? ACCENT_G : score >= 60 ? ACCENT : score >= 40 ? ACCENT_A : ACCENT_R;
  return (
    <svg width={70} height={70} style={{ flexShrink: 0 }}>
      <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
      <circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 35 35)" />
      <text x={35} y={40} textAnchor="middle" fill={color} fontSize={14} fontWeight={700}>{score}</text>
    </svg>
  );
}

// ---------- Tab: Overview ----------

function OverviewTab() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [evaluatingAll, setEvaluatingAll] = useState(false);

  const evaluate = async (projectId: string) => {
    setProjects(prev => prev.map(p => p.projectId === projectId ? { ...p, loading: true } : p));
    track('quality_evaluate', { projectId });
    try {
      const r = await fetch(`${API_BASE}/v1/quality/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId }) });
      if (r.ok) {
        const d = await r.json();
        setProjects(prev => prev.map(p => p.projectId === projectId ? { ...p, ...d, loading: false } : p));
        return;
      }
    } catch {}
    setProjects(prev => prev.map(p => p.projectId === projectId ? { ...p, loading: false } : p));
  };

  const evaluateAll = async () => {
    setEvaluatingAll(true);
    track('quality_evaluate_all');
    await Promise.allSettled(SEED_PROJECTS.map(p => evaluate(p.projectId)));
    setEvaluatingAll(false);
  };

  const prod  = projects.filter(p => p.tier === 'PRODUCTION_READY').length;
  const beta  = projects.filter(p => p.tier === 'BETA_READY').length;
  const exp   = projects.filter(p => p.tier === 'EXPERIMENTAL').length;
  const avg   = Math.round(projects.reduce((s, p) => s + p.score, 0) / projects.length);
  const stats = [
    { label: 'Total Evaluated', value: projects.length },
    { label: 'Avg Score',       value: avg },
    { label: 'Production',      value: prod },
    { label: 'Beta',            value: beta },
    { label: 'Experimental',    value: exp },
    { label: 'Repair Queue',    value: 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...GLASS, flex: '1 1 130px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: TEXT_M, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
            <span style={{ color: TEXT, fontSize: 22, fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn onClick={evaluateAll} disabled={evaluatingAll}>{evaluatingAll ? 'Evaluating...' : 'Evaluate All'}</Btn>
      </div>

      {/* Project grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {projects.map(p => (
          <div key={p.projectId} style={{ ...GLASS, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <ScoreArc score={p.score} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 15 }}>{p.name}</p>
                <p style={{ margin: '3px 0 0', color: TEXT_M, fontSize: 12, fontFamily: 'monospace' }}>{p.projectId}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge label={p.tier} color={TIER_COLORS[p.tier] ?? ACCENT} />
              <Badge label={p.readiness} color={p.readiness === 'PRODUCTION' ? ACCENT_G : p.readiness === 'BETA' ? ACCENT : p.readiness === 'PREVIEW' ? ACCENT_A : ACCENT_R} />
            </div>
            <Btn onClick={() => evaluate(p.projectId)} disabled={p.loading} small>{p.loading ? 'Evaluating...' : 'Evaluate'}</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Tab: Smoke Tests ----------

type SmokeResult = { url: string; statusCode: number; loadTime: number; hasHtml: boolean; hasJsBundle: boolean; blankScreen: boolean; passed: boolean };

function SmokeTab() {
  const [url, setUrl]         = useState('https://');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SmokeResult[]>([]);
  const [error, setError]     = useState('');

  const run = async () => {
    if (!url.trim()) return;
    setRunning(true);
    setError('');
    track('quality_smoke_test', { url });
    try {
      const r = await fetch(`${API_BASE}/v1/quality/smoke-test`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      if (r.ok) {
        const d = await r.json();
        setResults(prev => [d, ...prev].slice(0, 5));
      } else {
        throw new Error(`${r.status}`);
      }
    } catch (err) {
      setError(String(err));
      const mock: SmokeResult = { url, statusCode: 0, loadTime: 0, hasHtml: false, hasJsBundle: false, blankScreen: true, passed: false };
      setResults(prev => [mock, ...prev].slice(0, 5));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-app.com"
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 14px', color: TEXT, fontSize: 14, outline: 'none', fontFamily: FONT }} />
        <Btn onClick={run} disabled={running}>{running ? 'Running...' : 'Run Test'}</Btn>
      </div>
      {error && <p style={{ color: ACCENT_R, fontSize: 13, margin: 0 }}>Error: {error}</p>}
      {results.length === 0 && <p style={{ color: TEXT_M, fontSize: 14 }}>No smoke tests run yet.</p>}
      {results.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['URL', 'Status', 'Load (ms)', 'HTML?', 'JS Bundle?', 'Blank?', 'Pass?'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: TEXT_M, fontWeight: 600, padding: '8px 10px', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '8px 10px', color: TEXT, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.url}</td>
                  <td style={{ padding: '8px 10px', color: res.statusCode >= 200 && res.statusCode < 300 ? ACCENT_G : ACCENT_R, fontWeight: 700 }}>{res.statusCode || 'ERR'}</td>
                  <td style={{ padding: '8px 10px', color: TEXT_M }}>{res.loadTime || '-'}</td>
                  <td style={{ padding: '8px 10px', color: res.hasHtml ? ACCENT_G : ACCENT_R }}>{res.hasHtml ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '8px 10px', color: res.hasJsBundle ? ACCENT_G : ACCENT_R }}>{res.hasJsBundle ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '8px 10px', color: res.blankScreen ? ACCENT_R : ACCENT_G }}>{res.blankScreen ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '8px 10px' }}><Badge label={res.passed ? 'PASS' : 'FAIL'} color={res.passed ? ACCENT_G : ACCENT_R} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Tab: Routes ----------

type RouteResult = { route: string; status: 'PASS' | 'FAIL' | 'WARN'; statusCode?: number; issue?: string };

const SEED_ROUTES = ['/', '/about', '/dashboard', '/users/[id]', '/admin/settings/advanced/section/item/detail'].join('\n');

function RoutesTab() {
  const [routes, setRoutes]     = useState(SEED_ROUTES);
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<RouteResult[]>([]);
  const [error, setError]       = useState('');

  const validate = async () => {
    const list = routes.split('\n').map(r => r.trim()).filter(Boolean);
    if (!list.length) return;
    setLoading(true);
    setError('');
    track('quality_route_validate', { count: list.length });
    try {
      const r = await fetch(`${API_BASE}/v1/quality/route-validate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ routes: list }) });
      if (r.ok) {
        const d = await r.json();
        setResults(d.results ?? []);
      } else {
        throw new Error(`${r.status}`);
      }
    } catch (err) {
      setError(String(err));
      // seeded fallback
      setResults(list.map(route => ({
        route,
        status: route.split('/').length > 6 ? 'WARN' : 'PASS',
        statusCode: 200,
        issue: route.split('/').length > 6 ? 'Deep route — consider flattening' : undefined,
      } as RouteResult)));
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: string) => s === 'PASS' ? ACCENT_G : s === 'FAIL' ? ACCENT_R : ACCENT_A;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <textarea value={routes} onChange={e => setRoutes(e.target.value)} rows={6}
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: TEXT, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', outline: 'none' }}
        placeholder="One route per line..." />
      <div><Btn onClick={validate} disabled={loading}>{loading ? 'Validating...' : 'Validate Routes'}</Btn></div>
      {error && <p style={{ color: ACCENT_R, fontSize: 13, margin: 0 }}>Error (showing demo data): {error}</p>}
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((res, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: 'monospace', color: TEXT, fontSize: 13, flex: 1 }}>{res.route}</span>
              {res.statusCode && <span style={{ color: TEXT_M, fontSize: 12 }}>{res.statusCode}</span>}
              <Badge label={res.status} color={statusColor(res.status)} />
              {res.issue && <span style={{ color: ACCENT_A, fontSize: 12 }}>{res.issue}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Tab: Mobile ----------

function MobileTab() {
  const [content, setContent]     = useState('');
  const [meta, setMeta]           = useState('{}');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<{ score: number; warnings: string[]; hasOverflow: boolean; hasViewportIssues: boolean; hasTouchTargetIssues: boolean; hasFontSizeIssues: boolean } | null>(null);
  const [error, setError]         = useState('');

  const validate = async () => {
    setLoading(true);
    setError('');
    track('quality_mobile_validate');
    let metaParsed = {};
    try { metaParsed = JSON.parse(meta); } catch {}
    try {
      const r = await fetch(`${API_BASE}/v1/quality/mobile-validate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, metadata: metaParsed }) });
      if (r.ok) {
        const d = await r.json();
        setResult(d);
      } else {
        throw new Error(`${r.status}`);
      }
    } catch (err) {
      setError(String(err));
      setResult({ score: 72, warnings: ['Missing viewport meta tag', 'Font size below 16px in body'], hasOverflow: false, hasViewportIssues: true, hasTouchTargetIssues: false, hasFontSizeIssues: true });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result ? (result.score >= 80 ? ACCENT_G : result.score >= 60 ? ACCENT_A : ACCENT_R) : ACCENT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600, display: 'block', marginBottom: 6 }}>HTML / Content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: TEXT, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', outline: 'none' }}
          placeholder="Paste HTML or content to validate..." />
      </div>
      <div>
        <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600, display: 'block', marginBottom: 6 }}>Metadata JSON</label>
        <textarea value={meta} onChange={e => setMeta(e.target.value)} rows={3}
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: TEXT, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', outline: 'none' }}
          placeholder='{"viewport": "width=device-width"}' />
      </div>
      <div><Btn onClick={validate} disabled={loading}>{loading ? 'Validating...' : 'Validate Mobile'}</Btn></div>
      {error && <p style={{ color: ACCENT_A, fontSize: 13, margin: 0 }}>API error — showing demo data: {error}</p>}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Score bar */}
          <div style={{ ...GLASS, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Mobile Score</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: scoreColor }}>{result.score}</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`, borderRadius: 99, transition: 'width 0.5s' }} />
            </div>
          </div>
          {/* Flags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Overflow',      val: result.hasOverflow },
              { label: 'Viewport',      val: result.hasViewportIssues },
              { label: 'Touch Targets', val: result.hasTouchTargetIssues },
              { label: 'Font Size',     val: result.hasFontSizeIssues },
            ].map(f => (
              <div key={f.label} style={{ ...GLASS, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.val ? ACCENT_R : ACCENT_G, display: 'inline-block' }} />
                <span style={{ color: TEXT_M, fontSize: 13 }}>{f.label}</span>
              </div>
            ))}
          </div>
          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ margin: 0, fontWeight: 600, color: TEXT, fontSize: 14 }}>Warnings ({result.warnings.length})</p>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: `${ACCENT_A}11`, border: `1px solid ${ACCENT_A}33`, borderRadius: 8 }}>
                  <span style={{ color: ACCENT_A, fontSize: 13 }}>! {w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Tab: QA Checklist ----------

type CheckItem = { check: string; status: 'pass' | 'warn' | 'fail'; note?: string; category?: string };

function QaTab() {
  const [projectId, setProjectId] = useState(SEED_PROJECTS[0].projectId);
  const [loading, setLoading]     = useState(false);
  const [items, setItems]         = useState<CheckItem[]>([]);
  const [error, setError]         = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    track('quality_qa_checklist', { projectId });
    try {
      const r = await fetch(`${API_BASE}/v1/quality/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId }) });
      if (r.ok) {
        const d = await r.json();
        const fetched: CheckItem[] = d?.qaReport?.items ?? [];
        if (fetched.length) { setItems(fetched); return; }
      }
    } catch (err) {
      setError(String(err));
    }
    // seeded fallback
    setItems([
      { category: 'Security',     check: 'No secrets in source',         status: 'pass' },
      { category: 'Security',     check: 'Auth routes protected',         status: 'pass' },
      { category: 'Performance',  check: 'Bundle size < 500kb',           status: 'warn', note: 'Currently 612kb' },
      { category: 'Performance',  check: 'First Contentful Paint < 2s',   status: 'pass' },
      { category: 'Accessibility',check: 'Alt text on images',            status: 'fail', note: '3 images missing alt' },
      { category: 'Accessibility',check: 'Color contrast ratio >= 4.5',   status: 'warn', note: 'Footer text fails' },
      { category: 'Mobile',       check: 'Viewport meta present',         status: 'pass' },
      { category: 'Mobile',       check: 'Touch targets >= 44px',         status: 'pass' },
    ]);
    setLoading(false);
  };

  const groups = items.reduce<Record<string, CheckItem[]>>((acc, item) => {
    const cat = item.category ?? 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const pass = items.filter(i => i.status === 'pass').length;
  const warn = items.filter(i => i.status === 'warn').length;
  const fail = items.filter(i => i.status === 'fail').length;

  const statusSymbol = (s: string) => s === 'pass' ? '+' : s === 'fail' ? 'x' : '!';
  const statusColor  = (s: string) => s === 'pass' ? ACCENT_G : s === 'fail' ? ACCENT_R : ACCENT_A;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 14px', color: TEXT, fontSize: 14, flex: '1 1 200px' }}>
          {SEED_PROJECTS.map(p => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}
        </select>
        <Btn onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate Checklist'}</Btn>
      </div>
      {error && <p style={{ color: ACCENT_A, fontSize: 13, margin: 0 }}>API error — showing demo data: {error}</p>}
      {items.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Badge label={`${pass} Pass`} color={ACCENT_G} />
            <Badge label={`${warn} Warn`} color={ACCENT_A} />
            <Badge label={`${fail} Fail`} color={ACCENT_R} />
          </div>
          {Object.entries(groups).map(([cat, catItems]) => (
            <div key={cat}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, color: TEXT_M, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {catItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `1px solid ${BORDER}` }}>
                    <span style={{ color: statusColor(item.status), fontWeight: 700, fontSize: 14, width: 16, textAlign: 'center' }}>{statusSymbol(item.status)}</span>
                    <span style={{ flex: 1, color: TEXT, fontSize: 13 }}>{item.check}</span>
                    {item.note && <span style={{ color: statusColor(item.status), fontSize: 12 }}>{item.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      {items.length === 0 && !loading && <p style={{ color: TEXT_M, fontSize: 14 }}>Select a project and click Generate Checklist.</p>}
    </div>
  );
}

// ---------- Tab: Repair Queue ----------

type Repair = { projectId: string; status: string; attempts: number; maxAttempts: number; triggeredAt: string };

function RepairTab() {
  const [projectId, setProjectId] = useState(SEED_PROJECTS[0].projectId);
  const [repairs, setRepairs]     = useState<Repair[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const trigger = async () => {
    setLoading(true);
    setError('');
    track('quality_repair_trigger', { projectId });
    try {
      const r = await fetch(`${API_BASE}/v1/quality/${projectId}/repair`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (r.ok) {
        const d = await r.json();
        setRepairs(prev => [d, ...prev]);
      } else {
        throw new Error(`${r.status}`);
      }
    } catch (err) {
      setError(String(err));
      const mock: Repair = { projectId, status: 'IN_PROGRESS', attempts: 1, maxAttempts: 3, triggeredAt: new Date().toISOString() };
      setRepairs(prev => [mock, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const complete = async (idx: number, success: boolean) => {
    const rep = repairs[idx];
    track('quality_repair_complete', { projectId: rep.projectId, success });
    try {
      await fetch(`${API_BASE}/v1/quality/${rep.projectId}/repair/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success }) });
    } catch {}
    setRepairs(prev => prev.map((r, i) => i === idx ? { ...r, status: success ? 'SUCCESS' : 'FAILED' } : r));
  };

  const statusColor = (s: string) => s === 'SUCCESS' ? ACCENT_G : s === 'FAILED' ? ACCENT_R : s === 'IN_PROGRESS' ? ACCENT : ACCENT_A;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 14px', color: TEXT, fontSize: 14, flex: '1 1 200px' }}>
          {SEED_PROJECTS.map(p => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}
        </select>
        <Btn onClick={trigger} disabled={loading}>{loading ? 'Triggering...' : 'Trigger Repair'}</Btn>
      </div>
      {error && <p style={{ color: ACCENT_A, fontSize: 13, margin: 0 }}>API error — showing demo entry: {error}</p>}
      {repairs.length === 0 && <p style={{ color: TEXT_M, fontSize: 14 }}>No repairs queued.</p>}
      {repairs.map((rep, idx) => (
        <div key={idx} style={{ ...GLASS, padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: '1 1 160px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 14 }}>{rep.projectId}</p>
            <p style={{ margin: '3px 0 0', color: TEXT_M, fontSize: 12 }}>{new Date(rep.triggeredAt).toLocaleString()}</p>
          </div>
          <Badge label={rep.status} color={statusColor(rep.status)} />
          <span style={{ color: TEXT_M, fontSize: 13 }}>Attempt {rep.attempts}/{rep.maxAttempts}</span>
          {rep.attempts >= rep.maxAttempts && rep.status === 'IN_PROGRESS' && (
            <span style={{ color: ACCENT_R, fontSize: 12, fontWeight: 600 }}>Max attempts reached</span>
          )}
          {rep.status === 'IN_PROGRESS' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => complete(idx, true)} small>Complete (success)</Btn>
              <Btn onClick={() => complete(idx, false)} variant="danger" small>Complete (failed)</Btn>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- Tab: Analytics ----------

type Analytics = {
  avgScore: number;
  distribution: Record<string, number>;
  repairFrequency: number;
  runtimeFailureRate: number;
  mobileIssueRate: number;
  topCrashCategories: string[];
  commonUxIssues: string[];
};

const SEED_ANALYTICS: Analytics = {
  avgScore: 68,
  distribution: { EXPERIMENTAL: 2, PREVIEW_READY: 1, BETA_READY: 2, PRODUCTION_READY: 1 },
  repairFrequency: 0.18,
  runtimeFailureRate: 0.07,
  mobileIssueRate: 0.33,
  topCrashCategories: ['Null reference', 'Auth token expiry', 'DB connection timeout'],
  commonUxIssues: ['Overflow on mobile', 'Missing loading states', 'No empty state UI'],
};

function AnalyticsTab() {
  const [data, setData]     = useState<Analytics>(SEED_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      track('quality_analytics_load');
      try {
        const r = await fetch(`${API_BASE}/v1/quality/analytics/summary`);
        if (r.ok) {
          const d = await r.json();
          setData(d);
        } else {
          throw new Error(`${r.status}`);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = Object.values(data.distribution).reduce((s, v) => s + v, 0) || 1;
  const tierOrder = ['PRODUCTION_READY', 'BETA_READY', 'PREVIEW_READY', 'EXPERIMENTAL'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {loading && <p style={{ color: TEXT_M, fontSize: 14 }}>Loading analytics...</p>}
      {error && <p style={{ color: ACCENT_A, fontSize: 13, margin: 0 }}>API unavailable — showing seed data: {error}</p>}

      {/* Key metrics */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {[
          { label: 'Avg Score',         value: data.avgScore,                          fmt: (v: number) => String(v) },
          { label: 'Repair Frequency',  value: data.repairFrequency,                   fmt: (v: number) => `${(v * 100).toFixed(0)}%` },
          { label: 'Runtime Fail Rate', value: data.runtimeFailureRate,                fmt: (v: number) => `${(v * 100).toFixed(0)}%` },
          { label: 'Mobile Issue Rate', value: data.mobileIssueRate,                   fmt: (v: number) => `${(v * 100).toFixed(0)}%` },
        ].map(m => (
          <div key={m.label} style={{ ...GLASS, flex: '1 1 140px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: TEXT_M, fontSize: 12, fontWeight: 600 }}>{m.label}</span>
            <span style={{ color: TEXT, fontSize: 26, fontWeight: 800 }}>{m.fmt(m.value)}</span>
          </div>
        ))}
      </div>

      {/* Distribution chart */}
      <div style={{ ...GLASS, padding: 20 }}>
        <p style={{ margin: '0 0 14px', fontWeight: 700, color: TEXT, fontSize: 14 }}>Score Distribution</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tierOrder.map(tier => {
            const count = data.distribution[tier] ?? 0;
            const pct   = (count / total) * 100;
            return (
              <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: TEXT_M, fontSize: 12, width: 140, flexShrink: 0 }}>{tier.replace(/_/g, ' ')}</span>
                <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: TIER_COLORS[tier], borderRadius: 99, transition: 'width 0.5s' }} />
                </div>
                <span style={{ color: TEXT_M, fontSize: 12, width: 20 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ ...GLASS, padding: 18 }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, color: TEXT, fontSize: 14 }}>Top Crash Categories</p>
          {data.topCrashCategories.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < data.topCrashCategories.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ color: ACCENT_R, fontSize: 12, fontWeight: 700 }}>#{i + 1}</span>
              <span style={{ color: TEXT_M, fontSize: 13 }}>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ ...GLASS, padding: 18 }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, color: TEXT, fontSize: 14 }}>Common UX Issues</p>
          {data.commonUxIssues.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < data.commonUxIssues.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ color: ACCENT_A, fontSize: 12, fontWeight: 700 }}>!</span>
              <span style={{ color: TEXT_M, fontSize: 13 }}>{u}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Root ----------

const TABS = [
  { key: 'overview',   label: 'Overview' },
  { key: 'smoke',      label: 'Smoke Tests' },
  { key: 'routes',     label: 'Routes' },
  { key: 'mobile',     label: 'Mobile' },
  { key: 'qa',         label: 'QA Checklist' },
  { key: 'repair',     label: 'Repair Queue' },
  { key: 'analytics',  label: 'Analytics' },
];

export default function QualityPage() {
  const [tab, setTab] = useState('overview');

  const handleTab = (key: string) => {
    track('quality_tab_change', { tab: key });
    setTab(key);
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: FONT }}>
      {/* Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, ...GLASS, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 14 }}>
            Factory
          </Link>
          <span style={{ color: BORDER, fontSize: 14 }}>/</span>
          <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Quality</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: TEXT }}>Generation Quality</h1>
          <p style={{ margin: '6px 0 0', color: TEXT_M, fontSize: 15 }}>Validate, score, and repair AI-generated apps</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 2 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => handleTab(t.key)}
              style={{ background: tab === t.key ? ACCENT : 'transparent', color: tab === t.key ? '#fff' : TEXT_M, border: `1px solid ${tab === t.key ? ACCENT : BORDER}`, borderRadius: 99, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ ...GLASS, padding: 24 }}>
          {tab === 'overview'   && <OverviewTab />}
          {tab === 'smoke'      && <SmokeTab />}
          {tab === 'routes'     && <RoutesTab />}
          {tab === 'mobile'     && <MobileTab />}
          {tab === 'qa'         && <QaTab />}
          {tab === 'repair'     && <RepairTab />}
          {tab === 'analytics'  && <AnalyticsTab />}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px 0 24px', color: TEXT_M, fontSize: 13 }}>
        Generated with Factory ✦
      </div>
    </div>
  );
}
