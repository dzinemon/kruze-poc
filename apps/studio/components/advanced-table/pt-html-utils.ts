import { genKey } from "./table-utils";

/* ── Portable Text → HTML ─────────────────────────────────── */

const MARK_TO_TAG: Record<string, string> = {
  strong: "strong",
  em: "em",
  code: "code",
};

export function portableTextToHtml(blocks: any[] | undefined): string {
  if (!blocks || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      if (block._type !== "block") return "";
      const markDefs: any[] = block.markDefs || [];
      return (block.children || [])
        .map((span: any) => {
          let html = escapeHtml(span.text || "");
          const marks: string[] = span.marks || [];
          for (const mark of marks) {
            const tag = MARK_TO_TAG[mark];
            if (tag) {
              html = `<${tag}>${html}</${tag}>`;
            } else {
              const def = markDefs.find((d: any) => d._key === mark);
              if (def?._type === "link") {
                html = `<a href="${escapeAttr(def.href || "")}" data-link-key="${def._key}">${html}</a>`;
              }
            }
          }
          return html;
        })
        .join("");
    })
    .join("<br>");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── HTML → Portable Text ─────────────────────────────────── */

interface SpanData {
  text: string;
  marks: string[];
}

interface BlockData {
  spans: SpanData[];
  markDefs: any[];
}

const TAG_TO_MARK: Record<string, string> = {
  strong: "strong",
  b: "strong",
  em: "em",
  i: "em",
  code: "code",
};

export function htmlToPortableText(html: string): any[] {
  if (!html || !html.trim()) return [makeEmptyBlock()];

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild as HTMLElement;
  if (!root) return [makeEmptyBlock()];

  const blocks: BlockData[] = [{ spans: [], markDefs: [] }];

  function walk(node: Node, marks: string[], currentBlock: BlockData) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) {
        currentBlock.spans.push({ text, marks: [...marks] });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Line breaks → new block
    if (tag === "br") {
      blocks.push({ spans: [], markDefs: [] });
      return;
    }

    // Paragraph / div → new block (unless first and empty)
    if (tag === "p" || tag === "div") {
      if (blocks[blocks.length - 1].spans.length > 0) {
        blocks.push({ spans: [], markDefs: [] });
      }
      const block = blocks[blocks.length - 1];
      for (const child of Array.from(node.childNodes)) {
        walk(child, marks, block);
      }
      return;
    }

    const newMarks = [...marks];

    // Decorator marks
    const markName = TAG_TO_MARK[tag];
    if (markName && !newMarks.includes(markName)) {
      newMarks.push(markName);
    }

    // Link annotation
    if (tag === "a") {
      const href = el.getAttribute("href") || "";
      const existingKey = el.getAttribute("data-link-key");
      const key = existingKey || genKey();
      if (!currentBlock.markDefs.find((d) => d._key === key)) {
        currentBlock.markDefs.push({ _type: "link", _key: key, href });
      }
      if (!newMarks.includes(key)) {
        newMarks.push(key);
      }
    }

    for (const child of Array.from(node.childNodes)) {
      walk(child, newMarks, currentBlock);
    }
  }

  const firstBlock = blocks[0];
  for (const child of Array.from(root.childNodes)) {
    walk(child, [], blocks[blocks.length - 1]);
  }

  // Convert to PT format
  return blocks.map((block) => {
    const children =
      block.spans.length > 0
        ? consolidateSpans(block.spans).map((s) => ({
            _type: "span",
            _key: genKey(),
            text: s.text,
            marks: s.marks,
          }))
        : [{ _type: "span", _key: genKey(), text: "", marks: [] }];

    return {
      _type: "block",
      _key: genKey(),
      style: "normal",
      children,
      markDefs: block.markDefs,
    };
  });
}

/** Merge adjacent spans with identical marks */
function consolidateSpans(spans: SpanData[]): SpanData[] {
  const result: SpanData[] = [];
  for (const span of spans) {
    const prev = result[result.length - 1];
    if (prev && marksEqual(prev.marks, span.marks)) {
      prev.text += span.text;
    } else {
      result.push({ text: span.text, marks: [...span.marks] });
    }
  }
  return result;
}

function marksEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sorted = [...a].sort();
  const sortedB = [...b].sort();
  return sorted.every((v, i) => v === sortedB[i]);
}

function makeEmptyBlock() {
  return {
    _type: "block",
    _key: genKey(),
    style: "normal",
    children: [{ _type: "span", _key: genKey(), text: "", marks: [] }],
    markDefs: [],
  };
}
