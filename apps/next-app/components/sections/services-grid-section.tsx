import type { ServicesGridBlock } from "@kruze-poc/sanity-schemas/src/types";

interface ServicesGridSectionProps {
  section: ServicesGridBlock;
}

export function ServicesGridSection({ section }: ServicesGridSectionProps) {
  const cols = section.columns ?? 3;
  const gridClass = cols === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 px-6 bg-bg-subtle">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-text-muted mb-8">servicesGridBlock</p>
        {section.tiles && section.tiles.length > 0 && (
          <div className={`grid ${gridClass} gap-6`}>
            {section.tiles.map((tile) => (
              <div key={tile._key} className="rounded-md bg-bg-base border border-border-subtle p-6">
                <p className="text-xl font-bold text-text-primary">{tile.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
