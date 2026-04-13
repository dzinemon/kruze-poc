import type { TestimonialsSection as TestimonialsSectionType } from "@kruze-poc/sanity-schemas/src/types";

interface TestimonialsSectionProps {
  section: TestimonialsSectionType;
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-container-lg mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl font-black text-body mb-8 text-center">
            {section.heading}
          </h2>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {section.testimonials?.map((t) => (
            <div
              key={t._id}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <blockquote className="text-secondary italic mb-4">
                &ldquo;{t.quoteText}&rdquo;
              </blockquote>

              <div className="flex items-center gap-2 md:gap-3">
                {t.contactImage?.asset?.url && (
                  <img
                    src={t.contactImage.asset.url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-body text-sm">{t.name}</p>
                  {t.role && (
                    <p className="text-xs text-dim">
                      {t.role}
                      {t.company && `, ${t.company}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
