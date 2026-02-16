import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

function getEnv(key: string): string {
  const env = process.env;
  const value = env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const sanityClient = createClient({
  projectId: getEnv("SANITY_PROJECT_ID"),
  dataset: getEnv("SANITY_DATASET"),
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const imageBuilder = createImageUrlBuilder(sanityClient);
