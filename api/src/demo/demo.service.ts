import { HttpException, HttpStatus, Injectable, Logger, Optional } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { AgentType, ActivitySeverity, EventStatus } from '../generated/prisma';
import { ActivityStreamService } from '../activity/activity-stream.service';
import { RedisService } from '../lib/redis/redis.service';

// 11-01: XSS-safe escape for HTML template
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 11-06: 8 high-conversion starter prompts
export const DEMO_STARTERS = [
  { id: 'airbnb-pets',   emoji: '🐾', label: 'Airbnb for pets',   prompt: 'Build an Airbnb-style platform for pet boarding and sitting with host profiles, booking, and reviews' },
  { id: 'ai-crm',        emoji: '🤖', label: 'AI CRM',            prompt: 'Build a CRM with AI-powered lead scoring, email drafting, and deal pipeline insights' },
  { id: 'saas-analytics',emoji: '📊', label: 'SaaS analytics',    prompt: 'Build a multi-tenant SaaS analytics dashboard with charts, user segments, and real-time metrics' },
  { id: 'food-delivery', emoji: '🍔', label: 'Food delivery',     prompt: 'Build a food delivery marketplace with restaurant menus, real-time tracking, and ratings' },
  { id: 'job-board',     emoji: '💼', label: 'AI job board',      prompt: 'Build a job board with AI candidate-job matching, skills scoring, and application tracking' },
  { id: 'crypto-tracker',emoji: '₿',  label: 'Crypto tracker',    prompt: 'Build a crypto portfolio tracker with live prices, P&L charts, and whale alert notifications' },
  { id: 'learning',      emoji: '🎓', label: 'Learning platform', prompt: 'Build an online learning platform with courses, video lessons, quizzes, and progress tracking' },
  { id: 'inventory',     emoji: '📦', label: 'Inventory manager', prompt: 'Build an inventory management system with barcode scanning, low-stock alerts, and supplier orders' },
] as const;

// 11-02: Scripted build steps (parallel agents, ~10s total)
const SCRIPT_STEPS = [
  { delay: 0,    agent: AgentType.PLANNER,   event: 'PLAN_START',     title: 'Analyzing requirements…',        status: EventStatus.RUNNING },
  { delay: 1100, agent: AgentType.PLANNER,   event: 'PLAN_DONE',      title: 'Architecture plan ready ✓',      status: EventStatus.SUCCESS },
  { delay: 1400, agent: AgentType.ARCHITECT, event: 'ARCH_START',     title: 'Designing system structure…',    status: EventStatus.RUNNING },
  { delay: 2600, agent: AgentType.ARCHITECT, event: 'ARCH_DONE',      title: 'System blueprint complete ✓',    status: EventStatus.SUCCESS },
  { delay: 2800, agent: AgentType.DATABASE,  event: 'DB_START',       title: 'Creating database schema…',      status: EventStatus.RUNNING },
  { delay: 2900, agent: AgentType.BACKEND,   event: 'API_START',      title: 'Scaffolding REST API…',          status: EventStatus.RUNNING },
  { delay: 3000, agent: AgentType.FRONTEND,  event: 'UI_START',       title: 'Building React frontend…',       status: EventStatus.RUNNING },
  { delay: 4200, agent: AgentType.DATABASE,  event: 'DB_DONE',        title: 'PostgreSQL schema ready ✓',      status: EventStatus.SUCCESS },
  { delay: 5000, agent: AgentType.BACKEND,   event: 'API_DONE',       title: 'API endpoints live ✓',           status: EventStatus.SUCCESS },
  { delay: 5800, agent: AgentType.FRONTEND,  event: 'UI_DONE',        title: 'UI components complete ✓',       status: EventStatus.SUCCESS },
  { delay: 6000, agent: AgentType.QA,        event: 'TEST_START',     title: 'Running test suite…',            status: EventStatus.RUNNING },
  { delay: 6100, agent: AgentType.SECURITY,  event: 'SEC_START',      title: 'Scanning for vulnerabilities…', status: EventStatus.RUNNING },
  { delay: 7200, agent: AgentType.QA,        event: 'TEST_DONE',      title: '42 tests passing ✓',             status: EventStatus.SUCCESS },
  { delay: 7400, agent: AgentType.SECURITY,  event: 'SEC_DONE',       title: 'No vulnerabilities found ✓',    status: EventStatus.SUCCESS },
  { delay: 7600, agent: AgentType.DEVOPS,    event: 'DEPLOY_START',   title: 'Building container image…',     status: EventStatus.RUNNING },
  { delay: 9200, agent: AgentType.DEVOPS,    event: 'DEPLOY_DONE',    title: 'Container deployed ✓',          status: EventStatus.SUCCESS },
  { delay: 9500, agent: AgentType.OBSERVER,  event: 'BUILD_COMPLETE', title: 'Your app is ready! 🎉',    status: EventStatus.SUCCESS },
] as const;

