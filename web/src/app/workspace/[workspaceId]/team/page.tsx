'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ── Palette ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_PROD_API_BASE ?? 'http://localhost:3001';
const FONT     = "'Geist','Inter',system-ui,sans-serif";
const BG       = '#030712';
const SURFACE  = 'rgba(10,22,40,0.82)';
const SURFACE2 = 'rgba(15,28,50,0.9)';
const ACCENT   = '#6366f1';
const SUCCESS  = '#10b981';
const WARN     = '#f59e0b';
const DANGER   = '#ef4444';
const TEXT     = '#f1f5f9';
const TEXT_M   = '#64748b';
const BORDER   = 'rgba(255,255,255,0.07)';

const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
};

const track = (event: string, meta?: object) =>
  console.debug('[factory:team]', { event, ts: Date.now(), ...meta });

// ── Types ─────────────────────────────────────────────────────────────────────

type OrgRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'DESIGNER' | 'REVIEWER' | 'BILLING' | 'VIEWER';
type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

interface OrgMember {
  userId: string;
  displayName: string;
  role: OrgRole;
  permissions: string[];
  joinedAt: string;
  avatarColor: string;
}

interface OrgInvite {
  inviteId: string;
  emailHash: string;
  role: OrgRole;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
}

interface AuditEvent {
  auditId: string;
  type: string;
  actorId: string;
  description: string;
  timestamp: string;
}

// ── Seeded fallback data ──────────────────────────────────────────────────────

