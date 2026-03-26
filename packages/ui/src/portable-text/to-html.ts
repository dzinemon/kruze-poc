import {
  toHTML,
  type PortableTextHtmlComponents,
} from "@portabletext/to-html";
import { responsiveImageData } from "../image/sanity-image-url";
import { buildChartJsonConfig } from "../chart/build-chart-config";
import { cta, heading, text, ctaSectionWrapper } from "../styles";

const components: Partial<PortableTextHtmlComponents> = {
  block: {
    hr: () => `<hr class="my-4 border-t border-rule" />`,
  },
  types: {
    hr: () => `<hr class="my-8 border-t border-rule" />`,
    image: ({ value }) => {
      const caption = value.caption
        ? `<figcaption class="mt-2 text-sm text-dim text-center">${value.caption}</figcaption>`
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

    chartReference: ({ value }) => {
      if (!value.chart) return "";
      const jsonConfig = buildChartJsonConfig(value.chart);
      const block = { jsonConfig, title: value.chart.title, aspectRatio: value.chart.aspectRatio ?? "4/3" };
      return `<div class="pt-block my-8" data-chart-block='${JSON.stringify(block)}'><p class="text-sm text-dim italic text-center py-8">[Chart: ${value.chart.title ?? "Interactive chart"}]</p></div>`;
    },

    ctaSectionBlock: ({ value }) => {
      const variant: string = value.variant ?? "boxed";
      const wrapperCls = ctaSectionWrapper[variant as keyof typeof ctaSectionWrapper] ?? ctaSectionWrapper.boxed;

      let textHtml = "";
      if (Array.isArray(value.text)) {
        textHtml = value.text
          .filter((b: any) => b._type === "block")
          .map((block: any) => {
            const inline = (block.children ?? [])
              .map((c: any) => {
                let t = c.text ?? "";
                if (c.marks?.includes("strong")) t = `<strong>${t}</strong>`;
                if (c.marks?.includes("em")) t = `<em>${t}</em>`;
                return t;
              })
              .join("");
            const style = block.style ?? "normal";
            if (style === "h2")
              return `<h2 class="${heading.h2}">${inline}</h2>`;
            if (style === "h3")
              return `<h3 class="${heading.h3}">${inline}</h3>`;
            if (style === "h4")
              return `<h4 class="${heading.h4}">${inline}</h4>`;
            return `<p class="${text.sectionLead}">${inline}</p>`;
          })
          .join("");
      }

      let ctasHtml = "";
      if (Array.isArray(value.ctas) && value.ctas.length > 0) {
        const buttons = value.ctas
          .map((ctaItem: any) => {
            const cls = cta[ctaItem.style as keyof typeof cta ?? "primary"] ?? cta.primary;
            const arrow =
              ctaItem.style !== "secondary" && ctaItem.style !== "outline"
                ? ` <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
                : "";
            return `<a href="${ctaItem.url || "#"}" class="${cls}">${ctaItem.text}${arrow}</a>`;
          })
          .join("");
        ctasHtml = `<div class="flex flex-wrap justify-center gap-3 mt-2">${buttons}</div>`;
      }

      return `<div class="pt-block ${wrapperCls}"><div class="text-center flex flex-col gap-4">${textHtml}${ctasHtml}</div></div>`;
    },

    alertBlock: ({ value }) => {
      const configs: Record<string, { classes: string; icon: string }> = {
        info: {
          classes: "bg-info-bg border-info-border text-info-text",
          icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
        },
        warning: {
          classes: "bg-warning-bg border-warning-border text-warning-text",
          icon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
        },
        success: {
          classes: "bg-success-bg border-success-border text-success-text",
          icon: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
        },
        danger: {
          classes: "bg-danger-bg border-danger-border text-danger-text",
          icon: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
        },
      };
      const { classes, icon } = configs[value.alertType || "info"];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5" aria-hidden="true">${icon}</svg>`;

      let contentHtml = "";
      if (Array.isArray(value.content)) {
        const items: string[] = [];
        let listItems: string[] = [];

        const flushList = () => {
          if (listItems.length > 0) {
            items.push(`<ul class="list-disc list-inside space-y-1">${listItems.join("")}</ul>`);
            listItems = [];
          }
        };

        for (const block of value.content) {
          if (block._type !== "block") continue;
          const inline = (block.children ?? [])
            .map((c: any) => {
              let t = c.text ?? "";
              if (c.marks?.includes("strong")) t = `<strong>${t}</strong>`;
              if (c.marks?.includes("em")) t = `<em>${t}</em>`;
              return t;
            })
            .join("");

          if (block.listItem === "bullet") {
            listItems.push(`<li>${inline}</li>`);
            continue;
          }

          flushList();

          const style = block.style ?? "normal";
          if (style === "h2") items.push(`<h2 class="${heading.h2}">${inline}</h2>`);
          else if (style === "h3") items.push(`<h3 class="${heading.h3}">${inline}</h3>`);
          else if (style === "h4") items.push(`<h4 class="${heading.h4}">${inline}</h4>`);
          else items.push(`<p class="${text.body}">${inline}</p>`);
        }

        flushList();
        contentHtml = items.join("");
      } else {
        contentHtml = `<p>${value.content || ""}</p>`;
      }

      return `<div class="pt-block my-8 p-4 border rounded-sm flex items-start gap-3 ${classes}">${svg}<div class="text-base leading-relaxed space-y-3">${contentHtml}</div></div>`;
    },

    youtubeBlock: ({ value }) =>
      `<div class="pt-block my-8 aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/${value.videoId}" title="${value.caption || "YouTube video"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-md" loading="lazy"></iframe></div>`,

    richTableBlock: ({ value }) => {
      if (!value.rows || value.rows.length === 0) {
        return `<div class="my-8"></div>`;
      }

      const hasColTitles = value.hasColumnTitles !== false;

      const renderCell = (cell: any): string =>
        cell.content ? toHTML(cell.content, { components }) : "";

      const bodyRowsForCheck = hasColTitles ? value.rows.slice(1) : value.rows;
      const hasRowTitles = value.hasRowTitles !== false && bodyRowsForCheck.some((row: any) => row.title);

      let thead = "";
      let bodyRows = value.rows;

      if (hasColTitles && value.rows.length > 0) {
        const headerRow = value.rows[0];
        bodyRows = value.rows.slice(1);
        const cells = headerRow.cells || [];

        const ths = cells
          .map((cell: any) =>
            `<th class="px-4 py-3 text-left font-bold text-primary">${renderCell(cell)}</th>`
          )
          .join("");
        const rowTh = hasRowTitles
          ? `<th class="px-4 py-3"></th>`
          : "";

        thead = `<thead><tr>${rowTh}${ths}</tr></thead>`;
      }

      const tbodyRows = bodyRows
        .map((row: any) => {
          const cells = row.cells || [];
          const rowTitle = hasRowTitles
            ? `<th class="px-4 py-3 font-normal text-left text-primary whitespace-nowrap">${row.title || ""}</th>`
            : "";
          const tds = cells
            .map((cell: any) =>
              `<td class="px-4 py-2 text-primary">${renderCell(cell)}</td>`
            )
            .join("");
          return `<tr>${rowTitle}${tds}</tr>`;
        })
        .join("");

      return `<div class="pt-block my-8"><div class="kruze-table"><table class="text-sm">${thead}<tbody>${tbodyRows}</tbody></table></div></div>`;
    },

    advancedTableBlock: ({ value }) => {
      if (!value.rows || value.rows.length === 0) return `<div class="my-8"></div>`;

      const renderCell = (cell: any): string =>
        cell.content ? toHTML(cell.content, { components }) : "";

      const spanAttrs = (cell: any): string => {
        let attrs = "";
        if (cell.colspan > 1) attrs += ` colspan="${cell.colspan}"`;
        if (cell.rowspan > 1) attrs += ` rowspan="${cell.rowspan}"`;
        return attrs;
      };

      let thead = "";
      let bodyRows = value.rows;

      if (value.hasHeaderRow && value.rows.length > 0) {
        const headerRow = value.rows[0];
        bodyRows = value.rows.slice(1);
        const ths = (headerRow.cells || [])
          .map(
            (cell: any) =>
              `<th class="px-4 py-3 text-left font-bold text-primary"${spanAttrs(cell)}>${renderCell(cell)}</th>`
          )
          .join("");
        thead = `<thead><tr>${ths}</tr></thead>`;
      }

      const tbodyRows = bodyRows
        .map((row: any) => {
          const tds = (row.cells || [])
            .map(
              (cell: any) =>
                `<td class="px-4 py-2 text-primary"${spanAttrs(cell)}>${renderCell(cell)}</td>`
            )
            .join("");
          return `<tr>${tds}</tr>`;
        })
        .join("");

      return `<div class="pt-block my-8"><div class="kruze-table"><table class="text-sm">${thead}<tbody>${tbodyRows}</tbody></table></div></div>`;
    },
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
  return toHTML(blocks as Parameters<typeof toHTML>[0], { components });
}
