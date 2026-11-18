"use client";

import { useState } from "react";

export function CopyEmail({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="text-label rounded-full border border-current/30 px-4 py-2.5 transition-colors duration-500 ease-house hover:border-accent hover:text-accent"
      aria-live="polite"
      data-cursor={copied ? "copied" : "copy"}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
