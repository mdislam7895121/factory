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

const SEEDED_APPS = [
  { id:'1', name:'MediBook Pro',   creator:'sarah_builds', category:'Healthcare', likes:284,  remixes:12,  views:4821,  featured:false, hidden:false, modStatus:'APPROVED', guarded:true  },
  { id:'2', name:'ShopForge',      creator:'marc_dev',     category:'E-Commerce', likes:1240, remixes:89,  views:18400, featured:true,  hidden:false, modStatus:'APPROVED', guarded:false },
  { id:'3', name:'FinancePulse',   creator:'jaya_k',       category:'Finance',    likes:456,  remixes:31,  views:7200,  featured:false, hidden:false, modStatus:'APPROVED', guarded:true  },
  { id:'4', name:'TutorAI',        creator:'lena_edu',     category:'Education',  likes:732,  remixes:47,  views:11200, featured:false, hidden:false, modStatus:'PENDING',  guarded:false },
  { id:'5', name:'RouteIQ',        creator:'kai_ops',      category:'Logistics',  likes:318,  remixes:22,  views:5100,  featured:false, hidden:false, modStatus:'APPROVED', guarded:false },
  { id:'6', name:'CreatorOS',      creator:'riya_creates', category:'SaaS',       likes:2100, remixes:104, views:31000, featured:true,  hidden:false, modStatus:'APPROVED', guarded:false },
  { id:'7', name:'AgentFlow',      creator:'devbot_42',    category:'SaaS',       likes:892,  remixes:67,  views:14200, featured:false, hidden:false, modStatus:'APPROVED', guarded:false },
  { id:'8', name:'ReportedApp',    creator:'bad_actor',    category:'Social',     likes:12,   remixes:1,   views:200,   featured:false, hidden:false, modStatus:'FLAGGED',  guarded:false },
];

type AppRow = typeof SEEDED_APPS[0] & { _loading?: boolean };

const MOD_COLORS: Record<string, string> = {
  APPROVED: ACCENT_GN,
  PENDING:  ACCENT_A,
  FLAGGED:  ACCENT_R,
  HIDDEN:   TEXT_M,
};

const TABS: { key: 'all'|'featured'|'hidden'|'flagged'; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'featured', label: 'Featured' },
  { key: 'hidden',   label: 'Hidden'   },
  { key: 'flagged',  label: 'Flagged'  },
];

