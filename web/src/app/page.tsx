import Link from 'next/link';

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
    <main className="factory-ui" style={{ padding: '48px 24px 64px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <section
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
            borderRadius: '18px',
            padding: '40px 32px',
            marginBottom: '24px',
          }}
        >
          <p style={{ margin: '0 0 12px', fontSize: '14px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Public SaaS Preview
          </p>
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '220px',
                padding: '12px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                border: '1px solid #3f5a82',
                background: '#2a4266',
                color: 'var(--fg)',
                fontWeight: 600,
              }}
            >
              {isAuthenticated ? 'Open dashboard' : 'Get started — Open dashboard'}
            </Link>
            <Link
              href="/factory-preview"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '180px',
                padding: '12px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                border: '1px solid var(--border)',
                background: '#1d2838',
                color: 'var(--fg)',
                fontWeight: 600,
              }}
            >
              View preview
            </Link>
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '1.5rem' }}>Core capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {features.map((feature) => (
              <article key={feature.title} style={{ padding: '18px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{feature.title}</h3>
                <p style={{ margin: 0, lineHeight: 1.55 }}>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.4rem' }}>How it works</h2>
          <ol style={{ margin: 0, paddingLeft: '22px', display: 'grid', gap: '8px' }}>
            {steps.map((step) => (
              <li key={step} style={{ lineHeight: 1.55 }}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
