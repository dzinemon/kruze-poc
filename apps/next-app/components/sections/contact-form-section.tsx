"use client";

import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import type { ContactFormBlock } from "@kruze-poc/sanity-schemas/src/types";
import { ContactFormFields } from "./contact-form-fields";
import type {
  CoreFields,
  VcFields,
  AttributionFields,
  FieldErrors,
  TouchedFields,
} from "./contact-form-fields";
import { ContactFormLoadingPanel } from "./contact-form-loading-panel";

const SUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT ?? "http://localhost:7071/api/submit";

const EMAIL_RE = /.+@.+\..+/;

function validate(fields: CoreFields, isVcFunded: boolean, vc: VcFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.contact_name.trim()) {
    errors.contact_name = "Full name is required.";
  } else if (!fields.contact_name.trim().includes(" ")) {
    errors.contact_name = "Please enter your first and last name.";
  } else {
    const parts = fields.contact_name.trim().split(/\s+/);
    if (parts.some((p) => p.length < 2)) {
      errors.contact_name = "Each name must be at least 2 characters.";
    }
  }
  if (!fields.company_name.trim()) errors.company_name = "Company name is required.";
  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_RE.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (fields.phone_number.trim() && !/^\(\d{3}\) \d{3}-\d{4}$/.test(fields.phone_number)) {
    errors.phone_number = "Phone must be in (555) 123-4567 format.";
  }
  if (isVcFunded && !vc.stage) errors.stage = "Please select your funding stage.";
  return errors;
}

interface ContactFormSectionProps {
  section: ContactFormBlock;
}

