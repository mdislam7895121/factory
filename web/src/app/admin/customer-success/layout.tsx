import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Customer Success', robots: { index: false, follow: false } };
export default function CustomerSuccessLayout({ children }: { children: React.ReactNode }) { return children; }
