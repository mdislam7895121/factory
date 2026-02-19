'use client';

import { useEffect, useMemo, useState } from 'react';

type PublicProject = {
  projectId: string;
  templateId: string;
  status: 'provisioning' | 'booting' | 'running' | 'failed' | string;
  previewUrl: string | null;
};

const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiBase = rawApiBase?.includes('api:') ? 'http://localhost:4000' : rawApiBase ?? 'http://localhost:4000';

const templateOptions = [
  { id: 'nextjs-basic', label: 'Next.js Basic' },
  { id: 'basic-web', label: 'Basic Web' },
];

export function PublicProvisioningWidget() {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState('nextjs-basic');
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<PublicProject | null>(null);
  const [error, setError] = useState<string>('');

  const canOpenPreview = project?.status === 'running' && Boolean(project.previewUrl);

  const statusLabel = useMemo(() => {
    if (!project) {
      return 'idle';
    }
    return project.status;
  }, [project]);

  useEffect(() => {
    if (!project?.projectId) {
      return;
    }
    if (project.status === 'running' || project.status === 'failed') {
      return;
    }

    const timer = setInterval(async () => {
      try {
        const response = await fetch(`${apiBase}/v1/projects/${encodeURIComponent(project.projectId)}`);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const payload = (await response.json()) as PublicProject;
        setProject(payload);
      } catch (err) {
        setError(String(err));
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [project]);

  const createProject = async () => {
    setSubmitting(true);
    setError('');
    try {
      const createResponse = await fetch(`${apiBase}/v1/projects`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      if (!createResponse.ok) {
        const body = await createResponse.text().catch(() => '');
        throw new Error(`${createResponse.status} ${createResponse.statusText}${body ? ` - ${body}` : ''}`);
      }

      const created = (await createResponse.json()) as { projectId: string; status: string };
      const statusResponse = await fetch(`${apiBase}/v1/projects/${encodeURIComponent(created.projectId)}`);
      if (!statusResponse.ok) {
        throw new Error(`${statusResponse.status} ${statusResponse.statusText}`);
      }

      const statusPayload = (await statusResponse.json()) as PublicProject;
      setProject(statusPayload);
      setOpen(false);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ marginBottom: '14px', border: '1px solid #ddd', borderRadius: '12px', padding: '12px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="ds-btn ds-btn-primary ds-btn-sm" onClick={() => setOpen(true)}>
          Create Project
        </button>
        <span
          data-testid="public-project-status"
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid #4b5563',
            fontSize: '12px',
          }}
        >
          Status: {statusLabel}
        </span>
        <a
          href={canOpenPreview ? project?.previewUrl ?? '#' : '#'}
          target="_blank"
          rel="noreferrer"
          className="ds-btn ds-btn-secondary ds-btn-sm"
          aria-disabled={!canOpenPreview}
          style={{ pointerEvents: canOpenPreview ? 'auto' : 'none', opacity: canOpenPreview ? 1 : 0.5 }}
        >
          Open Preview
        </a>
      </div>

      {project ? (
        <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '13px', color: '#9ca3af' }}>
          Project ID: {project.projectId}
        </p>
      ) : null}

      {error ? (
        <p style={{ marginTop: '10px', marginBottom: 0, color: '#ef4444', fontSize: '13px' }}>{error}</p>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            marginTop: '12px',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '12px',
            background: '#0f172a',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Create Project</h3>
          <p style={{ marginTop: 0, color: '#9ca3af', fontSize: '13px' }}>Select template and start provisioning.</p>
          <select
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            style={{ padding: '8px', minWidth: '220px', marginBottom: '10px' }}
          >
            {templateOptions.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="ds-btn ds-btn-primary ds-btn-sm" disabled={submitting} onClick={createProject}>
              {submitting ? 'Provisioning...' : 'Provision'}
            </button>
            <button type="button" className="ds-btn ds-btn-secondary ds-btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
