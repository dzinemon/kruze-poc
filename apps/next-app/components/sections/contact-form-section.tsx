"use client";

import { useState } from "react";
import type { ContactFormBlock } from "@kruze-poc/sanity-schemas/src/types";

const SUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT ?? "http://localhost:7071/api/submit";

const ATTRIBUTION_FIELDS: { key: keyof AttributionFields; label: string; placeholder?: string }[] = [
  { key: "lead_source",            label: "lead_source", placeholder: "Website, Client Referral, Partner Referral, Outbound, Bank, Law Firm, Conferences & Events" },
  { key: "lead_type",        label: "lead_type", placeholder: "Monthly Recurring - Tier 1 Premium, CFO Consulting, R&D Tax Credit, etc." },
  { key: "referral_partner",       label: "referral_partner", placeholder: " Should be ID from SF. If referred by a partner, please specify which one." },
  { key: "MKTG_Landing_Page",      label: "MKTG_Landing_Page", placeholder: "The first page the lead landed on (if known)" },
  { key: "current_page",           label: "current_page", placeholder: "The current page the lead is on" },
  { key: "MKTG_Lead_Source",       label: "MKTG_Lead_Source", placeholder: "referral, direct, organic, cpc" },
  { key: "MKTG_Lead_Source_Detail",label: "MKTG_Lead_Source_Detail", placeholder: " -,google, duckduckgo.com, brex, bing, bookface.ycombinator.com, www.linkedin.com" },
  { key: "MKTG_UTM_Campaign",      label: "MKTG_UTM_Campaign", placeholder: "" },
  { key: "MKTG_UTM_Content",       label: "MKTG_UTM_Content", placeholder: "" },
  { key: "MKTG_UTM_Medium",        label: "MKTG_UTM_Medium", placeholder: "" },
  { key: "MKTG_UTM_Term",          label: "MKTG_UTM_Term", placeholder: "" },
  { key: "MKTG_UTM_Source",        label: "MKTG_UTM_Source", placeholder: "" },
];

const STAGE_OPTIONS = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Not VC-Backed",
];

interface ContactFormSectionProps {
  section: ContactFormBlock;
}

interface CoreFields {
  contact_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  message: string;
  subscription_agreed: boolean;
}

interface VcFields {
  stage: string;
  raised: string;
}

interface AttributionFields {
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

type FieldErrors = Partial<Record<keyof CoreFields | keyof VcFields, string>>;

const EMAIL_RE = /.+@.+\..+/;

function validate(fields: CoreFields, isVcFunded: boolean, vc: VcFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.contact_name.trim()) {
    errors.contact_name = "Full name is required.";
  } else if (!fields.contact_name.trim().includes(" ")) {
    errors.contact_name = "Please enter your first and last name.";
  }
  if (!fields.company_name.trim()) {
    errors.company_name = "Company name is required.";
  }
  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_RE.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (fields.phone_number.trim() && !/^\(\d{3}\) \d{3}-\d{4}$/.test(fields.phone_number)) {
    errors.phone_number = "Phone must be in (555) 123-4567 format.";
  }
  if (isVcFunded && !vc.stage) {
    errors.stage = "Please select your funding stage.";
  }
  return errors;
}

const inputClass =
  "w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast";

const labelClass = "text-sm font-bold text-primary";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function AttributionInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-secondary">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 text-xs font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
      />
    </div>
  );
}

