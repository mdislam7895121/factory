'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE  = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
const ACCENT    = '#6366f1';
const ACCENT_R  = '#ef4444';
const ACCENT_A  = '#f59e0b';
const ACCENT_GN = '#10b981';
const ACCENT_C  = '#06b6d4';
const BORDER    = 'rgba(255,255,255,0.07)';
const SURFACE   = 'rgba(10,22,40,0.82)';
const BG        = '#030712';
const TEXT      = '#f1f5f9';
const TEXT_M    = '#64748b';
const TEXT_D    = '#334155';
const GLASS: React.CSSProperties = { background: SURFACE, backdropFilter: 'blur(20px)', border: `1px solid ${BORDER}`, borderRadius: 12 };

function track(event: string, meta?: Record<string, unknown>) {
  console.debug('[factory:memory]', { event, ts: Date.now(), ...meta });
}

const TABS = ['Founder Profile', 'Project Rules', 'Locked Decisions', 'Agent Behavior', 'Context Packs', 'Snapshots', 'Audit History'];

function PriorityBadge({ p }: { p: string }) {
  const colors: Record<string, string> = { CRITICAL: ACCENT_R, HIGH: ACCENT_A, NORMAL: ACCENT, LOW: TEXT_D };
  return (
    <span style={{ background: colors[p] ?? TEXT_D, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>
      {p}
    </span>
  );
}

function FounderProfile() {
  const [profile, setProfile] = useState({
    userId: 'demo-user', founderName: 'Alex Rivera', company: 'Factory Labs',
    role: 'Founder & CEO', country: 'US', timezone: 'America/New_York',
    preferredLang: 'en', techLevel: 'intermediate', commStyle: 'balanced',
    preferredStack: ['NestJS', 'Next.js', 'PostgreSQL'] as string[],
    goals: ['Ship serial 20D', 'Reach 100 users'] as string[],
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [stackInput, setStackInput] = useState(profile.preferredStack.join(', '));
  const [goalsInput, setGoalsInput] = useState(profile.goals.join(', '));

  const save = async () => {
    const payload = { ...profile, preferredStack: stackInput.split(',').map(s => s.trim()).filter(Boolean), goals: goalsInput.split(',').map(s => s.trim()).filter(Boolean) };
    setProfile(payload);
    track('memory_profile_save', { userId: payload.userId });
    try { await fetch(`${API_BASE}/v1/memory/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); } catch {}
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const field = (label: string, key: keyof typeof profile, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 220px', minWidth: 180 }}>
      <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        value={String(profile[key])}
        onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14, outline: 'none' }}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {field('Founder Name', 'founderName')}
        {field('Company', 'company')}
        {field('Role', 'role')}
        {field('Country', 'country')}
        {field('Timezone', 'timezone')}
        {field('User ID', 'userId')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 140px' }}>
          <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Language</label>
          <select value={profile.preferredLang} onChange={e => setProfile(p => ({ ...p, preferredLang: e.target.value }))} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }}>
            <option value="en">English</option><option value="es">Spanish</option><option value="pt">Portuguese</option><option value="fr">French</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 140px' }}>
          <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Tech Level</label>
          <select value={profile.techLevel} onChange={e => setProfile(p => ({ ...p, techLevel: e.target.value }))} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }}>
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 140px' }}>
          <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Comm Style</label>
          <select value={profile.commStyle} onChange={e => setProfile(p => ({ ...p, commStyle: e.target.value }))} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }}>
            <option value="direct">Direct</option><option value="balanced">Balanced</option><option value="detailed">Detailed</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 260px' }}>
          <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Preferred Stack (comma-separated)</label>
          <input value={stackInput} onChange={e => setStackInput(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 260px' }}>
          <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Goals (comma-separated)</label>
          <input value={goalsInput} onChange={e => setGoalsInput(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        </div>
      </div>
      <button onClick={save} style={{ alignSelf: 'flex-start', background: profileSaved ? ACCENT_GN : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        {profileSaved ? '✓ Saved' : 'Save Profile'}
      </button>
    </div>
  );
}

function ProjectRules() {
  const [entries, setEntries] = useState([
    { id: 'e1', key: 'Tech Stack',        content: 'NestJS + Next.js + PostgreSQL + Redis',   priority: 'CRITICAL', pinned: true,  tags: ['infra']    },
    { id: 'e2', key: 'Design System',     content: 'Dark theme, inline styles, no Tailwind',  priority: 'HIGH',     pinned: true,  tags: ['design']   },
    { id: 'e3', key: 'Auth Strategy',     content: 'JWT + refresh tokens, no external OAuth', priority: 'HIGH',     pinned: false, tags: ['security'] },
    { id: 'e4', key: 'API Convention',    content: 'REST with NestJS, versioned /v1/',         priority: 'NORMAL',   pinned: false, tags: ['backend']  },
    { id: 'e5', key: 'Deployment Target', content: 'Netlify (web) + Railway (API)',            priority: 'NORMAL',   pinned: false, tags: ['infra']    },
  ]);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState('NORMAL');

  const add = async () => {
    if (!newKey.trim() || !newContent.trim()) return;
    const entry = { id: `e${Date.now()}`, key: newKey.trim(), content: newContent.trim(), priority: newPriority, pinned: false, tags: [] };
    setEntries(prev => [...prev, entry]);
    setNewKey(''); setNewContent('');
    track('memory_entry_add', { key: entry.key });
    try { await fetch(`${API_BASE}/v1/memory/entries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }); } catch {}
  };

  const togglePin = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, pinned: !e.pinned } : e));
    track('memory_entry_pin', { id });
  };

  const archive = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    track('memory_entry_archive', { id });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map(e => (
        <div key={e.id} style={{ ...GLASS, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{e.key}</span>
            {e.pinned && <span title="Pinned">📌</span>}
            <PriorityBadge p={e.priority} />
            {e.tags.map(t => <span key={t} style={{ background: 'rgba(99,102,241,0.18)', color: ACCENT, fontSize: 11, padding: '2px 8px', borderRadius: 99 }}>{t}</span>)}
          </div>
          <p style={{ margin: 0, color: TEXT_M, fontSize: 14 }}>{e.content}</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => togglePin(e.id)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>
              {e.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => archive(e.id)} style={{ background: 'rgba(239,68,68,0.12)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, color: ACCENT_R, fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>
              Archive
            </button>
            <select value={e.priority} onChange={ev => setEntries(prev => prev.map(x => x.id === e.id ? { ...x, priority: ev.target.value } : x))}
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, fontSize: 12, padding: '4px 8px' }}>
              {['CRITICAL','HIGH','NORMAL','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      ))}
      <div style={{ ...GLASS, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 14 }}>Add memory</p>
        <input placeholder="Key (e.g. Naming Convention)" value={newKey} onChange={e => setNewKey(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        <textarea placeholder="Content…" value={newContent} onChange={e => setNewContent(e.target.value)} rows={3}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14, resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }}>
            {['CRITICAL','HIGH','NORMAL','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={add} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Remember →
          </button>
        </div>
      </div>
    </div>
  );
}

function LockedDecisions() {
  const [decisions, setDecisions] = useState([
    { id: 'd1', title: 'Never change core tech stack without council approval', lockState: 'HARD_LOCKED',  description: 'Postgres + NestJS + Next.js is permanent until SERIAL 30+.' },
    { id: 'd2', title: 'All AI output must be proof-verified',                  lockState: 'HARD_LOCKED',  description: 'No serial ships without proof documentation.' },
    { id: 'd3', title: 'Additive-only migrations',                              lockState: 'SOFT_LOCKED',  description: 'No breaking schema changes allowed.' },
    { id: 'd4', title: 'No raw secrets in code',                                lockState: 'SOFT_LOCKED',  description: 'BLOCKED_META_KEYS pattern enforced everywhere.' },
    { id: 'd5', title: 'Feature: Admin API key gating',                         lockState: 'UNLOCKED',     description: 'Currently using simple bearer token auth.' },
  ]);
  const [newDecTitle, setNewDecTitle] = useState('');
  const [newDecDesc, setNewDecDesc]   = useState('');

  const setLock = async (id: string, state: string) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, lockState: state } : d));
    if (state === 'UNLOCKED') track('memory_decision_unlock', { id });
    else track('memory_decision_lock', { id, state });
    try { await fetch(`${API_BASE}/v1/memory/decisions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lockState: state }) }); } catch {}
  };

  const addDecision = () => {
    if (!newDecTitle.trim()) return;
    setDecisions(prev => [...prev, { id: `d${Date.now()}`, title: newDecTitle.trim(), lockState: 'UNLOCKED', description: newDecDesc.trim() }]);
    setNewDecTitle(''); setNewDecDesc('');
  };

  const lockBadge = (s: string) => {
    if (s === 'HARD_LOCKED') return <span style={{ background: 'rgba(239,68,68,0.18)', color: ACCENT_R, fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>🔒 Hard Locked</span>;
    if (s === 'SOFT_LOCKED') return <span style={{ background: 'rgba(245,158,11,0.18)', color: ACCENT_A, fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>⚠️ Soft Locked</span>;
    return <span style={{ background: 'rgba(100,116,139,0.2)', color: TEXT_M, fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>🔓 Unlocked</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {decisions.map(d => (
        <div key={d.id} style={{ ...GLASS, padding: '14px 16px', borderLeft: d.lockState === 'HARD_LOCKED' ? `3px solid ${ACCENT_R}` : `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{d.title}</span>
            {lockBadge(d.lockState)}
          </div>
          <p style={{ margin: 0, color: TEXT_M, fontSize: 14 }}>{d.description}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {d.lockState === 'UNLOCKED' ? (
              <>
                <button onClick={() => setLock(d.id, 'SOFT_LOCKED')} style={{ background: 'rgba(245,158,11,0.12)', border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 6, color: ACCENT_A, fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>Soft Lock</button>
                <button onClick={() => setLock(d.id, 'HARD_LOCKED')} style={{ background: 'rgba(239,68,68,0.12)', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 6, color: ACCENT_R, fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>Hard Lock</button>
              </>
            ) : (
              <button onClick={() => setLock(d.id, 'UNLOCKED')} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>Unlock</button>
            )}
          </div>
        </div>
      ))}
      <div style={{ ...GLASS, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 14 }}>Add decision</p>
        <input placeholder="Decision title…" value={newDecTitle} onChange={e => setNewDecTitle(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        <textarea placeholder="Description…" value={newDecDesc} onChange={e => setNewDecDesc(e.target.value)} rows={2}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14, resize: 'vertical' }} />
        <button onClick={addDecision} style={{ alignSelf: 'flex-start', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Add decision
        </button>
      </div>
    </div>
  );
}

function AgentBehavior() {
  const [instructions, setInstructions] = useState({
    name: 'Founder Mode',
    rules: [
      'Always explain the WHY before the HOW',
      'Default to additive changes — no refactors unless requested',
      'Write minimal comments — code should be self-explanatory',
      'Always include proof before locking a serial',
      'Production-safe defaults only',
      'Never expose secrets or internal metadata',
      'Ask fewer questions — infer from context',
      'Startup founder mode — concise, direct, no fluff',
    ],
  });
  const [newRule, setNewRule] = useState('');
  const [instrSaved, setInstrSaved] = useState(false);

  const addRule = () => {
    if (!newRule.trim()) return;
    setInstructions(prev => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
    setNewRule('');
  };

  const removeRule = (i: number) => setInstructions(prev => ({ ...prev, rules: prev.rules.filter((_, idx) => idx !== i) }));

  const save = async () => {
    track('memory_instructions_save', { name: instructions.name, ruleCount: instructions.rules.length });
    try { await fetch(`${API_BASE}/v1/memory/instructions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(instructions) }); } catch {}
    setInstrSaved(true);
    setTimeout(() => setInstrSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Instruction set name</label>
        <input value={instructions.name} onChange={e => setInstructions(p => ({ ...p, name: e.target.value }))}
          style={{ display: 'block', marginTop: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 15, fontWeight: 700, width: '100%', boxSizing: 'border-box' }} />
      </div>
      <div>
        <p style={{ margin: '0 0 10px', fontWeight: 600, color: TEXT, fontSize: 14 }}>Active instruction set</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {instructions.rules.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px' }}>
              <span style={{ flex: 1, color: TEXT, fontSize: 14 }}>{r}</span>
              <button onClick={() => removeRule(i)} style={{ background: 'none', border: 'none', color: TEXT_M, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input placeholder="Add a new rule…" value={newRule} onChange={e => setNewRule(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addRule()}
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        <button onClick={addRule} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Add</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={save} style={{ background: instrSaved ? ACCENT_GN : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {instrSaved ? '✓ Saved' : 'Save instructions'}
        </button>
        <span style={{ color: TEXT_M, fontSize: 12 }}>These rules are sent to every AI session in your workspace.</span>
      </div>
    </div>
  );
}

function ContextPacks() {
  const [packs, setPacks] = useState([
    { id: 'cp1', label: 'Full Context v1',  compressionLevel: 'FULL',     tokenEstimate: 2840, usageCount: 12, createdAt: '2026-05-20' },
    { id: 'cp2', label: 'Balanced Pack v2', compressionLevel: 'BALANCED', tokenEstimate: 890,  usageCount: 34, createdAt: '2026-05-21' },
    { id: 'cp3', label: 'Minimal Pack',     compressionLevel: 'MINIMAL',  tokenEstimate: 220,  usageCount: 8,  createdAt: '2026-05-22' },
  ]);
  const [packLabel, setPackLabel] = useState('');
  const [packLevel, setPackLevel] = useState<'FULL'|'BALANCED'|'MINIMAL'|'EMERGENCY'>('BALANCED');
  const [generating, setGenerating] = useState(false);

  const levelColors: Record<string, string> = { FULL: ACCENT_C, BALANCED: ACCENT, MINIMAL: ACCENT_GN, EMERGENCY: ACCENT_R };
  const levelDesc: Record<string, string> = { FULL: 'Everything', BALANCED: 'Optimized', MINIMAL: 'Pinned only', EMERGENCY: '3 bullet max' };
  const tokenMap: Record<string, number> = { FULL: 2800, BALANCED: 900, MINIMAL: 200, EMERGENCY: 60 };

  const generate = async () => {
    if (!packLabel.trim()) return;
    setGenerating(true);
    const newPack = { id: `cp${Date.now()}`, label: packLabel.trim(), compressionLevel: packLevel, tokenEstimate: tokenMap[packLevel] + Math.floor(Math.random() * 40), usageCount: 0, createdAt: new Date().toISOString().split('T')[0] };
    setPacks(prev => [newPack, ...prev]);
    setPackLabel('');
    track('memory_pack_generate', { label: newPack.label, compressionLevel: packLevel });
    try { await fetch(`${API_BASE}/v1/memory/context-packs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPack) }); } catch {}
    setGenerating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {packs.map(p => (
        <div key={p.id} style={{ ...GLASS, padding: '14px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: '1 1 180px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 15 }}>{p.label}</p>
            <p style={{ margin: '3px 0 0', color: TEXT_M, fontSize: 12 }}>Created {p.createdAt} · Used {p.usageCount}×</p>
          </div>
          <span style={{ background: `${levelColors[p.compressionLevel]}22`, color: levelColors[p.compressionLevel], fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>{p.compressionLevel}</span>
          <span style={{ color: TEXT_M, fontSize: 13 }}>~{p.tokenEstimate.toLocaleString()} tokens</span>
          {p.compressionLevel !== 'FULL' && (
            <span style={{ color: ACCENT_GN, fontSize: 12 }}>
              -{Math.round((1 - p.tokenEstimate / 2840) * 100)}% vs FULL
            </span>
          )}
        </div>
      ))}
      <div style={{ ...GLASS, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 14 }}>Generate pack</p>
        <input placeholder="Pack label…" value={packLabel} onChange={e => setPackLabel(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(['FULL','BALANCED','MINIMAL','EMERGENCY'] as const).map(l => (
            <button key={l} onClick={() => setPackLevel(l)}
              style={{ background: packLevel === l ? `${levelColors[l]}33` : 'rgba(255,255,255,0.04)', border: `1px solid ${packLevel === l ? levelColors[l] : BORDER}`, borderRadius: 8, color: packLevel === l ? levelColors[l] : TEXT_M, fontSize: 13, padding: '6px 14px', cursor: 'pointer' }}>
              {l} <span style={{ opacity: 0.7, fontSize: 11 }}>— {levelDesc[l]}</span>
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={generating}
          style={{ alignSelf: 'flex-start', background: generating ? TEXT_D : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: generating ? 'not-allowed' : 'pointer' }}>
          {generating ? 'Generating…' : 'Generate →'}
        </button>
      </div>
    </div>
  );
}

function Snapshots() {
  const [snapshots, setSnapshots] = useState([
    { id: 's1', label: 'Pre-Serial-20D snapshot',  createdAt: '2026-05-22 14:30', entries: 5, decisions: 4 },
    { id: 's2', label: 'Before billing refactor',   createdAt: '2026-05-21 09:15', entries: 3, decisions: 2 },
  ]);
  const [snapLabel, setSnapLabel] = useState('');
  const [restoreConfirm, setRestoreConfirm] = useState<string|null>(null);

  const create = async () => {
    if (!snapLabel.trim()) return;
    const snap = { id: `s${Date.now()}`, label: snapLabel.trim(), createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16), entries: 5, decisions: 4 };
    setSnapshots(prev => [snap, ...prev]);
    setSnapLabel('');
    track('memory_snapshot_create', { label: snap.label });
    try { await fetch(`${API_BASE}/v1/memory/snapshots`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snap) }); } catch {}
  };

  const restore = async (id: string) => {
    track('memory_snapshot_restore', { id });
    try { await fetch(`${API_BASE}/v1/memory/snapshots/${id}/restore`, { method: 'POST' }); } catch {}
    setRestoreConfirm(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {snapshots.map(s => (
        <div key={s.id} style={{ ...GLASS, padding: '14px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: TEXT, fontSize: 15 }}>{s.label}</p>
            <p style={{ margin: '3px 0 0', color: TEXT_M, fontSize: 12 }}>{s.createdAt} · {s.entries} entries · {s.decisions} decisions</p>
          </div>
          {restoreConfirm === s.id ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: ACCENT_A, fontSize: 13 }}>Restore this snapshot? This will overwrite current memory.</span>
              <button onClick={() => restore(s.id)} style={{ background: ACCENT_R, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
              <button onClick={() => setRestoreConfirm(null)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, fontSize: 13, padding: '5px 12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setRestoreConfirm(s.id)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, fontSize: 13, padding: '5px 14px', cursor: 'pointer' }}>Restore</button>
          )}
        </div>
      ))}
      <div style={{ ...GLASS, padding: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        <input placeholder="Snapshot label…" value={snapLabel} onChange={e => setSnapLabel(e.target.value)}
          style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: TEXT, fontSize: 14 }} />
        <button onClick={create} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          📸 Save snapshot
        </button>
      </div>
    </div>
  );
}

function AuditHistory() {
  const seed = [
    { id: 'a1', action: 'MEMORY_ADD',          targetType: 'entry',        targetId: 'e-xxx',  createdAt: '2026-05-22 15:42' },
    { id: 'a2', action: 'DECISION_LOCK',        targetType: 'decision',     targetId: 'd-xxx',  createdAt: '2026-05-22 14:30' },
    { id: 'a3', action: 'SNAPSHOT_CREATE',      targetType: 'snapshot',     targetId: 's-xxx',  createdAt: '2026-05-22 14:29' },
    { id: 'a4', action: 'PROFILE_SAVE',         targetType: 'profile',      targetId: 'u-xxx',  createdAt: '2026-05-22 12:00' },
    { id: 'a5', action: 'INSTRUCTIONS_SAVE',    targetType: 'instructions', targetId: 'ws-xxx', createdAt: '2026-05-22 11:55' },
    { id: 'a6', action: 'CONTEXT_PACK_CREATE',  targetType: 'context_pack', targetId: 'cp-xxx', createdAt: '2026-05-21 10:00' },
  ];
  const [auditEvents, setAuditEvents] = useState(seed);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/v1/memory/audit?limit=30`);
        if (r.ok) { const d = await r.json(); if (Array.isArray(d.data)) setAuditEvents(d.data); }
      } catch {}
    })();
  }, []);

  const actionColor = (a: string) => {
    if (/LOCK|DELETE|RESTORE/.test(a)) return ACCENT_R;
    if (/ADD|SAVE|CREATE/.test(a)) return ACCENT_GN;
    if (/UPDATE/.test(a)) return ACCENT_A;
    return TEXT_M;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {auditEvents.map(e => (
        <div key={e.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `1px solid ${BORDER}` }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: actionColor(e.action), fontWeight: 700, minWidth: 180 }}>{e.action}</span>
          <span style={{ color: TEXT_M, fontSize: 13 }}>{e.targetType}: <span style={{ color: TEXT_D, fontFamily: 'monospace' }}>{e.targetId}</span></span>
          <span style={{ marginLeft: 'auto', color: TEXT_D, fontSize: 12 }}>{e.createdAt}</span>
        </div>
      ))}
      <p style={{ color: TEXT_D, fontSize: 12, marginTop: 8 }}>Memory operations are audit-logged. No secrets are stored.</p>
    </div>
  );
}

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState('Founder Profile');

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, ...GLASS, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>← Factory</Link>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 16, textAlign: 'center' }}>🧠 Memory Engine</span>
          <Link href="/dashboard" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>Dashboard →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        {/* Stats bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {[['📌', '8 pinned memories'], ['🔒', '4 locked decisions'], ['💡', '8 active rules'], ['📦', '3 context packs']].map(([icon, label]) => (
            <div key={label} style={{ ...GLASS, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 160px' }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ color: TEXT_M, fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 4 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ background: activeTab === tab ? ACCENT : 'transparent', color: activeTab === tab ? '#fff' : TEXT_M, border: `1px solid ${activeTab === tab ? ACCENT : BORDER}`, borderRadius: 99, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ ...GLASS, padding: 24 }}>
          {activeTab === 'Founder Profile'  && <FounderProfile />}
          {activeTab === 'Project Rules'    && <ProjectRules />}
          {activeTab === 'Locked Decisions' && <LockedDecisions />}
          {activeTab === 'Agent Behavior'   && <AgentBehavior />}
          {activeTab === 'Context Packs'    && <ContextPacks />}
          {activeTab === 'Snapshots'        && <Snapshots />}
          {activeTab === 'Audit History'    && <AuditHistory />}
        </div>
      </div>
    </div>
  );
}
