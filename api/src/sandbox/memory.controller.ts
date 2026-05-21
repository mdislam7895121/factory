import {
  Controller, Get, Put, Delete, Post,
  Param, Body, Query, UseGuards, Req,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsOptional, IsInt, IsString, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiKeyGuard } from './api-key.guard';
import { MemoryService } from './memory.service';

class SetMemoryDto {
  value!: unknown;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(86_400 * 30) // max 30 days
  ttl_secs?: number;
}

class LogEventDto {
  @IsString()
  event_type!: string;

  payload!: unknown;
}

class ListEventsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @IsString()
  before?: string;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  // ── Key-Value Memory ────────────────────────────────────────────────────

  @Put(':namespace/:key')
  set(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Body() dto: SetMemoryDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.set(req.apiUserId, namespace, key, dto.value, dto.ttl_secs);
  }

  @Get(':namespace/:key')
  get(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.get(req.apiUserId, namespace, key);
  }

  @Get(':namespace')
  list(
    @Param('namespace') namespace: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.list(req.apiUserId, namespace);
  }

  @Delete(':namespace/:key')
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.delete(req.apiUserId, namespace, key);
  }

  @Delete(':namespace')
  @HttpCode(HttpStatus.OK)
  clearNamespace(
    @Param('namespace') namespace: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.clearNamespace(req.apiUserId, namespace);
  }

  // ── Event Log ────────────────────────────────────────────────────────────

  @Post(':namespace/events')
  @HttpCode(HttpStatus.OK)
  logEvent(
    @Param('namespace') namespace: string,
    @Body() dto: LogEventDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.logEvent(req.apiUserId, namespace, dto.event_type, dto.payload);
  }

  @Get(':namespace/events')
  getEvents(
    @Param('namespace') namespace: string,
    @Query() query: ListEventsQuery,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.memoryService.getEvents(
      req.apiUserId,
      namespace,
      query.limit,
      query.before,
    );
  }
}
