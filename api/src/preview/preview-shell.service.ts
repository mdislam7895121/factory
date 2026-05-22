import { Injectable } from '@nestjs/common';

// 09-01: Safe string escape — prevents XSS in HTML template
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ShellContext {
  runtimeId:           string;
  previewId:           string;   // original URL param (slug or id)
  visibility:          string;
  status:              string;
  sleepState:          string;
  allowRemix:          boolean;
  projectId:           string | null;
  previewUrl:          string | null;
  // 18-06: Social metadata (public-safe; only set for PUBLIC previews)
  creatorHandle?:      string;
  creatorDisplayName?: string;
  likeCount?:          number;
  saveCount?:          number;
  remixCount?:         number;
  remixedFromHandle?:  string;
  remixedFromSlug?:    string;
}

@Injectable()
export class PreviewShellService {
  // 09-01: Generate mobile-first preview shell HTML
  generateHtml(ctx: ShellContext): string {
    const isPublic  = ctx.visibility === 'PUBLIC';
    const appTitle  = esc(`Factory App — ${ctx.runtimeId.split('-')[0]}`);
    const runtimeId = esc(ctx.runtimeId);
    const previewId = esc(ctx.previewId);
    const projectId = ctx.projectId ? esc(ctx.projectId) : '';
    const activityEndpoint = projectId ? `/v1/activity/${projectId}/public` : '';
    // 18-06: Social context — only available for PUBLIC previews
    const creatorHandle      = isPublic && ctx.creatorHandle      ? esc(ctx.creatorHandle)      : '';
    const creatorDisplayName = isPublic && ctx.creatorDisplayName ? esc(ctx.creatorDisplayName) : '';
    const likeCount          = isPublic ? (ctx.likeCount  ?? 0) : 0;
    const saveCount          = isPublic ? (ctx.saveCount  ?? 0) : 0;
    const remixCount         = isPublic ? (ctx.remixCount ?? 0) : 0;
    const remixedFromHandle  = isPublic && ctx.remixedFromHandle ? esc(ctx.remixedFromHandle) : '';
    const remixedFromSlug    = isPublic && ctx.remixedFromSlug   ? esc(ctx.remixedFromSlug)   : '';
    const hasSocial          = isPublic && (creatorHandle || projectId);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<meta name="theme-color" content="#0d0d0d">
<title>${appTitle}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bar-h:44px;--status-h:28px;--bottom-h:${isPublic ? '56px' : '0px'};
  --bg:#0d0d0d;--fg:#f5f5f5;--muted:#888;--accent:#6c6cff;--danger:#ff4f4f;
  --bar-bg:#161616;--status-bg:#1a1a1a;--overlay-bg:rgba(0,0,0,.92);
}
@media(prefers-color-scheme:light){
  :root{--bg:#f0f0f0;--fg:#111;--muted:#555;--bar-bg:#fff;--status-bg:#f5f5f5;--overlay-bg:rgba(255,255,255,.96)}
}
html,body{height:100%;background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden}
#bar{position:fixed;top:0;left:0;right:0;height:var(--bar-h);background:var(--bar-bg);
  display:flex;align-items:center;padding:0 12px;gap:8px;z-index:20;
  border-bottom:1px solid rgba(128,128,128,.12);user-select:none}
#bar-title{flex:1;font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--fg)}
#bar button{height:30px;padding:0 10px;border:none;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;
  background:rgba(128,128,128,.15);color:var(--fg);transition:opacity .15s}
#bar button:active{opacity:.6}
#btn-remix{background:var(--accent);color:#fff}
#status-bar{position:fixed;top:var(--bar-h);left:0;right:0;height:var(--status-h);
  background:var(--status-bg);display:flex;align-items:center;justify-content:center;
  font-size:11px;color:var(--muted);gap:8px;z-index:19;transition:background .3s}
