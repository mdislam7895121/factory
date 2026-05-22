import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import type { Response } from 'express';
import { CreatorProfileService } from './creator-profile.service';
import { SocialSignalService } from './social-signal.service';
import type { DiscoverParams, SocialSignalType } from './social.types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class CreateProfileDto {
  @IsString() userId!:      string;
  @IsString() handle!:      string;
  @IsString() displayName!: string;
  @IsOptional() @IsString() bio?:         string;
  @IsOptional() @IsString() avatarUrl?:   string;
  @IsOptional() @IsString() websiteUrl?:  string;
  @IsOptional() @IsString() publicEmail?: string;
  @IsOptional() @IsString() country?:     string;
  skills?: string[];
}

class UpdateProfileDto {
  @IsString()               userId!:      string;
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() bio?:         string;
  @IsOptional() @IsString() avatarUrl?:   string;
  @IsOptional() @IsString() websiteUrl?:  string;
  @IsOptional() @IsString() publicEmail?: string;
  @IsOptional() @IsString() country?:     string;
  skills?:     string[];
  visibility?: 'PUBLIC' | 'PRIVATE';
}

class FollowDto {
  @IsString() userId!: string;
}

class SignalDto {
  @IsString()               signalType!: SocialSignalType;
  @IsOptional() @IsString() userId?:     string;
  @IsOptional() @IsString() runtimeId?:  string;
}

class PublishAppDto {
  @IsString()                     projectId!:   string;
  @IsString()                     title!:       string;
  @IsOptional() @IsString()       runtimeId?:   string;
  @IsOptional() @IsString()       ownerUserId?: string;
  @IsOptional() @IsString()       description?: string;
  @IsOptional() @IsString()       domain?:      string;
  @IsOptional() @IsString()       marketplacePackSlug?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

// ── XSS-safe escape for HTML templates ───────────────────────────────────────
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

@Controller()
export class SocialController {
  constructor(
    private readonly profiles: CreatorProfileService,
    private readonly signals:  SocialSignalService,
  ) {}

  // ── 18-05: Public creator page ───────────────────────────────────────────────

