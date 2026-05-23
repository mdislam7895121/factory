'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';
import { apiUrl } from '@/lib/env';

const BG      = '#030712';
const SURFACE = 'rgba(10,22,40,0.82)';
const ACCENT  = '#6366f1';
const ACCENT_GRN = '#10b981';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const FONT    = "'Geist','Inter',system-ui,sans-serif";

const GLASS: React.CSSProperties = {
  background: SURFACE,
  backdropFilter: 'blur(24px)',
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
};

type Role = 'FOUNDER' | 'DEVELOPER' | 'DESIGNER' | 'PRODUCT_MANAGER' | 'MARKETER' | 'STUDENT' | 'OTHER';
type TechLevel = 'NON_TECHNICAL' | 'SOME_CODE' | 'TECHNICAL';
type Goal = 'VALIDATE_IDEA' | 'BUILD_MVP' | 'DEMO_INVESTORS' | 'LAUNCH_PRODUCT' | 'LEARN_AI' | 'OTHER';
type Path = 'BUILD_FROM_PROMPT' | 'EXPLORE_EXAMPLES' | 'OPEN_WORKSPACE' | 'INVITE_TEAM';

const ROLES: { value: Role; label: string; icon: string }[] = [
  { value: 'FOUNDER',         label: 'Founder',         icon: '🚀' },
  { value: 'DEVELOPER',       label: 'Developer',       icon: '💻' },
  { value: 'DESIGNER',        label: 'Designer',        icon: '🎨' },
  { value: 'PRODUCT_MANAGER', label: 'Product Manager', icon: '📋' },
  { value: 'MARKETER',        label: 'Marketer',        icon: '📣' },
  { value: 'STUDENT',         label: 'Student',         icon: '🎓' },
  { value: 'OTHER',           label: 'Something else',  icon: '✨' },
];

const TECH_LEVELS: { value: TechLevel; label: string; desc: string }[] = [
  { value: 'NON_TECHNICAL', label: 'No code',     desc: "I've never written code before" },
  { value: 'SOME_CODE',     label: 'Some code',   desc: 'I can follow along with developers' },
  { value: 'TECHNICAL',     label: 'I code',      desc: "I'm comfortable writing code" },
];

const GOALS: { value: Goal; label: string; icon: string }[] = [
  { value: 'VALIDATE_IDEA',   label: 'Validate an idea',           icon: '💡' },
  { value: 'BUILD_MVP',       label: 'Build a quick MVP',          icon: '⚡' },
  { value: 'DEMO_INVESTORS',  label: 'Demo to investors',          icon: '📈' },
  { value: 'LAUNCH_PRODUCT',  label: 'Launch a real product',      icon: '🌍' },
  { value: 'LEARN_AI',        label: 'Learn how AI builds apps',   icon: '🤖' },
  { value: 'OTHER',           label: 'Something else',             icon: '🔮' },
];

const PATHS: { value: Path; label: string; desc: string; icon: string; route: string }[] = [
  {
    value: 'BUILD_FROM_PROMPT',
    label: 'Build from an idea',
    desc: 'Type what you want to build. AI handles the rest.',
    icon: '⚡',
    route: '/demo',
  },
  {
    value: 'EXPLORE_EXAMPLES',
    label: 'Explore examples',
    desc: 'Remix a working app from our collection.',
    icon: '🛍',
    route: '/discover',
  },
  {
    value: 'OPEN_WORKSPACE',
    label: 'Open workspace',
    desc: 'Manage your projects and pick up where you left off.',
    icon: '🗂',
    route: '/workspace',
  },
  {
    value: 'INVITE_TEAM',
    label: 'Invite my team',
    desc: 'Bring teammates in to build together.',
    icon: '👥',
    route: '/workspace',
  },
];

type OnboardingFlowStep = 'role' | 'tech' | 'goal' | 'path';

const STEPS: OnboardingFlowStep[] = ['role', 'tech', 'goal', 'path'];
const STEP_LABELS: Record<OnboardingFlowStep, string> = {
  role: 'About you',
  tech: 'Your background',
  goal: 'Your goal',
  path: 'Where to start',
};

