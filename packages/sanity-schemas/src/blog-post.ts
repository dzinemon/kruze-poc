import { defineType, defineField } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headlineText",
      title: "Headline Text",
      type: "string",
      description: "Display title (may differ from SEO title)",
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Publish Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "modifiedDate",
      title: "Modified Date",
      type: "datetime",
    }),
    defineField({
      name: "topicCategories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "topicTags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "tableOfContents",
      title: "Show Table of Contents",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "portableText",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "robots",
          title: "Robots",
          type: "string",
          initialValue: "index, follow",
        }),
        defineField({
          name: "sitemap",
          title: "Include in Sitemap",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.fullName",
      media: "heroImage",
      date: "date",
    },
    prepare({ title, author, media, date }) {
      return {
        title,
        subtitle: `${author || "No author"} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
        media,
      };
    },
  },
});
