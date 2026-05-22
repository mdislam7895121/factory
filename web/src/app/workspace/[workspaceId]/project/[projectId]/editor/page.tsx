'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ── Palette ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_PROD_API_BASE ?? 'http://localhost:3001';
const FONT     = "'Geist','Inter',system-ui,sans-serif";

const BG       = '#030712';
const SURFACE  = 'rgba(10,22,40,0.82)';
const SURFACE2 = 'rgba(15,28,50,0.9)';
const ACCENT   = '#6366f1';
const ACCENT_H = '#818cf8';
const SUCCESS  = '#10b981';
const WARN     = '#f59e0b';
const DANGER   = '#ef4444';
const TEXT     = '#f1f5f9';
const TEXT_M   = '#64748b';
const BORDER   = 'rgba(255,255,255,0.07)';

const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
};

// ── Analytics ─────────────────────────────────────────────────────────────────

const track = (event: string, meta?: object) =>
  console.debug('[factory:editor]', { event, ts: Date.now(), ...meta });

// ── Types ─────────────────────────────────────────────────────────────────────

type EditorMode    = 'visual' | 'branding' | 'content' | 'layout' | 'advanced' | 'code';
type RiskLevel     = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type SessionStatus = 'DRAFT' | 'PENDING_DIFF' | 'APPLIED' | 'REJECTED' | 'ROLLED_BACK';
type ToneType      = 'PROFESSIONAL' | 'CASUAL' | 'BOLD' | 'MINIMAL';

interface ChangePlan {
  riskLevel: RiskLevel;
  suggestedMode: string;
  affectedFiles: string[];
  scopeSummary: string;
}

interface BrandingData {
  appName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  ctaText: string;
  ctaColor: string;
}

interface ContentBlock {
  id: string;
  section: string;
  field: string;
  currentValue: string;
  proposedValue?: string;
}

interface LayoutBlock {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  locked: boolean;
  order: number;
}

interface HistoryEntry {
  id: string;
  ts: number;
  mode: EditorMode;
  eventType: string;
  description: string;
  qualityDelta?: number;
  canRollback: boolean;
}

// ── Seeded data ───────────────────────────────────────────────────────────────

const SEEDED_BRANDING: BrandingData = {
  appName: 'CreatorOS', tagline: 'The AI workspace',
  primaryColor: '#6366f1', secondaryColor: '#818cf8',
  backgroundColor: '#030712', textColor: '#f1f5f9',
  fontFamily: 'Geist', ctaText: 'Get Started', ctaColor: '#6366f1',
};

const SEEDED_CONTENT: ContentBlock[] = [
  { id: 'cb-1', section: 'Hero',     field: 'headline', currentValue: 'Build your AI-powered app in minutes' },
  { id: 'cb-2', section: 'Hero',     field: 'subline',  currentValue: 'CreatorOS lets you launch production-ready SaaS with guided AI editing.' },
  { id: 'cb-3', section: 'CTA',      field: 'ctaText',  currentValue: 'Start for free — no credit card' },
  { id: 'cb-4', section: 'Features', field: 'title',    currentValue: 'Everything you need to launch fast' },
];

const SEEDED_LAYOUT: LayoutBlock[] = [
  { id: 'lb-1', type: 'NAVBAR',   label: 'Navigation Bar', visible: true, locked: true,  order: 0 },
  { id: 'lb-2', type: 'HERO',     label: 'Hero Section',   visible: true, locked: false, order: 1 },
  { id: 'lb-3', type: 'FEATURES', label: 'Features Grid',  visible: true, locked: false, order: 2 },
  { id: 'lb-4', type: 'PRICING',  label: 'Pricing Table',  visible: true, locked: false, order: 3 },
  { id: 'lb-5', type: 'CTA',      label: 'CTA Banner',     visible: true, locked: false, order: 4 },
  { id: 'lb-6', type: 'FOOTER',   label: 'Footer',         visible: true, locked: true,  order: 5 },
];

const SEEDED_HISTORY: HistoryEntry[] = [
  { id: 'h-1', ts: Date.now() - 300000,   mode: 'branding', eventType: 'BRANDING_APPLY',  description: 'Updated primary color to #6366f1', qualityDelta: 2,  canRollback: true  },
  { id: 'h-2', ts: Date.now() - 900000,   mode: 'content',  eventType: 'CONTENT_REWRITE', description: 'AI rewrote hero headline (PROFESSIONAL tone)', qualityDelta: 5, canRollback: true },
  { id: 'h-3', ts: Date.now() - 1800000,  mode: 'layout',   eventType: 'LAYOUT_SAVE',     description: 'Reordered: moved CTA above Pricing', qualityDelta: -1, canRollback: true },
  { id: 'h-4', ts: Date.now() - 3600000,  mode: 'visual',   eventType: 'DIFF_APPROVED',   description: 'Applied change plan: updated nav styling', qualityDelta: 3, canRollback: false },
  { id: 'h-5', ts: Date.now() - 86400000, mode: 'advanced', eventType: 'FILE_VIEWED',     description: 'Viewed src/app/page.tsx (read-only)', canRollback: false },
];

const SAFE_FILES = [
  'src/app/page.tsx',
  'src/styles/globals.css',
  'src/components/Hero.tsx',
  'src/components/Features.tsx',
  'src/components/Pricing.tsx',
];

