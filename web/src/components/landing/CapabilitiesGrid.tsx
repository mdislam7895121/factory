import type { ReactNode } from 'react';

type Capability = {
  title: string;
  description: string;
  icon: ReactNode;
};

const capabilities: Capability[] = [
  {
    title: 'Web Apps',
    description: 'Production-grade Next.js frontends with deterministic release controls.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 20h8" />
      </svg>
    ),
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform mobile delivery integrated with shared CI proof gates.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: 'Backend APIs',
    description: 'Versioned API workflows with strict contract and health validation.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
  },
  {
    title: 'AI Integration',
    description: 'Prompt-driven generation aligned to reproducible engineering standards.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    ),
  },
  {
    title: 'CI/CD',
    description: 'Mandatory gates, signatures, and checks before promotion to main.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12l4 4 12-12" />
      </svg>
    ),
  },
  {
    title: 'Production Deployment',
    description: 'Operational runbooks, proof artifacts, and monitored rollout discipline.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18M3 12h18" />
      </svg>
    ),
  },
];

export default function CapabilitiesGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#F3F4F6]">Factory Capabilities</h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">Core delivery surfaces under one disciplined system.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-colors duration-200 hover:border-[#2563EB]"
          >
            <div className="mb-3 inline-flex rounded-md bg-[#0B1220] p-2 text-[#22D3EE]">{item.icon}</div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
