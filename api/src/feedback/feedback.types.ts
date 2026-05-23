export type FeedbackStatus   = 'OPEN' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type FeedbackSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type FeedbackCategory =
  | 'BUG'
  | 'FEATURE_REQUEST'
  | 'QUALITY_ISSUE'
  | 'BILLING'
  | 'RUNTIME'
  | 'PREVIEW'
  | 'ACCOUNT'
  | 'ABUSE'
  | 'GENERAL';

export interface FeedbackItem {
  id:          string;
  category:    FeedbackCategory;
  severity:    FeedbackSeverity;
  status:      FeedbackStatus;
  title:       string;
  body:        string;
  route:       string;
  submitterHash: string;
  createdAt:   string;
  updatedAt:   string;
  assignedTo?: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface SupportTicket extends FeedbackItem {
  replies: TicketReply[];
  auditLog: TicketAuditEntry[];
}

export interface TicketReply {
  id:        string;
  body:      string;
  author:    string;
  isAdmin:   boolean;
  createdAt: string;
}

export interface TicketAuditEntry {
  action:    string;
  actor:     string;
  detail:    string;
  ts:        string;
}

export interface ProductSignal {
  event:     string;
  count:     number;
  lastSeen:  string;
}

export interface CustomerPain {
  id:             string;
  category:       FeedbackCategory;
  title:          string;
  frequency:      number;
  severity:       FeedbackSeverity;
  revenueImpact:  'HIGH' | 'MEDIUM' | 'LOW';
  affectedType:   'FREE' | 'PAID' | 'ALL';
  repeatCount:    number;
  score:          number;
}

export interface RoadmapSuggestion {
  pain:         CustomerPain;
  suggestedSerial: string;
  affectedModule: string;
  urgency:      'IMMEDIATE' | 'NEXT_SPRINT' | 'BACKLOG';
  customerValue: string;
  founderImpact: string;
}

export interface CreateFeedbackDto {
  category:    FeedbackCategory;
  severity?:   FeedbackSeverity;
  title:       string;
  body:        string;
  route?:      string;
  emailHash?:  string;
}

export interface UpdateTicketStatusDto {
  status: FeedbackStatus;
}

export interface AssignTicketDto {
  assignedTo: string;
}

export interface ReplyTicketDto {
  body: string;
}

export const FEEDBACK_BLOCKED_CONTENT =
  /<script|javascript:|data:text\/html|eval\(|document\.cookie|window\.location|innerHTML\s*=|__proto__|prototype\.constructor|<iframe|<object|<embed|onerror=|onload=/i;

export const FEEDBACK_BLOCKED_META_KEYS = new Set([
  'password', 'token', 'secret', 'key', 'auth', 'credential',
  'DATABASE_URL', 'AUTH_SECRET', 'API_KEY', 'PRIVATE_KEY',
  'ACCESS_TOKEN', 'REFRESH_TOKEN', 'SESSION_ID',
]);

export const MAX_TITLE_LEN = 120;
export const MAX_BODY_LEN  = 2000;
export const MAX_TICKETS   = 10_000;
export const SEVERITY_SCORE: Record<FeedbackSeverity, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
};
export const REVENUE_SCORE: Record<'HIGH' | 'MEDIUM' | 'LOW', number> = {
  HIGH: 3, MEDIUM: 2, LOW: 1,
};
