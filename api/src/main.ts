import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BadRequestException,
  ValidationPipe,
  type ExceptionFilter,
  type INestApplication,
} from '@nestjs/common';
import type {
  ErrorRequestHandler,
  Express,
  RequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { json, urlencoded } from 'express';
import type { ArgumentsHost } from '@nestjs/common';

type SentryClient = {
  init: (options: {
    dsn: string;
    tracesSampleRate: number;
    environment?: string;
    release?: string;
  }) => void;
  captureException: (error: Error) => void;
  captureMessage: (message: string, level: 'error') => void;
  setTag?: (key: string, value: string) => void;
};

type ValidationErrorResponse = {
  ok: false;
  error: 'VALIDATION_ERROR';
  message: string;
  details: unknown;
};

function getValidationDetails(value: unknown): unknown {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const maybeObject = value as Record<string, unknown>;
    if (Array.isArray(maybeObject.message)) {
      return maybeObject.message;
    }
  }

  return [];
}

function buildValidationErrorBody(
  exception: BadRequestException,
): ValidationErrorResponse {
  const response = exception.getResponse();

  return {
    ok: false,
    error: 'VALIDATION_ERROR',
    message: 'Request validation failed',
    details: getValidationDetails(response),
  };
}

export function applyGlobalValidationBoundary(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );

  const badRequestValidationFilter: ExceptionFilter = {
    catch(exception: unknown, host: ArgumentsHost) {
      if (!(exception instanceof BadRequestException)) {
        throw exception;
      }

      const context = host.switchToHttp();
      const response = context.getResponse<Response>();

      response.status(400).json(buildValidationErrorBody(exception));
    },
  };

  app.useGlobalFilters(badRequestValidationFilter);
}

function isKillSwitchEnabled(): boolean {
  return process.env.FACTORY_KILL_SWITCH === '1';
}

function normalizePath(path: string): string {
  const noQuery = path.split('?')[0] || '/';
  const trimmed = noQuery.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function isSentryClient(value: unknown): value is SentryClient {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const maybeClient = value as {
    init?: unknown;
    captureException?: unknown;
    captureMessage?: unknown;
  };

  return (
    typeof maybeClient.init === 'function' &&
    typeof maybeClient.captureException === 'function' &&
    typeof maybeClient.captureMessage === 'function'
  );
}

async function loadOptionalSentryClient(): Promise<SentryClient | null> {
  if (isSentryClient(Sentry)) {
    return Sentry;
  }

  try {
    const loaded: unknown = await import('@sentry/node');
    if (typeof loaded !== 'object' || loaded === null) {
      return null;
    }
    const maybeModule = loaded as { default?: unknown } & Record<
      string,
      unknown
    >;
    const candidate = maybeModule.default ?? maybeModule;
    if (!isSentryClient(candidate)) {
      return null;
    }
    return candidate;
  } catch {
    return null;
  }
}

async function initApiSentry(app: INestApplication): Promise<void> {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    return;
  }

  const sentry = await loadOptionalSentryClient();
  if (!sentry) {
    console.log(
      '[WARN] SENTRY_DSN is set but @sentry/node is not installed. Continuing without Sentry.',
    );
    return;
  }

  const sentryEnvironment = resolveSentryEnvironment();
  const sentryRelease = resolveSentryRelease();

  sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: sentryEnvironment,
    release: sentryRelease,
  });

  sentry.setTag?.('service', 'api');
  sentry.setTag?.('runtime', process.version);
  sentry.setTag?.('platform', 'railway');

  process.on('unhandledRejection', (reason: unknown) => {
    if (reason instanceof Error) {
      sentry.captureException(reason);
      return;
    }
    sentry.captureException(new Error(String(reason)));
  });

  process.on('uncaughtException', (error: Error) => {
    sentry.captureException(error);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      if (res.statusCode >= 500) {
        sentry.captureMessage(
          `HTTP ${res.statusCode} ${req.method} ${req.originalUrl || req.url}`,
          'error',
        );
      }
    });
    next();
  });

  const sentryErrorHandler: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    if (error instanceof Error) {
      sentry.captureException(error);
    } else {
      sentry.captureException(new Error(String(error)));
    }
    next(error);
  };
  app.use(sentryErrorHandler);

  console.log(
    `[OK] API Sentry monitoring enabled (environment=${sentryEnvironment}, release=${sentryRelease || 'unknown'}, service=api, runtime=${process.version}, platform=railway)`,
  );
}

function resolveSentryEnvironment(): string {
  const explicitEnvironment = process.env.SENTRY_ENVIRONMENT?.trim();
  if (explicitEnvironment) {
    return explicitEnvironment;
  }

  const nodeEnvironment = process.env.NODE_ENV?.trim();
  if (nodeEnvironment) {
    return nodeEnvironment;
  }

  return 'development';
}

