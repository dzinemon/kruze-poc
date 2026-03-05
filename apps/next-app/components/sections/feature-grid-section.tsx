import type { FeatureGridSection as FeatureGridSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { ArrowRight } from "lucide-react";
import { KruzePortableText } from "@kruze-poc/ui/portable-text";

const colsClass: Record<number, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGridSection({ section }: { section: FeatureGridSectionType }) {
  const cols = section.columns ?? 3;
  const bgClass = section.background === "light" ? "bg-neutral-50" : "bg-white";

  return (
    <section className={`${bgClass} py-20 px-6`}>
      <div className="max-w-6xl mx-auto">
        {section.content && section.content.length > 0 && (
          <div className="text-center mb-12 flex flex-col gap-3">
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
                  <p key={b._key} className="text-lg font-normal text-text-secondary leading-relaxed max-w-2xl mx-auto">
                    {text}
                  </p>
                );
              })}
          </div>
        )}
        {section.tiles && section.tiles.length > 0 && (
          <div className={`grid ${colsClass[cols] ?? colsClass[3]} gap-6`}>
            {section.tiles.map((tile) => (
              <div
                key={tile._key}
                className="flex flex-col gap-4 p-6 rounded-xl bg-bg-subtle border border-border-subtle hover-lift"
              >
                {tile.icon?.asset?.url && (
                  <div
                    className="icon-container icon-container-xl squircle flex-shrink-0"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <img
                      src={tile.icon.asset.url}
                      alt=""
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-text-primary">{tile.title}</h3>
                  {Array.isArray(tile.body) && tile.body.length > 0 && (
                    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-base prose-p:font-normal prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-li:text-text-secondary prose-li:leading-relaxed">
                      <KruzePortableText value={tile.body} />
                    </div>
                  )}
                </div>
                {tile.link?.url && tile.link?.text && (
                  <a
                    href={tile.link.url}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-fast focus-ring"
                  >
                    {tile.link.text}
                    <ArrowRight width={14} height={14} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
