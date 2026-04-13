import type { PressLogosBlock } from "@kruze-poc/sanity-schemas/src/types";

interface PressLogosSectionProps {
  section: PressLogosBlock;
}

export function PressLogosSection({ section }: PressLogosSectionProps) {
  return (
    <section className="py-12 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-dim mb-6">pressLogosBlock — {section.variant ?? "press"}</p>
        {section.logos && section.logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {section.logos.map((logo) => (
              <div key={logo._key} className="flex items-center">
                {logo.image?.asset ? (
                  <img
                    src={logo.image.asset.url}
                    alt={logo.name ?? ""}
                    className="h-8 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                ) : (
                  <span className="text-sm text-secondary font-bold">{logo.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
