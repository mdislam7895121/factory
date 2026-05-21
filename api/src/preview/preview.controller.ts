import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import type { Request } from 'express';
import { ApiKeyGuard } from '../sandbox/api-key.guard';
import { PreviewLogService } from './preview-log.service';
import { PreviewService } from './preview.service';
import { PreviewTokenService } from './preview-token.service';

class IssueTokenDto {
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(30 * 24 * 3600)
  expiresInSec?: number;
}

@Controller()
export class PreviewController {
  constructor(
    private readonly previewService: PreviewService,
    private readonly tokenService:   PreviewTokenService,
    private readonly logService:     PreviewLogService,
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
    };
  }

  private extractToken(req: Request): string | undefined {
    const q = req.query['token'];
    if (typeof q === 'string') return q;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.slice(7);
    return undefined;
  }
}
