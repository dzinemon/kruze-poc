import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./schemas";
import { resolve } from "./presentation/resolve";

export default defineConfig({
  name: "kruze-poc",
  title: "Kruze POC",

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        initial: "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
