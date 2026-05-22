import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

// ── 21: Workspace Foundation Tests ────────────────────────────────────────────

describe('WorkspaceService', () => {
  let svc: WorkspaceService;

  beforeEach(() => { svc = new WorkspaceService(); });

  // ── Workspace CRUD ────────────────────────────────────────────────────────

  describe('Workspace CRUD', () => {
    it('lists seeded workspaces', () => {
      const ws = svc.listWorkspaces();
      expect(ws.length).toBeGreaterThanOrEqual(2);
    });

    it('gets workspace by id', () => {
      const ws = svc.getWorkspace('ws-founder-1');
      expect(ws).not.toBeNull();
      expect(ws!.name).toBeDefined();
    });

    it('returns null for unknown workspace', () => {
      expect(svc.getWorkspace('nope')).toBeNull();
    });

    it('creates a new workspace', () => {
      const ws = svc.createWorkspace({ name: 'My Workspace', ownerId: 'user-1' });
      expect(ws.id).toBeDefined();
      expect(ws.name).toBe('My Workspace');
      expect(ws.ownerId).toBe('user-1');
    });

    it('created workspace is retrievable', () => {
      const ws = svc.createWorkspace({ name: 'Test WS', ownerId: 'u1' });
      expect(svc.getWorkspace(ws.id)).not.toBeNull();
    });
  });

  // ── Projects ──────────────────────────────────────────────────────────────

  describe('Projects', () => {
    it('lists projects by workspaceId', () => {
      const projects = svc.listProjects('ws-founder-1');
      expect(projects.length).toBeGreaterThanOrEqual(2);
      projects.forEach(p => expect(p.workspaceId).toBe('ws-founder-1'));
    });

    it('returns empty array for unknown workspace', () => {
      expect(svc.listProjects('unknown')).toHaveLength(0);
    });

    it('gets project by id', () => {
      const p = svc.getProject('proj-creator-os');
      expect(p).not.toBeNull();
      expect(p!.name).toBe('CreatorOS');
    });

    it('returns null for unknown project', () => {
      expect(svc.getProject('nope')).toBeNull();
    });

    it('updates runtime status', () => {
      const p = svc.updateRuntimeStatus('proj-creator-os', 'SLEEPING');
      expect(p.runtimeStatus).toBe('SLEEPING');
    });

    it('throws NotFoundException on unknown project status update', () => {
      expect(() => svc.updateRuntimeStatus('nope', 'RUNNING')).toThrow(NotFoundException);
    });

    it('runtime status change is recorded in activity', () => {
      svc.updateRuntimeStatus('proj-creator-os', 'CRASHED');
      const events = svc.listActivity('ws-founder-1');
      expect(events.some(e => e.type === 'RUNTIME_STATUS' && e.message.includes('CRASHED'))).toBe(true);
    });
  });

  // ── 21-02: File Explorer ──────────────────────────────────────────────────

  describe('File Explorer', () => {
    it('returns file tree for known project', () => {
      const tree = svc.getFileTree('proj-creator-os');
      expect(tree.length).toBeGreaterThan(0);
    });

    it('throws NotFoundException for unknown project', () => {
      expect(() => svc.getFileTree('nope')).toThrow(NotFoundException);
    });

    it('file tree nodes have safeToView flag', () => {
      const tree = svc.getFileTree('proj-creator-os');
      expect(tree.every(n => typeof n.safeToView === 'boolean')).toBe(true);
    });

    it('hidden paths are excluded from file tree', () => {
      const tree = svc.getFileTree('proj-creator-os');
      const allNames = (nodes: typeof tree): string[] => nodes.flatMap(n => [n.name, ...allNames(n.children ?? [])]);
      const names    = allNames(tree);
      expect(names).not.toContain('.env');
      expect(names).not.toContain('node_modules');
      expect(names).not.toContain('.git');
    });

    it('returns route map for known project', () => {
      const routes = svc.getRouteMap('proj-creator-os');
      expect(routes.length).toBeGreaterThan(0);
      expect(routes[0].route).toBeDefined();
    });

    it('returns component map', () => {
      const comps = svc.getComponentMap('proj-creator-os');
      expect(comps.length).toBeGreaterThan(0);
      expect(comps[0].type).toBeDefined();
    });

    it('returns API map', () => {
      const apis = svc.getAPIMap('proj-creator-os');
      expect(apis.length).toBeGreaterThan(0);
      expect(apis.every(a => a.endpoint && a.method)).toBe(true);
    });

    it('throws NotFoundException for route map of unknown project', () => {
      expect(() => svc.getRouteMap('nope')).toThrow(NotFoundException);
    });
  });

  // ── 21-04: Change Requests ────────────────────────────────────────────────

  describe('Change Requests', () => {
    it('creates a change request', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Make header more modern' });
      expect(cr.id).toBeDefined();
      expect(cr.prompt).toBe('Make header more modern');
      expect(cr.status).toBe('PENDING');
    });

    it('analyzes affected systems from prompt', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Update the header colors and branding' });
      expect(cr.affectedSystems).toContain('UI/Styling');
    });

    it('detects HIGH risk for auth changes', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Add user login and auth flow' });
      expect(cr.qualityRiskEstimate).toBe('HIGH');
      expect(cr.requiresConfirmation).toBe(true);
    });

    it('detects HIGH risk for payment changes', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Add Stripe checkout' });
      expect(cr.qualityRiskEstimate).toBe('HIGH');
    });

    it('detects LOW risk for branding changes', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Update the font and color scheme' });
      expect(cr.qualityRiskEstimate).toBe('LOW');
      expect(cr.requiresConfirmation).toBe(false);
    });

    it('detects MEDIUM risk for API changes', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Add new API endpoint for reports' });
      expect(['MEDIUM', 'HIGH']).toContain(cr.qualityRiskEstimate);
    });

    it('blocks prompts with dangerous content', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'eval(rm -rf /)' }))
        .toThrow(BadRequestException);
    });

    it('blocks prompts with shell injection', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'execute bash commands' }))
        .toThrow(BadRequestException);
    });

    it('blocks prompts with blocked credential keywords', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'add my api_key secret here' }))
        .toThrow(BadRequestException);
    });

    it('lists change requests for project', () => {
      svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Update colors' });
      svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Fix layout' });
      const list = svc.listChangeRequests('proj-creator-os');
      expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty list for project with no requests', () => {
      expect(svc.listChangeRequests('unknown-proj')).toHaveLength(0);
    });

    it('gets change request by id', () => {
      const cr   = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Fix mobile' });
      const found = svc.getChangeRequest(cr.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(cr.id);
    });

    it('returns null for unknown change request', () => {
      expect(svc.getChangeRequest('nope')).toBeNull();
    });

    it('updates change request status', () => {
      const cr      = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Update nav' });
      const updated = svc.updateChangeRequestStatus(cr.id, 'APPROVED');
      expect(updated.status).toBe('APPROVED');
    });

    it('throws NotFoundException on unknown cr status update', () => {
      expect(() => svc.updateChangeRequestStatus('nope', 'APPROVED')).toThrow(NotFoundException);
    });

    it('scope summary is populated', () => {
      const cr = svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'make it look nicer' });
      expect(cr.scopeSummary.length).toBeGreaterThan(0);
    });
  });

  // ── 21-08: Deployments ───────────────────────────────────────────────────

  describe('Deployments', () => {
    it('lists seeded deployments', () => {
      const deps = svc.listDeployments('ws-founder-1');
      expect(deps.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty for unknown workspace', () => {
      expect(svc.listDeployments('nope')).toHaveLength(0);
    });

    it('adds a deployment', () => {
      const dep = svc.addDeployment('ws-founder-1', {
        workspaceId: 'ws-founder-1', platform:'RAILWAY', status:'SUCCESS',
        branch:'main', commitSha:'abc123',
      });
      expect(dep.id).toBeDefined();
      expect(dep.platform).toBe('RAILWAY');
    });

    it('deployment addition is reflected in list', () => {
      const dep = svc.addDeployment('ws-founder-1', {
        workspaceId:'ws-founder-1', platform:'NETLIFY', status:'IN_PROGRESS', branch:'main',
      });
      const deps = svc.listDeployments('ws-founder-1');
      expect(deps.some(d => d.id === dep.id)).toBe(true);
    });
  });

  // ── 21-09: Activity Stream ───────────────────────────────────────────────

  describe('Activity Stream', () => {
    it('lists seeded activity', () => {
      const events = svc.listActivity('ws-founder-1');
      expect(events.length).toBeGreaterThan(0);
    });

    it('returns empty for unknown workspace', () => {
      expect(svc.listActivity('nope')).toHaveLength(0);
    });

    it('adds activity event', () => {
      svc.addActivity({ workspaceId:'ws-founder-1', type:'TEST', severity:'INFO', message:'Test event' });
      const events = svc.listActivity('ws-founder-1');
      expect(events.some(e => e.type === 'TEST')).toBe(true);
    });

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        svc.addActivity({ workspaceId:'ws-founder-1', type:'T', severity:'INFO', message:`Event ${i}` });
      }
      const events = svc.listActivity('ws-founder-1', 3);
      expect(events).toHaveLength(3);
    });
  });

  // ── 21-13: Analytics ─────────────────────────────────────────────────────

  describe('Analytics', () => {
    it('returns analytics for workspace', () => {
      const stats = svc.getAnalytics('ws-founder-1');
      expect(stats.workspaceId).toBe('ws-founder-1');
      expect(stats.period).toBeDefined();
    });

    it('change requests reflected in analytics', () => {
      svc.createChangeRequest({ workspaceId:'ws-founder-1', projectId:'proj-creator-os', prompt:'Update layout' });
      const stats = svc.getAnalytics('ws-founder-1');
      expect(stats.changeRequests).toBeGreaterThan(0);
    });

    it('trackAnalytic increments field', () => {
      svc.trackAnalytic('ws-founder-1', 'previewOpens');
      svc.trackAnalytic('ws-founder-1', 'previewOpens');
      const stats = svc.getAnalytics('ws-founder-1');
      expect(stats.previewOpens).toBeGreaterThanOrEqual(2);
    });
  });

  // ── 21-12: Security ──────────────────────────────────────────────────────

  describe('Security', () => {
    it('blocks shell injection in change requests', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'run sudo rm -rf /' }))
        .toThrow(BadRequestException);
    });

    it('blocks script injection in change requests', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'<script>alert(1)</script>' }))
        .toThrow(BadRequestException);
    });

    it('allows safe change request prompts', () => {
      expect(() => svc.createChangeRequest({ workspaceId:'w', projectId:'p', prompt:'Update the hero section styling' }))
        .not.toThrow();
    });

    it('file tree never exposes .env files', () => {
      const tree   = svc.getFileTree('proj-creator-os');
      const flatten = (nodes: ReturnType<typeof svc.getFileTree>): string[] =>
        nodes.flatMap(n => [n.path, ...flatten(n.children ?? [])]);
      const paths = flatten(tree);
      expect(paths.some(p => p.includes('.env'))).toBe(false);
    });
  });
});
