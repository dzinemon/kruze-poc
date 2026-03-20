import groq from "groq";
import { imageWithMeta, imageMinimal, authorImage } from "./fragments";

export const blogPostsListQuery = groq`
  *[_type == "blogPost"] | order(date desc) [0...20] {
    _id,
    title,
    slug,
    description,
    date,
    heroImage ${imageMinimal},
    author-> { fullName, slug, position, certification, image ${authorImage} },
    topicCategories[]-> { title, slug },
    "readTime": select(defined(body) => round(length(pt::text(body)) / 1200), null)
  }
`;

export const blogPostQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    headlineText,
    slug,
    description,
    date,
    modifiedDate,
    tableOfContents,
    heroImage ${imageWithMeta},
    author-> {
      fullName,
      slug,
      position,
      certification,
      image ${authorImage},
      shortDescription,
      social
    },
    topicCategories[]-> { _id, title, slug },
    topicTags[]-> { _id, title, slug },
    body[] {
      ...,
      _type == "image" => ${imageWithMeta},
      _type == "chartReference" => {
        ...,
        chart-> {
          _id, title, chartType, data, colors, seriesType,
          isStacked, vAxisTitle, hAxisTitle, vAxisFormat, hAxisFormat,
          legendPosition, aspectRatio, numberFormat, advancedOptions
        }
      }
    },
    seo
  }
`;

export const relatedPostsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug && count(topicCategories[@._ref in $categoryIds]) > 0]
  | order(date desc) [0...3] {
    _id, title, slug, description, date,
    heroImage ${imageMinimal},
    author-> { fullName, position, certification, image ${authorImage} },
    topicCategories[]-> { title, slug },
    "readTime": select(defined(body) => round(length(pt::text(body)) / 1200), null)
  }
`;

export const relatedByTagsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug && count(topicTags[@._ref in $tagIds]) > 0]
  | order(date desc) [0...3] {
    _id, title, slug, description, date,
    heroImage ${imageMinimal},
    author-> { fullName, position, certification, image ${authorImage} },
    topicCategories[]-> { title, slug },
    "readTime": select(defined(body) => round(length(pt::text(body)) / 1200), null)
  }
`;
