"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CoreFields {
  contact_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  message: string;
  subscription_agreed: boolean;
}

export interface VcFields {
  stage: string;
  raised: string;
}

export interface AttributionFields {
  lead_source: string;
  lead_type: string;
  referral_partner: string;
  MKTG_Landing_Page: string;
  current_page: string;
  MKTG_Lead_Source: string;
  MKTG_Lead_Source_Detail: string;
  MKTG_UTM_Campaign: string;
  MKTG_UTM_Content: string;
  MKTG_UTM_Medium: string;
  MKTG_UTM_Term: string;
  MKTG_UTM_Source: string;
}

export type FieldErrors = Partial<Record<keyof CoreFields | keyof VcFields, string>>;
export type TouchedFields = Partial<Record<keyof CoreFields | keyof VcFields, boolean>>;

// ─── Constants ───────────────────────────────────────────────────────────────

export const ATTRIBUTION_FIELDS: { key: keyof AttributionFields; label: string; placeholder?: string }[] = [
  { key: "lead_source", label: "lead_source", placeholder: "Website, Client Referral, Partner Referral, Outbound, Bank, Law Firm, Conferences & Events" },
  { key: "lead_type", label: "lead_type", placeholder: "Monthly Recurring - Tier 1 Premium, CFO Consulting, R&D Tax Credit, etc." },
  { key: "referral_partner", label: "referral_partner", placeholder: "Should be ID from SF. If referred by a partner, please specify which one." },
  { key: "MKTG_Landing_Page", label: "MKTG_Landing_Page", placeholder: "The first page the lead landed on (if known)" },
  { key: "current_page", label: "current_page", placeholder: "The current page the lead is on" },
  { key: "MKTG_Lead_Source", label: "MKTG_Lead_Source", placeholder: "referral, direct, organic, cpc" },
  { key: "MKTG_Lead_Source_Detail", label: "MKTG_Lead_Source_Detail", placeholder: "-, google, duckduckgo.com, brex, bing, bookface.ycombinator.com, www.linkedin.com" },
  { key: "MKTG_UTM_Campaign", label: "MKTG_UTM_Campaign" },
  { key: "MKTG_UTM_Content", label: "MKTG_UTM_Content" },
  { key: "MKTG_UTM_Medium", label: "MKTG_UTM_Medium" },
  { key: "MKTG_UTM_Term", label: "MKTG_UTM_Term" },
  { key: "MKTG_UTM_Source", label: "MKTG_UTM_Source" },
];

export const STAGE_OPTIONS = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "Not VC-Backed"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const labelClass = "text-sm font-bold text-primary";
const baseInput =
  "w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border rounded-sm placeholder:text-dim focus:outline-none transition-fast";

export function getInputClass(
  key: keyof CoreFields | keyof VcFields,
  value: string,
  touched: TouchedFields,
  errors: FieldErrors,
  confirmed?: Set<string>,
): string {
  if (!touched[key]) return `${baseInput} border-rule focus:border-brand-500 focus:shadow-focus-ring`;
  if (errors[key])
    return `${baseInput} border-[var(--color-danger-border)] shadow-[0_0_0_3px_rgba(220,38,38,0.12)] focus:border-[var(--color-danger-border)]`;
  if (confirmed?.has(key))
    return `${baseInput} border-brand-500 focus:border-brand-500 focus:shadow-focus-ring`;
  if (value.trim().length > 0)
    return `${baseInput} border-[var(--color-success-border)] shadow-[0_0_0_3px_rgba(22,163,74,0.10)] focus:border-[var(--color-success-border)]`;
  return `${baseInput} border-rule focus:border-brand-500 focus:shadow-focus-ring`;
}

