// ── 26: Frontend Environment Contract ────────────────────────────────────────
// Public env vars only — never put secrets in NEXT_PUBLIC_ vars.
// In production, NEXT_PUBLIC_API_BASE_URL must be set on the Netlify dashboard.
// In local dev, safe localhost defaults are used when NODE_ENV !== 'production'.

const IS_PROD = process.env.NODE_ENV === 'production';

function requirePublicVar(name: string, devDefault: string): string {
  const val =
    process.env[name] ??
    // Legacy aliases — supported for backward compat
    (name === 'NEXT_PUBLIC_API_BASE_URL'
      ? (process.env.NEXT_PUBLIC_PROD_API_BASE ?? process.env.NEXT_PUBLIC_API_URL)
      : undefined);

  if (!val) {
    if (IS_PROD) {
      // In production builds, log a loud warning. We don't throw because
      // Next.js static pages are pre-rendered — the var may be injected later.
      console.warn(`[factory:env] MISSING REQUIRED PUBLIC VAR: ${name}`);
    }
    return IS_PROD ? '' : devDefault;
  }
  return val;
}

// ── Public vars ───────────────────────────────────────────────────────────────

/** Railway API base URL. Set NEXT_PUBLIC_API_BASE_URL on Netlify dashboard. */
export const API_BASE_URL = requirePublicVar(
  'NEXT_PUBLIC_API_BASE_URL',
  'http://localhost:3001',
);

/** Preview gateway base URL (Railway). */
export const PREVIEW_BASE_URL = requirePublicVar(
  'NEXT_PUBLIC_PREVIEW_BASE_URL',
  'http://localhost:4100',
);

/** App environment: production | staging | preview | development */
export const APP_ENV: string =
  process.env.NEXT_PUBLIC_APP_ENV ?? (IS_PROD ? 'production' : 'development');

/** Analytics enabled flag. */
export const ANALYTICS_ENABLED: boolean =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

/** Beta mode flag. */
export const BETA_MODE: boolean =
  process.env.NEXT_PUBLIC_BETA_MODE === 'true';

/** Netlify site URL (injected by Netlify automatically). */
export const NETLIFY_SITE_URL: string =
  process.env.NEXT_PUBLIC_NETLIFY_SITE_URL ??
  process.env.URL ??
  '';

// ── URL helpers ───────────────────────────────────────────────────────────────

/**
 * Build an absolute API URL.
 * Safe: trims trailing slash from base, trims leading slash from path.
 * Never uses raw string concatenation with user input.
 */
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const safe = path.replace(/^\//, '');
  return `${base}/${safe}`;
}

/**
 * Build a preview gateway URL.
 */
export function previewUrl(path: string): string {
  const base = PREVIEW_BASE_URL.replace(/\/$/, '');
  const safe = path.replace(/^\//, '');
  return `${base}/${safe}`;
}

// ── Validation helper (call at boot for server components) ────────────────────

export function validateEnv(): { ok: boolean; missing: string[] } {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key] && !process.env.NEXT_PUBLIC_PROD_API_BASE && !process.env.NEXT_PUBLIC_API_URL) {
      missing.push(key);
    }
  }
  return { ok: missing.length === 0, missing };
}
