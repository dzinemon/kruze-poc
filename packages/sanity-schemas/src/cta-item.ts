import { defineType, defineField } from "sanity";

export const ctaItem = defineType({
  name: "ctaItem",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Label",
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
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "style" },
  },
});
