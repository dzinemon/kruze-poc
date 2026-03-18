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
} from "@kruze-poc/sanity-schemas";
import { PortableTextWithPaste } from "../components/PortableTextWithPaste";

const portableTextWithPaste = {
  ...portableText,
  components: {
    input: PortableTextWithPaste,
  },
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
];
