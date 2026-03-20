import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Stack } from "@sanity/ui";
import type { ObjectInputProps } from "sanity";
import { set } from "sanity";
import { TableToolbar } from "./table-toolbar";
import { TableGrid } from "./table-grid";
import {
  type Selection,
  normalizeSelection,
  canMerge,
  mergeCells,
  unmergeCells,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,
  makeRow,
  buildOccupancyGrid,
} from "./table-utils";
import {
  parseHtmlTableAdvanced,
  parseTsvTable,
  buildAdvancedTableBlock,
} from "./table-paste-handler";

/**
 * Patch individual fields — never replace the whole object,
 * which would strip the _key Sanity uses for the Portable Text array.
 */
function fieldPatches(fields: Record<string, unknown>) {
  return Object.entries(fields).map(([key, val]) => set(val, [key]));
}

export function AdvancedTableInput(props: ObjectInputProps) {
  const { value, onChange } = props;

  const rows: any[] = value?.rows || [];
  const columnCount: number = value?.columnCount || 3;
  const hasHeaderRow: boolean = value?.hasHeaderRow ?? true;

  const [selection, setSelection] = useState<Selection | null>(null);

  // Initialize with empty 3x3 table if no rows
  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 3 }, () => makeRow(3));
      onChange(fieldPatches({ hasHeaderRow: true, columnCount: 3, rows: initialRows }));
    }
  }, []);

  const patchFields = useCallback(
    (patch: Record<string, unknown>) => {
      onChange(fieldPatches(patch));
    },
    [onChange]
  );

  // Paste handler
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const target = e.target as HTMLElement;
      if (target.isContentEditable) return;

      const html = e.clipboardData.getData("text/html");
      const plain = e.clipboardData.getData("text/plain");

      let parsed = null;
      if (html && html.includes("<table")) {
        parsed = parseHtmlTableAdvanced(html);
      } else if (plain && plain.includes("\t")) {
        parsed = parseTsvTable(plain);
      }

      if (!parsed) return;
      e.preventDefault();

      const block = buildAdvancedTableBlock(parsed);
      onChange(
        fieldPatches({
          hasHeaderRow: block.hasHeaderRow,
          columnCount: block.columnCount,
          rows: block.rows,
        })
      );
    };

    container.addEventListener("paste", handler, { capture: true });
    return () => container.removeEventListener("paste", handler, { capture: true });
  }, [onChange]);

  const handleToggleHeader = useCallback(() => {
    patchFields({ hasHeaderRow: !hasHeaderRow });
  }, [hasHeaderRow, patchFields]);

  const handleAddRow = useCallback(
    (position: "before" | "after") => {
      if (!selection) return;
      const rowIdx = normalizeSelection(selection).startRow;
      patchFields({ rows: addRow(rows, columnCount, position, rowIdx) });
    },
    [rows, columnCount, selection, patchFields]
  );

  const handleDeleteRow = useCallback(() => {
    if (!selection) return;
    const rowIdx = normalizeSelection(selection).startRow;
    patchFields({ rows: deleteRow(rows, rowIdx) });
    setSelection(null);
  }, [rows, selection, patchFields]);

  const handleAddColumn = useCallback(() => {
    const result = addColumn(rows, columnCount);
    patchFields({ rows: result.rows, columnCount: result.columnCount });
  }, [rows, columnCount, patchFields]);

  const handleDeleteColumn = useCallback(() => {
    if (!selection) return;
    const colIdx = normalizeSelection(selection).startCol;
    const result = deleteColumn(rows, columnCount, colIdx);
    patchFields({ rows: result.rows, columnCount: result.columnCount });
    setSelection(null);
  }, [rows, columnCount, selection, patchFields]);

  const handleMerge = useCallback(() => {
    if (!selection) return;
    const newRows = mergeCells(rows, columnCount, selection);
    patchFields({ rows: newRows });
    setSelection(null);
  }, [rows, columnCount, selection, patchFields]);

  const handleUnmerge = useCallback(() => {
    if (!selection) return;
    const s = normalizeSelection(selection);
    const grid = buildOccupancyGrid(rows, columnCount);
    const occ = grid[s.startRow]?.[s.startCol];
    if (!occ) return;
    const newRows = unmergeCells(rows, columnCount, occ.rowIdx, occ.cellIdx);
    patchFields({ rows: newRows });
    setSelection(null);
  }, [rows, columnCount, selection, patchFields]);

  const handleCellContentChange = useCallback(
    (rowIdx: number, cellIdx: number, content: any[]) => {
      const newRows = rows.map((row: any, ri: number) => {
        if (ri !== rowIdx) return row;
        const newCells = row.cells.map((cell: any, ci: number) => {
          if (ci !== cellIdx) return cell;
          return { ...cell, content };
        });
        return { ...row, cells: newCells };
      });
      patchFields({ rows: newRows });
    },
    [rows, patchFields]
  );

  const canMergeSelection =
    selection !== null && canMerge(rows, columnCount, selection);

  let selectedCellIsMerged = false;
  if (selection) {
    const s = normalizeSelection(selection);
    if (s.startRow === s.endRow && s.startCol === s.endCol) {
      const grid = buildOccupancyGrid(rows, columnCount);
      const occ = grid[s.startRow]?.[s.startCol];
      if (occ) {
        const cell = rows[occ.rowIdx]?.cells?.[occ.cellIdx];
        if (cell && ((cell.colspan || 1) > 1 || (cell.rowspan || 1) > 1)) {
          selectedCellIsMerged = true;
        }
      }
    }
  }

  if (rows.length === 0) return null;

  return (
    <Card ref={containerRef} border radius={2}>
      <Stack>
        <TableToolbar
          hasHeaderRow={hasHeaderRow}
          selection={selection}
          canMergeSelection={canMergeSelection}
          selectedCellIsMerged={selectedCellIsMerged}
          rowCount={rows.length}
          columnCount={columnCount}
          onToggleHeader={handleToggleHeader}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onAddColumn={handleAddColumn}
          onDeleteColumn={handleDeleteColumn}
          onMerge={handleMerge}
          onUnmerge={handleUnmerge}
        />
        <TableGrid
          rows={rows}
          columnCount={columnCount}
          hasHeaderRow={hasHeaderRow}
          selection={selection}
          onSelect={setSelection}
          onCellContentChange={handleCellContentChange}
        />
      </Stack>
    </Card>
  );
}
