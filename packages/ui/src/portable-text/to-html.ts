import {
  toHTML,
  type PortableTextHtmlComponents,
} from "@portabletext/to-html";
import { responsiveImageData } from "../image/sanity-image-url";

const components: PortableTextHtmlComponents = {
  types: {
    image: ({ value }) => {
      const caption = value.caption
        ? `<figcaption class="mt-2 text-sm text-muted text-center">${value.caption}</figcaption>`
        : "";
      if (value.asset?._id) {
        const img = responsiveImageData(value);
        const lqip = img.lqip
          ? ` style="background-image:url(${img.lqip});background-size:cover;background-position:center" onload="this.style.backgroundImage=''"`
          : "";
        return `<figure class="my-8"><img src="${img.src}" srcset="${img.srcset}" sizes="(max-width: 768px) 100vw, 800px" width="${img.width}" height="${img.height}" alt="${value.alt || ""}" class="rounded-md w-full" loading="lazy" decoding="async"${lqip} />${caption}</figure>`;
      }
      return `<figure class="my-8"><img src="${value.asset.url}" alt="${value.alt || ""}" class="rounded-md w-full" loading="lazy" />${caption}</figure>`;
    },

    chartBlock: ({ value }) =>
      `<div class="my-8 not-prose" data-chart-block='${JSON.stringify(value)}'><p class="text-sm text-muted italic text-center py-8">[Interactive chart: ${value.title || value.chartType}]</p></div>`,

    ctaBlock: ({ value }) => {
      const styles: Record<string, string> = {
        primary:
          "bg-primary text-white hover:bg-primary-dark",
        secondary:
          "bg-secondary text-white hover:bg-gray-700",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      };
      const cls = styles[value.style || "primary"];
      return `<div class="my-6 not-prose"><a href="${value.url || "#"}" class="inline-block px-6 py-3 rounded-btn font-bold transition-colors ${cls}">${value.text}</a></div>`;
    },

    alertBlock: ({ value }) => {
      const colors: Record<string, string> = {
        info: "bg-blue-50 border-info text-blue-900",
        warning: "bg-yellow-50 border-warning text-yellow-900",
        success: "bg-green-50 border-success text-green-900",
        danger: "bg-red-50 border-danger text-red-900",
      };
      const cls = colors[value.alertType || "info"];
      return `<div class="my-6 p-4 border-l-4 rounded-md not-prose ${cls}">${value.content}</div>`;
    },

    youtubeBlock: ({ value }) =>
      `<div class="my-8 aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/${value.videoId}" title="${value.caption || "YouTube video"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-md" loading="lazy"></iframe></div>`,
  },

  marks: {
    link: ({ children, value }) => {
      const target = value?.blank ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${value?.href}"${target}>${children}</a>`;
    },
  },
};

export function renderPortableTextHtml(blocks: unknown[]): string {
  if (!blocks || blocks.length === 0) return "";
  return toHTML(blocks, { components });
}
