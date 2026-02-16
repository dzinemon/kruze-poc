import type { TextSection as TextSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

interface TextSectionProps {
  section: TextSectionType;
}

const bgClasses: Record<string, string> = {
  white: "bg-white",
  light: "bg-gray-50",
  gradient: "bg-gradient-to-b from-gray-50 to-white",
};

export function TextSection({ section }: TextSectionProps) {
  const bg = bgClasses[section.background || "white"];

  return (
    <section className={`py-16 ${bg}`}>
      <div className="max-w-container-lg mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl font-black text-body mb-8">
            {section.heading}
          </h2>
        )}

        {section.body && <KruzePortableText value={section.body} />}
      </div>
    </section>
  );
}