#status-bar.online{background:#0a2e0a;color:#4caf50}
#status-bar.waking{background:#1a1a00;color:#ffc107}
#status-bar.failed,#status-bar.crashed{background:#2e0a0a;color:var(--danger)}
#status-bar.unauthorized{background:#2e0a0a;color:var(--danger)}
#btn-retry{padding:2px 8px;border:1px solid var(--muted);border-radius:4px;background:none;color:var(--muted);
  font-size:10px;cursor:pointer;margin-left:4px}
#app-frame{position:fixed;top:calc(var(--bar-h) + var(--status-h));left:0;right:0;
  bottom:var(--bottom-h);border:none;width:100%;background:#fff}
#state-overlay{position:fixed;top:calc(var(--bar-h) + var(--status-h));left:0;right:0;
  bottom:var(--bottom-h);background:var(--overlay-bg);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:16px;z-index:18;padding:24px;text-align:center}
#state-overlay.hidden{display:none}
.spinner{width:32px;height:32px;border:3px solid rgba(128,128,128,.2);border-top-color:var(--accent);
  border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.state-icon{font-size:40px}
.state-msg{font-size:16px;font-weight:600;color:var(--fg)}
.state-sub{font-size:13px;color:var(--muted)}
.action-btn{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:600;
  cursor:pointer;background:var(--accent);color:#fff;margin-top:8px}
.action-btn:active{opacity:.7}
${isPublic ? `
#branding-bar{position:fixed;bottom:0;left:0;right:0;height:var(--bottom-h);background:var(--bar-bg);
  display:flex;align-items:center;justify-content:space-between;padding:0 16px;
  border-top:1px solid rgba(128,128,128,.12);z-index:20}
#branding-bar span{font-size:12px;color:var(--muted)}
#branding-bar a{font-size:12px;color:var(--accent);text-decoration:none;font-weight:500}
` : ''}
#modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:30;display:none;align-items:flex-end}
#modal-bg.open{display:flex}
#modal{width:100%;background:var(--bar-bg);border-radius:16px 16px 0 0;padding:20px 16px 32px;
  display:flex;flex-direction:column;gap:12px}
#modal h3{font-size:16px;font-weight:700;text-align:center;color:var(--fg)}
#modal .url-row{display:flex;gap:8px;align-items:center}
#modal .url-row input{flex:1;padding:8px 10px;border:1px solid rgba(128,128,128,.25);border-radius:8px;
  background:rgba(128,128,128,.08);color:var(--fg);font-size:12px;outline:none}
#modal .url-row button{padding:8px 14px;border:none;border-radius:8px;background:var(--accent);
  color:#fff;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
#modal #qr-img{width:160px;height:160px;align-self:center;border-radius:8px;background:#fff;padding:8px}
#modal .share-btn{padding:12px;border:none;border-radius:10px;font-size:14px;font-weight:600;
  cursor:pointer;background:var(--accent);color:#fff}
#modal-close{position:absolute;top:20px;right:16px;background:none;border:none;
  font-size:20px;cursor:pointer;color:var(--muted)}
/* 18-06: Social bar */
#social-bar{position:fixed;bottom:0;left:0;right:0;background:var(--bar-bg);
  border-top:1px solid var(--border);display:none;align-items:center;gap:10px;
  padding:8px 14px;font-size:12px;z-index:18;flex-wrap:wrap}
#social-bar.visible{display:flex}
.soc-creator{display:flex;align-items:center;gap:5px;text-decoration:none;color:var(--fg);font-weight:600}
.soc-creator-dot{width:22px;height:22px;border-radius:50%;background:var(--accent);
  display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;flex-shrink:0}
.soc-actions{display:flex;gap:8px;margin-left:auto;align-items:center}
.soc-btn{background:none;border:1px solid var(--border);border-radius:6px;
  color:var(--muted);font-size:11px;font-weight:600;padding:4px 9px;cursor:pointer;
  display:flex;align-items:center;gap:4px;line-height:1}