export interface DemoHtmlContext {
  promptPrefill?: string;
  recordingMode?: boolean;
  demoRuntimeId?: string;
}

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    private readonly redis: RedisService,
    @Optional() private readonly activityService?: ActivityStreamService,
  ) {}

  getGallery() {
    return DEMO_STARTERS;
  }

  // 11-01: Create a demo session; rate-limited 10/IP/hour
  async startSession(ip: string, rawPrompt: string): Promise<{ sessionId: string; demoProjectId: string }> {
    const prompt = rawPrompt.trim().slice(0, 500);
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32);
    const hourKey = `${this.redis.prefix}:demo:ip:${ipHash}:${new Date().toISOString().slice(0, 13)}`;

    const count = await this.redis.client.incr(hourKey).catch(() => 0);
    if (count === 1) await this.redis.client.expire(hourKey, 3600).catch(() => {});
    if (count > 10) {
      throw new HttpException({ ok: false, error: 'TOO_MANY_DEMO_SESSIONS', message: 'Demo limit reached. Try again in an hour.' }, HttpStatus.TOO_MANY_REQUESTS);
    }

    const sessionId = randomUUID();
    const demoProjectId = `demo-${sessionId}`;

    await this.redis.client.set(
      `${this.redis.prefix}:demo:session:${sessionId}`,
      JSON.stringify({ demoProjectId, prompt, createdAt: Date.now() }),
      'EX', 3600,
    ).catch(() => {});

    // Fire-and-forget: emit scripted build events
    void this.runBuildScript(demoProjectId, prompt);

    return { sessionId, demoProjectId };
  }

  // 11-02: Fetch demo project activity (public, no auth, demo projects only)
  async getDemoActivity(demoProjectId: string, limit: number, after?: string): Promise<unknown[]> {
    if (!this.activityService) return [];
    const events = await this.activityService.query({ projectId: demoProjectId, limit, after });
    return events.map((e) => this.activityService!.redactEvent(e));
  }

  // 11-02: Scripted event sequence simulating a real AI build
  private runBuildScript(demoProjectId: string, prompt: string): void {
    if (!this.activityService) return;

    for (const step of SCRIPT_STEPS) {
      setTimeout(() => {
        void this.activityService!.append({
          projectId: demoProjectId,
          agentType: step.agent,
          eventType: step.event,
          title: step.title,
          severity: ActivitySeverity.INFO,
          status: step.status,
          metadata: { demo: true, promptSnippet: prompt.slice(0, 80) },
        }).catch((err: unknown) => {
          this.logger.warn(`Demo script event failed: ${String(err)}`);
        });
      }, step.delay);
    }
  }

  // 11-01 through 11-08: Generate the full demo page HTML
  generateHtml(ctx: DemoHtmlContext): string {
    const prefill = esc(ctx.promptPrefill ?? '');
    const recordMode = ctx.recordingMode ?? false;
    const demoRuntimeId = ctx.demoRuntimeId ? esc(ctx.demoRuntimeId) : '';
    const hasDemoRuntime = Boolean(ctx.demoRuntimeId);

    const startersJson = JSON.stringify(
      DEMO_STARTERS.map((s) => ({ id: s.id, emoji: s.emoji, label: s.label, prompt: s.prompt })),
    );

    const agentDefs = [
      { type: 'PLANNER',   label: 'Planner',   icon: '🗂' },
      { type: 'ARCHITECT', label: 'Architect', icon: '🏗' },
      { type: 'FRONTEND',  label: 'Frontend',  icon: '🎨' },
      { type: 'BACKEND',   label: 'Backend',   icon: '⚙️'  },
      { type: 'DATABASE',  label: 'Database',  icon: '🗄' },
      { type: 'QA',        label: 'QA',        icon: '✅'        },
      { type: 'DEVOPS',    label: 'DevOps',    icon: '🚀'  },
      { type: 'SECURITY',  label: 'Security',  icon: '🔒'  },
      { type: 'HEALER',    label: 'Healer',    icon: '💚'  },
    ];

    const agentsHtml = agentDefs.map((a) =>
      `<div class="agent-card" id="agent-${a.type}" data-agent="${a.type}">` +
      `<div class="agent-icon">${a.icon}</div>` +
      `<div class="agent-name">${a.label}</div>` +
      `<div class="agent-status-dot"></div>` +
      `<div class="agent-state-label">idle</div>` +
      `</div>`,
    ).join('');

    const startersHtml = DEMO_STARTERS.map((s) =>
      `<button class="chip" data-prompt="${esc(s.prompt)}">${s.emoji} ${esc(s.label)}</button>`,
    ).join('');

    const previewPanelHtml = hasDemoRuntime
      ? `<iframe id="preview-frame" src="/p/${demoRuntimeId}/shell" style="width:100%;height:420px;border:none;display:block" loading="lazy" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>`
      : `<a href="#" id="preview-cta-link" class="preview-link">` +
        `<div class="preview-emoji">💻</div>` +
        `<p>Sign up free to provision your real app</p>` +
        `<span class="open-btn">Get started →</span>` +
        `</a>`;

    // Bar height: hidden in recording mode
    const barH = recordMode ? '0px' : '52px';
    // Grid columns: wider in recording mode for dramatic effect
    const gridColsMobile   = recordMode ? '3' : '3';
    const gridColsMedium   = recordMode ? '5' : '3';
    const gridColsDesktop  = recordMode ? '9' : '5';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<meta name="theme-color" content="#0d0d0d">
<meta name="description" content="Describe your app. Watch an AI team build it in real time.">
<title>Factory — Build anything with AI</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d0d0d;--fg:#f0f0f0;--muted:#888;--accent:#6c6cff;--green:#4caf50;
  --red:#ff4f4f;--yellow:#ffc107;--card-bg:#161616;--border:rgba(255,255,255,.08);
}
html,body{min-height:100%;background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow-x:hidden}
.phase{display:none;min-height:100vh;padding-bottom:40px}
.phase.active{display:flex;flex-direction:column}
#top-bar{height:${barH};display:${recordMode ? 'none' : 'flex'};align-items:center;padding:0 16px;
  background:var(--bg);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;flex-shrink:0}
