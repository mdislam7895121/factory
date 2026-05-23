import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quality — Factory',
  description: 'Factory quality dashboard — AI-powered code review, test coverage, and deployment readiness gate.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Factory Quality Dashboard',
    description: 'AI-powered code review and deployment readiness gate.',
    type: 'website',
  },
};

export default function QualityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