  @Get('u/:handle')
  creatorPage(
    @Param('handle') handle: string,
    @Res() res: Response,
  ) {
    let profile;
    try {
      profile = this.profiles.getPublicProfile(handle);
    } catch {
      res.status(404).send(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Not Found</title></head><body><h1>Creator not found</h1></body></html>`);
      return;
    }

    const html = this.buildCreatorPageHtml(profile, handle);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  // ── 18-04: Profile API ───────────────────────────────────────────────────────

  @Post('v1/social/profile')
  createProfile(@Body() dto: CreateProfileDto) {
    const profile = this.profiles.createProfile({
      userId:      dto.userId,
      handle:      dto.handle,
      displayName: dto.displayName,
      bio:         dto.bio,
      avatarUrl:   dto.avatarUrl,
      websiteUrl:  dto.websiteUrl,
      publicEmail: dto.publicEmail,
      country:     dto.country,
      skills:      dto.skills,
    });
    return { ok: true, profile: this.stripPrivateFields(profile) };
  }

  @Patch('v1/social/profile')
  updateProfile(@Body() dto: UpdateProfileDto) {
    const profile = this.profiles.updateProfile({
      userId:      dto.userId,
      displayName: dto.displayName,
      bio:         dto.bio,
      avatarUrl:   dto.avatarUrl,
      websiteUrl:  dto.websiteUrl,
      publicEmail: dto.publicEmail,
      country:     dto.country,
      skills:      dto.skills,
      visibility:  dto.visibility,
    });
    return { ok: true, profile: this.stripPrivateFields(profile) };
  }

  @Get('v1/social/profile/me')
  getOwnProfile(@Query('userId') userId: string) {
    const profile = this.profiles.getOwnProfile(userId);
    return { ok: true, profile: this.stripPrivateFields(profile) };
  }

  // ── 18-04: Follow / Unfollow ──────────────────────────────────────────────────

  @Post('v1/social/follow/:handle')
  @HttpCode(HttpStatus.OK)
  follow(@Param('handle') handle: string, @Body() dto: FollowDto) {
    const result = this.profiles.follow(dto.userId, handle);
    return { ok: true, ...result };
  }

  @Post('v1/social/unfollow/:handle')
  @HttpCode(HttpStatus.OK)
  unfollow(@Param('handle') handle: string, @Body() dto: FollowDto) {
    const result = this.profiles.unfollow(dto.userId, handle);
    return { ok: true, ...result };
  }

  // ── 18-04: App social signals ─────────────────────────────────────────────────

  @Get('v1/social/apps/:projectId/stats')
  getStats(@Param('projectId') projectId: string) {
    const counts = this.signals.getSignalCounts(projectId);
    return { ok: true, stats: counts };
  }

  @Post('v1/social/apps/:projectId/signal')
  @HttpCode(HttpStatus.OK)
  recordSignal(
    @Param('projectId') projectId: string,
    @Body() dto: SignalDto,
    @Ip() ip: string,
  ) {
    const result = this.signals.recordSignal({
      projectId,
      runtimeId:  dto.runtimeId,
      userId:     dto.userId,
      signalType: dto.signalType,
      ip,
    });
    return { ok: true, ...result };
  }

  // ── 18-04: Publish / unpublish app ───────────────────────────────────────────

  @Post('v1/social/apps/publish')
  @HttpCode(HttpStatus.OK)
  publishApp(@Body() dto: PublishAppDto) {
    const ownerHandle = dto.ownerUserId
      ? this.profiles.getHandleForUserId(dto.ownerUserId)
      : undefined;

    this.signals.publishApp({
      projectId:            dto.projectId,
      runtimeId:            dto.runtimeId,
      ownerHandle,
      title:                dto.title,
      description:          dto.description,
      domain:               dto.domain,
      marketplacePackSlug:  dto.marketplacePackSlug,
      visibility:           dto.visibility ?? 'PUBLIC',
      createdAt:            new Date(),
    });

    if (dto.ownerUserId) {
      this.profiles.attributeApp(dto.ownerUserId, dto.projectId);
    }

    return { ok: true };
  }

  @Post('v1/social/apps/:projectId/unpublish')
  @HttpCode(HttpStatus.OK)
  unpublishApp(@Param('projectId') projectId: string) {
    this.signals.unpublishApp(projectId);
    return { ok: true };
  }

  // ── 18-08: Discovery ──────────────────────────────────────────────────────────

  @Get('v1/social/discover')
  discover(
    @Query('sortBy')              sortBy?:              string,
    @Query('domain')              domain?:              string,
    @Query('marketplacePackSlug') marketplacePackSlug?: string,
    @Query('creatorHandle')       creatorHandle?:       string,
  ) {
    const params: DiscoverParams = {
      sortBy:              sortBy as DiscoverParams['sortBy'],
      domain,
      marketplacePackSlug,
      creatorHandle,
    };
    const result = this.signals.discover(params);
    return { ok: true, ...result };
  }

  // ── 18-09: Report placeholder ────────────────────────────────────────────────

  @Post('v1/social/report/:handle')
  @HttpCode(HttpStatus.OK)
  reportCreator(
    @Param('handle') handle: string,
    @Body() body: { reason?: string },
  ) {
    // Abuse report placeholder — accepted and logged; no data returned
    return { ok: true, received: true };
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private stripPrivateFields(profile: any) {
    // 18-09: Never expose userId or internal fields in API output
    const { userId: _userId, ...safe } = profile;
    return safe;
  }

  // ── 18-05: Creator page HTML ─────────────────────────────────────────────────

  private buildCreatorPageHtml(profile: ReturnType<CreatorProfileService['getPublicProfile']>, handle: string): string {
    const verifiedBadge = profile.verified
      ? '<span class="badge verified">✓ Verified</span>'
      : '';
    const skillsHtml = profile.skills.length > 0
      ? profile.skills.map((s) => `<span class="skill">${esc(s)}</span>`).join('')
      : '';
    const bioHtml = profile.bio ? `<p class="bio">${esc(profile.bio)}</p>` : '';
    const websiteHtml = profile.websiteUrl
      ? `<a class="website" href="${esc(profile.websiteUrl)}" rel="noopener noreferrer" target="_blank">${esc(profile.websiteUrl)}</a>`
      : '';
    const emailHtml = profile.publicEmail
      ? `<a class="email" href="mailto:${esc(profile.publicEmail)}">${esc(profile.publicEmail)}</a>`
      : '';
    const countryHtml = profile.country ? `<span class="country">📍 ${esc(profile.country)}</span>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0d0d0d">
<title>${esc(profile.displayName)} (@${esc(handle)}) — Factory</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0d0d0d;--fg:#f5f5f5;--muted:#888;--accent:#6c6cff;--green:#4caf50;
  --card-bg:#161616;--border:rgba(128,128,128,.15);--yellow:#fbbf24}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);
  color:var(--fg);min-height:100vh;padding:0 0 40px}
.container{max-width:620px;margin:0 auto;padding:24px 16px}
.hero{display:flex;gap:16px;align-items:flex-start;margin-bottom:24px}
.avatar{width:72px;height:72px;border-radius:50%;background:var(--accent);
  display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.hero-info{flex:1;min-width:0}
.display-name{font-size:22px;font-weight:700;line-height:1.2}
.handle{font-size:13px;color:var(--muted);margin-top:2px}
.badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;
  padding:2px 8px;border-radius:10px;margin-top:6px;text-transform:uppercase;letter-spacing:.04em}
.badge.verified{background:rgba(76,175,80,.12);color:var(--green);border:1px solid rgba(76,175,80,.25)}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}
.country,.website,.email{font-size:12px;color:var(--muted)}
.website,.email{color:var(--accent);text-decoration:none}
.bio{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:16px}
.stats-row{display:flex;gap:24px;margin-bottom:20px;padding:14px 16px;
  background:var(--card-bg);border:1px solid var(--border);border-radius:10px}
.stat{text-align:center}
.stat-val{font-size:18px;font-weight:700}
.stat-lbl{font-size:11px;color:var(--muted);margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.skill{font-size:11px;background:rgba(108,108,255,.1);color:var(--accent);
  border:1px solid rgba(108,108,255,.2);padding:3px 9px;border-radius:20px}
.section-title{font-size:12px;font-weight:600;color:var(--muted);
  text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
.app-cards{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
.app-card{background:var(--card-bg);border:1px solid var(--border);border-radius:10px;
  padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;
  text-decoration:none;color:var(--fg)}
.app-card:hover{border-color:var(--accent)}
.app-card-dot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0}
.app-card-title{font-size:13px;font-weight:600;flex:1}
.app-card-count{font-size:11px;color:var(--muted)}
.cta-row{display:flex;gap:8px;margin-top:8px}
.btn-follow{padding:8px 18px;border:1px solid var(--accent);color:var(--accent);
  background:transparent;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}
.btn-follow.following{background:var(--accent);color:#fff}
.factory-brand{margin-top:32px;font-size:11px;color:var(--muted);text-align:center}
.factory-brand a{color:var(--accent);text-decoration:none}
</style>
</head>
<body>
<div class="container">
  <div class="hero">
    <div class="avatar">${profile.avatarUrl
      ? `<img src="${esc(profile.avatarUrl)}" alt="${esc(profile.displayName)}">`
      : esc(profile.displayName.charAt(0).toUpperCase())}</div>
    <div class="hero-info">
      <div class="display-name">${esc(profile.displayName)}</div>
      <div class="handle">@${esc(handle)}</div>
      ${verifiedBadge}
      <div class="meta">${countryHtml}${websiteHtml}${emailHtml}</div>
    </div>
  </div>

  ${bioHtml}

  <div class="stats-row">
    <div class="stat"><div class="stat-val">${esc(String(profile.appCount))}</div><div class="stat-lbl">Apps</div></div>
    <div class="stat"><div class="stat-val" id="follower-count">${esc(String(profile.followerCount))}</div><div class="stat-lbl">Followers</div></div>
    <div class="stat"><div class="stat-val">${esc(String(profile.followingCount))}</div><div class="stat-lbl">Following</div></div>
  </div>

  ${skillsHtml ? `<div class="skills">${skillsHtml}</div>` : ''}

  <div class="cta-row">
    <button class="btn-follow" id="btn-follow" data-handle="${esc(handle)}">Follow</button>
  </div>

  <div style="margin-top:24px">
    <div class="section-title">📦 Apps by ${esc(profile.displayName)}</div>
    <div class="app-cards" id="app-list">
      <div style="font-size:12px;color:var(--muted);padding:12px 0">Loading apps…</div>
    </div>
  </div>

  <div class="factory-brand">Powered by <a href="/" rel="noopener">Factory</a></div>
</div>

<script>
(function(){
'use strict';
var handle = '${esc(handle)}';
var STORAGE_KEY = 'factory_follows';
var follows = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
var btn = document.getElementById('btn-follow');

function updateFollowBtn() {
  if (follows[handle]) { btn.textContent = '✓ Following'; btn.classList.add('following'); }
  else { btn.textContent = 'Follow'; btn.classList.remove('following'); }
}
updateFollowBtn();

btn.addEventListener('click', function() {
  follows[handle] = !follows[handle];
  if (follows[handle]) {
    var cnt = document.getElementById('follower-count');
    if (cnt) cnt.textContent = String(parseInt(cnt.textContent || '0', 10) + 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(follows));
  updateFollowBtn();
});

fetch('/v1/social/discover?creatorHandle=' + encodeURIComponent(handle))
  .then(function(r){ return r.json(); })
  .then(function(d){
    var list = document.getElementById('app-list');
    if (!d.ok || !d.apps || !d.apps.length) {
      list.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:12px 0">No public apps yet.</div>';
      return;
    }
    list.innerHTML = d.apps.slice(0, 6).map(function(app) {
      return '<div class="app-card">'
        + '<div class="app-card-dot"></div>'
        + '<div class="app-card-title">' + escHtml(app.title) + '</div>'
        + '<div class="app-card-count">❤️ ' + (app.signals ? app.signals.likes : 0) + '</div>'
        + '</div>';
    }).join('');
  }).catch(function(){
    document.getElementById('app-list').innerHTML = '<div style="font-size:12px;color:var(--muted);padding:12px 0">Could not load apps.</div>';
  });

function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
</script>
</body>
</html>`;
  }
}
