'use client';
import React, { useContext, useState } from 'react';
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

const SEEDED_CREATORS = [
  { handle:'sarah_builds', display:'Sarah M.',   apps:8,  followers:2100, verified:true,  trustFlag:'VERIFIED', remixInfluence:284,  tier:'pro',  status:'active'    },
  { handle:'marc_dev',     display:'Marc T.',    apps:14, followers:4800, verified:true,  trustFlag:'VERIFIED', remixInfluence:1240, tier:'pro',  status:'active'    },
  { handle:'riya_creates', display:'Riya K.',    apps:11, followers:6200, verified:true,  trustFlag:'VERIFIED', remixInfluence:2100, tier:'pro',  status:'active'    },
  { handle:'lena_edu',     display:'Lena E.',    apps:6,  followers:1100, verified:false, trustFlag:'NONE',     remixInfluence:732,  tier:'free', status:'active'    },
  { handle:'kai_ops',      display:'Kai L.',     apps:4,  followers:1400, verified:false, trustFlag:'NONE',     remixInfluence:318,  tier:'free', status:'active'    },
  { handle:'founderhq',    display:'FounderHQ',  apps:3,  followers:3700, verified:true,  trustFlag:'VERIFIED', remixInfluence:943,  tier:'pro',  status:'active'    },
  { handle:'bad_actor',    display:'BadActor',   apps:1,  followers:12,   verified:false, trustFlag:'WARNED',   remixInfluence:12,   tier:'free', status:'suspended' },
  { handle:'devbot_42',    display:'DevBot 42',  apps:7,  followers:892,  verified:false, trustFlag:'NONE',     remixInfluence:892,  tier:'free', status:'active'    },
];

type CreatorRow = typeof SEEDED_CREATORS[0] & { _loading?: boolean; featured?: boolean };

const FLAG_COLORS: Record<string, string> = {
  VERIFIED: ACCENT_GN,
  WARNED:   ACCENT_A,
  BANNED:   ACCENT_R,
  NONE:     TEXT_M,
};

const AVATAR_COLORS: Record<string, string> = {
  VERIFIED: ACCENT_GN,
  WARNED:   ACCENT_A,
  BANNED:   ACCENT_R,
  NONE:     TEXT_D,
};

const TABS: { key: 'all'|'verified'|'warned'|'suspended'; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'verified',  label: 'Verified'  },
  { key: 'warned',    label: 'Warned'    },
  { key: 'suspended', label: 'Suspended' },
];