.logo{font-size:18px;font-weight:800;background:linear-gradient(135deg,#6c6cff,#a78bfa);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
/* ---- Phase 1: Landing ---- */
.hero{padding:${recordMode ? '80px' : '48px'} 20px 24px;text-align:center;max-width:640px;margin:0 auto;width:100%}
.hero h1{font-size:clamp(26px,6vw,48px);font-weight:800;line-height:1.15;letter-spacing:-.02em;
  background:linear-gradient(135deg,#f0f0f0 40%,#a78bfa);-webkit-background-clip:text;
  -webkit-text-fill-color:transparent;background-clip:text}
.hero .sub{font-size:15px;color:var(--muted);margin-top:10px}
.prompt-area{margin-top:28px;position:relative}
#prompt-input{width:100%;min-height:96px;background:var(--card-bg);border:1px solid var(--border);
  border-radius:14px;padding:14px 14px 48px;font-size:15px;color:var(--fg);resize:none;
  font-family:inherit;line-height:1.5;outline:none;transition:border-color .2s}
#prompt-input:focus{border-color:var(--accent)}
#prompt-input::placeholder{color:var(--muted)}
#btn-build{position:absolute;bottom:10px;right:10px;padding:9px 18px;background:var(--accent);
  color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;
  transition:transform .1s,opacity .15s}
#btn-build:active{transform:scale(.97)}
#btn-build:disabled{opacity:.4;cursor:not-allowed}
.chips{display:flex;flex-wrap:wrap;gap:7px;padding:16px 20px 0;max-width:640px;margin:0 auto;justify-content:center}
.chip{padding:7px 13px;background:var(--card-bg);border:1px solid var(--border);border-radius:20px;
  font-size:13px;color:var(--fg);cursor:pointer;transition:border-color .15s,background .15s;white-space:nowrap}
.chip:hover{border-color:var(--accent);background:rgba(108,108,255,.08)}
.chip:active{opacity:.7}
/* ---- 12-06: Agent team preview ---- */
#team-preview{max-width:640px;margin:10px auto 0;padding:0 20px;display:none}
.tp-header{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.tp-badges{display:flex;flex-wrap:wrap;gap:5px}
.tp-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:12px;
  font-size:11px;font-weight:500;border:1px solid rgba(108,108,255,.3);
  background:rgba(108,108,255,.06);color:var(--accent)}
.tp-badge.regulated{border-color:rgba(255,193,7,.4);background:rgba(255,193,7,.06);color:var(--yellow)}
.tp-warnings{margin-top:7px;display:flex;flex-direction:column;gap:5px}
.tp-warn{padding:7px 10px;background:rgba(255,193,7,.05);border:1px solid rgba(255,193,7,.2);
  border-radius:8px;font-size:11px;color:var(--yellow);display:flex;gap:6px;align-items:flex-start}
.tp-warn .wi{flex-shrink:0}
.tp-disc{margin-top:4px;font-size:10px;color:var(--muted);font-style:italic;
  border-left:2px solid rgba(255,193,7,.3);padding-left:5px}
.tp-assembled{font-size:12px;color:var(--green);margin-top:6px;font-weight:600;
  animation:fadeIn .4s ease;display:flex;align-items:center;gap:5px}
/* ---- Phase 2: Building ---- */
.theater-header{padding:14px 16px;display:flex;align-items:center;gap:10px;max-width:900px;margin:0 auto;width:100%;flex-shrink:0}
.theater-header h2{font-size:17px;font-weight:700;flex:1}
.elapsed{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.progress-track{background:var(--card-bg);height:3px;border-radius:2px;overflow:hidden;
  margin:0 16px 12px;max-width:900px;margin-left:auto;margin-right:auto;flex-shrink:0}
.progress-fill{height:100%;background:linear-gradient(90deg,#6c6cff,#a78bfa);width:0%;
  transition:width .4s ease;border-radius:2px}
.agents-grid{display:grid;grid-template-columns:repeat(${gridColsMobile},1fr);gap:7px;
  padding:0 10px;max-width:900px;margin:0 auto;flex-shrink:0}
@media(min-width:480px){.agents-grid{grid-template-columns:repeat(${gridColsMedium},1fr)}}
@media(min-width:720px){.agents-grid{grid-template-columns:repeat(${gridColsDesktop},1fr)}}
.agent-card{background:var(--card-bg);border:1px solid var(--border);border-radius:11px;
  padding:10px 6px;text-align:center;position:relative;transition:border-color .25s,background .25s;
  min-height:${recordMode ? '100px' : '86px'};display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:3px}
.agent-card.working{border-color:var(--accent);background:rgba(108,108,255,.06)}
.agent-card.success{border-color:var(--green);background:rgba(76,175,80,.06)}
.agent-card.failed{border-color:var(--red);background:rgba(255,79,79,.06)}
.agent-icon{font-size:${recordMode ? '26px' : '22px'};line-height:1}
.agent-name{font-size:10px;font-weight:600;color:var(--fg)}
.agent-state-label{font-size:9px;color:var(--muted)}
.agent-status-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:rgba(128,128,128,.25)}
.agent-card.working .agent-status-dot{background:var(--accent);animation:pulse 1s ease-in-out infinite}
.agent-card.success .agent-status-dot{background:var(--green)}
.agent-card.failed .agent-status-dot{background:var(--red)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.feed-wrap{max-width:900px;margin:12px auto 0;padding:0 10px;flex:1;min-height:0}
.feed-header{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;
  letter-spacing:.06em;margin-bottom:6px;display:flex;align-items:center;gap:5px}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);
  display:inline-block;animation:pulse 1.5s ease-in-out infinite}
.feed-list{list-style:none;max-height:${recordMode ? '280px' : '180px'};overflow-y:auto;
  display:flex;flex-direction:column}
.feed-list li{padding:5px 8px;font-size:11px;border-bottom:1px solid var(--border);
  display:flex;gap:6px;align-items:baseline;color:var(--muted);animation:slideIn .25s ease}
.feed-list li .ev-agent{color:var(--fg);font-weight:600;white-space:nowrap;min-width:60px;font-size:10px}
.feed-list li .ev-title{flex:1}
.feed-list li .ev-time{font-size:10px;margin-left:auto;white-space:nowrap;color:var(--muted)}
@keyframes slideIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.summary-wrap{max-width:900px;margin:10px auto 0;padding:0 10px 16px}
.summary-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}
@media(min-width:400px){.summary-grid{grid-template-columns:repeat(4,1fr)}}
.summary-card{background:var(--card-bg);border:1px solid var(--border);border-radius:10px;
  padding:10px;text-align:center}
