import { defineType, defineField, defineArrayMember } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Rich Text",
  type: "array",
  of: [
    // Standard rich text block
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({
                name: "blank",
                title: "Open in new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    // Image block
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),

    // Custom block: Chart
    defineArrayMember({
      name: "chartBlock",
      title: "Chart",
      type: "object",
      fields: [
        defineField({
          name: "chartType",
          title: "Chart Type",
          type: "string",
          options: {
            list: [
              { title: "Bar Chart", value: "bar" },
              { title: "Pie Chart", value: "pie" },
              { title: "Line Chart", value: "line" },
              { title: "Doughnut Chart", value: "doughnut" },
            ],
          },
          initialValue: "bar",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Chart Title",
          type: "string",
        }),
        defineField({
          name: "height",
          title: "Height (px)",
          type: "number",
          initialValue: 400,
        }),
        defineField({
          name: "colorScheme",
          title: "Color Scheme",
          type: "string",
          options: {
            list: [
              { title: "Brand (Blue)", value: "brand" },
              { title: "Warm", value: "warm" },
              { title: "Cool", value: "cool" },
              { title: "Monochrome", value: "mono" },
            ],
          },
          initialValue: "brand",
        }),
        defineField({
          name: "labels",
          title: "Labels",
          type: "array",
          of: [{ type: "string" }],
          description: "X-axis labels or slice labels",
        }),
        defineField({
          name: "datasets",
          title: "Datasets",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "dataset",
              fields: [
                defineField({ name: "label", title: "Dataset Label", type: "string" }),
                defineField({
                  name: "values",
                  title: "Values",
                  type: "array",
                  of: [{ type: "number" }],
                }),
              ],
              preview: {
                select: { title: "label" },
              },
            }),
          ],
        }),
        defineField({
          name: "showLegend",
          title: "Show Legend",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "sourceText",
          title: "Source / Citation",
          type: "string",
          description: "e.g. 'Source: Kruze Consulting analysis, 2025'",
        }),
      ],
      preview: {
        select: { title: "title", chartType: "chartType" },
        prepare({ title, chartType }) {
          return {
            title: title || "Chart",
            subtitle: chartType ? `${chartType} chart` : "Chart",
          };
        },
      },
    }),

    // Custom block: CTA
    defineArrayMember({
      name: "ctaBlock",
      title: "Call to Action",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "url",
          title: "URL",
          type: "string",
        }),
        defineField({
          name: "style",
          title: "Style",
          type: "string",
          options: {
            list: [
              { title: "Primary", value: "primary" },
              { title: "Secondary", value: "secondary" },
              { title: "Outline", value: "outline" },
            ],
          },
          initialValue: "primary",
        }),
      ],
      preview: {
        select: { title: "text" },
        prepare({ title }) {
          return { title: title || "CTA", subtitle: "Call to Action" };
        },
      },
    }),

    // Custom block: Alert / Callout
    defineArrayMember({
      name: "alertBlock",
      title: "Alert / Callout",
      type: "object",
      fields: [
        defineField({
          name: "alertType",
          title: "Type",
          type: "string",
          options: {
            list: [
              { title: "Info (Blue)", value: "info" },
              { title: "Warning (Yellow)", value: "warning" },
              { title: "Success (Green)", value: "success" },
              { title: "Danger (Red)", value: "danger" },
            ],
          },
          initialValue: "info",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "text",
        }),
      ],
      preview: {
        select: { title: "content", alertType: "alertType" },
        prepare({ title, alertType }) {
          return {
            title: (title || "").slice(0, 80),
            subtitle: `Alert: ${alertType}`,
          };
        },
      },
    }),

    // Custom block: YouTube Embed
    defineArrayMember({
      name: "youtubeBlock",
      title: "YouTube Video",
      type: "object",
      fields: [
        defineField({
          name: "videoId",
          title: "YouTube Video ID",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
      preview: {
        select: { title: "videoId" },
        prepare({ title }) {
          return { title: `YouTube: ${title}`, subtitle: "Video embed" };
        },
      },
    }),
  ],
});
