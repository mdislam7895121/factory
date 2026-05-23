import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  BetaCohort, BetaInviteLead, CustomerSuccessNote, CustomerSuccessTask,
  CustomerHealthScore, CohortActivationSummary, HealthDimension, HealthLevel,
  CreateCohortDto, CreateLeadDto, UpdateLeadStatusDto, CreateNoteDto, CreateTaskDto,
  VALID_COHORT_TYPES, VALID_LEAD_STATUSES, VALID_TASK_TYPES,
  CS_BLOCKED_META_KEYS, MAX_NOTE_LEN, MAX_TASK_TITLE_LEN, MAX_DISPLAY_NAME_LEN,
  MAX_COHORTS, MAX_LEADS_PER_COHORT,
} from './customer-success.types';

function fnv32(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function hashEmail(email: string): string {
  if (!email || !email.includes('@')) return `anon_${fnv32(email || 'empty')}`;
  return `u_${fnv32(email.trim().toLowerCase())}`;
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [local, domain] = email.split('@');
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  return `${visible}***@${domain}`;
}

function uid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable()
export class CustomerSuccessService {
  private readonly cohorts = new Map<string, BetaCohort>();
  private readonly leads = new Map<string, BetaInviteLead>();
  private readonly notes = new Map<string, CustomerSuccessNote[]>();
  private readonly tasks = new Map<string, CustomerSuccessTask>();
  private readonly healthCache = new Map<string, CustomerHealthScore>();

  private now(): string { return new Date().toISOString(); }

  private validateNote(body: string): void {
    if (!body || body.trim().length < 2) throw new BadRequestException('Note too short');
    if (body.length > MAX_NOTE_LEN) throw new BadRequestException('Note too long');
    for (const k of CS_BLOCKED_META_KEYS) {
      if (body.toLowerCase().includes(k.toLowerCase())) {
        throw new BadRequestException(`Note contains blocked keyword: ${k}`);
      }
    }
  }

  private sanitizeText(text: string, max: number): string {
    return text.replace(/[<>]/g, '').slice(0, max);
  }

  // ──────────────────────────────────────────────────────────── Cohorts

  createCohort(dto: CreateCohortDto): BetaCohort {
    if (this.cohorts.size >= MAX_COHORTS) throw new BadRequestException('Max cohorts reached');
    if (!dto.name?.trim()) throw new BadRequestException('Cohort name required');
    if (!VALID_COHORT_TYPES.includes(dto.type)) {
      throw new BadRequestException(`Invalid cohort type. Valid: ${VALID_COHORT_TYPES.join(', ')}`);
    }
    const id = uid();
    const cohort: BetaCohort = {
      id,
      name: this.sanitizeText(dto.name, 80),
      type: dto.type,
      description: dto.description ? this.sanitizeText(dto.description, 300) : '',
      createdAt: this.now(),
      updatedAt: this.now(),
      leadCount: 0,
      maxSize: dto.maxSize ?? 100,
      isOpen: true,
    };
    this.cohorts.set(id, cohort);
    return cohort;
  }

  getCohort(id: string): BetaCohort {
    const c = this.cohorts.get(id);
    if (!c) throw new NotFoundException(`Cohort ${id} not found`);
    return c;
  }

  listCohorts(): BetaCohort[] {
    return Array.from(this.cohorts.values()).sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt),
    );
  }

  // ──────────────────────────────────────────────────────────── Leads

  addLead(dto: CreateLeadDto): BetaInviteLead {
    const cohort = this.getCohort(dto.cohortId);
    if (!cohort.isOpen) throw new BadRequestException('Cohort is closed');

    const leadsInCohort = Array.from(this.leads.values()).filter(l => l.cohortId === dto.cohortId);
    if (leadsInCohort.length >= MAX_LEADS_PER_COHORT) {
      throw new BadRequestException('Cohort is full');
    }
    if (!dto.email?.includes('@')) throw new BadRequestException('Valid email required');

    const id = uid();
    const lead: BetaInviteLead = {
      id,
      cohortId: dto.cohortId,
      emailHash: hashEmail(dto.email),
      emailMasked: maskEmail(dto.email),
      displayName: dto.displayName
        ? this.sanitizeText(dto.displayName, MAX_DISPLAY_NAME_LEN)
        : maskEmail(dto.email),
      status: 'INVITED',
      role: dto.role,
      techLevel: dto.techLevel,
      businessGoal: dto.businessGoal,
      onboardingState: 'NEW',
      onboardingStepCount: 0,
      demoCompleted: false,
      previewRevealed: false,
      workspaceOpened: false,
      feedbackCount: 0,
      supportTicketCount: 0,
      billingIntent: false,
      inviteAccepted: false,
      lastActivityAt: null,
      joinedAt: null,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.leads.set(id, lead);
    cohort.leadCount++;
    cohort.updatedAt = this.now();
    this.cohorts.set(dto.cohortId, cohort);
    return lead;
  }

  getLead(id: string): BetaInviteLead {
    const l = this.leads.get(id);
    if (!l) throw new NotFoundException(`Lead ${id} not found`);
    return l;
  }

  listLeads(cohortId?: string): BetaInviteLead[] {
    const all = Array.from(this.leads.values());
    const filtered = cohortId ? all.filter(l => l.cohortId === cohortId) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateLeadStatus(id: string, dto: UpdateLeadStatusDto): BetaInviteLead {
    const lead = this.getLead(id);
    if (!VALID_LEAD_STATUSES.includes(dto.status)) {
      throw new BadRequestException(`Invalid status. Valid: ${VALID_LEAD_STATUSES.join(', ')}`);
    }
    lead.status = dto.status;
    if (dto.status === 'JOINED' && !lead.joinedAt) {
      lead.joinedAt = this.now();
      lead.inviteAccepted = true;
    }
    lead.updatedAt = this.now();
    lead.lastActivityAt = this.now();
    this.leads.set(id, lead);
    this.healthCache.delete(id);
    return lead;
  }

  patchLeadActivity(id: string, patch: Partial<Pick<BetaInviteLead,
    'onboardingState' | 'onboardingStepCount' | 'demoCompleted' | 'previewRevealed' |
    'workspaceOpened' | 'feedbackCount' | 'supportTicketCount' | 'billingIntent'
  >>): BetaInviteLead {
    const lead = this.getLead(id);
    Object.assign(lead, patch, { updatedAt: this.now(), lastActivityAt: this.now() });
    this.leads.set(id, lead);
    this.healthCache.delete(id);
    return lead;
  }

  // ──────────────────────────────────────────────────────────── Notes

  addNote(leadId: string, dto: CreateNoteDto): CustomerSuccessNote {
    this.getLead(leadId);
    this.validateNote(dto.body);
    const note: CustomerSuccessNote = {
      id: uid(),
      leadId,
      body: this.sanitizeText(dto.body, MAX_NOTE_LEN),
      author: this.sanitizeText(dto.author ?? 'team', 60),
      createdAt: this.now(),
    };
    const existing = this.notes.get(leadId) ?? [];
    existing.push(note);
    this.notes.set(leadId, existing);
    return note;
  }

  getNotes(leadId: string): CustomerSuccessNote[] {
    this.getLead(leadId);
    return this.notes.get(leadId) ?? [];
  }

  // ──────────────────────────────────────────────────────────── Tasks

  createTask(leadId: string, dto: CreateTaskDto): CustomerSuccessTask {
    const lead = this.getLead(leadId);
    if (!VALID_TASK_TYPES.includes(dto.type)) {
      throw new BadRequestException(`Invalid task type. Valid: ${VALID_TASK_TYPES.join(', ')}`);
    }
    if (!dto.title?.trim() || dto.title.length < 3) {
      throw new BadRequestException('Task title must be at least 3 chars');
    }
    const task: CustomerSuccessTask = {
      id: uid(),
      leadId,
      cohortId: lead.cohortId,
      type: dto.type,
      title: this.sanitizeText(dto.title, MAX_TASK_TITLE_LEN),
      body: dto.body ? this.sanitizeText(dto.body, 500) : '',
      status: 'OPEN',
      dueAt: dto.dueAt ?? null,
      createdAt: this.now(),
      updatedAt: this.now(),
      completedAt: null,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  completeTask(taskId: string): CustomerSuccessTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);
    task.status = 'DONE';
    task.completedAt = this.now();
    task.updatedAt = this.now();
    this.tasks.set(taskId, task);
    return task;
  }

  listTasks(leadId?: string, status?: string): CustomerSuccessTask[] {
    const all = Array.from(this.tasks.values());
    return all
      .filter(t => (!leadId || t.leadId === leadId) && (!status || t.status === status))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ──────────────────────────────────────────────────────────── Health Score

  computeHealthScore(leadId: string): CustomerHealthScore {
    const lead = this.getLead(leadId);

    const dims: HealthDimension[] = [
      this.scoreDimension(
        'Onboarding progress',
        Math.min(100, lead.onboardingStepCount * 15),
        15,
        lead.onboardingStepCount >= 4 ? 'POSITIVE' : lead.onboardingStepCount >= 2 ? 'NEUTRAL' : 'NEGATIVE',
        lead.onboardingStepCount >= 4 ? 'Good onboarding progress' : 'Not enough steps completed',
      ),
      this.scoreDimension(
        'Demo completed',
        lead.demoCompleted ? 100 : 0,
        20,
        lead.demoCompleted ? 'POSITIVE' : 'NEGATIVE',
        lead.demoCompleted ? 'Demo completed' : 'Demo not completed yet',
      ),
      this.scoreDimension(
        'Preview revealed',
        lead.previewRevealed ? 100 : 0,
        20,
        lead.previewRevealed ? 'POSITIVE' : 'NEGATIVE',
        lead.previewRevealed ? 'Saw live preview' : 'Has not seen preview',
      ),
      this.scoreDimension(
        'Workspace opened',
        lead.workspaceOpened ? 100 : 0,
        15,
        lead.workspaceOpened ? 'POSITIVE' : 'NEUTRAL',
        lead.workspaceOpened ? 'Workspace active' : 'No workspace yet',
      ),
      this.scoreDimension(
        'Feedback submitted',
        Math.min(100, lead.feedbackCount * 25),
        10,
        lead.feedbackCount > 0 ? 'POSITIVE' : 'NEUTRAL',
        lead.feedbackCount > 0 ? `${lead.feedbackCount} feedback items` : 'No feedback yet',
      ),
      this.scoreDimension(
        'Support burden',
        lead.supportTicketCount === 0 ? 100 : Math.max(0, 100 - lead.supportTicketCount * 20),
        10,
        lead.supportTicketCount === 0 ? 'POSITIVE' : lead.supportTicketCount <= 2 ? 'NEUTRAL' : 'NEGATIVE',
        lead.supportTicketCount === 0 ? 'No support tickets' : `${lead.supportTicketCount} open tickets`,
      ),
      this.scoreDimension(
        'Billing intent',
        lead.billingIntent ? 100 : 40,
        5,
        lead.billingIntent ? 'POSITIVE' : 'NEUTRAL',
        lead.billingIntent ? 'Expressed upgrade intent' : 'No billing intent yet',
      ),
      this.scoreDimension(
        'Recent activity',
        this.activityScore(lead.lastActivityAt),
        5,
        this.activitySignal(lead.lastActivityAt),
        this.activityReason(lead.lastActivityAt),
      ),
    ];

    const totalWeight = dims.reduce((s, d) => s + d.weight, 0);
    const rawScore = dims.reduce((s, d) => s + (d.score * d.weight) / 100, 0);
    const score = Math.round((rawScore / totalWeight) * 100);

    const health = this.scoreToHealth(score);
    const recommendedAction = this.recommendAction(lead, health);

    const result: CustomerHealthScore = {
      leadId, score, health, dimensions: dims, recommendedAction,
      computedAt: this.now(),
    };
    this.healthCache.set(leadId, result);
    return result;
  }

  private scoreDimension(
    name: string, score: number, weight: number,
    signal: HealthDimension['signal'], reason: string,
  ): HealthDimension {
    return { name, score: Math.max(0, Math.min(100, score)), weight, signal, reason };
  }

  private activityScore(lastAt: string | null): number {
    if (!lastAt) return 10;
    const ageH = (Date.now() - new Date(lastAt).getTime()) / 3600000;
    if (ageH < 24) return 100;
    if (ageH < 72) return 70;
    if (ageH < 168) return 40;
    return 10;
  }

  private activitySignal(lastAt: string | null): HealthDimension['signal'] {
    if (!lastAt) return 'NEGATIVE';
    const ageH = (Date.now() - new Date(lastAt).getTime()) / 3600000;
    return ageH < 72 ? 'POSITIVE' : ageH < 168 ? 'NEUTRAL' : 'NEGATIVE';
  }

  private activityReason(lastAt: string | null): string {
    if (!lastAt) return 'No activity recorded';
    const ageH = (Date.now() - new Date(lastAt).getTime()) / 3600000;
    if (ageH < 24) return 'Active within 24h';
    if (ageH < 72) return 'Active within 3 days';
    if (ageH < 168) return 'Active within 7 days';
    return 'Inactive for 7+ days';
  }

  private scoreToHealth(score: number): HealthLevel {
    if (score >= 70) return 'GOOD';
    if (score >= 45) return 'WATCH';
    if (score >= 25) return 'AT_RISK';
    return 'CRITICAL';
  }

  private recommendAction(lead: BetaInviteLead, health: HealthLevel): string {
    if (!lead.demoCompleted) return 'Send demo help — user has not completed demo';
    if (!lead.previewRevealed) return 'Schedule activation nudge — preview not seen';
    if (lead.supportTicketCount > 2) return 'Triage support tickets — high support load';
    if (health === 'CRITICAL') return 'Immediate churn prevention outreach';
    if (health === 'AT_RISK') return 'Send personalised check-in email';
    if (!lead.billingIntent) return 'Share upgrade value — no billing intent';
    if (!lead.workspaceOpened) return 'Invite to open workspace and explore';
    return 'Continue monitoring — user is healthy';
  }

  // ──────────────────────────────────────────────────────────── Activation Summary

  getCohortSummary(cohortId: string): CohortActivationSummary {
    const cohort = this.getCohort(cohortId);
    const leads = this.listLeads(cohortId);

    const count = (status: string) => leads.filter(l => l.status === status).length;
    const stuckLeads = leads.filter(l => l.status === 'STUCK');

    const topStuckReasons: string[] = [];
    if (stuckLeads.some(l => !l.demoCompleted)) topStuckReasons.push('Demo not completed');
    if (stuckLeads.some(l => !l.previewRevealed)) topStuckReasons.push('Preview not revealed');
    if (stuckLeads.some(l => l.supportTicketCount > 2)) topStuckReasons.push('High support load');
    if (stuckLeads.some(l => !l.workspaceOpened)) topStuckReasons.push('Workspace not opened');

    const previewLeads = leads.filter(l => l.previewRevealed);
    const avgStepsToPreview = previewLeads.length > 0
      ? Math.round((previewLeads.reduce((s, l) => s + l.onboardingStepCount, 0) / previewLeads.length) * 10) / 10
      : 0;

    const activatedCount = leads.filter(l => l.previewRevealed && l.demoCompleted).length;
    const joinedCount = count('JOINED') + count('ACTIVE') + count('CONVERTED') + count('STUCK') + count('CHURN_RISK');

    return {
      cohortId,
      cohortName: cohort.name,
      invitedCount: leads.length,
      joinedCount,
      activeCount: count('ACTIVE'),
      activatedCount,
      stuckCount: count('STUCK'),
      convertedCount: count('CONVERTED'),
      churnRiskCount: count('CHURN_RISK'),
      closedCount: count('CLOSED'),
      avgStepsToPreview,
      supportVolume: leads.reduce((s, l) => s + l.supportTicketCount, 0),
      upgradeIntentCount: leads.filter(l => l.billingIntent).length,
      topStuckReasons,
      activationRate: leads.length > 0 ? Math.round((activatedCount / leads.length) * 100) : 0,
    };
  }

  getOverallSummary(): CohortActivationSummary[] {
    return this.listCohorts().map(c => this.getCohortSummary(c.id));
  }
}
