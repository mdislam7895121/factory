import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace — Factory',
  description: 'Your Factory workspaces — manage projects, teams, and AI-built apps.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Factory Workspace',
    description: 'Manage your Factory projects and AI-built apps.',
    type: 'website',
  },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
