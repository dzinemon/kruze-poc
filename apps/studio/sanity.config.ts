import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { richTablePlugin } from "sanity-plugin-rich-table";
import { RocketIcon } from "@sanity/icons";
import { schemaTypes } from "./schemas";
import { resolve } from "./presentation/resolve";
import { DeployWidget } from "./plugins/deployWidget/DeployWidget";

export default defineConfig({
  name: "kruze-poc",
  title: "Kruze POC",

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        initial: import.meta.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
    richTablePlugin(),
  ],

  schema: {
    types: schemaTypes,
  },

  tools: (prev) => [
    ...prev,
    {
      name: "deploy",
      title: "Deploy",
      icon: RocketIcon,
      component: DeployWidget,
    },
  ],
});
