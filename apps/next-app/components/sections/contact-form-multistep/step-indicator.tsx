"use client";

import { Check } from "lucide-react";

const STEPS = [
  { label: "Contact Info" },
  { label: "Company Info" },
  { label: "Message" },
];

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between w-full">
      {STEPS.map((step, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3;
        const isComplete = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step.label} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Left connector */}
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 transition-colors duration-300 ${
                    isComplete || isActive ? "bg-brand-500" : "bg-muted"
                  }`}
                />
              )}

              {/* Node */}
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 text-sm font-bold ${
                  isComplete || isActive
                    ? "bg-brand-500 text-white"
                    : "bg-muted text-dim"
                }`}
              >
                {isComplete ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              {/* Right connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 transition-colors duration-300 ${
                    isComplete ? "bg-brand-500" : "bg-muted"
                  }`}
                />
              )}
            </div>

            <span
              className={`mt-2 text-xs font-bold text-center transition-colors duration-300 ${
                isActive ? "text-brand-500" : isComplete ? "text-brand-500" : "text-dim"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
