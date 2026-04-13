import { defineType, defineField, defineArrayMember } from "sanity";
import { ArrowTopRightIcon, BarChartIcon, InfoOutlineIcon, PlayIcon, WarningOutlineIcon, CheckmarkCircleIcon, ErrorOutlineIcon } from "@sanity/icons";

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
        { title: "H5", value: "h5" },
        { title: "H6", value: "h6" },
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

    // Chart reference (picks an existing chart document from the library)
    defineArrayMember({
      name: "chartReference",
      title: "Chart (from library)",
      type: "object",
      fields: [
        defineField({
          name: "chart",
          title: "Chart",
          type: "reference",
          to: [{ type: "chart" }],
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: "chart.title", options: "chart.options" },
        prepare({ title, options }) {
          let chartType = "unknown type";
          try {
            chartType = JSON.parse(options).chartType ?? "unknown type";
          } catch {
            // ignore
          }
          return {
            title: title || "Chart Reference",
            subtitle: `Chart: ${chartType}`,
            media: BarChartIcon,
          };
        },
      },
    }),

    // Custom block: CTA Section (rich CTA with text + multiple buttons)
    defineArrayMember({
      name: "ctaSectionBlock",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({
          name: "variant",
          title: "Style",
          type: "string",
          options: {
            list: [
              { title: "Boxed", value: "boxed" },
              { title: "Flat", value: "flat" },
              { title: "Outlined", value: "outlined" },
            ],
            layout: "radio",
          },
          initialValue: "boxed",
        }),
        defineField({
          name: "text",
          title: "Content",
          type: "sectionText",
        }),
        defineField({
          name: "ctas",
          title: "Call to Action Buttons",
          type: "array",
          of: [{ type: "ctaItem" }],
        }),
      ],
      preview: {
        select: { variant: "variant", text: "text" },
        prepare({ variant, text }) {
          const firstBlock = Array.isArray(text)
            ? text.find((b: any) => b._type === "block")
            : null;
          const title = firstBlock?.children
            ?.map((c: any) => c.text)
            .join("") || "CTA Section";
          return {
            title: title.slice(0, 80),
            subtitle: `CTA Section: ${variant ?? "boxed"}`,
            media: ArrowTopRightIcon,
          };
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
          type: "sectionText",
        }),
      ],
      preview: {
        select: { contentBlocks: "content", alertType: "alertType" },
        prepare({ contentBlocks, alertType }) {
          const text = Array.isArray(contentBlocks)
            ? contentBlocks.find((b: any) => b._type === "block")?.children?.map((c: any) => c.text).join("") || ""
            : contentBlocks || "";
          const alertIcons = {
            info: InfoOutlineIcon,
            warning: WarningOutlineIcon,
            success: CheckmarkCircleIcon,
            danger: ErrorOutlineIcon,
          };
          return {
            title: text.slice(0, 80),
            subtitle: `Alert: ${alertType}`,
            media: alertIcons[alertType as keyof typeof alertIcons] ?? InfoOutlineIcon,
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
          return { title: `YouTube: ${title}`, subtitle: "Video embed", media: PlayIcon };
        },
      },
    }),

    // Advanced table block (custom, supports colspan/rowspan/merge)
    defineArrayMember({
      type: "advancedTableBlock",
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
