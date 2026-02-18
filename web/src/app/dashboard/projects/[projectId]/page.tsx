'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type ProvisioningRun = {
  id: string;
  status: 'RUNNING' | 'READY' | 'FAILED';
  error: string | null;
  createdAt: string;
  startedAt: string;
  finishedAt: string | null;
};

type Workspace = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  templateId: string;
  status: 'QUEUED' | 'RUNNING' | 'READY' | 'FAILED';
  previewUrl: string | null;
  logsRef: string | null;
  provisionError: string | null;
  workspace: Workspace;
  provisioningRuns: ProvisioningRun[];
};

const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiBase = rawApiBase?.includes('api:') ? 'http://localhost:4000' : rawApiBase ?? 'http://localhost:4000';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }

  return response.json();
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = String(params?.projectId ?? '');

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [provisioning, setProvisioning] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  const canProvision = useMemo(() => {
    if (!project) {
      return false;
    }
    return project.status === 'QUEUED' || project.status === 'FAILED' || project.status === 'RUNNING';
  }, [project]);

  const refreshProject = async () => {
    if (!projectId) {
      return;
    }

    const data = await api<{ ok: boolean; project: Project }>(`/v1/projects/${encodeURIComponent(projectId)}`);
    setProject(data.project);
  };

  useEffect(() => {
    refreshProject().catch((err) => setError(String(err)));

    const interval = setInterval(() => {
      refreshProject().catch((err) => setError(String(err)));
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [projectId]);

  useEffect(() => {
    if (!project?.logsRef) {
      wsRef.current?.close();
      return;
    }

    wsRef.current?.close();
    setLogs('');

    const ws = new WebSocket(project.logsRef);
    ws.onopen = () => {
      setLogs((current) => `${current}\n[project] logs stream connected\n`);
    };
    ws.onmessage = (event) => {
      setLogs((current) => `${current}${String(event.data)}`);
    };
    ws.onerror = () => {
      setLogs((current) => `${current}\n[project] logs stream error\n`);
    };
    ws.onclose = () => {
      setLogs((current) => `${current}\n[project] logs stream closed\n`);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [project?.logsRef]);

  const provision = async () => {
    if (!projectId) {
      return;
    }

    setProvisioning(true);
    setMessage('');
    setError('');

    try {
      const response = await api<{ ok: boolean; idempotent: boolean; status: string }>(
        `/v1/projects/${encodeURIComponent(projectId)}/provision`,
        { method: 'POST' },
      );
      setMessage(`Provision triggered (idempotent=${response.idempotent}, status=${response.status})`);
      await refreshProject();
    } catch (err) {
      setError(String(err));
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <main className="factory-ui" style={{ padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Project Provisioning</h1>
      <div style={{ marginBottom: '10px' }}>
        <Link href="/dashboard/workspaces">Back to Workspaces</Link>
      </div>

      {error && (
        <div style={{ background: '#ffe7e7', border: '1px solid #ffb9b9', padding: '8px', marginBottom: '12px' }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ background: '#e7f7ee', border: '1px solid #8fd1ac', padding: '8px', marginBottom: '12px' }}>
          {message}
        </div>
      )}

      {!project ? (
        <div>Loading project...</div>
      ) : (
        <>
          <section style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '14px' }}>
            <h2 style={{ marginTop: 0 }}>{project.name}</h2>
            <div><strong>Workspace:</strong> {project.workspace.name}</div>
            <div><strong>Template:</strong> {project.templateId}</div>
            <div><strong>Status:</strong> {project.status}</div>
            <div><strong>Preview URL:</strong> {project.previewUrl ? <a href={project.previewUrl} target="_blank" rel="noreferrer">{project.previewUrl}</a> : 'pending'}</div>
            <div><strong>Logs Ref:</strong> {project.logsRef ?? 'pending'}</div>
            <div><strong>Provision Error:</strong> {project.provisionError ?? 'none'}</div>
            <div style={{ marginTop: '10px' }}>
              <button onClick={provision} disabled={!canProvision || provisioning} style={{ padding: '8px 12px' }}>
                {provisioning ? 'Provisioning...' : 'Provision Project'}
              </button>
            </div>
          </section>

          <section style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '14px' }}>
            <h2 style={{ marginTop: 0 }}>Provisioning Runs</h2>
            {project.provisioningRuns.length === 0 ? (
              <div>No provisioning runs yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Status</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Started</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Finished</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {project.provisioningRuns.map((run) => (
                    <tr key={run.id}>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{run.status}</td>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{new Date(run.startedAt).toLocaleString()}</td>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{run.finishedAt ? new Date(run.finishedAt).toLocaleString() : '-'}</td>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{run.error ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={{ border: '1px solid #ddd', padding: '12px' }}>
            <h2 style={{ marginTop: 0 }}>Live Logs (Serial 09 hook)</h2>
            <pre
              style={{
                background: '#0f172a',
                color: '#e2e8f0',
                height: '360px',
                overflow: 'auto',
                padding: '12px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {logs || '[project] waiting for logs stream...'}
            </pre>
          </section>
        </>
      )}
    </main>
  );
}
