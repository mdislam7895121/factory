import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Support Inbox', robots: { index: false, follow: false } };
export default function SupportLayout({ children }: { children: React.ReactNode }) { return children; }
