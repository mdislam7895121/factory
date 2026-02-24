'use client';

import { useState } from 'react';

type CopyCommandButtonProps = {
  value: string;
};

export function CopyCommandButton({ value }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--text)] transition-all duration-200 ease-out hover:bg-[var(--bg-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
