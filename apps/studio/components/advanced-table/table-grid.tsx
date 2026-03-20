import { useCallback, useRef, useState } from "react";
import { buildOccupancyGrid, type Selection } from "./table-utils";
import { TableCellEditor } from "./table-cell-editor";
import {
  CellFormattingToolbar,
  type SelectionInfo,
} from "./cell-formatting-toolbar";
import { LinkPopover } from "./link-popover";

interface TableGridProps {
  rows: any[];
  columnCount: number;
  hasHeaderRow: boolean;
  selection: Selection | null;
  onSelect: (sel: Selection | null) => void;
  onCellContentChange: (
    rowIdx: number,
    cellIdx: number,
    content: any[]
  ) => void;
}

export function TableGrid({
  rows,
  columnCount,
  hasHeaderRow,
  selection,
  onSelect,
  onCellContentChange,
}: TableGridProps) {
  const grid = buildOccupancyGrid(rows, columnCount);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo | null>(
    null
  );
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  // Save the selection range before opening the link popover
  const savedRange = useRef<Range | null>(null);

  const handleCellClick = useCallback(
    (rowIdx: number, colIdx: number, e: React.MouseEvent) => {
      if (e.shiftKey && selection) {
        onSelect({
          startRow: selection.startRow,
          startCol: selection.startCol,
          endRow: rowIdx,
          endCol: colIdx,
        });
      } else {
        onSelect({
          startRow: rowIdx,
          startCol: colIdx,
          endRow: rowIdx,
          endCol: colIdx,
        });
      }
    },
    [selection, onSelect]
  );

  const isCellSelected = useCallback(
    (rowIdx: number, colIdx: number): boolean => {
      if (!selection) return false;
      const minR = Math.min(selection.startRow, selection.endRow);
      const maxR = Math.max(selection.startRow, selection.endRow);
      const minC = Math.min(selection.startCol, selection.endCol);
      const maxC = Math.max(selection.startCol, selection.endCol);
      return (
        rowIdx >= minR && rowIdx <= maxR && colIdx >= minC && colIdx <= maxC
      );
    },
    [selection]
  );

  const handleToggleLink = useCallback(() => {
    // Save current selection before popover steals focus
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
    setShowLinkPopover(true);
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
  }, []);

  const handleLinkConfirm = useCallback(
    (url: string) => {
      restoreSelection();
      document.execCommand("createLink", false, url);
      setShowLinkPopover(false);
      savedRange.current = null;
    },
    [restoreSelection]
  );

  const handleLinkRemove = useCallback(() => {
    restoreSelection();
    document.execCommand("unlink", false);
    setShowLinkPopover(false);
    savedRange.current = null;
  }, [restoreSelection]);

  const handleLinkClose = useCallback(() => {
    restoreSelection();
    setShowLinkPopover(false);
    savedRange.current = null;
  }, [restoreSelection]);

  // Use linkUrl from selectionInfo (set by cell click handler) instead of
  // fragile window.getSelection() lookup at render time
  const currentLinkUrl = selectionInfo?.linkUrl ?? "";

  const containerRect = containerRef.current?.getBoundingClientRect() ?? null;

  return (
    <div
      ref={containerRef}
      data-table-grid
      style={{
        overflowX: "auto",
        border: "1px solid var(--card-border-color)",
        borderRadius: 4,
        position: "relative",
      }}
    >
      <style>{`
        .table-cell-editable a {
          color: var(--card-link-color, #2563eb);
          text-decoration: underline;
          cursor: pointer;
        }
        .table-cell-editable a:hover {
          color: var(--card-link-color, #1d4ed8);
        }
      `}</style>
      {selectionInfo && !showLinkPopover && (
        <CellFormattingToolbar
          info={selectionInfo}
          containerRect={containerRect}
          onToggleLink={handleToggleLink}
        />
      )}
      {showLinkPopover && selectionInfo && containerRect && (
        <LinkPopover
          initialUrl={currentLinkUrl}
          position={{
            top: selectionInfo.rect.top - containerRect.top - 36,
            left:
              selectionInfo.rect.left -
              containerRect.left +
              selectionInfo.rect.width / 2 -
              150,
          }}
          onConfirm={handleLinkConfirm}
          onRemove={handleLinkRemove}
          onClose={handleLinkClose}
        />
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          {rows.map((row, rowIdx) => {
            const renderedCols = new Set<number>();

            return (
              <tr key={row._key}>
                {(row.cells || []).map((cell: any, cellIdx: number) => {
                  let colIdx = 0;
                  for (let c = 0; c < columnCount; c++) {
                    const occ = grid[rowIdx]?.[c];
                    if (
                      occ &&
                      occ.rowIdx === rowIdx &&
                      occ.cellIdx === cellIdx &&
                      !renderedCols.has(c)
                    ) {
                      colIdx = c;
                      break;
                    }
                  }

                  const cs = cell.colspan || 1;
                  for (let dc = 0; dc < cs; dc++) {
                    renderedCols.add(colIdx + dc);
                  }

                  const isHeader = hasHeaderRow && rowIdx === 0;
                  const selected = isCellSelected(rowIdx, colIdx);

                  return (
                    <TableCellEditor
                      key={cell._key}
                      cell={cell}
                      isHeader={isHeader}
                      isSelected={selected}
                      onClick={(e) => handleCellClick(rowIdx, colIdx, e)}
                      onContentChange={(content) =>
                        onCellContentChange(rowIdx, cellIdx, content)
                      }
                      onSelectionInfo={setSelectionInfo}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
