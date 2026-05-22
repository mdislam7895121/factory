'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BG       = '#030712';
const SURFACE  = 'rgba(8,18,36,0.95)';
const BORDER   = 'rgba(255,255,255,0.07)';
const ACCENT   = '#6366f1';
const ACCENT_R = '#ef4444';
const TEXT     = '#f1f5f9';
const TEXT_M   = '#64748b';
const TEXT_D   = '#334155';

export const AdminKeyCtx = createContext<string>('');

const NAV = [
  { href: '/admin',           icon: '⌂', label: 'Command Center' },
  { href: '/admin/runtimes',  icon: '▶', label: 'Runtimes'       },
  { href: '/admin/discovery', icon: '🔍', label: 'Discovery'      },
  { href: '/admin/creators',  icon: '👤', label: 'Creators'       },
  { href: '/admin/health',    icon: '❤️', label: 'Health'         },
  { href: '/admin/billing',   icon: '💳', label: 'Billing'        },
  { href: '/admin/security',  icon: '🛡️', label: 'Security'       },
];

function LoginGate({ onAuth }: { onAuth: (k: string) => void }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) { setErr('Enter your admin API key.'); return; }
    sessionStorage.setItem('factory_admin_key', key.trim());
    onAuth(key.trim());
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>F</div>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 18 }}>Factory <span style={{ color: ACCENT }}>Admin</span></span>
        </div>
        <p style={{ color: TEXT_M, fontSize: 13, marginBottom: 24 }}>Enter your admin API key to access the Control Tower.</p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setErr(''); }}
            placeholder="sk-admin-••••••••"
            style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${err ? ACCENT_R : BORDER}`, borderRadius: 8, color: TEXT, fontSize: 15, outline: 'none', fontFamily: 'monospace' }}
            autoFocus
          />
          {err && <p style={{ color: ACCENT_R, fontSize: 12, margin: 0 }}>{err}</p>}
          <button type="submit" style={{ padding: '12px 24px', background: ACCENT, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
            Access Control Tower →
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [ready, setReady]       = useState(false);
  const pathname                = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem('factory_admin_key') ?? '';
    setAdminKey(stored || null);
    setReady(true);
  }, []);

  function handleAuth(k: string) { setAdminKey(k); }
  function handleLogout() {
    sessionStorage.removeItem('factory_admin_key');
    setAdminKey(null);
  }

  if (!ready) {
    return <div style={{ minHeight: '100vh', background: BG }} />;
  }

  if (!adminKey) {
    return <LoginGate onAuth={handleAuth} />;
  }

  return (
    <AdminKeyCtx.Provider value={adminKey}>
      <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: 'system-ui,-apple-system,sans-serif', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(3,7,18,0.96)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: `linear-gradient(135deg,${ACCENT},#4f46e5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>F</div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Factory <span style={{ color: ACCENT }}>Admin</span></span>
            <span style={{ marginLeft: 4, padding: '2px 7px', borderRadius: 4, background: 'rgba(99,102,241,0.12)', border: `1px solid rgba(99,102,241,0.25)`, fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Control Tower</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_M }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
              Operational
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT_M, cursor: 'pointer', fontSize: 12, padding: '4px 10px' }}>
              Sign out
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', paddingTop: 52, flex: 1 }}>
          {/* Left nav */}
          <nav style={{ width: 220, flexShrink: 0, position: 'fixed', top: 52, bottom: 0, left: 0, background: 'rgba(5,12,26,0.98)', borderRight: `1px solid ${BORDER}`, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', zIndex: 90 }}>
            {NAV.map(({ href, icon, label }) => {
              const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
              return (
                <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', color: active ? TEXT : TEXT_M, background: active ? 'rgba(99,102,241,0.12)' : 'transparent', border: active ? `1px solid rgba(99,102,241,0.2)` : '1px solid transparent', fontSize: 13, fontWeight: active ? 600 : 400, transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
            <div style={{ flex: 1 }} />
            <div style={{ padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', marginTop: 8 }}>
              <div style={{ fontSize: 10, color: TEXT_D, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin key</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: TEXT_M }}>{adminKey.slice(0, 8)}••••</div>
            </div>
          </nav>

          {/* Main content */}
          <main id="admin-main" style={{ flex: 1, marginLeft: 220, minHeight: 'calc(100vh - 52px)', padding: '24px', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminKeyCtx.Provider>
  );
}
