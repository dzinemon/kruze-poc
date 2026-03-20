import { genKey, makeBlock } from "./table-utils";
import { htmlToPortableText } from "./pt-html-utils";

interface ParsedCell {
  content: any[];
  colspan: number;
  rowspan: number;
  isHeader: boolean;
}

interface ParsedTable {
  rows: ParsedCell[][];
  columnCount: number;
  hasHeaderRow: boolean;
}

function makeAdvancedCell(content: any[], colspan = 1, rowspan = 1) {
  return {
    _type: "advancedTableCell",
    _key: genKey(),
    content,
    colspan,
    rowspan,
  };
}

function makeAdvancedRow(cells: any[]) {
  return {
    _type: "advancedTableRow",
    _key: genKey(),
    cells,
  };
}

/**
 * Parse an HTML string containing a table, preserving colspan/rowspan
 * and inline formatting (bold, italic, links).
 */
export function parseHtmlTableAdvanced(html: string): ParsedTable | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const tableEl = doc.querySelector("table");
  if (!tableEl) return null;

  const trElements = Array.from(tableEl.querySelectorAll("tr"));
  if (trElements.length === 0) return null;

  let maxCols = 0;
  const rawRows: ParsedCell[][] = [];
  const occupied: boolean[][] = [];

  for (let r = 0; r < trElements.length; r++) {
    if (!occupied[r]) occupied[r] = [];
    const tr = trElements[r];
    const tdElements = Array.from(tr.querySelectorAll("td, th"));
    const row: ParsedCell[] = [];
    let col = 0;

    for (const td of tdElements) {
      while (occupied[r]?.[col]) col++;

      const cs = parseInt(td.getAttribute("colspan") || "1", 10) || 1;
      const rs = parseInt(td.getAttribute("rowspan") || "1", 10) || 1;
      const isHeader = td.tagName.toLowerCase() === "th";

      // Preserve inline formatting by converting innerHTML to PT
      const cellHtml = (td as HTMLElement).innerHTML?.trim() ?? "";
      const content = cellHtml
        ? htmlToPortableText(cellHtml)
        : [makeBlock("")];

      row.push({ content, colspan: cs, rowspan: rs, isHeader });

      for (let dr = 0; dr < rs; dr++) {
        for (let dc = 0; dc < cs; dc++) {
          if (!occupied[r + dr]) occupied[r + dr] = [];
          occupied[r + dr][col + dc] = true;
        }
      }

      col += cs;
    }

    if (col > maxCols) maxCols = col;
    rawRows.push(row);
  }

  const hasHeaderRow =
    rawRows.length > 0 && rawRows[0].every((cell) => cell.isHeader);

  return { rows: rawRows, columnCount: maxCols, hasHeaderRow };
}

/**
 * Parse TSV text (tab-separated values) into a table structure.
 * No colspan/rowspan support — all cells are 1x1.
 */
export function parseTsvTable(text: string): ParsedTable | null {
  const lines = text.split("\n").filter((l) => l.includes("\t"));
  if (lines.length === 0) return null;

  const rows = lines.map((line) =>
    line.split("\t").map((cell) => ({
      content: [makeBlock(cell.trim())],
      colspan: 1,
      rowspan: 1,
      isHeader: false,
    }))
  );

  const columnCount = Math.max(...rows.map((r) => r.length));
  return { rows, columnCount, hasHeaderRow: true };
}

/**
 * Build a complete advancedTableBlock value from parsed table data.
 */
export function buildAdvancedTableBlock(parsed: ParsedTable) {
  const rows = parsed.rows.map((row) =>
    makeAdvancedRow(
      row.map((cell) =>
        makeAdvancedCell(cell.content, cell.colspan, cell.rowspan)
      )
    )
  );

  return {
    _type: "advancedTableBlock",
    _key: genKey(),
    hasHeaderRow: parsed.hasHeaderRow,
    columnCount: parsed.columnCount,
    rows,
  };
}