export default function DiscoveryPage() {
  const adminKey = useContext(AdminKeyCtx);
  const headers  = { Authorization: `Bearer ${adminKey}` };

  const [apps, setApps]     = useState<AppRow[]>(SEEDED_APPS);
  const [filter, setFilter] = useState<'all'|'featured'|'hidden'|'flagged'>('all');
  const [search, setSearch] = useState('');

  const mutate = useCallback((id: string, patch: Partial<AppRow>) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  }, []);

  const toggleFeature = useCallback((app: AppRow) => {
    const next = !app.featured;
    mutate(app.id, { featured: next, _loading: true });
    track('moderation_action', { action: next ? 'feature' : 'unfeature', appId: app.id });
    fetch(`${API_BASE}/v1/admin/apps/${app.id}/feature`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: next }),
    }).finally(() => mutate(app.id, { _loading: false }));
  }, [headers, mutate]);

  const toggleHide = useCallback((app: AppRow) => {
    const next = !app.hidden;
    mutate(app.id, { hidden: next, modStatus: next ? 'HIDDEN' : 'APPROVED', _loading: true });
    track('moderation_action', { action: next ? 'hide' : 'unhide', appId: app.id });
    fetch(`${API_BASE}/v1/admin/apps/${app.id}/hide`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: next }),
    }).finally(() => mutate(app.id, { _loading: false }));
  }, [headers, mutate]);

  const approveApp = useCallback((app: AppRow) => {
    mutate(app.id, { modStatus: 'APPROVED', _loading: true });
    track('moderation_action', { action: 'approve', appId: app.id });
    fetch(`${API_BASE}/v1/admin/apps/${app.id}/moderation`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    }).finally(() => mutate(app.id, { _loading: false }));
  }, [headers, mutate]);

  const visible = apps.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.creator.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'featured' ? a.featured :
      filter === 'hidden'   ? a.hidden :
      filter === 'flagged'  ? a.modStatus === 'FLAGGED' : true;
    return matchSearch && matchFilter;
  });

  const btnStyle = (color: string, disabled?: boolean): React.CSSProperties => ({
    padding: '4px 10px', borderRadius: 6, border: `1px solid ${color}40`,
    background: `${color}14`, color, fontSize: 11, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>Discovery Moderation</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: TEXT_M }}>Feature, hide, and moderate apps in the discovery feed.</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 2, ...GLASS, padding: '4px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: filter === t.key ? ACCENT : 'transparent',
              color: filter === t.key ? '#fff' : TEXT_M,
              borderBottom: filter === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name or creator…"
          style={{
            flex: 1, minWidth: 200, padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            borderRadius: 8, color: TEXT, fontSize: 13, outline: 'none',
          }}
        />
        <span style={{ fontSize: 12, color: TEXT_M }}>{visible.length} app{visible.length !== 1 ? 's' : ''}</span>
      </div>

      {/* App list */}
      {visible.length === 0 ? (
        <div style={{ ...GLASS, padding: '48px 24px', textAlign: 'center', color: TEXT_M, fontSize: 14 }}>
          No apps match your filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map(app => {
            const isFlagged  = app.modStatus === 'FLAGGED';
            const isHidden   = app.hidden;
            const rowBorder  = isFlagged ? `4px solid ${ACCENT_R}` : isHidden ? `4px solid ${TEXT_D}` : `4px solid transparent`;

            return (
              <div key={app.id} style={{
                ...GLASS, display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', flexWrap: 'wrap',
                borderLeft: rowBorder,
                opacity: isHidden ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}>
                {/* Identity */}
                <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{app.name}</span>
                    {app.guarded && <span title="Regulated / Guarded">⚖️</span>}
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_M, marginTop: 2 }}>@{app.creator}</div>
                  <span style={{
                    display: 'inline-block', marginTop: 4, padding: '2px 7px', borderRadius: 4,
                    background: 'rgba(99,102,241,0.12)', border: `1px solid rgba(99,102,241,0.2)`,
                    fontSize: 10, fontWeight: 600, color: ACCENT, letterSpacing: '0.04em',
                  }}>{app.category}</span>
                </div>

                {/* Stats + status */}
                <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                  <div style={{ fontSize: 12, color: TEXT_M, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>❤️ {app.likes.toLocaleString()}</span>
                    <span>🔀 {app.remixes}</span>
                    <span>👁 {app.views.toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: `${MOD_COLORS[app.modStatus] ?? TEXT_M}18`,
                      color: MOD_COLORS[app.modStatus] ?? TEXT_M,
                      border: `1px solid ${MOD_COLORS[app.modStatus] ?? TEXT_M}30`,
                    }}>{app.modStatus}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    disabled={!!app._loading}
                    onClick={() => toggleFeature(app)}
                    style={btnStyle(app.featured ? ACCENT_A : ACCENT, !!app._loading)}
                  >{app.featured ? 'Unfeature' : 'Feature'}</button>

                  <button
                    disabled={!!app._loading}
                    onClick={() => toggleHide(app)}
                    style={btnStyle(isHidden ? ACCENT_GN : ACCENT_R, !!app._loading)}
                  >{isHidden ? 'Unhide' : 'Hide'}</button>

                  {isFlagged && (
                    <button
                      disabled={!!app._loading}
                      onClick={() => approveApp(app)}
                      style={btnStyle(ACCENT_GN, !!app._loading)}
                    >Approve</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
