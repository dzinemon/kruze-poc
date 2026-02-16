import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "fullName", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
    }),
    defineField({
      name: "certification",
      title: "Certification",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "portableText",
    }),
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "twitter", title: "X (Twitter)", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "position",
      media: "image",
    },
  },
});
