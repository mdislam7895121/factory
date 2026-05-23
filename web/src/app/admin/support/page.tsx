'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/env';
import { track } from '@/lib/analytics';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const ACCENT_R = '#ef4444';
const ACCENT_A = '#f59e0b';
const ACCENT_G = '#10b981';
const ACCENT_C = '#06b6d4';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: 12 };
const FONT    = "'Geist','Inter',system-ui,sans-serif";

type FeedbackStatus   = 'OPEN' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type FeedbackCategory = 'BUG'|'FEATURE_REQUEST'|'QUALITY_ISSUE'|'BILLING'|'RUNTIME'|'PREVIEW'|'ACCOUNT'|'ABUSE'|'GENERAL';
type FeedbackSeverity = 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW';

interface Ticket {
  id:           string;
  category:     FeedbackCategory;
  severity:     FeedbackSeverity;
  status:       FeedbackStatus;
  title:        string;
  body:         string;
  route:        string;
  submitterHash: string;
  createdAt:    string;
  updatedAt:    string;
  assignedTo?:  string;
  replies:      Array<{ id: string; body: string; author: string; isAdmin: boolean; createdAt: string }>;
}

interface Analytics {
  total:      number;
  open:       number;
  triaged:    number;
  inProgress: number;
  resolved:   number;
  closed:     number;
  openCritical: number;
  byCategory: Record<string, number>;
  avgResolveSec: number;
}

interface Pain { category: string; title: string; frequency: number; severity: string; score: number; }
interface Roadmap { pain: Pain; suggestedSerial: string; affectedModule: string; urgency: string; customerValue: string; founderImpact: string; }

const STATUS_COLOR: Record<FeedbackStatus, string> = {
  OPEN:        ACCENT_R,
  TRIAGED:     ACCENT_A,
  IN_PROGRESS: ACCENT,
  RESOLVED:    ACCENT_G,
  CLOSED:      TEXT_M,
};
const SEV_COLOR: Record<FeedbackSeverity, string> = {
  CRITICAL: ACCENT_R, HIGH: ACCENT_A, MEDIUM: ACCENT, LOW: TEXT_M,
};
const CAT_TABS: Array<{ label: string; value: FeedbackCategory | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Bugs', value: 'BUG' },
  { label: 'Quality', value: 'QUALITY_ISSUE' },
  { label: 'Runtime', value: 'RUNTIME' },
  { label: 'Billing', value: 'BILLING' },
  { label: 'Abuse', value: 'ABUSE' },
  { label: 'Feature', value: 'FEATURE_REQUEST' },
];

const MOCK_ANALYTICS: Analytics = {
  total:9, open:4, triaged:2, inProgress:1, resolved:1, closed:1,
  openCritical:1, byCategory:{ BUG:4, QUALITY_ISSUE:2, BILLING:1, RUNTIME:1, GENERAL:1 },
  avgResolveSec:7200,
};

const MOCK_TICKETS: Ticket[] = [
  { id:'fb_001', category:'BUG', severity:'CRITICAL', status:'OPEN', title:'App crashes on workspace load', body:'Blank screen after auth redirect', route:'/workspace', submitterHash:'u_a1b2c3', createdAt: new Date(Date.now()-3600000).toISOString(), updatedAt: new Date().toISOString(), replies:[] },
  { id:'fb_002', category:'QUALITY_ISSUE', severity:'HIGH', status:'TRIAGED', title:'Generated React has broken hooks', body:'useState used outside component', route:'/demo', submitterHash:'u_d4e5f6', createdAt: new Date(Date.now()-7200000).toISOString(), updatedAt: new Date().toISOString(), replies:[] },
  { id:'fb_003', category:'BILLING', severity:'HIGH', status:'OPEN', title:'Charged twice for Creator plan', body:'Two charges on same card', route:'/admin/billing', submitterHash:'u_g7h8i9', createdAt: new Date(Date.now()-86400000).toISOString(), updatedAt: new Date().toISOString(), replies:[] },
  { id:'fb_004', category:'RUNTIME', severity:'MEDIUM', status:'IN_PROGRESS', title:'Preview takes 30s+ to load', body:'Cold start very slow for all runtimes', route:'/workspace/[id]/editor', submitterHash:'u_j1k2l3', createdAt: new Date(Date.now()-172800000).toISOString(), updatedAt: new Date().toISOString(), replies:[] },
];