.summary-val{font-size:22px;font-weight:800;color:var(--accent)}
.summary-lbl{font-size:10px;color:var(--muted);margin-top:2px}
/* ---- Phase 3: Reveal ---- */
.reveal-hero{text-align:center;padding:${recordMode ? '48px' : '28px'} 20px 16px;max-width:640px;margin:0 auto;width:100%}
.reveal-hero .trophy{font-size:${recordMode ? '72px' : '52px'};line-height:1;margin-bottom:14px;
  animation:pop .55s cubic-bezier(.34,1.56,.64,1) both}
@keyframes pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.reveal-hero h2{font-size:clamp(22px,5vw,${recordMode ? '42px' : '32px'});font-weight:800}
.reveal-hero p{color:var(--muted);margin-top:8px;font-size:14px;padding:0 16px}
.preview-wrap{max-width:640px;margin:16px auto 0;padding:0 14px;width:100%}
.preview-card{background:var(--card-bg);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.preview-bar{padding:9px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}
.dots span{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:3px}
.dots span:nth-child(1){background:#ff5f57}
.dots span:nth-child(2){background:#ffbd2e}
.dots span:nth-child(3){background:#28c840}
.preview-url{font-size:11px;color:var(--muted);flex:1;text-align:center;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap}
.preview-link{display:flex;flex-direction:column;align-items:center;padding:36px 20px;
  text-decoration:none;color:var(--fg);cursor:pointer}
.preview-emoji{font-size:40px;margin-bottom:10px}
.preview-link p{color:var(--muted);font-size:13px}
.open-btn{display:inline-block;margin-top:14px;padding:11px 22px;background:var(--accent);
  color:#fff;border-radius:9px;font-weight:700;font-size:13px}
.share-wrap{max-width:640px;margin:16px auto 0;padding:0 14px;width:100%}
.share-title{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:10px;text-align:center;text-transform:uppercase;letter-spacing:.05em}
.share-actions{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}
@media(min-width:380px){.share-actions{grid-template-columns:repeat(4,1fr)}}
.share-btn{padding:11px 6px;background:var(--card-bg);border:1px solid var(--border);
  border-radius:11px;font-size:11px;font-weight:600;color:var(--fg);cursor:pointer;
  text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px;
  transition:border-color .15s,background .15s}
.share-btn:hover{border-color:var(--accent);background:rgba(108,108,255,.05)}
.share-btn:active{opacity:.7}
.share-icon{font-size:18px}
.cta-wrap{max-width:640px;margin:24px auto 0;padding:0 14px 40px;text-align:center;width:100%}
.cta-wrap p{color:var(--muted);font-size:13px;margin-bottom:14px}
.cta-btn{display:inline-block;padding:13px 28px;background:var(--accent);color:#fff;
  border-radius:10px;font-weight:700;font-size:15px;cursor:pointer;border:none}
.cta-btn:active{opacity:.8}
#qr-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:100;display:none;
  align-items:center;justify-content:center}
#qr-modal-bg.open{display:flex}
#qr-modal{background:var(--card-bg);border-radius:16px;padding:24px;text-align:center;
  max-width:280px;width:90%;border:1px solid var(--border)}
#qr-modal h3{font-size:15px;font-weight:700;margin-bottom:14px}
#qr-img{width:180px;height:180px;background:#fff;border-radius:8px;padding:6px;margin:0 auto;display:block}
#qr-modal .close-btn{margin-top:14px;padding:9px 20px;background:rgba(128,128,128,.12);
  border:none;border-radius:8px;color:var(--fg);font-size:13px;cursor:pointer}
</style>
</head>
<body>

<div id="top-bar"><span class="logo">Factory</span></div>

<!-- Phase 1: Landing -->
<div id="ph-landing" class="phase active">
  <div class="hero">
    <h1>Describe your app.<br>Watch AI build it.</h1>
    <p class="sub">A team of 9 AI specialists ships your app in seconds.</p>
    <div class="prompt-area">
      <textarea id="prompt-input" placeholder="e.g. Build a pet boarding marketplace with host profiles, booking, and reviews…" maxlength="500">${prefill}</textarea>
      <button id="btn-build">Build it →</button>
    </div>
  </div>
  <div class="chips">${startersHtml}</div>
  <div id="team-preview">
    <div class="tp-header">Specialist agents joining your team:</div>
    <div class="tp-badges" id="tp-badges"></div>
    <div id="tp-assembled" style="display:none" class="tp-assembled"></div>
    <div class="tp-warnings" id="tp-warnings"></div>
  </div>
</div>

<!-- Phase 2: Building (AI Theater) -->
<div id="ph-building" class="phase">
  <div class="theater-header">
    <h2>🏗 Building your app…</h2>
    <span class="elapsed" id="elapsed">0s</span>
  </div>
  <div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div>
  <div class="agents-grid">${agentsHtml}</div>
  <div class="feed-wrap">
    <div class="feed-header"><span class="live-dot"></span> Live AI stream</div>
    <ul class="feed-list" id="feed-list">
      <li><span class="ev-agent">System</span><span class="ev-title">Initializing build pipeline…</span><span class="ev-time"></span></li>
    </ul>
  </div>
  <div class="summary-wrap" id="summary-wrap" style="display:none">
    <div class="summary-grid" id="summary-grid"></div>
  </div>
</div>

<!-- Phase 3: Reveal -->
<div id="ph-reveal" class="phase">
  <div class="reveal-hero">
    <div class="trophy">🎉</div>
    <h2>Your app is ready!</h2>
    <p id="reveal-prompt-echo"></p>
  </div>
  <div class="preview-wrap">
    <div class="preview-card">
      <div class="preview-bar">
        <div class="dots"><span></span><span></span><span></span></div>
        <div class="preview-url" id="preview-url-label">${hasDemoRuntime ? '/p/' + demoRuntimeId + '/shell' : 'factory.app/p/your-app'}</div>
      </div>
      ${previewPanelHtml}
    </div>
  </div>
  <div class="share-wrap">
    <div class="share-title">Share your creation</div>
    <div class="share-actions">
      <button class="share-btn" id="btn-copy"><span class="share-icon">🔗</span>Copy Link</button>
      <button class="share-btn" id="btn-phone"><span class="share-icon">📱</span>Open on Phone</button>
      <button class="share-btn" id="btn-native"><span class="share-icon">⬆️</span>Share</button>
      <button class="share-btn" id="btn-remix-reveal"><span class="share-icon">🔀</span>Remix</button>
    </div>
  </div>
  <div class="cta-wrap">
    <p>Want to build your own app for real?</p>
    <button class="cta-btn" id="btn-cta">Start building free →</button>
  </div>
</div>

<!-- QR Modal (11-04: Open on Phone) -->
<div id="qr-modal-bg">
  <div id="qr-modal">
    <h3>📱 Open on your phone</h3>
    <img id="qr-img" alt="QR Code" width="180" height="180">
    <br><button class="close-btn" id="qr-close">Close</button>
  </div>
</div>

<script>
(function(){
'use strict';
// 11-06: starters + config
var STARTERS = ${startersJson};
var DEMO_RUNTIME_ID = '${demoRuntimeId}';
var RECORD_MODE = ${recordMode ? 'true' : 'false'};

var currentPhase = 'landing';
var demoProjectId = null;
var buildStart = null;
var elapsedTimer = null;
var progressTimer = null;
var pollTimer = null;
var lastCursor = null;
var buildComplete = false;

// ---- Phase helpers ----
function showPhase(name) {
  document.querySelectorAll('.phase').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('ph-' + name).classList.add('active');
  currentPhase = name;
}

// ---- 12-06: Agent team preview ----
var teamPreview = document.getElementById('team-preview');
var tpBadges = document.getElementById('tp-badges');
var tpWarnings = document.getElementById('tp-warnings');
var tpDebounce = null;

// 13-04: Call /v1/agents/route for full team assembly with co-routing + risk
function updateTeamPreview(prompt) {
  if (!prompt || prompt.trim().length < 8) { teamPreview.style.display = 'none'; return; }
  clearTimeout(tpDebounce);
  tpDebounce = setTimeout(function() {
    fetch('/v1/agents/route', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    }).then(function(r) { return r.json(); }).then(function(d) {
      if (!d.ok) return;
      var domain = d.domainAgents || [];
      var warns = d.regulatedWarnings || [];
      if (!domain.length && !warns.length) { teamPreview.style.display = 'none'; return; }
      teamPreview.style.display = 'block';

      // Domain agent badges (blue = DOMAIN, yellow = REGULATED)
      tpBadges.innerHTML = domain.map(function(a) {
        var cls = a.kind === 'REGULATED' ? 'tp-badge regulated' : 'tp-badge';
        return '<span class="' + cls + '">' + escHtml(a.name) + '</span>';
      }).join('');

      // 13-04: "AI team assembled" moment
      var totalAgents = (d.coreAgents || []).length + domain.length;
      var assembled = document.getElementById('tp-assembled');
      var risk = d.riskLevel || 'LOW';
      var riskLabel = risk === 'HIGH' ? ' · ⚠️ Regulated domain' : risk === 'MEDIUM' ? ' · ⚡ Complex build' : '';
      assembled.textContent = '✓ AI team assembled — ' + totalAgents + ' agents' + riskLabel;
      assembled.style.display = 'flex';

      // Regulated warnings + disclaimers (13-05)
      tpWarnings.innerHTML = warns.map(function(w) {
        return '<div class="tp-warn"><span class="wi">⚠️</span>'
          + '<div>' + escHtml(w.warning)
          + '<div class="tp-disc">' + escHtml(w.disclaimer) + '</div>'
          + '</div></div>';
      }).join('');
    }).catch(function() {});
  }, 400);
}

// 11-06: Starter chip click fills prompt and triggers agent preview
document.querySelectorAll('.chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    var p = chip.dataset.prompt || '';
    document.getElementById('prompt-input').value = p;
    document.getElementById('prompt-input').focus();
    updateTeamPreview(p);
  });
});

