import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory — Factory',
  description: 'Factory memory module — persistent context, knowledge, and project history for your AI agents.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Factory Memory Module',
    description: 'Persistent AI agent memory — context and knowledge across your projects.',
    type: 'website',
  },
};

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
