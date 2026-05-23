import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { CustomerSuccessService } from './customer-success.service';
import { CreateCohortDto, CreateLeadDto, UpdateLeadStatusDto, CreateNoteDto, CreateTaskDto } from './customer-success.types';

@Controller('admin/customer-success')
export class CustomerSuccessController {
  constructor(private readonly svc: CustomerSuccessService) {}

  @Post('cohorts')
  createCohort(@Body() dto: CreateCohortDto) {
    return this.svc.createCohort(dto);
  }

  @Get('cohorts')
  listCohorts() {
    return this.svc.listCohorts();
  }

  @Get('cohorts/:cohortId')
  getCohort(@Param('cohortId') id: string) {
    return this.svc.getCohort(id);
  }

  @Post('leads')
  addLead(@Body() dto: CreateLeadDto) {
    return this.svc.addLead(dto);
  }

  @Get('leads')
  listLeads(@Query('cohortId') cohortId?: string) {
    return this.svc.listLeads(cohortId);
  }

  @Patch('leads/:leadId/status')
  updateStatus(@Param('leadId') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.svc.updateLeadStatus(id, dto);
  }

  @Post('leads/:leadId/notes')
  addNote(@Param('leadId') id: string, @Body() dto: CreateNoteDto) {
    return this.svc.addNote(id, dto);
  }

  @Get('leads/:leadId/notes')
  getNotes(@Param('leadId') id: string) {
    return this.svc.getNotes(id);
  }

  @Post('leads/:leadId/tasks')
  createTask(@Param('leadId') id: string, @Body() dto: CreateTaskDto) {
    return this.svc.createTask(id, dto);
  }

  @Get('leads/:leadId/health')
  getHealth(@Param('leadId') id: string) {
    return this.svc.computeHealthScore(id);
  }

  @Get('summary')
  getSummary() {
    return this.svc.getOverallSummary();
  }

  @Get('cohorts/:cohortId/summary')
  getCohortSummary(@Param('cohortId') id: string) {
    return this.svc.getCohortSummary(id);
  }

  @Get('tasks')
  listTasks(@Query('leadId') leadId?: string, @Query('status') status?: string) {
    return this.svc.listTasks(leadId, status);
  }
}
