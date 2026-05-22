'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
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

// ── Analytics ──────────────────────────────────────────────────────────────────

const track = (event: string, meta?: object) =>
  console.debug('[factory:editor]', { event, ts: Date.now(), ...meta });

// ── Types ─────────────────────────────────────────────────────────────────────

type EditorMode    = 'visual' | 'branding' | 'content' | 'layout' | 'advanced';
type RiskLevel     = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type SessionStatus = 'DRAFT' | 'PENDING_DIFF' | 'APPLIED' | 'REJECTED' | 'ROLLED_BACK';
type ToneType      = 'PROFESSIONAL' | 'CASUAL' | 'BOLD' | 'MINIMAL';

interface ChangePlan {
  riskLevel: RiskLevel;
  suggestedMode: string;
  affectedFiles: string[];
  scopeSummary: string;
  diff?: string;
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

// ── Seeded fallback data ──────────────────────────────────────────────────────

const SEEDED_BRANDING: BrandingData = {
  appName: 'CreatorOS',
  tagline: 'The AI workspace',
  primaryColor: '#6366f1',
  secondaryColor: '#818cf8',
  backgroundColor: '#030712',
  textColor: '#f1f5f9',
  fontFamily: 'Geist',
  ctaText: 'Get Started',
  ctaColor: '#6366f1',
};

const SEEDED_CONTENT: ContentBlock[] = [
  { id: 'cb-1', section: 'Hero',     field: 'headline',  currentValue: 'Build your AI-powered app in minutes' },
  { id: 'cb-2', section: 'Hero',     field: 'subline',   currentValue: 'CreatorOS lets you launch production-ready SaaS with guided AI editing.' },
  { id: 'cb-3', section: 'CTA',      field: 'ctaText',   currentValue: 'Start for free — no credit card' },
  { id: 'cb-4', section: 'Features', field: 'title',     currentValue: 'Everything you need to launch fast' },
];

const SEEDED_LAYOUT: LayoutBlock[] = [
  { id: 'lb-1', type: 'NAVBAR',   label: 'Navigation Bar', visible: true,  locked: true,  order: 0 },
  { id: 'lb-2', type: 'HERO',     label: 'Hero Section',   visible: true,  locked: false, order: 1 },
  { id: 'lb-3', type: 'FEATURES', label: 'Features Grid',  visible: true,  locked: false, order: 2 },
  { id: 'lb-4', type: 'PRICING',  label: 'Pricing Table',  visible: true,  locked: false, order: 3 },
  { id: 'lb-5', type: 'CTA',      label: 'CTA Banner',     visible: true,  locked: false, order: 4 },
  { id: 'lb-6', type: 'FOOTER',   label: 'Footer',         visible: true,  locked: true,  order: 5 },
];

const SEEDED_HISTORY: HistoryEntry[] = [
  { id: 'h-1', ts: Date.now() - 300000,   mode: 'branding', eventType: 'BRANDING_APPLY',  description: 'Updated primary color to #6366f1 and tagline', qualityDelta: 2,  canRollback: true  },
  { id: 'h-2', ts: Date.now() - 900000,   mode: 'content',  eventType: 'CONTENT_REWRITE', description: 'AI rewrote hero headline (PROFESSIONAL tone)',   qualityDelta: 5,  canRollback: true  },
  { id: 'h-3', ts: Date.now() - 1800000,  mode: 'layout',   eventType: 'LAYOUT_SAVE',     description: 'Reordered blocks: moved CTA above Pricing',      qualityDelta: -1, canRollback: true  },
  { id: 'h-4', ts: Date.now() - 3600000,  mode: 'visual',   eventType: 'DIFF_APPROVED',   description: 'Applied change plan: updated nav styling',        qualityDelta: 3,  canRollback: false },
  { id: 'h-5', ts: Date.now() - 86400000, mode: 'advanced', eventType: 'FILE_VIEWED',     description: 'Viewed src/app/page.tsx (read-only)',             canRollback: false },
];

const SAFE_FILES = [
  'src/app/page.tsx',
  'src/styles/globals.css',
  'src/components/Hero.tsx',
  'src/components/Features.tsx',
  'src/components/Pricing.tsx',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function riskColor(r: RiskLevel | string): string {
  if (r === 'LOW')    return SUCCESS;
  if (r === 'MEDIUM') return WARN;
  return DANGER;
}

function sessionStatusColor(s: SessionStatus): string {
  if (s === 'DRAFT')        return TEXT_M;
  if (s === 'PENDING_DIFF') return WARN;
  if (s === 'APPLIED')      return SUCCESS;
  if (s === 'REJECTED')     return DANGER;
  return TEXT_M;
}

function modeBadgeColor(m: EditorMode): string {
  const map: Record<EditorMode, string> = {
    visual: ACCENT, branding: '#ec4899', content: SUCCESS,
    layout: WARN, advanced: TEXT_M,
  };
  return map[m];
}

function wcagContrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const s = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * s(r) + 0.7152 * s(g) + 0.0722 * s(b);
  };
  try {
    const l1 = lum(hex1); const l2 = lum(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  } catch { return 1; }
}

// ── Visual Mode ───────────────────────────────────────────────────────────────

function VisualMode({ workspaceId, projectId, onPlanChange }: {
  workspaceId: string; projectId: string;
  onPlanChange: (plan: ChangePlan | null) => void;
}) {
  const [prompt,    setPrompt   ] = useState('');
  const [loading,   setLoading  ] = useState(false);
  const [plan,      setPlan     ] = useState<ChangePlan | null>(null);
  const [diffShown, setDiffShown] = useState(false);

  const generatePlan = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true); setDiffShown(false);
    track('prompt_submit', { projectId, prompt: prompt.slice(0, 80) });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/change-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, prompt }),
      });
      if (res.ok) {
        const d = await res.json();
        setPlan(d.plan);
        onPlanChange(d.plan);
        return;
      }
    } catch { /* fall through */ }
    // Seeded fallback
    const lo = prompt.toLowerCase();
    const risk: RiskLevel = /auth|payment|database/.test(lo) ? 'HIGH' : /api|route/.test(lo) ? 'MEDIUM' : 'LOW';
    const files = [];
    if (/nav|header/.test(lo))           files.push('src/components/Navbar.tsx');
    if (/hero|heading|title/.test(lo))   files.push('src/components/Hero.tsx');
    if (/color|theme|brand/.test(lo))    files.push('src/styles/globals.css');
    if (/pricing/.test(lo))              files.push('src/components/Pricing.tsx');
    if (files.length === 0)              files.push('src/app/page.tsx');
    const fallback: ChangePlan = {
      riskLevel: risk,
      suggestedMode: /brand|color|font/.test(lo) ? 'branding' : /content|copy|text/.test(lo) ? 'content' : 'visual',
      affectedFiles: files,
      scopeSummary: `This change affects ${files.length} file(s). Risk level: ${risk}. "${prompt.slice(0, 60)}"`,
    };
    setPlan(fallback);
    onPlanChange(fallback);
    setLoading(false);
  }, [prompt, workspaceId, projectId, onPlanChange]);

  const generateDiff = () => {
    setDiffShown(true);
    track('generate_diff', { projectId });
  };

  return (
    <>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>AI Change Request</div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. 'Make the navbar more minimal' or 'Add a dark hero section with gradient'"
          rows={4}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            borderRadius: 8, padding: '10px 12px', color: TEXT, fontFamily: FONT, fontSize: 13,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        />
        <button
          onClick={generatePlan}
          disabled={loading || !prompt.trim()}
          style={{ background: loading ? TEXT_M : ACCENT, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer', opacity: !prompt.trim() ? 0.5 : 1 }}>
          {loading ? 'Analyzing…' : 'Generate Change Plan'}
        </button>

        {plan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Risk Level</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: riskColor(plan.riskLevel),
                background: `${riskColor(plan.riskLevel)}18`, border: `1px solid ${riskColor(plan.riskLevel)}30`,
                borderRadius: 6, padding: '3px 10px' }}>{plan.riskLevel}</span>
            </div>
            <div style={{ fontSize: 12, color: TEXT_M }}>
              <span style={{ color: TEXT_M }}>Suggested mode: </span>
              <span style={{ color: ACCENT_H, fontWeight: 600 }}>{plan.suggestedMode}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Affected Files</div>
              {plan.affectedFiles.map(f => (
                <div key={f} style={{ fontSize: 12, color: TEXT, background: 'rgba(255,255,255,0.04)',
                  borderRadius: 5, padding: '4px 8px', marginBottom: 4, fontFamily: 'monospace' }}>{f}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.6 }}>{plan.scopeSummary}</div>
            <button
              onClick={generateDiff}
              style={{ background: SUCCESS, color: '#fff', border: 'none', borderRadius: 8,
                padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Generate Diff
            </button>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
        {!plan && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: TEXT_M, fontSize: 13, textAlign: 'center' }}>
            Enter a prompt to generate a change plan
          </div>
        )}
        {plan && !diffShown && (
          <div style={{ ...GLASS, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Change Plan Preview</div>
            <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.7 }}>{plan.scopeSummary}</div>
            <div style={{ marginTop: 14, padding: 12, background: `${riskColor(plan.riskLevel)}10`,
              border: `1px solid ${riskColor(plan.riskLevel)}30`, borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: riskColor(plan.riskLevel), textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {plan.riskLevel} RISK
              </div>
              <div style={{ fontSize: 12, color: TEXT_M, marginTop: 4 }}>
                {plan.riskLevel === 'HIGH' || plan.riskLevel === 'CRITICAL'
                  ? 'Careful review required before applying this diff.'
                  : 'This change is safe to apply after review.'}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                Files to be modified
              </div>
              {plan.affectedFiles.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
                  borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontFamily: 'monospace', color: TEXT }}>
                  <span style={{ color: WARN, fontSize: 10 }}>◆</span> {f}
                </div>
              ))}
            </div>
          </div>
        )}
        {plan && diffShown && (
          <div style={{ ...GLASS, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Diff Preview</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7,
              background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 14, overflow: 'auto' }}>
              {plan.affectedFiles.map(f => (
                <div key={f} style={{ marginBottom: 16 }}>
                  <div style={{ color: ACCENT_H, fontWeight: 700, marginBottom: 6 }}>--- {f}</div>
                  <div style={{ color: DANGER }}>- // old implementation</div>
                  <div style={{ color: SUCCESS }}>+ // updated implementation (AI-generated)</div>
                  <div style={{ color: TEXT_M }}>  // context unchanged</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Branding Mode ─────────────────────────────────────────────────────────────

function BrandingMode({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [form,     setForm    ] = useState<BrandingData>(SEEDED_BRANDING);
  const [applying, setApplying] = useState(false);
  const [applied,  setApplied ] = useState(false);

  const contrast = wcagContrastRatio(form.textColor, form.backgroundColor);
  const wcagPass = contrast >= 4.5;

  const set = (key: keyof BrandingData, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const applyBranding = async () => {
    setApplying(true);
    track('branding_apply', { projectId, ...form });
    try {
      await fetch(`${API_BASE}/v1/editor/branding/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, branding: form }),
      });
    } catch { /* no-op */ }
    setApplied(true);
    setApplying(false);
    setTimeout(() => setApplied(false), 2000);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
    borderRadius: 7, padding: '7px 10px', color: TEXT, fontFamily: FONT, fontSize: 12,
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 4, display: 'block',
  };

  return (
    <>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto', paddingRight: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Brand Settings</div>

        {([
          ['appName',         'App Name',          'text'],
          ['tagline',         'Tagline',            'text'],
        ] as [keyof BrandingData, string, string][]).map(([key, label]) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input value={form[key]} onChange={e => set(key, e.target.value)} style={fieldStyle} />
          </div>
        ))}

        {([
          ['primaryColor',    'Primary Color'   ],
          ['secondaryColor',  'Secondary Color' ],
          ['backgroundColor', 'Background Color'],
          ['textColor',       'Text Color'      ],
          ['ctaColor',        'CTA Color'       ],
        ] as [keyof BrandingData, string][]).map(([key, label]) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="color" value={form[key]} onChange={e => set(key, e.target.value)}
                style={{ width: 36, height: 28, border: 'none', borderRadius: 5, cursor: 'pointer',
                  background: 'none', padding: 0 }} />
              <input value={form[key]} onChange={e => set(key, e.target.value)} style={{ ...fieldStyle, flex: 1 }} />
            </div>
          </div>
        ))}

        <div>
          <label style={labelStyle}>Font Family</label>
          <select value={form.fontFamily} onChange={e => set('fontFamily', e.target.value)}
            style={{ ...fieldStyle, cursor: 'pointer' }}>
            {['Geist', 'Inter', 'system-ui'].map(f => (
              <option key={f} value={f} style={{ background: '#0a1628' }}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>CTA Text</label>
          <input value={form.ctaText} onChange={e => set('ctaText', e.target.value)} style={fieldStyle} />
        </div>

        {/* WCAG badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          background: wcagPass ? `${SUCCESS}12` : `${DANGER}12`,
          border: `1px solid ${wcagPass ? SUCCESS : DANGER}30`, borderRadius: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: wcagPass ? SUCCESS : DANGER }}>
            WCAG AA
          </span>
          <span style={{ fontSize: 11, color: wcagPass ? SUCCESS : DANGER, fontWeight: 600 }}>
            {wcagPass ? 'PASS' : 'FAIL'} — {contrast.toFixed(2)}:1 contrast
          </span>
        </div>

        <button
          onClick={applyBranding}
          disabled={applying}
          style={{ background: applied ? SUCCESS : ACCENT, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
            cursor: applying ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {applying ? 'Applying…' : applied ? 'Applied!' : 'Preview Branding'}
        </button>
      </div>

      {/* RIGHT — live branding preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div style={{ ...GLASS, padding: 0, overflow: 'hidden', flex: 1 }}>
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}`,
            fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Live Branding Preview
          </div>
          {/* Mock hero */}
          <div style={{ background: form.backgroundColor, padding: '40px 32px', minHeight: 320,
            fontFamily: `'${form.fontFamily}', system-ui, sans-serif`, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: form.primaryColor,
              textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${form.primaryColor}44`,
              borderRadius: 20, padding: '4px 14px', background: `${form.primaryColor}18` }}>
              {form.appName}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: form.textColor, lineHeight: 1.15 }}>
              {form.tagline}
            </div>
            <div style={{ fontSize: 13, color: form.textColor, opacity: 0.6, maxWidth: 380, lineHeight: 1.6 }}>
              The AI workspace that helps you build, launch and scale your product.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ background: form.ctaColor, color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 24px', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {form.ctaText}
              </button>
              <button style={{ background: 'transparent', color: form.textColor, border: `1px solid ${form.textColor}44`,
                borderRadius: 8, padding: '10px 24px', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Learn more
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              {['Primary', 'Secondary', 'Background', 'Text'].map((label, idx) => {
                const colors = [form.primaryColor, form.secondaryColor, form.backgroundColor, form.textColor];
                return (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: colors[idx],
                      border: `1px solid rgba(255,255,255,0.2)` }} />
                    <span style={{ fontSize: 10, color: form.textColor, opacity: 0.5 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Content Mode ──────────────────────────────────────────────────────────────

function ContentMode({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [blocks,    setBlocks   ] = useState<ContentBlock[]>(SEEDED_CONTENT);
  const [selected,  setSelected ] = useState<string | null>(null);
  const [tone,      setTone     ] = useState<ToneType>('PROFESSIONAL');
  const [rewriting, setRewriting] = useState(false);
  const [applying,  setApplying ] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/v1/editor/projects/${projectId}/content`)
      .then(r => r.json())
      .then(d => { if (d.blocks?.length) setBlocks(d.blocks); })
      .catch(() => {});
  }, [projectId]);

  const rewrite = async () => {
    const block = blocks.find(b => b.id === selected);
    if (!block) return;
    setRewriting(true);
    track('content_rewrite', { projectId, blockId: block.id, tone });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/content/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, blockId: block.id, tone, currentValue: block.currentValue }),
      });
      if (res.ok) {
        const d = await res.json();
        setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, proposedValue: d.proposedValue } : b));
        setRewriting(false); return;
      }
    } catch { /* fall through */ }
    // Seeded fallback
    const toneMap: Record<ToneType, string> = {
      PROFESSIONAL: `${block.currentValue} (refined for professional audiences)`,
      CASUAL: `${block.currentValue} — but make it feel human and approachable`,
      BOLD: `${block.currentValue.toUpperCase()} — bold, punchy, unforgettable`,
      MINIMAL: block.currentValue.split(' ').slice(0, 5).join(' ') + '.',
    };
    setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, proposedValue: toneMap[tone] } : b));
    setRewriting(false);
  };

  const applyBlock = async (blockId: string) => {
    setApplying(blockId);
    track('content_apply', { projectId, blockId });
    try {
      await fetch(`${API_BASE}/v1/editor/projects/${projectId}/content/${blockId}/apply?workspaceId=${workspaceId}`, {
        method: 'POST',
      });
    } catch { /* no-op */ }
    setBlocks(bs => bs.map(b => {
      if (b.id !== blockId || !b.proposedValue) return b;
      return { ...b, currentValue: b.proposedValue, proposedValue: undefined };
    }));
    setApplying(null);
  };

  const selectedBlock = blocks.find(b => b.id === selected);

  return (
    <>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Content Blocks</div>

        {blocks.map(block => (
          <div
            key={block.id}
            onClick={() => setSelected(block.id)}
            style={{ ...GLASS, padding: 12, cursor: 'pointer',
              border: `1px solid ${selected === block.id ? ACCENT : BORDER}`,
              background: selected === block.id ? 'rgba(99,102,241,0.08)' : SURFACE }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT,
                textTransform: 'uppercase', letterSpacing: '0.07em' }}>{block.section}</span>
              <span style={{ fontSize: 10, color: TEXT_M }}>{block.field}</span>
            </div>
            <textarea
              value={block.currentValue}
              onChange={e => {
                const v = e.target.value;
                setBlocks(bs => bs.map(b => b.id === block.id ? { ...b, currentValue: v } : b));
              }}
              onClick={e => e.stopPropagation()}
              rows={2}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
                borderRadius: 6, padding: '6px 8px', color: TEXT, fontFamily: FONT, fontSize: 12,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        {/* Tone selector */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase',
            letterSpacing: '0.07em', marginBottom: 8 }}>Tone</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['PROFESSIONAL', 'CASUAL', 'BOLD', 'MINIMAL'] as ToneType[]).map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{ background: tone === t ? ACCENT : 'rgba(255,255,255,0.04)',
                  color: tone === t ? '#fff' : TEXT_M, border: `1px solid ${tone === t ? ACCENT : BORDER}`,
                  borderRadius: 6, padding: '5px 10px', fontFamily: FONT, fontSize: 11,
                  fontWeight: 700, cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={rewrite}
          disabled={!selected || rewriting}
          style={{ background: !selected ? TEXT_M : SUCCESS, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
            cursor: !selected || rewriting ? 'not-allowed' : 'pointer', opacity: !selected ? 0.5 : 1 }}>
          {rewriting ? 'Rewriting…' : 'AI Rewrite Selected Block'}
        </button>
      </div>

      {/* RIGHT — proposed vs current */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
        {!selectedBlock ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: TEXT_M, fontSize: 13 }}>Select a content block to edit</div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>
              {selectedBlock.section} / {selectedBlock.field}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ ...GLASS, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase',
                  letterSpacing: '0.07em', marginBottom: 8 }}>Current</div>
                <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.7 }}>{selectedBlock.currentValue}</div>
              </div>
              <div style={{ ...GLASS, padding: 14, border: selectedBlock.proposedValue ? `1px solid ${SUCCESS}30` : `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: selectedBlock.proposedValue ? SUCCESS : TEXT_M,
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Proposed</div>
                {selectedBlock.proposedValue ? (
                  <>
                    <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.7 }}>{selectedBlock.proposedValue}</div>
                    <button
                      onClick={() => applyBlock(selectedBlock.id)}
                      disabled={applying === selectedBlock.id}
                      style={{ marginTop: 12, background: SUCCESS, color: '#fff', border: 'none',
                        borderRadius: 7, padding: '7px 16px', fontFamily: FONT, fontWeight: 700,
                        fontSize: 12, cursor: 'pointer' }}>
                      {applying === selectedBlock.id ? 'Applying…' : 'Apply'}
                    </button>
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: TEXT_M }}>Run AI Rewrite to generate a proposal</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Layout Mode ───────────────────────────────────────────────────────────────

function LayoutMode({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [blocks,  setBlocks ] = useState<LayoutBlock[]>(SEEDED_LAYOUT);
  const [saving,  setSaving ] = useState(false);
  const [saved,   setSaved  ] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/v1/editor/projects/${projectId}/layout`)
      .then(r => r.json())
      .then(d => { if (d.blocks?.length) setBlocks(d.blocks); })
      .catch(() => {});
  }, [projectId]);

  const toggleVisible = (id: string) => {
    setBlocks(bs => bs.map(b => b.id === id && !b.locked ? { ...b, visible: !b.visible } : b));
  };

  const saveLayout = async () => {
    setSaving(true);
    track('layout_save', { projectId, blockCount: blocks.length });
    try {
      await fetch(`${API_BASE}/v1/editor/layout/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, blocks }),
      });
    } catch { /* no-op */ }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const typeColor: Record<string, string> = {
    NAVBAR: ACCENT, HERO: SUCCESS, FEATURES: WARN, PRICING: '#ec4899', CTA: ACCENT_H, FOOTER: TEXT_M,
  };

  const visibleBlocks = blocks.filter(b => b.visible).sort((a, b) => a.order - b.order);

  return (
    <>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Block Order</div>
        <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 6 }}>
          Drag to reorder, toggle visibility with the eye icon
        </div>

        {blocks.map((block, idx) => (
          <div
            key={block.id}
            draggable={!block.locked}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={e => { e.preventDefault(); }}
            onDrop={() => {
              if (dragIdx === null || dragIdx === idx || block.locked) return;
              if (blocks[dragIdx].locked) return;
              setBlocks(bs => {
                const next = [...bs];
                const [moved] = next.splice(dragIdx, 1);
                next.splice(idx, 0, moved);
                return next.map((b, i) => ({ ...b, order: i }));
              });
              setDragIdx(null);
            }}
            onDragEnd={() => setDragIdx(null)}
            style={{ ...GLASS, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              opacity: dragIdx === idx ? 0.5 : 1,
              cursor: block.locked ? 'default' : 'grab' }}>
            <span style={{ fontSize: 16, color: block.locked ? TEXT_M : TEXT, userSelect: 'none',
              cursor: block.locked ? 'default' : 'grab' }}>⠿</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: typeColor[block.type] ?? TEXT_M,
              background: `${typeColor[block.type] ?? TEXT_M}18`,
              border: `1px solid ${typeColor[block.type] ?? TEXT_M}30`,
              borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{block.type}</span>
            <span style={{ fontSize: 13, color: TEXT, flex: 1 }}>{block.label}</span>
            {block.locked && (
              <span style={{ fontSize: 10, color: TEXT_M, background: 'rgba(255,255,255,0.06)',
                borderRadius: 4, padding: '2px 6px' }}>LOCKED</span>
            )}
            <button
              onClick={() => toggleVisible(block.id)}
              disabled={block.locked}
              style={{ background: 'none', border: 'none', cursor: block.locked ? 'default' : 'pointer',
                color: block.visible ? TEXT : TEXT_M, fontSize: 14, padding: '2px 4px',
                opacity: block.locked ? 0.4 : 1 }}>
              {block.visible ? '👁' : '—'}
            </button>
          </div>
        ))}

        <button
          onClick={saveLayout}
          disabled={saving}
          style={{ marginTop: 4, background: saved ? SUCCESS : ACCENT, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 13,
            cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Layout'}
        </button>
      </div>

      {/* RIGHT — visual block order */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Page Structure Preview</div>
        <div style={{ ...GLASS, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visibleBlocks.map((block, idx) => (
            <div key={block.id} style={{ background: `${typeColor[block.type] ?? TEXT_M}14`,
              border: `1px solid ${typeColor[block.type] ?? TEXT_M}30`,
              borderRadius: 7, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: TEXT_M, width: 18, textAlign: 'right', flexShrink: 0 }}>{idx + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: typeColor[block.type] ?? TEXT }}>{block.type}</div>
                <div style={{ fontSize: 11, color: TEXT_M }}>{block.label}</div>
              </div>
              {block.locked && <span style={{ fontSize: 10, color: TEXT_M }}>🔒</span>}
            </div>
          ))}
          {visibleBlocks.length === 0 && (
            <div style={{ fontSize: 12, color: TEXT_M, textAlign: 'center', padding: 20 }}>
              All blocks hidden
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Advanced Mode (Safe File Explorer) ───────────────────────────────────────

function AdvancedMode({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent,  setFileContent  ] = useState<string | null>(null);
  const [loading,      setLoading      ] = useState(false);

  const EDITABLE_FILES = new Set(['src/styles/globals.css']);

  const loadFile = async (path: string) => {
    setSelectedFile(path);
    setLoading(true);
    track('file_view', { projectId, path });
    try {
      const res = await fetch(`${API_BASE}/v1/editor/projects/${projectId}/files?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const d = await res.json();
        setFileContent(d.content ?? '// File content unavailable');
        setLoading(false); return;
      }
    } catch { /* fall through */ }
    // Seeded fallback
    const fallbacks: Record<string, string> = {
      'src/app/page.tsx':            `export default function Home() {\n  return <main>Hello World</main>;\n}`,
      'src/styles/globals.css':      `:root {\n  --primary: #6366f1;\n  --bg: #030712;\n}\n\nbody {\n  background: var(--bg);\n  color: #f1f5f9;\n}`,
      'src/components/Hero.tsx':     `export function Hero() {\n  return (\n    <section>\n      <h1>Build faster</h1>\n      <p>AI-powered workspace</p>\n    </section>\n  );\n}`,
      'src/components/Features.tsx': `export function Features() {\n  return (\n    <section>\n      <h2>Everything you need</h2>\n    </section>\n  );\n}`,
      'src/components/Pricing.tsx':  `export function Pricing() {\n  return (\n    <section>\n      <h2>Simple pricing</h2>\n    </section>\n  );\n}`,
    };
    setFileContent(fallbacks[path] ?? '// No content available');
    setLoading(false);
  };

  const lang = selectedFile?.endsWith('.css') ? 'css' : selectedFile?.endsWith('.tsx') ? 'tsx' : 'text';
  const lineCount = fileContent ? fileContent.split('\n').length : 0;
  const isEditable = selectedFile ? EDITABLE_FILES.has(selectedFile) : false;

  return (
    <>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>Safe File Explorer</div>
        <div style={{ fontSize: 11, color: TEXT_M, marginBottom: 6 }}>
          Only safe-to-view files are listed. Destructive edits are gated by the diff system.
        </div>

        {SAFE_FILES.map(path => {
          const editable = EDITABLE_FILES.has(path);
          return (
            <div
              key={path}
              onClick={() => loadFile(path)}
              style={{ ...GLASS, padding: '10px 12px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: 10,
                border: `1px solid ${selectedFile === path ? ACCENT : BORDER}`,
                background: selectedFile === path ? 'rgba(99,102,241,0.08)' : SURFACE }}>
              <span style={{ fontSize: 13, color: TEXT_M }}>📄</span>
              <span style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', color: TEXT }}>{path}</span>
              <span style={{ fontSize: 10, fontWeight: 700,
                color: editable ? SUCCESS : TEXT_M,
                background: editable ? `${SUCCESS}18` : 'rgba(255,255,255,0.06)',
                border: `1px solid ${editable ? SUCCESS : BORDER}30`,
                borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>
                {editable ? 'Editable' : 'View Only'}
              </span>
            </div>
          );
        })}
      </div>

      {/* RIGHT — file content viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        {!selectedFile ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: TEXT_M, fontSize: 13 }}>Click a file to view its content</div>
        ) : (
          <div style={{ ...GLASS, padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: TEXT }}>{selectedFile}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: ACCENT_H, background: `${ACCENT}18`,
                  border: `1px solid ${ACCENT}30`, borderRadius: 4, padding: '2px 7px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {lang}
                </span>
                <span style={{ fontSize: 10, color: TEXT_M }}>{lineCount} lines</span>
                <span style={{ fontSize: 10, fontWeight: 700,
                  color: isEditable ? SUCCESS : TEXT_M,
                  background: isEditable ? `${SUCCESS}18` : 'rgba(255,255,255,0.06)',
                  borderRadius: 4, padding: '2px 7px' }}>
                  {isEditable ? 'Editable' : 'View Only'}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
              {loading ? (
                <div style={{ padding: 20, fontSize: 12, color: TEXT_M }}>Loading…</div>
              ) : (
                <pre style={{ margin: 0, padding: '14px 18px', fontFamily: 'monospace', fontSize: 12,
                  lineHeight: 1.75, color: TEXT, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {fileContent?.split('\n').map((line, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: TEXT_M, userSelect: 'none', width: 28, textAlign: 'right',
                        flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
                      <span style={{ color: lang === 'css' && line.trim().startsWith('--') ? ACCENT_H
                        : lang === 'tsx' && /export|return|import/.test(line) ? ACCENT_H : TEXT }}>
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Edit History Panel ────────────────────────────────────────────────────────

function EditHistoryPanel({ workspaceId, projectId, open, onToggle, sessionStatus }: {
  workspaceId: string; projectId: string; open: boolean;
  onToggle: () => void; sessionStatus: SessionStatus;
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>(SEEDED_HISTORY);

  useEffect(() => {
    if (!open) return;
    fetch(`${API_BASE}/v1/editor/workspaces/${workspaceId}/projects/${projectId}/history`)
      .then(r => r.json())
      .then(d => { if (d.entries?.length) setEntries(d.entries); })
      .catch(() => {});
  }, [workspaceId, projectId, open]);

  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.95)',
      height: open ? 190 : 36, transition: 'height 0.2s ease', overflow: 'hidden', flexShrink: 0 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 36, borderBottom: open ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
        onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Edit History
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: sessionStatusColor(sessionStatus),
            background: `${sessionStatusColor(sessionStatus)}18`,
            border: `1px solid ${sessionStatusColor(sessionStatus)}30`,
            borderRadius: 4, padding: '1px 6px' }}>{sessionStatus}</span>
        </div>
        <span style={{ color: TEXT_M, fontSize: 12 }}>{open ? '▼' : '▲'}</span>
      </div>
      {open && (
        <div style={{ overflowY: 'auto', height: 154, padding: '6px 0' }}>
          {entries.map((e, i) => (
            <div key={e.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 10,
              padding: '5px 16px', fontSize: 12, borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT_M, fontSize: 10, flexShrink: 0, width: 48 }}>{timeAgo(e.ts)}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: modeBadgeColor(e.mode),
                background: `${modeBadgeColor(e.mode)}18`,
                border: `1px solid ${modeBadgeColor(e.mode)}30`,
                borderRadius: 4, padding: '1px 6px', flexShrink: 0, textTransform: 'uppercase' }}>
                {e.mode}
              </span>
              <span style={{ fontSize: 10, color: TEXT_M, flexShrink: 0 }}>{e.eventType}</span>
              <span style={{ color: TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.description}
              </span>
              {e.qualityDelta !== undefined && (
                <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0,
                  color: e.qualityDelta >= 0 ? SUCCESS : DANGER }}>
                  {e.qualityDelta >= 0 ? `+${e.qualityDelta}` : e.qualityDelta} pts
                </span>
              )}
              {e.canRollback && (
                <span style={{ fontSize: 10, color: TEXT_M, border: `1px solid ${BORDER}`,
                  borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>rollback</span>
              )}
            </div>
          ))}
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
  const [snapping,  setSnapping ] = useState(false);
  const [snapped,   setSnapped  ] = useState(false);
  const [historyData, setHistoryData] = useState<{ open: boolean }>({ open: false });

  const createSnapshot = async () => {
    setSnapping(true);
    track('snapshot_create', { projectId, workspaceId });
    try {
      await fetch(`${API_BASE}/v1/editor/snapshots/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, projectId, label: `Snapshot ${new Date().toISOString()}` }),
      });
    } catch { /* no-op */ }
    setSnapped(true);
    setSnapping(false);
    setTimeout(() => setSnapped(false), 2000);
  };

  const approveDiff = () => {
    track('diff_approve', { projectId });
    setSessionStatus('APPLIED');
  };

  const rejectDiff = () => {
    if (!window.confirm('Reject this diff? Changes will be discarded.')) return;
    track('diff_reject', { projectId });
    setSessionStatus('REJECTED');
  };

  const rollback = async () => {
    if (!window.confirm('Roll back to the previous snapshot? This cannot be undone.')) return;
    track('rollback', { projectId, workspaceId });
    try {
      await fetch(`${API_BASE}/v1/editor/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      {/* Risk badge */}
      {risk && (
        <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(risk),
          background: `${riskColor(risk)}18`, border: `1px solid ${riskColor(risk)}30`,
          borderRadius: 6, padding: '4px 10px' }}>
          {risk} RISK
        </span>
      )}

      {/* Session status */}
      <span style={{ fontSize: 11, fontWeight: 700, color: sessionStatusColor(sessionStatus),
        background: `${sessionStatusColor(sessionStatus)}18`,
        border: `1px solid ${sessionStatusColor(sessionStatus)}30`,
        borderRadius: 6, padding: '4px 10px' }}>
        {sessionStatus}
      </span>

      <div style={{ flex: 1 }} />

      {/* View History */}
      <button
        onClick={() => setHistoryData(h => ({ open: !h.open }))}
        style={{ background: 'transparent', color: TEXT_M, border: `1px solid ${BORDER}`,
          borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12,
          fontWeight: 600, cursor: 'pointer' }}>
        View History
      </button>

      {/* Create Snapshot */}
      <button
        onClick={createSnapshot}
        disabled={snapping}
        style={{ background: snapped ? SUCCESS : 'rgba(255,255,255,0.06)', color: snapped ? '#fff' : TEXT_M,
          border: `1px solid ${snapped ? SUCCESS : BORDER}`, borderRadius: 7, padding: '6px 14px',
          fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
        {snapping ? 'Creating…' : snapped ? 'Snapshot Created!' : 'Create Snapshot'}
      </button>

      {/* Approve / Reject (only when there's a pending diff) */}
      {sessionStatus === 'PENDING_DIFF' && currentPlan && (
        <>
          <button
            onClick={rejectDiff}
            style={{ background: `${DANGER}18`, color: DANGER, border: `1px solid ${DANGER}44`,
              borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12,
              fontWeight: 700, cursor: 'pointer' }}>
            Reject
          </button>
          {risk !== 'HIGH' && risk !== 'CRITICAL' ? (
            <button
              onClick={approveDiff}
              style={{ background: SUCCESS, color: '#fff', border: 'none',
                borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12,
                fontWeight: 700, cursor: 'pointer' }}>
              Approve
            </button>
          ) : (
            <button
              onClick={() => { if (window.confirm('This is a HIGH RISK change. Are you sure you want to approve?')) approveDiff(); }}
              style={{ background: WARN, color: '#fff', border: 'none',
                borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12,
                fontWeight: 700, cursor: 'pointer' }}>
              Approve (HIGH RISK)
            </button>
          )}
        </>
      )}

      {/* Rollback — only when APPLIED */}
      {sessionStatus === 'APPLIED' && (
        <button
          onClick={rollback}
          style={{ background: `${DANGER}18`, color: DANGER, border: `1px solid ${DANGER}44`,
            borderRadius: 7, padding: '6px 14px', fontFamily: FONT, fontSize: 12,
            fontWeight: 700, cursor: 'pointer' }}>
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

  const [mode,          setMode         ] = useState<EditorMode>('visual');
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DRAFT');
  const [currentPlan,   setCurrentPlan  ] = useState<ChangePlan | null>(null);
  const [historyOpen,   setHistoryOpen  ] = useState(false);

  // Project name — pulled from seeded data or fallback
  const PROJECT_NAMES: Record<string, string> = {
    'proj-creator-os': 'CreatorOS',
    'proj-medibook':   'MediBook Pro',
    'proj-shopforge':  'ShopForge',
    'proj-tutor-ai':   'TutorAI',
  };
  const projectName = PROJECT_NAMES[projectId] ?? projectId;

  useEffect(() => {
    track('editor_open', { workspaceId, projectId, mode });
  }, [workspaceId, projectId, mode]);

  const handleModeSwitch = (m: EditorMode) => {
    setMode(m);
    track('mode_switch', { projectId, from: mode, to: m });
  };

  const handlePlanChange = (plan: ChangePlan | null) => {
    setCurrentPlan(plan);
    if (plan) setSessionStatus('PENDING_DIFF');
  };

  const MODES: { key: EditorMode; label: string }[] = [
    { key: 'visual',   label: 'Visual'   },
    { key: 'branding', label: 'Branding' },
    { key: 'content',  label: 'Content'  },
    { key: 'layout',   label: 'Layout'   },
    { key: 'advanced', label: 'Advanced' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column',
      background: BG, fontFamily: FONT, color: TEXT, overflow: 'hidden' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>

      {/* ── HEADER ── */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(3,7,18,0.97)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href={`/workspace/${workspaceId}/project/${projectId}`}
            style={{ fontSize: 12, color: TEXT_M, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Back to Project
          </Link>
          <span style={{ color: BORDER, fontSize: 16 }}>│</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
            Editor: {projectName}
          </span>
          {/* Editor mode badge */}
          <span style={{ fontSize: 11, fontWeight: 700, color: modeBadgeColor(mode),
            background: `${modeBadgeColor(mode)}18`,
            border: `1px solid ${modeBadgeColor(mode)}30`,
            borderRadius: 6, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {mode}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: sessionStatusColor(sessionStatus),
            background: `${sessionStatusColor(sessionStatus)}18`,
            border: `1px solid ${sessionStatusColor(sessionStatus)}30`,
            borderRadius: 6, padding: '3px 10px' }}>
            {sessionStatus}
          </span>
        </div>
      </div>

      {/* ── MODE TABS ── */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${BORDER}`,
        background: SURFACE2, flexShrink: 0, paddingLeft: 16 }}>
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => handleModeSwitch(m.key)}
            style={{ background: mode === m.key ? ACCENT : 'transparent',
              color: mode === m.key ? '#fff' : TEXT_M,
              border: 'none', borderBottom: mode === m.key ? `2px solid ${ACCENT_H}` : '2px solid transparent',
              padding: '12px 20px', fontFamily: FONT, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.03em', transition: 'background 0.15s, color 0.15s',
              borderRadius: mode === m.key ? '6px 6px 0 0' : 0 }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* ── HIGH RISK WARNING BANNER ── */}
      {currentPlan?.riskLevel === 'HIGH' || currentPlan?.riskLevel === 'CRITICAL' ? (
        <div style={{ background: `${WARN}14`, borderBottom: `1px solid ${WARN}40`,
          padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: WARN }}>
            HIGH RISK change detected — carefully review the diff before approving.
          </span>
        </div>
      ) : null}

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT PANEL */}
        <div style={{ width: 300, minWidth: 300, borderRight: `1px solid ${BORDER}`,
          background: SURFACE2, padding: 16, display: 'flex', flexDirection: 'column',
          overflow: 'auto', gap: 0 }}>
          {mode === 'visual' && (
            <VisualMode workspaceId={workspaceId} projectId={projectId} onPlanChange={handlePlanChange} />
          )}
          {mode === 'branding' && (
            <BrandingMode workspaceId={workspaceId} projectId={projectId} />
          )}
          {mode === 'content' && (
            <ContentMode workspaceId={workspaceId} projectId={projectId} />
          )}
          {mode === 'layout' && (
            <LayoutMode workspaceId={workspaceId} projectId={projectId} />
          )}
          {mode === 'advanced' && (
            <AdvancedMode workspaceId={workspaceId} projectId={projectId} />
          )}
        </div>

        {/* RIGHT PANEL — rendered inside mode components via flex row */}
        {/* Modes that have their own right panel are rendered as flex rows */}
        {/* For modes that don't split internally, we render a placeholder */}
      </div>

      {/* ── EDIT HISTORY COLLAPSIBLE PANEL ── */}
      <EditHistoryPanel
        workspaceId={workspaceId}
        projectId={projectId}
        open={historyOpen}
        onToggle={() => setHistoryOpen(o => !o)}
        sessionStatus={sessionStatus}
      />

      {/* ── BOTTOM ACTION BAR ── */}
      <BottomActionBar
        workspaceId={workspaceId}
        projectId={projectId}
        sessionStatus={sessionStatus}
        setSessionStatus={setSessionStatus}
        currentPlan={currentPlan}
      />
    </div>
  );
}