export function ContactFormSection({ section }: ContactFormSectionProps) {
  const isNewsletter = section.formType === "newsletter";

  const [fields, setFields] = useState<CoreFields>({
    contact_name: "", company_name: "", email: "",
    phone_number: "", message: "", subscription_agreed: false,
  });
  const [isVcFunded, setIsVcFunded] = useState(false);
  const [vc, setVc] = useState<VcFields>({ stage: "", raised: "" });
  const [attribution, setAttribution] = useState<AttributionFields>({
    lead_source: "", lead_type: "", referral_partner: "",
    MKTG_Landing_Page: "", current_page: "",
    MKTG_Lead_Source: "organic", MKTG_Lead_Source_Detail: "google",
    MKTG_UTM_Campaign: "", MKTG_UTM_Content: "",
    MKTG_UTM_Medium: "", MKTG_UTM_Term: "", MKTG_UTM_Source: "",
  });
  const [devOpen, setDevOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField<K extends keyof CoreFields>(key: K, value: CoreFields[K]) {
    const nextFields = { ...fields, [key]: value };
    setFields(nextFields);
    if (touched[key]) setErrors(validate(nextFields, isVcFunded, vc));
    else setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleVc(key: keyof VcFields, value: string) {
    const nextVc = { ...vc, [key]: value };
    setVc(nextVc);
    if (touched[key]) setErrors(validate(fields, isVcFunded, nextVc));
    else setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function touchField(key: keyof CoreFields | keyof VcFields) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(fields, isVcFunded, vc));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isNewsletter) {
      await submitNewsletter();
      return;
    }

    const allTouched: TouchedFields = {
      contact_name: true, company_name: true, email: true, phone_number: true, stage: true,
    };
    setTouched(allTouched);
    const errs = validate(fields, isVcFunded, vc);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const nameParts = fields.contact_name.trim().split(/\s+/);
    await postPayload({
      form_type: "contact",
      contact_fname: nameParts[0],
      contact_lname: nameParts.slice(1).join(" "),
      company_name: fields.company_name.trim(),
      email: fields.email.trim(),
      phone_number: fields.phone_number.trim(),
      message: fields.message.trim(),
      subscription_agreed: fields.subscription_agreed,
      ...attribution,
      ...(isVcFunded ? { stage: vc.stage, raised: vc.raised } : {}),
    });
  }

  async function submitNewsletter() {
    if (!fields.email.trim() || !EMAIL_RE.test(fields.email)) {
      setTouched({ email: true });
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    await postPayload({
      form_type: "newsletter",
      email: fields.email.trim(),
      subscription_agreed: fields.subscription_agreed,
      ...attribution,
    });
  }

  async function postPayload(payload: Record<string, unknown>) {
    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== "" && v !== null && v !== undefined),
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

  const formFields = (
    <ContactFormFields
      fields={fields}
      onField={setField}
      onBlur={touchField}
      errors={errors}
      touched={touched}
      isVcFunded={isVcFunded}
      onVcFundedChange={setIsVcFunded}
      vc={vc}
      onVc={handleVc}
      isNewsletter={isNewsletter}
      submitError={submitError}
      loading={loading}
      submitLabel={isNewsletter ? "Subscribe" : "Request Consultation"}
      attribution={attribution}
      onAttr={(key, value) => setAttribution((prev) => ({ ...prev, [key]: value }))}
      devOpen={devOpen}
      onDevOpen={setDevOpen}
      twoCol={!isNewsletter}
    />
  );

  // ── Newsletter: unchanged single-column layout ────────────────────────────
  if (isNewsletter) {
    return (
      <section className="bg-hero-gradient py-20 px-4">
        <div className="max-w-xl mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 mx-auto px-3 py-1 text-xs font-black tracking-wide uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 rounded-full border border-brand-200 dark:border-brand-800">
              <span className="size-1.5 rounded-full bg-brand-500" />
              Newsletter
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              Stay in the <span className="text-gradient-brand">loop</span>
            </h2>
            <p className="text-base font-normal text-secondary leading-relaxed">
              Get startup finance tips, tax deadlines, and CFO insights delivered to your inbox.
            </p>
          </div>
          <div className="rounded-lg bg-subtle border border-divider shadow-sm p-8">
            {success ? (
              <div className="text-center flex flex-col gap-3 py-4">
                <p className="text-2xl font-bold text-primary">You're subscribed!</p>
                <p className="text-base text-secondary leading-relaxed">
                  Thanks for subscribing. You'll hear from us soon.
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                {formFields}
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── Consultation: two-column layout ──────────────────────────────────────
  const rightContent = loading ? (
    <ContactFormLoadingPanel />
  ) : success ? (
    <div className="text-center flex flex-col gap-3 py-8">
      <p className="text-2xl font-bold text-primary">Request received!</p>
      <p className="text-base text-secondary leading-relaxed">
        Thanks! A Kruze CFO will be in touch within one business day.
      </p>
    </div>
  ) : (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formFields}
    </form>
  );

  return (
    <section className="bg-hero-gradient py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-5 rounded-xl overflow-hidden shadow-md">

          {/* Left — contact info */}
          <div
            className="lg:col-span-2 flex flex-col gap-6 p-8 lg:p-10"
            style={{ background: "var(--gradient-cta)" }}
          >
            <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 text-xs font-black tracking-wide uppercase text-white/80 bg-white/10 rounded-full border border-white/20">
              <span className="size-1.5 rounded-full bg-white/60" />
              Free Consultation
            </span>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">Get In Touch</h2>
              <p className="text-sm font-normal leading-relaxed text-white/80">
                We are the experts at helping seed/VC-backed Delaware C-Corps with their accounting and finances!
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3">
                <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-white/70 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-normal text-white/80 leading-relaxed">
                  221B Baker Street, Suite 400<br />San Francisco, CA 94107
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />
                <p className="text-sm font-normal text-white/80">hello@kruzeconsulting.com</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />
                <p className="text-sm font-normal text-white/80">(415) 322-1610</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 bg-subtle p-8 lg:p-10">
            {rightContent}
          </div>

        </div>
      </div>
    </section>
  );
}
