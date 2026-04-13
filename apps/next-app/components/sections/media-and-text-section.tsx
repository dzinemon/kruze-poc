import type { MediaAndTextBlock } from "@kruze-poc/sanity-schemas/src/types";

interface MediaAndTextSectionProps {
  section: MediaAndTextBlock;
}

export function MediaAndTextSection({ section }: MediaAndTextSectionProps) {
  const isImageLeft = (section.imagePosition ?? "left") === "left";

  return (
    <section className="py-16 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-dim mb-8">mediaAndTextBlock — image {section.imagePosition ?? "left"}</p>
        <div className={`flex flex-col lg:flex-row gap-12 items-center ${isImageLeft ? "" : "lg:flex-row-reverse"}`}>
          {section.image?.asset && (
            <div className="flex-1">
              <img
                src={section.image.asset.url}
                alt={section.image.alt ?? ""}
                className="rounded-md w-full object-cover"
              />
              {section.caption && (
                <p className="text-sm text-dim mt-2">{section.caption}</p>
              )}
            </div>
          )}
          <div className="flex-1">
            {!section.image?.asset && (
              <div className="rounded-md bg-subtle border border-divider h-48 flex items-center justify-center text-dim">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
