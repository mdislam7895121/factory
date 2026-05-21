import {
  Controller, Post, Get, Delete,
  Param, Body, UseGuards, Req,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyService } from './api-key.service';

class CreateApiKeyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name!: string;
}

@UseGuards(ApiKeyGuard)
@Controller('v1/api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(
    @Body() dto: CreateApiKeyDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.apiKeyService.create(req.apiUserId, dto.name);
  }

  @Get()
  list(@Req() req: Request & { apiUserId: string }) {
    return this.apiKeyService.list(req.apiUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  revoke(
    @Param('id') id: string,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.apiKeyService.revoke(id, req.apiUserId);
  }
}
