import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

declare const __SANITY_PROJECT_ID__: string;
declare const __SANITY_DATASET__: string;

export const sanityClient = createClient({
  projectId: __SANITY_PROJECT_ID__,
  dataset: __SANITY_DATASET__,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const imageBuilder = createImageUrlBuilder(sanityClient);
