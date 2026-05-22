'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_BASE  = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';
const BG        = '#030712';
const SURFACE   = 'rgba(10,22,40,0.82)';
const ACCENT    = '#6366f1';
const ACCENT_G  = '#10b981';
const ACCENT_A  = '#f59e0b';
const ACCENT_R  = '#ef4444';
const ACCENT_P  = '#a855f7';
const TEXT      = '#f1f5f9';
const TEXT_M    = '#64748b';
const BORDER    = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};
const FONT = "'Geist', 'Inter', system-ui, sans-serif";

function track(event: string, meta?: Record<string, unknown>) {
  console.debug('[factory:workspace]', { event, ts: Date.now(), ...meta });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectData = {
  id: string;
  name: string;
  status: string;
  score: number;
  tier: string;
  stack: string[];
  category: string;
  lastDeploy: string;
};

type DeploymentData = {
  platform: string;
  status: string;
  branch: string;
  createdAt: string;
};

type ActivityData = {
  type: string;
  severity: string;
  message: string;
  timestamp: string;
};

type WorkspaceData = {
  name: string;
  description: string;
  projects: ProjectData[];
  deployments: DeploymentData[];
  recentActivity: ActivityData[];
};

// ---------------------------------------------------------------------------
// Seeded data
// ---------------------------------------------------------------------------

const SEEDED_WS: Record<string, WorkspaceData> = {
  'ws-founder-1': {
    name: 'CreatorOS Workspace',
    description: 'Main workspace for CreatorOS and MediBook projects',
    projects: [
      { id: 'proj-creator-os', name: 'CreatorOS',    status: 'RUNNING',  score: 92, tier: 'PRODUCTION_READY', stack: ['Next.js', 'NestJS', 'PostgreSQL'], category: 'SaaS',       lastDeploy: '2025-05-22T09:00:00Z' },
      { id: 'proj-medibook',   name: 'MediBook Pro', status: 'SLEEPING', score: 87, tier: 'PRODUCTION_READY', stack: ['React', 'Express', 'MongoDB'],      category: 'Healthcare', lastDeploy: '2025-05-21T16:00:00Z' },
    ],
    deployments: [
      { platform: 'RAILWAY', status: 'SUCCESS', branch: 'main',            createdAt: '2025-05-22T09:00:00Z' },
      { platform: 'NETLIFY', status: 'SUCCESS', branch: 'main',            createdAt: '2025-05-22T09:00:00Z' },
    ],
    recentActivity: [
      { type: 'BUILD',   severity: 'SUCCESS', message: 'Build completed — 18 pages',     timestamp: '2025-05-22T09:05:00Z' },
      { type: 'DEPLOY',  severity: 'SUCCESS', message: 'Deploy to Railway succeeded',    timestamp: '2025-05-22T09:06:00Z' },
      { type: 'QUALITY', severity: 'INFO',    message: 'Quality score: 92/100',          timestamp: '2025-05-22T09:07:00Z' },
    ],
  },
  'ws-dev-1': {
    name: 'Dev Lab',
    description: 'Experimental projects and R&D',
    projects: [
      { id: 'proj-shopforge', name: 'ShopForge', status: 'RUNNING',  score: 73, tier: 'BETA_READY',     stack: ['Next.js', 'Stripe', 'PostgreSQL'], category: 'E-Commerce', lastDeploy: '2025-05-20T11:00:00Z' },
      { id: 'proj-tutor-ai',  name: 'TutorAI',   status: 'SLEEPING', score: 38, tier: 'EXPERIMENTAL',   stack: ['React', 'OpenAI', 'FastAPI'],      category: 'Education',  lastDeploy: '2025-05-18T10:00:00Z' },
    ],
    deployments: [
      { platform: 'RAILWAY', status: 'SUCCESS', branch: 'main',              createdAt: '2025-05-20T11:00:00Z' },
      { platform: 'NETLIFY', status: 'FAILED',  branch: 'feature/checkout',  createdAt: '2025-05-19T14:00:00Z' },
    ],
    recentActivity: [
      { type: 'BUILD',  severity: 'WARN',  message: 'Build with warnings — check mobile CSS', timestamp: '2025-05-20T11:01:00Z' },
      { type: 'DEPLOY', severity: 'ERROR', message: 'Deploy to Netlify failed',               timestamp: '2025-05-19T14:01:00Z' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function tierColor(tier: string): string {
  if (tier === 'PRODUCTION_READY') return ACCENT_G;
  if (tier === 'BETA_READY')       return ACCENT_P;
  if (tier === 'PREVIEW_READY')    return ACCENT_A;
  return ACCENT_R;
}

function scoreColor(score: number): string {
  if (score >= 85) return ACCENT_G;
  if (score >= 70) return ACCENT_P;
  if (score >= 50) return ACCENT_A;
  return ACCENT_R;
}

function severityColor(severity: string): string {
  if (severity === 'SUCCESS') return ACCENT_G;
  if (severity === 'INFO')    return ACCENT;
  if (severity === 'WARN')    return ACCENT_A;
  if (severity === 'ERROR')   return ACCENT_R;
  return TEXT_M;
}

function deployStatusColor(status: string): string {
  if (status === 'SUCCESS') return ACCENT_G;
  if (status === 'FAILED')  return ACCENT_R;
  if (status === 'PENDING') return ACCENT_A;
  return TEXT_M;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TierBadge({ tier }: { tier: string }) {
  const color = tierColor(tier);
  const label = tier.replace(/_/g, ' ');
  return (
    <span style={{ background: `${color}22`, color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span style={{ background: `${ACCENT}18`, color: ACCENT, fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 99 }}>
      {category}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const isRunning = status === 'RUNNING';
  const color = isRunning ? ACCENT_G : TEXT_M;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: isRunning ? `0 0 6px ${ACCENT_G}` : 'none' }} />
      <span style={{ color, fontSize: 12, fontWeight: 600 }}>{status}</span>
    </span>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={54} height={54} style={{ flexShrink: 0 }}>
      <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5} />
      <circle cx={27} cy={27} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 27 27)" />
      <text x={27} y={32} textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>{score}</text>
    </svg>
  );
}

function ProjectCard({ project, workspaceId }: { project: ProjectData; workspaceId: string }) {
  return (
    <div style={{ ...GLASS, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <ScoreCircle score={project.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 16 }}>{project.name}</span>
            <CategoryBadge category={project.category} />
          </div>
          <TierBadge tier={project.tier} />
        </div>
      </div>

      {/* Stack chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {project.stack.map((tech) => (
          <span key={tech} style={{ background: 'rgba(255,255,255,0.05)', color: TEXT_M, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, border: `1px solid ${BORDER}` }}>
            {tech}
          </span>
        ))}
      </div>

      {/* Status + last deploy */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <StatusDot status={project.status} />
        <span style={{ color: TEXT_M, fontSize: 12 }}>Deployed {relativeTime(project.lastDeploy)}</span>
      </div>

      {/* Open button */}
      <Link
        href={`/workspace/${workspaceId}/project/${project.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          background: ACCENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          padding: '9px 0',
          borderRadius: 8,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
        onClick={() => track('project_open', { workspaceId, projectId: project.id })}
      >
        Open Project
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === 'string' ? params.workspaceId : '';

  const [data, setData]       = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!workspaceId) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      track('workspace_load', { workspaceId });

      try {
        const [wsRes, projRes] = await Promise.all([
          fetch(`${API_BASE}/v1/workspace/${encodeURIComponent(workspaceId)}`),
          fetch(`${API_BASE}/v1/workspace/${encodeURIComponent(workspaceId)}/projects`),
        ]);

        if (!wsRes.ok || !projRes.ok) throw new Error(`API error ${wsRes.status}`);

        const wsJson   = await wsRes.json();
        const projJson = await projRes.json();

        if (!cancelled) {
          setData({
            name:           wsJson.name           ?? wsJson.workspace?.name           ?? '',
            description:    wsJson.description    ?? wsJson.workspace?.description    ?? '',
            projects:       projJson.projects      ?? wsJson.projects                  ?? [],
            deployments:    wsJson.deployments     ?? [],
            recentActivity: wsJson.recentActivity  ?? [],
          });
          track('workspace_loaded', { workspaceId });
        }
      } catch (err) {
        if (!cancelled) {
          const seed = SEEDED_WS[workspaceId];
          if (seed) {
            setData(seed);
            track('workspace_seeded', { workspaceId });
          } else {
            setError(`Could not load workspace: ${String(err)}`);
            track('workspace_error', { workspaceId, error: String(err) });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
  }, [workspaceId]);

  // ---------------------------------------------------------------------------
  // Derived stats
  // ---------------------------------------------------------------------------

  const projects     = data?.projects     ?? [];
  const deployments  = data?.deployments  ?? [];
  const activity     = data?.recentActivity ?? [];

  const runningCount = projects.filter((p) => p.status === 'RUNNING').length;
  const avgScore     = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length)
    : 0;
  const lastDeploy   = deployments.length > 0
    ? relativeTime(deployments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt)
    : '—';

  const stats = [
    { label: 'Total Projects',  value: projects.length },
    { label: 'Running',         value: runningCount },
    { label: 'Avg Quality',     value: projects.length > 0 ? `${avgScore}/100` : '—' },
    { label: 'Last Deploy',     value: lastDeploy },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: FONT }}>

      {/* ---- Nav / breadcrumb ---- */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, ...GLASS, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/"          style={{ color: TEXT_M, textDecoration: 'none', fontSize: 14 }}>Factory</Link>
          <span style={{ color: BORDER, fontSize: 14 }}>/</span>
          <Link href="/workspace" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 14 }}>Workspace</Link>
          <span style={{ color: BORDER, fontSize: 14 }}>/</span>
          <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{data?.name ?? workspaceId}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ---- Back link ---- */}
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/workspace"
            style={{ color: TEXT_M, textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => track('workspace_back', { workspaceId })}
          >
            &larr; Back to Workspaces
          </Link>
        </div>

        {/* ---- Header ---- */}
        {loading ? (
          <div style={{ color: TEXT_M, fontSize: 15, marginBottom: 32 }}>Loading workspace...</div>
        ) : error ? (
          <div style={{ background: `${ACCENT_R}18`, border: `1px solid ${ACCENT_R}44`, borderRadius: 10, padding: '12px 18px', color: ACCENT_R, fontSize: 14, marginBottom: 32 }}>
            {error}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: TEXT }}>{data?.name}</h1>
                {data?.description && (
                  <p style={{ margin: '6px 0 0', color: TEXT_M, fontSize: 15 }}>{data.description}</p>
                )}
              </div>
              <Link
                href={`/workspace/${workspaceId}/team`}
                onClick={() => track('team_settings_open', { workspaceId })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 8, color: '#818cf8', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                👥 Team Settings
              </Link>
            </div>

            {/* ---- Stats bar ---- */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ ...GLASS, flex: '1 1 140px', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: TEXT_M, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ color: TEXT, fontSize: 24, fontWeight: 800 }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* ---- Projects section ---- */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: TEXT }}>Projects</h2>
              {projects.length === 0 ? (
                <div style={{ ...GLASS, padding: 24, textAlign: 'center', color: TEXT_M, fontSize: 14 }}>
                  No projects in this workspace yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} workspaceId={workspaceId} />
                  ))}
                </div>
              )}
            </section>

            {/* ---- Deployments section ---- */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: TEXT }}>Deployments</h2>
              {deployments.length === 0 ? (
                <div style={{ ...GLASS, padding: 20, color: TEXT_M, fontSize: 14 }}>No deployments recorded.</div>
              ) : (
                <div style={{ ...GLASS, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Platform', 'Status', 'Branch', 'Time'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', color: TEXT_M, fontWeight: 600, padding: '12px 18px', borderBottom: `1px solid ${BORDER}` }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {deployments.map((dep, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                          <td style={{ padding: '11px 18px', color: TEXT, fontWeight: 600 }}>{dep.platform}</td>
                          <td style={{ padding: '11px 18px' }}>
                            <span style={{
                              background: `${deployStatusColor(dep.status)}22`,
                              color: deployStatusColor(dep.status),
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 9px',
                              borderRadius: 99,
                            }}>
                              {dep.status}
                            </span>
                          </td>
                          <td style={{ padding: '11px 18px', color: TEXT_M, fontFamily: 'monospace', fontSize: 12 }}>{dep.branch}</td>
                          <td style={{ padding: '11px 18px', color: TEXT_M }}>{relativeTime(dep.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ---- Recent Activity section ---- */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: TEXT }}>Recent Activity</h2>
              {activity.length === 0 ? (
                <div style={{ ...GLASS, padding: 20, color: TEXT_M, fontSize: 14 }}>No recent activity.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activity.map((event, i) => {
                    const color = severityColor(event.severity);
                    return (
                      <div key={i} style={{ ...GLASS, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block', boxShadow: `0 0 5px ${color}88` }} />
                        <span style={{ flex: 1, color: TEXT, fontSize: 14 }}>{event.message}</span>
                        <span style={{ color: TEXT_M, fontSize: 12, flexShrink: 0 }}>{relativeTime(event.timestamp)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ---- Footer ---- */}
      <div style={{ textAlign: 'center', padding: '16px 0 28px', color: TEXT_M, fontSize: 13 }}>
        Generated with Factory ✦
      </div>
    </div>
  );
}
