import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { CtaStripSection as CtaStripSectionType } from "@kruze-poc/sanity-schemas/src/types";

interface RawSpan {
  _type: string;
  text?: string;
  marks?: string[];
}

function renderInline(children: RawSpan[], onDark: boolean): React.ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => {
    if (child._type === "break") return <br key={i} />;
    let node: React.ReactNode = child.text ?? "";
    if (child.marks?.includes("strong")) node = <strong key={i}>{node}</strong>;
    if (child.marks?.includes("em")) node = <em key={i}>{node}</em>;
    return <Fragment key={i}>{node}</Fragment>;
  });
}

export function CtaStripSection({ section }: { section: CtaStripSectionType }) {
  const bg = section.background ?? "white";
  const onDark = bg === "brand";

  const sectionClass = onDark
    ? "py-20 px-6"
    : bg === "light"
    ? "bg-neutral-50 py-20 px-6"
    : "bg-white py-20 px-6";

  return (
    <section
      className={sectionClass}
      style={onDark ? { background: "var(--gradient-cta)" } : undefined}
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
        {Array.isArray(section.content) && section.content.map((block: any, i: number) => {
          if (block._type !== "block") return null;
          const isH2 = block.style === "h2";
          const content = renderInline(block.children ?? [], onDark);
          if (isH2) {
            return (
              <h2
                key={i}
                className={`text-4xl lg:text-5xl font-bold tracking-tight ${onDark ? "text-white" : "text-primary"}`}
              >
                {content}
              </h2>
            );
          }
          return (
            <p
              key={i}
              className={`text-lg font-normal leading-relaxed ${onDark ? "text-white/80" : "text-secondary"}`}
            >
              {content}
            </p>
          );
        })}
        {section.ctas && section.ctas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {section.ctas.map((cta) =>
              cta.style === "secondary" ? (
                <a
                  key={cta._key}
                  href={cta.url ?? "#"}
                  className={`inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full ring-1 transition-fast focus-ring ${
                    onDark
                      ? "text-white ring-white/30 hover:bg-white/10"
                      : "text-brand-500 ring-brand-500 hover:bg-brand-50"
                  }`}
                >
                  {cta.text}
                </a>
              ) : (
                <a
                  key={cta._key}
                  href={cta.url ?? "#"}
                  className={`inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full shadow-md transition-fast focus-ring ${
                    onDark
                      ? "bg-white text-brand-800 hover:bg-neutral-100"
                      : "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-brand"
                  }`}
                >
                  {cta.text}
                  <ArrowRight size={18} strokeWidth={1.5} />
                </a>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
