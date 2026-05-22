import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { MemoryService } from './memory.service';
import type { CompressionLevel, DecisionLockState, MemoryPriority, MemoryVisibility } from './memory.types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class SaveProfileDto {
  @IsString() userId!: string;
  @IsOptional() @IsString() @MaxLength(60)  workspaceId?: string;
  @IsOptional() @IsString() @MaxLength(60)  founderName?: string;
  @IsOptional() @IsString() @MaxLength(80)  company?: string;
  @IsOptional() @IsString() @MaxLength(60)  role?: string;
  @IsOptional() @IsString() @MaxLength(60)  country?: string;
  @IsOptional() @IsString() @MaxLength(60)  timezone?: string;
  @IsOptional() @IsString() @MaxLength(10)  preferredLang?: string;
  @IsOptional() @IsString() @MaxLength(30)  techLevel?: string;
  @IsOptional() @IsString() @MaxLength(30)  commStyle?: string;
  @IsOptional() preferredStack?: string[];
  @IsOptional() goals?: string[];
  @IsOptional() @IsIn(['PUBLIC','WORKSPACE','PRIVATE']) visibility?: MemoryVisibility;
}

class AddEntryDto {
  @IsString()               projectId!:   string;
  @IsOptional() @IsString() workspaceId?: string;
  @IsOptional() @IsString() userId?:      string;
  @IsString()   @MaxLength(120) key!:     string;
  @IsString()   @MaxLength(8000) content!: string;
  @IsOptional() @IsIn(['LOW','NORMAL','HIGH','CRITICAL']) priority?: MemoryPriority;
  @IsOptional() tags?: string[];
}

class UpdateEntryDto {
  @IsOptional() @IsString() @MaxLength(120)  key?: string;
  @IsOptional() @IsString() @MaxLength(8000) content?: string;
  @IsOptional() @IsIn(['LOW','NORMAL','HIGH','CRITICAL']) priority?: MemoryPriority;
  @IsOptional() pinned?: boolean;
  @IsOptional() archived?: boolean;
  @IsOptional() tags?: string[];
}

class AddDecisionDto {
  @IsString()               projectId!:    string;
  @IsOptional() @IsString() workspaceId?:  string;
  @IsString()   @MaxLength(200) title!:    string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
}

class LockDecisionDto {
  @IsString()               lockedBy!: string;
  @IsOptional() @IsIn(['SOFT_LOCKED','HARD_LOCKED']) state?: DecisionLockState;
}

class SaveInstructionsDto {
  @IsString()               workspaceId!: string;
  @IsOptional() @IsString() userId?:      string;
  @IsString()   @MaxLength(100) name!:    string;
  rules!:        string[];
  @IsOptional() @IsIn(['LOW','NORMAL','HIGH','CRITICAL']) priority?: MemoryPriority;
}

class CreateSnapshotDto {
  @IsString() workspaceId!:    string;
  @IsOptional() @IsString() projectId?: string;
  @IsString() @MaxLength(200) label!:   string;
}

class GeneratePackDto {
  @IsString()               workspaceId!: string;
  @IsOptional() @IsString() projectId?:   string;
  @IsString()   @MaxLength(200) label!:   string;
  @IsOptional() @IsIn(['FULL','BALANCED','MINIMAL','EMERGENCY']) compressionLevel?: CompressionLevel;
}

@Controller('v1/memory')
export class MemoryController {
  constructor(private readonly memory: MemoryService) {}

