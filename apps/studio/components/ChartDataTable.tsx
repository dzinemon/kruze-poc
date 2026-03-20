import { set, unset, type StringInputProps } from "sanity";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { AddIcon, TrashIcon } from "@sanity/icons";
import { useCallback, useMemo, useState } from "react";

/**
 * Spreadsheet-like grid editor for the chart `data` field.
 * Parses JSON ↔ 2D array, lets editors add/remove rows/columns and edit cells inline.
 * Auto-detects numbers: if a cell value parses as a finite number, it's stored as number.
 */

type CellValue = string | number;
type Grid = CellValue[][];

function parseGrid(json: string | undefined): Grid {
  if (!json) return [["Category", "Value"], ["", 0]];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length >= 1) return parsed;
  } catch {
    // ignore
  }
  return [["Category", "Value"], ["", 0]];
}

function serializeGrid(grid: Grid): string {
  // Convert cell values: header row stays as strings, data rows auto-detect numbers
  const output = grid.map((row, rowIdx) =>
    row.map((cell) => {
      if (rowIdx === 0) return String(cell);
      if (typeof cell === "number") return cell;
      const trimmed = String(cell).trim();
      if (trimmed === "") return 0;
      const num = Number(trimmed);
      return Number.isFinite(num) ? num : trimmed;
    }),
  );
  return JSON.stringify(output);
}

export function ChartDataTable(props: StringInputProps) {
  const { value, onChange } = props;
  const [showRaw, setShowRaw] = useState(false);

  const grid = useMemo(() => parseGrid(value), [value]);

  const cols = grid[0]?.length ?? 0;

  const updateGrid = useCallback(
    (next: Grid) => {
      const json = serializeGrid(next);
      onChange(json ? set(json) : unset());
    },
    [onChange],
  );

  const updateCell = useCallback(
    (row: number, col: number, val: string) => {
      const next = grid.map((r) => [...r]);
      next[row][col] = val;
      updateGrid(next);
    },
    [grid, updateGrid],
  );

  const addRow = useCallback(() => {
    const newRow = Array(cols).fill("") as CellValue[];
    updateGrid([...grid, newRow]);
  }, [grid, cols, updateGrid]);

  const removeRow = useCallback(
    (idx: number) => {
      if (grid.length <= 2) return; // keep at least header + 1 data row
      updateGrid(grid.filter((_, i) => i !== idx));
    },
    [grid, updateGrid],
  );

  const addColumn = useCallback(() => {
    updateGrid(
      grid.map((row, i) => [...row, i === 0 ? `Column ${cols + 1}` : ""]),
    );
  }, [grid, cols, updateGrid]);

  const removeColumn = useCallback(
    (colIdx: number) => {
      if (cols <= 1) return;
      updateGrid(grid.map((row) => row.filter((_, i) => i !== colIdx)));
    },
    [grid, cols, updateGrid],
  );

  if (showRaw) {
    return (
      <Stack space={3}>
        <Flex justify="flex-end">
          <Button
            text="Grid View"
            mode="ghost"
            fontSize={1}
            onClick={() => setShowRaw(false)}
          />
        </Flex>
        <Card padding={3} border radius={2}>
          <textarea
            value={value ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v ? set(v) : unset());
            }}
            rows={12}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: 13,
              border: "none",
              outline: "none",
              resize: "vertical",
              background: "transparent",
              color: "inherit",
            }}
          />
        </Card>
      </Stack>
    );
  }

  return (
    <Stack space={3}>
      <Flex justify="flex-end" gap={2}>
        <Button
          text="Raw JSON"
          mode="ghost"
          fontSize={1}
          onClick={() => setShowRaw(true)}
        />
      </Flex>

      <Card border radius={2} style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {grid[0]?.map((cell, colIdx) => (
                <th
                  key={colIdx}
                  style={{
                    padding: "6px 8px",
                    borderBottom: "2px solid var(--card-border-color)",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  <input
                    value={String(cell)}
                    onChange={(e) => updateCell(0, colIdx, e.target.value)}
                    style={{
                      width: "100%",
                      minWidth: 80,
                      border: "none",
                      outline: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      background: "transparent",
                      color: "inherit",
                      padding: "2px 0",
                    }}
                  />
                  {cols > 1 && (
                    <button
                      onClick={() => removeColumn(colIdx)}
                      title="Remove column"
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.4,
                        fontSize: 10,
                        color: "inherit",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </th>
              ))}
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {grid.slice(1).map((row, rowOffset) => {
              const rowIdx = rowOffset + 1;
              return (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid var(--card-border-color)",
                      }}
                    >
                      <input
                        value={String(cell)}
                        onChange={(e) =>
                          updateCell(rowIdx, colIdx, e.target.value)
                        }
                        style={{
                          width: "100%",
                          minWidth: 80,
                          border: "none",
                          outline: "none",
                          fontSize: 13,
                          background: "transparent",
                          color: "inherit",
                          padding: "2px 0",
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ width: 32, textAlign: "center" }}>
                    {grid.length > 2 && (
                      <Button
                        icon={TrashIcon}
                        mode="bleed"
                        tone="critical"
                        fontSize={0}
                        padding={1}
                        onClick={() => removeRow(rowIdx)}
                        title="Remove row"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Flex gap={2}>
        <Button
          icon={AddIcon}
          text="Add Row"
          mode="ghost"
          fontSize={1}
          onClick={addRow}
        />
        <Button
          icon={AddIcon}
          text="Add Column"
          mode="ghost"
          fontSize={1}
          onClick={addColumn}
        />
      </Flex>

      <Text size={0} muted>
        Header row defines column names. Data cells auto-detect numbers.
      </Text>
    </Stack>
  );
}
