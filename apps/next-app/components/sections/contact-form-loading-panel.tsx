"use client";

import { useState, useEffect } from "react";

const ITEMS = [
  {
    headline: "Built for Startups—Only",
    description: "We exclusively serve VC-backed, Delaware C-Corps.",
  },
  {
    headline: "$15B+ in Funding",
    description: "Our clients raise faster and more often—with investor-trusted books.",
  },
  {
    headline: "CPA-Led & AI-Empowered",
    description: "Elite professionals + modern tools = smarter finance.",
  },
  {
    headline: "One Partner, Every Function",
    description: "Bookkeeping, tax, payroll, FP&A, CFO support.",
  },
  {
    headline: "Due Diligence Ready",
    description: "Always audit-prepped and board-meeting ready.",
  },
  {
    headline: "Cloud-Native, Tool Fluent",
    description: "QuickBooks, Gusto, Ramp, Rippling, and more.",
  },
];

const ITEM_DURATION = 2500;

export function ContactFormLoadingPanel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    setVisible(true);
    const start = Date.now();

    const progressTimer = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / ITEM_DURATION) * 100, 100));
    }, 30);
    const hideTimer = setTimeout(() => setVisible(false), ITEM_DURATION - 300);
    const nextTimer = setTimeout(
      () => setActiveIdx((i) => (i + 1) % ITEMS.length),
      ITEM_DURATION,
    );

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [activeIdx]);

  const item = ITEMS[activeIdx];

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Spinner + status */}
      <div className="flex flex-col items-center gap-3">
        <svg
          className="size-8 animate-spin text-brand-500"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-bold text-secondary">Processing your request…</p>
      </div>

      <div className="w-full border-t border-divider" />

      {/* Kruze items */}
      <div className="w-full flex flex-col gap-4">
        <p className="text-xs font-black uppercase tracking-wide text-dim">What sets Kruze apart</p>

        <div className="relative h-20">
          <div
            className="absolute inset-0 flex flex-col gap-1.5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <p className="text-xl font-bold text-primary">{item.headline}</p>
            <p className="text-sm font-normal text-secondary leading-relaxed">{item.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full"
            style={{ width: `${progress}%`, transition: "width 30ms linear" }}
          />
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5">
          {ITEMS.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === activeIdx ? "size-2 bg-brand-500" : "size-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
