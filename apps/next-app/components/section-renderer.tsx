import type { BlockPageSection } from "@kruze-poc/sanity-schemas/src/types";
import { HeroSection } from "./sections/hero-section";
import { TextSection } from "./sections/text-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { FaqSection } from "./sections/faq-section";
import { ChartSection } from "./sections/chart-section";

interface SectionRendererProps {
  section: BlockPageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section._type) {
    case "heroSection":
      return <HeroSection section={section} />;
    case "textSection":
      return <TextSection section={section} />;
    case "testimonialsSection":
      return <TestimonialsSection section={section} />;
    case "faqSection":
      return <FaqSection section={section} />;
    case "chartSection":
      return <ChartSection section={section} />;
    default:
      return null;
  }
}
