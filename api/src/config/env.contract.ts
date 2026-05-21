export type NodeEnvironment = 'development' | 'test' | 'production';

const allowedNodeEnvironments = new Set<NodeEnvironment>([
  'development',
  'test',
  'production',
]);

export const API_REQUIRED_ENV = ['AUTH_SECRET', 'DATABASE_URL', 'REDIS_URL'] as const;

export type RequiredEnvVar = (typeof API_REQUIRED_ENV)[number];

// 10-01: Additional vars required in production — fail-fast on startup
const PRODUCTION_REQUIRED_ENV = ['PREVIEW_SHARE_SECRET', 'ORCHESTRATOR_API_KEY'] as const;

// 10-01: Recommended in production — missing logs a warning, not a crash
const PRODUCTION_RECOMMENDED_ENV = ['ADMIN_API_KEY', 'ANTHROPIC_API_KEY'] as const;

function readEnv(name: string): string {
  return (process.env[name] || '').trim();
}

export function resolveAndNormalizeNodeEnvironment(): NodeEnvironment {
  const normalized = (process.env.NODE_ENV || 'development')
    .trim()
    .toLowerCase();

  if (!allowedNodeEnvironments.has(normalized as NodeEnvironment)) {
    throw new Error(`Invalid NODE_ENV: ${normalized}`);
  }

  process.env.NODE_ENV = normalized;
  return normalized as NodeEnvironment;
}

export function getMissingRequiredEnvVars(): RequiredEnvVar[] {
  return API_REQUIRED_ENV.filter((name) => readEnv(name).length === 0);
}

export function assertRequiredRuntimeEnv(): void {
  const missing = getMissingRequiredEnvVars();
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Set these in dev/docker/CI and production (Railway).',
    );
  }

  // 10-01: In production, additional vars are required — fail-fast
  if (readEnv('NODE_ENV') === 'production') {
    const missingProd = PRODUCTION_REQUIRED_ENV.filter((n) => readEnv(n).length === 0);
    if (missingProd.length > 0) {
      throw new Error(
        `[production] Missing required variables: ${missingProd.join(', ')}. ` +
          'These are required for production startup.',
      );
    }
    // Recommended — warnings only
    for (const name of PRODUCTION_RECOMMENDED_ENV) {
      if (!readEnv(name)) {
        // Redact value in log — never print secrets
        console.warn(`[WARN][10-01] Recommended env var ${name} is not set.`);
      }
    }
    // Stripe — if billing is explicitly enabled
    if (readEnv('STRIPE_ENABLED') === 'true') {
      const missingStripe = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'].filter((n) => !readEnv(n));
      if (missingStripe.length > 0) {
        throw new Error(`[production] STRIPE_ENABLED=true but missing: ${missingStripe.join(', ')}`);
      }
    }
  }
}

export function getRequiredEnvOrThrow(name: RequiredEnvVar): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Set this in dev/docker/CI and production (Railway).',
    );
  }

  return value;
}

export function getRedisPrefix(): string {
  return readEnv('REDIS_PREFIX') || 'factory';
}

export function getRedisRuntimeTtl(): number {
  return parseInt(readEnv('REDIS_RUNTIME_TTL_SEC') || '300', 10);
}

export function getRedisPreviewTtl(): number {
  return parseInt(readEnv('REDIS_PREVIEW_TTL_SEC') || '300', 10);
}

export function getRedisWsTtl(): number {
  return parseInt(readEnv('REDIS_WS_TTL_SEC') || '120', 10);
}
