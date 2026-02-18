import Link from 'next/link';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { RecentProjects } from './recent-projects';
import { ThemeToggle } from './theme-toggle';

const templates = [
  {
    name: 'Customer Support Portal',
    meta: 'Auth + inbox + canned workflows',
  },
  {
    name: 'Internal Ops Dashboard',
    meta: 'Metrics + alerts + role-based access',
  },
  {
    name: 'Onboarding Assistant',
    meta: 'Guided setup + task automation',
  },
];

export default function Home() {
  return (
    <main className="factory builder-shell">
      <div className="builder-container">
        <header className="builder-header">
          <h1 className="builder-brand">Factory Builder</h1>
          <div className="builder-header-right">
            <ThemeToggle />
            <Link href="/dashboard" className="ds-btn ds-btn-secondary ds-btn-sm" style={{ textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </header>

        <section className="builder-hero ds-card">
          <Badge className="text-small" style={{ marginBottom: '10px' }}>Customer-first home</Badge>
          <h2>Describe what you want to build</h2>
          <p>
            Start with a prompt, pick a template, and continue from recent projects without changing dashboard flows.
          </p>

          <div className="builder-prompt-grid">
            <Card className="builder-prompt">
              <h3>Prompt</h3>
              <textarea
                className="ds-input"
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

            <Card>
              <h3>Templates</h3>
              <ul className="builder-template-list">
                {templates.map((template) => (
                  <li key={template.name} className="builder-template-item">
                    <div>
                      <p className="builder-template-name">{template.name}</p>
                      <p className="builder-template-meta">{template.meta}</p>
                    </div>
                    <button type="button" className="ds-btn ds-btn-ghost ds-btn-sm">Use</button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <Card>
          <h3>Recent projects</h3>
          <RecentProjects />
        </Card>
      </div>
    </main>
  );
}
