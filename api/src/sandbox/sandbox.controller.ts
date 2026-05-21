import {
  Controller, Post, Delete, Get,
  Param, Body, UseGuards, Req,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsString, IsIn, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiKeyGuard } from './api-key.guard';
import { SandboxService } from './sandbox.service';

class CreateSandboxDto {
  @IsString()
  @IsIn(['python', 'nodejs', 'bash'])
  language!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3600)
  timeout_secs?: number;
}

class RunCodeDto {
  @IsString()
  code!: string;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/sandbox')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post('create')
  create(
    @Body() dto: CreateSandboxDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.sandboxService.create(req.apiUserId, dto.language, dto.timeout_secs);
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.sandboxService.get(id, req.apiUserId);
  }

  @Post(':id/run')
  @HttpCode(HttpStatus.OK)
  run(
    @Param('id') id: string,
    @Body() dto: RunCodeDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.sandboxService.run(id, req.apiUserId, dto.code);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  terminate(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.sandboxService.terminate(id, req.apiUserId);
  }
}
