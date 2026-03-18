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
        layout,
        eyebrow[] { ..., markDefs[] { ... } },
        headline[] { ..., markDefs[] { ... } },
        ctas[] { _key, text, url, style },
        showTrustBar,
        backgroundImage ${imageMinimal}
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
        content[] { ..., markDefs[] { ... } },
        faqs[] { question, answer }
      },
      _type == "featureGridSection" => {
        content[] { ..., markDefs[] { ... } },
        columns, background,
        tiles[] {
          _key, title, body,
          ctas[] { _key, text, url, style },
          icon { asset-> { _id, url }, hotspot, crop }
        }
      },
      _type == "ctaStripSection" => {
        content[] { ..., markDefs[] { ... } },
        ctas[] { _key, text, url, style },
        background
      },
      _type == "recentBlogsSection" => {
        content[] { ..., markDefs[] { ... } },
        category-> { _id, title, slug },
        limit,
        background
      },
      _type == "servicesGridBlock" => {
        content[] { ..., markDefs[] { ... } },
        columns,
        tiles[] {
          _key, title, body,
          ctas[] { _key, text, url, style },
          icon { asset-> { _id, url }, hotspot, crop }
        }
      },
      _type == "mediaAndTextBlock" => {
        image ${imageWithMeta},
        caption,
        content[] { ..., markDefs[] { ... } },
        ctas[] { _key, text, url, style },
        imagePosition
      },
      _type == "statsRowBlock" => {
        stats[] { _key, value, label, footnote },
        layout
      },
      _type == "alertBlock" => {
        content[] { ..., markDefs[] { ... } },
        alertType
      },
      _type == "calculatorBlock" => {
        calculatorType
      },
      _type == "pressLogosBlock" => {
        content[] { ..., markDefs[] { ... } },
        logos[] {
          _key, name, url,
          image { asset-> { _id, url }, hotspot, crop }
        },
        variant
      },
      _type == "newsBlock" => {
        content[] { ..., markDefs[] { ... } },
        items[] { _key, title, url, publication, date }
      },
      _type == "contactFormBlock" => {
        formType
      },
      _type == "customEmbedBlock" => {
        embedId
      },
      _type == "flexSectionBlock" => {
        backgroundStyle,
        paddingStyle,
        rows[] {
          _key, paddingStyle,
          columns[] {
            _key, columnWidth,
            content[] { ..., markDefs[] { ... } }
          }
        }
      }
    },
    seo
  }
`;

/** Sub-query for recentBlogsSection — runs at render time with $categoryId and $limit params */
export const recentBlogsByCategoryQuery = groq`
  *[_type == "blogPost" && (!defined($categoryId) || $categoryId in topicCategories[]->._id)]
  | order(date desc)[0...$limit] {
    _id, title, slug, date, description,
    heroImage { asset-> { _id, url }, hotspot, crop },
    author-> { fullName }
  }
`;

export const blockPagesListQuery = groq`
  *[_type == "blockPage"] | order(title asc) {
    _id, title, slug, description,
    heroImage ${imageMinimal}
  }
`;
