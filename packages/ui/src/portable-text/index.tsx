import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ChartBlockClient } from "../chart/chart-block-client";
import { CtaBlock } from "./cta-block";
import { AlertBlock } from "./alert-block";
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
        <ChartBlockClient
          chartType={value.chartType}
          title={value.title}
          labels={value.labels || []}
          datasets={(
            value.datasets || []
          ).map((ds: { label: string; values: number[] }) => ({
            label: ds.label,
            values: ds.values,
          }))}
          colorScheme={value.colorScheme}
          showLegend={value.showLegend}
          height={value.height || 400}
          sourceText={value.sourceText}
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
      <div className="my-8 aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${value.videoId}`}
          title={value.caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
          loading="lazy"
        />
      </div>
    ),
  },
};

interface KruzePortableTextProps {
  value: PortableTextBlock[];
}

export function KruzePortableText({ value }: KruzePortableTextProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-base prose-p:font-normal prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-4 prose-headings:mt-6 prose-headings:mb-3 prose-strong:text-text-primary prose-em:text-text-primary prose-code:text-brand-600 prose-code:bg-bg-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-blockquote:border-brand-500 prose-blockquote:text-text-secondary prose-blockquote:pl-4 prose-ul:text-text-secondary prose-ol:text-text-secondary prose-li:leading-relaxed prose-li:mb-2">
      <PortableText value={value} components={components} />
    </div>
  );
}
