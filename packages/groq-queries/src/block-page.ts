import groq from "groq";
import { imageWithMeta, imageMinimal, authorImage } from "./fragments";

export const blockPageQuery = groq`
  *[_type == "blockPage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    heroImage ${imageWithMeta},
    sections[] {
      _type,
      _key,
      _type == "heroSection" => {
        headline, subheadline, ctaText, ctaUrl,
        backgroundImage ${imageMinimal}
      },
      _type == "textSection" => {
        heading,
        body[] {
          ...,
          _type == "image" => ${imageWithMeta}
        },
        background
      },
      _type == "testimonialsSection" => {
        heading,
        testimonials[]-> {
          _id, name, company, role, quoteText,
          contactImage ${authorImage},
          companyImage ${imageMinimal}
        }
      },
      _type == "faqSection" => {
        heading,
        faqs[] { question, answer }
      },
      _type == "chartSection" => {
        heading, description, background,
        chart { chartType, title, labels, datasets, showLegend, sourceText }
      }
    },
    seo
  }
`;

export const blockPagesListQuery = groq`
  *[_type == "blockPage"] | order(title asc) {
    _id, title, slug, description,
    heroImage ${imageMinimal}
  }
`;
