'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Project = {
  id: string;
  name: string;
  template: string;
  running: boolean;
  healthy: boolean;
  port: number;
  previewPath: string;
  containerName: string;
  createdAt: string;
};

const orchestratorHttpBase =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_BASE_URL ?? 'http://localhost:4100';
const orchestratorWsBase =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_WS_BASE_URL ?? 'ws://localhost:4100';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${orchestratorHttpBase}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [logs, setLogs] = useState<string>('');
  const [name, setName] = useState<string>('My Project');
  const [loadingAction, setLoadingAction] = useState<'create' | 'start' | 'stop' | null>(null);
  const [webReady, setWebReady] = useState<boolean>(false);
  const [warmupMessage, setWarmupMessage] = useState<string>('Initializing dashboard...');
  const [error, setError] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  const selected = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  );

  const refresh = async () => {
    const data = await api<{ ok: boolean; projects: Project[] }>('/v1/projects');
    setProjects(data.projects);
    if (!selectedId && data.projects.length > 0) {
      setSelectedId(data.projects[0].id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const warmup = async () => {
      let delayMs = 1000;
      for (let attempt = 1; attempt <= 6; attempt += 1) {
        try {
          setWarmupMessage(`Connecting to orchestrator... attempt ${attempt}/6`);
          await refresh();
          if (!mounted) {
            return;
          }
          setWebReady(true);
          setWarmupMessage('Web Ready');
          setError('');
          return;
        } catch (err) {
          if (!mounted) {
            return;
          }
          if (attempt === 6) {
            setError(`[warmup] ${String(err)}`);
            setWarmupMessage('Web warmup failed');
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2;
        }
      }
    };

    warmup().catch((err) => {
      setError(`[warmup] ${String(err)}`);
      setWarmupMessage('Web warmup failed');
    });

    const interval = setInterval(() => {
      refresh().catch((err) => {
        setError(`[refresh] ${String(err)}`);
      });
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    wsRef.current?.close();
    setLogs('');

    const ws = new WebSocket(
      `${orchestratorWsBase}/v1/ws/projects/${encodeURIComponent(selectedId)}/logs`,
    );

    ws.onmessage = (event) => {
      setLogs((current) => `${current}${event.data}`);
    };
    ws.onerror = () => {
      setLogs((current) => `${current}\n[dashboard] log stream connection error\n`);
    };

    wsRef.current = ws;
    return () => ws.close();
  }, [selectedId]);

  const createProject = async () => {
    setLoadingAction('create');
    setError('');
    try {
      await api('/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ name, template: 'basic-web' }),
      });
      await refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const startProject = async () => {
    if (!selectedId) {
      return;
    }
    setLoadingAction('start');
    setError('');
    try {
      await api(`/v1/projects/${encodeURIComponent(selectedId)}/start`, {
        method: 'POST',
      });
      await refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const stopProject = async () => {
    if (!selectedId) {
      return;
    }
    setLoadingAction('stop');
    setError('');
    try {
      await api(`/v1/projects/${encodeURIComponent(selectedId)}/stop`, {
        method: 'POST',
      });
      await refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const selectedCreatedAt = selected
    ? new Date(selected.createdAt).toLocaleString()
    : '-';

  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 style={{ margin: 0, marginBottom: '8px' }}>AI Factory Dashboard</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Local Replit-like workspace controller (Docker + preview + logs)
      </p>
      <div
        style={{
          background: webReady ? '#e7f7ee' : '#fff8e7',
          border: webReady ? '1px solid #8fd1ac' : '1px solid #f3d288',
          padding: '8px',
          marginBottom: '12px',
        }}
      >
        <strong>{webReady ? 'Web Ready' : 'Web Warming Up'}</strong> — {warmupMessage}
      </div>

      <section style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          style={{ padding: '8px', minWidth: '260px' }}
        />
        <button onClick={createProject} disabled={loadingAction !== null} style={{ padding: '8px 12px' }}>
          {loadingAction === 'create' ? 'Creating...' : 'Create Project'}
        </button>
        <button onClick={startProject} disabled={loadingAction !== null || !selectedId} style={{ padding: '8px 12px' }}>
          {loadingAction === 'start' ? 'Starting...' : 'Start'}
        </button>
        <button onClick={stopProject} disabled={loadingAction !== null || !selectedId} style={{ padding: '8px 12px' }}>
          {loadingAction === 'stop' ? 'Stopping...' : 'Stop'}
        </button>
        <button onClick={() => refresh().catch((err) => setError(String(err)))} style={{ padding: '8px 12px' }}>
          Refresh
        </button>
      </section>

      {error && (
        <div style={{ background: '#ffe7e7', border: '1px solid #ffb9b9', padding: '8px', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <h2 style={{ marginTop: 0 }}>Projects</h2>
          {projects.length === 0 ? (
            <div style={{ border: '1px dashed #bbb', padding: '12px', marginBottom: '12px' }}>
              <p style={{ marginTop: 0 }}>No projects yet.</p>
              <button onClick={createProject} disabled={loadingAction !== null} style={{ padding: '8px 12px' }}>
                {loadingAction === 'create' ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          ) : null}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Running</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Healthy</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Port</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  style={{
                    cursor: 'pointer',
                    background: selectedId === project.id ? '#eef6ff' : 'transparent',
                  }}
                  onClick={() => setSelectedId(project.id)}
                >
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{project.name}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{project.running ? 'yes' : 'no'}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{project.healthy ? 'yes' : 'no'}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{project.port}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{new Date(project.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>
                    <a href={project.previewPath} target="_blank" rel="noreferrer" style={{ marginRight: '8px' }}>
                      Open Preview
                    </a>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(project.id);
                      }}
                      style={{ padding: '4px 8px' }}
                    >
                      Open Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <div><strong>Selected:</strong> {selected.name}</div>
              <div><strong>Running:</strong> {selected.running ? 'yes' : 'no'}</div>
              <div><strong>Healthy:</strong> {selected.healthy ? 'yes' : 'no'}</div>
              <div><strong>Port:</strong> {selected.port}</div>
              <div><strong>Created:</strong> {selectedCreatedAt}</div>
              <div>
                <a href={selected.previewPath} target="_blank" rel="noreferrer">
                  Open Preview
                </a>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ marginTop: 0 }}>Live Logs</h2>
          <pre
            style={{
              background: '#0f172a',
              color: '#e2e8f0',
              height: '420px',
              overflow: 'auto',
              padding: '12px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {selectedId ? logs || '[dashboard] waiting for logs...' : 'Select a project to stream logs'}
          </pre>
        </div>
      </section>
    </main>
  );
}
