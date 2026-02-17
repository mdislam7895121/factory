import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/p/:projectId',
        destination: 'http://orchestrator:4100/v1/preview/:projectId',
      },
      {
        source: '/p/:projectId/:path*',
        destination: 'http://orchestrator:4100/v1/preview/:projectId/:path*',
      },
    ];
  },
};

export default nextConfig;
