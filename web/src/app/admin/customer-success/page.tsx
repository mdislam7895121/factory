'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/env';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const ACCENT_GRN = '#10b981';
const ACCENT_AMB = '#f59e0b';
const ACCENT_RED = '#ef4444';
const ACCENT_CYAN = '#06b6d4';
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

type LeadStatus = 'INVITED' | 'JOINED' | 'ACTIVE' | 'STUCK' | 'CONVERTED' | 'CHURN_RISK' | 'CLOSED';
type HealthLevel = 'GOOD' | 'WATCH' | 'AT_RISK' | 'CRITICAL';
type TaskType = 'EMAIL_FOLLOWUP' | 'DEMO_HELP' | 'BUG_TRIAGE' | 'BILLING_HELP' | 'FEATURE_DISCOVERY' | 'ACTIVATION_NUDGE' | 'CHURN_PREVENTION';

interface BetaCohort { id: string; name: string; type: string; leadCount: number; isOpen: boolean; createdAt: string; }
interface BetaInviteLead {
  id: string; cohortId: string; emailMasked: string; displayName: string;
  status: LeadStatus; demoCompleted: boolean; previewRevealed: boolean;
  workspaceOpened: boolean; feedbackCount: number; supportTicketCount: number;
  billingIntent: boolean; onboardingStepCount: number; lastActivityAt: string | null;
}
interface CustomerHealthScore { leadId: string; score: number; health: HealthLevel; recommendedAction: string; }
interface CohortSummary {
  cohortId: string; cohortName: string; invitedCount: number; joinedCount: number;
  activatedCount: number; stuckCount: number; churnRiskCount: number;
  activationRate: number; supportVolume: number; upgradeIntentCount: number;
  topStuckReasons: string[];
}
interface CSTask { id: string; leadId: string; type: TaskType; title: string; status: string; createdAt: string; }

const STATUS_COLORS: Record<LeadStatus, string> = {
  INVITED:    ACCENT_CYAN,
  JOINED:     ACCENT,
  ACTIVE:     ACCENT_GRN,
  STUCK:      ACCENT_AMB,
  CONVERTED:  '#a78bfa',
  CHURN_RISK: ACCENT_RED,
  CLOSED:     TEXT_M,
};

const HEALTH_COLORS: Record<HealthLevel, string> = {
  GOOD:     ACCENT_GRN,
  WATCH:    ACCENT_AMB,
  AT_RISK:  '#f97316',
  CRITICAL: ACCENT_RED,
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  EMAIL_FOLLOWUP:    'Email follow-up',
  DEMO_HELP:         'Demo help',
  BUG_TRIAGE:        'Bug triage',
  BILLING_HELP:      'Billing help',
  FEATURE_DISCOVERY: 'Feature discovery',
  ACTIVATION_NUDGE:  'Activation nudge',
  CHURN_PREVENTION:  'Churn prevention',
};

// ─── Seeded sample data for display ───────────────────────────────────────

const SAMPLE_COHORTS: BetaCohort[] = [
  { id: 'c1', name: 'Wave 1 — Founders', type: 'FOUNDERS', leadCount: 12, isOpen: true, createdAt: '2026-05-10T09:00:00Z' },
  { id: 'c2', name: 'Wave 2 — Developers', type: 'DEVELOPERS', leadCount: 8, isOpen: true, createdAt: '2026-05-15T09:00:00Z' },
  { id: 'c3', name: 'Internal Testers', type: 'INTERNAL_TESTERS', leadCount: 5, isOpen: false, createdAt: '2026-05-01T09:00:00Z' },
];

const SAMPLE_LEADS: BetaInviteLead[] = [
  { id: 'l1', cohortId: 'c1', emailMasked: 'al***@startup.io', displayName: 'Alice M.', status: 'ACTIVE', demoCompleted: true, previewRevealed: true, workspaceOpened: true, feedbackCount: 3, supportTicketCount: 0, billingIntent: true, onboardingStepCount: 7, lastActivityAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'l2', cohortId: 'c1', emailMasked: 'bo***@agency.co', displayName: 'Bob K.', status: 'STUCK', demoCompleted: false, previewRevealed: false, workspaceOpened: false, feedbackCount: 0, supportTicketCount: 2, billingIntent: false, onboardingStepCount: 1, lastActivityAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'l3', cohortId: 'c2', emailMasked: 'ca***@dev.com', displayName: 'Carlos R.', status: 'JOINED', demoCompleted: true, previewRevealed: false, workspaceOpened: false, feedbackCount: 1, supportTicketCount: 1, billingIntent: false, onboardingStepCount: 3, lastActivityAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'l4', cohortId: 'c1', emailMasked: 'di***@corp.io', displayName: 'Diana S.', status: 'CONVERTED', demoCompleted: true, previewRevealed: true, workspaceOpened: true, feedbackCount: 5, supportTicketCount: 0, billingIntent: true, onboardingStepCount: 9, lastActivityAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'l5', cohortId: 'c2', emailMasked: 'er***@mail.com', displayName: 'Erik J.', status: 'CHURN_RISK', demoCompleted: false, previewRevealed: false, workspaceOpened: false, feedbackCount: 0, supportTicketCount: 3, billingIntent: false, onboardingStepCount: 0, lastActivityAt: new Date(Date.now() - 86400000 * 8).toISOString() },
];

