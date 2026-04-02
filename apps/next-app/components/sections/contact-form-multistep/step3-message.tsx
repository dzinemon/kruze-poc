"use client";

import { ATTRIBUTION_FIELDS, type CoreFields, type AttributionFields } from "../contact-form-fields";

const inputClass =
  "w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast";

function AttributionInput({
  label, name, value, onChange, placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary">{label}</label>
      <input
        type="text" name={name} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-xs font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
      />
    </div>
  );
}

interface Step3Props {
  fields: CoreFields;
  onField: <K extends keyof CoreFields>(key: K, value: CoreFields[K]) => void;
  submitError: string | null;
  loading: boolean;
  devOpen: boolean;
  onDevOpen: (open: boolean) => void;
  attribution: AttributionFields;
  onAttr: (key: keyof AttributionFields, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step3Message({
  fields, onField, submitError, loading, devOpen, onDevOpen, attribution, onAttr, onBack, onSubmit,
}: Step3Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ms-message" className="text-sm font-bold text-primary">
          Message <span className="font-normal text-dim">(optional)</span>
        </label>
        <textarea
          id="ms-message" rows={5}
          placeholder="Tell us about your startup and what you need help with…"
          value={fields.message}
          onChange={(e) => onField("message", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {submitError && (
        <p className="text-sm text-[var(--color-danger-text)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-sm px-4 py-3">
          {submitError}
        </p>
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
          type="button" onClick={onSubmit} disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-brand transition-fast focus-ring"
        >
          {loading ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Submit Message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-dim text-center">
        By submitting, you agree to our{" "}
        <span className="text-brand-500 underline cursor-pointer">Privacy Policy</span>.
        We never share your data.
      </p>

      {/* Dev attribution accordion */}
      <div className="border-t border-divider pt-4 mt-2">
        <button
          type="button"
          onClick={() => onDevOpen(!devOpen)}
          className="flex items-center gap-1.5 text-xs font-bold text-dim hover:text-secondary transition-fast focus-ring rounded-xs"
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: devOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▸
          </span>
          Dev: Attribution Fields
        </button>
        {devOpen && (
          <div className="mt-3 flex flex-col gap-3">
            {ATTRIBUTION_FIELDS.map(({ key, label, placeholder }) => (
              <AttributionInput
                key={key} label={label} name={key}
                value={attribution[key]} placeholder={placeholder}
                onChange={(v) => onAttr(key, v)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
