export function genKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function makeSpan(text: string) {
  return { _type: "span", _key: genKey(), text, marks: [] };
}

export function makeBlock(text: string) {
  return {
    _type: "block",
    _key: genKey(),
    style: "normal",
    children: [makeSpan(text)],
    markDefs: [],
  };
}

export function makeCell(text = ""): any {
  return {
    _type: "advancedTableCell",
    _key: genKey(),
    content: [makeBlock(text)],
    colspan: 1,
    rowspan: 1,
  };
}

export function makeRow(columnCount: number): any {
  return {
    _type: "advancedTableRow",
    _key: genKey(),
    cells: Array.from({ length: columnCount }, () => makeCell()),
  };
}

export interface Selection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

/** Normalized selection with min/max bounds */
export function normalizeSelection(sel: Selection): Selection {
  return {
    startRow: Math.min(sel.startRow, sel.endRow),
    startCol: Math.min(sel.startCol, sel.endCol),
    endRow: Math.max(sel.startRow, sel.endRow),
    endCol: Math.max(sel.startCol, sel.endCol),
  };
}

/**
 * Build an occupancy grid: grid[row][col] = { rowIdx, cellIdx } or null.
 * Each cell with colspan/rowspan fills all covered positions.
 */
export function buildOccupancyGrid(
  rows: any[],
  columnCount: number
): (({ rowIdx: number; cellIdx: number }) | null)[][] {
  const grid: (({ rowIdx: number; cellIdx: number }) | null)[][] = Array.from(
    { length: rows.length },
    () => Array(columnCount).fill(null)
  );

  for (let r = 0; r < rows.length; r++) {
    const cells = rows[r].cells || [];
    let col = 0;
    for (let ci = 0; ci < cells.length; ci++) {
      // Skip occupied positions
      while (col < columnCount && grid[r][col] !== null) col++;
      if (col >= columnCount) break;

      const cs = cells[ci].colspan || 1;
      const rs = cells[ci].rowspan || 1;

      for (let dr = 0; dr < rs && r + dr < rows.length; dr++) {
        for (let dc = 0; dc < cs && col + dc < columnCount; dc++) {
          grid[r + dr][col + dc] = { rowIdx: r, cellIdx: ci };
        }
      }
      col += cs;
    }
  }

  return grid;
}

/** Check if a selection can be merged (rectangular, no partial overlaps) */
export function canMerge(
  rows: any[],
  columnCount: number,
  sel: Selection
): boolean {
  const s = normalizeSelection(sel);
  if (s.startRow === s.endRow && s.startCol === s.endCol) return false;

  const grid = buildOccupancyGrid(rows, columnCount);

  // Ensure every cell within the selection is fully contained
  for (let r = s.startRow; r <= s.endRow; r++) {
    for (let c = s.startCol; c <= s.endCol; c++) {
      const occ = grid[r]?.[c];
      if (!occ) continue;
      const cell = rows[occ.rowIdx]?.cells?.[occ.cellIdx];
      if (!cell) continue;

      // Find the origin position of this cell
      let originCol = 0;
      const originRow = occ.rowIdx;
      const originGrid = grid[originRow];
      for (let cc = 0; cc < columnCount; cc++) {
        if (originGrid[cc]?.rowIdx === occ.rowIdx && originGrid[cc]?.cellIdx === occ.cellIdx) {
          originCol = cc;
          break;
        }
      }

      const cellEndRow = originRow + (cell.rowspan || 1) - 1;
      const cellEndCol = originCol + (cell.colspan || 1) - 1;

      // Cell must be fully inside the selection
      if (
        originRow < s.startRow ||
        originCol < s.startCol ||
        cellEndRow > s.endRow ||
        cellEndCol > s.endCol
      ) {
        return false;
      }
    }
  }
  return true;
}

/** Merge cells in the selection into a single cell */
export function mergeCells(
  rows: any[],
  columnCount: number,
  sel: Selection
): any[] {
  const s = normalizeSelection(sel);
  const grid = buildOccupancyGrid(rows, columnCount);

  // Collect unique cells in the selection
  const seen = new Set<string>();
  const cellsToRemove: { rowIdx: number; cellIdx: number }[] = [];

  for (let r = s.startRow; r <= s.endRow; r++) {
    for (let c = s.startCol; c <= s.endCol; c++) {
      const occ = grid[r]?.[c];
      if (!occ) continue;
      const key = `${occ.rowIdx}:${occ.cellIdx}`;
      if (!seen.has(key)) {
        seen.add(key);
        cellsToRemove.push(occ);
      }
    }
  }

  // The top-left cell in the selection row becomes the merged cell
  const newRows = rows.map((row: any, ri: number) => ({
    ...row,
    cells: [...(row.cells || [])],
  }));

  // Find the top-left cell
  const topLeftOcc = grid[s.startRow]?.[s.startCol];
  if (!topLeftOcc) return rows;

  const mergedCell = {
    ...newRows[topLeftOcc.rowIdx].cells[topLeftOcc.cellIdx],
    colspan: s.endCol - s.startCol + 1,
    rowspan: s.endRow - s.startRow + 1,
  };

  // Remove all cells in selection, then insert merged cell
  // Work backwards to preserve indices
  const removals = cellsToRemove
    .sort((a, b) => b.rowIdx - a.rowIdx || b.cellIdx - a.cellIdx);

  for (const { rowIdx, cellIdx } of removals) {
    newRows[rowIdx].cells.splice(cellIdx, 1);
  }

  // Insert merged cell at the correct position in the top-left row
  const insertIdx = findInsertIndex(newRows[s.startRow].cells, s.startCol, grid, s.startRow, columnCount);
  newRows[s.startRow].cells.splice(insertIdx, 0, mergedCell);

  return newRows;
}

