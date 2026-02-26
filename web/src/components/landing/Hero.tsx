import Link from 'next/link';

export default function Hero() {
  return (
    <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1f2937] bg-[#111827] px-3 py-1 text-xs font-medium text-[#9CA3AF]">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          Factory Control Plane Online
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-[#F3F4F6] md:text-5xl">
          Build Production-Ready Web &amp; Mobile Apps With AI
        </h1>
        <p className="mt-4 text-lg text-[#9CA3AF]">
          Prompt. Generate. Validate. Deploy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-md border border-[#2563EB] bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-shadow duration-200 hover:shadow-[0_0_18px_rgba(37,99,235,0.35)]">
            Start Factory Build
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-[#374151] bg-transparent px-5 py-3 text-sm font-semibold text-[#F3F4F6] transition-colors duration-200 hover:bg-[#111827]"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between text-xs text-[#9CA3AF]">
          <span>factory-preview-panel</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            CI checks passed
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#1f2937] bg-[#0B1220] p-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-[#9CA3AF]">Terminal</p>
            <pre className="space-y-1 text-xs text-[#D1D5DB]">
              <div>$ factory generate --serial I</div>
              <div>[ok] spec validated</div>
              <div>[ok] build passed</div>
              <div>[ok] smoke tests green</div>
              <div className="text-[#10B981]">[ok] deployed / preview ready</div>
            </pre>
          </div>

          <div className="rounded-lg border border-[#1f2937] bg-[#0B1220] p-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-[#9CA3AF]">Preview Window</p>
            <div className="h-32 rounded border border-[#1f2937] bg-[#111827] p-2 text-xs text-[#9CA3AF]">
              <div className="mb-2 h-2 w-24 rounded bg-[#1f2937]" />
              <div className="mb-1 h-2 w-40 rounded bg-[#1f2937]" />
              <div className="mb-1 h-2 w-36 rounded bg-[#1f2937]" />
              <div className="mt-3 inline-flex items-center rounded bg-[#0f172a] px-2 py-1 text-[10px] text-[#22D3EE]">
                /p/project-id live
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
