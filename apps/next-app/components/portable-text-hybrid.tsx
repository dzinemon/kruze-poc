import { renderPortableTextHtml } from "@kruze-poc/ui/portable-text/to-html";
import { GoogleChart, buildChartJsonConfig } from "@kruze-poc/ui/chart";
import { stegaClean } from "@sanity/client/stega";
import YouTubeIsland from "./react/youtube-island";

interface PortableTextHybridProps {
  value: unknown[];
}

interface ChartBlock {
  _type: "chartBlock";
  title?: string;
  aspectRatio?: string;
  jsonConfig: string;
}

interface YouTubeBlock {
  _type: "youtubeBlock";
  videoId: string;
  caption?: string;
}

type Segment =
  | { type: "html"; content: string }
  | { type: "chart"; content: ChartBlock }
  | { type: "youtube"; content: YouTubeBlock };


/**
 * Hybrid Portable Text renderer for Next.js
 *
 * Renders text content as static HTML (SEO-friendly) and only hydrates
 * interactive components like charts and YouTube videos as React client components.
 * This approach matches Astro's hybrid rendering strategy.
 */
export function PortableTextHybrid({ value }: PortableTextHybridProps) {
  // Group consecutive non-interactive blocks together for better HTML rendering
  const segments: Segment[] = [];
  let currentHtmlBlocks: unknown[] = [];

  value.forEach((block: unknown) => {
    const typedBlock = block as { _type?: string };
    if (typedBlock._type === "chartReference") {
      // Flush any accumulated HTML blocks
      if (currentHtmlBlocks.length > 0) {
        segments.push({
          type: "html",
          content: renderPortableTextHtml(currentHtmlBlocks),
        });
        currentHtmlBlocks = [];
      }
      // Normalize chartReference to the same shape as chartBlock
      if (typedBlock._type === "chartReference") {
        const ref = block as { chart?: Record<string, unknown> };
        // Guard: in presentation/live mode, the reference may not be resolved yet
        if (ref.chart && ref.chart._id && ref.chart.chartType) {
          const jsonConfig = buildChartJsonConfig(stegaClean(ref.chart) as any);
          segments.push({
            type: "chart",
            content: {
              _type: "chartBlock" as const,
              jsonConfig,
              title: ref.chart.title as string | undefined,
              aspectRatio: (ref.chart.aspectRatio as string) ?? "4/3",
            },
          });
        }
        // If chart ref isn't resolved, skip silently — it will re-render when data arrives
      } else {
        segments.push({ type: "chart", content: block as ChartBlock });
      }
    } else if (typedBlock._type === "youtubeBlock") {
      // Flush any accumulated HTML blocks
      if (currentHtmlBlocks.length > 0) {
        segments.push({
          type: "html",
          content: renderPortableTextHtml(currentHtmlBlocks),
        });
        currentHtmlBlocks = [];
      }
      // Add youtube segment
      segments.push({ type: "youtube", content: block as YouTubeBlock });
    } else {
      // Accumulate non-interactive blocks
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
    <div className="article-content">
      {segments.map((segment, index) => {
        if (segment.type === "html") {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          );
        } else if (segment.type === "chart") {
          return (
            <div key={index} className="my-8">
              <GoogleChart
                jsonConfig={segment.content.jsonConfig}
                title={segment.content.title}
                aspectRatio={segment.content.aspectRatio ?? "4/3"}
              />
            </div>
          );
        } else if (segment.type === "youtube") {
          return (
            <div key={index} className="">
              <YouTubeIsland
                videoId={segment.content.videoId}
                caption={segment.content.caption}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