function readPackageVersion(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) {
      return null;
    }

    const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const maybePackage = parsed as { version?: unknown };
    if (typeof maybePackage.version !== 'string') {
      return null;
    }

    const value = maybePackage.version.trim();
    return value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function resolveSentryRelease(): string | undefined {
  const explicitRelease = process.env.SENTRY_RELEASE?.trim();
  if (explicitRelease) {
    return explicitRelease;
  }

  const npmRelease = process.env.npm_package_version?.trim();
  if (npmRelease) {
    return npmRelease;
  }

  const packageCandidates = [
    resolve(process.cwd(), 'package.json'),
    resolve(__dirname, '../../package.json'),
  ];

  for (const candidatePath of packageCandidates) {
    const value = readPackageVersion(candidatePath);
    if (value) {
      return value;
    }
  }

  return undefined;
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  const parsed = Number.parseInt((value || '').trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function validateEnvironmentOrThrow(): string {
  const normalized = (process.env.NODE_ENV || 'development')
    .trim()
    .toLowerCase();
  const allowed = new Set(['development', 'test', 'production']);

  if (!allowed.has(normalized)) {
    throw new Error(`Invalid NODE_ENV: ${normalized}`);
  }

  process.env.NODE_ENV = normalized;

  if (
    normalized === 'production' &&
    [process.env.DATABASE_URL, process.env.DATABASE_PUBLIC_URL].every((value) =>
      [undefined, ''].includes((value || '').trim()),
    )
  ) {
    throw new Error(
      'Production requires DATABASE_URL or DATABASE_PUBLIC_URL to be configured.',
    );
  }

  return normalized;
}

function resolveAllowedOrigins(nodeEnvironment: string): Set<string> {
  const configured = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (configured.length > 0) {
    return new Set(configured);
  }

  const defaults = new Set<string>([
    'https://factory-production-web.netlify.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]);

  const webUrl = (process.env.WEB_URL || '').trim();
  if (webUrl) {
    defaults.add(webUrl);
  }

  if (nodeEnvironment !== 'production') {
    defaults.add('http://localhost:5173');
    defaults.add('http://127.0.0.1:5173');
  }

  return defaults;
}

function createRateLimitMiddleware(): RequestHandler {
  const windowMs = parsePositiveInteger(
    process.env.RATE_LIMIT_WINDOW_MS,
    60000,
  );
  const defaultMax = parsePositiveInteger(process.env.RATE_LIMIT_MAX, 120);
  const healthMax = parsePositiveInteger(
    process.env.RATE_LIMIT_HEALTH_MAX,
    defaultMax * 2,
  );

  const buckets = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const route = normalizePath(req.path || req.url || '/');
    const routeKey = route === '/db/health' ? 'health' : 'default';
    const max = routeKey === 'health' ? healthMax : defaultMax;
    const client = (req.ip || req.socket.remoteAddress || 'unknown').trim();
    const key = `${client}:${routeKey}`;

    const existing = buckets.get(key);
    const bucket =
      !existing || now >= existing.resetAt
        ? { count: 0, resetAt: now + windowMs }
        : existing;

    bucket.count += 1;
    buckets.set(key, bucket);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader(
      'X-RateLimit-Remaining',
      String(Math.max(max - bucket.count, 0)),
    );
    res.setHeader(
      'X-RateLimit-Reset',
      String(Math.ceil(bucket.resetAt / 1000)),
    );

    if (bucket.count > max) {
      res.status(429).json({
        ok: false,
        error: 'TOO_MANY_REQUESTS',
      });
      return;
    }

    if (buckets.size > 5000) {
      for (const [bucketKey, value] of buckets) {
        if (now >= value.resetAt) {
          buckets.delete(bucketKey);
        }
      }
    }

    next();
  };
}

async function bootstrap() {
  const nodeEnvironment = validateEnvironmentOrThrow();
  const app = await NestFactory.create(AppModule);
  applyGlobalValidationBoundary(app);

  const bodyLimit = (process.env.BODY_LIMIT || '1mb').trim() || '1mb';
  const allowedOrigins = resolveAllowedOrigins(nodeEnvironment);

  app.use(helmet());
  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));
  app.enableCors({
    origin: Array.from(allowedOrigins),
  });

  app.use(createRateLimitMiddleware());

  const expressApp = app.getHttpAdapter().getInstance() as unknown as Express;
  expressApp.get('/debug-sentry', function (req: Request, res: Response) {
    if (nodeEnvironment === 'production') {
      const debugToken = (process.env.DEBUG_TOKEN || '').trim();
      if (!debugToken) {
        res.status(404).json({ ok: false, error: 'NOT_FOUND' });
        return;
      }

      const headerValue = req.headers['x-debug-token'];
      const providedToken =
        typeof headerValue === 'string'
          ? headerValue.trim()
          : Array.isArray(headerValue)
            ? (headerValue[0] || '').trim()
            : '';
      if (providedToken !== debugToken) {
        res.status(403).json({ ok: false, error: 'FORBIDDEN' });
        return;
      }
    }

    throw new Error('Sentry test error');
  });

  await initApiSentry(app);

  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(
      expressApp as unknown as {
        use: (...args: unknown[]) => unknown;
      },
    );
  }

  // Security: Add basic security headers via middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Disable x-powered-by if Express supports it
    res.removeHeader('X-Powered-By');
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!isKillSwitchEnabled()) {
      next();
      return;
    }

    const route = normalizePath(req.path || req.url || '/');
    const isAllowed = route === '/' || route === '/db/health';

    if (isAllowed) {
      next();
      return;
    }

    res.status(503).json({
      ok: false,
      error: 'SERVICE_DISABLED',
    });
  });

  const port = Number(process.env.PORT || 4000);

  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://0.0.0.0:${port}`);
}

if (require.main === module) {
  void bootstrap();
}
