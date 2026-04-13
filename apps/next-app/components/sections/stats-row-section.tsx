import type { StatsRowBlock } from "@kruze-poc/sanity-schemas/src/types";

interface StatsRowSectionProps {
  section: StatsRowBlock;
}

export function StatsRowSection({ section }: StatsRowSectionProps) {
  const layoutMap: Record<string, string> = {
    "2-col": "grid-cols-2",
    "3-col": "grid-cols-1 sm:grid-cols-3",
    "4-col": "grid-cols-2 lg:grid-cols-4",
  };
  const gridClass = layoutMap[section.layout ?? "3-col"] ?? "grid-cols-1 sm:grid-cols-3";

  return (
    <section className="py-16 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-dim mb-8">statsRowBlock — {section.layout ?? "3-col"}</p>
        {section.stats && section.stats.length > 0 && (
          <div className={`grid ${gridClass} gap-8 text-center`}>
            {section.stats.map((stat) => (
              <div key={stat._key}>
                <p className="text-5xl font-black text-gradient-brand">{stat.value}</p>
                <p className="text-base font-bold text-primary mt-1">{stat.label}</p>
                {stat.footnote && (
                  <p className="text-sm text-dim mt-1">{stat.footnote}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