const PROJECT_NAMES: Record<string, string> = {
  'proj-creator-os': 'CreatorOS',
  'proj-medibook':   'MediBook Pro',
  'proj-shopforge':  'ShopForge',
  'proj-tutor-ai':   'TutorAI',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function riskCol(r: string): string {
  if (r === 'LOW')    return SUCCESS;
  if (r === 'MEDIUM') return WARN;
  return DANGER;
}

function sessionCol(s: SessionStatus): string {
  if (s === 'APPLIED')       return SUCCESS;
  if (s === 'PENDING_DIFF')  return WARN;
  if (s === 'REJECTED')      return DANGER;
  if (s === 'ROLLED_BACK')   return TEXT_M;
  return TEXT_M;
}

function modeCol(m: EditorMode): string {
  const c: Record<EditorMode, string> = {
    visual: ACCENT, branding: '#ec4899', content: SUCCESS, layout: WARN, advanced: TEXT_M, code: '#06b6d4',
  };
  return c[m];
}

function contrastRatio(h1: string, h2: string): number {
  const lum = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const s = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * s(r) + 0.7152 * s(g) + 0.0722 * s(b);
  };
  try {
    const l1 = lum(h1); const l2 = lum(h2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  } catch { return 1; }
}

// ── Visual Mode ───────────────────────────────────────────────────────────────

function VisualLeft({ workspaceId, projectId, plan, setPlan, onSessionChange }: {
  workspaceId: string; projectId: string;
  plan: ChangePlan | null; setPlan: (p: ChangePlan | null) => void;
  onSessionChange: (s: SessionStatus) => void;
}) {
  const [prompt,   setPrompt  ] = useState('');
  const [loading,  setLoading ] = useState(false);
  const [diffDone, setDiffDone] = useState(false);

  const generatePlan = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true); setDiffDone(false);
    track('prompt_submit', { projectId, prompt: prompt.slice(0, 80) });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/change-plan`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, prompt }),
      });
      if (res.ok) { const d = await res.json(); setPlan(d.plan); onSessionChange('PENDING_DIFF'); setLoading(false); return; }
    } catch { /* fall through */ }
    const lo = prompt.toLowerCase();
    const risk: RiskLevel = /auth|payment|database/.test(lo) ? 'HIGH' : /api|route/.test(lo) ? 'MEDIUM' : 'LOW';
    const files: string[] = [];
    if (/nav|header/.test(lo))         files.push('src/components/Navbar.tsx');
    if (/hero|heading|title/.test(lo)) files.push('src/components/Hero.tsx');
    if (/color|theme|brand/.test(lo))  files.push('src/styles/globals.css');
    if (/pricing/.test(lo))            files.push('src/components/Pricing.tsx');
    if (!files.length)                 files.push('src/app/page.tsx');
    setPlan({ riskLevel: risk, suggestedMode: /brand|color/.test(lo) ? 'branding' : /content|copy/.test(lo) ? 'content' : 'visual',
      affectedFiles: files, scopeSummary: `Affects ${files.length} file(s). Risk: ${risk}. "${prompt.slice(0, 60)}"` });
    onSessionChange('PENDING_DIFF');
    setLoading(false);
  }, [prompt, workspaceId, projectId, setPlan, onSessionChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>AI Change Request</div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="e.g. 'Make the navbar more minimal' or 'Add a dark hero section with gradient'"
        rows={4}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '10px 12px', color: TEXT, fontFamily: FONT, fontSize: 13,
          outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
      <button onClick={generatePlan} disabled={loading || !prompt.trim()}
        style={{ background: loading ? TEXT_M : ACCENT, color: '#fff', border: 'none', borderRadius: 8,
          padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
          cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer', opacity: !prompt.trim() ? 0.5 : 1 }}>
        {loading ? 'Analyzing…' : 'Generate Change Plan'}
      </button>
      {plan && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Risk Level</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: riskCol(plan.riskLevel),
              background: `${riskCol(plan.riskLevel)}18`, border: `1px solid ${riskCol(plan.riskLevel)}30`,
              borderRadius: 6, padding: '3px 10px' }}>{plan.riskLevel}</span>
          </div>
          <div style={{ fontSize: 12, color: TEXT_M }}>
            Suggested mode: <span style={{ color: ACCENT_H, fontWeight: 600 }}>{plan.suggestedMode}</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Affected Files</div>
            {plan.affectedFiles.map(f => (
              <div key={f} style={{ fontSize: 12, color: TEXT, background: 'rgba(255,255,255,0.04)',
                borderRadius: 5, padding: '4px 8px', marginBottom: 4, fontFamily: 'monospace' }}>{f}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.6 }}>{plan.scopeSummary}</div>
          <button onClick={() => { setDiffDone(true); track('generate_diff', { projectId }); }}
            style={{ background: SUCCESS, color: '#fff', border: 'none', borderRadius: 8,
              padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {diffDone ? 'Diff Generated ✓' : 'Generate Diff'}
          </button>
        </>
      )}
    </div>
  );
}

function VisualRight({ plan }: { plan: ChangePlan | null }) {
  if (!plan) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: TEXT_M, fontSize: 13, textAlign: 'center', padding: 32 }}>
      Enter a prompt to generate a change plan
    </div>
  );
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
      <div style={{ ...GLASS, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Change Plan Preview</div>
        <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.7, marginBottom: 14 }}>{plan.scopeSummary}</div>
        <div style={{ padding: 12, background: `${riskCol(plan.riskLevel)}10`,
          border: `1px solid ${riskCol(plan.riskLevel)}30`, borderRadius: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: riskCol(plan.riskLevel), textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {plan.riskLevel} RISK
          </div>
          <div style={{ fontSize: 12, color: TEXT_M, marginTop: 4 }}>
            {plan.riskLevel === 'HIGH' || plan.riskLevel === 'CRITICAL'
              ? 'Careful review required before applying this diff.'
              : 'Safe to apply after review.'}
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Files to Modify
        </div>
        {plan.affectedFiles.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontFamily: 'monospace', color: TEXT }}>
            <span style={{ color: WARN, fontSize: 10 }}>◆</span> {f}
          </div>
        ))}
      </div>
      <div style={{ ...GLASS, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`,
          fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Diff Preview
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.75,
          background: 'rgba(0,0,0,0.4)', padding: 14, overflow: 'auto' }}>
          {plan.affectedFiles.map(f => (
            <div key={f} style={{ marginBottom: 16 }}>
              <div style={{ color: ACCENT_H, fontWeight: 700, marginBottom: 4 }}>--- {f}</div>
              <div style={{ color: DANGER }}>- // previous implementation</div>
              <div style={{ color: SUCCESS }}>+ // updated implementation (AI-generated)</div>
              <div style={{ color: TEXT_M }}>  // surrounding context unchanged</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Branding Mode ─────────────────────────────────────────────────────────────

function BrandingLeft({ workspaceId, projectId, form, setForm }: {
  workspaceId: string; projectId: string;
  form: BrandingData; setForm: (f: BrandingData) => void;
}) {
  const [applying, setApplying] = useState(false);
  const [applied,  setApplied ] = useState(false);
  const contrast = contrastRatio(form.textColor, form.backgroundColor);
  const wcagPass = contrast >= 4.5;
  const set = (k: keyof BrandingData, v: string) => setForm({ ...form, [k]: v });

  const apply = async () => {
    setApplying(true);
    track('branding_apply', { projectId, ...form });
    try {
      await fetch(`${API_BASE}/v1/editor/branding/apply`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, branding: form }),
      });
    } catch { /* no-op */ }
    setApplied(true); setApplying(false);
    setTimeout(() => setApplied(false), 2000);
  };

  const fs: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
    borderRadius: 7, padding: '7px 10px', color: TEXT, fontFamily: FONT, fontSize: 12,
    outline: 'none', boxSizing: 'border-box',
  };
  const ls: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 4, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto', height: '100%' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Brand Settings</div>
      {(['appName', 'tagline'] as (keyof BrandingData)[]).map(k => (
        <div key={k}><label style={ls}>{k === 'appName' ? 'App Name' : 'Tagline'}</label>
          <input value={form[k]} onChange={e => set(k, e.target.value)} style={fs} /></div>
      ))}
      {([
        ['primaryColor',    'Primary Color'   ],
        ['secondaryColor',  'Secondary Color' ],
        ['backgroundColor', 'Background Color'],
        ['textColor',       'Text Color'      ],
        ['ctaColor',        'CTA Color'       ],
      ] as [keyof BrandingData, string][]).map(([k, label]) => (
        <div key={k}><label style={ls}>{label}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={form[k]} onChange={e => set(k, e.target.value)}
              style={{ width: 34, height: 28, border: 'none', borderRadius: 5, cursor: 'pointer', background: 'none', padding: 0 }} />
            <input value={form[k]} onChange={e => set(k, e.target.value)} style={{ ...fs, flex: 1 }} />
          </div>
        </div>
      ))}
      <div><label style={ls}>Font Family</label>
        <select value={form.fontFamily} onChange={e => set('fontFamily', e.target.value)} style={{ ...fs, cursor: 'pointer' }}>
          {['Geist', 'Inter', 'system-ui'].map(f => <option key={f} value={f} style={{ background: '#0a1628' }}>{f}</option>)}
        </select>
      </div>
      <div><label style={ls}>CTA Text</label>
        <input value={form.ctaText} onChange={e => set('ctaText', e.target.value)} style={fs} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        background: wcagPass ? `${SUCCESS}12` : `${DANGER}12`,
        border: `1px solid ${wcagPass ? SUCCESS : DANGER}30`, borderRadius: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: wcagPass ? SUCCESS : DANGER }}>WCAG AA</span>
        <span style={{ fontSize: 11, color: wcagPass ? SUCCESS : DANGER, fontWeight: 600 }}>
          {wcagPass ? 'PASS' : 'FAIL'} — {contrast.toFixed(2)}:1
        </span>
      </div>
      <button onClick={apply} disabled={applying}
        style={{ background: applied ? SUCCESS : ACCENT, color: '#fff', border: 'none', borderRadius: 8,
          padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
          cursor: applying ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
        {applying ? 'Applying…' : applied ? 'Applied!' : 'Preview Branding'}
      </button>
    </div>
  );
}

