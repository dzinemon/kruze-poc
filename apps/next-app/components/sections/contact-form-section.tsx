import type { ContactFormBlock } from "@kruze-poc/sanity-schemas/src/types";

interface ContactFormSectionProps {
  section: ContactFormBlock;
}

export function ContactFormSection({ section }: ContactFormSectionProps) {
  const isNewsletter = section.formType === "newsletter";
  const gradientWord = isNewsletter ? "loop" : "consultation";
  const headingStart = isNewsletter ? "Stay in the " : "Get a free ";
  const eyebrow = isNewsletter ? "Newsletter" : "Free Consultation";
  const submitLabel = isNewsletter ? "Subscribe" : "Request Consultation";

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
          <form noValidate className="flex flex-col gap-3">

            {/* First name + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-bold text-primary">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-bold text-primary">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Smith"
                  className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
                />
              </div>
            </div>

            {/* Company name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-sm font-bold text-primary">
                Company name
              </label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Inc."
                className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-primary">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jane@acme.com"
                className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-bold text-primary">
                Phone <span className="font-normal text-dim">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (415) 000-0000"
                className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
              />
            </div>

            {/* Message */}
            {!isNewsletter && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-bold text-primary">
                  Message <span className="font-normal text-dim">(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your startup and what you need help with…"
                  className="w-full px-4 py-[9px] text-sm font-normal leading-5 text-primary bg-base dark:bg-subtle border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast resize-none"
                />
              </div>
            )}

            {/* Marketing emails checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded-xs border-rule accent-brand-500 focus-ring cursor-pointer"
              />
              <span className="text-sm font-normal text-secondary leading-relaxed">
                I agree to receive marketing emails from Kruze Consulting. You can unsubscribe at any time.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-brand transition-fast focus-ring"
            >
              {submitLabel}
            </button>

            {/* Privacy note */}
            <p className="text-xs text-dim text-center">
              By submitting, you agree to our{" "}
              <span className="text-brand-500 underline cursor-pointer">Privacy Policy</span>.
              We never share your data.
            </p>

          </form>
        </div>

      </div>
    </section>
  );
}
