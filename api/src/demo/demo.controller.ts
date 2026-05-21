import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import type { Request, Response } from 'express';
import { DemoService } from './demo.service';

class StartDemoDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;
}

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  // 11-01: Demo landing page (public, no auth)
  @Get()
  demoPage(
    @Query('prompt') promptPrefill: string | undefined,
    @Query('record') record: string | undefined,
    @Res() res: Response,
  ) {
    const html = this.demoService.generateHtml({
      promptPrefill: typeof promptPrefill === 'string' ? promptPrefill.slice(0, 500) : undefined,
      recordingMode: record === '1',
      demoRuntimeId: process.env.DEMO_RUNTIME_ID,
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; " +
        "img-src 'self' data:; frame-src 'self'; connect-src 'self'",
    );
    res.send(html);
  }

  // 11-06: Starter prompts gallery (public JSON)
  @Get('gallery')
  getGallery() {
    return { ok: true, starters: this.demoService.getGallery() };
  }

  // 11-01: Start a demo session (public, IP rate-limited)
  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startDemo(@Body() dto: StartDemoDto, @Req() req: Request) {
    const ip = this.extractIp(req);
    const { sessionId, demoProjectId } = await this.demoService.startSession(ip, dto.prompt);
    return { ok: true, sessionId, demoProjectId };
  }

  // 11-02: Public activity feed for demo projects (demo-* prefix only)
  @Get('activity/:demoProjectId')
  async getDemoActivity(
    @Param('demoProjectId') demoProjectId: string,
    @Query('limit') limit: string | undefined,
    @Query('after') after: string | undefined,
  ) {
    if (!demoProjectId.startsWith('demo-')) {
      throw new ForbiddenException('Not a demo project');
    }
    const parsedLimit = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
    return this.demoService.getDemoActivity(demoProjectId, parsedLimit, after);
  }

  private extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    return (
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)
        ?.split(',')[0]
        ?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      'unknown'
    ).trim();
  }
}