document.getElementById('prompt-input').addEventListener('input', function() {
  updateTeamPreview(this.value);
});

// ---- 11-01: Build submit ----
var buildBtn = document.getElementById('btn-build');
var promptInput = document.getElementById('prompt-input');

buildBtn.addEventListener('click', function() {
  var prompt = promptInput.value.trim();
  if (!prompt || prompt.length < 10) { promptInput.focus(); return; }
  kickOffBuild(prompt);
});
promptInput.addEventListener('keydown', function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') buildBtn.click();
});

function kickOffBuild(prompt) {
  buildBtn.disabled = true;
  fetch('/demo/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) {
      var msg = d.error === 'TOO_MANY_DEMO_SESSIONS'
        ? 'You have started too many demos. Please wait an hour and try again.'
        : 'Could not start demo. Please try again.';
      alert(msg);
      buildBtn.disabled = false;
      return;
    }
    demoProjectId = d.demoProjectId;
    document.getElementById('reveal-prompt-echo').textContent = prompt;
    startTheater(demoProjectId);
  }).catch(function() {
    alert('Connection error. Please try again.');
    buildBtn.disabled = false;
  });
}

// ---- 11-02: AI Theater ----
function startTheater(projectId) {
  showPhase('building');
  buildStart = Date.now();

  // Elapsed counter
  elapsedTimer = setInterval(function() {
    var s = Math.floor((Date.now() - buildStart) / 1000);
    document.getElementById('elapsed').textContent = s + 's';
  }, 1000);

  // Progress fill (simulated ~10s)
  progressTimer = setInterval(function() {
    var pct = Math.min((Date.now() - buildStart) / 10000 * 100, 97);
    document.getElementById('progress-fill').style.width = pct + '%';
  }, 120);

  // Poll activity feed
  startPolling(projectId);
}

