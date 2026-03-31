import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { HeroSection as HeroSectionType, CtaItem } from "@kruze-poc/sanity-schemas/src/types";
import { cta as ctaStyles } from "@kruze-poc/ui/styles";
import { imageBuilder } from "@/lib/sanity";

// ── Inline portable text renderer ────────────────────────────────────────────
// Handles the limited mark set used in hero fields (strong, em, underline).
// strong inside an h1 block renders as gradient; in normal blocks renders bold.

interface RawSpan {
  _type: string;
  text?: string;
  marks?: string[];
}

function applyMarks(text: string, marks: string[], gradientStrong: boolean): React.ReactNode {
  let node: React.ReactNode = text;
  if (marks.includes("strong")) {
    node = gradientStrong
      ? <span className="text-gradient-brand">{node}</span>
      : <strong>{node}</strong>;
  }
  if (marks.includes("em")) node = <em>{node}</em>;
  if (marks.includes("underline")) node = <span className="underline">{node}</span>;
  return node;
}

function renderInline(children: RawSpan[], gradientStrong = false): React.ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) =>
    child._type === "break" ? (
      <br key={i} />
    ) : (
      <Fragment key={i}>{applyMarks(child.text ?? "", child.marks ?? [], gradientStrong)}</Fragment>
    )
  );
}

// ── Eyebrow ───────────────────────────────────────────────────────────────────

function Eyebrow({ blocks }: { blocks?: any[] }) {
  if (!Array.isArray(blocks) || !blocks.length) return null;
  return (
    <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full border border-brand-200">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
      {renderInline(blocks[0]?.children ?? [])}
    </span>
  );
}

// ── Headline + subheadline blocks ─────────────────────────────────────────────

function HeadlineBlocks({ blocks, layout }: { blocks?: any[]; layout: "centered" | "split" }) {
  if (!Array.isArray(blocks) || !blocks.length) return null;
  return (
    <>
      {blocks.map((block, i) => {
        if (block._type !== "block") return null;
        const isH1 = block.style === "h1";
        const content = renderInline(block.children ?? [], isH1);
        if (isH1) {
          return (
            <h1
              key={i}
              className={`text-6xl font-bold text-neutral-900 tracking-tight leading-[1.05]${layout === "centered" ? " max-w-3xl" : ""}`}
            >
              {content}
            </h1>
          );
        }
        return (
          <p
            key={i}
            className={`text-lg font-normal text-neutral-500 leading-relaxed${layout === "centered" ? " max-w-2xl" : " max-w-xl"}`}
          >
            {content}
          </p>
        );
      })}
    </>
  );
}

// ── CTAs ──────────────────────────────────────────────────────────────────────

function CtaButtons({ ctas }: { ctas?: CtaItem[] }) {
  if (!ctas?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {ctas.map((cta) =>
        cta.style === "secondary" ? (
          <a key={cta._key} href={cta.url ?? "#"} className={ctaStyles.secondary}>
            {cta.text}
          </a>
        ) : (
          <a key={cta._key} href={cta.url ?? "#"} className={ctaStyles.primary}>
            {cta.text}
            <ArrowRight size={18} strokeWidth={1.5} />
          </a>
        )
      )}
    </div>
  );
}

// ── Trust bar ─────────────────────────────────────────────────────────────────

function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-neutral-200 w-full max-w-xl">
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Backed by investors at</span>
      <span className="text-sm font-black text-neutral-400">Y Combinator</span>
      <span className="text-sm font-black text-neutral-400">Andreessen</span>
      <span className="text-sm font-black text-neutral-400">Sequoia</span>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function HeroSection({ section }: { section: HeroSectionType }) {
  const layout = section.layout ?? "centered";

  const bgImageUrl = section.backgroundImage?.asset
    ? imageBuilder.image(section.backgroundImage).width(1600).quality(80).auto("format").url()
    : null;

  const sectionClass = bgImageUrl
    ? (layout === "split" ? "hero-bg-split" : "hero-bg-centered")
    : "bg-hero-gradient";

  const sectionStyle = bgImageUrl
    ? ({ "--hero-bg-image": `url(${bgImageUrl})` } as React.CSSProperties)
    : undefined;

  return (
    <section className={sectionClass} style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-6">
        {layout === "split" ? (
          <div className="py-20 flex flex-col gap-6 max-w-4xl">
            <Eyebrow blocks={section.eyebrow} />
            <HeadlineBlocks blocks={section.headline} layout="split" />
            <CtaButtons ctas={section.ctas} />
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center text-center gap-7">
            <Eyebrow blocks={section.eyebrow} />
            <HeadlineBlocks blocks={section.headline} layout="centered" />
            <CtaButtons ctas={section.ctas} />
            {section.showTrustBar && <TrustBar />}
          </div>
        )}
      </div>
    </section>
  );
}
