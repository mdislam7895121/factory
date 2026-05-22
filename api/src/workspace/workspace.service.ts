import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  WORKSPACE_BLOCKED_PROMPT,
  type ActivityEvent,
  type ActivitySeverity,
  type ChangeRequest,
  type ChangeRequestRisk,
  type ChangeRequestStatus,
  type ComponentMapEntry,
  type CreateChangeRequestInput,
  type CreateWorkspaceInput,
  type DeployRecord,
  type DeployStatus,
  type EditingCard,
  type FileNode,
  type APIMapEntry,
  type ProjectInfo,
  type RouteMapEntry,
  type RuntimeStatus,
  type WorkspaceAnalytics,
  type WorkspaceInfo,
} from './workspace.types';

// 21-02: Paths that must never appear in file tree
const HIDDEN_PATHS = new Set(['.env', '.env.local', '.git', 'node_modules', '.next', 'dist', '__pycache__', '.DS_Store']);
const MAX_ACTIVITY_PER_WS = 500;

// 21-10: Guided editing card templates
export const EDITING_CARDS: EditingCard[] = [
  { id:'ec-1', category:'BRANDING',     title:'Update Branding',      description:'Change logo, colors, fonts and overall visual identity', prompt:'Update the branding with modern design', riskLevel:'LOW',    icon:'◈' },
  { id:'ec-2', category:'CONTENT',      title:'Edit Homepage Copy',   description:'Update hero text, headlines, and CTAs on the homepage',  prompt:'Edit homepage copy to be more compelling', riskLevel:'LOW', icon:'▤' },
  { id:'ec-3', category:'LAYOUT',       title:'Fix Mobile Layout',    description:'Improve responsive design and mobile experience',         prompt:'Fix mobile layout and responsiveness', riskLevel:'LOW',    icon:'⬡' },
  { id:'ec-4', category:'FEATURE',      title:'Add Pricing Section',  description:'Add a pricing tier section with feature comparison',      prompt:'Add a pricing section with 3 tiers', riskLevel:'MEDIUM', icon:'◇' },
  { id:'ec-5', category:'INTEGRATION',  title:'Add Stripe Checkout',  description:'Integrate Stripe for payment processing',                 prompt:'Add Stripe payment checkout flow', riskLevel:'HIGH',     icon:'◆' },
  { id:'ec-6', category:'FEATURE',      title:'Add User Auth',        description:'Add login, signup, and session management',               prompt:'Add complete user authentication', riskLevel:'HIGH',      icon:'⬢' },
  { id:'ec-7', category:'CONTENT',      title:'Update Contact Form',  description:'Add or improve the contact form with validation',         prompt:'Update contact form with email validation', riskLevel:'LOW', icon:'▣' },
  { id:'ec-8', category:'LAYOUT',       title:'Improve Navigation',   description:'Update the navigation menu and site structure',           prompt:'Improve navigation with dropdown menus', riskLevel:'LOW', icon:'◉' },
  { id:'ec-9', category:'SECURITY',     title:'Security Hardening',   description:'Audit and improve security posture of the app',           prompt:'Improve security headers and input validation', riskLevel:'MEDIUM', icon:'⬟' },
];

@Injectable()
export class WorkspaceService {
  private readonly workspaces     = new Map<string, WorkspaceInfo>();
  private readonly projects       = new Map<string, ProjectInfo>();
  private readonly changeRequests = new Map<string, ChangeRequest[]>(); // key: projectId
  private readonly deployments    = new Map<string, DeployRecord[]>();  // key: workspaceId
  private readonly activity       = new Map<string, ActivityEvent[]>(); // key: workspaceId
  private readonly analytics      = new Map<string, WorkspaceAnalytics>(); // key: workspaceId

  constructor() { this.seed(); }

  // ── Workspaces ────────────────────────────────────────────────────────────

  listWorkspaces(): WorkspaceInfo[] {
    return [...this.workspaces.values()];
  }

  getWorkspace(id: string): WorkspaceInfo | null {
    return this.workspaces.get(id) ?? null;
  }

