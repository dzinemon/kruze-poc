"use client";

import { useState } from "react";
import {
  getInputClass,
  formatPhone,
  FieldStatus,
  type CoreFields,
  type FieldErrors,
  type TouchedFields,
} from "../contact-form-fields";

const labelClass = "text-sm font-bold text-primary";

interface Step1Props {
  fields: CoreFields;
  onField: <K extends keyof CoreFields>(key: K, value: CoreFields[K]) => void;
  onBlur: (key: keyof CoreFields) => void;
  errors: FieldErrors;
  touched: TouchedFields;
  onNext: () => void;
}

export function Step1Contact({ fields, onField, onBlur, errors, touched, onNext }: Step1Props) {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  function confirm(key: keyof CoreFields) {
    setConfirmed((prev) => new Set(prev).add(key));
  }

  const ic = (key: keyof CoreFields, value: string) =>
    getInputClass(key, value, touched, errors, confirmed);
  const isValid = (key: keyof CoreFields, value: string) =>
    !!touched[key] && !errors[key] && !confirmed.has(key) && value.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col gap-1 pb-4">
        <label htmlFor="ms-contact_name" className={labelClass}>Full name</label>
        <input
          id="ms-contact_name" type="text" autoComplete="name" placeholder="Jane Smith"
          value={fields.contact_name}
          onChange={(e) => onField("contact_name", e.target.value)}
          onBlur={() => onBlur("contact_name")}
          className={ic("contact_name", fields.contact_name)}
        />
        <FieldStatus error={errors.contact_name} valid={isValid("contact_name", fields.contact_name)} onConfirm={() => confirm("contact_name")} />
      </div>

      <div className="relative flex flex-col gap-1 pb-4">
        <label htmlFor="ms-company_name" className={labelClass}>Company name</label>
        <input
          id="ms-company_name" type="text" autoComplete="organization" placeholder="Acme Inc."
          value={fields.company_name}
          onChange={(e) => onField("company_name", e.target.value)}
          onBlur={() => onBlur("company_name")}
          className={ic("company_name", fields.company_name)}
        />
        <FieldStatus error={errors.company_name} valid={isValid("company_name", fields.company_name)} onConfirm={() => confirm("company_name")} />
      </div>

      <div className="relative flex flex-col gap-1 pb-4">
        <label htmlFor="ms-email" className={labelClass}>Email address</label>
        <input
          id="ms-email" type="email" autoComplete="email" placeholder="jane@acme.com"
          value={fields.email}
          onChange={(e) => onField("email", e.target.value)}
          onBlur={() => onBlur("email")}
          className={ic("email", fields.email)}
        />
        <FieldStatus error={errors.email} valid={isValid("email", fields.email)} onConfirm={() => confirm("email")} />
      </div>

      <div className="relative flex flex-col gap-1 pb-4">
        <label htmlFor="ms-phone_number" className={labelClass}>
          Phone <span className="font-normal text-dim">(optional)</span>
        </label>
        <input
          id="ms-phone_number" type="tel" autoComplete="tel" placeholder="(415) 000-0000"
          value={fields.phone_number}
          onChange={(e) => onField("phone_number", formatPhone(e.target.value))}
          onBlur={() => onBlur("phone_number")}
          className={ic("phone_number", fields.phone_number)}
        />
        <FieldStatus error={errors.phone_number} valid={isValid("phone_number", fields.phone_number)} onConfirm={() => confirm("phone_number")} />
      </div>

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

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-brand transition-fast focus-ring mt-2"
      >
        Get Started
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
