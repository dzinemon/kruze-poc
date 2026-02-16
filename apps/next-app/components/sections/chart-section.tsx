"use client";

import type { ChartSection as ChartSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { DemoChart } from "@kruze-poc/ui/chart/demo-chart";

interface ChartSectionProps {
  section: ChartSectionType;
}

const bgClasses: Record<string, string> = {
  white: "bg-white",
  light: "bg-gray-50",
};

export function ChartSection({ section }: ChartSectionProps) {
  const bg = bgClasses[section.background || "white"];

  return (
    <section className={`py-16 ${bg}`}>
      <div className="max-w-container-lg mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl font-black text-body mb-4">
            {section.heading}
          </h2>
        )}

        {section.description && (
          <p className="text-secondary mb-8">{section.description}</p>
        )}

        {section.chart && (
          <DemoChart
            chartType={section.chart.chartType}
            title={section.chart.title}
            labels={section.chart.labels || []}
            datasets={(section.chart.datasets || []).map((ds) => ({
              label: ds.label,
              values: ds.values,
            }))}
            showLegend={section.chart.showLegend}
            sourceText={section.chart.sourceText}
          />
        )}
      </div>
    </section>
  );
}
