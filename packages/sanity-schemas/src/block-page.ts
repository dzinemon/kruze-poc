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
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: { list: ["centered", "split"], layout: "radio" },
              initialValue: "centered",
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow Badge",
              type: "array",
              validation: (rule) => rule.max(1),
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
                  },
                }),
              ],
            }),
            defineField({
              name: "headline",
              title: "Headline & Subheadline",
              description: "Use 'Heading' style for H1, 'Normal' for the subheadline paragraph. Bold marks on headings render as gradient highlights.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Heading", value: "h1" },
                    { title: "Normal", value: "normal" },
                  ],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Bold (gradient in headings)", value: "strong" },
                      { title: "Italic", value: "em" },
                      { title: "Underline", value: "underline" },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: "ctas",
              title: "CTAs",
              type: "array",
              validation: (rule) => rule.max(2),
              of: [
                defineArrayMember({
                  type: "object",
                  name: "cta",
                  fields: [
                    defineField({ name: "text", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "url", title: "URL", type: "string" }),
                    defineField({
                      name: "style",
                      title: "Style",
                      type: "string",
                      options: { list: ["primary", "secondary"], layout: "radio" },
                      initialValue: "primary",
                    }),
                  ],
                  preview: {
                    select: { title: "text", subtitle: "style" },
                  },
                }),
              ],
            }),
            defineField({
              name: "showTrustBar",
              title: "Show Trust Bar",
              type: "boolean",
              initialValue: false,
            }),
            defineField({ name: "backgroundImage", title: "Background Image", type: "image" }),
          ],
          preview: {
            select: { headline: "headline" },
            prepare({ headline }) {
              const text: string =
                headline?.[0]?.children
                  ?.map((s: { text?: string }) => s.text ?? "")
                  .join("") ?? "";
              return { title: text || "Hero", subtitle: "Hero Section" };
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
            defineField({
              name: "content",
              title: "Heading & Intro",
              description: "Use 'Heading 2' style for heading, 'Normal' for intro text.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Heading 2", value: "h2" },
                    { title: "Normal", value: "normal" },
                  ],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                    ],
                  },
                }),
              ],
            }),
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

        // Feature grid section
        defineArrayMember({
          name: "featureGridSection",
          title: "Feature Grid Section",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Heading & Intro",
              description: "Use 'Heading 2' style for heading, 'Normal' for intro text.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Heading 2", value: "h2" },
                    { title: "Normal", value: "normal" },
                  ],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: "columns",
              title: "Grid Columns",
              type: "number",
              options: { list: [{ title: "2 columns", value: 2 }, { title: "3 columns", value: 3 }, { title: "4 columns", value: 4 }], layout: "radio" },
              initialValue: 3,
            }),
            defineField({
              name: "tiles",
              title: "Tiles",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "featureTile",
                  fields: [
                    defineField({ name: "icon", title: "Icon / Image", type: "image" }),
                    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "body", title: "Description", type: "portableText" }),
                    defineField({
                      name: "link",
                      title: "CTA Link",
                      type: "object",
                      fields: [
                        defineField({ name: "text", title: "Label", type: "string" }),
                        defineField({ name: "url", title: "URL", type: "string" }),
                      ],
                    }),
                  ],
                  preview: { select: { title: "title" } },
                }),
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
              return { title: title || "Feature Grid", subtitle: "Feature Grid Section" };
            },
          },
        }),

        // CTA strip section
        defineArrayMember({
          name: "ctaStripSection",
          title: "CTA Strip Section",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Content",
              description: "Use 'Heading 2' style for heading, 'Normal' for body text.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Heading 2", value: "h2" },
                    { title: "Normal", value: "normal" },
                  ],
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
                          defineField({ name: "href", type: "string", title: "URL" }),
                        ],
                      },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: "ctas",
              title: "CTA Buttons",
              type: "array",
              validation: (rule) => rule.max(1),
              of: [
                defineArrayMember({
                  type: "object",
                  name: "ctaButton",
                  fields: [
                    defineField({ name: "text", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "url", title: "URL", type: "string" }),
                    defineField({
                      name: "style",
                      title: "Style",
                      type: "string",
                      options: { list: ["primary", "secondary"], layout: "radio" },
                      initialValue: "primary",
                    }),
                  ],
                  preview: { select: { title: "text", subtitle: "style" } },
                }),
              ],
            }),
            defineField({
              name: "background",
              title: "Background",
              type: "string",
              options: { list: [
                { title: "White", value: "white" },
                { title: "Brand Gradient", value: "brand" },
                { title: "Light Grey", value: "light" },
              ] },
              initialValue: "white",
            }),
          ],
          preview: {
            select: { bg: "background" },
            prepare({ bg }) {
              return { title: "CTA Strip", subtitle: `${bg ?? "white"} background` };
            },
          },
        }),

        // Recent blog posts section
        defineArrayMember({
          name: "recentBlogsSection",
          title: "Recent Blog Posts Section",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Heading & Intro",
              description: "Use 'Heading 2' style for heading, 'Normal' for intro text.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Heading 2", value: "h2" },
                    { title: "Normal", value: "normal" },
                  ],
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
                          defineField({ name: "href", type: "string", title: "URL" }),
                        ],
                      },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: "category",
              title: "Filter by Category",
              type: "reference",
              to: [{ type: "category" }],
            }),
            defineField({
              name: "limit",
              title: "Number of Posts",
              type: "number",
              initialValue: 3,
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
            prepare() {
              return { title: "Recent Blog Posts", subtitle: "Recent Blog Posts Section" };
            },
          },
        }),

        // Services grid block
        defineArrayMember({
          name: "servicesGridBlock",
          title: "Services Grid",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Heading & Intro",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Heading 2", value: "h2" }, { title: "Normal", value: "normal" }],
                  lists: [],
                  marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }] },
                }),
              ],
            }),
            defineField({
              name: "columns",
              title: "Columns",
              type: "number",
              options: { list: [{ title: "3 columns", value: 3 }, { title: "4 columns", value: 4 }], layout: "radio" },
              initialValue: 3,
            }),
            defineField({
              name: "tiles",
              title: "Service Tiles",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "serviceTile",
                  fields: [
                    defineField({ name: "icon", title: "Icon / Image", type: "image" }),
                    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "body", title: "Description", type: "portableText" })
                  ],
                  preview: { select: { title: "title" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "columns" },
            prepare({ title }) {
              return { title: "Services Grid", subtitle: `${title ?? 3} columns` };
            },
          },
        }),

        // Media and text block
        defineArrayMember({
          name: "mediaAndTextBlock",
          title: "Media & Text",
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "caption", title: "Image Caption", type: "string" }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Heading 2", value: "h2" }, { title: "Heading 3", value: "h3" }, { title: "Normal", value: "normal" }],
                  lists: [{ title: "Bullet", value: "bullet" }],
                  marks: {
                    decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
                    annotations: [{ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", type: "string", title: "URL" })] }],
                  },
                }),
              ],
            }),
            defineField({
              name: "imagePosition",
              title: "Image Position",
              type: "string",
              options: { list: [{ title: "Left", value: "left" }, { title: "Right", value: "right" }], layout: "radio" },
              initialValue: "left",
            }),
          ],
          preview: {
            select: { pos: "imagePosition", media: "image" },
            prepare({ pos, media }) {
              return { title: "Media & Text", subtitle: `Image ${pos ?? "left"}`, media };
            },
          },
        }),

        // Stats row block
        defineArrayMember({
          name: "statsRowBlock",
          title: "Stats Row",
          type: "object",
          fields: [
            defineField({
              name: "stats",
              title: "Stats",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "statItem",
                  fields: [
                    defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "footnote", title: "Footnote", type: "string" }),
                  ],
                  preview: { select: { title: "value", subtitle: "label" } },
                }),
              ],
            }),
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: { list: ["2-col", "3-col", "4-col"], layout: "radio" },
              initialValue: "3-col",
            }),
          ],
          preview: {
            prepare() {
              return { title: "Stats Row" };
            },
          },
        }),

        // Alert block (page-level)
        defineArrayMember({
          name: "alertBlock",
          title: "Alert / Callout",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
                    annotations: [{ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", type: "string", title: "URL" })] }],
                  },
                }),
              ],
            }),
            defineField({
              name: "alertType",
              title: "Alert Type",
              type: "string",
              options: { list: ["primary", "warning", "success", "info"], layout: "radio" },
              initialValue: "info",
            }),
          ],
          preview: {
            select: { type: "alertType" },
            prepare({ type }) {
              return { title: "Alert", subtitle: type ?? "info" };
            },
          },
        }),

        // Calculator block
        defineArrayMember({
          name: "calculatorBlock",
          title: "Calculator",
          type: "object",
          fields: [
            defineField({
              name: "calculatorType",
              title: "Calculator Type",
              type: "string",
              options: {
                list: [
                  { title: "R&D Tax Credit", value: "rd" },
                  { title: "Delaware Franchise Tax", value: "delaware" },
                  { title: "VROPD Calculator", value: "vropd" },
                  { title: "Tax Return", value: "tax-return" },
                  { title: "CEO Salary", value: "ceo-salary" },
                  { title: "Cash Burn", value: "cash-burn" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { type: "calculatorType" },
            prepare({ type }) {
              return { title: "Calculator", subtitle: type ?? "" };
            },
          },
        }),

        // Press logos block
        defineArrayMember({
          name: "pressLogosBlock",
          title: "Press / Client Logos",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Heading",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: { decorators: [{ title: "Bold", value: "strong" }] },
                }),
              ],
            }),
            defineField({
              name: "logos",
              title: "Logos",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "logo",
                  fields: [
                    defineField({ name: "name", title: "Name", type: "string" }),
                    defineField({ name: "image", title: "Logo Image", type: "image" }),
                    defineField({ name: "url", title: "Link URL", type: "string" }),
                  ],
                  preview: { select: { title: "name", media: "image" } },
                }),
              ],
            }),
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
              options: { list: ["clients", "press", "partners"], layout: "radio" },
              initialValue: "press",
            }),
          ],
          preview: {
            select: { variant: "variant" },
            prepare({ variant }) {
              return { title: "Logos", subtitle: variant ?? "press" };
            },
          },
        }),

        // News block
        defineArrayMember({
          name: "newsBlock",
          title: "News / Press",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Heading & Intro",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Heading 2", value: "h2" }, { title: "Normal", value: "normal" }],
                  lists: [],
                  marks: { decorators: [{ title: "Bold", value: "strong" }] },
                }),
              ],
            }),
            defineField({
              name: "items",
              title: "News Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "newsItem",
                  fields: [
                    defineField({ name: "title", title: "Headline", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "url", title: "URL", type: "string" }),
                    defineField({ name: "publication", title: "Publication", type: "string" }),
                    defineField({ name: "date", title: "Date", type: "date" }),
                  ],
                  preview: { select: { title: "title", subtitle: "publication" } },
                }),
              ],
            }),
          ],
          preview: {
            prepare() {
              return { title: "News / Press" };
            },
          },
        }),

        // Contact form block
        defineArrayMember({
          name: "contactFormBlock",
          title: "Contact Form",
          type: "object",
          fields: [
            defineField({
              name: "formType",
              title: "Form Type",
              type: "string",
              options: { list: [{ title: "Free Consultation", value: "consultation" }, { title: "Newsletter", value: "newsletter" }], layout: "radio" },
              initialValue: "consultation",
            }),
          ],
          preview: {
            select: { type: "formType" },
            prepare({ type }) {
              return { title: "Contact Form", subtitle: type ?? "consultation" };
            },
          },
        }),

        // Custom embed block
        defineArrayMember({
          name: "customEmbedBlock",
          title: "Custom Embed",
          type: "object",
          fields: [
            defineField({
              name: "embedId",
              title: "Embed ID",
              description: "Named partial to embed (e.g. 'pricing-plan-table', 'rd-tax-calc')",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { id: "embedId" },
            prepare({ id }) {
              return { title: "Custom Embed", subtitle: id ?? "" };
            },
          },
        }),

        // Flex section block (escape hatch)
        defineArrayMember({
          name: "flexSectionBlock",
          title: "Flex Section (Advanced)",
          type: "object",
          fields: [
            defineField({ name: "backgroundStyle", title: "Background Style", type: "string" }),
            defineField({ name: "paddingStyle", title: "Padding Style", type: "string" }),
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "flexRow",
                  fields: [
                    defineField({ name: "paddingStyle", title: "Row Padding", type: "string" }),
                    defineField({
                      name: "columns",
                      title: "Columns",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "object",
                          name: "flexColumn",
                          fields: [
                            defineField({ name: "columnWidth", title: "Column Width", type: "string" }),
                            defineField({
                              name: "content",
                              title: "Content",
                              type: "array",
                              of: [
                                defineArrayMember({
                                  type: "block",
                                  styles: [
                                    { title: "Heading 2", value: "h2" },
                                    { title: "Heading 3", value: "h3" },
                                    { title: "Normal", value: "normal" },
                                  ],
                                  lists: [{ title: "Bullet", value: "bullet" }],
                                  marks: {
                                    decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
                                    annotations: [{ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", type: "string", title: "URL" })] }],
                                  },
                                }),
                              ],
                            }),
                          ],
                          preview: { select: { title: "columnWidth" } },
                        }),
                      ],
                    }),
                  ],
                  preview: { prepare() { return { title: "Row" }; } },
                }),
              ],
            }),
          ],
          preview: {
            prepare() {
              return { title: "Flex Section (Advanced)" };
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
