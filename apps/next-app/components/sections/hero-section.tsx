import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { HeroSection as HeroSectionType, HeroCta } from "@kruze-poc/sanity-schemas/src/types";

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
            className={`text-lg font-normal text-neutral-500 leading-relaxed${layout === "centered" ? " max-w-xl" : " max-w-md"}`}
          >
            {content}
          </p>
        );
      })}
    </>
  );
}

// ── CTAs ──────────────────────────────────────────────────────────────────────

function CtaButtons({ ctas }: { ctas?: HeroCta[] }) {
  if (!ctas?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {ctas.map((cta) =>
        cta.style === "secondary" ? (
          <a key={cta._key} href={cta.url ?? "#"} className="inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-neutral-700 rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 focus-ring transition-all duration-200">
            {cta.text}
          </a>
        ) : (
          <a key={cta._key} href={cta.url ?? "#"} className="inline-flex items-center gap-2 px-5 py-3 text-base font-bold text-white rounded-full bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-brand focus-ring transition-all duration-200">
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

// ── Decorative glass dashboard (split layout only) ────────────────────────────

function GlassDashboard() {
  return (
    <div className="relative hidden lg:flex items-center justify-center min-h-[440px] py-8">
      <div className="glass rounded-2xl overflow-hidden w-80 hover-lift">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/50 bg-white/20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          </div>
          <span className="text-xs font-bold text-neutral-500 ml-1 tracking-tight">Financial Dashboard</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-4">
          <div className="bg-white/55 rounded-xl p-3 border border-white/70">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Runway</p>
            <p className="text-2xl font-black text-neutral-900 mt-0.5">18 mo</p>
            <span className="inline-flex items-center gap-1 text-xs font-black text-green-600 mt-0.5">On track</span>
          </div>
          <div className="bg-white/55 rounded-xl p-3 border border-white/70">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Burn</p>
            <p className="text-2xl font-black text-neutral-900 mt-0.5">$84K</p>
            <span className="text-xs font-bold text-brand-500 mt-0.5 block">/ month</span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="bg-white/55 rounded-xl p-3 border border-white/70">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-neutral-600">Revenue Growth</p>
              <span className="text-xs font-black text-green-600">↑ 340% YoY</span>
            </div>
            <svg width="100%" height="56" viewBox="0 0 220 56" preserveAspectRatio="none">
              <rect x="0"   y="42" width="26" height="14" rx="3" fill="rgba(47,116,178,.15)" />
              <rect x="32"  y="32" width="26" height="24" rx="3" fill="rgba(47,116,178,.28)" />
              <rect x="64"  y="22" width="26" height="34" rx="3" fill="rgba(47,116,178,.44)" />
              <rect x="96"  y="14" width="26" height="42" rx="3" fill="rgba(47,116,178,.62)" />
              <rect x="128" y="6"  width="26" height="50" rx="3" fill="rgba(47,116,178,.80)" />
              <rect x="160" y="0"  width="26" height="56" rx="3" fill="#2f74b2" />
            </svg>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-normal text-neutral-400">Q1 &apos;24</span>
              <span className="text-xs font-normal text-neutral-400">Q2 &apos;25</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-0 glass rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-md">
        <div className="icon-container icon-container-sm squircle bg-green-500 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-black text-neutral-900 leading-none">Audit Ready</p>
          <p className="text-xs font-normal text-neutral-400 leading-none mt-0.5">Books closed ✓</p>
        </div>
      </div>
      <div className="absolute bottom-4 -left-2 glass rounded-xl px-4 py-3 shadow-md">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">R&amp;D Credit Found</p>
        <p className="text-2xl font-black text-gradient-brand">$280K</p>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function HeroSection({ section }: { section: HeroSectionType }) {
  const layout = section.layout ?? "centered";

  return (
    <section className="bg-mesh-gradient">
      <div className="max-w-7xl mx-auto px-6">
        {layout === "split" ? (
          <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow blocks={section.eyebrow} />
              <HeadlineBlocks blocks={section.headline} layout="split" />
              <CtaButtons ctas={section.ctas} />
            </div>
            <GlassDashboard />
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
