import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  updatedAt: string;
};

const projects: Project[] = [
  { id: 'ops-dashboard', name: 'Ops Dashboard', updatedAt: 'Updated 2h ago' },
  { id: 'support-portal', name: 'Support Portal', updatedAt: 'Updated yesterday' },
  { id: 'onboarding-assistant', name: 'Onboarding Assistant', updatedAt: 'Updated 3d ago' },
];

export function RecentProjects() {
  return (
    <ul className="builder-recent-list">
      {projects.map((project) => (
        <li key={project.id} className="builder-recent-item">
          <div>
            <p className="builder-recent-name">{project.name}</p>
            <p className="builder-recent-meta">{project.updatedAt}</p>
          </div>
          <Link href="/dashboard/workspaces" className="ds-btn ds-btn-ghost ds-btn-sm" style={{ textDecoration: 'none' }}>
            Resume
          </Link>
        </li>
      ))}
    </ul>
  );
}
