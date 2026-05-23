'use client';

import React, { useState } from 'react';
import { apiUrl } from '@/lib/env';
import { track } from '@/lib/analytics';

const SURFACE = 'rgba(10,22,40,0.92)';
const ACCENT  = '#6366f1';
const ACCENT_R = '#ef4444';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.10)';
const FONT    = "'Geist','Inter',system-ui,sans-serif";

type FeedbackCategory = 'BUG'|'FEATURE_REQUEST'|'QUALITY_ISSUE'|'GENERAL';

const QUICK_OPTIONS: Array<{ label: string; category: FeedbackCategory; severity: string }> = [
  { label: '🐛 Report a bug',         category: 'BUG',             severity: 'HIGH'   },
  { label: '💡 Suggest improvement',  category: 'FEATURE_REQUEST', severity: 'LOW'    },
  { label: '⚠️ This app is broken',   category: 'QUALITY_ISSUE',   severity: 'HIGH'   },
  { label: '🙋 I need help',          category: 'GENERAL',          severity: 'MEDIUM' },
];

interface Props {
  route?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function FeedbackWidget({ route = '', position = 'bottom-right' }: Props) {
  const [open,      setOpen]    = useState(false);
  const [step,      setStep]    = useState<'picker' | 'form' | 'sent'>('picker');
  const [selected,  setSelected] = useState<typeof QUICK_OPTIONS[0] | null>(null);
  const [title,     setTitle]   = useState('');
  const [body,      setBody]    = useState('');
  const [sending,   setSending] = useState(false);
  const [err,       setErr]     = useState('');

  const posStyle: React.CSSProperties =
    position === 'bottom-right'
      ? { position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }
      : { position: 'fixed', bottom: 24, left: 24, zIndex: 9999 };

  const panelAlign: React.CSSProperties =
    position === 'bottom-right' ? { right: 0 } : { left: 0 };

  function pick(opt: typeof QUICK_OPTIONS[0]) {
    setSelected(opt);
    setTitle(opt.label.replace(/^[^\w]+\s*/, ''));
    setStep('form');
    track('feedback_widget_option_picked', { category: opt.category });
  }

  async function submit() {
    if (!selected || title.trim().length < 3) { setErr('Please describe the issue.'); return; }
    setSending(true);
    setErr('');
    try {
      const res = await fetch(apiUrl('/v1/feedback'), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          category: selected.category,
          severity: selected.severity,
          title:    title.trim().slice(0, 120),
          body:     body.trim().slice(0, 2000),
          route:    route.slice(0, 200),
        }),
      });
      if (res.ok) {
        setStep('sent');
        track('feedback_submitted', { category: selected.category });
      } else {
        setErr(`Submit failed (${res.status}). Try again.`);
      }
    } catch {
      setErr('Network error. Try again.');
    }
    setSending(false);
  }

  function reset() {
    setOpen(false);
    setStep('picker');
    setSelected(null);
    setTitle('');
    setBody('');
    setErr('');
  }

  return (
    <div style={posStyle}>
      {open && (
        <div style={{
          position: 'absolute', bottom: 52, ...panelAlign,
          width: 300, background: SURFACE, backdropFilter: 'blur(20px)',
          border: `1px solid ${BORDER}`, borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', fontFamily: FONT,
          padding: 16, marginBottom: 8,
        }}>
          {step === 'picker' && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Send feedback</div>
              {QUICK_OPTIONS.map(opt => (
                <button key={opt.category} onClick={() => pick(opt)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', marginBottom: 6, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, color: TEXT, fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
                  {opt.label}
                </button>
              ))}
              <button onClick={reset} style={{ marginTop: 4, background: 'none', border: 'none', color: TEXT_M, cursor: 'pointer', fontSize: 11, fontFamily: FONT }}>Cancel</button>
            </>
          )}

          {step === 'form' && selected && (
            <>
              <button onClick={() => setStep('picker')} style={{ background: 'none', border: 'none', color: TEXT_M, cursor: 'pointer', fontSize: 12, marginBottom: 8, fontFamily: FONT }}>← Back</button>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{selected.label}</div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Brief description (required)"
                maxLength={120}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: '9px 12px', fontSize: 13, fontFamily: FONT, marginBottom: 8, boxSizing: 'border-box' }}
              />
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="More details (optional)…"
                rows={3}
                maxLength={2000}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: '9px 12px', fontSize: 13, fontFamily: FONT, resize: 'vertical', marginBottom: 10, boxSizing: 'border-box' }}
              />
              {err && <div style={{ fontSize: 12, color: ACCENT_R, marginBottom: 8 }}>{err}</div>}
              <button onClick={() => void submit()} disabled={sending || title.trim().length < 3}
                style={{ width: '100%', padding: '10px', borderRadius: 8, background: ACCENT, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: sending ? 'wait' : 'pointer', opacity: title.trim().length < 3 ? 0.5 : 1, fontFamily: FONT }}>
                {sending ? 'Sending…' : 'Send'}
              </button>
            </>
          )}

          {step === 'sent' && (
            <>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Thanks for the feedback!</div>
                <div style={{ fontSize: 12, color: TEXT_M, lineHeight: 1.5 }}>We review every submission and use it to improve Factory.</div>
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, color: TEXT, fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>Close</button>
            </>
          )}
        </div>
      )}

      <button onClick={() => { setOpen(o => !o); if (!open) track('feedback_widget_opened', { route }); }}
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 24, background: open ? ACCENT : 'rgba(10,22,40,0.90)', border: `1px solid ${open ? ACCENT : BORDER}`, color: TEXT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
        <span style={{ fontSize: 15 }}>{open ? '×' : '💬'}</span>
        {!open && 'Feedback'}
      </button>
    </div>
  );
}