export function ContactFormSection({ section }: ContactFormSectionProps) {
  const isNewsletter = section.formType === "newsletter";
  const gradientWord = isNewsletter ? "loop" : "consultation";
  const headingStart = isNewsletter ? "Stay in the " : "Get a free ";
  const eyebrow = isNewsletter ? "Newsletter" : "Free Consultation";
  const submitLabel = isNewsletter ? "Subscribe" : "Request Consultation";

  // Core fields
  const [fields, setFields] = useState<CoreFields>({
    contact_name: "",
    company_name: "",
    email: "",
    phone_number: "",
    message: "",
    subscription_agreed: false,
  });

  // VC funding
  const [isVcFunded, setIsVcFunded] = useState(false);
  const [vc, setVc] = useState<VcFields>({ stage: "", raised: "" });

  // Attribution / dev accordion
  const [devOpen, setDevOpen] = useState(false);
  const [attribution, setAttribution] = useState<AttributionFields>({
    lead_source: "",
    lead_type: "",
    referral_partner: "",
    MKTG_Landing_Page: "",
    current_page: "",
    MKTG_Lead_Source: "organic",
    MKTG_Lead_Source_Detail: "google",
    MKTG_UTM_Campaign: "",
    MKTG_UTM_Content: "",
    MKTG_UTM_Medium: "",
    MKTG_UTM_Term: "",
    MKTG_UTM_Source: "",
  });

  // Form state
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField<K extends keyof CoreFields>(key: K, value: CoreFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setAttr(key: keyof AttributionFields, value: string) {
    setAttribution((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isNewsletter) {
      await submitNewsletter();
      return;
    }

    const errs = validate(fields, isVcFunded, vc);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const nameParts = fields.contact_name.trim().split(" ");
    const contact_fname = nameParts[0];
    const contact_lname = nameParts.slice(1).join(" ");

    const payload: Record<string, unknown> = {
      form_type: "contact",
      contact_fname,
      contact_lname,
      company_name: fields.company_name.trim(),
      email: fields.email.trim(),
      phone_number: fields.phone_number.trim(),
      message: fields.message.trim(),
      subscription_agreed: fields.subscription_agreed,
      ...attribution,
      ...(isVcFunded ? { stage: vc.stage, raised: vc.raised } : {}),
    };

    await postPayload(payload);
  }

  async function submitNewsletter() {
    if (!fields.email.trim() || !EMAIL_RE.test(fields.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    const payload = {
      form_type: "newsletter",
      email: fields.email.trim(),
      subscription_agreed: fields.subscription_agreed,
      ...attribution,
    };
    await postPayload(payload);
  }

  async function postPayload(payload: Record<string, unknown>) {
    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    setSubmitError(null);
    setLoading(true);
    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setSubmitError(`Submission failed (${res.status})${text ? `: ${text}` : "."}`);
      } else {
        setSuccess(true);
      }
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-hero-gradient py-20 px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="text-center flex flex-col gap-4">
          <span className="inline-flex items-center gap-1.5 mx-auto px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800">
            <span className="size-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-primary">
            {headingStart}
            <span className="text-gradient-brand">{gradientWord}</span>
          </h2>
          <p className="text-base font-normal text-secondary leading-relaxed">
            {isNewsletter
              ? "Get startup finance tips, tax deadlines, and CFO insights delivered to your inbox."
              : "Talk to a Kruze CFO about your startup's accounting, taxes, and financial strategy."}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-lg bg-subtle border border-divider shadow-sm p-8">

          {success ? (
            <div className="text-center flex flex-col gap-3 py-4">
              <p className="text-2xl font-bold text-primary">
                {isNewsletter ? "You're subscribed!" : "Request received!"}
              </p>
              <p className="text-base text-secondary leading-relaxed">
                {isNewsletter
                  ? "Thanks for subscribing. You'll hear from us soon."
                  : "Thanks! A Kruze CFO will be in touch within one business day."}
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Newsletter: email only */}
              {isNewsletter ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={labelClass}>Email address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@acme.com"
                    value={fields.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={inputClass}
                  />
                  <FieldError msg={errors.email} />
                </div>
              ) : (
                <>
                  {/* Full name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact_name" className={labelClass}>Full name</label>
                    <input
                      id="contact_name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      value={fields.contact_name}
                      onChange={(e) => setField("contact_name", e.target.value)}
                      className={inputClass}
                    />
                    <FieldError msg={errors.contact_name} />
                  </div>

                  {/* Company name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company_name" className={labelClass}>Company name</label>
                    <input
                      id="company_name"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Inc."
                      value={fields.company_name}
                      onChange={(e) => setField("company_name", e.target.value)}
                      className={inputClass}
                    />
                    <FieldError msg={errors.company_name} />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@acme.com"
                      value={fields.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={inputClass}
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone_number" className={labelClass}>
                      Phone <span className="font-normal text-dim">(optional)</span>
                    </label>
                    <input
                      id="phone_number"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(415) 000-0000"
                      value={fields.phone_number}
                      onChange={(e) => setField("phone_number", formatPhone(e.target.value))}
                      className={inputClass}
                    />
                    <FieldError msg={errors.phone_number} />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className={labelClass}>
                      Message <span className="font-normal text-dim">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your startup and what you need help with…"
                      value={fields.message}
                      onChange={(e) => setField("message", e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* VC funding toggle */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVcFunded}
                      onChange={(e) => setIsVcFunded(e.target.checked)}
                      className="mt-0.5 size-4 rounded-xs border-rule accent-brand-500 focus-ring cursor-pointer"
                    />
                    <span className="text-sm font-normal text-secondary leading-relaxed">
                      Are you a VC-funded startup?
                    </span>
                  </label>

                  {/* VC fields */}
                  {isVcFunded && (
                    <div className="flex flex-col gap-4 pl-7">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="stage" className={labelClass}>
                          What is your stage of funding?
                        </label>
                        <select
                          id="stage"
                          value={vc.stage}
                          onChange={(e) => {
                            setVc((v) => ({ ...v, stage: e.target.value }));
                            if (errors.stage) setErrors((prev) => ({ ...prev, stage: undefined }));
                          }}
                          className={inputClass}
                        >
                          <option value="">Select Stage</option>
                          {STAGE_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.stage} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="raised" className={labelClass}>
                          Total funding raised
                        </label>
                        <input
                          id="raised"
                          type="text"
                          inputMode="numeric"
                          placeholder="$0"
                          value={vc.raised ? `$${Number(vc.raised).toLocaleString("en-US")}` : ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            setVc((v) => ({ ...v, raised: raw }));
                          }}
                          className={`${inputClass} tabular-nums`}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Marketing emails checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.subscription_agreed}
                  onChange={(e) => setField("subscription_agreed", e.target.checked)}
                  className="mt-0.5 size-4 rounded-xs border-rule accent-brand-500 focus-ring cursor-pointer"
                />
                <span className="text-sm font-normal text-secondary leading-relaxed">
                  I agree to receive marketing emails from Kruze Consulting. You can unsubscribe at any time.
                </span>
              </label>

              {/* Submit error */}
              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-sm px-4 py-3">
                  {submitError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-brand transition-fast focus-ring"
              >
                {loading ? "Sending…" : submitLabel}
              </button>

              {/* Privacy note */}
              <p className="text-xs text-dim text-center">
                By submitting, you agree to our{" "}
                <span className="text-brand-500 underline cursor-pointer">Privacy Policy</span>.
                We never share your data.
              </p>

              {/* Dev attribution accordion */}
              <div className="border-t border-divider pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setDevOpen((o) => !o)}
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
                        key={key}
                        label={label}
                        name={key}
                        value={attribution[key]}
                        placeholder={placeholder}
                        onChange={(v) => setAttr(key, v)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </form>
          )}

        </div>
      </div>
    </section>
  );
}
