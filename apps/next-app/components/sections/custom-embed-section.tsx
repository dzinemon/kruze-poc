import type { CustomEmbedBlock } from "@kruze-poc/sanity-schemas/src/types";

interface CustomEmbedSectionProps {
  section: CustomEmbedBlock;
}

export function CustomEmbedSection({ section }: CustomEmbedSectionProps) {
  return (
    <section className="py-16 px-6 bg-base">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-md border border-dashed border-rule p-8 text-center">
          <p className="text-xs text-dim mb-2">customEmbedBlock</p>
          <p className="text-base font-bold text-primary">
            Custom Embed: <code className="font-normal">{section.embedId}</code>
          </p>
        </div>
      </div>
    </section>
  );
}