export default function CreatorsPage() {
  const adminKey = useContext(AdminKeyCtx);
  const headers  = { Authorization: `Bearer ${adminKey}` };

  const [creators, setCreators] = useState<CreatorRow[]>(SEEDED_CREATORS);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<'all'|'verified'|'warned'|'suspended'>('all');

  const mutate = (handle: string, patch: Partial<CreatorRow>) => {
    setCreators(prev => prev.map(c => c.handle === handle ? { ...c, ...patch } : c));
  };

  const setTrustFlag = (creator: CreatorRow, flag: string) => {
    mutate(creator.handle, { trustFlag: flag, verified: flag === 'VERIFIED', _loading: true });
    track('creator_verification', { action: flag.toLowerCase(), handle: creator.handle });
    fetch(`${API_BASE}/v1/admin/creators/${creator.handle}/trust`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag }),
    }).finally(() => mutate(creator.handle, { _loading: false }));
  };

  const toggleSuspend = (creator: CreatorRow) => {
    const next = creator.status === 'active' ? 'suspended' : 'active';
    mutate(creator.handle, { status: next, _loading: true });
    track('creator_verification', { action: next === 'suspended' ? 'suspend' : 'restore', handle: creator.handle });
    fetch(`${API_BASE}/v1/admin/creators/${creator.handle}/status`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    }).finally(() => mutate(creator.handle, { _loading: false }));
  };

  const toggleFeature = (creator: CreatorRow) => {
    const next = !creator.featured;
    mutate(creator.handle, { featured: next, _loading: true });
    track('creator_verification', { action: next ? 'feature' : 'unfeature', handle: creator.handle });
    fetch(`${API_BASE}/v1/admin/creators/${creator.handle}/feature`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: next }),
    }).finally(() => mutate(creator.handle, { _loading: false }));
  };

  const visible = creators.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.display.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all'       ? true :
      filter === 'verified'  ? c.trustFlag === 'VERIFIED' :
      filter === 'warned'    ? c.trustFlag === 'WARNED' :
      filter === 'suspended' ? c.status === 'suspended' : true;
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>Creator Operations</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: TEXT_M }}>Verify, suspend, warn, and feature creators on the platform.</p>
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
          placeholder="Search creator or @handle…"
          style={{
            flex: 1, minWidth: 200, padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            borderRadius: 8, color: TEXT, fontSize: 13, outline: 'none',
          }}
        />
        <span style={{ fontSize: 12, color: TEXT_M }}>{visible.length} creator{visible.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Creator list */}
      {visible.length === 0 ? (
        <div style={{ ...GLASS, padding: '48px 24px', textAlign: 'center', color: TEXT_M, fontSize: 14 }}>
          No creators match your filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map(creator => {
            const isSuspended = creator.status === 'suspended';
            const isWarned    = creator.trustFlag === 'WARNED';
            const rowBorder   = isSuspended ? `4px solid ${ACCENT_R}` : isWarned ? `4px solid ${ACCENT_A}` : `4px solid transparent`;
            const avatarColor = AVATAR_COLORS[creator.trustFlag] ?? TEXT_D;
            const flagColor   = FLAG_COLORS[creator.trustFlag]   ?? TEXT_M;

            return (
              <div key={creator.handle} style={{
                ...GLASS, display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', flexWrap: 'wrap',
                borderLeft: rowBorder,
                opacity: isSuspended ? 0.55 : 1,
                transition: 'opacity 0.2s',
              }}>
                {/* Avatar + identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 180px', minWidth: 160 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: `${avatarColor}22`, border: `2px solid ${avatarColor}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: avatarColor,
                  }}>
                    {creator.display[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{creator.display}</div>
                    <div style={{ fontSize: 12, color: TEXT_M }}>@{creator.handle}</div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
                      {/* Tier badge */}
                      <span style={{
                        padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: creator.tier === 'pro' ? `${ACCENT}18` : 'rgba(255,255,255,0.05)',
                        color: creator.tier === 'pro' ? ACCENT : TEXT_M,
                        border: `1px solid ${creator.tier === 'pro' ? ACCENT + '30' : BORDER}`,
                        textTransform: 'uppercase' as const,
                      }}>{creator.tier}</span>
                      {/* Trust flag badge */}
                      <span style={{
                        padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: `${flagColor}18`, color: flagColor,
                        border: `1px solid ${flagColor}30`,
                      }}>{creator.trustFlag}</span>
                    </div>
                  </div>
                </div>

                {/* Stats + status */}
                <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: TEXT_M, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span>📦 {creator.apps} apps</span>
                    <span>👥 {creator.followers.toLocaleString()}</span>
                    <span>🔀 {creator.remixInfluence.toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: isSuspended ? ACCENT_R : ACCENT_GN,
                      display: 'inline-block',
                      boxShadow: isSuspended ? `0 0 5px ${ACCENT_R}` : `0 0 5px ${ACCENT_GN}`,
                    }} />
                    <span style={{ fontSize: 11, color: isSuspended ? ACCENT_R : ACCENT_GN, fontWeight: 600, textTransform: 'capitalize' as const }}>
                      {creator.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {creator.trustFlag !== 'VERIFIED' && (
                    <button
                      disabled={!!creator._loading}
                      onClick={() => setTrustFlag(creator, 'VERIFIED')}
                      style={btnStyle(ACCENT_GN, !!creator._loading)}
                    >Verify</button>
                  )}

                  {creator.trustFlag !== 'WARNED' && creator.trustFlag !== 'BANNED' && (
                    <button
                      disabled={!!creator._loading}
                      onClick={() => setTrustFlag(creator, 'WARNED')}
                      style={btnStyle(ACCENT_A, !!creator._loading)}
                    >Warn</button>
                  )}

                  <button
                    disabled={!!creator._loading}
                    onClick={() => toggleSuspend(creator)}
                    style={btnStyle(isSuspended ? ACCENT_GN : ACCENT_R, !!creator._loading)}
                  >{isSuspended ? 'Restore' : 'Suspend'}</button>

                  <button
                    disabled={!!creator._loading}
                    onClick={() => toggleFeature(creator)}
                    style={btnStyle(creator.featured ? ACCENT_A : TEXT_M, !!creator._loading)}
                  >{creator.featured ? 'Unfeature' : 'Feature'}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
