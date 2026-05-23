import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Demo — See Factory Build an App in Real Time',
  description: 'Watch Factory\'s AI agents architect, code, test, and deploy a full-stack app from a single prompt. No setup required.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'Live Demo — Factory AI App Builder',
    description: 'Watch Factory\'s AI agents build a full-stack app from a single prompt. Live, interactive demo.',
    url: '/demo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Demo — Factory AI App Builder',
    description: 'Watch Factory\'s AI agents build a full-stack app from a single prompt.',
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
