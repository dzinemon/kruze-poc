import { defineType, defineField, defineArrayMember } from "sanity";
import { StackCompactIcon } from "@sanity/icons";

export const advancedTableCell = defineType({
  name: "advancedTableCell",
  title: "Table Cell",
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
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
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
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
          lists: [],
        }),
      ],
    }),
    defineField({
      name: "colspan",
      title: "Column Span",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.min(1),
      hidden: true,
    }),
    defineField({
      name: "rowspan",
      title: "Row Span",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.min(1),
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Cell" };
    },
  },
});

export const advancedTableRow = defineType({
  name: "advancedTableRow",
  title: "Table Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [defineArrayMember({ type: "advancedTableCell" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Row" };
    },
  },
});

export const advancedTableBlock = defineType({
  name: "advancedTableBlock",
  title: "Advanced Table",
  type: "object",
  fields: [
    defineField({
      name: "hasHeaderRow",
      title: "First Row is Header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "columnCount",
      title: "Column Count",
      type: "number",
      initialValue: 3,
      validation: (rule) => rule.min(1),
      hidden: true,
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "advancedTableRow" })],
    }),
  ],
  preview: {
    select: { rows: "rows", columnCount: "columnCount", hasHeaderRow: "hasHeaderRow" },
    prepare({ rows, columnCount, hasHeaderRow }) {
      const rowCount = rows?.length ?? 0;
      const cols = columnCount ?? 0;

      const cellText = (cell: any): string =>
        (cell?.content ?? [])
          .flatMap((b: any) => (b.children ?? []).map((s: any) => s.text ?? ""))
          .join("") || "—";

      let title = "Table";
      if (hasHeaderRow && rows?.[0]?.cells?.length) {
        title = rows[0].cells.map(cellText).join(" · ");
      }

      const dims = `${cols}×${rowCount} table`;
      const firstBodyRow = hasHeaderRow ? rows?.[1] : rows?.[0];
      let subtitle = dims;
      if (firstBodyRow?.cells?.length) {
        const preview = firstBodyRow.cells.map(cellText).join(" · ");
        subtitle = `${dims} · ${preview}`;
      }

      return { title, subtitle, media: StackCompactIcon };
    },
  },
});
