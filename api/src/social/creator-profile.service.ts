import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  CreateProfileRequest,
  CreatorProfileData,
  ProfileVisibility,
  PublicProfile,
  UpdateProfileRequest,
} from './social.types';

// 18-09: Reserved handles — cannot be registered
export const RESERVED_HANDLES = new Set([
  'admin', 'api', 'app', 'auth', 'demo', 'docs', 'factory', 'help',
  'legal', 'login', 'logout', 'me', 'preview', 'profile', 'public',
  'register', 'remix', 'settings', 'signup', 'status', 'support', 'u',
]);

// 18-02: handle: 3–30 chars, a-z0-9 and hyphens, not starting/ending with hyphen
const HANDLE_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$|^[a-z0-9]{3,30}$/;

// 18-09: Safety — no internal metadata in profile output
const BLOCKED_PROFILE_KEYS = /secret|token|password|credential|chain_of_thought|hidden|internal|system/i;

@Injectable()
export class CreatorProfileService {
  // userId -> profile
  private readonly profiles    = new Map<string, CreatorProfileData>();
  // handle -> userId
  private readonly handleIndex = new Map<string, string>();
  // followerUserId -> Set<creatorUserId>
  private readonly follows     = new Map<string, Set<string>>();
  // userId -> Set<projectIds> (app attribution)
  private readonly userApps    = new Map<string, Set<string>>();

  // ── 18-02: Create ────────────────────────────────────────────────────────────

  createProfile(req: CreateProfileRequest): CreatorProfileData {
    const normalizedHandle = req.handle.toLowerCase();
    this.validateHandle(normalizedHandle);
    if (this.profiles.has(req.userId)) {
      throw new ConflictException('Profile already exists for this user');
    }
    if (this.handleIndex.has(normalizedHandle)) {
      throw new ConflictException(`Handle '${req.handle}' is already taken`);
    }

    const profile: CreatorProfileData = {
      id:          randomUUID(),
      userId:      req.userId,
      handle:      normalizedHandle,
      displayName: req.displayName.trim().slice(0, 60),
      bio:         req.bio?.trim().slice(0, 300),
      avatarUrl:   req.avatarUrl,
      websiteUrl:  req.websiteUrl,
      publicEmail: req.publicEmail,
      country:     req.country,
      skills:      (req.skills ?? []).slice(0, 20),
      verified:    false,
      visibility:  'PUBLIC',
      trustFlag:   'NONE',
      createdAt:   new Date(),
      updatedAt:   new Date(),
    };

    this.profiles.set(req.userId, profile);
    this.handleIndex.set(profile.handle, req.userId);
    return profile;
  }

  // ── 18-02: Update ────────────────────────────────────────────────────────────

