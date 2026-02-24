import Link from 'next/link';
import { Card } from '../components/ui/Card';

const repoUrl = 'https://github.com/mdislam7895121/factory';
const demoDocUrl = `${repoUrl}/blob/main/docs/DEMO_WORKFLOW.md`;
const architectureDocUrl = `${repoUrl}/blob/main/docs/ARCHITECTURE.md`;
const productionReadyUrl = 'https://factory-production-production.up.railway.app/ready';

export default function Home() {
  return (
    <main className="factory builder-shell builder-shell-premium">
      <div className="builder-container" style={{ paddingTop: '32px', paddingBottom: '32px', display: 'grid', gap: '18px' }}>
        <section className="builder-section fade-up" style={{ display: 'grid', gap: '12px' }}>
          <p className="builder-brand">Factory Platform</p>
          <h1 className="builder-hero-title" style={{ margin: 0 }}>Ship full-stack products from one guided workspace.</h1>
          <p className="builder-hero-subtitle" style={{ margin: 0 }}>
            Factory provides a proof-first workflow for local development, production readiness, and repeatable delivery.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="ds-btn ds-btn-primary ds-btn-md" style={{ textDecoration: 'none' }}>
              Open dashboard
            </Link>
            <Link href="/factory-preview" className="ds-btn ds-btn-secondary ds-btn-md" style={{ textDecoration: 'none' }}>
              View factory preview
            </Link>
          </div>
        </section>

        <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <Card className="fade-up" style={{ animationDelay: '60ms' }}>
            <h3 className="ds-card-title">What it is</h3>
            <p className="ds-card-subtitle">A platform workspace that combines API, web UI, templates, and orchestration into one delivery pipeline.</p>
          </Card>

          <Card className="fade-up" style={{ animationDelay: '90ms' }}>
            <h3 className="ds-card-title">Who it&rsquo;s for</h3>
            <p className="ds-card-subtitle">Platform teams, product engineers, and operators who need predictable delivery with evidence at every step.</p>
          </Card>

          <Card className="fade-up" style={{ animationDelay: '120ms' }}>
            <h3 className="ds-card-title">How it works</h3>
            <p className="ds-card-subtitle">Start local services, validate readiness, select templates, and execute PR-based changes with proof artifacts.</p>
          </Card>
        </div>

        <Card className="fade-up" style={{ animationDelay: '150ms' }}>
          <h3 className="ds-card-title">Demo steps</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
            <li>Run <strong>scripts/demo.ps1</strong> (or <strong>scripts/demo.sh</strong>) from repo root.</li>
            <li>Confirm local checks for <strong>/db/health</strong>, <strong>/ready</strong>, and <strong>/v1/templates</strong>.</li>
            <li>Open the web app at <strong>http://localhost:3000</strong> and continue in the dashboard.</li>
          </ol>
        </Card>

        <Card className="fade-up" style={{ animationDelay: '180ms' }}>
          <h3 className="ds-card-title">Architecture highlights</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
            <li>Next.js web app for dashboard and public entrypoint.</li>
            <li>Nest API with readiness and health endpoints.</li>
            <li>PostgreSQL-backed local stack via Docker Compose.</li>
            <li>Proof-first scripts for local validation and CI gating.</li>
          </ul>
        </Card>

        <Card className="fade-up" style={{ animationDelay: '210ms' }}>
          <h3 className="ds-card-title">Links</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
            <li><a href={repoUrl} target="_blank" rel="noreferrer">GitHub repository</a></li>
            <li><a href={demoDocUrl} target="_blank" rel="noreferrer">Demo workflow documentation</a></li>
            <li><a href={architectureDocUrl} target="_blank" rel="noreferrer">Architecture documentation</a></li>
            <li><a href={productionReadyUrl} target="_blank" rel="noreferrer">Production API readiness endpoint</a></li>
          </ul>
        </Card>

        <footer style={{ color: 'var(--muted)', fontSize: '13px', padding: '4px 6px' }}>
          Factory Workspace · Licensed under MIT. See repository LICENSE for terms.
        </footer>
      </div>
    </main>
  );
}
