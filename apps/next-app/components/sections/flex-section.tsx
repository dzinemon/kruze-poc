import type { FlexSectionBlock } from "@kruze-poc/sanity-schemas/src/types";
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

interface FlexSectionProps {
  section: FlexSectionBlock;
}

export function FlexSection({ section }: FlexSectionProps) {
  const sectionClass = [
    section.paddingStyle ?? "py-20 px-6",
    section.backgroundStyle ?? "bg-bg-base",
  ].join(" ");

  return (
    <section className={sectionClass}>
      <div className="max-w-6xl mx-auto">
        {(section.rows ?? []).map((row) => (
          <div
            key={row._key}
            className={["flex flex-col md:flex-row gap-8", row.paddingStyle]
              .filter(Boolean)
              .join(" ")}
          >
            {(row.columns ?? []).map((col) => (
              <div key={col._key} className={[col.columnWidth ?? "flex-1", "min-w-0"].join(" ")}>
                {col.content && col.content.length > 0 && (
                  <KruzePortableText value={col.content} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
