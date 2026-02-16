import type { HeroSection as HeroSectionType } from "@kruze-poc/sanity-schemas/src/types";

interface HeroSectionProps {
  section: HeroSectionType;
}

export function HeroSection({ section }: HeroSectionProps) {
  const hasBg = section.backgroundImage?.asset?.url;

  return (
    <section
      className="relative py-24 md:py-32"
      style={
        hasBg
          ? {
              backgroundImage: `url(${section.backgroundImage!.asset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {hasBg && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      <div
        className={`relative max-w-container-lg mx-auto px-4 text-center ${
          hasBg ? "text-white" : ""
        }`}
      >
        {section.headline && (
          <h1
            className={`text-4xl md:text-5xl font-black mb-4 ${
              hasBg ? "text-white" : "text-body"
            }`}
          >
            {section.headline}
          </h1>
        )}

        {section.subheadline && (
          <p
            className={`text-xl mb-8 ${
              hasBg ? "text-gray-200" : "text-secondary"
            }`}
          >
            {section.subheadline}
          </p>
        )}

        {section.ctaText && section.ctaUrl && (
          <a
            href={section.ctaUrl}
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-btn hover:bg-primary-dark transition-colors"
          >
            {section.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
