import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
});

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const DEFAULT_WIDTHS = [400, 800, 1200, 1600];

export interface SanityImageInput {
  asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
}

export interface ResponsiveImageData {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
}

export interface FixedImageData {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Generate a single optimized URL for a Sanity image.
 */
export function sanityImageUrl(
  image: SanityImageInput,
  options: { width?: number; height?: number; quality?: number } = {},
): string {
  let b = urlFor(image).auto("format");
  if (options.width) b = b.width(options.width);
  if (options.height) b = b.height(options.height);
  if (options.quality) b = b.quality(options.quality);
  return b.url();
}

/**
 * Generate responsive image data with srcset for multiple widths.
 * Uses auto=format for WebP when browser supports it.
 */
export function responsiveImageData(
  image: SanityImageInput,
  options: { widths?: number[]; quality?: number } = {},
): ResponsiveImageData {
  const widths = options.widths ?? DEFAULT_WIDTHS;
  const quality = options.quality ?? 80;
  const dims = image.asset.metadata?.dimensions;
  const aspectRatio = dims ? dims.height / dims.width : undefined;

  const srcset = widths
    .map((w) => {
      const url = urlFor(image).width(w).quality(quality).auto("format").url();
      return `${url} ${w}w`;
    })
    .join(", ");

  // Use largest width as the default src
  const largestWidth = widths[widths.length - 1];
  const src = urlFor(image).width(largestWidth).quality(quality).auto("format").url();

  return {
    src,
    srcset,
    width: dims?.width ?? largestWidth,
    height: dims && aspectRatio ? Math.round(largestWidth * aspectRatio) : (dims?.height ?? 0),
    alt: image.alt ?? "",
    lqip: image.asset.metadata?.lqip,
  };
}

/**
 * Generate fixed-size image data with 1x and 2x for retina displays.
 */
export function fixedImageData(
  image: SanityImageInput,
  options: { width: number; height: number; quality?: number },
): FixedImageData {
  const quality = options.quality ?? 80;
  const { width, height } = options;

  const src1x = urlFor(image).width(width).height(height).fit("crop").auto("format").quality(quality).url();
  const src2x = urlFor(image).width(width * 2).height(height * 2).fit("crop").auto("format").quality(quality).url();

  return {
    src: src1x,
    srcset: `${src1x} 1x, ${src2x} 2x`,
    width,
    height,
    alt: image.alt ?? "",
  };
}

/**
 * Generate a single optimized URL for CSS background usage.
 */
export function backgroundImageUrl(
  image: SanityImageInput,
  options: { width?: number; quality?: number } = {},
): string {
  const width = options.width ?? 1600;
  const quality = options.quality ?? 80;
  return urlFor(image).width(width).quality(quality).auto("format").url();
}

/**
 * Generate inline CSS style for LQIP blur placeholder.
 */
export function lqipStyle(lqip?: string): Record<string, string> | undefined {
  if (!lqip) return undefined;
  return {
    backgroundImage: `url(${lqip})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