  createWorkspace(input: CreateWorkspaceInput): WorkspaceInfo {
    const ws: WorkspaceInfo = {
      id:           randomUUID(),
      ownerId:      input.ownerId,
      name:         input.name,
      description:  input.description,
      projectCount: 0,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };
    this.workspaces.set(ws.id, ws);
    return ws;
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  listProjects(workspaceId: string): ProjectInfo[] {
    return [...this.projects.values()].filter(p => p.workspaceId === workspaceId);
  }

  getProject(projectId: string): ProjectInfo | null {
    return this.projects.get(projectId) ?? null;
  }

  updateRuntimeStatus(projectId: string, status: RuntimeStatus): ProjectInfo {
    const project = this.projects.get(projectId);
    if (!project) throw new NotFoundException('Project not found');
    project.runtimeStatus = status;
    project.updatedAt     = new Date().toISOString();
    this.addActivity({
      workspaceId: project.workspaceId,
      type:     'RUNTIME_STATUS',
      severity: status === 'CRASHED' ? 'ERROR' : status === 'RUNNING' ? 'SUCCESS' : 'INFO',
      message:  `${project.name} runtime changed to ${status}`,
    });
    return project;
  }

  // ── 21-02: File Explorer ──────────────────────────────────────────────────

  getFileTree(projectId: string): FileNode[] {
    const project = this.projects.get(projectId);
    if (!project) throw new NotFoundException('Project not found');
    return this.buildFileTree(project.category);
  }

  getRouteMap(projectId: string): RouteMapEntry[] {
    const project = this.projects.get(projectId);
    if (!project) throw new NotFoundException('Project not found');
    return ROUTE_MAPS[project.category] ?? ROUTE_MAPS['SaaS'];
  }

  getComponentMap(projectId: string): ComponentMapEntry[] {
    const project = this.projects.get(projectId);
    if (!project) throw new NotFoundException('Project not found');
    return COMPONENT_MAP;
  }

  getAPIMap(projectId: string): APIMapEntry[] {
    const project = this.projects.get(projectId);
    if (!project) throw new NotFoundException('Project not found');
    return API_MAP;
  }

  // ── 21-04: Change Requests ────────────────────────────────────────────────

  createChangeRequest(input: CreateChangeRequestInput): ChangeRequest {
    if (WORKSPACE_BLOCKED_PROMPT.test(input.prompt)) {
      throw new BadRequestException('Change request prompt contains blocked content');
    }
    const analysis   = this.analyzePrompt(input.prompt);
    const cr: ChangeRequest = {
      id:                   randomUUID(),
      projectId:            input.projectId,
      workspaceId:          input.workspaceId,
      prompt:               input.prompt.slice(0, 500),
      scopeSummary:         analysis.scopeSummary,
      affectedSystems:      analysis.affectedSystems,
      qualityRiskEstimate:  analysis.risk,
      status:               'PENDING',
      requiresConfirmation: analysis.requiresConfirmation,
      createdAt:            new Date().toISOString(),
      updatedAt:            new Date().toISOString(),
    };
    const existing = this.changeRequests.get(input.projectId) ?? [];
    this.changeRequests.set(input.projectId, [cr, ...existing]);
    this.addActivity({
      workspaceId: input.workspaceId,
      type:     'CHANGE_REQUEST',
      severity: cr.qualityRiskEstimate === 'CRITICAL' || cr.qualityRiskEstimate === 'HIGH' ? 'WARN' : 'INFO',
      message:  `Change request created: "${input.prompt.slice(0, 60)}"`,
    });
    return cr;
  }

  listChangeRequests(projectId: string): ChangeRequest[] {
    return this.changeRequests.get(projectId) ?? [];
  }

  getChangeRequest(id: string): ChangeRequest | null {
    for (const list of this.changeRequests.values()) {
      const found = list.find(cr => cr.id === id);
      if (found) return found;
    }
    return null;
  }

  updateChangeRequestStatus(id: string, status: ChangeRequestStatus): ChangeRequest {
    for (const list of this.changeRequests.values()) {
      const cr = list.find(x => x.id === id);
      if (cr) {
        cr.status    = status;
        cr.updatedAt = new Date().toISOString();
        return cr;
      }
    }
    throw new NotFoundException('Change request not found');
  }

  // ── 21-08: Deployments ────────────────────────────────────────────────────

  listDeployments(workspaceId: string): DeployRecord[] {
    return this.deployments.get(workspaceId) ?? [];
  }

  addDeployment(workspaceId: string, record: Omit<DeployRecord, 'id' | 'createdAt'>): DeployRecord {
    const deploy: DeployRecord = {
      ...record,
      id:        randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const existing = this.deployments.get(workspaceId) ?? [];
    this.deployments.set(workspaceId, [deploy, ...existing].slice(0, 50));
    this.addActivity({
      workspaceId,
      type:     'DEPLOY',
      severity: deploy.status === 'SUCCESS' ? 'SUCCESS' : deploy.status === 'FAILED' ? 'ERROR' : 'INFO',
      message:  `Deploy to ${deploy.platform}: ${deploy.status}`,
    });
    return deploy;
  }

  // ── 21-09: Activity Stream ────────────────────────────────────────────────

  listActivity(workspaceId: string, limit = 50): ActivityEvent[] {
    const events = this.activity.get(workspaceId) ?? [];
    return events.slice(0, Math.min(limit, 200));
  }

  addActivity(input: { workspaceId: string; type: string; severity: ActivitySeverity; message: string; meta?: Record<string, unknown> }): void {
    const event: ActivityEvent = {
      id:          randomUUID(),
      workspaceId: input.workspaceId,
      type:        input.type,
      severity:    input.severity,
      message:     input.message,
      meta:        input.meta,
      timestamp:   new Date().toISOString(),
    };
    const existing = this.activity.get(input.workspaceId) ?? [];
    const updated  = [event, ...existing];
    if (updated.length > MAX_ACTIVITY_PER_WS) updated.splice(MAX_ACTIVITY_PER_WS);
    this.activity.set(input.workspaceId, updated);
  }

  // ── 21-13: Analytics ─────────────────────────────────────────────────────

  getAnalytics(workspaceId: string): WorkspaceAnalytics {
    const base = this.analytics.get(workspaceId) ?? this.defaultAnalytics(workspaceId);
    const activity = this.activity.get(workspaceId) ?? [];
    return {
      ...base,
      changeRequests:  activity.filter(e => e.type === 'CHANGE_REQUEST').length,
      runtimeWakes:    activity.filter(e => e.type === 'RUNTIME_STATUS').length,
      deployFrequency: activity.filter(e => e.type === 'DEPLOY').length,
    };
  }

  trackAnalytic(workspaceId: string, field: keyof WorkspaceAnalytics): void {
    const existing = this.analytics.get(workspaceId) ?? this.defaultAnalytics(workspaceId);
    const n = (existing[field] as number ?? 0) + 1;
    this.analytics.set(workspaceId, { ...existing, [field]: n });
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  // 21-04: AI change request scope analysis
  private analyzePrompt(prompt: string): {
    scopeSummary: string;
    affectedSystems: string[];
    risk: ChangeRequestRisk;
    requiresConfirmation: boolean;
  } {
    const lower = prompt.toLowerCase();
    const affected: string[] = [];

    if (/header|nav|logo|brand|color|theme|style|font|css/.test(lower))   affected.push('UI/Styling');
    if (/api|endpoint|route|server|handler/.test(lower))                   affected.push('API');
    if (/database|db|model|schema|table|migration/.test(lower))            affected.push('Database');
    if (/auth|login|signup|session|jwt|oauth/.test(lower))                 affected.push('Authentication');
    if (/stripe|payment|checkout|billing|invoice/.test(lower))             affected.push('Payments');
    if (/analytics|track|metric|event/.test(lower))                        affected.push('Analytics');
    if (/email|smtp|notification|message/.test(lower))                     affected.push('Email/Notifications');
    if (/mobile|responsive|layout|viewport|media/.test(lower))             affected.push('Layout/Responsive');
    if (/test|spec|unit|integration/.test(lower))                          affected.push('Tests');
    if (affected.length === 0) affected.push('General');

    let risk: ChangeRequestRisk = 'LOW';
    if (/auth|payment|stripe|checkout|billing|database|schema|migration/.test(lower)) risk = 'HIGH';
    else if (/api|route|endpoint|server/.test(lower))         risk = 'MEDIUM';
    if (/delete|remove|drop|truncate|destroy/.test(lower))    risk = 'HIGH';

    return {
      scopeSummary:        `Affects ${affected.join(', ')}. Estimated risk: ${risk}. "${prompt.slice(0, 80)}"`,
      affectedSystems:     affected,
      risk,
      requiresConfirmation: risk === 'HIGH' || risk === 'CRITICAL',
    };
  }

  // 21-02: Build safe file tree, hiding system paths
  private buildFileTree(category: string): FileNode[] {
    const template = FILE_TREES[category] ?? FILE_TREES['SaaS'];
    return template.filter(n => !HIDDEN_PATHS.has(n.name));
  }

  private defaultAnalytics(workspaceId: string): WorkspaceAnalytics {
    return {
      workspaceId, changeRequests:0, previewOpens:0, runtimeWakes:0,
      snapshotRestores:0, deployFrequency:0, qualityImprovements:0, memoryOperations:0,
      period: 'all_time',
    };
  }

  // ── Seeded data ───────────────────────────────────────────────────────────

  private seed() {
    const ws1: WorkspaceInfo = { id:'ws-founder-1', ownerId:'user-alice', name:'CreatorOS Workspace',
      description:'Main workspace for CreatorOS and MediBook projects', projectCount:2,
      createdAt:'2025-01-15T10:00:00Z', updatedAt:'2025-05-22T08:00:00Z' };
    const ws2: WorkspaceInfo = { id:'ws-dev-1', ownerId:'user-bob', name:'Dev Lab',
      description:'Experimental projects and R&D', projectCount:2,
      createdAt:'2025-03-01T12:00:00Z', updatedAt:'2025-05-21T14:00:00Z' };
    this.workspaces.set(ws1.id, ws1);
    this.workspaces.set(ws2.id, ws2);

    const projects: ProjectInfo[] = [
      { id:'proj-creator-os', workspaceId:'ws-founder-1', name:'CreatorOS',     category:'SaaS',       stack:['Next.js','NestJS','PostgreSQL'],      runtimeStatus:'RUNNING',  qualityScore:92, qualityTier:'PRODUCTION_READY', previewUrl:'/preview/creator-os',  deployedUrl:'https://creator-os.app', createdAt:'2025-01-20T10:00:00Z', updatedAt:'2025-05-22T09:00:00Z', description:'AI-powered creator workspace SaaS platform' },
      { id:'proj-medibook',   workspaceId:'ws-founder-1', name:'MediBook Pro',   category:'Healthcare', stack:['React','Express','MongoDB'],          runtimeStatus:'SLEEPING', qualityScore:87, qualityTier:'PRODUCTION_READY', previewUrl:'/preview/medibook',    deployedUrl:'https://medibook.pro',   createdAt:'2025-02-10T14:00:00Z', updatedAt:'2025-05-21T16:00:00Z', description:'Medical appointment booking platform' },
      { id:'proj-shopforge',  workspaceId:'ws-dev-1',     name:'ShopForge',      category:'E-Commerce', stack:['Next.js','Stripe','PostgreSQL'],       runtimeStatus:'RUNNING',  qualityScore:73, qualityTier:'BETA_READY',       previewUrl:'/preview/shopforge',   createdAt:'2025-03-05T09:00:00Z', updatedAt:'2025-05-20T11:00:00Z', description:'Modern e-commerce platform with AI recommendations' },
      { id:'proj-tutor-ai',   workspaceId:'ws-dev-1',     name:'TutorAI',        category:'Education',  stack:['React','OpenAI','FastAPI','Redis'],    runtimeStatus:'SLEEPING', qualityScore:38, qualityTier:'EXPERIMENTAL',     previewUrl:'/preview/tutor-ai',    createdAt:'2025-04-01T08:00:00Z', updatedAt:'2025-05-18T10:00:00Z', description:'AI-powered tutoring platform for K-12' },
    ];
    projects.forEach(p => this.projects.set(p.id, p));

    // Seed activity for ws-founder-1
    const now = Date.now();
    const seed_events: Omit<ActivityEvent, 'id'>[] = [
      { workspaceId:'ws-founder-1', type:'BUILD',          severity:'SUCCESS', message:'Build completed in 23s — 17 pages',             timestamp: new Date(now - 300000).toISOString() },
      { workspaceId:'ws-founder-1', type:'DEPLOY',         severity:'SUCCESS', message:'Deploy to Railway succeeded — v1.4.2',           timestamp: new Date(now - 600000).toISOString() },
      { workspaceId:'ws-founder-1', type:'QUALITY_CHECK',  severity:'INFO',    message:'Quality score: 92/100 — PRODUCTION_READY',       timestamp: new Date(now - 900000).toISOString() },
      { workspaceId:'ws-founder-1', type:'RUNTIME_STATUS', severity:'INFO',    message:'MediBook Pro runtime woke successfully',         timestamp: new Date(now - 1200000).toISOString() },
      { workspaceId:'ws-founder-1', type:'CHANGE_REQUEST', severity:'INFO',    message:'Change request approved: update dashboard layout', timestamp: new Date(now - 1800000).toISOString() },
      { workspaceId:'ws-dev-1',     type:'BUILD',          severity:'WARN',    message:'Build completed with warnings — check mobile CSS', timestamp: new Date(now - 400000).toISOString() },
      { workspaceId:'ws-dev-1',     type:'DEPLOY',         severity:'FAILED',  message:'Deploy to Netlify failed — check build logs',     timestamp: new Date(now - 800000).toISOString() },
    ];
    seed_events.forEach(e => this.addActivity(e));

    // Seed deployments
    const dep1: DeployRecord = { id:randomUUID(), workspaceId:'ws-founder-1', projectId:'proj-creator-os', platform:'RAILWAY',  status:'SUCCESS', branch:'main',    commitSha:'a3f91b2', url:'https://creator-os.up.railway.app', durationMs:23400, createdAt: new Date(now - 600000).toISOString() };
    const dep2: DeployRecord = { id:randomUUID(), workspaceId:'ws-founder-1', projectId:'proj-creator-os', platform:'NETLIFY',  status:'SUCCESS', branch:'main',    commitSha:'a3f91b2', url:'https://creator-os.netlify.app',      durationMs:18200, createdAt: new Date(now - 600000).toISOString() };
    const dep3: DeployRecord = { id:randomUUID(), workspaceId:'ws-dev-1',     projectId:'proj-shopforge',  platform:'RAILWAY',  status:'SUCCESS', branch:'main',    commitSha:'c9d3e4f', durationMs:31000, createdAt: new Date(now - 1200000).toISOString() };
    const dep4: DeployRecord = { id:randomUUID(), workspaceId:'ws-dev-1',     projectId:'proj-shopforge',  platform:'NETLIFY',  status:'FAILED',  branch:'feature/checkout', durationMs:8500, createdAt: new Date(now - 800000).toISOString() };
    this.deployments.set('ws-founder-1', [dep1, dep2]);
    this.deployments.set('ws-dev-1', [dep3, dep4]);
  }
}

// ── Static seeded maps ────────────────────────────────────────────────────────

const FILE_TREES: Record<string, FileNode[]> = {
  SaaS: [
    { name:'src', path:'/src', type:'directory', safeToView:true, children:[
      { name:'app', path:'/src/app', type:'directory', safeToView:true, children:[
        { name:'page.tsx', path:'/src/app/page.tsx', type:'file', language:'tsx', summary:'Landing page', linesEstimate:210, safeToView:true },
        { name:'layout.tsx', path:'/src/app/layout.tsx', type:'file', language:'tsx', summary:'Root layout', linesEstimate:45, safeToView:true },
        { name:'dashboard', path:'/src/app/dashboard', type:'directory', safeToView:true, children:[
          { name:'page.tsx', path:'/src/app/dashboard/page.tsx', type:'file', language:'tsx', summary:'Dashboard home', linesEstimate:180, safeToView:true },
        ]},
      ]},
      { name:'components', path:'/src/components', type:'directory', safeToView:true, children:[
        { name:'Header.tsx', path:'/src/components/Header.tsx', type:'file', language:'tsx', summary:'Site header', linesEstimate:65, safeToView:true },
        { name:'Sidebar.tsx', path:'/src/components/Sidebar.tsx', type:'file', language:'tsx', summary:'Navigation sidebar', linesEstimate:90, safeToView:true },
      ]},
      { name:'lib', path:'/src/lib', type:'directory', safeToView:true, children:[
        { name:'api.ts', path:'/src/lib/api.ts', type:'file', language:'ts', summary:'API client helpers', linesEstimate:120, safeToView:true },
      ]},
    ]},
    { name:'api', path:'/api', type:'directory', safeToView:true, children:[
      { name:'src', path:'/api/src', type:'directory', safeToView:true, children:[
        { name:'app.module.ts', path:'/api/src/app.module.ts', type:'file', language:'ts', summary:'NestJS root module', linesEstimate:44, safeToView:true },
      ]},
    ]},
    { name:'package.json', path:'/package.json', type:'file', language:'json', summary:'Project dependencies', linesEstimate:42, safeToView:true },
  ],
  Healthcare: [
    { name:'src', path:'/src', type:'directory', safeToView:true, children:[
      { name:'components', path:'/src/components', type:'directory', safeToView:true, children:[
        { name:'BookingForm.tsx', path:'/src/components/BookingForm.tsx', type:'file', language:'tsx', summary:'Appointment booking form', linesEstimate:145, safeToView:true },
        { name:'DoctorCard.tsx',  path:'/src/components/DoctorCard.tsx',  type:'file', language:'tsx', summary:'Doctor profile card', linesEstimate:75, safeToView:true },
      ]},
      { name:'pages', path:'/src/pages', type:'directory', safeToView:true, children:[
        { name:'index.tsx', path:'/src/pages/index.tsx', type:'file', language:'tsx', summary:'Homepage', linesEstimate:180, safeToView:true },
      ]},
    ]},
    { name:'package.json', path:'/package.json', type:'file', language:'json', summary:'Project dependencies', linesEstimate:38, safeToView:true },
  ],
};
FILE_TREES['E-Commerce'] = FILE_TREES['SaaS'];
FILE_TREES['Education']  = FILE_TREES['Healthcare'];

const ROUTE_MAPS: Record<string, RouteMapEntry[]> = {
  SaaS: [
    { route:'/',             method:'GET',  description:'Landing page',     isPublic:true,  component:'LandingPage' },
    { route:'/dashboard',    method:'GET',  description:'User dashboard',   isPublic:false, component:'DashboardPage' },
    { route:'/settings',     method:'GET',  description:'Account settings', isPublic:false, component:'SettingsPage' },
    { route:'/api/auth',     method:'POST', description:'Authentication',   isPublic:true },
    { route:'/api/projects', method:'GET',  description:'List projects',    isPublic:false },
    { route:'/api/projects', method:'POST', description:'Create project',   isPublic:false },
  ],
  Healthcare: [
    { route:'/',             method:'GET',  description:'Homepage',         isPublic:true  },
    { route:'/book',         method:'GET',  description:'Book appointment', isPublic:true  },
    { route:'/doctors',      method:'GET',  description:'Doctor directory', isPublic:true  },
    { route:'/api/appointments', method:'POST', description:'Create appointment', isPublic:false },
  ],
};
ROUTE_MAPS['E-Commerce'] = ROUTE_MAPS['SaaS'];
ROUTE_MAPS['Education']  = ROUTE_MAPS['Healthcare'];

const COMPONENT_MAP: ComponentMapEntry[] = [
  { name:'Header',   path:'/src/components/Header.tsx',   type:'component', usedBy:['layout.tsx'] },
  { name:'Sidebar',  path:'/src/components/Sidebar.tsx',  type:'component', usedBy:['dashboard/page.tsx'] },
  { name:'Button',   path:'/src/components/Button.tsx',   type:'component', usedBy:['Header.tsx', 'BookingForm.tsx', 'DoctorCard.tsx'] },
  { name:'useAuth',  path:'/src/hooks/useAuth.ts',        type:'hook',       usedBy:['dashboard/page.tsx', 'settings/page.tsx'] },
  { name:'api',      path:'/src/lib/api.ts',              type:'util',       usedBy:['useAuth.ts', 'BookingForm.tsx'] },
];

const API_MAP: APIMapEntry[] = [
  { endpoint:'/api/auth/login',    method:'POST', description:'User login',          authenticated:false, module:'AuthModule' },
  { endpoint:'/api/auth/logout',   method:'POST', description:'User logout',         authenticated:true,  module:'AuthModule' },
  { endpoint:'/api/projects',      method:'GET',  description:'List user projects',  authenticated:true,  module:'ProjectModule' },
  { endpoint:'/api/projects',      method:'POST', description:'Create project',      authenticated:true,  module:'ProjectModule' },
  { endpoint:'/api/projects/:id',  method:'GET',  description:'Get project detail',  authenticated:true,  module:'ProjectModule' },
  { endpoint:'/api/projects/:id',  method:'PUT',  description:'Update project',      authenticated:true,  module:'ProjectModule' },
  { endpoint:'/health',            method:'GET',  description:'Health check',        authenticated:false, module:'AppModule' },
];
