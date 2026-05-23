const ANALYTICS_ENABLED =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

const IS_BROWSER = typeof window !== 'undefined';

function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === 'string') {
      safe[k] = v.length > 200 ? v.slice(0, 200) + '…' : v;
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      safe[k] = v;
    }
  }
  return safe;
}

function emit(name: string, payload: Record<string, unknown>): void {
  if (!IS_BROWSER) return;

  if (!ANALYTICS_ENABLED) {
    console.debug('[factory:analytics]', name, payload);
    return;
  }

  try {
    // Production provider hook — swap in your analytics SDK here
    // e.g. posthog.capture(name, payload) or analytics.track(name, payload)
    // Currently falls back to console in all environments until provider is wired
    console.debug('[factory:analytics:prod]', name, payload);
  } catch {
    // swallow — analytics must never break the app
  }
}

let _analyticsOverride: boolean | null = null;

export function setAnalyticsEnabled(enabled: boolean): void {
  _analyticsOverride = enabled;
}

function isEnabled(): boolean {
  return _analyticsOverride !== null ? _analyticsOverride : ANALYTICS_ENABLED;
}

export function track(eventName: string, payload?: Record<string, unknown>): void {
  if (!isEnabled() && typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
  emit(eventName, sanitizePayload(payload ?? {}));
}

export function pageView(route: string, payload?: Record<string, unknown>): void {
  emit('page_view', { route, ...sanitizePayload(payload ?? {}) });
}

export function identifySafe(userIdHash: string, traits?: Record<string, unknown>): void {
  if (!userIdHash || userIdHash.length < 8) return;
  if (!userIdHash.match(/^[a-f0-9]+$/i)) return;

  emit('identify', {
    uid: userIdHash,
    ...sanitizePayload(traits ?? {}),
  });
}