function startPolling(projectId) {
  var pollCount = 0;
  function poll() {
    if (buildComplete || currentPhase !== 'building') return;
    pollCount++;
    if (pollCount > 80) return;
    var url = '/demo/activity/' + encodeURIComponent(projectId) + '?limit=50';
    if (lastCursor) url += '&after=' + encodeURIComponent(lastCursor);
    fetch(url).then(function(r) { return r.json(); }).then(function(events) {
      if (Array.isArray(events)) {
        events.forEach(function(evt) { handleEvent(evt); });
        if (events.length > 0) {
          var last = events[events.length - 1];
          if (last && last.createdAt) lastCursor = last.createdAt;
        }
      }
    }).catch(function() {});
    pollTimer = setTimeout(poll, 500);
  }
  poll();
}

// 11-02: Agent label map (must match AgentType enum)
var AGENT_LABELS = {
  PLANNER: 'Planner', ARCHITECT: 'Architect', FRONTEND: 'Frontend',
  BACKEND: 'Backend', DATABASE: 'Database', QA: 'QA',
  DEVOPS: 'DevOps', SECURITY: 'Security', HEALER: 'Healer', OBSERVER: 'System'
};

function handleEvent(evt) {
  if (!evt) return;
  var agentType = String(evt.agentType || '');
  var title = String(evt.title || '');
  var status = String(evt.status || '');
  var eventType = String(evt.eventType || '');
  var createdAt = evt.createdAt ? new Date(evt.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}) : '';

  // Update agent card
  var card = document.getElementById('agent-' + agentType);
  if (card) {
    card.classList.remove('working', 'success', 'failed');
    var stateEl = card.querySelector('.agent-state-label');
    if (status === 'RUNNING') {
      card.classList.add('working');
      if (stateEl) stateEl.textContent = 'working…';
    } else if (status === 'SUCCESS') {
      card.classList.add('success');
      if (stateEl) stateEl.textContent = 'done ✓';
    } else if (status === 'FAILED') {
      card.classList.add('failed');
      if (stateEl) stateEl.textContent = 'failed';
    }
  }

  // Add to feed (newest first)
  var feedList = document.getElementById('feed-list');
  var li = document.createElement('li');
  var agentLabel = AGENT_LABELS[agentType] || agentType;
  li.innerHTML = '<span class="ev-agent">' + escHtml(agentLabel) + '</span>'
    + '<span class="ev-title">' + escHtml(title) + '</span>'
    + '<span class="ev-time">' + escHtml(createdAt) + '</span>';
  feedList.insertBefore(li, feedList.firstChild);

  // 11-07: BUILD_COMPLETE triggers reveal transition
  if (eventType === 'BUILD_COMPLETE' && !buildComplete) {
    buildComplete = true;
    finishBuild();
  }
}

