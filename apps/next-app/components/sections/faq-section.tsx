import type { FaqSection as FaqSectionType } from "@kruze-poc/sanity-schemas/src/types";

interface FaqSectionProps {
  section: FaqSectionType;
}

export function FaqSection({ section }: FaqSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-container-lg mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl font-black text-body mb-8">
            {section.heading}
          </h2>
        )}

        <div className="space-y-4">
          {section.faqs?.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-200 rounded-lg"
            >
              <summary className="cursor-pointer px-6 py-4 font-bold text-body hover:text-primary transition-colors list-none flex items-center justify-between">
                {faq.question}
                <span className="text-muted group-open:rotate-180 transition-transform">
                  &#9662;
                </span>
              </summary>
              <div className="px-6 pb-4 text-secondary">
                {typeof faq.answer === "string" ? (
                  <p>{faq.answer}</p>
                ) : (
                  <p className="text-secondary">
                    {(faq.answer as Array<{ children?: Array<{ text: string }> }>)
                      ?.map((block) =>
                        block.children?.map((c) => c.text).join("")
                      )
                      .join(" ")}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