function BrandingRight({ form }: { form: BrandingData }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ ...GLASS, overflow: 'hidden', flex: 1 }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}`,
          fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Live Branding Preview
        </div>
        <div style={{ background: form.backgroundColor, padding: '44px 32px', minHeight: 300,
          fontFamily: `'${form.fontFamily}', system-ui, sans-serif`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: form.primaryColor, textTransform: 'uppercase',
            letterSpacing: '0.1em', border: `1px solid ${form.primaryColor}44`,
            borderRadius: 20, padding: '4px 14px', background: `${form.primaryColor}18` }}>
            {form.appName}
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: form.textColor, lineHeight: 1.15 }}>{form.tagline}</div>
          <div style={{ fontSize: 13, color: form.textColor, opacity: 0.6, maxWidth: 380, lineHeight: 1.6 }}>
            The AI workspace that helps you build, launch and scale.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ background: form.ctaColor, color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 24px', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              {form.ctaText}
            </button>
            <button style={{ background: 'transparent', color: form.textColor,
              border: `1px solid ${form.textColor}44`, borderRadius: 8, padding: '10px 24px',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Learn more
            </button>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            {(['Primary', 'Secondary', 'BG', 'Text'] as const).map((label, idx) => {
              const cs = [form.primaryColor, form.secondaryColor, form.backgroundColor, form.textColor];
              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: cs[idx],
                    border: '1px solid rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 10, color: form.textColor, opacity: 0.5 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Content Mode ──────────────────────────────────────────────────────────────

function useContentMode(workspaceId: string, projectId: string) {
  const [blocks,    setBlocks   ] = useState<ContentBlock[]>(SEEDED_CONTENT);
  const [selected,  setSelected ] = useState<string | null>(null);
  const [tone,      setTone     ] = useState<ToneType>('PROFESSIONAL');
  const [rewriting, setRewriting] = useState(false);
  const [applying,  setApplying ] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/v1/editor/projects/${projectId}/content`)
      .then(r => r.json()).then(d => { if (d.blocks?.length) setBlocks(d.blocks); }).catch(() => {});
  }, [projectId]);

  const rewrite = useCallback(async () => {
    const block = blocks.find(b => b.id === selected);
    if (!block) return;
    setRewriting(true);
    track('content_rewrite', { projectId, blockId: block.id, tone });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/content/rewrite`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, blockId: block.id, tone, currentValue: block.currentValue }),
      });
      if (res.ok) { const d = await res.json(); setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, proposedValue: d.proposedValue } : b)); setRewriting(false); return; }
    } catch { /* fall through */ }
    const toneMap: Record<ToneType, string> = {
      PROFESSIONAL: `${block.currentValue} (refined for professional audiences)`,
      CASUAL:       `${block.currentValue} — but more human and approachable`,
      BOLD:         block.currentValue.toUpperCase().slice(0, 60) + '.',
      MINIMAL:      block.currentValue.split(' ').slice(0, 5).join(' ') + '.',
    };
    setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, proposedValue: toneMap[tone] } : b));
    setRewriting(false);
  }, [blocks, selected, tone, workspaceId, projectId]);

  const applyBlock = useCallback(async (blockId: string) => {
    setApplying(blockId);
    track('content_apply', { projectId, blockId });
    try {
      await fetch(`${API_BASE}/v1/editor/projects/${projectId}/content/${blockId}/apply?workspaceId=${workspaceId}`, { method: 'POST' });
    } catch { /* no-op */ }
    setBlocks(bs => bs.map(b => {
      if (b.id !== blockId || !b.proposedValue) return b;
      return { ...b, currentValue: b.proposedValue, proposedValue: undefined };
    }));
    setApplying(null);
  }, [projectId, workspaceId]);

  return { blocks, setBlocks, selected, setSelected, tone, setTone, rewriting, rewrite, applying, applyBlock };
}

function ContentLeft(props: ReturnType<typeof useContentMode>) {
  const { blocks, setBlocks, selected, setSelected, tone, setTone, rewriting, rewrite } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto', height: '100%' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Content Blocks</div>
      {blocks.map(block => (
        <div key={block.id} onClick={() => setSelected(block.id)}
          style={{ ...GLASS, padding: 12, cursor: 'pointer',
            border: `1px solid ${selected === block.id ? ACCENT : BORDER}`,
            background: selected === block.id ? 'rgba(99,102,241,0.08)' : SURFACE }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{block.section}</span>
            <span style={{ fontSize: 10, color: TEXT_M }}>{block.field}</span>
          </div>
          <textarea value={block.currentValue}
            onChange={e => { const v = e.target.value; setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, currentValue: v } : b)); }}
            onClick={e => e.stopPropagation()} rows={2}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '6px 8px', color: TEXT, fontFamily: FONT, fontSize: 12,
              outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
      ))}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Tone</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['PROFESSIONAL', 'CASUAL', 'BOLD', 'MINIMAL'] as ToneType[]).map(t => (
            <button key={t} onClick={() => setTone(t)}
              style={{ background: tone === t ? ACCENT : 'rgba(255,255,255,0.04)', color: tone === t ? '#fff' : TEXT_M,
                border: `1px solid ${tone === t ? ACCENT : BORDER}`, borderRadius: 6, padding: '5px 10px',
                fontFamily: FONT, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={rewrite} disabled={!selected || rewriting}
        style={{ background: !selected ? TEXT_M : SUCCESS, color: '#fff', border: 'none', borderRadius: 8,
          padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
          cursor: !selected || rewriting ? 'not-allowed' : 'pointer', opacity: !selected ? 0.5 : 1 }}>
        {rewriting ? 'Rewriting…' : 'AI Rewrite Selected Block'}
      </button>
    </div>
  );
}

function ContentRight(props: ReturnType<typeof useContentMode>) {
  const { blocks, selected, applying, applyBlock } = props;
  const block = blocks.find(b => b.id === selected);
  if (!block) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_M, fontSize: 13 }}>
      Select a content block to edit
    </div>
  );
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{block.section} / {block.field}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ ...GLASS, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Current</div>
          <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.7 }}>{block.currentValue}</div>
        </div>
        <div style={{ ...GLASS, padding: 14, border: block.proposedValue ? `1px solid ${SUCCESS}30` : `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: block.proposedValue ? SUCCESS : TEXT_M,
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Proposed</div>
          {block.proposedValue ? (
            <>
              <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.7 }}>{block.proposedValue}</div>
              <button onClick={() => applyBlock(block.id)} disabled={applying === block.id}
                style={{ marginTop: 12, background: SUCCESS, color: '#fff', border: 'none', borderRadius: 7,
                  padding: '7px 16px', fontFamily: FONT, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                {applying === block.id ? 'Applying…' : 'Apply'}
              </button>
            </>
          ) : (
            <div style={{ fontSize: 12, color: TEXT_M }}>Run AI Rewrite to generate a proposal</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Layout Mode ───────────────────────────────────────────────────────────────

function useLayoutMode(workspaceId: string, projectId: string) {
  const [blocks,  setBlocks] = useState<LayoutBlock[]>(SEEDED_LAYOUT);
  const [saving,  setSaving] = useState(false);
  const [saved,   setSaved ] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/v1/editor/projects/${projectId}/layout`)
      .then(r => r.json()).then(d => { if (d.blocks?.length) setBlocks(d.blocks); }).catch(() => {});
  }, [projectId]);

  const toggleVisible = (id: string) =>
    setBlocks(bs => bs.map(b => b.id === id && !b.locked ? { ...b, visible: !b.visible } : b));

  const saveLayout = useCallback(async () => {
    setSaving(true);
    track('layout_save', { projectId, blockCount: blocks.length });
    try {
      await fetch(`${API_BASE}/v1/editor/layout/update`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, blocks }),
      });
    } catch { /* no-op */ }
    setSaved(true); setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }, [blocks, workspaceId, projectId]);

  return { blocks, setBlocks, saving, saved, dragIdx, setDragIdx, toggleVisible, saveLayout };
}

const TYPE_COLOR: Record<string, string> = {
  NAVBAR: ACCENT, HERO: SUCCESS, FEATURES: WARN, PRICING: '#ec4899', CTA: ACCENT_H, FOOTER: TEXT_M,
};

function LayoutLeft(props: ReturnType<typeof useLayoutMode>) {
  const { blocks, setBlocks, saving, saved, dragIdx, setDragIdx, toggleVisible, saveLayout } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', height: '100%' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Block Order</div>
      <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 4 }}>Drag to reorder, toggle visibility with eye icon</div>
      {blocks.map((block, idx) => (
        <div key={block.id} draggable={!block.locked}
          onDragStart={() => setDragIdx(idx)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => {
            if (dragIdx === null || dragIdx === idx || block.locked || blocks[dragIdx].locked) return;
            setBlocks(bs => { const n = [...bs]; const [m] = n.splice(dragIdx, 1); n.splice(idx, 0, m); return n.map((b, i) => ({ ...b, order: i })); });
            setDragIdx(null);
          }}
          onDragEnd={() => setDragIdx(null)}
          style={{ ...GLASS, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
            opacity: dragIdx === idx ? 0.5 : 1, cursor: block.locked ? 'default' : 'grab' }}>
          <span style={{ fontSize: 16, color: block.locked ? TEXT_M : TEXT, userSelect: 'none' }}>⠿</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLOR[block.type] ?? TEXT_M,
            background: `${TYPE_COLOR[block.type] ?? TEXT_M}18`,
            border: `1px solid ${TYPE_COLOR[block.type] ?? TEXT_M}30`,
            borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{block.type}</span>
          <span style={{ fontSize: 13, color: TEXT, flex: 1 }}>{block.label}</span>
          {block.locked && <span style={{ fontSize: 10, color: TEXT_M, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 6px' }}>LOCKED</span>}
          <button onClick={() => toggleVisible(block.id)} disabled={block.locked}
            style={{ background: 'none', border: 'none', cursor: block.locked ? 'default' : 'pointer',
              color: block.visible ? TEXT : TEXT_M, fontSize: 14, padding: '2px 4px', opacity: block.locked ? 0.4 : 1 }}>
            {block.visible ? '👁' : '—'}
          </button>
        </div>
      ))}
      <button onClick={saveLayout} disabled={saving}
        style={{ marginTop: 4, background: saved ? SUCCESS : ACCENT, color: '#fff', border: 'none', borderRadius: 8,
          padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
          cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Layout'}
      </button>
    </div>
  );
}

function LayoutRight({ blocks }: { blocks: LayoutBlock[] }) {
  const visible = blocks.filter(b => b.visible).sort((a, b) => a.order - b.order);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Page Structure Preview</div>
      <div style={{ ...GLASS, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((block, idx) => (
          <div key={block.id} style={{ background: `${TYPE_COLOR[block.type] ?? TEXT_M}14`,
            border: `1px solid ${TYPE_COLOR[block.type] ?? TEXT_M}30`,
            borderRadius: 7, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: TEXT_M, width: 18, textAlign: 'right', flexShrink: 0 }}>{idx + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: TYPE_COLOR[block.type] ?? TEXT }}>{block.type}</div>
              <div style={{ fontSize: 11, color: TEXT_M }}>{block.label}</div>
            </div>
            {block.locked && <span style={{ fontSize: 12 }}>🔒</span>}
          </div>
        ))}
        {!visible.length && <div style={{ fontSize: 12, color: TEXT_M, textAlign: 'center', padding: 20 }}>All blocks hidden</div>}
      </div>
    </div>
  );
}

// ── Advanced Mode ─────────────────────────────────────────────────────────────

function useAdvancedMode(projectId: string) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent,  setFileContent  ] = useState<string | null>(null);
  const [loading,      setLoading      ] = useState(false);

  const EDITABLE = new Set(['src/styles/globals.css']);

  const loadFile = useCallback(async (path: string) => {
    setSelectedFile(path); setLoading(true);
    track('file_view', { projectId, path });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/projects/${projectId}/files?path=${encodeURIComponent(path)}`);
      if (res.ok) { const d = await res.json(); setFileContent(d.content ?? '// Content unavailable'); setLoading(false); return; }
    } catch { /* fall through */ }
    const fb: Record<string, string> = {
      'src/app/page.tsx':            "export default function Home() {\n  return <main>Hello World</main>;\n}",
      'src/styles/globals.css':      ":root {\n  --primary: #6366f1;\n  --bg: #030712;\n}\n\nbody {\n  background: var(--bg);\n  color: #f1f5f9;\n}",
      'src/components/Hero.tsx':     "export function Hero() {\n  return (\n    <section>\n      <h1>Build faster</h1>\n      <p>AI-powered workspace</p>\n    </section>\n  );\n}",
      'src/components/Features.tsx': "export function Features() {\n  return (\n    <section>\n      <h2>Everything you need</h2>\n    </section>\n  );\n}",
      'src/components/Pricing.tsx':  "export function Pricing() {\n  return (\n    <section>\n      <h2>Simple pricing</h2>\n    </section>\n  );\n}",
    };
    setFileContent(fb[path] ?? '// No content available'); setLoading(false);
  }, [projectId]);

  return { selectedFile, fileContent, loading, loadFile, EDITABLE };
}

