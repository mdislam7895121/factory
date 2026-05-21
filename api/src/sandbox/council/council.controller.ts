import {
  Controller, Post, Get, Body, Param, Query,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsString, MaxLength, IsOptional, IsObject, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiKeyGuard } from '../api-key.guard';
import { CouncilService } from './council.service';

class StartCouncilDto {
  @IsString()
  @MaxLength(4000)
  task!: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}

class ListQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/council')
export class CouncilController {
  constructor(private readonly councilService: CouncilService) {}

  @Post('run')
  @HttpCode(HttpStatus.ACCEPTED)
  start(
    @Body() dto: StartCouncilDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.councilService.start(req.apiUserId, dto.task, dto.context);
  }

  @Get()
  list(
    @Query() query: ListQuery,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.councilService.listSessions(req.apiUserId, query.limit);
  }

  @Get(':id')
  getSession(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.councilService.getSession(id, req.apiUserId);
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.councilService.getMessages(id, req.apiUserId);
  }
}