// 11-07: Build summary + transition to reveal
function finishBuild() {
  clearInterval(elapsedTimer);
  clearInterval(progressTimer);
  if (pollTimer) clearTimeout(pollTimer);
  document.getElementById('progress-fill').style.width = '100%';

  var elapsed = Math.floor((Date.now() - (buildStart || Date.now())) / 1000);
  document.getElementById('summary-wrap').style.display = 'block';
  var items = [
    { val: '42', lbl: 'Tests passed' },
    { val: '0',  lbl: 'Vulnerabilities' },
    { val: '9',  lbl: 'AI agents' },
    { val: elapsed + 's', lbl: 'Build time' }
  ];
  document.getElementById('summary-grid').innerHTML = items.map(function(s) {
    return '<div class="summary-card">'
      + '<div class="summary-val">' + escHtml(s.val) + '</div>'
      + '<div class="summary-lbl">' + escHtml(s.lbl) + '</div>'
      + '</div>';
  }).join('');

  // 11-03: Cinematic transition to reveal
  setTimeout(function() {
    showPhase('reveal');
  }, RECORD_MODE ? 2800 : 1600);
}

// ---- 11-04: Viral share layer ----
var shareHref = DEMO_RUNTIME_ID
  ? (window.location.origin + '/p/' + DEMO_RUNTIME_ID + '/shell')
  : window.location.href;