const MOCK_PAINS: Pain[] = [
  { category:'BUG', title:'Functional bugs reported by users', frequency:4, severity:'CRITICAL', score:24 },
  { category:'BILLING', title:'Billing and payment issues', frequency:1, severity:'HIGH', score:18 },
  { category:'QUALITY_ISSUE', title:'AI-generated output quality complaints', frequency:2, severity:'HIGH', score:15 },
  { category:'RUNTIME', title:'Runtime failures and crashes', frequency:1, severity:'MEDIUM', score:10 },
];

const MOCK_ROADMAP: Roadmap[] = [
  { pain: MOCK_PAINS[0], suggestedSerial:'SERIAL 30 (hotfix)', affectedModule:'varies', urgency:'IMMEDIATE', customerValue:'Unblocking users who cannot use the product', founderImpact:'Fix immediately — blocking revenue or core retention' },
  { pain: MOCK_PAINS[1], suggestedSerial:'SERIAL 30+', affectedModule:'billing', urgency:'IMMEDIATE', customerValue:'Directly affects conversion or retention', founderImpact:'Fix immediately — blocking revenue or core retention' },
];

function urgencyColor(u: string): string {
  if (u === 'IMMEDIATE')    return ACCENT_R;
  if (u === 'NEXT_SPRINT')  return ACCENT_A;
  return TEXT_M;
}

