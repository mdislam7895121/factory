import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// Replaced next/font/google (blocked in build env) with local geist package
import MonitoringBootstrap from "./monitoring-bootstrap";
import "./globals.css";

const geistSans  = GeistSans;
const geistMono  = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL("https://factory-production-web.netlify.app"),
  title: {
    default: "Factory Platform",
    template: "%s | Factory Platform",
  },
  description: "Proof-first full-stack platform delivery workflow for reliable local-to-production releases.",
  keywords: [
    "Factory Platform",
    "proof-first",
    "Next.js",
    "NestJS",
    "Netlify",
    "Railway",
    "platform engineering",
  ],
  alternates: {
    canonical: "https://factory-production-web.netlify.app",
  },
  openGraph: {
    title: "Factory Platform",
    description: "Proof-first full-stack platform delivery workflow for reliable local-to-production releases.",
    url: "https://factory-production-web.netlify.app",
    siteName: "Factory Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Platform",
    description: "Proof-first full-stack platform delivery workflow for reliable local-to-production releases.",
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
