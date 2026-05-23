import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Apps — AI-Built App Marketplace',
  description: 'Browse, remix, and deploy AI-built full-stack apps. Healthcare, e-commerce, logistics, EdTech, and more — all built by Factory agents.',
  alternates: { canonical: '/discover' },
  openGraph: {
    title: 'Discover Apps — Factory Marketplace',
    description: 'Browse and remix AI-built full-stack apps across every industry. Deploy in minutes.',
    url: '/discover',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Apps — Factory Marketplace',
    description: 'Browse, remix, and deploy AI-built apps. Healthcare, e-commerce, logistics, and more.',
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