const SAMPLE_HEALTH: Record<string, CustomerHealthScore> = {
  l1: { leadId: 'l1', score: 88, health: 'GOOD', recommendedAction: 'Continue monitoring — user is healthy' },
  l2: { leadId: 'l2', score: 22, health: 'CRITICAL', recommendedAction: 'Send demo help — user has not completed demo' },
  l3: { leadId: 'l3', score: 48, health: 'WATCH', recommendedAction: 'Schedule activation nudge — preview not seen' },
  l4: { leadId: 'l4', score: 95, health: 'GOOD', recommendedAction: 'Continue monitoring — user is healthy' },
  l5: { leadId: 'l5', score: 8, health: 'CRITICAL', recommendedAction: 'Immediate churn prevention outreach' },
};

const SAMPLE_SUMMARIES: CohortSummary[] = [
  { cohortId: 'c1', cohortName: 'Wave 1 — Founders', invitedCount: 12, joinedCount: 9, activatedCount: 6, stuckCount: 2, churnRiskCount: 1, activationRate: 50, supportVolume: 3, upgradeIntentCount: 4, topStuckReasons: ['Demo not completed', 'Preview not revealed'] },
  { cohortId: 'c2', cohortName: 'Wave 2 — Developers', invitedCount: 8, joinedCount: 5, activatedCount: 2, stuckCount: 1, churnRiskCount: 1, activationRate: 25, supportVolume: 5, upgradeIntentCount: 1, topStuckReasons: ['Preview not revealed', 'High support load'] },
  { cohortId: 'c3', cohortName: 'Internal Testers', invitedCount: 5, joinedCount: 5, activatedCount: 5, stuckCount: 0, churnRiskCount: 0, activationRate: 100, supportVolume: 0, upgradeIntentCount: 3, topStuckReasons: [] },
];

const SAMPLE_TASKS: CSTask[] = [
  { id: 't1', leadId: 'l2', type: 'DEMO_HELP', title: 'Schedule demo walkthrough with Bob', status: 'OPEN', createdAt: '2026-05-22T10:00:00Z' },
  { id: 't2', leadId: 'l5', type: 'CHURN_PREVENTION', title: 'Reach out to Erik — 8 days inactive', status: 'OPEN', createdAt: '2026-05-22T11:00:00Z' },
  { id: 't3', leadId: 'l3', type: 'ACTIVATION_NUDGE', title: 'Nudge Carlos to reveal preview', status: 'OPEN', createdAt: '2026-05-22T12:00:00Z' },
  { id: 't4', leadId: 'l1', type: 'EMAIL_FOLLOWUP', title: 'Check in with Alice about upgrade', status: 'DONE', createdAt: '2026-05-21T09:00:00Z' },
];

// ──────────────────────────────────────────────────────────────────────────

type CSView = 'overview' | 'leads' | 'tasks';

function HealthBadge({ score, health }: { score: number; health: HealthLevel }) {
  const color = HEALTH_COLORS[health];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, color,
    }}>
      {score} · {health}
    </span>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, color,
    }}>
      {status}
    </span>
  );
}

