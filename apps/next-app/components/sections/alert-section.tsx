import type { AlertBlock } from "@kruze-poc/sanity-schemas/src/types";

interface AlertSectionProps {
  section: AlertBlock;
}

const alertStyles: Record<string, string> = {
  primary: "bg-brand-50 border-brand-200 text-brand-800",
  warning: "bg-warning-light border-warning/30 text-warning-dark",
  success: "bg-success-light border-success/30 text-success-dark",
  info: "bg-info-light border-info/30 text-info-dark",
};

export function AlertSection({ section }: AlertSectionProps) {
  const type = section.alertType ?? "info";
  const style = alertStyles[type] ?? alertStyles.info;

  return (
    <section className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-sm border p-4 ${style}`}>
          <p className="text-xs text-text-muted mb-2">alertBlock — {type}</p>
          {!section.content && <p className="text-sm">No content</p>}
        </div>
      </div>
    </section>
  );
}
