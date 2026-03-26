import { ctaSectionWrapper } from "../styles";
import { CtaContent } from "../cta-content";

interface CtaItemProps {
  _key?: string;
  text: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
}

interface CtaSectionBlockProps {
  variant: "boxed" | "flat" | "outlined";
  text?: any[];
  ctas?: CtaItemProps[];
}

export function CtaSectionBlock({ variant, text, ctas }: CtaSectionBlockProps) {
  const wrapperClass = ctaSectionWrapper[variant] ?? ctaSectionWrapper.boxed;

  return (
    <div className={`pt-block ${wrapperClass}`}>
      <div className="text-center flex flex-col gap-4">
        <CtaContent textBlocks={text} ctas={ctas} />
      </div>
    </div>
  );
}
