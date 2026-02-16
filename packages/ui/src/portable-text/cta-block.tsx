interface CtaBlockProps {
  text: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
}

const styleClasses = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-secondary text-white hover:bg-body",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
};

export function CtaBlock({ text, url, style = "primary" }: CtaBlockProps) {
  return (
    <div className="my-8 text-center">
      <a
        href={url || "#"}
        className={`inline-block px-8 py-3 rounded-btn font-bold transition-colors ${styleClasses[style]}`}
      >
        {text}
      </a>
    </div>
  );
}
