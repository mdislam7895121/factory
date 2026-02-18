import Link from 'next/link';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const features = [
  {
    title: 'Templates',
    description: 'Start from curated templates so teams can ship quickly without rebuilding common foundations.',
  },
  {
    title: 'Live preview',
    description: 'Provision and open a running preview instantly to validate UX and behavior before handoff.',
  },
  {
    title: 'Live logs',
    description: 'Track runtime events in real time to debug faster and keep delivery confidence high.',
  },
];

const steps = [
  'Choose a template and define your project.',
  'Provision infrastructure and launch preview.',
  'Review logs and iterate until ready to ship.',
];

export default function Home() {
  const isAuthenticated = false;

  return (
    <main className="factory" style={{ padding: '48px 24px 64px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <Card className="ds-card" style={{ marginBottom: '24px', padding: '40px 32px' }}>
          <Badge className="text-small" style={{ marginBottom: '12px' }}>Public SaaS Preview</Badge>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}>
            Build and ship apps with the Factory
          </h1>
          <p style={{ margin: 0, maxWidth: '760px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Start from templates, provision runtime environments, open live previews, and follow logs in real time.
            Factory gives teams a clear path from idea to shipped software.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '22px' }}>
            <Link
              href="/dashboard"
              className="ds-btn ds-btn-primary ds-btn-md"
              style={{ minWidth: '220px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isAuthenticated ? 'Open dashboard' : 'Get started — Open dashboard'}
            </Link>
            <Link
              href="/factory-preview"
              className="ds-btn ds-btn-secondary ds-btn-md"
              style={{ minWidth: '180px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              View preview
            </Link>
          </div>
        </Card>

        <section style={{ marginBottom: '24px', background: 'transparent', border: 'none', padding: 0 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '1.5rem' }}>Core capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {features.map((feature) => (
              <Card key={feature.title} style={{ padding: '18px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{feature.title}</h3>
                <p style={{ margin: 0, lineHeight: 1.55 }}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.4rem' }}>How it works</h2>
          <ol style={{ margin: 0, paddingLeft: '22px', display: 'grid', gap: '8px' }}>
            {steps.map((step) => (
              <li key={step} style={{ lineHeight: 1.55 }}>{step}</li>
            ))}
          </ol>
        </Card>
      </div>
    </main>
  );
}
