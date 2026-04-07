import { defineType, defineField } from "sanity";

const navLink = defineField({
  name: "navLinks",
  title: "Links",
  type: "array",
  of: [
    {
      type: "object",
      name: "navLink",
      title: "Link",
      fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "url", title: "URL", type: "string", validation: (r) => r.required() }),
        defineField({ name: "helpText", title: "Help Text", type: "string" }),
        defineField({
          name: "icon",
          title: "Icon",
          type: "image",
          options: { accept: "image/svg+xml,image/*" },
        }),
      ],
      preview: { select: { title: "title", subtitle: "url" } },
    },
  ],
});

const navColumn = {
  type: "object",
  name: "navColumn",
  title: "Column",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "featured",
      title: "Featured Image Column",
      description: "Render this column as a featured image card (like the Resources dropdown).",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      hidden: ({ parent }: { parent?: { featured?: boolean } }) => !parent?.featured,
    }),
    defineField({
      name: "featuredImageUrl",
      title: "Featured Image Link URL",
      type: "string",
      hidden: ({ parent }: { parent?: { featured?: boolean } }) => !parent?.featured,
    }),
    defineField({
      name: "featuredImageLinkText",
      title: "Featured Image Button Text",
      type: "string",
      hidden: ({ parent }: { parent?: { featured?: boolean } }) => !parent?.featured,
    }),
    navLink,
  ],
  preview: {
    select: { title: "heading", subtitle: "featured" },
    prepare({ title, subtitle }: { title?: string; subtitle?: boolean }) {
      return { title: title || "Column", subtitle: subtitle ? "Featured image column" : "" };
    },
  },
};

export const siteNavigation = defineType({
  name: "siteNavigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "infoBar",
      title: "Info Bar",
      description: "Top announcement banner above the navigation.",
      type: "object",
      fields: [
        defineField({ name: "enabled", title: "Show Info Bar", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "linkText", title: "Link Text", type: "string" }),
        defineField({ name: "linkUrl", title: "Link URL", type: "string" }),
      ],
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA Button",
      type: "ctaItem",
    }),
    defineField({
      name: "navItems",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Nav Item",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "url",
              title: "URL",
              description: "Leave empty if this item only opens a dropdown.",
              type: "string",
            }),
            defineField({
              name: "dropdownColumns",
              title: "Dropdown Columns",
              type: "array",
              of: [navColumn],
            }),
            defineField({
              name: "dropdownInfoBar",
              title: "Dropdown Footer Bar",
              description: "Optional bottom bar inside the dropdown panel (e.g. a promo link).",
              type: "object",
              fields: [
                defineField({ name: "text", title: "Text", type: "string" }),
                defineField({ name: "linkText", title: "Link Text", type: "string" }),
                defineField({ name: "linkUrl", title: "Link URL", type: "string" }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "url" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title || "Nav item", subtitle: subtitle || "Dropdown" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Navigation" };
    },
  },
});
