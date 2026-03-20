import {
  blogPost,
  blockPage,
  author,
  testimonial,
  portableText,
  inlineText,
  sectionText,
  ctaItem,
  category,
  tag,
  chart,
  advancedTableBlock,
  advancedTableRow,
  advancedTableCell,
} from "@kruze-poc/sanity-schemas";
import { PortableTextWithPaste } from "../components/PortableTextWithPaste";
import { AdvancedTableInput } from "../components/advanced-table";
import { ChartDataTable } from "../components/ChartDataTable";
import { ColorHexInput } from "../components/ColorHexInput";

const portableTextWithPaste = {
  ...portableText,
  components: {
    input: PortableTextWithPaste,
  },
};

const advancedTableBlockWithInput = {
  ...advancedTableBlock,
  components: {
    input: AdvancedTableInput,
  },
};

// Override chart schema: data field gets spreadsheet grid, colors get color picker
const chartWithComponents = {
  ...chart,
  fields: (chart.fields as any[]).map((field: any) => {
    if (field.name === "data") {
      return { ...field, components: { input: ChartDataTable } };
    }
    if (field.name === "colors") {
      return {
        ...field,
        of: (field.of as any[]).map((member: any) => ({
          ...member,
          components: { input: ColorHexInput },
        })),
      };
    }
    return field;
  }),
};

export const schemaTypes = [
  blogPost,
  blockPage,
  author,
  testimonial,
  portableTextWithPaste,
  inlineText,
  sectionText,
  ctaItem,
  category,
  tag,
  chartWithComponents,
  advancedTableBlockWithInput,
  advancedTableRow,
  advancedTableCell,
];
