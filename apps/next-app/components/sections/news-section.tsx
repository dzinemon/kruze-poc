import type { NewsBlock } from "@kruze-poc/sanity-schemas/src/types";

interface NewsSectionProps {
  section: NewsBlock;
}

export function NewsSection({ section }: NewsSectionProps) {
  return (
    <section className="py-16 px-4 bg-subtle">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-dim mb-8">newsBlock</p>
        {section.items && section.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item) => (
              <div key={item._key} className="rounded-md bg-base border border-divider p-6">
                <p className="text-sm text-dim">{item.publication}{item.date ? ` · ${item.date}` : ""}</p>
                {item.url ? (
                  <a href={item.url} className="text-base font-bold text-primary hover:text-brand-500 mt-2 block">
                    {item.title}
                  </a>
                ) : (
                  <p className="text-base font-bold text-primary mt-2">{item.title}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