.soc-btn.liked{border-color:rgba(255,79,79,.4);color:#ff4f4f}
.soc-btn.saved{border-color:rgba(76,175,80,.4);color:var(--green)}
.soc-remix-source{font-size:10px;color:var(--muted);width:100%;padding-top:2px}
.soc-remix-source a{color:var(--accent);text-decoration:none}
#activity-panel{position:fixed;bottom:var(--bottom-h);left:0;right:0;max-height:220px;
  background:var(--bar-bg);border-top:1px solid rgba(128,128,128,.12);overflow-y:auto;
  transform:translateY(100%);transition:transform .3s;z-index:15}
#activity-panel.open{transform:translateY(0)}
#activity-panel ul{list-style:none;padding:8px 12px}
#activity-panel li{font-size:11px;color:var(--muted);padding:4px 0;
  border-bottom:1px solid rgba(128,128,128,.08);display:flex;gap:6px}
#activity-panel li .ev-type{color:var(--fg);font-weight:500;white-space:nowrap}
.pulse{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4caf50;margin-right:4px;
  animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
</style>
</head>
<body>

<div id="bar">
  <div id="bar-title">${appTitle}</div>
  <button id="btn-activity" title="Activity">⚡</button>
  <button id="btn-share" title="Share">⬆</button>
  ${isPublic ? `<button id="btn-remix" ${ctx.allowRemix ? '' : 'hidden'}>Remix</button>` : ''}
  <button id="btn-fullscreen" title="Full screen">⛶</button>
</div>

<div id="status-bar">
  <span id="status-dot"></span>
  <span id="status-text">Checking…</span>
  <button id="btn-retry" hidden onclick="startCheck()">Retry</button>
</div>

<div id="state-overlay">
  <div class="spinner" id="spinner"></div>
  <p class="state-msg" id="overlay-msg">Loading…</p>
  <p class="state-sub" id="overlay-sub"></p>
  <button class="action-btn" id="overlay-action" hidden></button>
</div>

<iframe id="app-frame" src="about:blank" allow="fullscreen; clipboard-write; camera; microphone" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"></iframe>

${isPublic ? `
<div id="branding-bar">
  <span>Built with Factory</span>
  <a href="/p/${previewId}/shell">🔗 Share</a>
</div>
` : ''}
${hasSocial ? `
<div id="social-bar" class="visible">
  ${creatorHandle
    ? `<a class="soc-creator" href="/u/${creatorHandle}" rel="noopener">
        <div class="soc-creator-dot">${creatorDisplayName ? creatorDisplayName.charAt(0).toUpperCase() : '?'}</div>
        <span>${creatorDisplayName || '@' + creatorHandle}</span>
      </a>`
    : ''}
  <div class="soc-actions">
    ${projectId ? `
    <button class="soc-btn" id="soc-like" title="Like">❤️ <span id="like-count">${likeCount}</span></button>
    <button class="soc-btn" id="soc-save" title="Save">🔖 <span id="save-count">${saveCount}</span></button>
    ` : ''}
    ${creatorHandle ? `<a class="soc-btn" href="/u/${creatorHandle}">👤 View creator</a>` : ''}
  </div>
  ${remixedFromHandle
    ? `<div class="soc-remix-source">🔀 Remixed from
        <a href="${remixedFromSlug ? '/p/' + remixedFromSlug + '/shell' : '/u/' + remixedFromHandle}" rel="noopener">@${remixedFromHandle}</a>
        — <a href="/p/${previewId}/remix">Remix this app</a>
       </div>`
    : ''}
</div>
` : ''}

<!-- Share modal -->
<div id="modal-bg" role="dialog" aria-modal="true">
  <div id="modal">
    <h3>Share this app</h3>
    <div class="url-row">
      <input id="share-url" readonly value="">
      <button onclick="copyUrl()">Copy</button>
    </div>
    <img id="qr-img" src="/p/${previewId}/qr" alt="QR Code" loading="lazy" onerror="this.style.display='none'">
    <button class="share-btn" id="native-share-btn" hidden>Share via…</button>
    <button class="share-btn" style="background:rgba(128,128,128,.15);color:var(--fg)" onclick="closeModal()">Close</button>
  </div>
</div>

${activityEndpoint ? `
<div id="activity-panel">
  <ul id="activity-list"><li style="text-align:center;padding:12px">Loading…</li></ul>
</div>
` : ''}

<script>
(function(){
'use strict';
const RUNTIME_ID = '${runtimeId}';
const PREVIEW_ID = '${previewId}';
const ALLOW_REMIX = ${ctx.allowRemix ? 'true' : 'false'};
const ACTIVITY_URL = '${activityEndpoint}';
let pollTimer = null;
let appLoaded = false;

const statusBar  = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const overlay    = document.getElementById('state-overlay');
const overlayMsg = document.getElementById('overlay-msg');
const overlaySub = document.getElementById('overlay-sub');
const spinner    = document.getElementById('spinner');
const ovAction   = document.getElementById('overlay-action');
const appFrame   = document.getElementById('app-frame');
const retryBtn   = document.getElementById('btn-retry');

function setState(state, msg, sub, actionLabel, actionFn) {
  statusBar.className = state;
  statusText.textContent = msg;
  overlayMsg.textContent = msg;
  overlaySub.textContent = sub || '';
  spinner.style.display = (state === 'checking' || state === 'waking') ? 'block' : 'none';
  ovAction.hidden = !actionLabel;
  if (actionLabel) { ovAction.textContent = actionLabel; ovAction.onclick = actionFn || null; }
  retryBtn.hidden = state !== 'failed' && state !== 'crashed' && state !== 'unauthorized';

  if (state === 'online') {
    overlay.className = 'hidden';
    if (!appLoaded) {
      appLoaded = true;
      appFrame.src = '/p/' + RUNTIME_ID;
    }
  } else {
    overlay.className = '';
  }
}

// 09-03: Status polling
function startCheck() {
  clearInterval(pollTimer);
  setState('checking', 'Checking…', '');
  check();
}

async function check() {
  try {
    const r = await fetch('/p/' + PREVIEW_ID + '/check', { headers: { accept: 'application/json' } });
    const d = await r.json();

    if (!d.allowed) {
      if (d.visibility === 'PASSWORD') {
        setState('unauthorized', 'Password required', 'This app requires a password to access.');
      } else if (d.status === 'TERMINATED') {
        setState('failed', 'App terminated', 'This preview is no longer available.');
      } else {
        setState('unauthorized', 'Access denied', 'You do not have permission to view this app.');
      }
      return;
    }

    const s = d.status;
    if (s === 'RUNNING') {
      setState('online', '● Live', '');
      pollTimer = setInterval(heartbeat, 30000);
      return;
    }
    if (s === 'SLEEPING' || s === 'PROVISIONING') {
      setState('waking', 'Waking app…', 'This may take a few seconds.');
      pollTimer = setTimeout(check, 2500);
      return;
    }
    if (s === 'CRASHED' || s === 'STOPPED') {
      setState('crashed', 'App unavailable', 'The runtime crashed or stopped.', 'Retry', startCheck);
      return;
    }
    if (s === 'TERMINATED') {
      setState('failed', 'App terminated', 'This preview no longer exists.');
      return;
    }
    setState('checking', 'Starting…', '');
    pollTimer = setTimeout(check, 3000);
  } catch {
    setState('failed', 'Connection error', 'Could not reach the server.', 'Retry', startCheck);
  }
}

async function heartbeat() {
  try {
    const r = await fetch('/p/' + PREVIEW_ID + '/check', { headers: { accept: 'application/json' } });
    const d = await r.json();
    if (!d.allowed || d.status !== 'RUNNING') {
      clearInterval(pollTimer);
      appLoaded = false;
      startCheck();
    }
  } catch { /* ignore — fail open */ }
}

// 09-04: Share modal
const modalBg = document.getElementById('modal-bg');
const shareUrl = document.getElementById('share-url');
const nativeShareBtn = document.getElementById('native-share-btn');

function openModal() {
  const url = window.location.origin + '/p/' + PREVIEW_ID + '/shell';
  shareUrl.value = url;
  if (navigator.share) {
    nativeShareBtn.hidden = false;
    nativeShareBtn.onclick = () => {
      navigator.share({ title: document.title, url }).catch(() => {});
    };
  }
  modalBg.classList.add('open');
}
function closeModal() { modalBg.classList.remove('open'); }
function copyUrl() {
  navigator.clipboard?.writeText(shareUrl.value).then(() => {
    const btn = shareUrl.nextElementSibling;
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => { shareUrl.select(); document.execCommand('copy'); });
}
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });

// Full screen
document.getElementById('btn-fullscreen').addEventListener('click', () => {
  const f = appFrame;
  if (f.requestFullscreen) f.requestFullscreen();
  else window.open('/p/' + RUNTIME_ID, '_blank');
});

document.getElementById('btn-share').addEventListener('click', openModal);

// 09-05: Remix from mobile
${isPublic ? `
const remixBtn = document.getElementById('btn-remix');
if (remixBtn) remixBtn.addEventListener('click', () => {
  if (!ALLOW_REMIX) { alert('Remix is not enabled for this app.'); return; }
  const dest = '/p/' + PREVIEW_ID + '/remix';
  // POST remix (ApiKey required) — redirect to auth handoff if not authed
  window.location.href = '/remix-handoff?source=' + encodeURIComponent(RUNTIME_ID);
});
` : ''}

// 09-06: Activity feed (PUBLIC only)
${activityEndpoint ? `
const activityPanel = document.getElementById('activity-panel');
const activityList  = document.getElementById('activity-list');
let activityLoaded  = false;

document.getElementById('btn-activity').addEventListener('click', () => {
  activityPanel.classList.toggle('open');
  if (!activityLoaded) { activityLoaded = true; loadActivity(); }
});

async function loadActivity() {
  try {
    const r = await fetch('${activityEndpoint}?limit=20');
    const events = await r.json();
    if (!Array.isArray(events) || events.length === 0) {
      activityList.innerHTML = '<li style="text-align:center;color:var(--muted)">No recent activity</li>';
      return;
    }
    activityList.innerHTML = events.slice(0, 20).map(e => {
      const t = e.title ? String(e.title).replace(/</g,'&lt;') : '';
      const ts = e.createdAt ? new Date(e.createdAt).toLocaleTimeString() : '';
      return '<li><span class="ev-type">' + esc(e.eventType) + '</span>' + t + '<span style="margin-left:auto">' + ts + '</span></li>';
    }).join('');
  } catch {
    activityList.innerHTML = '<li style="text-align:center;color:var(--muted)">Could not load activity</li>';
  }
}
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
` : ''}

// 18-06: Social signal buttons (like / save)
${hasSocial && projectId ? `
const likeBtn = document.getElementById('soc-like');
const saveBtn = document.getElementById('soc-save');
const PROJECT_ID = '${projectId}';

function postSignal(signalType, btn, countId) {
  fetch('/v1/social/apps/' + PROJECT_ID + '/signal', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ signalType })
  }).then(function(r){ return r.json(); }).then(function(d){
    if (d.ok && d.recorded) {
      btn.classList.add(signalType === 'LIKE' ? 'liked' : 'saved');
      var el = document.getElementById(countId);
      if (el) el.textContent = String(parseInt(el.textContent || '0', 10) + 1);
    }
  }).catch(function(){});
}

if (likeBtn) likeBtn.addEventListener('click', function() {
  if (likeBtn.classList.contains('liked')) return;
  postSignal('LIKE', likeBtn, 'like-count');
});
if (saveBtn) saveBtn.addEventListener('click', function() {
  if (saveBtn.classList.contains('saved')) return;
  postSignal('SAVE', saveBtn, 'save-count');
});
` : ''}

// Boot
startCheck();
})();
</script>
</body>
</html>`;
  }
}