function rel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SupportPage() {
  const [tickets,  setTickets]  = useState<Ticket[]>(MOCK_TICKETS);
  const [analytics, setAnalytics] = useState<Analytics>(MOCK_ANALYTICS);
  const [pains,    setPains]    = useState<Pain[]>(MOCK_PAINS);
  const [roadmap,  setRoadmap]  = useState<Roadmap[]>(MOCK_ROADMAP);
  const [tab,      setTab]      = useState<FeedbackCategory | 'ALL'>('ALL');
  const [view,     setView]     = useState<'tickets' | 'pains' | 'roadmap'>('tickets');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [sending,  setSending]  = useState(false);
  const [err,      setErr]      = useState('');

  const load = useCallback(async () => {
    try {
      const [aRes, tRes, pRes, rRes] = await Promise.allSettled([
        fetch(apiUrl('/admin/support/analytics')),
        fetch(apiUrl('/admin/support/tickets')),
        fetch(apiUrl('/admin/support/pains')),
        fetch(apiUrl('/admin/support/roadmap')),
      ]);
      if (aRes.status === 'fulfilled' && aRes.value.ok) setAnalytics(await aRes.value.json() as Analytics);
      if (tRes.status === 'fulfilled' && tRes.value.ok) setTickets(await tRes.value.json() as Ticket[]);
      if (pRes.status === 'fulfilled' && pRes.value.ok) setPains(await pRes.value.json() as Pain[]);
      if (rRes.status === 'fulfilled' && rRes.value.ok) setRoadmap(await rRes.value.json() as Roadmap[]);
    } catch { /* use mock data */ }
  }, []);

  useEffect(() => {
    track('admin_support_opened');
    void load();
  }, [load]);

  const filteredTickets = tab === 'ALL' ? tickets : tickets.filter(t => t.category === tab);

  const sendReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    try {
      const res = await fetch(apiUrl(`/admin/support/tickets/${selected.id}/reply`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody }),
      });
      if (res.ok) {
        const updated = await res.json() as Ticket;
        setTickets(ts => ts.map(t => t.id === updated.id ? updated : t));
        setSelected(updated);
        setReplyBody('');
        track('support_reply_sent', { ticketId: selected.id });
      } else {
        setErr(`Reply failed: HTTP ${res.status}`);
      }
    } catch { setErr('Network error sending reply.'); }
    setSending(false);
  };

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    try {
      const res = await fetch(apiUrl(`/admin/support/tickets/${id}/status`), {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json() as Ticket;
        setTickets(ts => ts.map(t => t.id === updated.id ? updated : t));
        if (selected?.id === id) setSelected(updated);
        track('support_status_changed', { ticketId: id, status });
      }
    } catch { setErr('Failed to update status.'); }
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: 0 }}>Support Inbox</h1>
          <p style={{ color: TEXT_M, fontSize: 13, marginTop: 4 }}>Customer feedback · pain ranking · roadmap signal</p>
        </div>
        <button onClick={() => void load()} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.3)`, color: ACCENT, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
      </div>

      {err && <div style={{ ...GLASS, padding: '10px 14px', marginBottom: 16, color: ACCENT_A, fontSize: 13, border: `1px solid ${ACCENT_A}` }}>⚠️ {err}</div>}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total', value: analytics.total, color: TEXT },
          { label: 'Open', value: analytics.open, color: ACCENT_R },
          { label: 'Triaged', value: analytics.triaged, color: ACCENT_A },
          { label: 'In Progress', value: analytics.inProgress, color: ACCENT },
          { label: 'Resolved', value: analytics.resolved, color: ACCENT_G },
          { label: '🔴 Critical', value: analytics.openCritical, color: ACCENT_R },
        ].map(c => (
          <div key={c.label} style={{ ...GLASS, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: TEXT_M, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* View switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['tickets', 'pains', 'roadmap'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${view === v ? ACCENT : BORDER}`, background: view === v ? 'rgba(99,102,241,0.1)' : 'transparent', color: view === v ? ACCENT : TEXT_M, cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {v === 'tickets' ? '🎫 Tickets' : v === 'pains' ? '📊 Pain Ranking' : '🗺️ Roadmap'}
          </button>
        ))}
      </div>

      {/* ── TICKETS VIEW ── */}
      {view === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>
          <div>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {CAT_TABS.map(ct => (
                <button key={ct.value} onClick={() => setTab(ct.value)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${tab === ct.value ? ACCENT : BORDER}`, background: tab === ct.value ? 'rgba(99,102,241,0.12)' : 'transparent', color: tab === ct.value ? ACCENT : TEXT_M, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {ct.label}
                  {ct.value !== 'ALL' && (
                    <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                      {tickets.filter(t => t.category === ct.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredTickets.length === 0 ? (
              <div style={{ ...GLASS, padding: 32, textAlign: 'center', color: TEXT_M }}>No tickets in this category.</div>
            ) : filteredTickets.map(ticket => (
              <div key={ticket.id} onClick={() => { setSelected(ticket); track('support_ticket_opened', { category: ticket.category }); }}
                style={{ ...GLASS, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', borderLeft: `3px solid ${SEV_COLOR[ticket.severity]}`, transition: 'all 0.15s', background: selected?.id === ticket.id ? 'rgba(99,102,241,0.06)' : SURFACE }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.title}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: `${SEV_COLOR[ticket.severity]}22`, color: SEV_COLOR[ticket.severity], fontWeight: 700 }}>{ticket.severity}</span>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: TEXT_M }}>{ticket.category.replace('_', ' ')}</span>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: STATUS_COLOR[ticket.status], fontWeight: 600 }}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: TEXT_M, whiteSpace: 'nowrap' }}>{rel(ticket.createdAt)}</span>
                </div>
                {ticket.replies.length > 0 && <div style={{ fontSize: 11, color: ACCENT, marginTop: 6 }}>💬 {ticket.replies.length} repl{ticket.replies.length === 1 ? 'y' : 'ies'}</div>}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ ...GLASS, padding: 20, height: 'fit-content', position: 'sticky', top: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: TEXT_M }}>#{selected.id}</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: TEXT_M, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{selected.title}</div>
              <p style={{ fontSize: 13, color: TEXT_M, lineHeight: 1.6, marginBottom: 14 }}>{selected.body}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {(['OPEN','TRIAGED','IN_PROGRESS','RESOLVED','CLOSED'] as FeedbackStatus[]).map(s => (
                  <button key={s} onClick={() => void updateStatus(selected.id, s)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${selected.status === s ? STATUS_COLOR[s] : BORDER}`, background: selected.status === s ? `${STATUS_COLOR[s]}22` : 'transparent', color: selected.status === s ? STATUS_COLOR[s] : TEXT_M, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 14 }}>
                Route: <span style={{ color: ACCENT_C }}>{selected.route || '—'}</span> ·
                Submitter: <span style={{ color: TEXT }}>{selected.submitterHash}</span>
              </div>

              {selected.replies.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thread</div>
                  {selected.replies.map(r => (
                    <div key={r.id} style={{ padding: '8px 12px', borderRadius: 8, background: r.isAdmin ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, marginBottom: 6 }}>
                      <div style={{ fontSize: 11, color: r.isAdmin ? ACCENT : TEXT_M, fontWeight: 600, marginBottom: 4 }}>{r.isAdmin ? '🛡️ Support' : '👤 User'}</div>
                      <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{r.body}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <textarea
                  value={replyBody}
                  onChange={e => setReplyBody(e.target.value)}
                  placeholder="Write a reply…"
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: '10px 12px', fontSize: 13, fontFamily: FONT, resize: 'vertical', boxSizing: 'border-box' }}
                />
                <button onClick={() => void sendReply()} disabled={sending || !replyBody.trim()}
                  style={{ padding: '9px', borderRadius: 8, background: ACCENT, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: sending ? 'wait' : 'pointer', opacity: (!replyBody.trim()) ? 0.5 : 1 }}>
                  {sending ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PAIN RANKING VIEW ── */}
      {view === 'pains' && (
        <div>
          <p style={{ fontSize: 13, color: TEXT_M, marginBottom: 16 }}>Ranked by frequency × severity × revenue impact. Excludes CLOSED tickets.</p>
          {pains.length === 0 ? (
            <div style={{ ...GLASS, padding: 32, textAlign: 'center', color: TEXT_M }}>No pain data yet — submit feedback to generate ranking.</div>
          ) : pains.map((p, i) => (
            <div key={p.category} style={{ ...GLASS, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: i < 3 ? ACCENT_R : TEXT_M, minWidth: 36, textAlign: 'center' }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{p.title}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: TEXT_M }}>📊 {p.frequency} reports</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: `${SEV_COLOR[p.severity as FeedbackSeverity] ?? TEXT_M}22`, color: SEV_COLOR[p.severity as FeedbackSeverity] ?? TEXT_M }}>{p.severity}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: TEXT_M }}>{p.category.replace('_', ' ')}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: i < 3 ? ACCENT_R : ACCENT }}>{p.score}</div>
                <div style={{ fontSize: 10, color: TEXT_M }}>score</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ROADMAP VIEW ── */}
      {view === 'roadmap' && (
        <div>
          <p style={{ fontSize: 13, color: TEXT_M, marginBottom: 16 }}>Suggested next steps derived from customer pain ranking.</p>
          {roadmap.length === 0 ? (
            <div style={{ ...GLASS, padding: 32, textAlign: 'center', color: TEXT_M }}>No roadmap data yet.</div>
          ) : roadmap.map((r, i) => (
            <div key={i} style={{ ...GLASS, padding: '18px 20px', marginBottom: 12, borderLeft: `3px solid ${urgencyColor(r.urgency)}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${urgencyColor(r.urgency)}22`, color: urgencyColor(r.urgency), fontWeight: 700 }}>{r.urgency.replace('_', ' ')}</span>
                <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{r.suggestedSerial}</span>
                <span style={{ fontSize: 12, color: TEXT_M }}>→ {r.affectedModule}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{r.pain.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Customer Value</div>
                  <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5 }}>{r.customerValue}</div>
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Founder Impact</div>
                  <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5 }}>{r.founderImpact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
