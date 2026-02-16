import { defineType, defineField, defineArrayMember } from "sanity";

export const blockPage = defineType({
  name: "blockPage",
  title: "Block Page",
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
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        // Hero section
        defineArrayMember({
          name: "heroSection",
          title: "Hero Section",
          type: "object",
          fields: [
            defineField({ name: "headline", title: "Headline", type: "string" }),
            defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 2 }),
            defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
            defineField({ name: "ctaUrl", title: "CTA URL", type: "string" }),
            defineField({ name: "backgroundImage", title: "Background Image", type: "image" }),
          ],
          preview: {
            select: { title: "headline" },
            prepare({ title }) {
              return { title: title || "Hero", subtitle: "Hero Section" };
            },
          },
        }),

        // Rich text section
        defineArrayMember({
          name: "textSection",
          title: "Text Section",
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Section Heading", type: "string" }),
            defineField({ name: "body", title: "Content", type: "portableText" }),
            defineField({
              name: "background",
              title: "Background",
              type: "string",
              options: { list: ["white", "light", "gradient"] },
              initialValue: "white",
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare({ title }) {
              return { title: title || "Text Section", subtitle: "Rich Text" };
            },
          },
        }),

        // Testimonials section
        defineArrayMember({
          name: "testimonialsSection",
          title: "Testimonials Section",
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "testimonials",
              title: "Testimonials",
              type: "array",
              of: [{ type: "reference", to: [{ type: "testimonial" }] }],
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare({ title }) {
              return { title: title || "Testimonials", subtitle: "Testimonials Section" };
            },
          },
        }),

        // FAQ section
        defineArrayMember({
          name: "faqSection",
          title: "FAQ Section",
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({
              name: "faqs",
              title: "FAQs",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "faqItem",
                  fields: [
                    defineField({ name: "question", title: "Question", type: "string" }),
                    defineField({ name: "answer", title: "Answer", type: "portableText" }),
                  ],
                  preview: { select: { title: "question" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare({ title }) {
              return { title: title || "FAQ", subtitle: "FAQ Section" };
            },
          },
        }),

        // Chart section
        defineArrayMember({
          name: "chartSection",
          title: "Chart Section",
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Section Heading", type: "string" }),
            defineField({
              name: "description",
              title: "Section Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "chart",
              title: "Chart",
              type: "object",
              fields: [
                defineField({
                  name: "chartType",
                  title: "Type",
                  type: "string",
                  options: { list: ["bar", "pie", "line", "doughnut"] },
                  initialValue: "bar",
                }),
                defineField({ name: "title", title: "Chart Title", type: "string" }),
                defineField({
                  name: "labels",
                  title: "Labels",
                  type: "array",
                  of: [{ type: "string" }],
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
                        defineField({ name: "label", title: "Label", type: "string" }),
                        defineField({
                          name: "values",
                          title: "Values",
                          type: "array",
                          of: [{ type: "number" }],
                        }),
                      ],
                      preview: { select: { title: "label" } },
                    }),
                  ],
                }),
                defineField({
                  name: "showLegend",
                  title: "Show Legend",
                  type: "boolean",
                  initialValue: true,
                }),
                defineField({ name: "sourceText", title: "Source", type: "string" }),
              ],
            }),
            defineField({
              name: "background",
              title: "Background",
              type: "string",
              options: { list: ["white", "light"] },
              initialValue: "white",
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare({ title }) {
              return { title: title || "Chart", subtitle: "Chart Section" };
            },
          },
        }),
      ],
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
    select: { title: "title", media: "heroImage" },
  },
});
