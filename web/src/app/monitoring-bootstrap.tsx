'use client';

import { useEffect } from 'react';

type WindowWithSentry = Window & {
  Sentry?: {
    captureException?: (error: unknown) => void;
  };
};

export default function MonitoringBootstrap() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

    if (!dsn) {
      return;
    }

    const onError = (event: ErrorEvent) => {
      const maybeWindow = window as WindowWithSentry;
      maybeWindow.Sentry?.captureException?.(
        event.error ?? new Error(event.message || 'window.error'),
      );
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const maybeWindow = window as WindowWithSentry;
      if (reason instanceof Error) {
        maybeWindow.Sentry?.captureException?.(reason);
        return;
      }
      maybeWindow.Sentry?.captureException?.(new Error(String(reason)));
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}
