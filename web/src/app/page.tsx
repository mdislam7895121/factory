'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type CreateProjectResponse = {
  ok: boolean;
  project: {
    id: string;
    name: string;
    template: string;
  };
};

type StartPhase = 'idle' | 'creating' | 'starting' | 'opening' | 'error';
type BuildMode = 'app' | 'design';

const orchestratorHttpBase =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_BASE_URL ?? 'http://localhost:4100';

const ideaChips = [
  'AI Apps',
  'Websites',
  'Business Apps',
  'Personal Software',
];

const templates: Array<{ key: string; title: string; template: string; prompt: string; description: string }> = [
  {
    key: 'basic-web',
    title: 'Web Starter',
    template: 'basic-web',
    prompt: 'Build a clean landing page with a hero, pricing cards, and contact form.',
    description: 'Simple site starter for quick MVPs.',
  },
  {
    key: 'saas-dashboard',
    title: 'SaaS Dashboard',
    template: 'basic-web',
    prompt: 'Create a SaaS dashboard with sidebar navigation and usage analytics cards.',
    description: 'Admin-like layout with key metrics.',
  },
  {
    key: 'ecommerce',
    title: 'E-commerce',
    template: 'basic-web',
    prompt: 'Generate an e-commerce storefront with product grid and cart summary.',
    description: 'Shopping-focused starter app.',
  },
  {
    key: 'internal-tool',
    title: 'Internal Tool',
    template: 'basic-web',
    prompt: 'Build an internal operations tool with filters, table views, and quick actions.',
    description: 'Workflow-oriented business app.',
  },
];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${orchestratorHttpBase}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    let details = '';
    try {
      details = await response.text();
    } catch {
      details = '';
    }
    throw new Error(`${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
  }
  return response.json();
}

export default function Home() {
  const router = useRouter();
  const [buildMode, setBuildMode] = useState<BuildMode>('app');
  const [prompt, setPrompt] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('basic-web');
  const [phase, setPhase] = useState<StartPhase>('idle');
  const [phaseText, setPhaseText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lastAttempt, setLastAttempt] = useState<{ prompt: string; template: string } | null>(null);

  const promptLength = prompt.trim().length;
  const canStart = promptLength >= 10 && phase !== 'creating' && phase !== 'starting' && phase !== 'opening';

  const startLabel = useMemo(() => {
    if (phase === 'creating') {
      return 'Creating...';
    }
    if (phase === 'starting') {
      return 'Starting...';
    }
    if (phase === 'opening') {
      return 'Opening preview...';
    }
    return 'Start';
  }, [phase]);

  const startBuild = async (promptText: string, template: string) => {
    const trimmedPrompt = promptText.trim();
    if (trimmedPrompt.length < 10) {
      return;
    }

    setError('');
    setLastAttempt({ prompt: trimmedPrompt, template });

    try {
      setPhase('creating');
      setPhaseText('Creating...');

      const derivedName = trimmedPrompt.slice(0, 48) || 'New App';
      const create = await api<CreateProjectResponse>('/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ name: derivedName, template }),
      });

      setPhase('starting');
      setPhaseText('Starting...');

      await api(`/v1/projects/${encodeURIComponent(create.project.id)}/start`, {
        method: 'POST',
      });

      setPhase('opening');
      setPhaseText('Opening preview...');
      router.push(`/p/${create.project.id}/`);
    } catch (err) {
      setPhase('error');
      setError(`Unable to create/start project: ${String(err)}`);
      setPhaseText('');
    }
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>What will you build?</h1>
        <Link href="/dashboard">Open dashboard</Link>
      </div>

      <p style={{ marginTop: 0, color: '#555' }}>
        Describe your app, pick a template, and start instantly.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => setBuildMode('app')}
          style={{
            padding: '8px 14px',
            border: '1px solid #bbb',
            background: buildMode === 'app' ? '#eef6ff' : '#fff',
            cursor: 'pointer',
          }}
        >
          App
        </button>
        <button
          disabled
          title="Design mode is coming soon"
          style={{
            padding: '8px 14px',
            border: '1px solid #ddd',
            background: '#f5f5f5',
            color: '#777',
            cursor: 'not-allowed',
          }}
        >
          Design
        </button>
      </div>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Describe the app you want to build..."
        rows={8}
        style={{ width: '100%', padding: '12px', boxSizing: 'border-box', marginBottom: '10px' }}
      />

      <div style={{ color: '#666', marginBottom: '12px' }}>
        {promptLength}/10 characters minimum
      </div>

      <div style={{ marginBottom: '14px' }}>
        <strong>Start with an idea:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {ideaChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(`Build a ${chip.toLowerCase()} project that helps users get started quickly.`)}
              style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <strong>Templates</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '8px' }}>
          {templates.map((card) => (
            <button
              key={card.key}
              onClick={() => {
                setSelectedTemplate(card.template);
                setPrompt(card.prompt);
              }}
              style={{
                textAlign: 'left',
                border: selectedTemplate === card.template && prompt === card.prompt ? '2px solid #2563eb' : '1px solid #ccc',
                padding: '10px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{card.title}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>{card.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => startBuild(prompt, selectedTemplate).catch(() => {})}
          disabled={!canStart || buildMode !== 'app'}
          style={{ padding: '10px 16px' }}
        >
          {startLabel}
        </button>
        {phaseText ? <span>{phaseText}</span> : null}
      </div>

      {error ? (
        <div style={{ marginTop: '16px', background: '#ffe7e7', border: '1px solid #ffb9b9', padding: '10px' }}>
          <div style={{ marginBottom: '8px' }}>{error}</div>
          <button
            onClick={() => {
              if (!lastAttempt) {
                return;
              }
              startBuild(lastAttempt.prompt, lastAttempt.template).catch(() => {});
            }}
            disabled={!lastAttempt}
            style={{ padding: '6px 10px' }}
          >
            Retry
          </button>
        </div>
      ) : null}
    </main>
  );
}
