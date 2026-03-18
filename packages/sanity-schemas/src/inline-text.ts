import { defineType, defineField, defineArrayMember } from "sanity";

export const inlineText = defineType({
  name: "inlineText",
  title: "Inline Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
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
