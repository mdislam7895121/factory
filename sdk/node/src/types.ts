export interface PerpetualConfig {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface Sandbox {
  sandbox_id: string;
  status: string;
  language: string;
  timeout_secs: number;
  started_at: string | null;
  terminated_at: string | null;
  created_at: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_secs: number;
}

export interface ApiKey {
  id: string;
  key?: string; // only on create
  prefix: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
}

export interface MemoryEntry {
  namespace: string;
  key: string;
  value: unknown;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemoryKeyList {
  namespace: string;
  count: number;
  keys: { key: string; expires_at: string | null; updated_at: string }[];
}

export interface CouncilSession {
  session_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  task: string;
  result: CouncilResult | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouncilResult {
  plan: string;
  synthesis: string;
  agent_outputs: { agent: string; output: string }[];
  total_tokens: number;
}

export interface CouncilMessage {
  id: string;
  agent: string;
  round: number;
  content: string;
  tokens: { input: number; output: number };
  created_at: string;
}

export interface LoopConfig {
  loop_id: string;
  name: string;
  description: string | null;
  interval_secs: number;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  webhook_url: string | null;
  created_at: string;
}

export interface LoopRun {
  run_id: string;
  loop_id: string;
  status: string;
  issues_found: number;
  issues_fixed: number;
  monitor_summary: string | null;
  healer_summary: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface UsageToday {
  date: string;
  runs: number;
  used_secs: number;
  free_secs: number;
  free_remaining_secs: number;
  billed_amount_usd: number;
  price_per_second_usd: number;
}

export interface UsageSummary {
  current_month: { period: string; runs: number; used_secs: number; billed_amount_usd: number };
  all_time: { runs: number; used_secs: number; billed_amount_usd: number };
  recent_runs: {
    id: string;
    sandbox_id: string;
    language: string;
    duration_secs: number;
    billed_amount_usd: number;
    created_at: string;
  }[];
}

export class PerpetualError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'PerpetualError';
  }
}
