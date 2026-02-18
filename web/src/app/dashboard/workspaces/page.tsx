'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectCount: number;
};

type Template = { id: string };

type Project = {
  id: string;
  name: string;
  templateId: string;
  status: 'QUEUED' | 'RUNNING' | 'READY' | 'FAILED';
  previewUrl: string | null;
  logsRef: string | null;
  createdAt: string;
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

export default function WorkspaceDashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>('My Workspace');
  const [projectName, setProjectName] = useState<string>('My Project');
  const [templateId, setTemplateId] = useState<string>('basic-web');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<'workspace' | 'project' | null>(null);

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? null,
    [workspaces, selectedWorkspaceId],
  );

  const refreshWorkspaces = async () => {
    const data = await api<{ ok: boolean; workspaces: Workspace[] }>('/v1/workspaces');
    setWorkspaces(data.workspaces);
    if (!selectedWorkspaceId && data.workspaces.length > 0) {
      setSelectedWorkspaceId(data.workspaces[0].id);
    }
  };

  const refreshTemplates = async () => {
    const data = await api<{ ok: boolean; templates: Template[] }>('/v1/templates');
    setTemplates(data.templates);
    if (data.templates.length > 0) {
      setTemplateId((current) => {
        if (data.templates.some((template) => template.id === current)) {
          return current;
        }
        return data.templates[0].id;
      });
    }
  };

  const refreshProjects = async (workspaceId: string) => {
    const data = await api<{ ok: boolean; projects: Project[] }>(`/v1/workspaces/${encodeURIComponent(workspaceId)}/projects`);
    setProjects(data.projects);
  };

  useEffect(() => {
    refreshWorkspaces().catch((err) => setError(String(err)));
    refreshTemplates().catch((err) => setError(String(err)));
  }, []);

  useEffect(() => {
    if (!selectedWorkspaceId) {
      setProjects([]);
      return;
    }

    refreshProjects(selectedWorkspaceId).catch((err) => setError(String(err)));
  }, [selectedWorkspaceId]);

  const createWorkspace = async () => {
    setLoading('workspace');
    setError('');
    setMessage('');

    try {
      const created = await api<{ ok: boolean; workspace: Workspace }>('/v1/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: workspaceName }),
      });

      await refreshWorkspaces();
      setSelectedWorkspaceId(created.workspace.id);
      setMessage(`Workspace created: ${created.workspace.name}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(null);
    }
  };

  const createProject = async () => {
    if (!selectedWorkspaceId) {
      setError('Create/select a workspace first');
      return;
    }

    setLoading('project');
    setError('');
    setMessage('');

    try {
      const created = await api<{ ok: boolean; project: Project }>(
        `/v1/workspaces/${encodeURIComponent(selectedWorkspaceId)}/projects`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: projectName,
            templateId,
          }),
        },
      );

      await refreshProjects(selectedWorkspaceId);
      setMessage(`Project created: ${created.project.name}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="factory" style={{ padding: '24px' }}>
      <h1 style={{ marginTop: 0 }}>Workspace + Project Provisioning (SERIAL 11)</h1>
      <p style={{ color: '#555' }}>
        Tenant boundary MVP: create workspace, create project from template, provision, open preview/logs.
      </p>
      <div style={{ marginBottom: '12px' }}>
        <Link href="/dashboard">Back to Dashboard</Link>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.14)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '8px', marginBottom: '12px', borderRadius: '12px' }}>
          <Badge variant="danger" style={{ marginRight: '8px' }}>Error</Badge>
          {error}
        </div>
      )}
      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '8px', marginBottom: '12px', borderRadius: '12px' }}>
          <Badge variant="success" style={{ marginRight: '8px' }}>Success</Badge>
          {message}
        </div>
      )}

      <section style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '14px' }}>
        <h2 style={{ marginTop: 0 }}>1) Create Workspace</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            placeholder="Workspace name"
            style={{ minWidth: '280px' }}
          />
          <Button onClick={createWorkspace} disabled={loading !== null} variant="primary">
            {loading === 'workspace' ? 'Creating...' : 'Create Workspace'}
          </Button>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '14px' }}>
        <h2 style={{ marginTop: 0 }}>2) Select Workspace</h2>
        {workspaces.length === 0 ? (
          <div>No workspaces yet.</div>
        ) : (
          <select
            value={selectedWorkspaceId}
            onChange={(event) => setSelectedWorkspaceId(event.target.value)}
            style={{ padding: '8px', minWidth: '320px' }}
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name} ({workspace.projectCount} projects)
              </option>
            ))}
          </select>
        )}
      </section>

      <section style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '14px' }}>
        <h2 style={{ marginTop: 0 }}>3) Create Project from Template</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
            style={{ minWidth: '220px' }}
          />
          <select value={templateId} onChange={(event) => setTemplateId(event.target.value)} style={{ padding: '8px' }}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.id}</option>
            ))}
          </select>
          <Button
            onClick={createProject}
            disabled={loading !== null || !selectedWorkspaceId}
            variant="secondary"
          >
            {loading === 'project' ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: '12px' }}>
        <h2 style={{ marginTop: 0 }}>Projects in Workspace</h2>
        {selectedWorkspace ? (
          <p style={{ marginTop: 0, color: '#555' }}>
            Selected workspace: <strong>{selectedWorkspace.name}</strong>
          </p>
        ) : null}
        {projects.length === 0 ? (
          <div>No projects yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Template</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Status</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{project.name}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{project.templateId}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{project.status}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>
                    <Link href={`/dashboard/projects/${project.id}`}>Open Project</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
