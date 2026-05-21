import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, Max } from 'class-validator';
import type { Request, Response } from 'express';
import { toDataURL } from 'qrcode';
import { ApiKeyGuard } from '../sandbox/api-key.guard';
import { PreviewLogService } from './preview-log.service';
import { PreviewService } from './preview.service';
import { PreviewTokenService } from './preview-token.service';
import { PreviewShellService } from './preview-shell.service';
import { PreviewAbuseService } from './preview-abuse.service';

const ALLOWED_REASONS = ['spam','malware','phishing','illegal_content','harassment','privacy_violation','copyright','other'];

class IssueTokenDto {
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(30 * 24 * 3600)
  expiresInSec?: number;
}

class ReportDto {
  @IsEnum(ALLOWED_REASONS as string[], { message: 'invalid reason' })
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}

@Controller()
export class PreviewController {
  constructor(
    private readonly previewService: PreviewService,
    private readonly tokenService:   PreviewTokenService,
    private readonly logService:     PreviewLogService,
    private readonly shellService:   PreviewShellService,
    private readonly abuseService:   PreviewAbuseService,
  ) {}

  // 05-05: Issue a signed preview token — requires API key (owner only)
  @UseGuards(ApiKeyGuard)
  @Post('p/:id/token')
  @HttpCode(HttpStatus.OK)
  async issueToken(
    @Param('id') id: string,
    @Body() dto: IssueTokenDto,
    @Req() req: Request,
  ) {
    const runtime = await this.previewService.resolve(id);
    if (runtime.ownerUserId !== (req['userId'] as string)) {
      throw new ForbiddenException('access denied');
    }
    const expiresInSec = dto.expiresInSec ?? 86400;
    const token        = this.tokenService.issue(runtime.id, expiresInSec, req['userId'] as string);
    const expiresAt    = new Date(Date.now() + expiresInSec * 1000);
    return {
      token,
      expiresAt,
      previewUrl: `${runtime.previewUrl ?? ''}?token=${token}`,
    };
  }

  // 05-04: Access check — for frontend gating, no proxy
  @Get('p/:id/check')
  @HttpCode(HttpStatus.OK)
  async checkAccess(@Param('id') id: string, @Req() req: Request) {
    const runtime     = await this.previewService.resolve(id);
    const token       = this.extractToken(req);
    const password    = req.headers['x-preview-password'] as string | undefined;
    const requesterId = req['userId'] as string | undefined;
    const allowed     = await this.previewService.checkAccess(runtime, {
      requesterId,
      password,
      token,
    });
    void this.logService.record({
      runtimeId:  runtime.id,
      ip:         this.previewService.extractIp(req),
      ua:         (req.headers['user-agent'] as string) || '',
      path:       req.path,
      statusCode: allowed ? 200 : 401,
    });
    return {
      allowed,
      status:     runtime.status,
      sleepState: runtime.sleepState,
      visibility: runtime.visibility,
      previewUrl: runtime.previewUrl,
      allowRemix: runtime.allowRemix,
      projectId:  runtime.projectId,   // 09-06: for activity feed in shell
    };
  }

  // 09-01 / 09-03 / 09-04: Mobile preview shell
  @Get('p/:id/shell')
  async previewShell(
    @Param('id')    id:    string,
    @Query('token') token: string | undefined,
    @Res() res: Response,
  ) {
    const runtime = await this.previewService.resolve(id);
    const html = this.shellService.generateHtml({
      runtimeId:  runtime.id,
      previewId:  id,
      visibility: runtime.visibility,
      status:     runtime.status,
      sleepState: runtime.sleepState,
      allowRemix: runtime.allowRemix,
      projectId:  runtime.projectId,
      previewUrl: runtime.previewUrl,
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; frame-src 'self'");
    res.send(html);
  }

  // 09-02: QR code for the preview shell URL
  @Get('p/:id/qr')
  async previewQr(@Param('id') id: string, @Res() res: Response) {
    const runtime = await this.previewService.resolve(id);
    const base    = (process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    const url     = `${base}/p/${encodeURIComponent(id)}/shell`;
    const dataUrl = await toDataURL(url, { width: 240, margin: 2 });
    // dataUrl is "data:image/png;base64,..."
    const b64  = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buf  = Buffer.from(b64, 'base64');
    // Runtime ID used only to resolve — not exposed to the caller
    void runtime;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buf);
  }

  // 09-02: Share metadata — safe public info only
  @Get('p/:id/share')
  @Header('Cache-Control', 'public, max-age=300')
  async shareMetadata(@Param('id') id: string) {
    const runtime = await this.previewService.resolve(id);
    const base    = (process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    const shellUrl = `${base}/p/${encodeURIComponent(id)}/shell`;
    return {
      shellUrl,
      qrUrl:      `/p/${encodeURIComponent(id)}/qr`,
      allowRemix: runtime.allowRemix,
      visibility: runtime.visibility,
      status:     runtime.status,
    };
  }

  // 09-07: Abuse report — rate-limited, hashed IP, no moderation yet
  @Post('p/:id/report')
  @HttpCode(HttpStatus.CREATED)
  async reportAbuse(
    @Param('id') id: string,
    @Body() dto: ReportDto,
    @Req() req: Request,
  ) {
    const runtime = await this.previewService.resolve(id);
    await this.abuseService.report({
      previewId: runtime.id,
      reason:    dto.reason,
      message:   dto.message,
      ip:        this.previewService.extractIp(req),
      userId:    (req['userId'] as string | undefined),
    });
    return { ok: true };
  }

  private extractToken(req: Request): string | undefined {
    const q = req.query['token'];
    if (typeof q === 'string') return q;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.slice(7);
    return undefined;
  }
}