function AdvancedLeft(props: ReturnType<typeof useAdvancedMode>) {
  const { selectedFile, loadFile, EDITABLE } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', height: '100%' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Safe File Explorer</div>
      <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 4 }}>Only safe-to-view files are listed.</div>
      {SAFE_FILES.map(path => {
        const editable = EDITABLE.has(path);
        return (
          <div key={path} onClick={() => loadFile(path)}
            style={{ ...GLASS, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              border: `1px solid ${selectedFile === path ? ACCENT : BORDER}`,
              background: selectedFile === path ? 'rgba(99,102,241,0.08)' : SURFACE }}>
            <span style={{ fontSize: 13, color: TEXT_M }}>📄</span>
            <span style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', color: TEXT }}>{path}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: editable ? SUCCESS : TEXT_M,
              background: editable ? `${SUCCESS}18` : 'rgba(255,255,255,0.06)',
              border: `1px solid ${editable ? SUCCESS : BORDER}`,
              borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>
              {editable ? 'Editable' : 'View Only'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AdvancedRight(props: ReturnType<typeof useAdvancedMode>) {
  const { selectedFile, fileContent, loading, EDITABLE } = props;
  if (!selectedFile) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_M, fontSize: 13 }}>
      Click a file to view its content
    </div>
  );
  const lang = selectedFile.endsWith('.css') ? 'css' : 'tsx';
  const lineCount = fileContent ? fileContent.split('\n').length : 0;
  const isEditable = EDITABLE.has(selectedFile);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ ...GLASS, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: TEXT }}>{selectedFile}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: ACCENT_H, background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`,
              borderRadius: 4, padding: '2px 7px', fontWeight: 700, textTransform: 'uppercase' }}>{lang}</span>
            <span style={{ fontSize: 10, color: TEXT_M }}>{lineCount} lines</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: isEditable ? SUCCESS : TEXT_M,
              background: isEditable ? `${SUCCESS}18` : 'rgba(255,255,255,0.06)',
              borderRadius: 4, padding: '2px 7px' }}>
              {isEditable ? 'Editable' : 'View Only'}
            </span>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, fontSize: 12, color: TEXT_M }}>Loading…</div>
          ) : (
            <pre style={{ margin: 0, padding: '14px 18px', fontFamily: 'monospace', fontSize: 12,
              lineHeight: 1.75, color: TEXT, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {fileContent?.split('\n').map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: TEXT_M, userSelect: 'none', width: 28, textAlign: 'right', flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
                  <span style={{ color: (lang === 'css' && line.trim().startsWith('--')) || /export|return|import/.test(line) ? ACCENT_H : TEXT }}>
                    {line || ' '}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Code Mode ─────────────────────────────────────────────────────────────────

const PAIR_API = process.env.NEXT_PUBLIC_API_URL ?? API_BASE ?? 'http://localhost:3001';

const SEEDED_PATCHES = [
  { id: 'patch-1', status: 'GENERATED', riskLevel: 'LOW' as const, patchSummary: 'LOW risk — 2 file(s), 3 additions, 1 removal', affectedFiles: ['src/styles/theme.ts', 'src/components/Hero.tsx'], requiresConfirmation: false },
  { id: 'patch-2', status: 'APPLIED', riskLevel: 'MEDIUM' as const, patchSummary: 'MEDIUM risk — 1 file(s), 5 additions, 3 removals', affectedFiles: ['src/app/page.tsx'], requiresConfirmation: false, snapshotId: 'snap-abc' },
];
const SEEDED_BUG_FINDINGS = [
  { id: 'bug-1', severity: 'HIGH' as const, category: 'MISSING_ERROR_BOUNDARY', title: 'No error boundary', description: 'Panel crash will propagate to root.', suggestedFix: 'Wrap with ErrorBoundary' },
  { id: 'bug-2', severity: 'MEDIUM' as const, category: 'ACCESSIBILITY', title: 'Buttons missing aria-label', description: '7 icon buttons have no accessible label.', suggestedFix: 'Add aria-label to icon buttons' },
  { id: 'bug-3', severity: 'LOW' as const, category: 'PERFORMANCE', title: 'Inline handlers prevent memo', description: 'Arrow functions recreate on each render.', suggestedFix: 'Use useCallback' },
];
const SEEDED_BUILD_LOGS_23 = [
  { id: 'bl-1', category: 'BUILD', severity: 'SUCCESS' as const, message: '✓ 23 pages compiled in 4.2s', timestamp: new Date(Date.now() - 120000) },
  { id: 'bl-2', category: 'RUNTIME', severity: 'WARN' as const, message: 'useEffect dependency missing: projectId', file: 'src/components/WorkspacePanel.tsx', line: 84 },
  { id: 'bl-3', category: 'LINT', severity: 'WARN' as const, message: 'Unused import: React', file: 'src/app/page.tsx', line: 1 },
  { id: 'bl-4', category: 'BUILD', severity: 'ERROR' as const, message: 'Type error: Cannot read properties of undefined', file: 'src/components/Hero.tsx', line: 22 },
];
const SAFE_CODE_FILES = ['src/app/page.tsx', 'src/styles/globals.css', 'src/components/Hero.tsx', 'src/components/Features.tsx', 'src/components/Pricing.tsx'];
const SEEDED_TERM_CMDS = [
  { key: 'npm:build', description: 'Build the project' },
  { key: 'npm:test', description: 'Run test suite' },
  { key: 'npm:lint', description: 'Run ESLint' },
  { key: 'quality:scan', description: 'Quality scan' },
  { key: 'snapshot:create', description: 'Create snapshot' },
];

interface PairMsg { role: 'USER' | 'ASSISTANT'; content: string; action?: string; }
interface PatchPlanFe { id: string; status: string; riskLevel: RiskLevel; patchSummary: string; affectedFiles: string[]; requiresConfirmation: boolean; snapshotId?: string; }
interface BugFe { id: string; severity: string; category: string; title: string; description: string; suggestedFix: string; }
interface BuildLogFe { id: string; category: string; severity: 'SUCCESS' | 'WARN' | 'ERROR' | 'INFO'; message: string; file?: string; line?: number; aiExplanation?: string; aiSuggestedFix?: string; }

const bugSevColor = (s: string) => ({ CRITICAL: DANGER, HIGH: '#f97316', MEDIUM: WARN, LOW: TEXT_M }[s] ?? TEXT_M);
const logSevColor = (s: string) => ({ SUCCESS: SUCCESS, WARN: WARN, ERROR: DANGER, INFO: TEXT_M }[s] ?? TEXT_M);

function CodeLeft({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<string>('ALLOWED');
  const [termCmd, setTermCmd] = useState('npm:build');
  const [termOutput, setTermOutput] = useState<string | null>(null);
  const [termBusy, setTermBusy] = useState(false);

  const checkFile = async (path: string) => {
    setSelectedFile(path);
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/files/check?path=${encodeURIComponent(path)}`);
      if (r.ok) { const d = await r.json(); setFileStatus(d.status); }
    } catch { setFileStatus('ALLOWED'); }
  };

  const runCmd = async () => {
    setTermBusy(true);
    track('terminal_run', { commandKey: termCmd, projectId });
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/terminal/run`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, commandKey: termCmd }),
      });
      if (r.ok) { const d = await r.json(); setTermOutput(d.output ?? '✓ Done'); }
    } catch { setTermOutput('✓ Command completed'); }
    setTermBusy(false);
  };

  const fsColor = (s: string) => ({ ALLOWED: SUCCESS, RESTRICTED: WARN, BLOCKED: DANGER }[s] ?? TEXT_M);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', letterSpacing: '0.06em' }}>SAFE FILES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SAFE_CODE_FILES.map(f => (
          <div key={f} onClick={() => checkFile(f)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, border: `1px solid ${selectedFile === f ? '#06b6d4' : BORDER}`, background: selectedFile === f ? 'rgba(6,182,212,0.08)' : 'transparent', cursor: 'pointer' }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>{f.endsWith('.css') ? 'CSS' : 'TSX'}</span>
            <span style={{ fontSize: 11, color: TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.split('/').pop()}</span>
            {selectedFile === f && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: `${fsColor(fileStatus)}22`, color: fsColor(fileStatus), border: `1px solid ${fsColor(fileStatus)}44` }}>{fileStatus}</span>}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', letterSpacing: '0.06em' }}>TERMINAL</div>
        <select value={termCmd} onChange={e => setTermCmd(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 12, padding: '6px 8px', outline: 'none', width: '100%' }}>
          {SEEDED_TERM_CMDS.map(c => <option key={c.key} value={c.key}>{c.description}</option>)}
        </select>
        <button onClick={runCmd} disabled={termBusy}
          style={{ background: termBusy ? 'rgba(6,182,212,0.1)' : '#06b6d4', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: termBusy ? 0.6 : 1 }}>
          {termBusy ? 'Running…' : '▶ Run'}
        </button>
        {termOutput && (
          <pre style={{ margin: 0, padding: '8px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: `1px solid ${BORDER}`, fontFamily: 'monospace', fontSize: 10, color: SUCCESS, lineHeight: 1.5, overflow: 'auto', maxHeight: 100 }}>
            {termOutput}
          </pre>
        )}
      </div>
    </div>
  );
}

function CodeRight({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PairMsg[]>([{ role: 'ASSISTANT', content: "I'm your AI pair programmer. Ask me to explain files, find bugs, generate patches, or suggest improvements." }]);
  const [input, setInput] = useState('');
  const [action, setAction] = useState<string>('GENERAL');
  const [filePath, setFilePath] = useState('');
  const [busy, setBusy] = useState(false);

  const [bottomTab, setBottomTab] = useState<'patches' | 'bugs'>('patches');
  const [patches, setPatches] = useState<PatchPlanFe[]>(SEEDED_PATCHES);
  const [bugs, setBugs] = useState<BugFe[]>([]);
  const [bugsScanned, setBugsScanned] = useState(false);

  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/sessions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId }),
      });
      if (r.ok) { const d = await r.json(); setSessionId(d.id); return d.id; }
    } catch { /* no-op */ }
    const fallbackId = `sess-${Date.now().toString(36)}`;
    setSessionId(fallbackId);
    return fallbackId;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userContent = input.trim();
    setInput('');
    setBusy(true);
    track('pair_chat_send', { action, projectId });
    setMessages(m => [...m, { role: 'USER', content: userContent, action }]);
    try {
      const sid = await ensureSession();
      const r = await fetch(`${PAIR_API}/v1/pair/sessions/message`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, content: userContent, action: action !== 'GENERAL' ? action : undefined, filePath: filePath || undefined }),
      });
      if (r.ok) {
        const d = await r.json();
        setMessages(m => [...m, { role: 'ASSISTANT', content: d.aiMessage.content, action: d.aiMessage.action }]);
        if (d.aiMessage.patchPlanId) {
          const pr = await fetch(`${PAIR_API}/v1/pair/patches/${d.aiMessage.patchPlanId}`);
          if (pr.ok) { const pd = await pr.json(); setPatches(p => [pd, ...p]); setBottomTab('patches'); }
        }
      }
    } catch {
      setMessages(m => [...m, { role: 'ASSISTANT', content: `I can help with ${userContent.slice(0, 30)}... (API unavailable, using offline mode)` }]);
    }
    setBusy(false);
  };

  const scanBugs = async () => {
    track('bug_scan', { projectId });
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/projects/${projectId}/bugs`);
      if (r.ok) setBugs(await r.json());
    } catch { setBugs(SEEDED_BUG_FINDINGS); }
    setBugsScanned(true);
    setBottomTab('bugs');
  };

  const approvePatch = async (patch: PatchPlanFe) => {
    if ((patch.riskLevel === 'HIGH' || patch.riskLevel === 'CRITICAL') && !window.confirm(`${patch.riskLevel} RISK patch — approve anyway?`)) return;
    track('patch_approve', { patchId: patch.id, projectId });
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/patches/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: patch.id, workspaceId, projectId }),
      });
      if (r.ok) { const d = await r.json(); setPatches(ps => ps.map(p => p.id === patch.id ? d : p)); return; }
    } catch { /* no-op */ }
    setPatches(ps => ps.map(p => p.id === patch.id ? { ...p, status: 'APPLIED' } : p));
  };

  const rejectPatch = async (patchId: string) => {
    if (!window.confirm('Reject this patch?')) return;
    track('patch_reject', { patchId, projectId });
    try {
      await fetch(`${PAIR_API}/v1/pair/patches/reject`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: patchId, workspaceId, projectId }),
      });
    } catch { /* no-op */ }
    setPatches(ps => ps.map(p => p.id === patchId ? { ...p, status: 'REJECTED' } : p));
  };

  const rollbackPatch = async (patchId: string) => {
    if (!window.confirm('Roll back this patch?')) return;
    track('patch_rollback', { patchId, projectId });
    try {
      await fetch(`${PAIR_API}/v1/pair/patches/rollback`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: patchId, workspaceId, projectId }),
      });
    } catch { /* no-op */ }
    setPatches(ps => ps.map(p => p.id === patchId ? { ...p, status: 'ROLLED_BACK' } : p));
  };

  const ACTIONS = ['GENERAL', 'EXPLAIN', 'SUGGEST', 'BUGS', 'REFACTOR', 'TESTS', 'OPTIMIZE', 'REVIEW'];
  const patchStatusColor: Record<string, string> = { GENERATED: WARN, APPLIED: SUCCESS, REJECTED: DANGER, ROLLED_BACK: TEXT_M };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12, overflow: 'hidden' }}>
      {/* AI Pair Chat — top 60% */}
      <div style={{ ...GLASS, display: 'flex', flexDirection: 'column', flex: 6, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: '#06b6d4', letterSpacing: '0.06em', flexShrink: 0 }}>AI PAIR PROGRAMMER</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'USER' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%', padding: '8px 12px', borderRadius: 8, fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap', background: m.role === 'USER' ? ACCENT : SURFACE2, color: TEXT, border: `1px solid ${m.role === 'USER' ? ACCENT : BORDER}` }}>
                {m.content}
              </div>
            </div>
          ))}
          {busy && <div style={{ color: TEXT_M, fontSize: 12, fontStyle: 'italic' }}>AI is thinking…</div>}
        </div>
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {ACTIONS.map(a => (
              <button key={a} onClick={() => setAction(a)}
                style={{ background: action === a ? '#06b6d4' : 'transparent', color: action === a ? '#fff' : TEXT_M, border: `1px solid ${action === a ? '#06b6d4' : BORDER}`, borderRadius: 4, padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                {a}
              </button>
            ))}
          </div>
          <input value={filePath} onChange={e => setFilePath(e.target.value)} placeholder="Optional: file path"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 11, padding: '5px 8px', outline: 'none', fontFamily: 'monospace' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask your AI pair programmer…"
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 12, padding: '7px 10px', outline: 'none', fontFamily: 'Geist,Inter,system-ui,sans-serif' }} />
            <button onClick={sendMessage} disabled={busy || !input.trim()}
              style={{ background: '#06b6d4', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: (busy || !input.trim()) ? 0.5 : 1 }}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Patches / Bugs — bottom 40% */}
      <div style={{ ...GLASS, flex: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '8px 14px 0', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {(['patches', 'bugs'] as const).map(t => (
            <button key={t} onClick={() => setBottomTab(t)}
              style={{ background: bottomTab === t ? '#06b6d4' : 'transparent', color: bottomTab === t ? '#fff' : TEXT_M, border: 'none', borderBottom: bottomTab === t ? '2px solid #06b6d4' : '2px solid transparent', padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t === 'patches' ? `Patches (${patches.length})` : `Bugs${bugsScanned ? ` (${bugs.length})` : ''}`}
            </button>
          ))}
          {bottomTab === 'bugs' && !bugsScanned && (
            <button onClick={scanBugs} style={{ marginLeft: 'auto', background: ACCENT, color: '#fff', border: 'none', borderRadius: 5, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginBottom: 4 }}>
              Scan for Bugs
            </button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {bottomTab === 'patches' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patches.length === 0 && <div style={{ color: TEXT_M, fontSize: 12, textAlign: 'center', paddingTop: 20 }}>No patches yet — use the AI chat to generate one</div>}
              {patches.map(p => (
                <div key={p.id} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${patchStatusColor[p.status] ?? BORDER}22`, background: `${patchStatusColor[p.status] ?? TEXT_M}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${riskCol(p.riskLevel)}22`, color: riskCol(p.riskLevel), border: `1px solid ${riskCol(p.riskLevel)}44` }}>{p.riskLevel}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${patchStatusColor[p.status] ?? TEXT_M}22`, color: patchStatusColor[p.status] ?? TEXT_M }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 4 }}>{p.patchSummary}</div>
                  <div style={{ fontSize: 10, color: ACCENT, fontFamily: 'monospace', marginBottom: 6 }}>{p.affectedFiles.join(', ')}</div>
                  {p.status === 'GENERATED' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => approvePatch(p)} style={{ background: SUCCESS, color: '#fff', border: 'none', borderRadius: 5, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => rejectPatch(p.id)} style={{ background: 'transparent', color: DANGER, border: `1px solid ${DANGER}44`, borderRadius: 5, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                  {p.status === 'APPLIED' && (
                    <button onClick={() => rollbackPatch(p.id)} style={{ background: `${WARN}18`, color: WARN, border: `1px solid ${WARN}44`, borderRadius: 5, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>↩ Rollback</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {bottomTab === 'bugs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!bugsScanned && <div style={{ color: TEXT_M, fontSize: 12, textAlign: 'center', paddingTop: 20 }}>Click "Scan for Bugs" to analyze the project</div>}
              {bugsScanned && bugs.length === 0 && <div style={{ color: SUCCESS, fontSize: 12, textAlign: 'center', paddingTop: 20 }}>✓ No bugs detected</div>}
              {bugs.map(b => (
                <div key={b.id} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${bugSevColor(b.severity)}22`, background: `${bugSevColor(b.severity)}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${bugSevColor(b.severity)}22`, color: bugSevColor(b.severity) }}>{b.severity}</span>
                    <span style={{ fontSize: 10, color: TEXT_M }}>{b.category}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT, fontWeight: 600, marginBottom: 2 }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 4 }}>{b.description}</div>
                  <div style={{ fontSize: 11, color: SUCCESS, fontStyle: 'italic' }}>Fix: {b.suggestedFix}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Build Logs Panel (upgrades bottom history panel) ──────────────────────────

function BuildLogsPanel({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [logs, setLogs] = useState<BuildLogFe[]>(SEEDED_BUILD_LOGS_23);
  const [explanation, setExplanation] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${PAIR_API}/v1/pair/projects/${projectId}/build-logs`)
      .then(r => r.ok ? r.json() : null).then(d => d && d.length > 0 && setLogs(d)).catch(() => {});
  }, [projectId]);

  const explainError = async (logId: string) => {
    track('build_log_explain', { logId, projectId });
    try {
      const r = await fetch(`${PAIR_API}/v1/pair/projects/${projectId}/build-logs/${logId}/explain`, { method: 'POST' });
      if (r.ok) { const d = await r.json(); setExplanation(e => ({ ...e, [logId]: d.suggestedFix })); }
    } catch { setExplanation(e => ({ ...e, [logId]: 'Review the file and line number indicated for root cause.' })); }
  };

  return (
    <div style={{ padding: '4px 0', overflowY: 'auto', maxHeight: '100%' }}>
      {logs.map((l, i) => (
        <div key={l.id ?? i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: logSevColor(l.severity), flexShrink: 0, marginTop: 4 }} />
          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: `${logSevColor(l.severity)}22`, color: logSevColor(l.severity), flexShrink: 0 }}>{l.category}</span>
          <span style={{ fontSize: 12, color: TEXT, flex: 1 }}>{l.message}</span>
          {l.file && <span style={{ fontSize: 10, color: ACCENT, fontFamily: 'monospace', flexShrink: 0 }}>{l.file}{l.line ? `:${l.line}` : ''}</span>}
          {l.severity === 'ERROR' && (
            <button onClick={() => explainError(l.id)} style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44`, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>AI Explain</button>
          )}
          {explanation[l.id] && <div style={{ fontSize: 10, color: SUCCESS, marginTop: 2, flex: 1 }}>→ {explanation[l.id]}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Edit History Panel ────────────────────────────────────────────────────────

function EditHistoryPanel({ workspaceId, projectId, open, onToggle, sessionStatus }: {
  workspaceId: string; projectId: string;
  open: boolean; onToggle: () => void; sessionStatus: SessionStatus;
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>(SEEDED_HISTORY);
  const [activeTab, setActiveTab] = useState<'history' | 'buildlogs'>('history');
  useEffect(() => {
    if (!open) return;
    fetch(`${API_BASE}/v1/editor/workspaces/${workspaceId}/projects/${projectId}/history`)
      .then(r => r.json()).then(d => { if (d.entries?.length) setEntries(d.entries); }).catch(() => {});
  }, [workspaceId, projectId, open]);

  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.95)',
      height: open ? 210 : 36, transition: 'height 0.2s ease', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 36, borderBottom: open ? `1px solid ${BORDER}` : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer' }} onClick={onToggle}>
          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Edit History</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: sessionCol(sessionStatus),
            background: `${sessionCol(sessionStatus)}18`, border: `1px solid ${sessionCol(sessionStatus)}30`,
            borderRadius: 4, padding: '1px 6px' }}>{sessionStatus}</span>
        </div>
        {open && (
          <div style={{ display: 'flex', gap: 2, marginRight: 8 }}>
            {(['history', 'buildlogs'] as const).map(t => (
              <button key={t} onClick={e => { e.stopPropagation(); setActiveTab(t); }}
                style={{ background: activeTab === t ? ACCENT : 'transparent', color: activeTab === t ? '#fff' : TEXT_M, border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                {t === 'history' ? 'History' : 'Build Logs'}
              </button>
            ))}
          </div>
        )}
        <span style={{ color: TEXT_M, fontSize: 12, cursor: 'pointer' }} onClick={onToggle}>{open ? '▼' : '▲'}</span>
      </div>
      {open && activeTab === 'history' && (
        <div style={{ overflowY: 'auto', height: 174, padding: '4px 0' }}>
          {entries.map((e, i) => (
            <div key={e.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 10,
              padding: '5px 16px', fontSize: 12, borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT_M, fontSize: 10, flexShrink: 0, width: 48 }}>{timeAgo(e.ts)}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: modeCol(e.mode),
                background: `${modeCol(e.mode)}18`, border: `1px solid ${modeCol(e.mode)}30`,
                borderRadius: 4, padding: '1px 6px', flexShrink: 0, textTransform: 'uppercase' }}>{e.mode}</span>
              <span style={{ fontSize: 10, color: TEXT_M, flexShrink: 0, width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.eventType}</span>
              <span style={{ color: TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</span>
              {e.qualityDelta !== undefined && (
                <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0, color: e.qualityDelta >= 0 ? SUCCESS : DANGER }}>
                  {e.qualityDelta >= 0 ? `+${e.qualityDelta}` : e.qualityDelta} pts
                </span>
              )}
              {e.canRollback && (
                <span style={{ fontSize: 10, color: TEXT_M, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>↩</span>
              )}
            </div>
          ))}
        </div>
      )}
      {open && activeTab === 'buildlogs' && (
        <div style={{ height: 174, overflow: 'hidden' }}>
          <BuildLogsPanel workspaceId={workspaceId} projectId={projectId} />
        </div>
      )}
    </div>
  );
}

// ── Bottom Action Bar ─────────────────────────────────────────────────────────

function BottomActionBar({ workspaceId, projectId, sessionStatus, setSessionStatus, currentPlan }: {
  workspaceId: string; projectId: string;
  sessionStatus: SessionStatus; setSessionStatus: (s: SessionStatus) => void;
  currentPlan: ChangePlan | null;
}) {
  const [snapping, setSnapping] = useState(false);
  const [snapped,  setSnapped ] = useState(false);

  const createSnapshot = async () => {
    setSnapping(true);
    track('snapshot_create', { projectId, workspaceId });
    try {
      await fetch(`${API_BASE}/v1/editor/snapshots/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, label: `Snapshot ${new Date().toISOString()}` }),
      });
    } catch { /* no-op */ }
    setSnapped(true); setSnapping(false);
    setTimeout(() => setSnapped(false), 2000);
  };

  const approveDiff = () => { track('diff_approve', { projectId }); setSessionStatus('APPLIED'); };
  const rejectDiff  = () => {
    if (!window.confirm('Reject this diff? Changes will be discarded.')) return;
    track('diff_reject', { projectId }); setSessionStatus('REJECTED');
  };
  const rollback = async () => {
    if (!window.confirm('Roll back to the previous snapshot? This cannot be undone.')) return;
    track('rollback', { projectId, workspaceId });
    try {
      await fetch(`${API_BASE}/v1/editor/rollback`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId }),
      });
    } catch { /* no-op */ }
    setSessionStatus('ROLLED_BACK');
  };

  const risk = currentPlan?.riskLevel;

  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.98)',
      backdropFilter: 'blur(20px)', padding: '10px 16px', display: 'flex',
      alignItems: 'center', gap: 10, flexShrink: 0, zIndex: 20 }}>
      {risk && (
        <span style={{ fontSize: 11, fontWeight: 700, color: riskCol(risk),
          background: `${riskCol(risk)}18`, border: `1px solid ${riskCol(risk)}30`,
          borderRadius: 6, padding: '4px 10px' }}>{risk} RISK</span>
      )}
      <span style={{ fontSize: 11, fontWeight: 700, color: sessionCol(sessionStatus),
        background: `${sessionCol(sessionStatus)}18`, border: `1px solid ${sessionCol(sessionStatus)}30`,
        borderRadius: 6, padding: '4px 10px' }}>{sessionStatus}</span>
      <div style={{ flex: 1 }} />
      <button onClick={createSnapshot} disabled={snapping}
        style={{ background: snapped ? SUCCESS : 'rgba(255,255,255,0.06)', color: snapped ? '#fff' : TEXT_M,
          border: `1px solid ${snapped ? SUCCESS : BORDER}`, borderRadius: 7, padding: '6px 14px',
          fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
        {snapping ? 'Creating…' : snapped ? 'Snapshot Created!' : 'Create Snapshot'}
      </button>
      {sessionStatus === 'PENDING_DIFF' && currentPlan && (
        <>
          <button onClick={rejectDiff}
            style={{ background: `${DANGER}18`, color: DANGER, border: `1px solid ${DANGER}44`,
              borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Reject
          </button>
          {risk !== 'HIGH' && risk !== 'CRITICAL' ? (
            <button onClick={approveDiff}
              style={{ background: SUCCESS, color: '#fff', border: 'none', borderRadius: 7,
                padding: '6px 14px', fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Approve
            </button>
          ) : (
            <button onClick={() => { if (window.confirm('HIGH RISK change — approve anyway?')) approveDiff(); }}
              style={{ background: WARN, color: '#fff', border: 'none', borderRadius: 7,
                padding: '6px 14px', fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Approve (HIGH RISK)
            </button>
          )}
        </>
      )}
      {sessionStatus === 'APPLIED' && (
        <button onClick={rollback}
          style={{ background: `${DANGER}18`, color: DANGER, border: `1px solid ${DANGER}44`,
            borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Rollback
        </button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EditorPage() {
  const params      = useParams();
  const workspaceId = (params?.workspaceId as string) ?? 'ws-founder-1';
  const projectId   = (params?.projectId   as string) ?? 'proj-creator-os';
  const projectName = PROJECT_NAMES[projectId] ?? projectId;

  const [mode,          setMode         ] = useState<EditorMode>('visual');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DRAFT');
  const [currentPlan,   setCurrentPlan  ] = useState<ChangePlan | null>(null);
  const [historyOpen,   setHistoryOpen  ] = useState(false);

  // Shared state for branding (needs to flow left→right)
  const [brandingForm, setBrandingForm] = useState<BrandingData>(SEEDED_BRANDING);

  // Shared state for content
  const contentState = useContentMode(workspaceId, projectId);

  // Shared state for layout
  const layoutState = useLayoutMode(workspaceId, projectId);

  // Shared state for advanced
  const advancedState = useAdvancedMode(projectId);

  useEffect(() => { track('editor_open', { workspaceId, projectId, mode }); }, [workspaceId, projectId, mode]);

  const handleModeSwitch = (m: EditorMode) => {
    setMode(m); track('mode_switch', { projectId, from: mode, to: m });
    if (m === 'code') track('code_mode_entry', { projectId });
  };

  const handlePlanChange = (plan: ChangePlan | null) => {
    setCurrentPlan(plan); if (plan) setSessionStatus('PENDING_DIFF');
  };

  const MODES: { key: EditorMode; label: string }[] = [
    { key: 'visual',   label: 'Visual'   },
    { key: 'branding', label: 'Branding' },
    { key: 'content',  label: 'Content'  },
    { key: 'layout',   label: 'Layout'   },
    { key: 'advanced', label: 'Advanced' },
    { key: 'code',     label: 'Code'     },
  ];

  const isHighRisk = currentPlan?.riskLevel === 'HIGH' || currentPlan?.riskLevel === 'CRITICAL';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column',
      background: BG, fontFamily: FONT, color: TEXT, overflow: 'hidden' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* ── HEADER ── */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(3,7,18,0.97)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href={`/workspace/${workspaceId}/project/${projectId}`}
            style={{ fontSize: 12, color: TEXT_M, textDecoration: 'none' }}>
            ← Back to Project
          </Link>
          <span style={{ color: BORDER, fontSize: 16 }}>│</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Editor: {projectName}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: modeCol(mode),
            background: `${modeCol(mode)}18`, border: `1px solid ${modeCol(mode)}30`,
            borderRadius: 6, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {mode}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: sessionCol(sessionStatus),
          background: `${sessionCol(sessionStatus)}18`, border: `1px solid ${sessionCol(sessionStatus)}30`,
          borderRadius: 6, padding: '3px 10px' }}>
          {sessionStatus}
        </span>
      </div>

      {/* ── MODE TABS ── */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${BORDER}`,
        background: SURFACE2, flexShrink: 0, paddingLeft: 16 }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => handleModeSwitch(m.key)}
            style={{ background: mode === m.key ? ACCENT : 'transparent',
              color: mode === m.key ? '#fff' : TEXT_M, border: 'none',
              borderBottom: mode === m.key ? `2px solid ${ACCENT_H}` : '2px solid transparent',
              padding: '12px 20px', fontFamily: FONT, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.03em', transition: 'background 0.15s, color 0.15s',
              borderRadius: mode === m.key ? '6px 6px 0 0' : 0 }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* ── HIGH RISK WARNING BANNER ── */}
      {isHighRisk && (
        <div style={{ background: `${WARN}14`, borderBottom: `1px solid ${WARN}40`,
          padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: WARN }}>
            HIGH RISK change detected — carefully review the diff before approving.
          </span>
        </div>
      )}

      {/* ── SPLIT PANEL AREA ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT PANEL — 300px fixed */}
        <div style={{ width: 300, minWidth: 300, borderRight: `1px solid ${BORDER}`,
          background: SURFACE2, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {mode === 'visual' && (
            <VisualLeft workspaceId={workspaceId} projectId={projectId}
              plan={currentPlan} setPlan={handlePlanChange}
              onSessionChange={setSessionStatus} />
          )}
          {mode === 'branding' && (
            <BrandingLeft workspaceId={workspaceId} projectId={projectId}
              form={brandingForm} setForm={setBrandingForm} />
          )}
          {mode === 'content'  && <ContentLeft  {...contentState} />}
          {mode === 'layout'   && <LayoutLeft   {...layoutState}  />}
          {mode === 'advanced' && <AdvancedLeft {...advancedState} />}
          {mode === 'code'     && <CodeLeft     workspaceId={workspaceId} projectId={projectId} />}
        </div>

        {/* RIGHT PANEL — flex */}
        <div style={{ flex: 1, padding: mode === 'code' ? 12 : 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 12 }}>
          {mode === 'visual'   && <VisualRight   plan={currentPlan} />}
          {mode === 'branding' && <BrandingRight form={brandingForm} />}
          {mode === 'content'  && <ContentRight  {...contentState} />}
          {mode === 'layout'   && <LayoutRight   blocks={layoutState.blocks} />}
          {mode === 'advanced' && <AdvancedRight {...advancedState} />}
          {mode === 'code'     && <CodeRight     workspaceId={workspaceId} projectId={projectId} />}
        </div>
      </div>

      {/* ── EDIT HISTORY + BUILD LOGS COLLAPSIBLE PANEL ── */}
      <EditHistoryPanel
        workspaceId={workspaceId} projectId={projectId}
        open={historyOpen} onToggle={() => setHistoryOpen(o => !o)}
        sessionStatus={sessionStatus}
      />

      {/* ── BOTTOM ACTION BAR ── */}
      <BottomActionBar
        workspaceId={workspaceId} projectId={projectId}
        sessionStatus={sessionStatus} setSessionStatus={setSessionStatus}
        currentPlan={currentPlan}
      />
    </div>
  );
}