  updateProfile(req: UpdateProfileRequest): CreatorProfileData {
    const profile = this.profiles.get(req.userId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (req.displayName !== undefined) profile.displayName = req.displayName.trim().slice(0, 60);
    if (req.bio !== undefined)         profile.bio         = req.bio.trim().slice(0, 300);
    if (req.avatarUrl !== undefined)   profile.avatarUrl   = req.avatarUrl;
    if (req.websiteUrl !== undefined)  profile.websiteUrl  = req.websiteUrl;
    if (req.publicEmail !== undefined) profile.publicEmail = req.publicEmail;
    if (req.country !== undefined)     profile.country     = req.country;
    if (req.skills !== undefined)      profile.skills      = req.skills.slice(0, 20);
    if (req.visibility !== undefined)  profile.visibility  = req.visibility as ProfileVisibility;
    profile.updatedAt = new Date();

    return profile;
  }

  // ── 18-02: Get public profile ─────────────────────────────────────────────────

  getPublicProfile(handle: string): PublicProfile {
    const userId = this.handleIndex.get(handle.toLowerCase());
    if (!userId) throw new NotFoundException(`Creator '${handle}' not found`);

    const profile = this.profiles.get(userId)!;
    // 18-09: Private profiles are invisible to public
    if (profile.visibility === 'PRIVATE') throw new NotFoundException(`Creator '${handle}' not found`);

    return this.toPublicProfile(profile);
  }

  getOwnProfile(userId: string): CreatorProfileData {
    const profile = this.profiles.get(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  getProfileByUserId(userId: string): CreatorProfileData | undefined {
    return this.profiles.get(userId);
  }

  getHandleForUserId(userId: string): string | undefined {
    return this.profiles.get(userId)?.handle;
  }

  // ── 18-02: Follow / Unfollow ─────────────────────────────────────────────────

  follow(followerUserId: string, handle: string): { following: boolean } {
    const creatorUserId = this.handleIndex.get(handle.toLowerCase());
    if (!creatorUserId) throw new NotFoundException(`Creator '${handle}' not found`);
    if (followerUserId === creatorUserId) throw new BadRequestException('Cannot follow yourself');

    const set = this.follows.get(followerUserId) ?? new Set<string>();
    set.add(creatorUserId);
    this.follows.set(followerUserId, set);
    return { following: true };
  }

  unfollow(followerUserId: string, handle: string): { following: boolean } {
    const creatorUserId = this.handleIndex.get(handle.toLowerCase());
    if (!creatorUserId) throw new NotFoundException(`Creator '${handle}' not found`);

    const set = this.follows.get(followerUserId);
    set?.delete(creatorUserId);
    return { following: false };
  }

  isFollowing(followerUserId: string, creatorHandle: string): boolean {
    const creatorUserId = this.handleIndex.get(creatorHandle.toLowerCase());
    if (!creatorUserId) return false;
    return this.follows.get(followerUserId)?.has(creatorUserId) ?? false;
  }

  // ── 18-05: App attribution ───────────────────────────────────────────────────

  attributeApp(userId: string, projectId: string): void {
    const set = this.userApps.get(userId) ?? new Set<string>();
    set.add(projectId);
    this.userApps.set(userId, set);
  }

  getCreatorAppIds(userId: string): string[] {
    return [...(this.userApps.get(userId) ?? [])];
  }

  // ── 18-02: Handle validation ─────────────────────────────────────────────────

  validateHandle(handle: string): void {
    // Test the raw input — callers must provide lowercase handles
    if (!HANDLE_RE.test(handle)) {
      throw new BadRequestException('Handle must be 3–30 chars; only lowercase letters, numbers, hyphens; cannot start or end with a hyphen');
    }
    if (handle.includes('--')) {
      throw new BadRequestException('Handle cannot contain consecutive hyphens');
    }
    if (RESERVED_HANDLES.has(handle.toLowerCase())) {
      throw new BadRequestException(`Handle '${handle}' is reserved and cannot be used`);
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private followerCount(userId: string): number {
    let n = 0;
    for (const [, set] of this.follows) {
      if (set.has(userId)) n++;
    }
    return n;
  }

  private followingCount(userId: string): number {
    return this.follows.get(userId)?.size ?? 0;
  }

  private toPublicProfile(profile: CreatorProfileData): PublicProfile {
    // 18-09: Never expose internal fields
    const safe: PublicProfile = {
      handle:         profile.handle,
      displayName:    profile.displayName,
      bio:            profile.bio,
      avatarUrl:      profile.avatarUrl,
      websiteUrl:     profile.websiteUrl,
      publicEmail:    profile.publicEmail,
      country:        profile.country,
      skills:         [...profile.skills],
      verified:       profile.verified,
      followerCount:  this.followerCount(profile.userId),
      followingCount: this.followingCount(profile.userId),
      appCount:       this.userApps.get(profile.userId)?.size ?? 0,
    };
    // Guard: reject if any blocked key leaked into output
    const json = JSON.stringify(safe);
    if (BLOCKED_PROFILE_KEYS.test(json)) {
      throw new Error('Safety: blocked metadata detected in public profile output');
    }
    return safe;
  }
}
