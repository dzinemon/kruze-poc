// TypeScript types derived from Sanity schemas.
// In a full migration these would be auto-generated via sanity-typegen.
// For the POC, manual types are sufficient.

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number };
      lqip?: string;
    };
  };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
}

export interface Author {
  _id: string;
  fullName: string;
  slug: SanitySlug;
  position?: string;
  certification?: string;
  image?: SanityImage;
  shortDescription?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface Tag {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  role?: string;
  quoteText: string;
  contactImage?: SanityImage;
  companyImage?: SanityImage;
}

export interface ChartDataset {
  label: string;
  values: number[];
}

export interface ChartBlock {
  _type: "chartBlock";
  chartType: "bar" | "pie" | "line" | "doughnut";
  title?: string;
  height?: number;
  colorScheme?: "brand" | "warm" | "cool" | "mono";
  labels?: string[];
  datasets?: ChartDataset[];
  showLegend?: boolean;
  sourceText?: string;
}

export interface CtaBlock {
  _type: "ctaBlock";
  text: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
}

export interface AlertBlock {
  _type: "alertBlock";
  alertType: "info" | "warning" | "success" | "danger";
  content: string;
}

export interface YouTubeBlock {
  _type: "youtubeBlock";
  videoId: string;
  caption?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: SanitySlug;
  headlineText?: string;
  description?: string;
  author?: Author;
  heroImage?: SanityImage;
  date: string;
  modifiedDate?: string;
  topicCategories?: Category[];
  topicTags?: Tag[];
  tableOfContents?: boolean;
  heroCta?: {
    text?: string;
    url?: string;
    modalId?: string;
  };
  body?: any[]; // Portable Text blocks
  seo?: {
    robots?: string;
    sitemap?: boolean;
  };
}

export interface HeroSection {
  _type: "heroSection";
  _key: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: SanityImage;
}

export interface TextSection {
  _type: "textSection";
  _key: string;
  heading?: string;
  body?: any[];
  background?: "white" | "light" | "gradient";
}

export interface TestimonialsSection {
  _type: "testimonialsSection";
  _key: string;
  heading?: string;
  testimonials?: Testimonial[];
}

export interface FaqItem {
  question: string;
  answer: any[];
}

export interface FaqSection {
  _type: "faqSection";
  _key: string;
  heading?: string;
  faqs?: FaqItem[];
}

export interface ChartSection {
  _type: "chartSection";
  _key: string;
  heading?: string;
  description?: string;
  chart?: {
    chartType: "bar" | "pie" | "line" | "doughnut";
    title?: string;
    labels?: string[];
    datasets?: ChartDataset[];
    showLegend?: boolean;
    sourceText?: string;
  };
  background?: "white" | "light";
}

export type BlockPageSection =
  | HeroSection
  | TextSection
  | TestimonialsSection
  | FaqSection
  | ChartSection;

export interface BlockPage {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  heroImage?: SanityImage;
  sections?: BlockPageSection[];
  seo?: {
    robots?: string;
    sitemap?: boolean;
  };
}
