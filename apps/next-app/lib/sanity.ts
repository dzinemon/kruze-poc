import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { defineLive } from "next-sanity/live";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
  stega: {
    studioUrl: "http://localhost:3333",
  },
});

export const imageBuilder = createImageUrlBuilder(client);

const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
