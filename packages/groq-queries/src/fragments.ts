/**
 * Reusable GROQ projection fragments for Sanity image fields.
 * Includes hotspot/crop for @sanity/image-url and metadata for dimensions/LQIP.
 */

/** Full image projection with hotspot, crop, and metadata */
export const imageWithMeta = `{
  asset-> { _id, url, metadata { dimensions, lqip } },
  hotspot,
  crop,
  alt,
  caption
}`;

/** Minimal image projection (URL only, for list views and backgrounds) */
export const imageMinimal = `{
  asset-> { _id, url },
  hotspot,
  crop
}`;

/** Author image projection (small avatar, no caption) */
export const authorImage = `{
  asset-> { _id, url },
  hotspot,
  crop
}`;
