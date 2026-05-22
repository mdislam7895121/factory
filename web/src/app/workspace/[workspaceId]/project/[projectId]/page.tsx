'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE  = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
const ACCENT    = '#6366f1';
const ACCENT_GN = '#10b981';
const ACCENT_YL = '#f59e0b';
const ACCENT_R  = '#ef4444';
const BG        = '#030712';
const SURFACE   = 'rgba(10,22,40,0.82)';
const BORDER    = 'rgba(255,255,255,0.07)';
const TEXT      = '#f1f5f9';
const TEXT_M    = '#64748b';
const GLASS: React.CSSProperties = {
  background: SURFACE, backdropFilter:'blur(20px)',
  border:`1px solid ${BORDER}`, borderRadius:12,
};
const FONT = "'Geist','Inter',system-ui,sans-serif";

function track(event: string, meta?: Record<string, unknown>) {
  console.debug('[factory:workspace]', { event, ts: Date.now(), ...meta });
}

// ── Types ────────────────────────────────────────────────────────────────────

type RuntimeStatus = 'RUNNING' | 'SLEEPING' | 'WAKING' | 'CRASHED' | 'RECOVERING';
type QualityTier   = 'PRODUCTION_READY' | 'BETA_READY' | 'PREVIEW_READY' | 'EXPERIMENTAL';
type CenterTab     = 'preview' | 'overview' | 'request' | 'editing';
type RightTab      = 'quality' | 'memory' | 'snapshot' | 'deploy';
type NavSection    = 'workspace' | 'explore' | 'tools';
type Device        = 'desktop' | 'tablet' | 'mobile';

// ── Seeded data ───────────────────────────────────────────────────────────────

const SEEDED: Record<string, {
  name:string; workspaceId:string; description:string; status:RuntimeStatus; qualityScore:number;
  qualityTier:QualityTier; stack:string[]; category:string; previewUrl?:string;
}> = {
  'proj-creator-os': { name:'CreatorOS', workspaceId:'ws-founder-1', description:'AI-powered creator workspace SaaS', status:'RUNNING',  qualityScore:92, qualityTier:'PRODUCTION_READY', stack:['Next.js','NestJS','PostgreSQL'], category:'SaaS' },
  'proj-medibook':   { name:'MediBook Pro', workspaceId:'ws-founder-1', description:'Medical appointment booking', status:'SLEEPING', qualityScore:87, qualityTier:'PRODUCTION_READY', stack:['React','Express','MongoDB'],          category:'Healthcare' },
  'proj-shopforge':  { name:'ShopForge', workspaceId:'ws-dev-1', description:'Modern e-commerce platform', status:'RUNNING',  qualityScore:73, qualityTier:'BETA_READY',       stack:['Next.js','Stripe','PostgreSQL'],      category:'E-Commerce' },
  'proj-tutor-ai':   { name:'TutorAI', workspaceId:'ws-dev-1', description:'AI tutoring for K-12', status:'SLEEPING', qualityScore:38, qualityTier:'EXPERIMENTAL',    stack:['React','OpenAI','FastAPI'],           category:'Education' },
};

const TIER_COLOR: Record<QualityTier, string> = {
  PRODUCTION_READY: ACCENT_GN, BETA_READY: ACCENT, PREVIEW_READY: ACCENT_YL, EXPERIMENTAL: ACCENT_R,
};

const STATUS_COLOR: Record<RuntimeStatus, string> = {
  RUNNING:'#10b981', SLEEPING:'#64748b', WAKING:'#f59e0b', CRASHED:'#ef4444', RECOVERING:'#f59e0b',
};

const EDITING_CARDS = [
  { id:'ec-1', cat:'BRANDING',    title:'Update Branding',     desc:'Change colors, fonts, visual identity', risk:'LOW',    icon:'◈' },
  { id:'ec-2', cat:'CONTENT',     title:'Edit Homepage Copy',  desc:'Update hero text and CTAs',             risk:'LOW',    icon:'▤' },
  { id:'ec-3', cat:'LAYOUT',      title:'Fix Mobile Layout',   desc:'Improve responsive design',             risk:'LOW',    icon:'⬡' },
  { id:'ec-4', cat:'FEATURE',     title:'Add Pricing Section', desc:'3-tier pricing feature',                risk:'MEDIUM', icon:'◇' },
  { id:'ec-5', cat:'INTEGRATION', title:'Add Stripe Checkout', desc:'Payment processing integration',        risk:'HIGH',   icon:'◆' },
  { id:'ec-6', cat:'FEATURE',     title:'Add User Auth',       desc:'Login, signup, session management',     risk:'HIGH',   icon:'⬢' },
  { id:'ec-7', cat:'CONTENT',     title:'Update Contact Form', desc:'Form with validation',                  risk:'LOW',    icon:'▣' },
  { id:'ec-8', cat:'LAYOUT',      title:'Improve Navigation',  desc:'Nav menu and site structure',           risk:'LOW',    icon:'◉' },
  { id:'ec-9', cat:'SECURITY',    title:'Security Hardening',  desc:'Headers and input validation',          risk:'MEDIUM', icon:'⬟' },
];

const RISK_COLOR: Record<string, string> = { LOW: ACCENT_GN, MEDIUM: ACCENT_YL, HIGH: ACCENT_R, CRITICAL: ACCENT_R };

