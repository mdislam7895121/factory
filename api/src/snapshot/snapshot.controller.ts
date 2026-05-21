import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import type { Request } from 'express';
import { SnapshotType } from '../generated/prisma';
import { ApiKeyGuard } from '../sandbox/api-key.guard';
import { SnapshotService } from './snapshot.service';

class CreateSnapshotDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsEnum(SnapshotType)
  snapshotType?: SnapshotType;
}

@Controller('v1/snapshots')
@UseGuards(ApiKeyGuard)
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

  // 08-04: List snapshots for a project
  @Get(':projectId')
  listByProject(
    @Param('projectId') projectId: string,
    @Query('limit')     limit:     string | undefined,
  ) {
    return this.snapshotService.listByProject(
      projectId,
      limit ? Math.min(parseInt(limit, 10), 100) : 50,
    );
  }

  // 08-04: Create manual snapshot for a runtime scoped to a project
  @Post(':projectId')
  @HttpCode(HttpStatus.CREATED)
  async createSnapshot(
    @Param('projectId') projectId: string,
    @Body() dto: CreateSnapshotDto,
    @Req() req: Request & { user?: { id: string } },
  ) {
    const ownerUserId = req.user?.id ?? 'api';
    return this.snapshotService.createSnapshot({
      projectId,
      runtimeId:    projectId, // projectId doubles as runtimeId for simple flows
      ownerUserId,
      label:        dto.label,
      reason:       dto.reason,
      snapshotType: dto.snapshotType ?? SnapshotType.MANUAL,
    });
  }

  // 08-04: Restore a snapshot by ID
  @Post(':snapshotId/restore')
  @HttpCode(HttpStatus.OK)
  async restoreSnapshot(
    @Param('snapshotId') snapshotId: string,
    @Req() req: Request & { user?: { id: string } },
  ) {
    const requesterId = req.user?.id ?? 'api';
    return this.snapshotService.restoreSnapshot(snapshotId, requesterId);
  }
}
