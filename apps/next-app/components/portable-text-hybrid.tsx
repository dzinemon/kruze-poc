import { renderPortableTextHtml } from "@kruze-poc/ui/portable-text/to-html";
import { DemoChart } from "@kruze-poc/ui/chart/demo-chart";

interface PortableTextHybridProps {
  value: unknown[];
}

interface ChartDataset {
  label: string;
  values: number[];
}

interface ChartBlock {
  _type: "chartBlock";
  chartType: "bar" | "pie" | "line" | "doughnut";
  title?: string;
  labels?: string[];
  datasets?: ChartDataset[];
  colorScheme?: "brand" | "warm" | "cool" | "mono";
  showLegend?: boolean;
  height?: number;
  sourceText?: string;
}

type Segment =
  | { type: "html"; content: string }
  | { type: "chart"; content: ChartBlock };

/**
 * Hybrid Portable Text renderer for Next.js
 *
 * Renders text content as static HTML (SEO-friendly) and only hydrates
 * interactive components like charts as React client components.
 * This approach matches Astro's hybrid rendering strategy.
 */
export function PortableTextHybrid({ value }: PortableTextHybridProps) {
  // Group consecutive non-chart blocks together for better HTML rendering
  const segments: Segment[] = [];
  let currentHtmlBlocks: unknown[] = [];

  value.forEach((block: unknown) => {
    const typedBlock = block as { _type?: string };
    if (typedBlock._type === "chartBlock") {
      // Flush any accumulated HTML blocks
      if (currentHtmlBlocks.length > 0) {
        segments.push({
          type: "html",
          content: renderPortableTextHtml(currentHtmlBlocks),
        });
        currentHtmlBlocks = [];
      }
      // Add chart segment
      segments.push({ type: "chart", content: block as ChartBlock });
    } else {
      // Accumulate non-chart blocks
      currentHtmlBlocks.push(block);
    }
  });

  // Flush any remaining HTML blocks
  if (currentHtmlBlocks.length > 0) {
    segments.push({
      type: "html",
      content: renderPortableTextHtml(currentHtmlBlocks),
    });
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-body prose-a:text-primary hover:prose-a:text-primary-dark prose-blockquote:border-info">
      {segments.map((segment, index) => {
        if (segment.type === "html") {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          );
        } else {
          return (
            <div key={index} className="my-8 not-prose">
              <DemoChart
                chartType={segment.content.chartType}
                title={segment.content.title}
                labels={segment.content.labels || []}
                datasets={(segment.content.datasets || []).map((ds) => ({
                  label: ds.label,
                  values: ds.values,
                }))}
                colorScheme={segment.content.colorScheme}
                showLegend={segment.content.showLegend}
                height={segment.content.height || 400}
                sourceText={segment.content.sourceText}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
