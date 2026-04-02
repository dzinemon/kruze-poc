import type { BlockPageSection } from "@kruze-poc/sanity-schemas/src/types";
import { HeroSection } from "./sections/hero-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { FaqSection } from "./sections/faq-section";
import { FeatureGridSection } from "./sections/feature-grid-section";
import { CtaStripSection } from "./sections/cta-strip-section";
import { RecentBlogsSection } from "./sections/recent-blogs-section";
import { ServicesGridSection } from "./sections/services-grid-section";
import { MediaAndTextSection } from "./sections/media-and-text-section";
import { StatsRowSection } from "./sections/stats-row-section";
import { AlertSection } from "./sections/alert-section";
import { CalculatorSection } from "./sections/calculator-section";
import { PressLogosSection } from "./sections/press-logos-section";
import { NewsSection } from "./sections/news-section";
import { ContactFormSection } from "./sections/contact-form-section";
import { ContactFormMultistep } from "./sections/contact-form-multistep";
import { CustomEmbedSection } from "./sections/custom-embed-section";
import { FlexSection } from "./sections/flex-section";

interface SectionRendererProps {
  section: BlockPageSection;
}

export async function SectionRenderer({ section }: SectionRendererProps) {
  switch (section._type) {
    case "heroSection":
      return <HeroSection section={section} />;
    case "testimonialsSection":
      return <TestimonialsSection section={section} />;
    case "faqSection":
      return <FaqSection section={section} />;
    case "featureGridSection":
      return <FeatureGridSection section={section} />;
    case "ctaStripSection":
      return <CtaStripSection section={section} />;
    case "recentBlogsSection":
      return <RecentBlogsSection section={section} />;
    case "servicesGridBlock":
      return <ServicesGridSection section={section} />;
    case "mediaAndTextBlock":
      return <MediaAndTextSection section={section} />;
    case "statsRowBlock":
      return <StatsRowSection section={section} />;
    case "alertBlock":
      return <AlertSection section={section} />;
    case "calculatorBlock":
      return <CalculatorSection section={section} />;
    case "pressLogosBlock":
      return <PressLogosSection section={section} />;
    case "newsBlock":
      return <NewsSection section={section} />;
    case "multiStepContactBlock":
      return <ContactFormMultistep section={section} />;
    case "contactFormBlock":
      return <ContactFormSection section={section} />;
    case "customEmbedBlock":
      return <CustomEmbedSection section={section} />;
    case "flexSectionBlock":
      return <FlexSection section={section} />;
    default:
      return null;
  }
}
