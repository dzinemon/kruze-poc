import type { ServicesGridBlock } from "@kruze-poc/sanity-schemas/src/types";
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

const colsClass: Record<number, string> = {
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

interface ServicesGridSectionProps {
  section: ServicesGridBlock;
}

export function ServicesGridSection({ section }: ServicesGridSectionProps) {
  const cols = section.columns ?? 3;

  return (
    <section className="bg-subtle py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {section.content && section.content.length > 0 && (
          <div className="text-center mb-12 flex flex-col gap-3">
            {section.content
              .filter((b: any) => b._type === "block")
              .map((b: any) => {
                const text = (b.children ?? []).map((c: any) => c.text ?? "").join("");
                if (b.style === "h2") {
                  return (
                    <h2 key={b._key} className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
                      {text}
                    </h2>
                  );
                }
                return (
                  <p key={b._key} className="text-lg font-normal text-secondary leading-relaxed max-w-2xl mx-auto">
                    {text}
                  </p>
                );
              })}
          </div>
        )}
        {section.tiles && section.tiles.length > 0 && (
          <div className={`grid ${colsClass[cols] ?? colsClass[3]} gap-6`}>
            {section.tiles.map((tile) => (
              <div
                key={tile._key}
                className="flex flex-col gap-4 p-6 rounded-md bg-base border border-divider shadow-sm hover:shadow-md hover-lift"
              >
                {tile.icon?.asset?.url && (
                  <div
                    className="icon-container icon-container-xl squircle flex-shrink-0"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <img
                      src={tile.icon.asset.url}
                      alt=""
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-primary">{tile.title}</h3>
                  {Array.isArray(tile.body) && tile.body.length > 0 && (
                    <div className="section-content">
                      <KruzePortableText value={tile.body} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
