import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyGuard } from './api-key.guard';
import { UsageService } from './usage.service';

@UseGuards(ApiKeyGuard)
@Controller('v1/usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('today')
  getToday(@Req() req: Request & { apiUserId: string }) {
    return this.usageService.getToday(req.apiUserId);
  }

  @Get('summary')
  getSummary(@Req() req: Request & { apiUserId: string }) {
    return this.usageService.getSummary(req.apiUserId);
  }
}
