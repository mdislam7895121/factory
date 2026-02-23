import Link from 'next/link';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { RecentProjects } from './recent-projects';
import { ThemeToggle } from './theme-toggle';

type Template = {
  id: string;
  name?: string;
};

type TemplatesResponse = {
  ok: boolean;
  templates: Template[];
};

const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiBase = rawApiBase?.includes('api:')
  ? 'http://api:4000'
  : rawApiBase ?? 'http://localhost:4000';

async function loadTemplates(): Promise<Template[]> {
  try {
    const response = await fetch(`${apiBase}/v1/templates`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as TemplatesResponse;
    if (!data.ok || !Array.isArray(data.templates)) {
      return [];
    }

    return data.templates;
  } catch {
    return [];
  }
}

export default async function Home() {
  const templates = await loadTemplates();

  return (
    <main className="factory builder-shell builder-shell-premium">
      <div className="builder-container">
        <header className="builder-header fade-up">
          <p className="builder-brand">Factory Builder</p>
          <div className="builder-header-right">
            <ThemeToggle />
            <Link href="/dashboard" className="ds-btn ds-btn-secondary ds-btn-sm" style={{ textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </header>

        <section className="builder-hero builder-section">
          <Badge className="text-small" style={{ marginBottom: '10px' }}>Customer-first home</Badge>
          <h1 className="builder-hero-title">Describe what you want to build</h1>
          <p className="builder-hero-subtitle">
            Start with a prompt, pick a template, and continue from recent projects without changing dashboard flows.
          </p>

          <div className="builder-prompt-grid">
            <Card className="builder-prompt builder-glass fade-up" style={{ animationDelay: '80ms' }}>
              <h3>Prompt</h3>
              <textarea
                className="ds-input builder-textarea"
                placeholder="Create a multi-tenant onboarding tool with approval flows and a workspace-level activity log..."
                defaultValue=""
              />
              <div className="builder-actions">
                <Link href="/dashboard/workspaces" className="ds-btn ds-btn-primary ds-btn-md" style={{ textDecoration: 'none' }}>
                  Start from prompt
                </Link>
                <Link href="/factory-preview" className="ds-btn ds-btn-secondary ds-btn-md" style={{ textDecoration: 'none' }}>
                  Open preview
                </Link>
              </div>
            </Card>

            <Card className="builder-template-panel fade-up" style={{ animationDelay: '140ms' }}>
              <h3>Templates</h3>
              <ul className="builder-template-grid">
                {templates.length === 0 ? (
                  <li className="builder-template-card">
                    <div>
                      <p className="builder-template-name">No templates available</p>
                      <p className="builder-template-meta">Template registry is empty.</p>
                    </div>
                  </li>
                ) : (
                  templates.map((template) => (
                    <li key={template.id} className="builder-template-card">
                      <div>
                        <p className="builder-template-name">{template.name ?? template.id}</p>
                        <p className="builder-template-meta">{template.id}</p>
                      </div>
                      <button type="button" className="ds-btn ds-btn-ghost ds-btn-sm">Use</button>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>
        </section>

        <Card className="builder-recent-panel fade-up" style={{ animationDelay: '200ms' }}>
          <h3>Recent projects</h3>
          <RecentProjects />
        </Card>
      </div>
    </main>
  );
}