const SEEDED_ACTIVITY = [
  { type:'BUILD',          severity:'SUCCESS', message:'Build completed — 18 pages in 12s', ts: Date.now()-300000 },
  { type:'DEPLOY',         severity:'SUCCESS', message:'Deploy to Railway succeeded v1.4.2', ts: Date.now()-600000 },
  { type:'QUALITY_CHECK',  severity:'INFO',    message:'Quality score: 92/100 — PRODUCTION_READY', ts: Date.now()-900000 },
  { type:'RUNTIME_STATUS', severity:'INFO',    message:'Runtime woke after 4min idle', ts: Date.now()-1200000 },
  { type:'CHANGE_REQUEST', severity:'INFO',    message:'Change request approved: update dashboard layout', ts: Date.now()-1800000 },
];

const SEV_COLOR: Record<string, string> = { SUCCESS:ACCENT_GN, ERROR:ACCENT_R, WARN:ACCENT_YL, INFO:TEXT_M };

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m/60)}h ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RuntimeDot({ status }: { status: RuntimeStatus }) {
  const color = STATUS_COLOR[status];
  return (
    <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:color,
      boxShadow: status === 'RUNNING' ? `0 0 6px ${color}` : 'none',
      animation: status === 'RUNNING' ? 'pulse 2s ease-in-out infinite' : 'none' }} />
  );
}

function ScoreRing({ score, size=48 }: { score:number; size?:number }) {
  const color = score >= 85 ? ACCENT_GN : score >= 70 ? ACCENT : score >= 50 ? ACCENT_YL : ACCENT_R;
  const r = (size-8)/2;
  const circ = 2 * Math.PI * r;
  const fill = (score/100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BORDER} strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${fill} ${circ-fill}`} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontSize:size*0.22, fill:TEXT, fontFamily:FONT, transform:'rotate(90deg)', transformOrigin:'50% 50%' }}>
        {score}
      </text>
    </svg>
  );
}

// ── Left Sidebar ──────────────────────────────────────────────────────────────

function LeftSidebar({ workspaceId, projectId, activeSection, onSection, project }: {
  workspaceId:string; projectId:string; activeSection:NavSection;
  onSection:(s:NavSection)=>void; project: typeof SEEDED[string] | null;
}) {
  const WORKSPACE_NAV = [
    { key:'overview',  label:'Overview',      sec:'workspace' as NavSection },
    { key:'preview',   label:'Preview',       sec:'workspace' as NavSection },
    { key:'request',   label:'Change Request',sec:'workspace' as NavSection },
    { key:'editing',   label:'Guided Editing',sec:'workspace' as NavSection },
  ];

  return (
    <div style={{ width:220, minWidth:220, background:'rgba(3,7,18,0.95)', borderRight:`1px solid ${BORDER}`,
      display:'flex', flexDirection:'column', gap:0, overflow:'hidden' }}>
      {/* Project info */}
      <div style={{ padding:'16px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <RuntimeDot status={project?.status ?? 'SLEEPING'} />
          <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>{project?.name ?? projectId}</span>
        </div>
        <div style={{ fontSize:11, color:TEXT_M }}>{project?.category ?? ''}</div>
        <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
          {project?.stack?.slice(0,3).map(s => (
            <span key={s} style={{ fontSize:10, color:ACCENT, background:`${ACCENT}18`,
              border:`1px solid ${ACCENT}30`, borderRadius:4, padding:'1px 6px' }}>{s}</span>
          ))}
        </div>
      </div>
      {/* Nav sections */}
      <div style={{ flex:1, overflow:'auto', padding:'8px 0' }}>
        {[
          { label:'WORKSPACE', items:[
            { key:'preview',  label:'Live Preview' },
            { key:'overview', label:'Overview' },
            { key:'request',  label:'Change Request' },
            { key:'editing',  label:'Guided Editing' },
          ]},
          { label:'EXPLORE', items:[
            { key:'files',      label:'File Explorer' },
            { key:'routes',     label:'Route Map' },
            { key:'components', label:'Components' },
            { key:'api-map',    label:'API Map' },
          ]},
          { label:'TOOLS', items:[
            { key:'memory',   label:'Memory' },
            { key:'quality',  label:'Quality' },
            { key:'snapshot', label:'Snapshots' },
            { key:'deploy',   label:'Deployments' },
          ]},
        ].map(section => (
          <div key={section.label} style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, color:TEXT_M, letterSpacing:'0.08em',
              padding:'4px 16px 2px', textTransform:'uppercase' }}>{section.label}</div>
            {section.items.map(item => (
              <div key={item.key} style={{ padding:'6px 16px', fontSize:13, color:TEXT_M, cursor:'pointer',
                background:'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${ACCENT}12`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Back link */}
      <div style={{ padding:'12px 16px', borderTop:`1px solid ${BORDER}` }}>
        <Link href={`/workspace/${workspaceId}`}
          style={{ fontSize:12, color:TEXT_M, textDecoration:'none', display:'block' }}>
          ← Back to Workspace
        </Link>
      </div>
    </div>
  );
}

// ── Preview Center ────────────────────────────────────────────────────────────

