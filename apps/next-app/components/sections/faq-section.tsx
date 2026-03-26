"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqSection as FaqSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { heading } from "@kruze-poc/ui/styles";

interface FaqSectionProps {
  section: FaqSectionType;
}

interface PortableBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: { text: string }[];
}

function extractText(answer: unknown): string {
  if (typeof answer === "string") return answer;
  const blocks = answer as PortableBlock[];
  return blocks?.map((block) => block.children?.map((c) => c.text).join("")).join(" ") ?? "";
}

export function FaqSection({ section }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const contentBlocks = (section.content ?? []).filter(
    (b: PortableBlock) => b._type === "block"
  ) as PortableBlock[];

  const faqs = section.faqs ?? [];
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: extractText(faq.answer),
      },
    })),
  };

  return (
    <section className="py-20 px-6 bg-white dark:bg-[var(--color-base)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        {contentBlocks.length > 0 && (
          <div className="mb-12 flex flex-col gap-4 text-center">
            {contentBlocks.map((b) => {
              const text = (b.children ?? []).map((c) => c.text).join("");
              if (b.style === "h2") {
                return (
                  <h2
                    key={b._key}
                    className={heading.h2}
                  >
                    {text}
                  </h2>
                );
              }
              return (
                <p key={b._key} className="text-lg font-normal text-secondary leading-relaxed">
                  {text}
                </p>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const triggerId = `faq-trigger-${i}`;

            return (
              <div
                key={i}
                className="rounded-md border border-rule bg-subtle shadow-xs overflow-hidden"
              >
                {/* h3 wrapping the button: ARIA Accordion Pattern — helps crawlers
                    understand question hierarchy and qualifies for FAQPage rich results */}
                <div className="m-0">
                  <button
                    id={triggerId}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-bold text-primary hover:text-brand-500 focus-ring"
                    style={{ transition: "color var(--transition-fast)" }}
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-base">{faq.question}</span>
                    <ChevronDown
                      width={20}
                      height={20}
                      strokeWidth={1.5}
                      className="flex-shrink-0 text-dim"
                      aria-hidden="true"
                      style={{
                        transition: "transform var(--transition-base)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                </div>

                {/* Content stays in DOM (not conditionally rendered) so crawlers
                    index it. max-height animation keeps it visually hidden when closed
                    without removing it from the accessibility tree. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="overflow-hidden"
                  style={{
                    maxHeight: isOpen ? "600px" : "0px",
                    transition: "max-height var(--transition-spring)",
                  }}
                >
                  <div className="px-6 pb-5 pt-0">
                    <div className="border-t border-divider pt-4">
                      <p className="text-base font-normal text-secondary leading-relaxed">
                        {extractText(faq.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
