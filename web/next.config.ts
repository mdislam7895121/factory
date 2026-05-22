import type { NextConfig } from "next";

// Orchestrator URL: Railway internal hostname in production, localhost in dev.
// On Netlify this rewrite is skipped (ORCHESTRATOR_INTERNAL_URL not set on frontend).
const ORCHESTRATOR_URL =
  process.env.ORCHESTRATOR_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_PREVIEW_BASE_URL ??
  'http://orchestrator:4100';

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Rewrite /p/* to the preview gateway.
  // Works in Railway (Docker network) and local Docker Compose.
  // On Netlify: ORCHESTRATOR_INTERNAL_URL is not set, so rewrites point to
  // NEXT_PUBLIC_PREVIEW_BASE_URL (the public Railway preview URL).
  async rewrites() {
    // Skip rewrites when no target is resolvable (e.g. Netlify static build).
    if (!ORCHESTRATOR_URL || ORCHESTRATOR_URL === 'http://orchestrator:4100') {
      // Only enable Docker-internal rewrites in non-Netlify environments.
      const isNetlify = process.env.NETLIFY === 'true';
      if (isNetlify) return [];
    }
    return [
      {
        source: '/p/:projectId',
        destination: `${ORCHESTRATOR_URL}/v1/preview/:projectId`,
      },
      {
        source: '/p/:projectId/:path*',
        destination: `${ORCHESTRATOR_URL}/v1/preview/:projectId/:path*`,
      },
    ];
  },
};

export default nextConfig;
