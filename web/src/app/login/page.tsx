'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { pageView, track } from '@/lib/analytics';

void pageView;

const ACTIVITY = [
  { time: 'Just now', text: 'A new workspace was created by Product Team Alpha.' },
  { time: '2m ago', text: 'Design Council approved a production-ready auth flow.' },
  { time: '5m ago', text: 'Runtime quality scan passed with 99.3% confidence.' },
];

const FEATURES = [
  'Multi-agent orchestration for product, design, and engineering',
  'Live previews with runtime safety rails and rollback controls',
  'Delivery workflows tuned for startup velocity and enterprise governance',
];

const TRUST = ['Secure workspace', 'Encrypted sessions', 'Team-ready'];

export default function LoginPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    track('login_page_opened');
    const id = window.setInterval(() => setTick((v) => v + 1), 1200);
    return () => window.clearInterval(id);
  }, []);

  const glow = useMemo(() => 20 + Math.round((Math.sin(tick * 0.8) + 1) * 10), [tick]);
  const haloShift = useMemo(() => 48 + Math.round((Math.cos(tick * 0.6) + 1) * 14), [tick]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'radial-gradient(1200px 700px at 10% 15%, rgba(55,65,81,0.4), transparent 55%), radial-gradient(900px 600px at 90% 80%, rgba(20,184,166,0.2), transparent 60%), #020617',
        color: '#e2e8f0',
        padding: 24,
        fontFamily: 'var(--font-geist-sans), Geist, system-ui, sans-serif',
      }}
      id="main-content"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          borderRadius: 24,
          border: '1px solid rgba(148,163,184,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          background: 'linear-gradient(160deg, rgba(2,6,23,0.96), rgba(15,23,42,0.94))',
          boxShadow: `0 22px 70px rgba(2,6,23,0.7), 0 0 ${glow}px rgba(56,189,248,0.18)`,
          transition: 'box-shadow 700ms ease',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.28), transparent 68%)',
            left: -90,
            top: -70,
            filter: 'blur(6px)',
            opacity: 0.9,
            transform: `translateY(${Math.round(Math.sin(tick * 0.4) * 6)}px)`,
            transition: 'transform 800ms ease',
            pointerEvents: 'none',
          }}
        />

        <section
          style={{
            flex: '1 1 600px',
            minWidth: 340,
            padding: '44px 40px',
            borderRight: '1px solid rgba(148,163,184,0.2)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 999, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.35)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22d3ee', boxShadow: `0 0 ${haloShift}px rgba(34,211,238,0.7)`, transition: 'box-shadow 700ms ease' }} />
            <span style={{ fontSize: 12, letterSpacing: 0.3, color: '#bae6fd' }}>BuildAI Factory Premium</span>
          </div>

          <h1 style={{ margin: '20px 0 12px', fontSize: 'clamp(32px, 4vw, 50px)', lineHeight: 1.04, letterSpacing: -1.2, color: '#f8fafc' }}>
            Launch products with a cinematic AI workflow.
          </h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 16, lineHeight: 1.65, color: '#94a3b8' }}>
            Factory brings branding, architecture, build quality, and release confidence into one premium command center.
          </p>

          <div style={{ marginTop: 26, display: 'grid', gap: 11 }}>
            {FEATURES.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#67e8f9', fontSize: 16, lineHeight: '20px' }}>✦</span>
                <span style={{ color: '#cbd5e1', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, padding: 18, borderRadius: 16, background: 'rgba(15,23,42,0.72)', border: '1px solid rgba(100,116,139,0.4)' }}>
            <p style={{ margin: '0 0 12px', color: '#93c5fd', fontSize: 13, letterSpacing: 0.4 }}>Live Activity</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {ACTIVITY.map((entry) => (
                <div key={entry.text} style={{ display: 'grid', gap: 3 }}>
                  <span style={{ color: '#67e8f9', fontSize: 12 }}>{entry.time}</span>
                  <span style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.45 }}>{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            flex: '1 1 420px',
            minWidth: 320,
            padding: '40px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, rgba(15,23,42,0.62), rgba(2,6,23,0.8))',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 380,
              borderRadius: 18,
              padding: 24,
              background: 'rgba(15,23,42,0.55)',
              border: '1px solid rgba(125,211,252,0.35)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `0 10px 40px rgba(2,6,23,0.55), 0 0 ${Math.max(10, glow - 8)}px rgba(56,189,248,0.2)`,
              transition: 'box-shadow 700ms ease',
            }}
          >
            <h2 style={{ margin: 0, color: '#f8fafc', fontSize: 28, letterSpacing: -0.4 }}>Welcome back</h2>
            <p style={{ margin: '8px 0 18px', color: '#94a3b8', lineHeight: 1.5 }}>
              Access your premium Factory workspace and continue building.
            </p>

            <button
              type="button"
              onClick={() => track('login_oauth_github_click')}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.45)',
                background: 'linear-gradient(180deg, rgba(30,41,59,0.85), rgba(15,23,42,0.92))',
                color: '#e2e8f0',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              aria-label="Continue with GitHub"
            >
              Continue with GitHub (OAuth placeholder)
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
              <div style={{ height: 1, background: 'rgba(148,163,184,0.35)', flex: 1 }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>or sign in with email</span>
              <div style={{ height: 1, background: 'rgba(148,163,184,0.35)', flex: 1 }} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                track('login_form_submit_attempt');
              }}
            >
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.45)', background: 'rgba(2,6,23,0.7)', color: '#f8fafc', marginBottom: 12, outline: 'none' }}
              />

              <label htmlFor="password" style={{ display: 'block', fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.45)', background: 'rgba(2,6,23,0.7)', color: '#f8fafc', marginBottom: 8, outline: 'none' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                <Link href="/" style={{ color: '#67e8f9', fontSize: 13, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                  color: '#082f49',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sign in to Factory
              </button>
            </form>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TRUST.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 12,
                    color: '#a5f3fc',
                    border: '1px solid rgba(103,232,249,0.35)',
                    borderRadius: 999,
                    padding: '5px 10px',
                    background: 'rgba(8,47,73,0.35)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
