const rows = [
  {
    label: 'Delivery model',
    others: 'Ad-hoc feature pushes',
    factory: 'Serialized, proof-first execution',
  },
  {
    label: 'CI controls',
    others: 'Optional checks',
    factory: 'Required gates before merge',
  },
  {
    label: 'Reproducibility',
    others: 'Manual steps and drift',
    factory: 'Scripted and repeatable workflows',
  },
  {
    label: 'Operational visibility',
    others: 'Partial logs and status',
    factory: 'Centralized proof + monitoring posture',
  },
];

export default function ComparisonSection() {
  return (
    <section className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">
      <h2 className="text-2xl font-bold text-[#F3F4F6]">Why Factory Is Different</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">
        Built for disciplined teams shipping under reliability and compliance pressure.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#1f2937] text-left text-[#9CA3AF]">
              <th className="px-3 py-2 font-medium">Dimension</th>
              <th className="px-3 py-2 font-medium">Others</th>
              <th className="px-3 py-2 font-medium">Factory</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[#1f2937]/70">
                <td className="px-3 py-2 text-[#F3F4F6]">{row.label}</td>
                <td className="px-3 py-2 text-[#9CA3AF]">{row.others}</td>
                <td className="px-3 py-2 text-[#22D3EE]">{row.factory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
