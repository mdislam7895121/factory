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
  const [loading, setLoading] = useState<boolean>(false);
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
    refresh().catch((err) => setError(String(err)));
    const interval = setInterval(() => {
      refresh().catch(() => {
      });
    }, 5000);
    return () => clearInterval(interval);
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const startProject = async () => {
    if (!selectedId) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api(`/v1/projects/${encodeURIComponent(selectedId)}/start`, {
        method: 'POST',
      });
      await refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const stopProject = async () => {
    if (!selectedId) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api(`/v1/projects/${encodeURIComponent(selectedId)}/stop`, {
        method: 'POST',
      });
      await refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 style={{ margin: 0, marginBottom: '8px' }}>AI Factory Dashboard</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Local Replit-like workspace controller (Docker + preview + logs)
      </p>

      <section style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          style={{ padding: '8px', minWidth: '260px' }}
        />
        <button onClick={createProject} disabled={loading} style={{ padding: '8px 12px' }}>
          Create Project
        </button>
        <button onClick={startProject} disabled={loading || !selectedId} style={{ padding: '8px 12px' }}>
          Start
        </button>
        <button onClick={stopProject} disabled={loading || !selectedId} style={{ padding: '8px 12px' }}>
          Stop
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Port</th>
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
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>
                    {project.running ? (project.healthy ? 'healthy' : 'running') : 'stopped'}
                  </td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid #f0f0f0' }}>{project.port}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected && (
            <p style={{ marginTop: '10px' }}>
              Preview:{' '}
              <a href={selected.previewPath} target="_blank" rel="noreferrer">
                {selected.previewPath}
              </a>
            </p>
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
