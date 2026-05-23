'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { ActivationChecklist } from '@/components/ActivationChecklist';

const API_BASE = process.env.NEXT_PUBLIC_PROD_API_BASE ?? '';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};
const FONT = "'Geist','Inter',system-ui,sans-serif";

const STATUS_COLORS: Record<string, string> = {
  RUNNING:  '#10b981',
  SLEEPING: '#f59e0b',
  CRASHED:  '#ef4444',
};

const TIER_COLORS: Record<string, string> = {
  PRODUCTION_READY: '#10b981',
  BETA_READY:       '#6366f1',
  PREVIEW_READY:    '#f59e0b',
  EXPERIMENTAL:     '#ef4444',
};

function fmt(iso: string): string {
  try {
    const d = new Date(iso);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

type Project = {
  id: string;
  name: string;
  status: string;
  score: number;
  tier: string;
  category: string;
};

type Workspace = {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  updatedAt: string;
  projects: Project[];
};

const SEEDED: Workspace[] = [
  {
    id: 'ws-founder-1',
    name: 'CreatorOS Workspace',
    description: 'Main workspace',
    projectCount: 2,
    updatedAt: '2025-05-22T08:00:00Z',
    projects: [
      { id: 'proj-creator-os', name: 'CreatorOS',    status: 'RUNNING',  score: 92, tier: 'PRODUCTION_READY', category: 'SaaS' },
      { id: 'proj-medibook',   name: 'MediBook Pro', status: 'SLEEPING', score: 87, tier: 'PRODUCTION_READY', category: 'Healthcare' },
    ],
  },
  {
    id: 'ws-dev-1',
    name: 'Dev Lab',
    description: 'Experimental R&D',
    projectCount: 2,
    updatedAt: '2025-05-21T14:00:00Z',
    projects: [
      { id: 'proj-shopforge', name: 'ShopForge', status: 'RUNNING',  score: 73, tier: 'BETA_READY',    category: 'E-Commerce' },
      { id: 'proj-tutor-ai',  name: 'TutorAI',   status: 'SLEEPING', score: 38, tier: 'EXPERIMENTAL', category: 'Education' },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? TEXT_M;
  const isRunning = status === 'RUNNING';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10, flexShrink: 0 }}>
      {isRunning && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.35,
          animation: 'ws-pulse 1.8s ease-in-out infinite',
        }} />
      )}
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'block', position: 'relative' }} />
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const color = TIER_COLORS[tier] ?? TEXT_M;
  const label = tier.replace(/_/g, ' ');
  return (
    <span style={{
      background: `${color}22`, color, fontSize: 10, fontWeight: 700,
      padding: '2px 7px', borderRadius: 99, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function ProjectChip({ project, wsId }: { project: Project; wsId: string }) {
  const scoreColor = project.score >= 80 ? '#10b981' : project.score >= 60 ? ACCENT : project.score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
      borderRadius: 8, padding: '7px 12px', minWidth: 200, maxWidth: 280,
    }}>
      <StatusDot status={project.status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
          <span style={{ color: scoreColor, fontSize: 11, fontWeight: 700 }}>{project.score}</span>
          <TierBadge tier={project.tier} />
          <span style={{ color: TEXT_M, fontSize: 11 }}>{project.category}</span>
        </div>
      </div>
      <Link
        href={`/workspace/${wsId}/project/${project.id}`}
        onClick={() => track('open_project', { wsId, projectId: project.id })}
        style={{
          flexShrink: 0, fontSize: 11, fontWeight: 600, color: ACCENT,
          background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`,
          borderRadius: 6, padding: '3px 8px', textDecoration: 'none',
          whiteSpace: 'nowrap', transition: 'background 0.15s',
        }}
      >
        Open
      </Link>
    </div>
  );
}

function WorkspaceCard({ ws }: { ws: Workspace }) {
  return (
    <div style={{ ...GLASS, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>{ws.name}</span>
            <span style={{ fontSize: 11, color: TEXT_M }}>Updated {fmt(ws.updatedAt)}</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: TEXT_M }}>{ws.description}</p>
        </div>
        <Link
          href={`/workspace/${ws.id}`}
          onClick={() => track('open_workspace', { wsId: ws.id })}
          style={{
            flexShrink: 0, fontSize: 13, fontWeight: 600, color: '#fff',
            background: ACCENT, border: 'none', borderRadius: 8,
            padding: '8px 18px', textDecoration: 'none', cursor: 'pointer',
            transition: 'opacity 0.15s', display: 'inline-block',
          }}
        >
          Open Workspace
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: BORDER }} />

      {/* Projects */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_M, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Projects ({ws.projects.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {ws.projects.map(p => (
            <ProjectChip key={p.id} project={p} wsId={ws.id} />
          ))}
          {ws.projects.length === 0 && (
            <span style={{ fontSize: 13, color: TEXT_M }}>No projects yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateForm({ onSave, onCancel }: {
  onSave: (ws: Workspace) => void;
  onCancel: () => void;
}) {
  const [name, setName]   = useState('');
  const [desc, setDesc]   = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr]     = useState('');

  const save = async () => {
    if (!name.trim()) { setErr('Name is required'); return; }
    setSaving(true);
    setErr('');
    track('create_workspace_attempt', { name });
    try {
      const r = await fetch(`${API_BASE}/v1/workspace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: desc.trim() }),
      });
      if (r.ok) {
        const d = await r.json();
        const ws: Workspace = {
          id:           d.id ?? `ws-local-${Date.now()}`,
          name:         d.name ?? name.trim(),
          description:  d.description ?? desc.trim(),
          projectCount: 0,
          updatedAt:    d.updatedAt ?? new Date().toISOString(),
          projects:     [],
        };
        track('create_workspace_success', { wsId: ws.id });
        onSave(ws);
        return;
      }
    } catch {
      // fall through to local
    }
    // Local fallback
    const ws: Workspace = {
      id:           `ws-local-${Date.now()}`,
      name:         name.trim(),
      description:  desc.trim(),
      projectCount: 0,
      updatedAt:    new Date().toISOString(),
      projects:     [],
    };
    track('create_workspace_local', { wsId: ws.id });
    onSave(ws);
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
    borderRadius: 8, padding: '9px 14px', fontSize: 14, color: TEXT,
    outline: 'none', fontFamily: FONT,
  };

  return (
    <div style={{ ...GLASS, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>New Workspace</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Name</label>
        <input
          style={inputStyle}
          placeholder="My Workspace"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={saving}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>Description</label>
        <input
          style={inputStyle}
          placeholder="Optional description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          disabled={saving}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
      </div>
      {err && <div style={{ fontSize: 12, color: '#ef4444' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            background: 'rgba(255,255,255,0.06)', color: TEXT_M,
            border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saving ? 'rgba(99,102,241,0.5)' : ACCENT, color: '#fff',
            border: 'none', borderRadius: 8,
            padding: '8px 22px', fontSize: 13, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    track('workspace_opened');
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/v1/workspace`);
        if (r.ok) {
          const d = await r.json();
          const list: Workspace[] = Array.isArray(d) ? d : (d.workspaces ?? []);
          if (list.length > 0) {
            setWorkspaces(list);
            track('workspaces_loaded', { count: list.length, source: 'api' });
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to seed
      }
      track('workspaces_loaded', { count: SEEDED.length, source: 'seed' });
      setWorkspaces(SEEDED);
      setLoading(false);
    })();
  }, []);

  const totalProjects  = workspaces.reduce((a, w) => a + w.projects.length, 0);
  const runningProjects = workspaces.reduce(
    (a, w) => a + w.projects.filter(p => p.status === 'RUNNING').length, 0,
  );

  const handleSave = (ws: Workspace) => {
    setWorkspaces(prev => [ws, ...prev]);
    setShowCreate(false);
  };

  return (
    <>
      <style>{`
        @keyframes ws-pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50%       { transform: scale(2.2); opacity: 0; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, color: TEXT, padding: '0 0 60px' }}>

        {/* Top bar */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT_M }}>
              <Link href="/" style={{ color: TEXT_M, textDecoration: 'none', fontWeight: 600 }}>Factory</Link>
              <span style={{ color: BORDER, userSelect: 'none' }}>/</span>
              <span style={{ color: TEXT, fontWeight: 600 }}>Workspace</span>
            </nav>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 0' }}>

          {/* Page heading + Create button */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px' }}>
                Your Workspaces
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: TEXT_M }}>
                Manage your AI-generated projects
              </p>
            </div>
            <button
              onClick={() => { setShowCreate(v => !v); track('toggle_create_form', { open: !showCreate }); }}
              style={{
                flexShrink: 0, background: showCreate ? 'rgba(255,255,255,0.06)' : ACCENT,
                color: showCreate ? TEXT_M : '#fff',
                border: showCreate ? `1px solid ${BORDER}` : 'none',
                borderRadius: 9, padding: '9px 20px', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              {showCreate ? 'Cancel' : '+ Create Workspace'}
            </button>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Workspaces', value: workspaces.length },
              { label: 'Total Projects',   value: totalProjects },
              { label: 'Running Projects', value: runningProjects },
            ].map(stat => (
              <div key={stat.label} style={{ ...GLASS, padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>{stat.value}</span>
                <span style={{ fontSize: 12, color: TEXT_M, fontWeight: 600 }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Inline create form */}
          {showCreate && (
            <div style={{ marginBottom: 24 }}>
              <CreateForm onSave={handleSave} onCancel={() => setShowCreate(false)} />
            </div>
          )}

          {/* Workspace list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: TEXT_M, fontSize: 14 }}>
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div style={{ ...GLASS, padding: '48px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: TEXT_M, marginBottom: 12 }}>No workspaces yet.</div>
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  background: ACCENT, color: '#fff', border: 'none',
                  borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Create your first workspace
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {workspaces.map(ws => (
                <WorkspaceCard key={ws.id} ws={ws} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 64, fontSize: 12, color: TEXT_M }}>
          Generated with Factory ✦
        </div>
      </div>
      <FeedbackWidget route="/workspace" />
      <ActivationChecklist />
    </>
  );
}
