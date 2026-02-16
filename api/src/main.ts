import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
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
  NextFunction,
  Request,
  Response,
} from 'express';
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalValidationBoundary(app);

  const expressApp = app.getHttpAdapter().getInstance() as unknown as Express;
  expressApp.get('/debug-sentry', function () {
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
