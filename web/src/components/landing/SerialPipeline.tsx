const serials = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'SERIAL 06',
  'SERIAL 07',
  'SERIAL 08',
  'SERIAL 09',
  'SERIAL 10',
  'SERIAL I',
];

export default function SerialPipeline() {
  return (
    <section className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">
      <h2 className="text-2xl font-bold text-[#F3F4F6]">Serial Pipeline</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">
        Static UI timeline showing disciplined, proof-first serial delivery.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {serials.map((serial) => {
          const completed = serial !== 'SERIAL I';
          return (
            <div
              key={serial}
              className="rounded-lg border border-[#1f2937] bg-[#0B1220] px-3 py-2"
            >
              <p className="text-sm font-semibold text-[#F3F4F6]">{serial}</p>
              <p
                className={`mt-1 inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                  completed
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : 'bg-[#2563EB]/20 text-[#22D3EE]'
                }`}
              >
                {completed ? 'Completed' : 'In Progress'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