export default function CustomerSuccessPage() {
  const [view, setView] = useState<CSView>('overview');
  const [cohorts, setCohorts] = useState<BetaCohort[]>(SAMPLE_COHORTS);
  const [leads, setLeads] = useState<BetaInviteLead[]>(SAMPLE_LEADS);
  const [summaries] = useState<CohortSummary[]>(SAMPLE_SUMMARIES);
  const [tasks] = useState<CSTask[]>(SAMPLE_TASKS);
  const [selectedLead, setSelectedLead] = useState<BetaInviteLead | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch(apiUrl('/admin/customer-success/cohorts'))
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.length) setCohorts(data); })
      .catch(() => {});
    fetch(apiUrl('/admin/customer-success/leads'))
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.length) setLeads(data); })
      .catch(() => {});
  }, []);

  const openCount = tasks.filter(t => t.status === 'OPEN').length;
  const criticalLeads = leads.filter(l => SAMPLE_HEALTH[l.id]?.health === 'CRITICAL');

  const tab = (v: CSView, label: string) => (
    <button
      onClick={() => setView(v)}
      style={{
        background: view === v ? ACCENT : 'transparent',
        border: view === v ? 'none' : `1px solid ${BORDER}`,
        borderRadius: 8, padding: '7px 18px',
        color: view === v ? '#fff' : TEXT_M,
        cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, color: TEXT, padding: '0 0 80px' }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT_M }}>
            <span style={{ fontWeight: 600 }}>Admin</span>
            <span style={{ color: BORDER }}>/</span>
            <span style={{ color: TEXT, fontWeight: 600 }}>Customer Success</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {openCount > 0 && (
              <span style={{ background: `${ACCENT_RED}20`, border: `1px solid ${ACCENT_RED}44`, borderRadius: 8, padding: '4px 10px', fontSize: 12, color: ACCENT_RED, fontWeight: 700 }}>
                {openCount} open tasks
              </span>
            )}
            {criticalLeads.length > 0 && (
              <span style={{ background: `${ACCENT_AMB}20`, border: `1px solid ${ACCENT_AMB}44`, borderRadius: 8, padding: '4px 10px', fontSize: 12, color: ACCENT_AMB, fontWeight: 700 }}>
                {criticalLeads.length} critical
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 0' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Beta Customer Success
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: TEXT_M }}>
          Track cohorts, monitor health, and manage follow-up tasks.
        </p>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {tab('overview', 'Overview')}
          {tab('leads', 'Leads')}
          {tab('tasks', 'Tasks')}
        </div>

        {/* ── OVERVIEW ── */}
        {view === 'overview' && (
          <>
            {/* Cohort summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>
              {summaries.map(s => (
                <div key={s.cohortId} style={{ ...GLASS, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.cohortName}</div>
                      <div style={{ fontSize: 12, color: TEXT_M, marginTop: 2 }}>{s.invitedCount} invited</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.activationRate >= 50 ? ACCENT_GRN : s.activationRate >= 25 ? ACCENT_AMB : ACCENT_RED }}>
                      {s.activationRate}%
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'Joined', value: s.joinedCount, color: ACCENT },
                      { label: 'Activated', value: s.activatedCount, color: ACCENT_GRN },
                      { label: 'Stuck', value: s.stuckCount, color: ACCENT_AMB },
                      { label: 'Churn risk', value: s.churnRiskCount, color: ACCENT_RED },
                      { label: 'Converted', value: s.invitedCount - s.stuckCount - s.churnRiskCount, color: '#a78bfa' },
                      { label: 'Support', value: s.supportVolume, color: TEXT_M },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center', padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
                        <div style={{ fontSize: 10, color: TEXT_M, marginTop: 2 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {s.topStuckReasons.length > 0 && (
                    <div style={{ fontSize: 11, color: ACCENT_AMB }}>
                      Stuck: {s.topStuckReasons.slice(0, 2).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommended actions */}
            <div style={{ ...GLASS, padding: 24, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Recommended Next Actions</h2>
              {Object.values(SAMPLE_HEALTH)
                .filter(h => h.health !== 'GOOD')
                .sort((a, b) => a.score - b.score)
                .slice(0, 4)
                .map(h => {
                  const lead = leads.find(l => l.id === h.leadId);
                  if (!lead) return null;
                  return (
                    <div key={h.leadId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                      <HealthBadge score={h.score} health={h.health} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{lead.displayName}</span>
                        <span style={{ fontSize: 12, color: TEXT_M, marginLeft: 8 }}>{h.recommendedAction}</span>
                      </div>
                      <button
                        onClick={() => { setView('leads'); setSelectedLead(lead); }}
                        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '5px 12px', color: TEXT, cursor: 'pointer', fontFamily: FONT, fontSize: 12 }}
                      >
                        View
                      </button>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* ── LEADS ── */}
        {view === 'leads' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 360px' : '1fr', gap: 20 }}>
            {/* Lead table */}
            <div style={{ ...GLASS, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 700, color: TEXT_M }}>
                {leads.length} leads across {cohorts.length} cohorts
              </div>
              <div>
                {leads.map(lead => {
                  const h = SAMPLE_HEALTH[lead.id];
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(isSelected ? null : lead)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 20px',
                        borderBottom: `1px solid ${BORDER}`,
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(99,102,241,0.08)' : 'transparent',
                        borderLeft: isSelected ? `3px solid ${ACCENT}` : '3px solid transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.displayName}</div>
                        <div style={{ fontSize: 12, color: TEXT_M, marginTop: 2 }}>{lead.emailMasked}</div>
                      </div>
                      <StatusBadge status={lead.status} />
                      {h && <HealthBadge score={h.score} health={h.health} />}
                      <div style={{ fontSize: 11, color: TEXT_M, minWidth: 70, textAlign: 'right' }}>
                        {lead.onboardingStepCount} steps
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lead detail panel */}
            {selectedLead && (() => {
              const h = SAMPLE_HEALTH[selectedLead.id];
              const leadNotes = [{ body: 'Initial outreach made. Seemed interested in billing features.', author: 'founder', createdAt: '2026-05-20T10:00:00Z' }];
              return (
                <div style={{ ...GLASS, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedLead.displayName}</div>
                      <div style={{ fontSize: 12, color: TEXT_M }}>{selectedLead.emailMasked}</div>
                    </div>
                    <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: TEXT_M, cursor: 'pointer', fontSize: 18 }}>×</button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    <StatusBadge status={selectedLead.status} />
                    {h && <HealthBadge score={h.score} health={h.health} />}
                  </div>

                  {/* Activity checklist */}
                  <div style={{ marginBottom: 16 }}>
                    {[
                      { label: 'Demo completed', done: selectedLead.demoCompleted },
                      { label: 'Preview revealed', done: selectedLead.previewRevealed },
                      { label: 'Workspace opened', done: selectedLead.workspaceOpened },
                      { label: 'Billing intent', done: selectedLead.billingIntent },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                        <span style={{ color: item.done ? ACCENT_GRN : TEXT_M }}>{item.done ? '✓' : '○'}</span>
                        <span style={{ color: item.done ? TEXT : TEXT_M }}>{item.label}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: TEXT_M, marginTop: 6 }}>
                      Feedback: {selectedLead.feedbackCount} · Tickets: {selectedLead.supportTicketCount} · Steps: {selectedLead.onboardingStepCount}
                    </div>
                  </div>

                  {/* Recommended action */}
                  {h && (
                    <div style={{ background: 'rgba(99,102,241,0.07)', border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: TEXT_M }}>
                      <span style={{ fontWeight: 700, color: ACCENT }}>Next: </span>{h.recommendedAction}
                    </div>
                  )}

                  {/* Notes */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_M, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</div>
                    {leadNotes.map((n, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 10px', marginBottom: 6, fontSize: 12, color: TEXT_M }}>
                        {n.body}
                      </div>
                    ))}
                    <textarea
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Add a note…"
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
                        borderRadius: 6, color: TEXT, padding: '8px 10px', fontSize: 12,
                        fontFamily: FONT, resize: 'vertical', minHeight: 56,
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={() => setNewNote('')}
                      style={{
                        marginTop: 6, background: ACCENT, border: 'none', borderRadius: 6,
                        color: '#fff', padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: FONT,
                      }}
                    >
                      Save note
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── TASKS ── */}
        {view === 'tasks' && (
          <div style={{ ...GLASS, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_M }}>{openCount} open tasks</span>
            </div>
            {tasks.map(task => {
              const lead = leads.find(l => l.id === task.leadId);
              const isDone = task.status === 'DONE';
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', borderBottom: `1px solid ${BORDER}`,
                    opacity: isDone ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: 18, minWidth: 28, textAlign: 'center' }}>
                    {task.type === 'DEMO_HELP' ? '🎬' :
                     task.type === 'CHURN_PREVENTION' ? '🚨' :
                     task.type === 'ACTIVATION_NUDGE' ? '⚡' :
                     task.type === 'EMAIL_FOLLOWUP' ? '📧' :
                     task.type === 'BUG_TRIAGE' ? '🐛' :
                     task.type === 'BILLING_HELP' ? '💳' : '🔍'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, textDecorationLine: isDone ? 'line-through' : 'none' }}>{task.title}</div>
                    <div style={{ fontSize: 11, color: TEXT_M, marginTop: 2 }}>
                      {TASK_TYPE_LABELS[task.type]} · {lead?.displayName ?? task.leadId}
                    </div>
                  </div>
                  <span style={{
                    background: isDone ? `${ACCENT_GRN}18` : `${ACCENT}18`,
                    border: `1px solid ${isDone ? ACCENT_GRN : ACCENT}44`,
                    borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    color: isDone ? ACCENT_GRN : ACCENT,
                  }}>
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