function ProgressDots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
      {STEPS.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= current ? ACCENT : BORDER,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingFlowStep>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [techLevel, setTechLevel] = useState<TechLevel | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const userId = `anon_${Math.random().toString(36).slice(2, 10)}`;

  const stepIdx = STEPS.indexOf(step);

  const postEvent = async (eventStep: string, meta?: Record<string, unknown>) => {
    try {
      await fetch(apiUrl(`/v1/onboarding/${userId}/event`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: eventStep, meta }),
      });
    } catch {
      // non-critical
    }
  };

  const skip = () => {
    track('onboarding_skipped', { atStep: step });
    router.push('/demo');
  };

  const handleRole = (r: Role) => {
    setRole(r);
    track('role_selected', { role: r });
    postEvent('ROLE_SELECTED', { role: r });
    setStep('tech');
  };

  const handleTech = (t: TechLevel) => {
    setTechLevel(t);
    setStep('goal');
  };

  const handleGoal = (g: Goal) => {
    setGoal(g);
    setStep('path');
  };

  const handlePath = (path: typeof PATHS[0]) => {
    track('onboarding_started', { role, techLevel, goal, path: path.value });
    let dest = path.route;
    if (path.value === 'BUILD_FROM_PROMPT') {
      dest = '/demo';
    }
    router.push(dest);
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: BG,
    fontFamily: FONT,
    color: TEXT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  };

  const cardStyle: React.CSSProperties = {
    ...GLASS,
    width: '100%',
    maxWidth: 520,
    padding: '40px 32px',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Factory
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.3 }}>
            {step === 'role'  && 'What best describes you?'}
            {step === 'tech'  && "What's your technical background?"}
            {step === 'goal'  && "What's your main goal?"}
            {step === 'path'  && 'Where would you like to start?'}
          </h1>
          <p style={{ margin: '10px 0 0', fontSize: 14, color: TEXT_M, lineHeight: 1.6 }}>
            {step === 'role'  && 'Factory adapts to your background.'}
            {step === 'tech'  && 'No coding required. We just want to know your comfort level.'}
            {step === 'goal'  && 'This helps us point you to the fastest path.'}
            {step === 'path'  && 'You can change direction any time.'}
          </p>
        </div>

        <ProgressDots current={stepIdx} />

        {/* Role step */}
        {step === 'role' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ROLES.map(r => (
              <button
                key={r.value}
                onClick={() => handleRole(r.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: '14px 12px',
                  color: TEXT,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Tech level step */}
        {step === 'tech' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TECH_LEVELS.map(t => (
              <button
                key={t.value}
                onClick={() => handleTech(t.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: '16px 20px',
                  color: TEXT,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: TEXT_M, marginTop: 3 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Goal step */}
        {step === 'goal' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => handleGoal(g.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: '14px 12px',
                  color: TEXT,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: 18 }}>{g.icon}</span>
                {g.label}
              </button>
            ))}
          </div>
        )}

        {/* Path selection */}
        {step === 'path' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PATHS.map(p => (
              <button
                key={p.value}
                onClick={() => handlePath(p)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: '18px 20px',
                  color: TEXT,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <span style={{ fontSize: 26, minWidth: 36, textAlign: 'center' }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</div>
                  <div style={{ fontSize: 13, color: TEXT_M, marginTop: 3 }}>{p.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: TEXT_M, fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
        )}

        {/* What Factory helps you do — shown on path step */}
        {step === 'path' && (
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(99,102,241,0.06)', borderRadius: 10, border: `1px solid rgba(99,102,241,0.15)` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Factory helps you
            </div>
            {[
              'Turn an idea into a live app',
              'Preview it instantly — no deploy needed',
              'Share it with anyone via a link',
              'Remix and improve it safely',
              'Keep your project memory between sessions',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: TEXT_M, marginBottom: 4 }}>
                <span style={{ color: ACCENT_GRN, fontWeight: 700 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Skip link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={skip}
            style={{
              background: 'none', border: 'none', color: TEXT_M,
              cursor: 'pointer', fontSize: 13, fontFamily: FONT,
              textDecoration: 'underline', textDecorationStyle: 'dotted',
            }}
          >
            Skip and go straight to demo
          </button>
        </div>
      </div>
    </div>
  );
}
