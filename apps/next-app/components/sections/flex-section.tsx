import type { FlexSectionBlock } from "@kruze-poc/sanity-schemas/src/types";

interface FlexSectionProps {
  section: FlexSectionBlock;
}

export function FlexSection({ section }: FlexSectionProps) {
  return (
    <section className="py-16 px-6 bg-bg-base">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-md border border-dashed border-border-default p-8">
          <p className="text-xs text-text-muted mb-4">flexSectionBlock — escape hatch</p>
          {section.backgroundStyle && (
            <p className="text-sm text-text-secondary">Background: <code>{section.backgroundStyle}</code></p>
          )}
          {section.rows && section.rows.length > 0 && (
            <p className="text-sm text-text-secondary mt-1">
              {section.rows.length} row{section.rows.length !== 1 ? "s" : ""}
              {" · "}
              {section.rows.reduce((acc, row) => acc + (row.columns?.length ?? 0), 0)} columns total
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
