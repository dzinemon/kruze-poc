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

// Chart document (standalone, referenceable)
// Must stay assignable to ChartDocumentData in @kruze-poc/ui/chart/build-chart-config.ts
export interface ChartNumberFormat {
  prefix?: string;
  suffix?: string;
  pattern?: string;
}

export interface ChartDocument {
  _id: string;
  _type: "chart";
  title: string;
  slug: SanitySlug;
  chartType:
    | "ComboChart"
    | "ColumnChart"
    | "LineChart"
    | "PieChart"
    | "BarChart"
    | "AreaChart"
    | "Table";
  data: string; // JSON array for arrayToDataTable
  colors?: string[];
  seriesType?: "line" | "bars" | "area";
  isStacked?: boolean;
  vAxisTitle?: string;
  hAxisTitle?: string;
  vAxisFormat?: string;
  hAxisFormat?: string;
  legendPosition?: "bottom" | "top" | "right" | "none";
  numberFormat?: ChartNumberFormat;
  aspectRatio?: string;
  advancedOptions?: string; // raw JSON object
}

export interface ChartReferenceBlock {
  _type: "chartReference";
  _key: string;
  chart: ChartDocument;
}

export interface CtaItem {
  _type: "ctaItem";
  _key: string;
  text: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
}

export interface CtaSectionBlock {
  _type: "ctaSectionBlock";
  _key: string;
  variant: "boxed" | "flat" | "outlined";
  text?: any[]; // sectionText portable text
  ctas?: CtaItem[];
}

export interface PortableTextAlertBlock {
  _type: "alertBlock";
  alertType: "info" | "warning" | "success" | "danger";
  content: any[];
}

export interface YouTubeBlock {
  _type: "youtubeBlock";
  videoId: string;
  caption?: string;
}

export interface RichTableCell {
  _key: string;
  _type: "richTableCell";
  content?: any[];
}

export interface RichTableRow {
  _key: string;
  _type: "richTableRow";
  title?: string;
  cells: RichTableCell[];
}

export interface RichTableBlock {
  _key: string;
  _type: "richTableBlock";
  rows: RichTableRow[];
  hasColumnTitles?: boolean;
  hasRowTitles?: boolean;
}

export interface AdvancedTableCell {
  _key: string;
  _type: "advancedTableCell";
  content?: any[];
  colspan: number;
  rowspan: number;
}

export interface AdvancedTableRow {
  _key: string;
  _type: "advancedTableRow";
  cells: AdvancedTableCell[];
}

export interface AdvancedTableBlock {
  _key: string;
  _type: "advancedTableBlock";
  hasHeaderRow: boolean;
  columnCount: number;
  rows: AdvancedTableRow[];
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
  body?: any[]; // Portable Text blocks
  readTime?: number; // estimated minutes, computed from body via GROQ
  seo?: {
    robots?: string;
    sitemap?: boolean;
  };
}

export interface HeroSection {
  _type: "heroSection";
  _key: string;
  layout?: "centered" | "split";
  eyebrow?: any[]; // inline portable text: bold, em, underline
  headline?: any[]; // portable text: h1 blocks (strong → gradient) + normal blocks (subheadline)
  ctas?: CtaItem[];
  showTrustBar?: boolean;
  backgroundImage?: SanityImage;
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
  content?: any[];
  faqs?: FaqItem[];
}

export interface FeatureTile {
  _key: string;
  icon?: SanityImage;
  title: string;
  body?: any[];
  ctas?: CtaItem[];
}

export interface FeatureGridSection {
  _type: "featureGridSection";
  _key: string;
  content?: any[];
  columns?: 2 | 3 | 4;
  tiles?: FeatureTile[];
  background?: "white" | "light";
}

export interface CtaStripSection {
  _type: "ctaStripSection";
  _key: string;
  content?: any[];
  ctas?: CtaItem[];
  background?: "white" | "brand" | "light";
}

export interface RecentBlogsSection {
  _type: "recentBlogsSection";
  _key: string;
  content?: any[];
  category?: Category;
  limit?: number;
  background?: "white" | "light";
}

export interface ServiceTile {
  _key: string;
  icon?: SanityImage;
  title: string;
  body?: any[];
  ctas?: CtaItem[];
}

export interface ServicesGridBlock {
  _type: "servicesGridBlock";
  _key: string;
  content?: any[];
  columns?: 3 | 4;
  tiles?: ServiceTile[];
}

export interface MediaAndTextBlock {
  _type: "mediaAndTextBlock";
  _key: string;
  image?: SanityImage;
  caption?: string;
  content?: any[];
  ctas?: CtaItem[];
  imagePosition?: "left" | "right";
}

export interface StatItem {
  _key: string;
  value: string;
  label: string;
  footnote?: string;
}

export interface StatsRowBlock {
  _type: "statsRowBlock";
  _key: string;
  stats?: StatItem[];
  layout?: "2-col" | "3-col" | "4-col";
}

export interface AlertBlock {
  _type: "alertBlock";
  _key: string;
  content?: any[];
  alertType?: "primary" | "warning" | "success" | "info";
}

export interface CalculatorBlock {
  _type: "calculatorBlock";
  _key: string;
  calculatorType: "rd" | "delaware" | "vropd" | "tax-return" | "ceo-salary" | "cash-burn";
}

export interface LogoItem {
  _key: string;
  name?: string;
  image?: SanityImage;
  url?: string;
}

export interface PressLogosBlock {
  _type: "pressLogosBlock";
  _key: string;
  content?: any[];
  logos?: LogoItem[];
  variant?: "clients" | "press" | "partners";
}

export interface NewsItem {
  _key: string;
  title: string;
  url?: string;
  publication?: string;
  date?: string;
}

export interface NewsBlock {
  _type: "newsBlock";
  _key: string;
  content?: any[];
  items?: NewsItem[];
}

export interface ContactFormBlock {
  _type: "contactFormBlock";
  _key: string;
  formType?: "consultation" | "newsletter";
}

export interface CustomEmbedBlock {
  _type: "customEmbedBlock";
  _key: string;
  embedId: string;
}

export interface FlexColumn {
  _key: string;
  columnWidth?: string;
  content?: any[];
}

export interface FlexRow {
  _key: string;
  paddingStyle?: string;
  columns?: FlexColumn[];
}

export interface FlexSectionBlock {
  _type: "flexSectionBlock";
  _key: string;
  backgroundStyle?: string;
  paddingStyle?: string;
  rows?: FlexRow[];
}

export type BlockPageSection =
  | HeroSection
  | TestimonialsSection
  | FaqSection
  | FeatureGridSection
  | CtaStripSection
  | RecentBlogsSection
  | ServicesGridBlock
  | MediaAndTextBlock
  | StatsRowBlock
  | AlertBlock
  | CalculatorBlock
  | PressLogosBlock
  | NewsBlock
  | ContactFormBlock
  | CustomEmbedBlock
  | FlexSectionBlock;

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
