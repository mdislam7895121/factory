import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { CopyCommandButton } from './copy-command-button';

const repoUrl = 'https://github.com/mdislam7895121/factory';
const docsUrl = `${repoUrl}/blob/main/docs`;
const demoDocUrl = `${docsUrl}/DEMO_WORKFLOW.md`;
const architectureDocUrl = `${docsUrl}/ARCHITECTURE.md`;
const productionApiBase = process.env.NEXT_PUBLIC_PROD_API_BASE ?? 'https://factory-production-production.up.railway.app';
export const revalidate = 60;

type EndpointResult = {
  ok: boolean;
  status: number | null;
  data: unknown;
};

async function getEndpoint(path: string): Promise<EndpointResult> {
  try {
    const response = await fetch(`${productionApiBase}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    });

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: null, data: null };
  }
}

function countTemplates(data: unknown): number | null {
  if (Array.isArray(data)) return data.length;
  if (!data || typeof data !== 'object') return null;

  const maybeObject = data as { templates?: unknown; items?: unknown; data?: unknown };
  if (Array.isArray(maybeObject.templates)) return maybeObject.templates.length;
  if (Array.isArray(maybeObject.items)) return maybeObject.items.length;
  if (Array.isArray(maybeObject.data)) return maybeObject.data.length;
  return null;
}

function badge(ok: boolean) {
  return ok ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--danger)]/15 text-[var(--danger)]';
}

export default async function Home() {
  const [dbHealth, ready, templates] = await Promise.all([
    getEndpoint('/db/health'),
    getEndpoint('/ready'),
    getEndpoint('/v1/templates'),
  ]);

  const templatesCount = countTemplates(templates.data);
  const updatedAt = new Date().toISOString();

  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="text-lg font-semibold transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Factory Platform</Link>
          <nav className="hidden items-center gap-4 text-sm text-[var(--text-muted)] md:flex">
            <a href={demoDocUrl} target="_blank" rel="noreferrer" className="transition-all duration-200 ease-out hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Docs</a>
            <a href={demoDocUrl} target="_blank" rel="noreferrer" className="transition-all duration-200 ease-out hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Demo</a>
            <a href={architectureDocUrl} target="_blank" rel="noreferrer" className="transition-all duration-200 ease-out hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Architecture</a>
            <a href="#status" className="transition-all duration-200 ease-out hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Status</a>
            <a href={repoUrl} target="_blank" rel="noreferrer" className="transition-all duration-200 ease-out hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">GitHub</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 sm:px-6">
        <section aria-labelledby="hero-title" className="grid gap-6 lg:grid-cols-2">
          <div className="hero-noise min-h-[22rem] space-y-4 rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Factory Platform</p>
            <h1 id="hero-title" className="text-4xl font-semibold tracking-tight leading-[1.18] sm:text-5xl">Ship production-ready full-stack products with a proof-first workflow.</h1>
            <p className="max-w-2xl text-lg text-[var(--text-muted)]">Factory combines templates, orchestration, and release evidence so teams can move quickly without losing operational control.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Launch Factory</Link>
              <a href={demoDocUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold transition-all duration-200 ease-out hover:bg-[var(--bg-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">View demo guide</a>
            </div>
          </div>
          <aside className="min-h-[22rem] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)]">
            <h2 id="pipeline-preview-title" className="mb-3 text-sm font-semibold text-[var(--text-muted)]">Pipeline preview</h2>
            <ol className="grid gap-2 text-sm text-[var(--text-muted)]">
              <li>1. Select generation template</li>
              <li>2. Validate local health checks</li>
              <li>3. Create PR with proof artifacts</li>
              <li>4. Deploy and verify production endpoints</li>
            </ol>
          </aside>
        </section>

        <section aria-labelledby="trust-bar-title" className="flex flex-wrap gap-2">
          <h2 id="trust-bar-title" className="sr-only">Platform capabilities</h2>
          {['Next.js App Router', 'Nest API', 'Prisma + PostgreSQL', 'Netlify + Railway', 'Proof-first CI', 'Ops readiness checks'].map((item) => (
            <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">{item}</span>
          ))}
        </section>

        <section aria-labelledby="problem-solution-title" className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] md:grid-cols-2">
          <h2 id="problem-solution-title" className="sr-only">Problem and solution</h2>
          <div>
            <h3 className="mb-2 text-2xl font-semibold">Problem</h3>
            <p className="max-w-2xl text-[var(--text-muted)]">Teams lose confidence when deployment speed grows faster than verification discipline.</p>
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-semibold">Solution</h3>
            <p className="max-w-2xl text-[var(--text-muted)]">Factory enforces repeatable delivery with built-in readiness checks, template workflows, and proof artifacts.</p>
          </div>
        </section>

        <section aria-labelledby="capabilities-title" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <h2 id="capabilities-title" className="sr-only">Core capabilities</h2>
          {[
            'Template-driven generation',
            'Deterministic local demos',
            'Production readiness endpoints',
            'Netlify web deployment',
            'Railway API operations',
            'PR-gated verification logs',
          ].map((capability) => (
            <article key={capability} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)]">
              <h3 className="text-lg font-semibold">{capability}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Production-grade defaults with focused, auditable changes.</p>
            </article>
          ))}
        </section>

        <section id="status" aria-labelledby="status-title" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <h2 id="status-title" className="mb-4 text-2xl font-semibold">Live production status</h2>
          <div className="grid gap-3 text-sm">
            {[
              { name: '/db/health', result: dbHealth, detail: null },
              { name: '/ready', result: ready, detail: null },
              { name: '/v1/templates', result: templates, detail: templatesCount },
            ].map((item) => (
              <div key={item.name} className="flex min-h-[74px] items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {item.detail !== null ? `Template count: ${item.detail}` : `HTTP: ${item.result.status ?? 'Unavailable'}`}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(item.result.ok)}`}>
                  {item.result.ok ? 'OK' : 'Unavailable'}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">Last updated: {updatedAt}</p>
        </section>

        <section aria-labelledby="how-it-works-title" className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] md:grid-cols-2">
          <div>
            <h2 id="how-it-works-title" className="mb-3 text-2xl font-semibold">How it works</h2>
            <ol className="grid max-w-2xl gap-2 text-[var(--text-muted)]">
              <li>1. Start the local stack and run health checks.</li>
              <li>2. Apply focused changes on feature branches.</li>
              <li>3. Merge with proof files and deploy verification.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold">Demo commands</p>
              <CopyCommandButton value={`scripts/demo.ps1\nscripts/preview-up.ps1\ncurl -i ${productionApiBase}/ready`} />
            </div>
            <pre className="overflow-x-auto text-xs text-[var(--text-muted)]">scripts/demo.ps1
scripts/preview-up.ps1
curl -i {productionApiBase}/ready</pre>
          </div>
        </section>

        <section aria-labelledby="engineering-title" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <h2 id="engineering-title" className="mb-3 text-2xl font-semibold">Engineering philosophy</h2>
          <p className="max-w-2xl text-[var(--text-muted)]">Proof-first engineering keeps shipping quality high: every claim is backed by reproducible evidence in `proof/runs/`.</p>
        </section>

        <section aria-labelledby="demo-title" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <h2 id="demo-title" className="mb-3 text-2xl font-semibold">Demo</h2>
          <p className="max-w-2xl text-[var(--text-muted)]">Run the guided workflow and evidence capture from the demo documentation.</p>
          <a href={demoDocUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium transition-all duration-200 ease-out hover:bg-[var(--card)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">Open DEMO_WORKFLOW.md</a>
        </section>

        <section aria-labelledby="faq-title" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <h2 id="faq-title" className="mb-4 text-2xl font-semibold">FAQ</h2>
          <div className="grid gap-4 text-sm text-[var(--text-muted)]">
            <div>
              <p className="font-semibold text-[var(--text)]">Is this production-safe?</p>
              <p>Yes, the platform tracks readiness with explicit health endpoints and proof-gated merges.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--text)]">Can I verify deployment quickly?</p>
              <p>Use `scripts/prod-smoke.ps1` and check `/ready`, `/db/health`, and `/v1/templates`.</p>
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--border)] py-4 text-sm text-[var(--text-muted)]">
          Factory Platform · <a href={`${repoUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer" className="underline underline-offset-4 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-[var(--primary)]">MIT License</a>
        </footer>
      </div>
    </main>
  );
}
