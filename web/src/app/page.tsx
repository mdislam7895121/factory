import Link from 'next/link';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const navItems = ['Docs', 'Pricing', 'Security', 'Sign in'];

const trustPoints = ['Templates', 'Live previews', 'Live logs', 'Local-first dev'];

const howItWorks = [
  {
    title: 'Define the app',
    description: 'Start with a template and describe what your team needs to build.',
  },
  {
    title: 'Provision instantly',
    description: 'Factory provisions project runtime and preview infrastructure automatically.',
  },
  {
    title: 'Ship with confidence',
    description: 'Review logs, validate behavior, and move changes forward quickly.',
  },
];

const capabilities = [
  {
    title: 'Template-driven starts',
    description: 'Launch new workspaces from proven blueprints to reduce setup overhead.',
  },
  {
    title: 'Live preview environments',
    description: 'Open a running preview immediately to validate UX and integration details.',
  },
  {
    title: 'Streaming operational logs',
    description: 'Track runtime output in real time to identify issues before release.',
  },
  {
    title: 'Workspace-level isolation',
    description: 'Keep projects separated by workspace for cleaner tenant boundaries.',
  },
  {
    title: 'Preview readiness checks',
    description: 'Observe status clearly before sharing links with stakeholders.',
  },
  {
    title: 'Production-minded defaults',
    description: 'Use standards that keep local and CI environments aligned.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '$0',
    blurb: 'For individual exploration and fast prototypes.',
  },
  {
    name: 'Pro',
    price: '$29',
    blurb: 'For product teams shipping internal and customer-facing tools.',
  },
  {
    name: 'Enterprise',
    price: 'Contact',
    blurb: 'For organizations with security, governance, and scale requirements.',
  },
];

const securityItems = [
  'Audit log traceability for critical actions',
  'Least-privilege access model baseline',
  'Secret handling baseline for environment variables',
  'Health checks across API, web, and orchestrator',
];

const faqs = [
  {
    q: 'What does Factory manage?',
    a: 'Factory manages templates, workspace project provisioning, preview endpoints, and runtime logs.',
  },
  {
    q: 'Can teams use it locally first?',
    a: 'Yes. Factory is designed for local-first development with clear parity checks.',
  },
  {
    q: 'Is dashboard functionality changed by this page?',
    a: 'No. The dashboard remains the app area; this is only a marketing-grade public landing.',
  },
  {
    q: 'How do we evaluate security posture?',
    a: 'Review the security and reliability section, then validate runbooks and CI checks in-repo.',
  },
];

export default function Home() {
  const isAuthenticated = false;

  return (
    <main className="factory landing-shell">
      <div className="landing-container">
        <header className="landing-nav">
          <div className="landing-brand">Factory</div>
          <nav className="landing-nav-items" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item} href="#" className="landing-nav-link">{item}</a>
            ))}
          </nav>
          <Link href="/dashboard" className="ds-btn ds-btn-primary ds-btn-md landing-nav-cta" style={{ textDecoration: 'none' }}>
            Open dashboard
          </Link>
        </header>

        <section className="landing-hero ds-card">
          <Badge className="text-small" style={{ marginBottom: '14px' }}>Public SaaS</Badge>
          <h1 className="landing-hero-title">Build, preview, and ship product-grade apps from one Factory workflow</h1>
          <p className="landing-hero-subhead">
            Factory helps teams move from templates to provisioned environments, live previews, and streaming logs
            with clear operational visibility from day one.
          </p>
          <div className="landing-hero-cta-row">
            <Link
              href="/dashboard"
              className="ds-btn ds-btn-primary ds-btn-md"
              style={{ minWidth: '220px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isAuthenticated ? 'Open dashboard' : 'Open dashboard'}
            </Link>
            <Link
              href="/factory-preview"
              className="ds-btn ds-btn-secondary ds-btn-md"
              style={{ minWidth: '180px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              View preview
            </Link>
          </div>
          <div className="landing-trust-row">
            {trustPoints.map((point) => (
              <span key={point} className="landing-trust-chip">{point}</span>
            ))}
          </div>
        </section>

        <Card className="landing-window-card">
          <div className="landing-window-frame">
            <div className="landing-window-head">
              <span className="landing-dot" />
              <span className="landing-dot" />
              <span className="landing-dot" />
              <span className="landing-window-title">factory-preview / live logs</span>
            </div>
            <pre className="landing-window-body">{`[preview] project: onboarding-portal
[preview] status: ready (200)
[log] build completed in 14.8s
[log] ws stream connected
[log] healthcheck passed: api/web/orchestrator
[preview] url: /factory-preview
[ops] last deploy check: green`}</pre>
          </div>
        </Card>

        <section className="landing-section-block">
          <h2>How it works</h2>
          <div className="landing-step-grid">
            {howItWorks.map((step, index) => (
              <Card key={step.title}>
                <div className="landing-step-head">
                  <Badge>{String(index + 1).padStart(2, '0')}</Badge>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="landing-section-block">
          <h2>Core capabilities</h2>
          <div className="landing-cap-grid">
            {capabilities.map((feature) => (
              <Card key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="landing-section-block">
          <h2>Pricing</h2>
          <div className="landing-pricing-grid">
            {pricing.map((tier) => (
              <Card key={tier.name}>
                <h3>{tier.name}</h3>
                <p className="landing-price">{tier.price}</p>
                <p>{tier.blurb}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card>
          <h2>Security + reliability</h2>
          <ul className="landing-list">
            {securityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2>FAQ</h2>
          <div className="landing-faq-grid">
            {faqs.map((entry) => (
              <article key={entry.q} className="landing-faq-item">
                <h3>{entry.q}</h3>
                <p>{entry.a}</p>
              </article>
            ))}
          </div>
        </Card>

        <footer className="landing-footer">
          <a href="#">Docs</a>
          <a href="#">GitHub</a>
          <a href="#">Status</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </footer>
      </div>
    </main>
  );
}
