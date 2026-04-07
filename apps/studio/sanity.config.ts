import { defineConfig } from "sanity";
import { assist } from '@sanity/assist'
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { RocketIcon, EarthGlobeIcon } from "@sanity/icons";
import { schemaTypes } from "./schemas";
import { resolve } from "./presentation/resolve";
import { DeployWidget } from "./plugins/deployWidget/DeployWidget";
import { ChartPreview } from "./components/ChartPreview";

export default defineConfig({
  name: "kruze-poc",
  title: "Kruze POC",

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Global")
              .icon(EarthGlobeIcon)
              .child(
                S.list()
                  .title("Global Settings")
                  .items([
                    S.listItem()
                      .title("Navigation")
                      .schemaType("siteNavigation")
                      .child(
                        S.document()
                          .documentId("siteNavigation")
                          .schemaType("siteNavigation")
                          .title("Navigation"),
                      ),
                    S.listItem()
                      .title("Footer")
                      .schemaType("siteFooter")
                      .child(
                        S.document()
                          .documentId("siteFooter")
                          .schemaType("siteFooter")
                          .title("Footer"),
                      ),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title("Charts")
              .schemaType("chart")
              .child(
                S.documentTypeList("chart").child((documentId) =>
                  S.document()
                    .documentId(documentId)
                    .schemaType("chart")
                    .views([
                      S.view.form(),
                      S.view.component(ChartPreview).title("Preview"),
                    ]),
                ),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                item.getId() !== "chart" &&
                item.getId() !== "siteNavigation" &&
                item.getId() !== "siteFooter",
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial: import.meta.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      allowOrigins: [
        "https://kruze-poc-next-app.vercel.app",
        "https://kruze-poc-next-app-git-dev-andriishas-projects.vercel.app",
        "http://localhost:3000",
      ],
      resolve,
    }),
    assist()
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
