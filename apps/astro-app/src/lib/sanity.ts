import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const isStaging = process.env.SANITY_IS_STAGING === "true";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: !isStaging,
  perspective: isStaging ? "drafts" : "published",
  ...(isStaging && { token: process.env.SANITY_API_READ_TOKEN }),
});

export const imageBuilder = createImageUrlBuilder(sanityClient);