export function FieldStatus({
  error, valid, onConfirm,
}: {
  error?: string;
  valid?: boolean;
  onConfirm?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!valid) return;
    setVisible(true);
    const fade = setTimeout(() => setVisible(false), 1500);
    const confirm = setTimeout(() => onConfirm?.(), 1800);
    return () => { clearTimeout(fade); clearTimeout(confirm); };
  }, [valid, onConfirm]);

  if (error)
    return (
      <p className="absolute bottom-0 left-0 flex items-center gap-1 text-xs text-[var(--color-danger-text)]">
        <span aria-hidden="true">✕</span> {error}
      </p>
    );
  if (valid)
    return (
      <p
        className="absolute bottom-0 left-0 flex items-center gap-1 text-xs text-[var(--color-success-text)] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span aria-hidden="true">✓</span> Looks good
      </p>
    );
  return null;
}

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

// ─── Props ───────────────────────────────────────────────────────────────────

interface ContactFormFieldsProps {
  fields: CoreFields;
  onField: <K extends keyof CoreFields>(key: K, value: CoreFields[K]) => void;
  onBlur: (key: keyof CoreFields | keyof VcFields) => void;
  errors: FieldErrors;
  touched: TouchedFields;
  isVcFunded: boolean;
  onVcFundedChange: (v: boolean) => void;
  vc: VcFields;
  onVc: (key: keyof VcFields, value: string) => void;
  isNewsletter: boolean;
  submitError: string | null;
  loading: boolean;
  submitLabel: string;
  attribution: AttributionFields;
  onAttr: (key: keyof AttributionFields, value: string) => void;
  devOpen: boolean;
  onDevOpen: (open: boolean) => void;
  twoCol?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ContactFormFields({
  fields, onField, onBlur, errors, touched,
  isVcFunded, onVcFundedChange, vc, onVc,
  isNewsletter, submitError, loading, submitLabel,
  attribution, onAttr, devOpen, onDevOpen, twoCol,
}: ContactFormFieldsProps) {
  const [vcTouched, setVcTouched] = useState(false);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  function confirm(key: keyof CoreFields | keyof VcFields) {
    setConfirmed((prev) => new Set(prev).add(key));
  }

  const ic = (key: keyof CoreFields | keyof VcFields, value: string) =>
    getInputClass(key, value, touched, errors, confirmed);
  const isValid = (key: keyof CoreFields | keyof VcFields, value: string) =>
    !!touched[key] && !errors[key] && !confirmed.has(key) && value.trim().length > 0;

  return (
    <>
      {isNewsletter ? (
        <div className="relative flex flex-col gap-1 pb-4">
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input
            id="email" type="email" autoComplete="email" placeholder="jane@acme.com"
            value={fields.email}
            onChange={(e) => onField("email", e.target.value)}
            onBlur={() => onBlur("email")}
            className={ic("email", fields.email)}
          />
          <FieldStatus error={errors.email} valid={isValid("email", fields.email)} onConfirm={() => confirm("email")} />
        </div>
      ) : (
        <>
          <div className={twoCol ? "grid grid-cols-1 sm:grid-cols-2 gap-x-4" : "contents"}>
            <div className="relative flex flex-col gap-1 pb-4">
              <label htmlFor="contact_name" className={labelClass}>Full name</label>
              <input
                id="contact_name" type="text" autoComplete="name" placeholder="Jane Smith"
                value={fields.contact_name}
                onChange={(e) => onField("contact_name", e.target.value)}
                onBlur={() => onBlur("contact_name")}
                className={ic("contact_name", fields.contact_name)}
              />
              <FieldStatus error={errors.contact_name} valid={isValid("contact_name", fields.contact_name)} onConfirm={() => confirm("contact_name")} />
            </div>

            <div className="relative flex flex-col gap-1 pb-4">
              <label htmlFor="company_name" className={labelClass}>Company name</label>
              <input
                id="company_name" type="text" autoComplete="organization" placeholder="Acme Inc."
                value={fields.company_name}
                onChange={(e) => onField("company_name", e.target.value)}
                onBlur={() => onBlur("company_name")}
                className={ic("company_name", fields.company_name)}
              />
              <FieldStatus error={errors.company_name} valid={isValid("company_name", fields.company_name)} onConfirm={() => confirm("company_name")} />
            </div>

            <div className="relative flex flex-col gap-1 pb-4">
              <label htmlFor="email" className={labelClass}>Email address</label>
              <input
                id="email" type="email" autoComplete="email" placeholder="jane@acme.com"
                value={fields.email}
                onChange={(e) => onField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                className={ic("email", fields.email)}
              />
              <FieldStatus error={errors.email} valid={isValid("email", fields.email)} onConfirm={() => confirm("email")} />
            </div>

            <div className="relative flex flex-col gap-1 pb-4">
              <label htmlFor="phone_number" className={labelClass}>
                Phone <span className="font-normal text-dim">(optional)</span>
              </label>
              <input
                id="phone_number" type="tel" autoComplete="tel" placeholder="(415) 000-0000"
                value={fields.phone_number}
                onChange={(e) => onField("phone_number", formatPhone(e.target.value))}
                onBlur={() => onBlur("phone_number")}
                className={ic("phone_number", fields.phone_number)}
              />
              <FieldStatus error={errors.phone_number} valid={isValid("phone_number", fields.phone_number)} onConfirm={() => confirm("phone_number")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className={labelClass}>
              Message <span className="font-normal text-dim">(optional)</span>
            </label>
            <textarea
              id="message" rows={4}
              placeholder="Tell us about your startup and what you need help with…"
              value={fields.message}
              onChange={(e) => onField("message", e.target.value)}
              className={`${ic("message", fields.message)} resize-none`}
            />
          </div>

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

            <div className="pl-7 flex flex-col gap-1">
              <p className="flex items-center gap-1 text-xs font-normal text-secondary">
                <Info size={12} strokeWidth={1.5} className="shrink-0 text-brand-500" aria-hidden="true" />
                Specializing in DE C-Corps with Seed and VC Funding
              </p>
              <p
                className="text-xs font-normal text-dim overflow-hidden"
                style={{
                  maxHeight: vcTouched && !isVcFunded ? "3rem" : "0",
                  opacity: vcTouched && !isVcFunded ? 1 : 0,
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                }}
              >
                Please note, our expertise is not focused on LLCs or bootstrapped companies.
              </p>
            </div>
          </div>

          {isVcFunded && (
            <div className="flex flex-col gap-1 pl-7">
              <div className="relative flex flex-col gap-1 pb-4">
                <label htmlFor="stage" className={labelClass}>What is your stage of funding?</label>
                <select
                  id="stage" value={vc.stage}
                  onChange={(e) => onVc("stage", e.target.value)}
                  onBlur={() => onBlur("stage")}
                  className={ic("stage", vc.stage)}
                >
                  <option value="">Select Stage</option>
                  {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <FieldStatus error={errors.stage} valid={isValid("stage", vc.stage)} onConfirm={() => confirm("stage")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="raised" className={labelClass}>Total funding raised</label>
                <input
                  id="raised" type="text" inputMode="numeric" placeholder="$0"
                  value={vc.raised ? `$${Number(vc.raised).toLocaleString("en-US")}` : ""}
                  onChange={(e) => onVc("raised", e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={() => onBlur("raised")}
                  className={`${ic("raised", vc.raised)} tabular-nums`}
                />
              </div>
            </div>
          )}
        </>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox" checked={fields.subscription_agreed}
          onChange={(e) => onField("subscription_agreed", e.target.checked)}
          className="mt-0.5 size-4 rounded-xs border-rule accent-brand-500 focus-ring cursor-pointer"
        />
        <span className="text-sm font-normal text-secondary leading-relaxed">
          I agree to receive marketing emails from Kruze Consulting. You can unsubscribe at any time.
        </span>
      </label>

      {submitError && (
        <p className="text-sm text-[var(--color-danger-text)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-sm px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit" disabled={loading}
        className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-brand transition-fast focus-ring"
      >
        {submitLabel}
      </button>

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
    </>
  );
}
