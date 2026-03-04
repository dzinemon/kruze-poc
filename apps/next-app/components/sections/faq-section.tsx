import type { FaqSection as FaqSectionType } from "@kruze-poc/sanity-schemas/src/types";

interface FaqSectionProps {
  section: FaqSectionType;
}

export function FaqSection({ section }: FaqSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-container-lg mx-auto px-4">
        {section.content && section.content.length > 0 && (
          <div className="mb-8 flex flex-col gap-3">
            {section.content
              .filter((b: any) => b._type === "block")
              .map((b: any) => {
                const text = (b.children ?? []).map((c: any) => c.text ?? "").join("");
                if (b.style === "h2") {
                  return (
                    <h2 key={b._key} className="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                      {text}
                    </h2>
                  );
                }
                return (
                  <p key={b._key} className="text-lg font-normal text-text-secondary leading-relaxed">
                    {text}
                  </p>
                );
              })}
          </div>
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