document.getElementById('btn-copy').addEventListener('click', function() {
  var btn = document.getElementById('btn-copy');
  navigator.clipboard.writeText(shareHref).then(function() {
    var orig = btn.innerHTML;
    btn.innerHTML = '<span class="share-icon">✅</span>Copied!';
    setTimeout(function() { btn.innerHTML = orig; }, 2000);
  }).catch(function() { prompt('Copy this link:', shareHref); });
});

document.getElementById('btn-phone').addEventListener('click', function() {
  if (!DEMO_RUNTIME_ID) { window.open(shareHref, '_blank'); return; }
  document.getElementById('qr-img').src = '/p/' + DEMO_RUNTIME_ID + '/qr';
  document.getElementById('qr-modal-bg').classList.add('open');
});

document.getElementById('btn-native').addEventListener('click', function() {
  if (navigator.share) {
    navigator.share({ title: 'Check out this app I built with Factory!', url: shareHref }).catch(function() {});
  } else {
    navigator.clipboard.writeText(shareHref).catch(function() {});
    alert('Link copied!');
  }
});

document.getElementById('btn-remix-reveal').addEventListener('click', function() {
  if (DEMO_RUNTIME_ID) {
    window.location.href = '/p/' + DEMO_RUNTIME_ID + '/remix';
  } else {
    document.getElementById('btn-cta').click();
  }
});

document.getElementById('btn-cta').addEventListener('click', function() {
  window.location.href = '/?ref=demo';
});

document.getElementById('qr-close').addEventListener('click', function() {
  document.getElementById('qr-modal-bg').classList.remove('open');
});
document.getElementById('qr-modal-bg').addEventListener('click', function(e) {
  if (e.target === document.getElementById('qr-modal-bg')) {
    document.getElementById('qr-modal-bg').classList.remove('open');
  }
});

// Preview CTA link
var previewCtaLink = document.getElementById('preview-cta-link');
if (previewCtaLink) {
  previewCtaLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('btn-cta').click();
  });
}

// XSS-safe DOM escape
function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

})();
</script>
</body>
</html>`;
  }
}
