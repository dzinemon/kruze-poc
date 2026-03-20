import { defineType, defineField, defineArrayMember } from "sanity";

export const chart = defineType({
  name: "chart",
  title: "Chart",
  type: "document",
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
      name: "chartType",
      title: "Chart Type",
      type: "string",
      options: {
        list: [
          { title: "Combo Chart (line + bar)", value: "ComboChart" },
          { title: "Line Chart", value: "LineChart" },
          { title: "Column Chart", value: "ColumnChart" },
          { title: "Bar Chart", value: "BarChart" },
          { title: "Area Chart", value: "AreaChart" },
          { title: "Pie Chart", value: "PieChart" },
          { title: "Table", value: "Table" },
        ],
        layout: "dropdown",
      },
      initialValue: "ComboChart",
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
      name: "seriesType",
      title: "Series Type",
      type: "string",
      description: "For ComboChart — how data series are drawn",
      options: {
        list: [
          { title: "Line", value: "line" },
          { title: "Bars", value: "bars" },
          { title: "Area", value: "area" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => parent?.chartType !== "ComboChart",
    }),
    defineField({
      name: "isStacked",
      title: "Stacked",
      type: "boolean",
      description: "Stack data series on top of each other",
      initialValue: false,
    }),
    defineField({
      name: "vAxisTitle",
      title: "Vertical Axis Title",
      type: "string",
      description: 'e.g. "Millions, $"',
    }),
    defineField({
      name: "hAxisTitle",
      title: "Horizontal Axis Title",
      type: "string",
      description: 'e.g. "Year"',
    }),
    defineField({
      name: "vAxisFormat",
      title: "Vertical Axis Format",
      type: "string",
      description: 'Google Charts format string, e.g. "#,###", "$#,###", "#%"',
    }),
    defineField({
      name: "hAxisFormat",
      title: "Horizontal Axis Format",
      type: "string",
      description: 'Google Charts format string, e.g. "####"',
    }),
    defineField({
      name: "legendPosition",
      title: "Legend Position",
      type: "string",
      options: {
        list: [
          { title: "Bottom", value: "bottom" },
          { title: "Top", value: "top" },
          { title: "Right", value: "right" },
          { title: "None", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "bottom",
    }),
    defineField({
      name: "numberFormat",
      title: "Number Format (Tooltips)",
      type: "object",
      description:
        "Controls how values appear in tooltips and formatted labels",
      fields: [
        defineField({
          name: "prefix",
          title: "Prefix",
          type: "string",
          description: 'e.g. "$"',
        }),
        defineField({
          name: "suffix",
          title: "Suffix",
          type: "string",
          description: 'e.g. "M", "%"',
        }),
        defineField({
          name: "pattern",
          title: "Pattern",
          type: "string",
          description: 'e.g. "###,###.##"',
        }),
      ],
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      description: 'e.g. "4/3" (default), "16/9", "1/1"',
      initialValue: "4/3",
    }),
    defineField({
      name: "advancedOptions",
      title: "Advanced Options (JSON)",
      type: "text",
      description:
        "Optional raw JSON object merged into Google Charts options. Use for any option not covered by the fields above.",
      validation: (rule) =>
        rule.custom((val) => {
          if (!val) return true;
          try {
            const parsed = JSON.parse(val);
            if (typeof parsed !== "object" || Array.isArray(parsed))
              return "Must be a JSON object (not array)";
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
  ],
  preview: {
    select: { title: "title", chartType: "chartType" },
    prepare({ title, chartType }) {
      return {
        title: title || "Untitled Chart",
        subtitle: chartType ?? "Chart",
      };
    },
  },
});
