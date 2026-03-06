import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { GoogleChart } from "../chart";
import { CtaBlock } from "./cta-block";
import { AlertBlock } from "./alert-block";
import { YouTubeFacade } from "./youtube-facade";
import { responsiveImageData, lqipStyle } from "../image/sanity-image-url";

const components: PortableTextComponents = {
  types: {
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
              <figcaption className="mt-2 text-sm text-muted text-center">
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
            <figcaption className="mt-2 text-sm text-muted text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    chartBlock: ({ value }) => (
      <div className="my-8 not-prose">
        <GoogleChart
          jsonConfig={value.jsonConfig}
          title={value.title}
          aspectRatio={value.aspectRatio ?? "4/3"}
        />
      </div>
    ),

    ctaBlock: ({ value }) => (
      <div className="not-prose">
        <CtaBlock {...value} />
      </div>
    ),

    alertBlock: ({ value }) => (
      <div className="not-prose">
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
        <div className="my-8 not-prose">
          <div className="kruze-table">
            <table className="text-sm">
              {headerRow && (
                <thead>
                  <tr>
                    {hasRowTitles && <th className="px-4 py-3 bg-neutral-100 dark:bg-bg-emphasis" />}
                    {(headerRow.cells || []).map((cell: any) => (
                      <th
                        key={cell._key}
                        className="px-4 py-3 text-left font-bold bg-neutral-100 dark:bg-bg-emphasis text-primary"
                      >
                        <CellContent content={cell.content} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row: any) => (
                  <tr key={row._key} className="bg-white dark:bg-bg-subtle">
                    {hasRowTitles && (
                      <th className="px-4 py-3 text-left font-normal text-primary whitespace-nowrap">
                        {row.title || ""}
                      </th>
                    )}
                    {(row.cells || []).map((cell: any) => (
                      <td
                        key={cell._key}
                        className="px-4 py-3 text-primary"
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
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-primary prose-p:text-base prose-p:font-normal prose-p:text-secondary prose-p:leading-relaxed prose-p:mb-4 prose-headings:mt-6 prose-headings:mb-3 prose-strong:text-primary prose-em:text-primary prose-code:text-brand-600 prose-code:bg-bg-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-blockquote:border-brand-500 prose-blockquote:text-secondary prose-blockquote:pl-4 prose-ul:text-secondary prose-ol:text-secondary prose-li:leading-relaxed prose-li:mb-2">
      <PortableText value={value} components={components} />
    </div>
  );
}