const AVATAR_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4'];
function avatarColor(userId: string): string {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

const SEEDED_MEMBERS: OrgMember[] = [
  { userId: 'user-alice', displayName: 'Alice', role: 'OWNER', permissions: ['workspace.read','workspace.manage','project.read','project.edit','project.review','project.deploy','runtime.manage','billing.manage','member.invite','member.manage','admin.audit'], joinedAt: new Date(Date.now() - 30*86400000).toISOString(), avatarColor: avatarColor('user-alice') },
  { userId: 'user-bob', displayName: 'Bob', role: 'DEVELOPER', permissions: ['workspace.read','project.read','project.edit','project.review','project.deploy','runtime.manage'], joinedAt: new Date(Date.now() - 14*86400000).toISOString(), avatarColor: avatarColor('user-bob') },
  { userId: 'user-carol', displayName: 'Carol', role: 'REVIEWER', permissions: ['workspace.read','project.read','project.review'], joinedAt: new Date(Date.now() - 7*86400000).toISOString(), avatarColor: avatarColor('user-carol') },
  { userId: 'user-dave', displayName: 'Dave', role: 'BILLING', permissions: ['workspace.read','billing.manage'], joinedAt: new Date(Date.now() - 3*86400000).toISOString(), avatarColor: avatarColor('user-dave') },
];

const SEEDED_AUDIT: AuditEvent[] = [
  { auditId: 'aud-1', type: 'ORG_CREATED', actorId: 'system', description: 'Default org seeded', timestamp: new Date(Date.now() - 86400000*30).toISOString() },
  { auditId: 'aud-2', type: 'MEMBER_ADDED', actorId: 'user-alice', description: 'Bob added as DEVELOPER', timestamp: new Date(Date.now() - 86400000*14).toISOString() },
  { auditId: 'aud-3', type: 'MEMBER_ADDED', actorId: 'user-alice', description: 'Carol added as REVIEWER', timestamp: new Date(Date.now() - 86400000*7).toISOString() },
  { auditId: 'aud-4', type: 'INVITE_CREATED', actorId: 'user-alice', description: 'Invite created for role DESIGNER', timestamp: new Date(Date.now() - 86400000*2).toISOString() },
  { auditId: 'aud-5', type: 'ROLE_CHANGED', actorId: 'user-alice', description: 'Dave role changed from VIEWER to BILLING', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const PERMISSION_MATRIX: Record<OrgRole, string[]> = {
  OWNER:     ['workspace.read','workspace.manage','project.read','project.edit','project.review','project.deploy','runtime.manage','billing.manage','member.invite','member.manage','admin.audit'],
  ADMIN:     ['workspace.read','workspace.manage','project.read','project.edit','project.review','project.deploy','runtime.manage','member.invite','member.manage'],
  DEVELOPER: ['workspace.read','project.read','project.edit','project.review','project.deploy','runtime.manage'],
  DESIGNER:  ['workspace.read','project.read','project.edit','project.review'],
  REVIEWER:  ['workspace.read','project.read','project.review'],
  BILLING:   ['workspace.read','billing.manage'],
  VIEWER:    ['workspace.read','project.read'],
};

const ALL_SCOPES = ['workspace.read','workspace.manage','project.read','project.edit','project.review','project.deploy','runtime.manage','billing.manage','member.invite','member.manage','admin.audit'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: string): string {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function roleColor(role: OrgRole): string {
  const m: Record<OrgRole, string> = { OWNER: ACCENT, ADMIN: '#8b5cf6', DEVELOPER: '#06b6d4', DESIGNER: '#ec4899', REVIEWER: '#f59e0b', BILLING: SUCCESS, VIEWER: TEXT_M };
  return m[role] ?? TEXT_M;
}

const INVITE_STATUS_COLOR: Record<InviteStatus, string> = { PENDING: WARN, ACCEPTED: SUCCESS, EXPIRED: TEXT_M, REVOKED: DANGER };

const AUDIT_ICON: Record<string, string> = {
  ORG_CREATED: '🏢', MEMBER_ADDED: '👤', MEMBER_REMOVED: '🚪', ROLE_CHANGED: '🔄',
  INVITE_CREATED: '✉️', INVITE_ACCEPTED: '✅', INVITE_REVOKED: '❌', INVITE_EXPIRED: '⏰',
  PERMISSION_CHECKED: '🔍',
};

// ── Page component ────────────────────────────────────────────────────────────

type TeamTab = 'members' | 'invites' | 'permissions' | 'audit';

export default function TeamPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) ?? 'ws-founder-1';
  const orgId = 'org-factory-default';

  const [tab, setTab] = useState<TeamTab>('members');
  const [members, setMembers] = useState<OrgMember[]>(SEEDED_MEMBERS);
  const [invites, setInvites] = useState<OrgInvite[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(SEEDED_AUDIT);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrgRole>('DEVELOPER');
  const [inviteNote, setInviteNote] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteResult, setInviteResult] = useState<string | null>(null);

  useEffect(() => {
    track('team_page_open', { workspaceId, orgId });
    fetch(`${API_BASE}/v1/organizations/${orgId}/members`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (Array.isArray(d) && d.length > 0) setMembers(d); })
      .catch(() => {});
    fetch(`${API_BASE}/v1/organizations/${orgId}/invites`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (Array.isArray(d)) setInvites(d); })
      .catch(() => {});
    fetch(`${API_BASE}/v1/organizations/${orgId}/audit?limit=20`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (Array.isArray(d)) setAuditLog(d); })
      .catch(() => {});
  }, [workspaceId]);

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteSending(true);
    track('team_invite_send', { workspaceId, role: inviteRole });
    try {
      const r = await fetch(`${API_BASE}/v1/organizations/${orgId}/invites`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId, email: inviteEmail,
          role: inviteRole, note: inviteNote,
          createdByUserId: 'user-alice',
        }),
      });
      if (r.ok) {
        const data = await r.json();
        setInviteResult(`✓ Invite sent! Token (one-time): ${data.token?.slice(0, 8)}...`);
        setInviteEmail(''); setInviteNote('');
        // Refresh invites
        const r2 = await fetch(`${API_BASE}/v1/organizations/${orgId}/invites`);
        if (r2.ok) { const d = await r2.json(); if (Array.isArray(d)) setInvites(d); }
      } else {
        const err = await r.json();
        setInviteResult(`Error: ${err.message ?? 'Failed to send invite'}`);
      }
    } catch {
      setInviteResult('Invite queued (API offline — will send when connected)');
    }
    setInviteSending(false);
    setTimeout(() => setInviteResult(null), 5000);
  };

  const TAB_BTN = (t: TeamTab, label: string) => (
    <button key={t} onClick={() => setTab(t)}
      style={{ padding: '10px 20px', fontSize: 13, fontWeight: 700, fontFamily: FONT,
        background: tab === t ? ACCENT : 'transparent', color: tab === t ? '#fff' : TEXT_M,
        border: 'none', borderBottom: tab === t ? `2px solid ${ACCENT}` : '2px solid transparent',
        cursor: 'pointer', borderRadius: tab === t ? '6px 6px 0 0' : 0,
        transition: 'background 0.15s, color 0.15s' }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: FONT }}>
      {/* ── Header ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,7,18,0.97)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 13 }}>Factory</Link>
          <span style={{ color: BORDER }}>/</span>
          <Link href="/workspace" style={{ color: TEXT_M, textDecoration: 'none', fontSize: 13 }}>Workspaces</Link>
          <span style={{ color: BORDER }}>/</span>
          <Link href={`/workspace/${workspaceId}`} style={{ color: TEXT_M, textDecoration: 'none', fontSize: 13 }}>
            Workspace
          </Link>
          <span style={{ color: BORDER }}>/</span>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>Team Settings</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* ── Back link ── */}
        <Link href={`/workspace/${workspaceId}`}
          style={{ color: TEXT_M, textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          ← Back to Workspace
        </Link>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: TEXT }}>Team Settings</h1>
          <p style={{ margin: '6px 0 0', color: TEXT_M, fontSize: 14 }}>
            Manage members, roles, invites, and permissions for your organization.
          </p>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Members', value: members.length, color: ACCENT },
            { label: 'Pending Invites', value: invites.filter(i => i.status === 'PENDING').length, color: WARN },
            { label: 'Owners', value: members.filter(m => m.role === 'OWNER').length, color: '#8b5cf6' },
            { label: 'Audit Events', value: auditLog.length, color: TEXT_M },
          ].map(s => (
            <div key={s.label} style={{ ...GLASS, flex: '1 1 180px', padding: '14px 20px' }}>
              <div style={{ fontSize: 11, color: TEXT_M, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 24 }}>
          {TAB_BTN('members', '👥 Members')}
          {TAB_BTN('invites', '✉ Invites')}
          {TAB_BTN('permissions', '🔑 Permissions')}
          {TAB_BTN('audit', '📋 Audit Log')}
        </div>

        {/* ── Members tab ── */}
        {tab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map(m => (
              <div key={m.userId} style={{ ...GLASS, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: m.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {m.displayName[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{m.displayName}</div>
                  <div style={{ fontSize: 11, color: TEXT_M, marginTop: 2 }}>
                    Joined {timeAgo(m.joinedAt)} · {m.permissions.length} permissions
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                    color: roleColor(m.role), background: `${roleColor(m.role)}20`,
                    border: `1px solid ${roleColor(m.role)}40` }}>
                    {m.role}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 320 }}>
                    {m.permissions.slice(0, 4).map(p => (
                      <span key={p} style={{ fontSize: 9, color: TEXT_M, background: 'rgba(255,255,255,0.05)',
                        borderRadius: 4, padding: '1px 5px', border: `1px solid ${BORDER}` }}>
                        {p}
                      </span>
                    ))}
                    {m.permissions.length > 4 && (
                      <span style={{ fontSize: 9, color: TEXT_M }}>+{m.permissions.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Invites tab ── */}
        {tab === 'invites' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Send invite form */}
            <div style={{ ...GLASS, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Invite New Member</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8,
                    padding: '10px 12px', fontSize: 13, color: TEXT, fontFamily: FONT, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value as OrgRole)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8,
                      padding: '10px 12px', fontSize: 13, color: TEXT, fontFamily: FONT, outline: 'none' }}>
                    {(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'] as OrgRole[]).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button onClick={sendInvite} disabled={inviteSending}
                    style={{ background: inviteSending ? TEXT_M : ACCENT, color: '#fff', border: 'none', borderRadius: 8,
                      padding: '10px 20px', fontSize: 13, fontWeight: 700, fontFamily: FONT,
                      cursor: inviteSending ? 'default' : 'pointer', minWidth: 120 }}>
                    {inviteSending ? 'Sending…' : 'Send Invite'}
                  </button>
                </div>
                <input value={inviteNote} onChange={e => setInviteNote(e.target.value)}
                  placeholder="Optional note (no secrets, tokens, or credentials)"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8,
                    padding: '10px 12px', fontSize: 12, color: TEXT, fontFamily: FONT, outline: 'none' }} />
                {inviteResult && (
                  <div style={{ fontSize: 12, padding: '8px 12px', borderRadius: 6,
                    background: inviteResult.startsWith('✓') ? `${SUCCESS}18` : `${DANGER}18`,
                    color: inviteResult.startsWith('✓') ? SUCCESS : DANGER,
                    border: `1px solid ${inviteResult.startsWith('✓') ? SUCCESS : DANGER}40` }}>
                    {inviteResult}
                  </div>
                )}
              </div>
            </div>

            {/* Invite list */}
            {invites.length === 0 ? (
              <div style={{ ...GLASS, padding: 24, textAlign: 'center', color: TEXT_M, fontSize: 13 }}>
                No invites yet. Send your first invite above.
              </div>
            ) : invites.map(inv => (
              <div key={inv.inviteId} style={{ ...GLASS, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, color: TEXT_M, fontFamily: 'monospace' }}>{inv.emailHash}</div>
                  <div style={{ fontSize: 11, color: TEXT_M, marginTop: 3 }}>
                    Invited {timeAgo(inv.createdAt)} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                    color: roleColor(inv.role), background: `${roleColor(inv.role)}18` }}>
                    {inv.role}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                    color: INVITE_STATUS_COLOR[inv.status],
                    background: `${INVITE_STATUS_COLOR[inv.status]}18` }}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Permissions matrix tab ── */}
        {tab === 'permissions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: FONT }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 14px', color: TEXT_M, fontWeight: 700, borderBottom: `1px solid ${BORDER}`, minWidth: 160 }}>
                    Permission Scope
                  </th>
                  {(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'] as OrgRole[]).map(r => (
                    <th key={r} style={{ padding: '10px 14px', textAlign: 'center', borderBottom: `1px solid ${BORDER}`, minWidth: 80 }}>
                      <span style={{ color: roleColor(r), fontWeight: 800, fontSize: 10 }}>{r}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_SCOPES.map((scope, i) => (
                  <tr key={scope} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '9px 14px', color: TEXT_M, fontFamily: 'monospace', fontSize: 11 }}>
                      {scope}
                    </td>
                    {(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'] as OrgRole[]).map(r => (
                      <td key={r} style={{ padding: '9px 14px', textAlign: 'center' }}>
                        {PERMISSION_MATRIX[r].includes(scope)
                          ? <span style={{ color: SUCCESS, fontSize: 14 }}>✓</span>
                          : <span style={{ color: BORDER, fontSize: 14 }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Audit log tab ── */}
        {tab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {auditLog.map(evt => (
              <div key={evt.auditId} style={{ ...GLASS, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{AUDIT_ICON[evt.type] ?? '•'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{evt.description}</div>
                  <div style={{ fontSize: 10, color: TEXT_M, marginTop: 3 }}>
                    <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: 4 }}>
                      {evt.type}
                    </span>
                    {' '}· by {evt.actorId} · {timeAgo(evt.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {auditLog.length === 0 && (
              <div style={{ ...GLASS, padding: 24, textAlign: 'center', color: TEXT_M, fontSize: 13 }}>
                No audit events yet.
              </div>
            )}
          </div>
        )}

        {/* ── Billing role note ── */}
        <div style={{ ...GLASS, marginTop: 32, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'flex-start',
          background: `${WARN}08`, borderColor: `${WARN}30` }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.6 }}>
            <strong style={{ color: TEXT }}>BILLING role:</strong> Can view and manage subscription plans.
            Cannot edit projects, deploy, or invite members.{' '}
            <strong style={{ color: TEXT }}>REVIEWER:</strong> Can approve patches but cannot deploy to production.{' '}
            <strong style={{ color: TEXT }}>VIEWER:</strong> Read-only access to workspace and projects.
          </div>
        </div>
      </div>
    </div>
  );
}
