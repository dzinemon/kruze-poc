import { useCallback, useEffect, useRef } from "react";
import { ArrayOfObjectsInputProps, insert, PatchEvent } from "sanity";

function genKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function makeSpan(text: string) {
  return { _type: "span", _key: genKey(), text, marks: [] };
}

function makeBlock(text: string) {
  return {
    _type: "block",
    _key: genKey(),
    style: "normal",
    children: [makeSpan(text)],
    markDefs: [],
  };
}

function makeCell(text: string) {
  return {
    _type: "richTableCell",
    _key: genKey(),
    content: [makeBlock(text)],
  };
}

// Note: _type must be "row" (the defineArrayMember name), not "richTableRow" (the type name)
function makeRow(cells: string[]) {
  return {
    _type: "row",
    _key: genKey(),
    cells: cells.map(makeCell),
  };
}

function parseHtmlTable(html: string): string[][] | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rows = Array.from(doc.querySelectorAll("table tr"));
  if (rows.length === 0) return null;
  return rows.map((row) =>
    Array.from(row.querySelectorAll("td, th")).map(
      (cell) => (cell as HTMLElement).innerText.trim()
    )
  );
}

function parseTsv(text: string): string[][] | null {
  const lines = text.split("\n").filter((l) => l.includes("\t"));
  if (lines.length === 0) return null;
  return lines.map((line) => line.split("\t").map((cell) => cell.trim()));
}

function buildRichTableBlock(rows: string[][]) {
  const colCount = Math.max(...rows.map((r) => r.length), 0);
  const columnHeaders = Array.from({ length: colCount }, (_, i) => ({
    _type: "columnHeader",
    _key: genKey(),
    cellIndex: i,
  }));

  return {
    _type: "richTableBlock",
    _key: genKey(),
    hasColumnTitles: true,
    hasRowTitles: false,
    columnHeaders,
    rows: rows.map(makeRow),
  };
}

export function PortableTextWithPaste(props: ArrayOfObjectsInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;

      const html = e.clipboardData.getData("text/html");
      const plain = e.clipboardData.getData("text/plain");

      let tableData: string[][] | null = null;

      if (html && html.includes("<table")) {
        tableData = parseHtmlTable(html);
      } else if (plain && plain.includes("\t")) {
        tableData = parseTsv(plain);
      }

      if (!tableData || tableData.length === 0) return;

      e.preventDefault();
      e.stopPropagation();

      const block = buildRichTableBlock(tableData);
      onChangeRef.current(PatchEvent.from(insert([block], "after", [-1])));
    };

    container.addEventListener("paste", handler, { capture: true });
    return () => container.removeEventListener("paste", handler, { capture: true });
  }, []);

  return (
    <div ref={containerRef}>
      {props.renderDefault(props)}
    </div>
  );
}
