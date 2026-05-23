import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Get Started — Factory',
  description: 'Turn your idea into a live app with AI. No code required.',
  robots: { index: false, follow: false },
};
export default function OnboardingLayout({ children }: { children: React.ReactNode }) { return children; }
