import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status — Factory',
  description: 'Real-time status of Factory services: API, database, cache, and frontend CDN.',
  alternates: { canonical: '/status' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Factory System Status',
    description: 'Real-time service health for Factory — API, database, cache, and CDN.',
    url: '/status',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Factory System Status',
    description: 'Real-time service health for Factory.',
  },
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
