import { defineType, defineField, defineArrayMember } from "sanity";
import { BarChartIcon } from "@sanity/icons";


export const chart = defineType({
  name: "chart",
  title: "Chart",
  type: "document",
  fieldsets: [
    {
      name: "chartOptions",
      title: "Chart Options",
      description: "Google Charts configuration (set by developer)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Chart name — also used as the display heading above the chart",
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
      name: "data",
      title: "Data Table (JSON)",
      type: "text",
      description:
        'JSON array in arrayToDataTable format. First row = headers, remaining rows = data. Example: [["Year","Revenue","Expenses"],["2023",100,80],["2024",120,90]]',
      validation: (rule) =>
        rule.required().custom((val) => {
          if (!val) return "Data is required";
          try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) return "Must be a JSON array";
            if (parsed.length < 2)
              return "Must have at least a header row and one data row";
            if (!Array.isArray(parsed[0]))
              return "Each row must be an array";
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      description:
        "Hex colors for data series. Leave empty to use brand defaults.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) =>
            rule.regex(/^#[0-9A-Fa-f]{6}$/, {
              name: "hex color",
              invert: false,
            }),
        }),
      ],
    }),
    defineField({
      name: "options",
      title: "Chart Options (JSON)",
      type: "text",
      fieldset: "chartOptions",
      description:
        'Google Charts options object. Must include "chartType". Example: {"chartType":"BarChart","legend":{"position":"none"},"hAxis":{"title":"Revenue"}}',
      validation: (rule) =>
        rule.required().custom((val) => {
          if (!val) return "Options are required";
          try {
            const parsed = JSON.parse(val);
            if (typeof parsed !== "object" || Array.isArray(parsed))
              return "Must be a JSON object";
            if (!parsed.chartType)
              return 'Must include "chartType" (e.g. "LineChart", "BarChart", "PieChart")';
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
  ],
  preview: {
    select: { title: "title", options: "options" },
    prepare({ title, options }) {
      let chartType = "Chart";
      try {
        chartType = JSON.parse(options).chartType ?? "Chart";
      } catch {
        // ignore parse errors
      }
      return {
        title: title || "Untitled Chart",
        subtitle: chartType,
        media: BarChartIcon,
      };
    },
  },
});
