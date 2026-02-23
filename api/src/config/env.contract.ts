export type NodeEnvironment = 'development' | 'test' | 'production';

const allowedNodeEnvironments = new Set<NodeEnvironment>([
  'development',
  'test',
  'production',
]);

export const API_REQUIRED_ENV = ['AUTH_SECRET', 'DATABASE_URL'] as const;

export type RequiredEnvVar = (typeof API_REQUIRED_ENV)[number];

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
  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      'Set these in dev/docker/CI and production (Railway).',
  );
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
