// 18-01: Social layer types — no executable code, no raw secrets

export type ProfileVisibility = 'PUBLIC' | 'PRIVATE';
export type SocialSignalType  = 'LIKE' | 'SAVE' | 'SHARE' | 'VIEW' | 'REMIX';

// 20C-11: Admin moderation foundations
export type ModerationStatus = 'APPROVED' | 'PENDING' | 'HIDDEN' | 'FLAGGED';
export type CreatorTrustFlag = 'NONE' | 'VERIFIED' | 'WARNED' | 'BANNED';

export interface CreatorProfileData {
  id:          string;
  userId:      string;
  handle:      string;
  displayName: string;
  bio?:        string;
  avatarUrl?:  string;
  websiteUrl?: string;
  publicEmail?: string; // Only if creator explicitly sets it — never raw internal email
  country?:    string;
  skills:      string[];
  verified:    boolean;
  visibility:  ProfileVisibility;
  trustFlag:   CreatorTrustFlag;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface PublicProfile {
  handle:        string;
  displayName:   string;
  bio?:          string;
  avatarUrl?:    string;
  websiteUrl?:   string;
  publicEmail?:  string;
  country?:      string;
  skills:        string[];
  verified:      boolean;
  followerCount: number;
  followingCount:number;
  appCount:      number;
}

export interface CreateProfileRequest {
  userId:       string;
  handle:       string;
  displayName:  string;
  bio?:         string;
  avatarUrl?:   string;
  websiteUrl?:  string;
  publicEmail?: string;
  country?:     string;
  skills?:      string[];
}

export interface UpdateProfileRequest {
  userId:       string;
  displayName?: string;
  bio?:         string;
  avatarUrl?:   string;
  websiteUrl?:  string;
  publicEmail?: string;
  country?:     string;
  skills?:      string[];
  visibility?:  ProfileVisibility;
}

export interface AppSignalCounts {
  projectId: string;
  likes:     number;
  saves:     number;
  shares:    number;
  views:     number;
  remixes:   number;
}

export interface PublishedApp {
  projectId:            string;
  runtimeId?:           string;
  previewRouteId?:      string;
  ownerHandle?:         string;
  title:                string;
  description?:         string;
  domain?:              string;
  category?:            string;
  marketplacePackSlug?: string;
  visibility:           'PUBLIC' | 'PRIVATE';
  featured?:            boolean;
  hidden?:              boolean;
  moderationStatus?:    ModerationStatus;
  createdAt:            Date;
  signals:              AppSignalCounts;
}

export interface RemixSource {
  sourceRuntimeId:       string;
  sourcePreviewRouteId?: string;
}

export interface DiscoverParams {
  sortBy?:              'TRENDING' | 'NEWEST' | 'MOST_REMIXED' | 'MOST_VIEWED' | 'STAFF_PICKS';
  domain?:              string;
  category?:            string;
  marketplacePackSlug?: string;
  creatorHandle?:       string;
  cursor?:              string;
  limit?:               number;
  remixableOnly?:       boolean;
}

export interface DiscoverResult {
  apps:    PublishedApp[];
  total:   number;
  cursor?: string;
}

// 20C-11: Admin moderation signal — never expose internal keys
export interface ModerationSignal {
  projectId:        string;
  featured?:        boolean;
  hidden?:          boolean;
  moderationStatus?: ModerationStatus;
}

export interface CreatorModerationSignal {
  handle:    string;
  trustFlag: CreatorTrustFlag;
}
