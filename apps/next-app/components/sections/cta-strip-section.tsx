import type { CtaStripSection as CtaStripSectionType } from "@kruze-poc/sanity-schemas/src/types";
import { CtaContent } from "@kruze-poc/ui/cta-content";
import { heading } from "@kruze-poc/ui/styles";

const darkColors = {
  h2: `${heading.h2.replace("text-primary", "text-white")}`,
  paragraph: "text-lg font-normal leading-relaxed text-white/80",
  ctaPrimary:
    "inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full shadow-md transition-fast focus-ring bg-white text-brand-800 hover:bg-neutral-100",
  ctaSecondary:
    "inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full ring-1 transition-fast focus-ring text-white ring-white/30 hover:bg-white/10",
};

const lightColors = {
  ctaPrimary:
    "inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full shadow-md transition-fast focus-ring bg-brand-500 text-white hover:bg-brand-600 hover:shadow-brand",
  ctaSecondary:
    "inline-flex items-center gap-2 px-7 py-3 text-base font-bold rounded-full ring-1 transition-fast focus-ring text-brand-500 ring-brand-500 hover:bg-brand-50",
};

export function CtaStripSection({ section }: { section: CtaStripSectionType }) {
  const bg = section.background ?? "white";
  const onDark = bg === "brand";

  const sectionClass = onDark
    ? "py-20 px-6"
    : bg === "light"
    ? "bg-subtle py-20 px-6"
    : "bg-base py-20 px-6";

  return (
    <section
      className={sectionClass}
      style={onDark ? { background: "var(--gradient-cta)" } : undefined}
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
        <CtaContent
          textBlocks={section.content}
          ctas={section.ctas}
          colors={onDark ? darkColors : lightColors}
        />
      </div>
    </section>
  );
}
