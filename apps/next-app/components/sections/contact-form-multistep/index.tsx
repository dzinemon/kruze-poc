"use client";

import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MultiStepContactBlock } from "@kruze-poc/sanity-schemas/src/types";
import type {
  CoreFields,
  VcFields,
  AttributionFields,
  FieldErrors,
  TouchedFields,
} from "../contact-form-fields";
import { StepIndicator } from "./step-indicator";
import { Step1Contact } from "./step1-contact";
import { Step2Company } from "./step2-company";
import { Step3Message } from "./step3-message";

const SUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT ?? "http://localhost:7071/api/submit";

const EMAIL_RE = /.+@.+\..+/;

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

const stepTransition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] } as const;

function validateStep1(fields: CoreFields): FieldErrors {
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
  return errors;
}

interface ContactFormMultistepProps {
  section: MultiStepContactBlock;
}

export function ContactFormMultistep({ section }: ContactFormMultistepProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [fields, setFields] = useState<CoreFields>({
    contact_name: "", company_name: "", email: "",
    phone_number: "", message: "", subscription_agreed: false,
  });
  const [isVcFunded, setIsVcFunded] = useState(true);
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

  function goTo(next: 1 | 2 | 3, dir: 1 | -1) {
    setDirection(dir);
    setStep(next);
  }

  function setField<K extends keyof CoreFields>(key: K, value: CoreFields[K]) {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) setErrors(validateStep1(next));
    else setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleBlurCore(key: keyof CoreFields) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateStep1(fields));
  }

  function handleBlurVc(key: keyof VcFields) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function handleVc(key: keyof VcFields, value: string) {
    setVc((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleStep1Next() {
    const allTouched: TouchedFields = {
      contact_name: true, company_name: true, email: true, phone_number: true,
    };
    setTouched(allTouched);
    const errs = validateStep1(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    goTo(2, 1);
  }

  async function handleSubmit() {
    const nameParts = fields.contact_name.trim().split(/\s+/);
    const payload: Record<string, unknown> = {
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
    };

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

  const rightContent = success ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-center flex flex-col gap-3 py-8"
    >
      <p className="text-2xl font-bold text-primary">Request received!</p>
      <p className="text-base text-secondary leading-relaxed">
        Thanks! A Kruze CFO will be in touch within one business day.
      </p>
    </motion.div>
  ) : (
    <>
      <StepIndicator currentStep={step} />
      <div className="border-t border-divider mt-6 pt-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
          >
            {step === 1 && (
              <Step1Contact
                fields={fields} onField={setField}
                onBlur={handleBlurCore} errors={errors} touched={touched}
                onNext={handleStep1Next}
              />
            )}
            {step === 2 && (
              <Step2Company
                isVcFunded={isVcFunded} onVcFundedChange={setIsVcFunded}
                vc={vc} onVc={handleVc} onBlur={handleBlurVc}
                errors={errors} touched={touched}
                onNext={() => goTo(3, 1)} onBack={() => goTo(1, -1)}
              />
            )}
            {step === 3 && (
              <Step3Message
                fields={fields} onField={setField}
                submitError={submitError} loading={loading}
                devOpen={devOpen} onDevOpen={setDevOpen}
                attribution={attribution}
                onAttr={(key, value) => setAttribution((prev) => ({ ...prev, [key]: value }))}
                onBack={() => goTo(2, -1)} onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <section className="bg-hero-gradient py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Mobile: info on top, form below | Desktop: side-by-side grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 rounded-xl overflow-hidden shadow-md">

          {/* Left — contact info */}
          <div
            className="lg:col-span-2 flex flex-col gap-6 p-8 lg:p-10"
            style={{ background: "var(--gradient-cta)" }}
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {section.headingOverride ?? "Get In Touch"}
              </h2>
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
              <div className="flex items-center gap-3">
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />
                <p className="text-sm font-normal text-white/80">hello@kruzeconsulting.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />
                <p className="text-sm font-normal text-white/80">(415) 322-1610</p>
              </div>
            </div>
          </div>

          {/* Right — multistep form */}
          <div className="lg:col-span-3 bg-subtle p-8 lg:p-10">
            {rightContent}
          </div>

        </div>
      </div>
    </section>
  );
}
