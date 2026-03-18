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

    // Custom block: Chart (Google Charts with JSON config)
    defineArrayMember({
      name: "chartBlock",
      title: "Chart",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Chart Title (optional)",
          type: "string",
          description: "Display title above the chart",
        }),
        defineField({
          name: "aspectRatio",
          title: "Aspect Ratio",
          type: "string",
          description: "e.g., 4/3 (default), 16/9, 1/1",
          initialValue: "4/3",
        }),
        defineField({
          name: "jsonConfig",
          title: "Chart JSON Config",
          type: "text",
          description: 'Paste JSON: { "type": "ColumnChart", "data": [["Year", "Sales"], ["2024", 1000]], "options": {...} }',
          validation: (rule) =>
            rule.required().custom((val) => {
              if (!val) return "JSON config is required";
              try {
                JSON.parse(val);
                return true;
              } catch (e) {
                return "Must be valid JSON";
              }
            }),
        }),
      ],
      preview: {
        select: { title: "title" },
        prepare({ title }) {
          return {
            title: title || "Chart",
            subtitle: "Google Chart (JSON config)",
          };
        },
      },
    }),

    // Custom block: CTA (uses shared ctaItem type)
    defineArrayMember({ type: "ctaItem" }),

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

    // Table block (using sanity-plugin-rich-table)
    defineArrayMember({
      type: "richTableBlock",
    }),

    // Horizontal rule
    defineArrayMember({
      name: "hr",
      title: "Horizontal Rule",
      type: "object",
      fields: [
        defineField({
          name: "style",
          title: "Style",
          type: "string",
          initialValue: "default",
          hidden: true,
        }),
      ],
      preview: {
        prepare() {
          return { title: "———", subtitle: "Horizontal Rule" };
        },
      },
    }),
  ],
});