function findInsertIndex(
  cells: any[],
  targetCol: number,
  grid: any[][],
  rowIdx: number,
  columnCount: number
): number {
  // Find where in the cells array this column position maps to
  let col = 0;
  for (let i = 0; i < cells.length; i++) {
    // Skip occupied positions from rowspans above
    while (col < columnCount && grid[rowIdx]?.[col] && grid[rowIdx][col].rowIdx < rowIdx) {
      col++;
    }
    if (col >= targetCol) return i;
    col += cells[i].colspan || 1;
  }
  return cells.length;
}

/** Unmerge a cell back to individual cells */
export function unmergeCells(rows: any[], columnCount: number, rowIdx: number, cellIdx: number): any[] {
  const cell = rows[rowIdx]?.cells?.[cellIdx];
  if (!cell || (cell.colspan <= 1 && cell.rowspan <= 1)) return rows;

  const newRows = rows.map((row: any) => ({
    ...row,
    cells: [...(row.cells || [])],
  }));

  const cs = cell.colspan || 1;
  const rs = cell.rowspan || 1;

  // Replace the merged cell with a single cell (colspan=1, rowspan=1)
  newRows[rowIdx].cells[cellIdx] = { ...cell, colspan: 1, rowspan: 1 };

  // Add empty cells for the remaining positions
  const grid = buildOccupancyGrid(newRows, columnCount);
  for (let r = rowIdx; r < rowIdx + rs && r < newRows.length; r++) {
    for (let c = (r === rowIdx ? 1 : 0); c < cs; c++) {
      const col = getColPosition(grid, rowIdx, cellIdx) + c;
      if (col >= columnCount) continue;
      const insertPos = findInsertIndex(newRows[r].cells, col, grid, r, columnCount);
      newRows[r].cells.splice(insertPos, 0, makeCell());
      // Rebuild grid after each insert
      Object.assign(grid, buildOccupancyGrid(newRows, columnCount));
    }
  }

  return newRows;
}

function getColPosition(grid: any[][], rowIdx: number, cellIdx: number): number {
  for (let c = 0; c < grid[rowIdx].length; c++) {
    if (grid[rowIdx][c]?.rowIdx === rowIdx && grid[rowIdx][c]?.cellIdx === cellIdx) {
      return c;
    }
  }
  return 0;
}

export function addRow(rows: any[], columnCount: number, position: "before" | "after", rowIdx: number): any[] {
  const newRow = makeRow(columnCount);
  const idx = position === "after" ? rowIdx + 1 : rowIdx;
  const newRows = [...rows];
  newRows.splice(idx, 0, newRow);
  return newRows;
}

export function deleteRow(rows: any[], rowIdx: number): any[] {
  if (rows.length <= 1) return rows;
  return rows.filter((_, i) => i !== rowIdx);
}

export function addColumn(rows: any[], columnCount: number): { rows: any[]; columnCount: number } {
  const newRows = rows.map((row: any) => ({
    ...row,
    cells: [...(row.cells || []), makeCell()],
  }));
  return { rows: newRows, columnCount: columnCount + 1 };
}

export function deleteColumn(
  rows: any[],
  columnCount: number,
  colIdx: number
): { rows: any[]; columnCount: number } {
  if (columnCount <= 1) return { rows, columnCount };

  const grid = buildOccupancyGrid(rows, columnCount);
  const newRows = rows.map((row: any, ri: number) => {
    const occ = grid[ri]?.[colIdx];
    if (!occ) return row;

    const cell = row.cells[occ.cellIdx];
    if (!cell) return row;

    // If this cell spans the column, reduce its colspan
    if ((cell.colspan || 1) > 1 && occ.rowIdx === ri) {
      const newCells = [...row.cells];
      newCells[occ.cellIdx] = { ...cell, colspan: cell.colspan - 1 };
      return { ...row, cells: newCells };
    }

    // If this is a single-column cell owned by this row, remove it
    if (occ.rowIdx === ri && (cell.colspan || 1) === 1) {
      const newCells = row.cells.filter((_: any, i: number) => i !== occ.cellIdx);
      return { ...row, cells: newCells };
    }

    return row;
  });

  return { rows: newRows, columnCount: columnCount - 1 };
}
