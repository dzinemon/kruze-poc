import { ArrowRight } from "lucide-react";
import { cta as ctaStyles, heading, text } from "./styles";
import { renderInline } from "./render-inline";

interface CtaItem {
  _key?: string;
  text: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
}

interface ColorOverrides {
  h2?: string;
  h3?: string;
  h4?: string;
  paragraph?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

interface CtaContentProps {
  textBlocks?: any[];
  ctas?: CtaItem[];
  colors?: ColorOverrides;
}

/** Shared inner content for CTA sections: text blocks + CTA buttons.
 *  Used by both CtaSectionBlock (portable text) and CtaStripSection (block page). */
export function CtaContent({ textBlocks, ctas, colors }: CtaContentProps) {
  return (
    <>
      {Array.isArray(textBlocks) &&
        textBlocks.map((block: any, i: number) => {
          if (block._type !== "block") return null;
          const content = renderInline(block.children ?? []);
          const style = block.style ?? "normal";

          if (style === "h2") {
            return (
              <h2 key={block._key ?? i} className={colors?.h2 ?? heading.h2}>
                {content}
              </h2>
            );
          }
          if (style === "h3") {
            return (
              <h3 key={block._key ?? i} className={colors?.h3 ?? heading.h3}>
                {content}
              </h3>
            );
          }
          if (style === "h4") {
            return (
              <h4 key={block._key ?? i} className={colors?.h4 ?? heading.h4}>
                {content}
              </h4>
            );
          }
          return (
            <p key={block._key ?? i} className={colors?.paragraph ?? text.sectionLead}>
              {content}
            </p>
          );
        })}

      {ctas && ctas.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {ctas.map((ctaItem, i) => {
            const isPrimary = !ctaItem.style || ctaItem.style === "primary";
            const isSecondary = ctaItem.style === "secondary" || ctaItem.style === "outline";
            const cls = isPrimary
              ? (colors?.ctaPrimary ?? ctaStyles.primary)
              : (colors?.ctaSecondary ?? ctaStyles[ctaItem.style ?? "secondary"]);

            return (
              <a key={ctaItem._key ?? i} href={ctaItem.url ?? "#"} className={cls}>
                {ctaItem.text}
                {isPrimary && (
                  <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                )}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
