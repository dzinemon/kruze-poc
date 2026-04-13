"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  getInputClass,
  FieldStatus,
  STAGE_OPTIONS,
  type VcFields,
  type FieldErrors,
  type TouchedFields,
} from "../contact-form-fields";

const labelClass = "text-sm font-bold text-primary";

interface Step2Props {
  isVcFunded: boolean;
  onVcFundedChange: (v: boolean) => void;
  vc: VcFields;
  onVc: (key: keyof VcFields, value: string) => void;
  onBlur: (key: keyof VcFields) => void;
  errors: FieldErrors;
  touched: TouchedFields;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Company({
  isVcFunded, onVcFundedChange, vc, onVc, onBlur, errors, touched, onNext, onBack,
}: Step2Props) {
  const [vcTouched, setVcTouched] = useState(false);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  function confirm(key: keyof VcFields) {
    setConfirmed((prev) => new Set(prev).add(key));
  }

  const ic = (key: keyof VcFields, value: string) =>
    getInputClass(key, value, touched, errors, confirmed);
  const isValid = (key: keyof VcFields, value: string) =>
    !!touched[key] && !errors[key] && !confirmed.has(key) && value.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Specialization note */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-sm bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
        <Info size={14} strokeWidth={1.5} className="shrink-0 text-brand-500 mt-0.5" aria-hidden="true" />
        <p className="text-xs font-normal text-brand-700 dark:text-brand-300 leading-relaxed">
          Specializing in DE C-Corps with Seed and VC Funding
        </p>
      </div>

      {/* VC checkbox */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={isVcFunded}
            onChange={(e) => {
              onVcFundedChange(e.target.checked);
              setVcTouched(true);
            }}
            className="mt-0.5 size-4 rounded-xs border-rule accent-brand-500 focus-ring cursor-pointer"
          />
          <span className="text-sm font-normal text-secondary leading-relaxed">
            Are you a VC-funded startup?
          </span>
        </label>

        <p
          className="text-xs font-normal text-dim pl-7 overflow-hidden"
          style={{
            maxHeight: vcTouched && !isVcFunded ? "3rem" : "0",
            opacity: vcTouched && !isVcFunded ? 1 : 0,
            transition: "max-height 0.3s ease, opacity 0.3s ease",
          }}
        >
          Please note, our expertise is not focused on LLCs or bootstrapped companies.
        </p>
      </div>

      {/* VC fields */}
      {isVcFunded && (
        <div className="flex flex-col gap-4 pl-7">
          <div className="relative flex flex-col gap-1 pb-4">
            <label htmlFor="ms-stage" className={labelClass}>What is your stage of funding?</label>
            <select
              id="ms-stage" value={vc.stage}
              onChange={(e) => onVc("stage", e.target.value)}
              onBlur={() => onBlur("stage")}
              className={ic("stage", vc.stage)}
            >
              <option value="">Select Stage</option>
              {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <FieldStatus error={errors.stage} valid={isValid("stage", vc.stage)} onConfirm={() => confirm("stage")} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ms-raised" className={labelClass}>Total funding raised</label>
            <input
              id="ms-raised" type="text" inputMode="numeric" placeholder="$0"
              value={vc.raised ? `$${Number(vc.raised).toLocaleString("en-US")}` : ""}
              onChange={(e) => onVc("raised", e.target.value.replace(/[^0-9]/g, ""))}
              className={`${ic("raised", vc.raised)} tabular-nums`}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-2 pt-2">
        <button
          type="button" onClick={onBack}
          className="text-sm font-bold text-dim hover:text-secondary transition-fast focus-ring rounded-xs"
        >
          ← Back
        </button>
        <button
          type="button" onClick={onNext}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-brand transition-fast focus-ring"
        >
          Continue to Final Step
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
