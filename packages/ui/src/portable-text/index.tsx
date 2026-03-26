import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { GoogleChart, buildChartJsonConfig } from "../chart";
import { CtaSectionBlock } from "./cta-section-block";
import { AlertBlock } from "./alert-block";
import { YouTubeFacade } from "./youtube-facade";
import { responsiveImageData, lqipStyle } from "../image/sanity-image-url";

const components: PortableTextComponents = {
  block: {
    hr: () => <hr className="my-4 border-t border-rule" />,
  },
  types: {
    hr: () => (
      <hr className="my-8 border-t border-rule" />
    ),
    image: ({ value }) => {
      if (value.asset?._id) {
        const img = responsiveImageData(value);
        const blurStyle = lqipStyle(img.lqip);
        return (
          <figure className="my-8">
            <img
              src={img.src}
              srcSet={img.srcset}
              sizes="(max-width: 768px) 100vw, 800px"
              width={img.width}
              height={img.height}
              alt={value.alt || ""}
              className="rounded-md w-full"
              loading="lazy"
              decoding="async"
              style={blurStyle}
            />
            {value.caption && (
              <figcaption className="mt-2 text-sm text-dim text-center">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      }
      return (
        <figure className="my-8">
          <img
            src={value.asset.url}
            alt={value.alt || ""}
            className="rounded-md w-full"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-dim text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    chartReference: ({ value }) => {
      if (!value.chart) return null;
      const jsonConfig = buildChartJsonConfig(value.chart);
      return (
        <div className="pt-block my-8">
          <GoogleChart
            jsonConfig={jsonConfig}
            title={value.chart.title}
            aspectRatio={value.chart.aspectRatio ?? "4/3"}
          />
        </div>
      );
    },

    ctaSectionBlock: ({ value }) => (
      <CtaSectionBlock
        variant={value.variant}
        text={value.text}
        ctas={value.ctas}
      />
    ),

    alertBlock: ({ value }) => (
      <div className="pt-block">
        <AlertBlock type={value.alertType} content={value.content} />
      </div>
    ),

    youtubeBlock: ({ value }) => (
      <YouTubeFacade videoId={value.videoId} caption={value.caption} />
    ),

    richTableBlock: ({ value }) => {
      const hasColTitles = value.hasColumnTitles !== false;

      const CellContent = ({ content }: { content: any[] }) => (
        <PortableText value={content || []} components={components} />
      );

      const bodyRows = hasColTitles ? value.rows?.slice(1) ?? [] : value.rows ?? [];
      const headerRow = hasColTitles ? value.rows?.[0] : null;
      const hasRowTitles = value.hasRowTitles !== false && bodyRows.some((row: any) => row.title);

      return (
        <div className="pt-block my-8">
          <div className="kruze-table">
            <table className="text-sm">
              {headerRow && (
                <thead>
                  <tr>
                    {hasRowTitles && <th className="px-4 py-3 bg-neutral-100 dark:bg-emphasis" />}
                    {(headerRow.cells || []).map((cell: any) => (
                      <th
                        key={cell._key}
                        className="px-4 py-3 text-left font-bold bg-neutral-100 dark:bg-emphasis text-primary"
                      >
                        <CellContent content={cell.content} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row: any) => (
                  <tr key={row._key} className="bg-white dark:bg-subtle">
                    {hasRowTitles && (
                      <th className="px-4 py-3 text-left font-normal text-primary whitespace-nowrap">
                        {row.title || ""}
                      </th>
                    )}
                    {(row.cells || []).map((cell: any) => (
                      <td
                        key={cell._key}
                        className="px-4 py-2 text-primary"
                      >
                        <CellContent content={cell.content} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },

    advancedTableBlock: ({ value }) => {
      if (!value.rows || value.rows.length === 0) return <div className="pt-block my-8" />;

      const headerRow = value.hasHeaderRow ? value.rows[0] : null;
      const bodyRows = value.hasHeaderRow ? value.rows.slice(1) : value.rows;

      const CellContent = ({ content }: { content: any[] }) => (
        <PortableText value={content || []} components={components} />
      );

      return (
        <div className="pt-block my-8">
          <div className="kruze-table">
            <table className="text-sm">
              {headerRow && (
                <thead>
                  <tr>
                    {(headerRow.cells || []).map((cell: any) => (
                      <th
                        key={cell._key}
                        colSpan={cell.colspan > 1 ? cell.colspan : undefined}
                        rowSpan={cell.rowspan > 1 ? cell.rowspan : undefined}
                        className="px-4 py-3 text-left font-bold bg-neutral-100 dark:bg-emphasis text-primary"
                      >
                        <CellContent content={cell.content} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row: any) => (
                  <tr key={row._key} className="bg-white dark:bg-subtle">
                    {(row.cells || []).map((cell: any) => (
                      <td
                        key={cell._key}
                        colSpan={cell.colspan > 1 ? cell.colspan : undefined}
                        rowSpan={cell.rowspan > 1 ? cell.rowspan : undefined}
                        className="px-4 py-2 text-primary"
                      >
                        <CellContent content={cell.content} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
  },
};

interface KruzePortableTextProps {
  value: PortableTextBlock[];
}

export function KruzePortableText({ value }: KruzePortableTextProps) {
  return (
    <div className="article-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
