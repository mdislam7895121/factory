import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ActivationState, OnboardingProfile, OnboardingStep, ActivationEvent,
  OnboardingChecklist, ChecklistItem, NextAction, StuckDiagnosis, StuckReason,
  ActivationAnalytics, CHECKLIST_LABELS, STEP_TO_STATE, ACTIVATION_STATE_ORDER,
  ONBOARDING_BLOCKED_META_KEYS, MAX_USER_ID_LEN,
} from './onboarding.types';

@Injectable()
export class OnboardingService {
  private readonly profiles = new Map<string, OnboardingProfile>();
  private readonly events: ActivationEvent[] = [];

  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new BadRequestException('userId is required');
    }
    if (userId.length > MAX_USER_ID_LEN) {
      throw new BadRequestException('userId too long');
    }
    // block raw secret patterns in userId
    const lc = userId.toLowerCase();
    for (const k of ONBOARDING_BLOCKED_META_KEYS) {
      if (lc.includes(k.toLowerCase())) {
        throw new BadRequestException('Invalid userId');
      }
    }
  }

  private validateMeta(meta?: Record<string, unknown>): Record<string, string | number | boolean> {
    if (!meta) return {};
    const safe: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(meta)) {
      if (ONBOARDING_BLOCKED_META_KEYS.has(k)) continue;
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        safe[k] = typeof v === 'string' ? v.slice(0, 200) : v;
      }
    }
    return safe;
  }

  private now(): string {
    return new Date().toISOString();
  }

  createOrGet(userId: string): OnboardingProfile {
    this.validateUserId(userId);
    if (this.profiles.has(userId)) {
      return this.profiles.get(userId)!;
    }
    const profile: OnboardingProfile = {
      userId,
      state: 'NEW',
      role: null,
      techLevel: null,
      businessGoal: null,
      startingPath: null,
      completedSteps: [],
      skipped: false,
      createdAt: this.now(),
      updatedAt: this.now(),
      activatedAt: null,
      stuckAt: null,
      stuckReason: null,
      lastEventAt: null,
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  getProfile(userId: string): OnboardingProfile {
    this.validateUserId(userId);
    const profile = this.profiles.get(userId);
    if (!profile) throw new NotFoundException(`Onboarding profile not found for user ${userId}`);
    return profile;
  }

  recordEvent(userId: string, step: OnboardingStep, meta?: Record<string, unknown>): OnboardingProfile {
    this.validateUserId(userId);
    const profile = this.createOrGet(userId);
    const safeMeta = this.validateMeta(meta);
    const ts = this.now();

    const event: ActivationEvent = { userId, step, timestamp: ts, meta: safeMeta };
    this.events.push(event);

    if (!profile.completedSteps.includes(step)) {
      profile.completedSteps.push(step);
    }
    profile.lastEventAt = ts;
    profile.updatedAt = ts;

    const nextState = STEP_TO_STATE[step];
    if (nextState) {
      const currentIdx = ACTIVATION_STATE_ORDER.indexOf(profile.state);
      const nextIdx = ACTIVATION_STATE_ORDER.indexOf(nextState);
      if (nextIdx > currentIdx) {
        profile.state = nextState;
      }
    }

    if (profile.state === 'STUCK') {
      profile.state = 'PROFILE_STARTED';
      profile.stuckAt = null;
      profile.stuckReason = null;
    }

    this.checkActivation(profile);
    this.profiles.set(userId, profile);
    return profile;
  }

  skipOnboarding(userId: string): OnboardingProfile {
    const profile = this.createOrGet(userId);
    profile.skipped = true;
    profile.updatedAt = this.now();
    return profile;
  }

  private checkActivation(profile: OnboardingProfile): void {
    const has = (s: OnboardingStep) => profile.completedSteps.includes(s);
    if (has('PREVIEW_REVEALED') && has('IDEA_ENTERED') && has('DEMO_STARTED')) {
      if (profile.state !== 'ACTIVATED') {
        profile.state = 'ACTIVATED';
        profile.activatedAt = this.now();
      }
    }
  }

  detectStuck(userId: string): StuckDiagnosis | null {
    const profile = this.profiles.get(userId);
    if (!profile) return null;
    if (profile.state === 'ACTIVATED') return null;

    const has = (s: OnboardingStep) => profile.completedSteps.includes(s);
    const lastEvent = profile.lastEventAt ? new Date(profile.lastEventAt).getTime() : null;
    const now = Date.now();
    const staleMs = 30 * 60 * 1000; // 30 minutes considered stale for detection purposes

    let reason: StuckReason = 'UNKNOWN';

    if (!has('IDEA_ENTERED') && profile.state === 'NEW') {
      reason = 'NO_PROMPT_ENTERED';
    } else if (has('DEMO_STARTED') && !has('PREVIEW_REVEALED') && lastEvent && now - lastEvent > staleMs) {
      reason = 'DEMO_ABANDONED';
    } else if (has('PREVIEW_REVEALED') && !has('WORKSPACE_CREATED') && lastEvent && now - lastEvent > staleMs) {
      reason = 'WORKSPACE_IDLE';
    } else if (profile.state === 'NEW' || profile.state === 'INVITED' || profile.state === 'PROFILE_STARTED') {
      if (!has('IDEA_ENTERED')) {
        reason = 'NO_PROMPT_ENTERED';
      }
    }

    if (reason === 'UNKNOWN') return null;

    profile.state = 'STUCK';
    profile.stuckAt = this.now();
    profile.stuckReason = reason;
    this.profiles.set(userId, profile);

    return { reason, ...this.buildDiagnosis(reason) };
  }

  private buildDiagnosis(reason: StuckReason): Omit<StuckDiagnosis, 'reason'> {
    const diagnoses: Record<StuckReason, Omit<StuckDiagnosis, 'reason'>> = {
      NO_PROMPT_ENTERED: {
        suggestedFix: 'Try typing a simple idea — even one sentence works.',
        nextBestAction: {
          label: 'Start with an example',
          description: 'Try a restaurant ordering app, a task tracker, or a booking system.',
          route: '/demo?prompt=restaurant+ordering+app',
          cta: 'Start example demo',
          priority: 'HIGH',
        },
      },
      DEMO_ABANDONED: {
        suggestedFix: 'Your demo is still waiting — pick up where you left off.',
        nextBestAction: {
          label: 'Continue your demo',
          description: 'Your AI agents are ready to finish building your app.',
          route: '/demo',
          cta: 'Continue demo',
          priority: 'HIGH',
        },
      },
      PREVIEW_FAILED: {
        suggestedFix: 'Fix quality warnings to unlock a clean preview.',
        nextBestAction: {
          label: 'Check quality report',
          description: 'Review and resolve quality warnings before sharing.',
          route: '/quality',
          cta: 'Open quality report',
          priority: 'HIGH',
        },
      },
      QUALITY_SCORE_LOW: {
        suggestedFix: 'Improve your app quality score before sharing externally.',
        nextBestAction: {
          label: 'Improve quality score',
          description: 'A higher score means fewer bugs and a better experience.',
          route: '/quality',
          cta: 'View quality pipeline',
          priority: 'MEDIUM',
        },
      },
      WORKSPACE_IDLE: {
        suggestedFix: 'Create a workspace to save and manage your project.',
        nextBestAction: {
          label: 'Create your workspace',
          description: 'Save your project, invite teammates, and keep building.',
          route: '/workspace',
          cta: 'Create workspace',
          priority: 'MEDIUM',
        },
      },
      BILLING_WALL_HIT: {
        suggestedFix: 'Upgrade to unlock full previews and sharing.',
        nextBestAction: {
          label: 'View plans',
          description: 'Choose a plan that fits your stage.',
          route: '/#pricing',
          cta: 'See plans',
          priority: 'MEDIUM',
        },
      },
      INVITE_PENDING: {
        suggestedFix: 'Your invite is pending — check your email.',
        nextBestAction: {
          label: 'Check your inbox',
          description: 'Look for the Factory invite email and confirm your account.',
          route: '/',
          cta: 'Back to home',
          priority: 'LOW',
        },
      },
      UNKNOWN: {
        suggestedFix: 'Start with a simple idea and let the AI do the rest.',
        nextBestAction: {
          label: 'Try the live demo',
          description: 'See Factory build an app in real time.',
          route: '/demo',
          cta: 'Start demo',
          priority: 'LOW',
        },
      },
    };
    return diagnoses[reason];
  }

  getNextAction(userId: string): NextAction {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return {
        label: 'Start onboarding',
        description: 'Tell us what you want to build.',
        route: '/onboarding',
        cta: 'Get started',
        priority: 'HIGH',
      };
    }

    const has = (s: OnboardingStep) => profile.completedSteps.includes(s);

    if (!has('IDEA_ENTERED')) {
      return {
        label: 'Start with a restaurant ordering demo',
        description: 'Try our most popular starting example.',
        route: '/demo?prompt=restaurant+ordering+app',
        cta: 'Start demo',
        priority: 'HIGH',
      };
    }
    if (!has('DEMO_STARTED')) {
      return {
        label: 'Build your idea',
        description: 'Let Factory turn your idea into a live app.',
        route: '/demo',
        cta: 'Start the build',
        priority: 'HIGH',
      };
    }
    if (!has('PREVIEW_REVEALED')) {
      return {
        label: 'Open your generated preview',
        description: 'See your app live — no deployment needed.',
        route: '/demo',
        cta: 'Reveal preview',
        priority: 'HIGH',
      };
    }
    if (!has('MEMORY_SAVED')) {
      return {
        label: 'Save your project memory',
        description: 'Keep your context so you can pick up right where you left off.',
        route: '/memory',
        cta: 'Save memory',
        priority: 'MEDIUM',
      };
    }
    if (!has('WORKSPACE_CREATED')) {
      return {
        label: 'Fix quality warnings before sharing',
        description: 'A clean quality score makes your app look professional.',
        route: '/quality',
        cta: 'Check quality',
        priority: 'MEDIUM',
      };
    }
    if (!has('TEAMMATE_INVITED')) {
      return {
        label: 'Invite a teammate to review',
        description: 'Get early feedback from someone who knows your domain.',
        route: '/workspace',
        cta: 'Invite teammate',
        priority: 'LOW',
      };
    }

    return {
      label: 'Keep building',
      description: 'Open your workspace and continue your project.',
      route: '/workspace',
      cta: 'Open workspace',
      priority: 'LOW',
    };
  }

  getChecklist(userId: string): OnboardingChecklist {
    const profile = this.profiles.get(userId);
    const completed = profile?.completedSteps ?? [];
    const has = (s: OnboardingStep) => completed.includes(s);

    const CHECKLIST_STEPS: { step: OnboardingStep; route?: string }[] = [
      { step: 'IDEA_ENTERED',      route: '/demo' },
      { step: 'DEMO_STARTED',      route: '/demo' },
      { step: 'BLUEPRINT_VIEWED',  route: '/demo' },
      { step: 'COUNCIL_WATCHED',   route: '/demo' },
      { step: 'PREVIEW_REVEALED',  route: '/demo' },
      { step: 'PREVIEW_SHARED' },
      { step: 'MEMORY_SAVED',      route: '/memory' },
      { step: 'WORKSPACE_CREATED', route: '/workspace' },
      { step: 'TEAMMATE_INVITED',  route: '/workspace' },
    ];

    const items: ChecklistItem[] = CHECKLIST_STEPS.map(({ step, route }) => ({
      step,
      label: CHECKLIST_LABELS[step],
      completed: has(step),
      route,
    }));

    const completedCount = items.filter(i => i.completed).length;
    return {
      userId,
      items,
      completedCount,
      totalCount: items.length,
      percentComplete: Math.round((completedCount / items.length) * 100),
    };
  }

  getAnalytics(): ActivationAnalytics {
    const allProfiles = Array.from(this.profiles.values());
    const total = allProfiles.length;

    const byState = {} as Record<ActivationState, number>;
    const allStates: ActivationState[] = [
      'NEW','INVITED','PROFILE_STARTED','IDEA_ENTERED','DEMO_STARTED',
      'BLUEPRINT_VIEWED','PREVIEW_REVEALED','WORKSPACE_OPENED','ACTIVATED','STUCK',
    ];
    for (const s of allStates) byState[s] = 0;
    for (const p of allProfiles) byState[p.state]++;

    const stuckCount = byState['STUCK'];
    const activatedCount = byState['ACTIVATED'];
    const completionRate = total > 0 ? Math.round((activatedCount / total) * 100) : 0;

    const stuckReasonCounts = new Map<StuckReason, number>();
    for (const p of allProfiles) {
      if (p.stuckReason) {
        stuckReasonCounts.set(p.stuckReason, (stuckReasonCounts.get(p.stuckReason) ?? 0) + 1);
      }
    }
    const topStuckReasons = Array.from(stuckReasonCounts.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const avgStepsToPreview = this.calcAvgStepsToPreview(allProfiles);
    const betaReadinessScore = this.calcBetaReadiness(completionRate, stuckCount, total);

    return {
      total, byState, stuckCount, activatedCount,
      completionRate, avgStepsToPreview, topStuckReasons, betaReadinessScore,
    };
  }

  private calcAvgStepsToPreview(profiles: OnboardingProfile[]): number {
    const reached = profiles.filter(p =>
      p.completedSteps.includes('PREVIEW_REVEALED'),
    );
    if (reached.length === 0) return 0;
    const total = reached.reduce((sum, p) => {
      const idx = p.completedSteps.indexOf('PREVIEW_REVEALED');
      return sum + (idx + 1);
    }, 0);
    return Math.round((total / reached.length) * 10) / 10;
  }

  private calcBetaReadiness(completionRate: number, stuckCount: number, total: number): number {
    if (total === 0) return 0;
    const stuckPct = Math.round((stuckCount / total) * 100);
    const score = Math.max(0, Math.min(100, completionRate - stuckPct / 2 + 20));
    return Math.round(score);
  }
}
