import {
  Controller, Post, Get, Delete, Patch,
  Param, Body, Query, UseGuards, Req,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  IsString, IsOptional, IsInt, IsUrl, IsObject,
  MaxLength, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiKeyGuard } from '../api-key.guard';
import { LoopService } from './loop.service';

class CreateLoopDto {
  @IsString()
  @MaxLength(64)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(300)
  @Max(86_400)
  interval_secs?: number;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_tld: true })
  webhook_url?: string;
}

class ListRunsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/loops')
export class LoopController {
  constructor(private readonly loopService: LoopService) {}

  @Post()
  create(
    @Body() dto: CreateLoopDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.create(
      req.apiUserId,
      dto.name,
      dto.description,
      dto.interval_secs ?? 3600,
      dto.context,
      dto.webhook_url,
    );
  }

  @Get()
  list(@Req() req: Request & { apiUserId: string }) {
    return this.loopService.list(req.apiUserId);
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.get(id, req.apiUserId);
  }

  @Patch(':id/pause')
  @HttpCode(HttpStatus.OK)
  pause(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.pause(id, req.apiUserId);
  }

  @Patch(':id/resume')
  @HttpCode(HttpStatus.OK)
  resume(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.resume(id, req.apiUserId);
  }

  @Post(':id/trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  trigger(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.triggerNow(id, req.apiUserId);
  }

  @Get(':id/runs')
  getRuns(
    @Param('id') id: string,
    @Query() query: ListRunsQuery,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.getRuns(id, req.apiUserId, query.limit);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.loopService.delete(id, req.apiUserId);
  }
}
