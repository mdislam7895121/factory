import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { RuntimeVisibility } from '../../generated/prisma';
import { ApiKeyGuard } from '../api-key.guard';
import { RuntimeService } from './runtime.service';

class CreateRuntimeDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  runtimeType?: string;

  @IsOptional()
  @IsEnum(RuntimeVisibility)
  visibility?: RuntimeVisibility;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresInSec?: number;
}

class SetVisibilityDto {
  @IsEnum(RuntimeVisibility)
  visibility!: RuntimeVisibility;

  @IsOptional()
  @IsString()
  password?: string;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/runtimes')
export class RuntimeController {
  constructor(private readonly runtimeService: RuntimeService) {}

  @Get()
  list(@Req() req: Request) {
    return this.runtimeService.list(req['userId'] as string);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRuntimeDto, @Req() req: Request) {
    return this.runtimeService.create({
      ownerUserId: req['userId'] as string,
      ...dto,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.runtimeService.get(id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  stop(@Param('id') id: string, @Req() req: Request) {
    return this.runtimeService.stop(id, req['userId'] as string);
  }

  @Post(':id/restart')
  @HttpCode(HttpStatus.OK)
  restart(@Param('id') id: string, @Req() req: Request) {
    return this.runtimeService.restart(id, req['userId'] as string);
  }

  @Post(':id/terminate')
  @HttpCode(HttpStatus.OK)
  terminate(@Param('id') id: string, @Req() req: Request) {
    return this.runtimeService.terminate(id, req['userId'] as string);
  }

  @Post(':id/wake')
  @HttpCode(HttpStatus.OK)
  wake(@Param('id') id: string) {
    return this.runtimeService.wake(id);
  }

  @Patch(':id/visibility')
  @HttpCode(HttpStatus.OK)
  setVisibility(
    @Param('id') id: string,
    @Body() dto: SetVisibilityDto,
    @Req() req: Request,
  ) {
    return this.runtimeService.setVisibility(
      id,
      req['userId'] as string,
      dto.visibility,
      dto.password,
    );
  }
}
