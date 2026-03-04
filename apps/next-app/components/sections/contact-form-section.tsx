import type { ContactFormBlock } from "@kruze-poc/sanity-schemas/src/types";

interface ContactFormSectionProps {
  section: ContactFormBlock;
}

export function ContactFormSection({ section }: ContactFormSectionProps) {
  const label = section.formType === "newsletter" ? "Newsletter Signup" : "Free Consultation Form";

  return (
    <section className="py-16 px-6 bg-bg-base">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs text-text-muted mb-4">contactFormBlock — {section.formType ?? "consultation"}</p>
        <div className="rounded-md border border-border-default p-8 bg-bg-subtle">
          <p className="text-xl font-bold text-text-primary">{label}</p>
          <p className="text-sm text-text-muted mt-2">Form embed: <code>{section.formType ?? "consultation"}</code></p>
        </div>
      </div>
    </section>
  );
}
