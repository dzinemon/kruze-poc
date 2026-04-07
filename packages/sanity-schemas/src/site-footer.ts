import { defineType, defineField } from "sanity";

const footerLink = {
  type: "object",
  name: "footerLink",
  title: "Link",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", title: "URL", type: "string", validation: (r) => r.required() }),
    defineField({ name: "external", title: "Open in New Tab", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
};

export const siteFooter = defineType({
  name: "siteFooter",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "companyDescription",
      title: "Company Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "licenseNumber",
      title: "CPA License Number",
      type: "string",
    }),
    defineField({
      name: "licenseUrl",
      title: "CPA License Verification URL",
      type: "string",
    }),
    defineField({
      name: "incAwardText",
      title: "Inc. Award Text",
      type: "string",
      description: "e.g. 7 Years Straight — Inc. 5000 Fastest Growing Companies.",
    }),
    defineField({
      name: "columns",
      title: "Footer Columns",
      description: "Up to 5 columns (e.g. Kruze, Resources, Startup Tips, Social, Tax Dates).",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          title: "Column",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [footerLink],
            }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
      validation: (r) => r.max(5),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "URL", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "e.g. Copyright © Kruze Consulting — the year will be appended automatically.",
    }),
    defineField({
      name: "legalLinks",
      title: "Legal / Utility Links",
      description: "Privacy Policy, Terms of Service, Cookie Preferences, Do Not Sell, etc.",
      type: "array",
      of: [footerLink],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer" };
    },
  },
});