  // ── 20E-02: Founder Profile ───────────────────────────────────────────────

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  saveProfile(@Body() dto: SaveProfileDto) {
    const profile = this.memory.saveProfile(dto.userId, dto);
    return { ok: true, profile };
  }

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    const profile = this.memory.getProfile(userId);
    if (!profile) return { ok: true, profile: null };
    return { ok: true, profile };
  }

  @Delete('profile/:userId')
  @HttpCode(HttpStatus.OK)
  deleteProfile(@Param('userId') userId: string) {
    this.memory.deleteProfile(userId);
    return { ok: true };
  }

  // ── 20E-04: Project Memory ────────────────────────────────────────────────

  @Post('entries')
  addEntry(@Body() dto: AddEntryDto) {
    const entry = this.memory.addEntry(dto);
    return { ok: true, entry };
  }

  @Get('entries')
  listEntries(
    @Query('projectId')      projectId:       string,
    @Query('includeArchived') includeArchived?: string,
    @Query('pinnedOnly')     pinnedOnly?:      string,
    @Query('tag')            tag?:             string,
  ) {
    const entries = this.memory.listEntries(projectId, {
      includeArchived: includeArchived === 'true',
      pinnedOnly:      pinnedOnly === 'true',
      tag,
    });
    return { ok: true, entries, total: entries.length };
  }

  @Put('entries/:id')
  updateEntry(@Param('id') id: string, @Body() dto: UpdateEntryDto) {
    const entry = this.memory.updateEntry(id, dto);
    return { ok: true, entry };
  }

  @Delete('entries/:id')
  @HttpCode(HttpStatus.OK)
  deleteEntry(@Param('id') id: string) {
    this.memory.deleteEntry(id);
    return { ok: true };
  }

  // ── 20E-05: Decisions ─────────────────────────────────────────────────────

  @Post('decisions')
  addDecision(@Body() dto: AddDecisionDto) {
    const decision = this.memory.addDecision(dto);
    return { ok: true, decision };
  }

  @Get('decisions')
  listDecisions(@Query('projectId') projectId: string) {
    return { ok: true, decisions: this.memory.listDecisions(projectId) };
  }

  @Post('decisions/:id/lock')
  @HttpCode(HttpStatus.OK)
  lockDecision(@Param('id') id: string, @Body() dto: LockDecisionDto) {
    const decision = this.memory.lockDecision(id, dto.lockedBy, dto.state ?? 'SOFT_LOCKED');
    return { ok: true, decision };
  }

  @Post('decisions/:id/unlock')
  @HttpCode(HttpStatus.OK)
  unlockDecision(@Param('id') id: string) {
    const decision = this.memory.unlockDecision(id);
    return { ok: true, decision };
  }

  // ── 20E-03: Agent Instructions ────────────────────────────────────────────

  @Post('instructions')
  @HttpCode(HttpStatus.OK)
  saveInstructions(@Body() dto: SaveInstructionsDto) {
    const set = this.memory.saveInstructions(dto.workspaceId, dto);
    return { ok: true, instructions: set };
  }

  @Get('instructions')
  getInstructions(@Query('workspaceId') workspaceId: string) {
    return { ok: true, instructions: this.memory.getInstructions(workspaceId) };
  }

  // ── 20E-07: Snapshots ─────────────────────────────────────────────────────

  @Post('snapshots')
  createSnapshot(@Body() dto: CreateSnapshotDto) {
    const snap = this.memory.createSnapshot(dto.workspaceId, dto.projectId, dto.label);
    return { ok: true, snapshot: { ...snap, payload: undefined, _payloadSize: JSON.stringify(snap.payload).length } };
  }

  @Get('snapshots')
  listSnapshots(@Query('workspaceId') workspaceId: string) {
    const snaps = this.memory.listSnapshots(workspaceId).map(s => ({
      id: s.id, workspaceId: s.workspaceId, projectId: s.projectId,
      label: s.label, createdAt: s.createdAt,
      _payloadSize: JSON.stringify(s.payload).length,
    }));
    return { ok: true, snapshots: snaps, total: snaps.length };
  }

  @Post('snapshots/:id/restore')
  @HttpCode(HttpStatus.OK)
  restoreSnapshot(@Param('id') id: string) {
    const result = this.memory.restoreSnapshot(id);
    return { ok: true, ...result };
  }

  // ── 20E-06: Context Packs ─────────────────────────────────────────────────

  @Post('context-packs')
  generatePack(@Body() dto: GeneratePackDto) {
    const pack = this.memory.generateContextPack(
      dto.workspaceId, dto.projectId, dto.label, dto.compressionLevel ?? 'BALANCED',
    );
    return { ok: true, pack };
  }

  @Get('context-packs')
  listPacks(@Query('workspaceId') workspaceId: string) {
    return { ok: true, packs: this.memory.listContextPacks(workspaceId) };
  }

  // ── 20E-09: Context Replay ────────────────────────────────────────────────

  @Get('context-packs/:id/replay')
  getReplay(@Param('id') id: string) {
    const replay = this.memory.buildReplayPack(id);
    return { ok: true, replay };
  }

  // ── 20E-11: Audit ─────────────────────────────────────────────────────────

  @Get('audit')
  getAudit(
    @Query('workspaceId') workspaceId?: string,
    @Query('limit')       limitRaw?:    string,
  ) {
    const events = this.memory.getAuditLog(workspaceId, limitRaw ? Math.min(parseInt(limitRaw, 10), 200) : 50);
    return { ok: true, events, total: events.length };
  }
}
