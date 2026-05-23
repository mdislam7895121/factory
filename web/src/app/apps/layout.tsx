import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App — Factory Marketplace',
  description: 'Explore, remix, and deploy this AI-built app from the Factory marketplace.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Factory App Marketplace',
    description: 'AI-built apps you can explore, remix, and deploy instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Factory App Marketplace',
    description: 'Explore AI-built apps. Remix and deploy in minutes.',
  },
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
