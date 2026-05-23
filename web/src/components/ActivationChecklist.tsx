'use client';

import React, { useState } from 'react';

const ACCENT  = '#6366f1';
const ACCENT_GRN = '#10b981';
const TEXT    = '#f1f5f9';
const TEXT_M  = '#64748b';
const BORDER  = 'rgba(255,255,255,0.07)';
const FONT    = "'Geist','Inter',system-ui,sans-serif";

interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
  route?: string;
}

interface ActivationChecklistProps {
  completedSteps?: string[];
}

const ALL_ITEMS: Omit<ChecklistItem, 'done'>[] = [
  { key: 'IDEA_ENTERED',      label: 'Enter your idea',           route: '/demo' },
  { key: 'BLUEPRINT_VIEWED',  label: 'View your blueprint',       route: '/demo' },
  { key: 'COUNCIL_WATCHED',   label: 'Watch the AI council',      route: '/demo' },
  { key: 'PREVIEW_REVEALED',  label: 'Open your live preview',    route: '/demo' },
  { key: 'PREVIEW_SHARED',    label: 'Share your preview' },
  { key: 'MEMORY_SAVED',      label: 'Save project memory',       route: '/memory' },
  { key: 'WORKSPACE_CREATED', label: 'Create a workspace',        route: '/workspace' },
  { key: 'TEAMMATE_INVITED',  label: 'Invite a teammate',         route: '/workspace' },
];

export function ActivationChecklist({ completedSteps = [] }: ActivationChecklistProps) {
  const [collapsed, setCollapsed] = useState(false);

  const items: ChecklistItem[] = ALL_ITEMS.map(i => ({
    ...i,
    done: completedSteps.includes(i.key),
  }));

  const doneCount = items.filter(i => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 100,
        fontFamily: FONT,
        width: collapsed ? 'auto' : 240,
      }}
    >
      {/* Collapsed state */}
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'rgba(10,22,40,0.92)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: '10px 16px',
            color: TEXT,
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: ACCENT_GRN, fontWeight: 700 }}>●</span>
          <span style={{ fontWeight: 600 }}>Progress {doneCount}/{items.length}</span>
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(10,22,40,0.94)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, letterSpacing: '0.04em' }}>
              Getting started
            </span>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'none', border: 'none', color: TEXT_M,
                cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
              }}
              aria-label="Collapse"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ padding: '8px 14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: TEXT_M }}>{doneCount} of {items.length} done</span>
              <span style={{ fontSize: 11, color: pct === 100 ? ACCENT_GRN : ACCENT, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: pct === 100 ? ACCENT_GRN : ACCENT,
                borderRadius: 2, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: '8px 0 12px' }}>
            {items.map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  opacity: item.done ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 13, color: item.done ? ACCENT_GRN : TEXT_M, minWidth: 14 }}>
                  {item.done ? '✓' : '○'}
                </span>
                {item.route && !item.done ? (
                  <a
                    href={item.route}
                    style={{
                      fontSize: 12, color: TEXT, textDecoration: 'none',
                      fontWeight: item.done ? 400 : 500,
                      textDecorationLine: item.done ? 'line-through' : 'none',
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span style={{
                    fontSize: 12, color: item.done ? TEXT_M : TEXT,
                    fontWeight: item.done ? 400 : 500,
                    textDecorationLine: item.done ? 'line-through' : 'none',
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
