import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// Replaced next/font/google (blocked in build env) with local geist package
import MonitoringBootstrap from "./monitoring-bootstrap";
import "./globals.css";

const geistSans  = GeistSans;
const geistMono  = GeistMono;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://factory-production-web.netlify.app';
const SITE_NAME = 'Factory';
const DEFAULT_DESCRIPTION = 'Build full-stack AI-powered apps with an autonomous multi-agent team. Describe your idea — Factory architects, codes, tests, and deploys it.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Build apps with AI agents`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'AI app builder',
    'multi-agent development',
    'full-stack generator',
    'no-code AI',
    'app marketplace',
    'Factory platform',
    'autonomous coding agents',
    'AI software development',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} — Build apps with AI agents`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Build apps with AI agents`,
    description: DEFAULT_DESCRIPTION,
    creator: '@factory_build',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://factory-production-production.up.railway.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  } catch {}
})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--card)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--text)] focus:outline-2 focus:outline-[var(--primary)]"
        >
          Skip to content
        </a>
        <MonitoringBootstrap />
        {children}
      </body>
    </html>
  );
}
