import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function isKillSwitchEnabled(): boolean {
  return process.env.FACTORY_KILL_SWITCH === '1';
}

function normalizePath(path: string): string {
  const noQuery = path.split('?')[0] || '/';
  const trimmed = noQuery.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function initApiSentry(app: any): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    return;
  }

  try {
    const sentry = require('@sentry/node');

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

    app.use((req: any, res: any, next: any) => {
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

    app.use((error: any, req: any, _res: any, next: any) => {
      sentry.captureException(error);
      next(error);
    });

    console.log('[OK] API Sentry monitoring enabled');
  } catch {
    console.log(
      '[WARN] SENTRY_DSN is set but @sentry/node is not installed. Continuing without Sentry.',
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initApiSentry(app);

  // Security: Add basic security headers via middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Disable x-powered-by if Express supports it
    res.removeHeader('X-Powered-By');
    next();
  });

  app.use((req, res, next) => {
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
bootstrap();
