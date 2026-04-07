import {
  siteNavigation,
  siteFooter,
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
import { SlugWithPrefixInput } from "../components/SlugWithPrefixInput";

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

const blogPostWithSlugInput = {
  ...blogPost,
  fields: (blogPost.fields as any[]).map((field: any) => {
    if (field.name === "slug") {
      return {
        ...field,
        components: {
          input: (props: any) =>
            SlugWithPrefixInput({
              ...props,
              prefix: "/blog/",
              suffix: "/",
              baseUrl: import.meta.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000",
            }),
        },
      };
    }
    return field;
  }),
};

export const schemaTypes = [
  siteNavigation,
  siteFooter,
  blogPostWithSlugInput,
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
