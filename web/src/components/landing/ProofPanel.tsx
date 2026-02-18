const statuses = [
  { label: 'CI Gate', value: 'PASS', tone: 'text-[#10B981] bg-[#10B981]/20' },
  { label: 'Git Tree', value: 'CLEAN', tone: 'text-[#22D3EE] bg-[#22D3EE]/20' },
  { label: 'Deployment', value: 'READY', tone: 'text-[#10B981] bg-[#10B981]/20' },
  { label: 'Monitoring', value: 'ACTIVE', tone: 'text-[#22D3EE] bg-[#22D3EE]/20' },
];

export default function ProofPanel() {
  return (
    <section className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">
      <h2 className="text-2xl font-bold text-[#F3F4F6]">Live Proof Panel</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">Static UI representation of production readiness signals.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map((item) => (
          <div key={item.label} className="rounded-lg border border-[#1f2937] bg-[#0B1220] p-4">
            <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{item.label}</p>
            <p className={`mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