function PreviewCenter({ project, workspaceId, projectId }: {
  project: typeof SEEDED[string] | null; workspaceId:string; projectId:string;
}) {
  const [device, setDevice]   = useState<Device>('desktop');
  const [refreshKey, setRefresh] = useState(0);
  const [status, setStatus]   = useState<RuntimeStatus>(project?.status ?? 'SLEEPING');

  const deviceWidth = { desktop:'100%', tablet:'768px', mobile:'375px' };
  const previewUrl  = `${API_BASE}/v1/preview/${projectId}/render`;

  const wake = useCallback(async () => {
    setStatus('WAKING');
    track('preview_wake', { projectId });
    try {
      await fetch(`${API_BASE}/v1/workspace/${workspaceId}/projects/${projectId}/runtime`, {
        method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status:'RUNNING' }),
      });
    } catch { /* no-op */ }
    setTimeout(() => setStatus('RUNNING'), 2000);
  }, [projectId, workspaceId]);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Device toolbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 16px', borderBottom:`1px solid ${BORDER}`, background:'rgba(3,7,18,0.6)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <RuntimeDot status={status} />
          <span style={{ fontSize:12, color:TEXT_M, fontWeight:600 }}>{status}</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {(['desktop','tablet','mobile'] as Device[]).map(d => (
            <button key={d} onClick={() => setDevice(d)}
              style={{ background: d === device ? ACCENT : 'transparent',
                color: d === device ? '#fff' : TEXT_M,
                border:`1px solid ${d === device ? ACCENT : BORDER}`, borderRadius:6,
                padding:'4px 12px', fontFamily:FONT, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {d.charAt(0).toUpperCase()+d.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => { setRefresh(k=>k+1); track('preview_refresh', {projectId}); }}
            style={{ background:'transparent', color:TEXT_M, border:`1px solid ${BORDER}`,
              borderRadius:6, padding:'4px 12px', fontFamily:FONT, fontSize:12, cursor:'pointer' }}>
            Refresh
          </button>
          {status !== 'RUNNING' && (
            <button onClick={wake}
              style={{ background:ACCENT_GN, color:'#fff', border:'none',
                borderRadius:6, padding:'4px 12px', fontFamily:FONT, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Wake Runtime
            </button>
          )}
          <a href={previewUrl} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:ACCENT,
              border:`1px solid ${ACCENT}44`, borderRadius:6, padding:'4px 12px', textDecoration:'none', fontFamily:FONT, fontWeight:600 }}>
            Open Preview
          </a>
        </div>
      </div>
      {/* Preview area */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,0,0.3)', padding:16, overflow:'auto' }}>
        <div style={{ width: deviceWidth[device], maxWidth:'100%', height:'100%', minHeight:400,
          background:BG, borderRadius:12, overflow:'hidden', boxShadow:'0 0 40px rgba(0,0,0,0.6)',
          border:`1px solid ${BORDER}`, display:'flex', flexDirection:'column' }}>
          {/* Mock browser bar */}
          <div style={{ padding:'8px 12px', background:'rgba(255,255,255,0.04)', borderBottom:`1px solid ${BORDER}`,
            display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:`${ACCENT_R}66`, display:'inline-block' }} />
            <span style={{ width:8, height:8, borderRadius:'50%', background:`${ACCENT_YL}66`, display:'inline-block' }} />
            <span style={{ width:8, height:8, borderRadius:'50%', background:`${ACCENT_GN}66`, display:'inline-block' }} />
            <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:4, padding:'3px 10px',
              fontSize:11, color:TEXT_M, marginLeft:8 }}>
              factory.app/{projectId}
            </div>
          </div>
          {/* Content */}
          {status === 'RUNNING' ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', padding:32, gap:16 }}>
              <div style={{ fontSize:48, fontWeight:900, color:TEXT, textAlign:'center' }}>
                {project?.name ?? 'App'}
              </div>
              <div style={{ fontSize:16, color:TEXT_M, textAlign:'center', maxWidth:400 }}>
                {project?.description ?? 'AI-generated application'}
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {project?.stack?.map(s => (
                  <span key={s} style={{ fontSize:12, color:ACCENT, background:`${ACCENT}18`,
                    border:`1px solid ${ACCENT}30`, borderRadius:6, padding:'4px 10px' }}>{s}</span>
                ))}
              </div>
              <div style={{ marginTop:8, padding:'10px 24px', background:ACCENT, color:'#fff',
                borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Get Started
              </div>
              <div style={{ fontSize:11, color:TEXT_M, marginTop:8 }}>
                Quality Score: {project?.qualityScore}/100 · {project?.qualityTier?.replace(/_/g,' ')}
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:16, padding:32 }}>
              <div style={{ fontSize:48, opacity:0.2 }}>◎</div>
              <div style={{ fontSize:14, color:TEXT_M, textAlign:'center' }}>
                Runtime is {status.toLowerCase()}<br/>
                <span style={{ fontSize:12 }}>Click "Wake Runtime" to start the preview</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Overview Center ───────────────────────────────────────────────────────────

function OverviewCenter({ project, workspaceId, projectId }: {
  project: typeof SEEDED[string] | null; workspaceId:string; projectId:string;
}) {
  const [deploys, setDeploys] = useState([
    { platform:'RAILWAY', status:'SUCCESS', branch:'main', time: Date.now()-600000 },
    { platform:'NETLIFY', status:'SUCCESS', branch:'main', time: Date.now()-600000 },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/v1/workspace/${workspaceId}/deployments`)
      .then(r => r.json())
      .then(d => { if (d.deployments?.length) setDeploys(d.deployments.map((dep: any) => ({
        platform: dep.platform, status: dep.status, branch: dep.branch,
        time: new Date(dep.createdAt).getTime(),
      }))); })
      .catch(() => {});
    track('overview_open', { projectId });
  }, [workspaceId, projectId]);

  const depStatus: Record<string, string> = { SUCCESS:ACCENT_GN, FAILED:ACCENT_R, IN_PROGRESS:ACCENT_YL, PENDING:TEXT_M };

  return (
    <div style={{ flex:1, padding:24, overflow:'auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignContent:'start' }}>
      {/* Project info */}
      <div style={{ ...GLASS, padding:20, gridColumn:'1/-1' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:TEXT }}>{project?.name}</div>
            <div style={{ fontSize:13, color:TEXT_M, marginTop:4 }}>{project?.description}</div>
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              {project?.stack?.map(s => (
                <span key={s} style={{ fontSize:12, color:ACCENT, background:`${ACCENT}18`,
                  border:`1px solid ${ACCENT}30`, borderRadius:6, padding:'4px 10px' }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <ScoreRing score={project?.qualityScore ?? 0} size={64} />
            <div style={{ fontSize:11, fontWeight:700, marginTop:4,
              color: TIER_COLOR[project?.qualityTier ?? 'EXPERIMENTAL'] }}>
              {project?.qualityTier?.replace(/_/g,' ')}
            </div>
          </div>
        </div>
      </div>
      {/* Runtime */}
      <div style={{ ...GLASS, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:TEXT_M, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>Runtime</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <RuntimeDot status={project?.status ?? 'SLEEPING'} />
          <span style={{ fontSize:15, fontWeight:700, color:TEXT }}>{project?.status}</span>
        </div>
        <div style={{ fontSize:12, color:TEXT_M, marginTop:8 }}>Category: {project?.category}</div>
      </div>
      {/* Quality */}
      <div style={{ ...GLASS, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:TEXT_M, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>Quality</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <ScoreRing score={project?.qualityScore ?? 0} size={40} />
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>{project?.qualityScore}/100</div>
            <div style={{ fontSize:11, color: TIER_COLOR[project?.qualityTier ?? 'EXPERIMENTAL'] }}>
              {project?.qualityTier?.replace(/_/g,' ')}
            </div>
          </div>
        </div>
        <Link href="/quality" style={{ fontSize:12, color:ACCENT, textDecoration:'none', display:'inline-block', marginTop:10 }}>
          Open Quality Report →
        </Link>
      </div>
      {/* Deployments */}
      <div style={{ ...GLASS, padding:16, gridColumn:'1/-1' }}>
        <div style={{ fontSize:12, fontWeight:700, color:TEXT_M, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>Deployments</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {deploys.map((d, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, fontSize:13 }}>
              <span style={{ color:TEXT, fontWeight:600, width:80 }}>{d.platform}</span>
              <span style={{ color:depStatus[d.status] ?? TEXT_M, fontWeight:700 }}>{d.status}</span>
              <span style={{ color:TEXT_M }}>{d.branch}</span>
              <span style={{ color:TEXT_M, marginLeft:'auto', fontSize:11 }}>{timeAgo(d.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Change Request Center ─────────────────────────────────────────────────────

function ChangeRequestCenter({ workspaceId, projectId }: { workspaceId:string; projectId:string }) {
  const [prompt,   setPrompt  ] = useState('');
  const [loading,  setLoading ] = useState(false);
  const [result,   setResult  ] = useState<{
    scopeSummary:string; affectedSystems:string[]; qualityRiskEstimate:string;
    requiresConfirmation:boolean; status:string;
  } | null>(null);
  const [history, setHistory] = useState<typeof result[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const submit = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true); setResult(null); setConfirmed(false);
    track('change_request_submit', { projectId, prompt: prompt.slice(0,80) });
    try {
      const res = await fetch(`${API_BASE}/v1/workspace/${workspaceId}/projects/${projectId}/change-requests`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ workspaceId, projectId, prompt }),
      });
      if (res.ok) {
        const d = await res.json();
        setResult(d.changeRequest);
        setHistory(h => [d.changeRequest, ...h].slice(0, 5));
      }
    } catch {
      // Seeded fallback analysis
      const lower = prompt.toLowerCase();
      const affected: string[] = [];
      if (/header|nav|color|theme|style|font/.test(lower)) affected.push('UI/Styling');
      if (/auth|login|signup/.test(lower))                  affected.push('Authentication');
      if (/stripe|payment|checkout/.test(lower))            affected.push('Payments');
      if (/api|route|endpoint/.test(lower))                 affected.push('API');
      if (affected.length === 0)                            affected.push('General');
      const risk: string = /auth|payment|stripe|database/.test(lower) ? 'HIGH' : /api|route/.test(lower) ? 'MEDIUM' : 'LOW';
      const cr = {
        scopeSummary: `Affects ${affected.join(', ')}. Risk: ${risk}. "${prompt.slice(0,60)}"`,
        affectedSystems: affected, qualityRiskEstimate: risk,
        requiresConfirmation: risk === 'HIGH' || risk === 'CRITICAL', status:'PENDING',
      };
      setResult(cr);
      setHistory(h => [cr, ...h].slice(0, 5));
    }
    setLoading(false);
  }, [prompt, workspaceId, projectId]);

  const riskColor = result ? RISK_COLOR[result.qualityRiskEstimate] ?? TEXT_M : TEXT_M;

  return (
    <div style={{ flex:1, padding:24, overflow:'auto' }}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <div style={{ fontSize:18, fontWeight:700, color:TEXT, marginBottom:4 }}>Request a Change</div>
        <div style={{ fontSize:13, color:TEXT_M, marginBottom:20 }}>
          Describe what you want to change — AI will analyze scope and risk before executing
        </div>
        {/* Input */}
        <div style={{ ...GLASS, padding:20, marginBottom:20 }}>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. 'Make the header more modern' or 'Add a pricing section with 3 tiers'"
            rows={3}
            style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}`,
              borderRadius:8, padding:'10px 14px', color:TEXT, fontFamily:FONT, fontSize:14,
              outline:'none', resize:'vertical', boxSizing:'border-box' }} />
          <button onClick={submit} disabled={loading || !prompt.trim()}
            style={{ marginTop:12, background: loading ? TEXT_M : ACCENT, color:'#fff', border:'none',
              borderRadius:8, padding:'10px 24px', fontFamily:FONT, fontWeight:700, fontSize:14,
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer', opacity: !prompt.trim() ? 0.5 : 1 }}>
            {loading ? 'Analyzing…' : 'Analyze Change Request'}
          </button>
        </div>
        {/* Result */}
        {result && (
          <div style={{ ...GLASS, padding:20, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>Analysis Result</div>
              <span style={{ fontSize:12, fontWeight:700, color: riskColor, background:`${riskColor}18`,
                border:`1px solid ${riskColor}30`, borderRadius:6, padding:'3px 10px' }}>
                {result.qualityRiskEstimate} RISK
              </span>
            </div>
            <div style={{ fontSize:13, color:TEXT_M, marginBottom:16, lineHeight:1.6 }}>{result.scopeSummary}</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:TEXT_M, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Affected Systems</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {result.affectedSystems.map(s => (
                  <span key={s} style={{ fontSize:12, color:TEXT, background:`rgba(255,255,255,0.06)`,
                    border:`1px solid ${BORDER}`, borderRadius:6, padding:'3px 10px' }}>{s}</span>
                ))}
              </div>
            </div>
            {result.requiresConfirmation ? (
              <div style={{ padding:12, background:`${ACCENT_YL}12`, border:`1px solid ${ACCENT_YL}30`,
                borderRadius:8, marginBottom:12 }}>
                <div style={{ fontSize:13, color:ACCENT_YL, fontWeight:600 }}>
                  High-risk change — requires confirmation
                </div>
                <div style={{ fontSize:12, color:TEXT_M, marginTop:4 }}>
                  This change affects critical systems. Review carefully before approving.
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, cursor:'pointer', fontSize:13, color:TEXT }}>
                  <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
                  I understand the risk and confirm this change
                </label>
              </div>
            ) : null}
            <div style={{ display:'flex', gap:10 }}>
              {(!result.requiresConfirmation || confirmed) && (
                <button style={{ background:ACCENT_GN, color:'#fff', border:'none', borderRadius:8,
                  padding:'8px 20px', fontFamily:FONT, fontWeight:700, fontSize:13, cursor:'pointer' }}
                  onClick={() => { track('change_request_approve', { projectId }); setResult(r => r ? {...r, status:'APPROVED'} : null); }}>
                  Approve & Queue
                </button>
              )}
              <button style={{ background:'transparent', color:TEXT_M, border:`1px solid ${BORDER}`,
                borderRadius:8, padding:'8px 20px', fontFamily:FONT, fontWeight:600, fontSize:13, cursor:'pointer' }}
                onClick={() => { setResult(null); setPrompt(''); }}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* History */}
        {history.length > 0 && (
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:TEXT_M, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Recent Requests</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {history.map((h, i) => h && (
                <div key={i} style={{ ...GLASS, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                  <span style={{ color: RISK_COLOR[h.qualityRiskEstimate] ?? TEXT_M, fontWeight:700, fontSize:11,
                    background:`${RISK_COLOR[h.qualityRiskEstimate] ?? TEXT_M}18`, borderRadius:4, padding:'2px 6px' }}>
                    {h.qualityRiskEstimate}
                  </span>
                  <span style={{ color:TEXT_M, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {h.affectedSystems.join(', ')}
                  </span>
                  <span style={{ color: h.status === 'APPROVED' ? ACCENT_GN : TEXT_M, fontWeight:600, fontSize:11 }}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Guided Editing Center ─────────────────────────────────────────────────────

function GuidedEditingCenter({ workspaceId, projectId }: { workspaceId:string; projectId:string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<string[]>([]);

  const send = useCallback(async (card: typeof EDITING_CARDS[0]) => {
    setSelected(card.id); setSubmitting(true);
    track('guided_edit_request', { projectId, card: card.id, title: card.title });
    try {
      await fetch(`${API_BASE}/v1/workspace/${workspaceId}/projects/${projectId}/change-requests`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ workspaceId, projectId, prompt: card.desc }),
      });
    } catch { /* no-op */ }
    setSent(s => [...s, card.id]);
    setTimeout(() => { setSelected(null); setSubmitting(false); }, 800);
  }, [workspaceId, projectId]);

  const catColors: Record<string, string> = {
    BRANDING:ACCENT, CONTENT:ACCENT_GN, LAYOUT:ACCENT_YL, FEATURE:ACCENT, INTEGRATION:ACCENT_R, SECURITY:ACCENT_YL,
  };

  return (
    <div style={{ flex:1, padding:24, overflow:'auto' }}>
      <div style={{ fontSize:18, fontWeight:700, color:TEXT, marginBottom:4 }}>Guided Editing</div>
      <div style={{ fontSize:13, color:TEXT_M, marginBottom:24 }}>
        Safe, pre-analyzed change templates. Click to queue a change request.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {EDITING_CARDS.map(card => {
          const isSent = sent.includes(card.id);
          const isActive = selected === card.id;
          return (
            <div key={card.id} onClick={() => !isSent && !submitting && send(card)}
              style={{ ...GLASS, padding:18, cursor: isSent ? 'default' : 'pointer',
                border:`1px solid ${isActive ? ACCENT : BORDER}`,
                opacity: isSent ? 0.6 : 1, position:'relative',
                transition:'border-color 0.15s, transform 0.1s',
                transform: isActive ? 'scale(0.98)' : 'scale(1)' }}
              onMouseEnter={e => !isSent && (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={e => !isSent && (e.currentTarget.style.borderColor = BORDER)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <span style={{ fontSize:20, color: catColors[card.cat] ?? ACCENT }}>{card.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, color: RISK_COLOR[card.risk],
                  background:`${RISK_COLOR[card.risk]}18`, border:`1px solid ${RISK_COLOR[card.risk]}30`,
                  borderRadius:4, padding:'2px 6px' }}>{card.risk}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:4 }}>{card.title}</div>
              <div style={{ fontSize:12, color:TEXT_M, lineHeight:1.4 }}>{card.desc}</div>
              <div style={{ marginTop:10, fontSize:11, color: catColors[card.cat] ?? ACCENT,
                fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{card.cat}</div>
              {isSent && (
                <div style={{ position:'absolute', top:8, right:8, fontSize:12, color:ACCENT_GN,
                  fontWeight:700, background:`${ACCENT_GN}18`, border:`1px solid ${ACCENT_GN}30`,
                  borderRadius:4, padding:'2px 8px' }}>Queued</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Right Panel Tabs ──────────────────────────────────────────────────────────

function RightQualityPanel({ projectId }: { projectId:string }) {
  const p = SEEDED[projectId];
  const score = p?.qualityScore ?? 0;
  const tier  = p?.qualityTier  ?? 'EXPERIMENTAL';
  const tierColor = TIER_COLOR[tier];
  const riskFlags = [
    { level:'INFO', msg:`${score >= 70 ? 'No critical' : 'Critical'} runtime issues` },
    { level: score >= 85 ? 'PASS' : 'WARN', msg:`Mobile score ${score >= 70 ? 'OK' : 'needs attention'}` },
    { level: score >= 70 ? 'PASS' : 'HIGH', msg:`Security posture ${score >= 70 ? 'good' : 'review needed'}` },
  ];

  return (
    <div style={{ padding:16, overflow:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <ScoreRing score={score} size={56} />
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:TEXT }}>{score}/100</div>
          <div style={{ fontSize:11, color:tierColor, fontWeight:700 }}>{tier.replace(/_/g,' ')}</div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {riskFlags.map((f, i) => {
          const c = f.level === 'PASS' || f.level === 'INFO' ? ACCENT_GN : f.level === 'WARN' ? ACCENT_YL : ACCENT_R;
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:TEXT }}>
              <span style={{ color:c, fontSize:10 }}>●</span> {f.msg}
            </div>
          );
        })}
      </div>
      <Link href="/quality" style={{ display:'block', textAlign:'center', fontSize:12, color:ACCENT,
        border:`1px solid ${ACCENT}44`, borderRadius:8, padding:'6px 14px', textDecoration:'none', fontWeight:600 }}>
        Open Full Quality Report
      </Link>
    </div>
  );
}

function RightMemoryPanel({ workspaceId }: { workspaceId:string }) {
  return (
    <div style={{ padding:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {[
          { label:'Pinned Memories', value: 12 },
          { label:'Locked Decisions', value: 4 },
          { label:'Context Packs', value: 3 },
          { label:'Active Rules', value: 7 },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS, padding:'10px 12px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:700, color:TEXT }}>{s.value}</div>
            <div style={{ fontSize:10, color:TEXT_M, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:700, color:TEXT_M, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Recent Memories</div>
        {['Stack: Next.js + NestJS + PostgreSQL', 'Auth: JWT-based session management', 'DB: PostgreSQL with Prisma ORM'].map((m, i) => (
          <div key={i} style={{ fontSize:12, color:TEXT, padding:'6px 10px', background:'rgba(255,255,255,0.04)',
            borderRadius:6, marginBottom:6, border:`1px solid ${BORDER}` }}>{m}</div>
        ))}
      </div>
      <Link href="/memory" style={{ display:'block', textAlign:'center', fontSize:12, color:ACCENT,
        border:`1px solid ${ACCENT}44`, borderRadius:8, padding:'6px 14px', textDecoration:'none', fontWeight:600 }}>
        Open Memory Panel
      </Link>
    </div>
  );
}

function RightSnapshotPanel({ workspaceId, projectId }: { workspaceId:string; projectId:string }) {
  const [creating, setCreating] = useState(false);
  const [label, setLabel]       = useState('');
  const snapshots = [
    { label:'Before refactor', time: Date.now()-86400000 },
    { label:'Initial deploy',  time: Date.now()-172800000 },
  ];

  const create = async () => {
    if (!label.trim()) return;
    setCreating(true);
    track('snapshot_create', { projectId, label });
    try {
      await fetch(`${API_BASE}/v1/memory/snapshots`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ workspaceId, projectId, label }),
      });
    } catch { /* no-op */ }
    setCreating(false); setLabel('');
  };

  return (
    <div style={{ padding:16 }}>
      <div style={{ marginBottom:16 }}>
        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="Snapshot label..."
          style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}`,
            borderRadius:8, padding:'7px 12px', color:TEXT, fontFamily:FONT, fontSize:12,
            outline:'none', boxSizing:'border-box', marginBottom:8 }} />
        <button onClick={create} disabled={creating || !label.trim()}
          style={{ width:'100%', background:ACCENT, color:'#fff', border:'none', borderRadius:8,
            padding:'7px', fontFamily:FONT, fontWeight:600, fontSize:12, cursor:'pointer',
            opacity: !label.trim() ? 0.5 : 1 }}>
          {creating ? 'Creating…' : 'Create Snapshot'}
        </button>
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:TEXT_M, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Recent Snapshots</div>
      {snapshots.map((s, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'8px 10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${BORDER}`,
          borderRadius:8, marginBottom:8, fontSize:12 }}>
          <div>
            <div style={{ color:TEXT, fontWeight:600 }}>{s.label}</div>
            <div style={{ color:TEXT_M, fontSize:11, marginTop:2 }}>{timeAgo(s.time)}</div>
          </div>
          <button style={{ background:`${ACCENT_YL}22`, color:ACCENT_YL, border:`1px solid ${ACCENT_YL}44`,
            borderRadius:6, padding:'3px 8px', fontFamily:FONT, fontSize:11, fontWeight:600, cursor:'pointer' }}
            onClick={() => { if (confirm('Restore this snapshot? This will replace current state.')) { track('snapshot_restore', {projectId}); } }}>
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}

function RightDeployPanel({ workspaceId }: { workspaceId:string }) {
  const [deploying, setDeploying] = useState(false);
  const platforms = [
    { name:'RAILWAY', status:'SUCCESS', url:'https://factory.up.railway.app', time: Date.now()-600000 },
    { name:'NETLIFY', status:'SUCCESS', url:'https://factory.netlify.app',    time: Date.now()-600000 },
  ];

  const redeploy = async (platform: string) => {
    setDeploying(true);
    track('redeploy', { workspaceId, platform });
    try {
      await fetch(`${API_BASE}/v1/workspace/${workspaceId}/deployments`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ platform, status:'IN_PROGRESS', branch:'main' }),
      });
    } catch { /* no-op */ }
    setTimeout(() => setDeploying(false), 1500);
  };

  return (
    <div style={{ padding:16 }}>
      {platforms.map(p => (
        <div key={p.name} style={{ ...GLASS, padding:14, marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>{p.name}</span>
            <span style={{ fontSize:11, fontWeight:700, color: p.status === 'SUCCESS' ? ACCENT_GN : ACCENT_R,
              background: p.status === 'SUCCESS' ? `${ACCENT_GN}18` : `${ACCENT_R}18`,
              border: `1px solid ${p.status === 'SUCCESS' ? ACCENT_GN : ACCENT_R}30`,
              borderRadius:4, padding:'2px 6px' }}>{p.status}</span>
          </div>
          <div style={{ fontSize:11, color:TEXT_M, marginBottom:10 }}>{timeAgo(p.time)}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => redeploy(p.name)} disabled={deploying}
              style={{ flex:1, background:ACCENT, color:'#fff', border:'none', borderRadius:6,
                padding:'5px', fontFamily:FONT, fontSize:11, fontWeight:600, cursor:'pointer',
                opacity:deploying?0.6:1 }}>
              {deploying ? 'Deploying…' : 'Redeploy'}
            </button>
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ flex:1, display:'block', textAlign:'center', fontSize:11, color:TEXT_M,
                border:`1px solid ${BORDER}`, borderRadius:6, padding:'5px', textDecoration:'none', fontFamily:FONT }}>
              Open
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bottom Activity Panel ──────────────────────────────────────────────────────

function BottomActivity({ workspaceId, open, onToggle }: {
  workspaceId:string; open:boolean; onToggle:()=>void;
}) {
  const [events, setEvents] = useState(SEEDED_ACTIVITY);

  useEffect(() => {
    if (!open) return;
    fetch(`${API_BASE}/v1/workspace/${workspaceId}/activity?limit=20`)
      .then(r => r.json())
      .then(d => { if (d.events?.length) setEvents(d.events.map((e: any) => ({
        type:e.type, severity:e.severity, message:e.message, ts:new Date(e.timestamp).getTime(),
      }))); })
      .catch(() => {});
  }, [workspaceId, open]);

  return (
    <div style={{ borderTop:`1px solid ${BORDER}`, background:'rgba(3,7,18,0.95)',
      height: open ? 180 : 36, transition:'height 0.2s ease', overflow:'hidden', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', height:36, borderBottom: open ? `1px solid ${BORDER}` : 'none', cursor:'pointer' }}
        onClick={onToggle}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:TEXT_M, textTransform:'uppercase', letterSpacing:'0.06em' }}>Activity Stream</span>
          <span style={{ width:6, height:6, borderRadius:'50%', background:ACCENT_GN,
            boxShadow:`0 0 4px ${ACCENT_GN}`, animation:'pulse 2s ease-in-out infinite' }} />
        </div>
        <span style={{ color:TEXT_M, fontSize:12 }}>{open ? '▼' : '▲'}</span>
      </div>
      {open && (
        <div style={{ overflowY:'auto', height:144, padding:'8px 0' }}>
          {events.map((e, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 16px', fontSize:12 }}>
              <span style={{ color: SEV_COLOR[e.severity] ?? TEXT_M, width:60, flexShrink:0, fontWeight:600, fontSize:11 }}>{e.type}</span>
              <span style={{ color: SEV_COLOR[e.severity] ?? TEXT_M, width:6, height:6, borderRadius:'50%', background: SEV_COLOR[e.severity] ?? TEXT_M, flexShrink:0 }} />
              <span style={{ color:TEXT, flex:1 }}>{e.message}</span>
              <span style={{ color:TEXT_M, fontSize:10, flexShrink:0 }}>{timeAgo(e.ts)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectWorkspacePage() {
  const params      = useParams();
  const workspaceId = (params?.workspaceId as string) ?? 'ws-founder-1';
  const projectId   = (params?.projectId   as string) ?? 'proj-creator-os';
  const project     = SEEDED[projectId] ?? null;

  const [centerTab,  setCenterTab ] = useState<CenterTab>('preview');
  const [rightTab,   setRightTab  ] = useState<RightTab>('quality');
  const [bottomOpen, setBottomOpen] = useState(true);

  const CENTER_TABS: { key:CenterTab; label:string }[] = [
    { key:'preview',  label:'Live Preview' },
    { key:'overview', label:'Overview' },
    { key:'request',  label:'Change Request' },
    { key:'editing',  label:'Guided Editing' },
  ];
  const RIGHT_TABS: { key:RightTab; label:string }[] = [
    { key:'quality',  label:'Quality' },
    { key:'memory',   label:'Memory' },
    { key:'snapshot', label:'Snapshot' },
    { key:'deploy',   label:'Deploy' },
  ];

  useEffect(() => {
    track('workspace_open', { workspaceId, projectId });
  }, [workspaceId, projectId]);

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    background:'none', border:'none', cursor:'pointer', fontFamily:FONT, fontSize:13, fontWeight:600,
    padding:'10px 14px', color: active ? ACCENT : TEXT_M,
    borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent', marginBottom:-1,
  });

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:BG, fontFamily:FONT, color:TEXT, overflow:'hidden' }}>
      {/* Global pulse keyframe */}
      <style>{`@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>

      {/* Header */}
      <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 20px', borderBottom:`1px solid ${BORDER}`,
        background:'rgba(3,7,18,0.95)', backdropFilter:'blur(20px)', flexShrink:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Link href="/workspace" style={{ fontSize:12, color:TEXT_M, textDecoration:'none' }}>Workspaces</Link>
          <span style={{ color:TEXT_M, fontSize:12 }}>›</span>
          <Link href={`/workspace/${workspaceId}`} style={{ fontSize:12, color:TEXT_M, textDecoration:'none' }}>
            {workspaceId === 'ws-founder-1' ? 'CreatorOS Workspace' : 'Dev Lab'}
          </Link>
          <span style={{ color:TEXT_M, fontSize:12 }}>›</span>
          <span style={{ fontSize:12, fontWeight:700, color:TEXT }}>{project?.name ?? projectId}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <RuntimeDot status={project?.status ?? 'SLEEPING'} />
          <span style={{ fontSize:12, color:TEXT_M }}>{project?.status ?? 'UNKNOWN'}</span>
          <span style={{ fontSize:11, fontWeight:700, color:TIER_COLOR[project?.qualityTier ?? 'EXPERIMENTAL'],
            background:`${TIER_COLOR[project?.qualityTier ?? 'EXPERIMENTAL']}18`,
            border:`1px solid ${TIER_COLOR[project?.qualityTier ?? 'EXPERIMENTAL']}30`,
            borderRadius:6, padding:'3px 10px' }}>
            {project?.qualityTier?.replace(/_/g,' ')}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Left sidebar */}
        <LeftSidebar workspaceId={workspaceId} projectId={projectId}
          activeSection="workspace" onSection={() => {}} project={project} />

        {/* Center + right */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Center + right panels */}
          <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
            {/* Center */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              {/* Center tab bar */}
              <div style={{ borderBottom:`1px solid ${BORDER}`, padding:'0 16px', display:'flex', flexShrink:0 }}>
                {CENTER_TABS.map(t => (
                  <button key={t.key} onClick={() => { setCenterTab(t.key); track('center_tab', {tab:t.key}); }}
                    style={tabBtnStyle(centerTab === t.key)}>{t.label}</button>
                ))}
              </div>
              {/* Center content */}
              <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
                {centerTab === 'preview'  && <PreviewCenter project={project} workspaceId={workspaceId} projectId={projectId} />}
                {centerTab === 'overview' && <OverviewCenter project={project} workspaceId={workspaceId} projectId={projectId} />}
                {centerTab === 'request'  && <ChangeRequestCenter workspaceId={workspaceId} projectId={projectId} />}
                {centerTab === 'editing'  && <GuidedEditingCenter workspaceId={workspaceId} projectId={projectId} />}
              </div>
            </div>
            {/* Right panel */}
            <div style={{ width:270, borderLeft:`1px solid ${BORDER}`, display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
              {/* Right tab bar */}
              <div style={{ borderBottom:`1px solid ${BORDER}`, padding:'0 4px', display:'flex', flexShrink:0 }}>
                {RIGHT_TABS.map(t => (
                  <button key={t.key} onClick={() => setRightTab(t.key)}
                    style={{ ...tabBtnStyle(rightTab === t.key), fontSize:12, padding:'8px 10px' }}>
                    {t.label}
                  </button>
                ))}
              </div>
              {/* Right panel content */}
              <div style={{ flex:1, overflow:'auto' }}>
                {rightTab === 'quality'  && <RightQualityPanel  projectId={projectId} />}
                {rightTab === 'memory'   && <RightMemoryPanel   workspaceId={workspaceId} />}
                {rightTab === 'snapshot' && <RightSnapshotPanel workspaceId={workspaceId} projectId={projectId} />}
                {rightTab === 'deploy'   && <RightDeployPanel   workspaceId={workspaceId} />}
              </div>
            </div>
          </div>
          {/* Bottom activity */}
          <BottomActivity workspaceId={workspaceId} open={bottomOpen} onToggle={() => setBottomOpen(o=>!o)} />
        </div>
      </div>
    </div>
  );
}
