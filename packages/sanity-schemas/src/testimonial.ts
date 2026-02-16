import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
    }),
    defineField({
      name: "quoteText",
      title: "Quote",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactImage",
      title: "Client Photo",
      type: "image",
    }),
    defineField({
      name: "companyImage",
      title: "Company Logo",
      type: "image",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "contactImage",
    },
  },
});
