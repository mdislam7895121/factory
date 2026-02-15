import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  type ExceptionFilter,
  type INestApplication,
} from '@nestjs/common';
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import type { ArgumentsHost } from '@nestjs/common';

type SentryClient = {
  init: (options: { dsn: string; tracesSampleRate: number }) => void;
  captureException: (error: Error) => void;
  captureMessage: (message: string, level: 'error') => void;
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
  try {
    const sentryModuleName = '@sentry/node';
    const loaded: unknown = await import(sentryModuleName);

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

  sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  });

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

  console.log('[OK] API Sentry monitoring enabled');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await initApiSentry(app);

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
void bootstrap();
